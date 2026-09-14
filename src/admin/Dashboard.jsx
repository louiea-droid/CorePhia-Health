import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { deriveMetrics } from "./analytics"
import { BarList, Card, ColumnChart, MiniStat, StackedBar, StatTile } from "./charts"
import PageHeader from "./PageHeader"
import PatientModal from "./PatientModal"
import PatientsTable from "./PatientsTable"
import { DashboardSkeleton } from "./Skeleton"
import { TEMP_FAKE_RECORDS } from "./tempFakeRecords"
import { useIntakeRecords } from "./useIntakeRecords"

export default function Dashboard() {
  const { records, error } = useIntakeRecords()
  const [selectedRecord, setSelectedRecord] = useState(null)

  // See tempFakeRecords.js — same real-but-empty fallback Patients.jsx uses,
  // so the charts here have something to render instead of sitting at zero.
  const baseRecords = records && records.length === 0 ? TEMP_FAKE_RECORDS : records
  const metrics = useMemo(() => (baseRecords ? deriveMetrics(baseRecords) : null), [baseRecords])

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
              <BarList data={metrics.reasons} total={metrics.total} />
            </Card>
            <Card title="Current exercise" hint={`${metrics.total} intakes`}>
              <BarList data={metrics.exercise} total={metrics.total} />
            </Card>
            <Card title="Tobacco use" hint={`${metrics.total} intakes`}>
              <BarList data={metrics.tobacco} total={metrics.total} />
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Conditions patients reported" hint="Patients may report more than one">
              <BarList data={metrics.conditions} total={metrics.total} emptyLabel="No conditions reported yet" />
            </Card>
            <Card title="Family history reported" hint="Patients may report more than one">
              <BarList
                data={metrics.familyHistory}
                total={metrics.total}
                emptyLabel="No family history reported yet"
              />
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Where patients are" hint="By state on the intake address">
              <BarList data={metrics.states} total={metrics.total} />
            </Card>
            <Card title="Patient weight snapshot" hint="Self-reported at intake">
              <div className="grid grid-cols-3 gap-4">
                <MiniStat label="Avg current" value={metrics.avgCurrentWeight ?? "—"} unit="lb" />
                <MiniStat label="Avg goal" value={metrics.avgGoalWeight ?? "—"} unit="lb" />
                <MiniStat label="Avg intended loss" value={metrics.avgTargetLoss ?? "—"} unit="lb" />
              </div>
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

      <PatientModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  )
}
