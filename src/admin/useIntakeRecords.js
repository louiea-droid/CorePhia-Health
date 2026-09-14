import { useEffect, useState } from "react"
import { loadIntakeRecords } from "./firebase"

// Shared by Dashboard and Patients so each owns its own fetch rather than
// threading records through a context — fine at this scale (a two-person
// admin team, well under a thousand records); revisit if that changes.
export function useIntakeRecords() {
  const [records, setRecords] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    loadIntakeRecords()
      .then((result) => active && setRecords(result))
      .catch((cause) => active && setError(cause.message))
    return () => {
      active = false
    }
  }, [])

  return { records, error }
}
