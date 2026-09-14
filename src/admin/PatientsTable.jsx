function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// Shared by Dashboard's "Most recent intakes" preview and the full Patients
// list — same columns, same whole-row click target opening PatientModal.
//
// table-layout: fixed + explicit <col> widths (rather than the browser's
// default content-based auto layout) so columns land in the same place on
// every page regardless of how wide that page's actual text happens to be —
// auto layout visibly reflowed columns between a page full of "Core
// Complete" and one mostly "Core".
//
// minRows pads the body with blank filler rows (four separate <td>s, not one
// colSpan cell — a colSpan cell doesn't participate in per-column sizing the
// same way, which was its own source of column drift) up to that count when
// there are fewer real records — e.g. a short last page. Filler rows reuse
// the exact same <td className="py-4"> markup as real ones, so the browser
// renders them at an identical height with zero pixel math on our end.
export default function PatientsTable({ records, onSelect, minRows = 0 }) {
  const fillerRowCount = Math.max(0, minRows - records.length)

  return (
    <div className="scrollbar-thin -mx-4 overflow-x-auto px-4">
      <table className="w-full min-w-xl table-fixed text-left text-sm">
        <colgroup>
          <col className="w-[26%]" />
          <col className="w-[18%]" />
          <col className="w-[18%]" />
          <col className="w-[38%]" />
        </colgroup>
        <thead>
          <tr className="sticky top-0 z-10 border-b border-ink-950/10 bg-white text-xs tracking-wide text-ink-950/45 uppercase">
            <th scope="col" className="pb-2 font-medium">
              Patient
            </th>
            <th scope="col" className="pb-2 font-medium">
              Submitted
            </th>
            <th scope="col" className="pb-2 font-medium">
              Plan
            </th>
            <th scope="col" className="pb-2 font-medium">
              Reason
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-950/5">
          {records.map((record) => {
            const name = `${record.demographics?.firstName ?? ""} ${record.demographics?.lastName ?? ""}`.trim()
            return (
              <tr
                key={record.id}
                onClick={() => onSelect(record)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onSelect(record)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View intake details for ${name || "this patient"}`}
                className="cursor-pointer outline-none transition-colors duration-150 hover:bg-paper-50 focus-visible:bg-paper-100"
              >
                <td className="truncate py-4 font-medium text-ink-950">{name || "—"}</td>
                <td className="truncate py-4 whitespace-nowrap text-ink-950/60">
                  {formatDate(record.submittedAt)}
                </td>
                <td className="truncate py-4 text-ink-950/60">{record.visit?.membershipPlan || "—"}</td>
                <td className="truncate py-4 text-ink-950/60">{record.visit?.reason || "—"}</td>
              </tr>
            )
          })}
          {Array.from({ length: fillerRowCount }).map((_, index) => (
            <tr key={`filler-${index}`} aria-hidden="true">
              <td className="py-4">&nbsp;</td>
              <td className="py-4" />
              <td className="py-4" />
              <td className="py-4" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
