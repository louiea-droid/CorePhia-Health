import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { deriveMetrics } from "./analytics"
import { BarList, Card, ColumnChart, StackedBar, StatTile } from "./charts"
import PageHeader from "./PageHeader"
import PatientListModal from "./PatientListModal"
import PatientModal from "./PatientModal"
import PatientsTable from "./PatientsTable"
import { DashboardSkeleton } from "./Skeleton"
import { TEMP_FAKE_RECORDS } from "./tempFakeRecords"
import { useIntakeRecords } from "./useIntakeRecords"

export default function Dashboard() {
  const { records, error } = useIntakeRecords()
  const [selectedRecord, setSelectedRecord] = useState(null)
  // Which BarList row a patient list is currently drilled into: title/
  // description for the modal header, plus the predicate that finds the
  // matching records. A function rather than a {field, label} pair because
  // the cards don't all filter the same way — multi-select conditions need
  // an array .includes, single-select fields need ===, and the weight
  // histogram needs a numeric range — so each card just supplies the check
  // that's actually correct for its own data instead of the drilldown trying
  // to guess it from a shared shape.
  const [drilldown, setDrilldown] = useState(null)

  // See tempFakeRecords.js — same real-but-empty fallback Patients.jsx uses,
  // so the charts here have something to render instead of sitting at zero.
  const baseRecords = records && records.length === 0 ? TEMP_FAKE_RECORDS : records
  const metrics = useMemo(() => (baseRecords ? deriveMetrics(baseRecords) : null), [baseRecords])

  const drilldownMatches = useMemo(() => {
    if (!drilldown || !baseRecords) return []
    return baseRecords.filter(drilldown.match)
  }, [baseRecords, drilldown])

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="What patients reported on the intake form, across every submission."
      />

      {error ? (
        <div className="rounded-2xl border border-ink-950/10 bg-white p-6">
          <h2 className="font-semibold text-ink-950">Could not load intake records</h2>
          <p className="mt-2 text-sm text-ink-950/60">{error}</p>
        </div>
      ) : !metrics ? (
        <DashboardSkeleton />
      ) : !metrics.total ? (
        <div className="rounded-2xl border border-ink-950/10 bg-white p-8 text-center">
          <h2 className="font-serif text-2xl text-ink-950">No intakes yet</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-950/60">
            Completed patient intake forms will appear here, with a breakdown of what patients reported.
          </p>
        </div>
      ) : (
        // overflow-x-clip so the hover tooltips, which are absolutely positioned
        // and can sit past a card's edge, never widen the page on a narrow screen.
        <div className="space-y-4 overflow-x-clip">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Total intakes" value={metrics.total} caption="All forms submitted to date" />
            <StatTile label="Last 7 days" value={metrics.last7} caption="New patient intakes this week" />
            <StatTile label="Last 30 days" value={metrics.last30} caption="New patient intakes this month" />
            <StatTile
              label="Consent complete"
              value={metrics.consentCompleteRate}
              unit="%"
              caption="Telehealth + HIPAA acknowledged"
            />
          </div>

          {/* Three across rather than continuing the row of four above: seven
              tiles in a four-column grid would leave one orphaned empty cell,
              and these three read as their own group anyway. */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatTile
              label="Avg current weight"
              value={metrics.avgCurrentWeight ?? "—"}
              unit="lb"
              caption="Self-reported at intake"
            />
            <StatTile
              label="Avg goal weight"
              value={metrics.avgGoalWeight ?? "—"}
              unit="lb"
              caption="What patients are aiming for"
            />
            <StatTile
              label="Avg intended loss"
              value={metrics.avgTargetLoss ?? "—"}
              unit="lb"
              caption="Current minus goal weight"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Intakes submitted per week" hint="Last 10 weeks" className="lg:col-span-2">
              <ColumnChart data={metrics.weekly} />
            </Card>
            <Card title="Membership plan requested" hint={`${metrics.total} intakes`}>
              <StackedBar data={metrics.plans} total={metrics.total} />
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Reason for the visit" hint={`${metrics.total} intakes`}>
              <BarList
                data={metrics.reasons}
                total={metrics.total}
                onSelect={(item) =>
                  setDrilldown({
                    title: item.label,
                    description: "Reason for visit",
                    match: (record) => record.visit?.reason === item.label,
                  })
                }
              />
            </Card>
            <Card title="Current exercise" hint={`${metrics.total} intakes`}>
              <BarList
                data={metrics.exercise}
                total={metrics.total}
                onSelect={(item) =>
                  setDrilldown({
                    title: item.label,
                    description: "Current exercise",
                    match: (record) => record.socialHistory?.exerciseFrequency === item.label,
                  })
                }
              />
            </Card>
            <Card title="Tobacco use" hint={`${metrics.total} intakes`}>
              <BarList
                data={metrics.tobacco}
                total={metrics.total}
                onSelect={(item) =>
                  setDrilldown({
                    title: item.label,
                    description: "Tobacco use",
                    match: (record) => record.socialHistory?.tobacco === item.label,
                  })
                }
              />
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Conditions patients reported" hint="Patients may report more than one">
              <BarList
                data={metrics.conditions}
                total={metrics.total}
                emptyLabel="No conditions reported yet"
                onSelect={(item) =>
                  setDrilldown({
                    title: item.label,
                    description: "Condition reported",
                    match: (record) => (record.medicalHistory?.conditions ?? []).includes(item.label),
                  })
                }
              />
            </Card>
            <Card title="Family history reported" hint="Patients may report more than one">
              <BarList
                data={metrics.familyHistory}
                total={metrics.total}
                emptyLabel="No family history reported yet"
                onSelect={(item) =>
                  setDrilldown({
                    title: item.label,
                    description: "Family history reported",
                    match: (record) => (record.familyHistory?.conditions ?? []).includes(item.label),
                  })
                }
              />
            </Card>
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-2">
            <Card title="Where patients are" hint="By state on the intake address">
              <BarList
                data={metrics.states}
                total={metrics.total}
                onSelect={(item) =>
                  setDrilldown({
                    title: item.label,
                    description: "State on the intake address",
                    match: (record) => record.demographics?.address?.state === item.label,
                  })
                }
              />
            </Card>
            <Card title="Current weight spread" hint="Self-reported at intake">
              <BarList
                data={metrics.currentWeightBands}
                total={metrics.total}
                emptyLabel="No weights reported yet"
                onSelect={(item) =>
                  setDrilldown({
                    title: item.label,
                    description: "Current weight",
                    match: (record) => {
                      const weight = Number(record.vitals?.currentWeightLb)
                      return Number.isFinite(weight) && weight >= item.min && weight < item.max
                    },
                  })
                }
              />
            </Card>
          </div>

          <Card
            title="Most recent intakes"
            hint={
              <Link to="/admin/patients" className="font-medium text-accent-dark hover:opacity-70">
                See all patients →
              </Link>
            }
          >
            <PatientsTable records={baseRecords.slice(0, 8)} onSelect={setSelectedRecord} />
          </Card>
        </div>
      )}

      <PatientListModal
        title={drilldown?.title}
        subtitle={
          drilldown &&
          `${drilldownMatches.length} patient${drilldownMatches.length === 1 ? "" : "s"} · ${drilldown.description}`
        }
        records={drilldownMatches}
        onSelectPatient={(record) => {
          setDrilldown(null)
          setSelectedRecord(record)
        }}
        onClose={() => setDrilldown(null)}
      />

      <PatientModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  )
}
