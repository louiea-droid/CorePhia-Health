const DAY = 86400000

function tally(values) {
  const counts = new Map()
  for (const value of values) {
    if (!value) continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
}

// Keeps a fixed sequence rather than sorting by count. Required wherever a
// colour is tied to a series (a rank sort would repaint the plans as their
// counts change) and for ordered scales, where magnitude order scrambles the
// scale's own meaning.
function tallyInOrder(values, order) {
  const counts = new Map(order.map((label) => [label, 0]))
  for (const value of values) {
    if (counts.has(value)) counts.set(value, counts.get(value) + 1)
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .filter((item) => item.value > 0)
}

const PLAN_ORDER = ["Core", "Core+", "Core Complete"]
const EXERCISE_ORDER = [
  "None right now",
  "1-2 days per week",
  "3-4 days per week",
  "5 or more days per week",
]

function countSince(records, days) {
  const cutoff = Date.now() - days * DAY
  return records.filter((record) => Date.parse(record.submittedAt) >= cutoff).length
}

function average(numbers) {
  const usable = numbers.filter((value) => Number.isFinite(value) && value > 0)
  if (!usable.length) return null
  return Math.round(usable.reduce((total, value) => total + value, 0) / usable.length)
}

// Monday-anchored week buckets, oldest first, including weeks with no intakes so
// a quiet week reads as a gap rather than being silently dropped.
function weeklyCounts(records, weeks) {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7))

  const buckets = []
  for (let offset = weeks - 1; offset >= 0; offset -= 1) {
    const start = new Date(startOfWeek)
    start.setDate(start.getDate() - offset * 7)
    const end = new Date(start)
    end.setDate(end.getDate() + 7)
    buckets.push({
      label: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: records.filter((record) => {
        const at = Date.parse(record.submittedAt)
        return at >= start.getTime() && at < end.getTime()
      }).length,
    })
  }
  return buckets
}

export function deriveMetrics(records) {
  const total = records.length
  const consentComplete = records.filter(
    (record) => record.consent?.telehealth && record.consent?.hipaaAcknowledged,
  ).length

  const currentWeights = records.map((record) => Number(record.vitals?.currentWeightLb))
  const goalWeights = records.map((record) => Number(record.vitals?.goalWeightLb))
  const targetLosses = records
    .map((record) => Number(record.vitals?.currentWeightLb) - Number(record.vitals?.goalWeightLb))
    .filter((value) => Number.isFinite(value) && value > 0)

  return {
    total,
    last7: countSince(records, 7),
    last30: countSince(records, 30),
    consentCompleteRate: total ? Math.round((consentComplete / total) * 100) : 0,
    avgCurrentWeight: average(currentWeights),
    avgGoalWeight: average(goalWeights),
    avgTargetLoss: average(targetLosses),
    weekly: weeklyCounts(records, 10),
    plans: tallyInOrder(
      records.map((record) => record.visit?.membershipPlan),
      PLAN_ORDER,
    ),
    reasons: tally(records.map((record) => record.visit?.reason)),
    conditions: tally(
      records.flatMap((record) =>
        (record.medicalHistory?.conditions ?? []).filter((item) => item !== "None of the above"),
      ),
    ),
    familyHistory: tally(
      records.flatMap((record) =>
        (record.familyHistory?.conditions ?? []).filter((item) => item !== "None of the above"),
      ),
    ),
    exercise: tallyInOrder(
      records.map((record) => record.socialHistory?.exerciseFrequency),
      EXERCISE_ORDER,
    ),
    tobacco: tally(records.map((record) => record.socialHistory?.tobacco)),
    states: tally(records.map((record) => record.demographics?.address?.state)),
  }
}
