// Categorical slots 1-3 of the validated data-viz palette. Hardcoded on purpose:
// they were checked for colour-vision separation against the white card surface
// as a set, so they are not interchangeable with the site's @theme tokens.
// Single-hue magnitude bars use accent-dark and do follow the tokens.
const SERIES = ["#2a78d6", "#eb6834", "#1baf7a"]

export function Card({ title, hint, children, className = "" }) {
  const hasHeader = Boolean(title || hint)
  return (
    <section className={`rounded-2xl border border-ink-950/10 bg-white p-4 ${className}`}>
      {hasHeader && (
        <div className="flex items-baseline justify-between gap-3">
          {title && <h2 className="text-sm font-semibold text-ink-950">{title}</h2>}
          {hint && <span className="text-xs text-ink-950/45">{hint}</span>}
        </div>
      )}
      <div className={hasHeader ? "mt-3" : ""}>{children}</div>
    </section>
  )
}

export function StatTile({ label, value, unit, caption }) {
  return (
    <div className="rounded-2xl border border-ink-950/10 bg-white p-4">
      <p className="text-xs font-medium tracking-wide text-ink-950/50 uppercase">{label}</p>
      <p className="mt-1.5 text-2xl leading-none font-semibold text-ink-950">
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-ink-950/50">{unit}</span>}
      </p>
      {caption && <p className="mt-1.5 text-xs text-ink-950/45">{caption}</p>}
    </div>
  )
}

// Horizontal magnitude bars: one hue, length carries the value, every row
// direct-labelled so identity never depends on colour.
export function BarList({ data, total, emptyLabel = "No data yet", onSelect }) {
  if (!data.length) return <p className="py-6 text-sm text-ink-950/45">{emptyLabel}</p>

  const max = Math.max(...data.map((item) => item.value))

  return (
    <ul className="space-y-2">
      {data.map((item) => {
        const share = total ? Math.round((item.value / total) * 100) : 0
        // Only rows a caller actually wired up (onSelect) become clickable —
        // e.g. "which patients reported this condition" makes sense for
        // Conditions/Family history, not for a plain per-week count.
        const interactiveProps = onSelect
          ? {
              onClick: () => onSelect(item),
              onKeyDown: (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  onSelect(item)
                }
              },
              tabIndex: 0,
              role: "button",
              "aria-label": `See patients who reported ${item.label}`,
            }
          : {}
        return (
          <li
            key={item.label}
            {...interactiveProps}
            className={`group relative ${
              onSelect
                ? "-mx-2 cursor-pointer rounded-lg px-2 py-1 outline-none transition-colors duration-150 hover:bg-paper-100 focus-visible:bg-paper-100"
                : ""
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-sm text-ink-950/80">{item.label}</span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-ink-950">{item.value}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-xs bg-paper-100">
              <div
                className="h-1.5 rounded-r-sm bg-accent-dark transition-[width] duration-500 ease-out-smooth"
                style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
              />
            </div>
            <span className="pointer-events-none absolute -top-1 right-0 z-10 rounded-lg bg-ink-950 px-2 py-1 text-xs whitespace-nowrap text-paper-50 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              {item.value} of {total} · {share}%
            </span>
          </li>
        )
      })}
    </ul>
  )
}

// Weekly submission counts. Columns rather than a line because each bar is a
// discrete per-week total, not a continuous measure.
export function ColumnChart({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1)

  return (
    <div>
      {/* items-stretch (not items-end) so each column fills the row height —
          the bars' percentage heights resolve against it. */}
      <div className="flex h-40 items-stretch gap-1.5 border-b border-ink-950/10">
        {data.map((item) => (
          <div key={item.label} className="group relative flex flex-1 flex-col items-center justify-end">
            <span className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-ink-950 px-2 py-1 text-xs whitespace-nowrap text-paper-50 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              {item.value} · {item.label}
            </span>
            {item.value > 0 && (
              <span className="mb-1 text-xs font-semibold tabular-nums text-ink-950/70">{item.value}</span>
            )}
            <div
              className="w-full rounded-t-sm bg-accent-dark transition-[height] duration-500 ease-out-smooth"
              // Capped below 100% to leave room for the value label above the bar.
              style={{ height: `${(item.value / max) * 88}%`, minHeight: item.value > 0 ? "3px" : "0" }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5">
        {data.map((item) => (
          <span key={item.label} className="flex-1 text-center text-[10px] text-ink-950/40">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// Part-to-whole across a handful of named series: the one place categorical
// colour earns its place. Legend carries swatch + label + value.
export function StackedBar({ data, total }) {
  if (!data.length) return <p className="py-6 text-sm text-ink-950/45">No data yet</p>

  return (
    <div>
      <div className="flex h-3 gap-0.5 overflow-hidden">
        {data.map((item, index) => (
          <div
            key={item.label}
            title={`${item.label}: ${item.value}`}
            className="h-3 first:rounded-l-sm last:rounded-r-sm"
            style={{
              width: `${(item.value / total) * 100}%`,
              backgroundColor: SERIES[index % SERIES.length],
            }}
          />
        ))}
      </div>
      <ul className="mt-3 space-y-2">
        {data.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: SERIES[index % SERIES.length] }}
            />
            <span className="flex-1 truncate text-ink-950/80">{item.label}</span>
            <span className="font-semibold tabular-nums text-ink-950">{item.value}</span>
            <span className="w-10 text-right text-xs tabular-nums text-ink-950/45">
              {Math.round((item.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
