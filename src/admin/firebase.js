import { initializeApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query } from "firebase/firestore"

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const INTAKE_COLLECTION = "intakeRecords"
export const USERS_COLLECTION = "user"

export const isConfigured = Boolean(config.apiKey && config.projectId)

// Demo mode exists so the dashboard can be reviewed before a BAA is signed and
// real records exist. import.meta.env.DEV is replaced with `false` at build
// time, so a production bundle cannot reach the seeded branch — the dashboard
// there is unreachable without a real signed-in Firebase user.
export const usingSeedData = import.meta.env.DEV && !isConfigured

const app = isConfigured ? initializeApp(config) : null
const auth = app ? getAuth(app) : null
const db = app ? getFirestore(app) : null

export function watchAdminUser(onChange) {
  if (!auth) {
    onChange(null)
    return () => {}
  }
  return onAuthStateChanged(auth, onChange)
}

export async function signInAdmin(email, password) {
  if (!auth) throw new Error("Firebase is not configured.")
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function signOutAdmin() {
  if (auth) await signOut(auth)
}

export async function resetAdminPassword(email) {
  if (!auth) throw new Error("Firebase is not configured.")
  await sendPasswordResetEmail(auth, email)
}

// The tier comes from a role document at user/{uid}, assigned by hand in
// the Firestore Console — never from anything the browser can choose. This
// decides what the sidebar shows; firestore.rules enforces the same lookup
// independently (and only lets a person read their own document), so a
// tampered client gains nothing. A missing document, a missing db, or a
// denied read (no document = no role assigned) all resolve the same way:
// no access, not a thrown error.
export async function getAdminRole(user) {
  if (!user || !db) return null
  try {
    const snapshot = await getDoc(doc(db, USERS_COLLECTION, user.uid))
    if (!snapshot.exists()) {
      console.warn(`No ${USERS_COLLECTION}/${user.uid} document — this account has no role assigned yet.`)
      return null
    }
    const role = snapshot.data()?.role
    if (role !== "superAdmin" && role !== "admin") {
      console.warn(`${USERS_COLLECTION}/${user.uid} exists but its role field is`, JSON.stringify(role))
    }
    return role === "superAdmin" || role === "admin" ? role : null
  } catch (cause) {
    // Most often permission-denied — the doc ID doesn't match this user's
    // uid (rules only allow reading your own), or the rules deploy hasn't
    // taken effect yet.
    console.error(`Role lookup for ${USERS_COLLECTION}/${user.uid} failed:`, cause.code ?? cause.message)
    return null
  }
}

export async function loadIntakeRecords() {
  // Imported dynamically so the sample records are not bundled into a
  // production build, where this branch is unreachable anyway.
  if (usingSeedData) {
    const { seedRecords } = await import("./seedRecords")
    return seedRecords
  }
  if (!db) throw new Error("Firebase is not configured.")
  const snapshot = await getDocs(query(collection(db, INTAKE_COLLECTION), orderBy("submittedAt", "desc")))
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }))
}
