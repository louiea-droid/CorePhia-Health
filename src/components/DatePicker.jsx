import { useEffect, useRef, useState } from "react"
import { CalendarIcon, ChevronDownIcon } from "./icons"

const triggerClass =
  "flex w-full items-center justify-between gap-2 rounded-2xl border border-ink-950/15 bg-paper-50 px-4 py-3.5 text-left text-ink-950 outline-none transition-colors duration-200 ease-out-smooth focus:border-ink-950/40"

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTH_LABELS = Array.from({ length: 12 }, (_, index) =>
  new Date(2000, index, 1).toLocaleDateString("en-US", { month: "short" }),
)
const YEARS_PER_PAGE = 12

function toIso(date) {
  return date.toISOString().slice(0, 10)
}

function fromIso(value) {
  if (!value) return null
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function formatDisplay(value) {
  const date = fromIso(value)
  if (!date) return null
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function yearBlockStartFor(year) {
  return year - (((year % YEARS_PER_PAGE) + YEARS_PER_PAGE) % YEARS_PER_PAGE)
}

// 6 rows of 7 so the grid height never changes between months, even ones
// that only need 4-5 rows — otherwise the popup resizes every time someone
// flips a month, which reads as a layout jump rather than a calendar.
function buildGrid(viewDate) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const start = new Date(year, month, 1 - firstOfMonth.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

// A cell shared by the month and year grids — same chip shape, same
// selected/today treatment as the day grid, just wider since "Sep" and
// "2026" don't fit a circle the way a day number does.
function GridCell({ label, selected, isNow, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl py-2 text-sm transition-colors duration-150 ease-out-smooth ${
        selected ? "bg-accent-dark font-semibold text-paper-50" : "text-ink-950 hover:bg-paper-100"
      } ${isNow && !selected ? "ring-1 ring-accent-dark/50" : ""}`}
    >
      {label}
    </button>
  )
}

export default function DatePicker({ name, defaultValue = "", required = false, min }) {
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState("days") // "days" | "months" | "years"
  const [viewDate, setViewDate] = useState(() => fromIso(defaultValue) ?? new Date())
  const [yearBlockStart, setYearBlockStart] = useState(() => yearBlockStartFor(viewDate.getFullYear()))
  const rootRef = useRef(null)
  const minDate = min ? fromIso(min) : null
  const today = new Date()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const changeMonth = (delta) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  }

  const changeYear = (delta) => {
    setViewDate((current) => new Date(current.getFullYear() + delta, current.getMonth(), 1))
  }

  const openYears = () => {
    setYearBlockStart(yearBlockStartFor(viewDate.getFullYear()))
    setMode("years")
  }

  const pick = (date) => {
    if (minDate && date < minDate) return
    setValue(toIso(date))
    setMode("days")
    setOpen(false)
  }

  const selected = fromIso(value)

  return (
    <div ref={rootRef} className="relative">
      {/* Real date input, kept in the layout (sr-only, not display:none) so
          FormData(form) and the browser's own required-validation both still
          see it — the popup below is purely the visible replacement. */}
      <input
        type="date"
        name={name}
        required={required}
        min={min}
        value={value}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />

      <button
        type="button"
        onClick={() => {
          setViewDate(selected ?? new Date())
          setMode("days")
          setOpen((previous) => !previous)
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={triggerClass}
      >
        <span className={value ? "" : "text-ink-950/40"}>{formatDisplay(value) ?? "mm/dd/yyyy"}</span>
        <CalendarIcon className="size-4 shrink-0 text-ink-950/40" />
      </button>

      <div
        role="dialog"
        aria-label="Choose a date"
        className={`absolute top-full z-20 mt-2 w-64 origin-top rounded-2xl bg-white p-3 shadow-xl ring-1 ring-ink-950/10 transition-[opacity,transform] duration-150 ease-out-smooth ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-1">
          {mode === "days" && (
            <p className="text-sm font-semibold text-ink-950">
              <button
                type="button"
                onClick={() => setMode("months")}
                className="rounded-md px-1 -mx-1 transition-colors duration-150 hover:bg-paper-100"
              >
                {viewDate.toLocaleDateString("en-US", { month: "long" })}
              </button>{" "}
              <button
                type="button"
                onClick={openYears}
                className="rounded-md px-1 -mx-1 transition-colors duration-150 hover:bg-paper-100"
              >
                {viewDate.getFullYear()}
              </button>
            </p>
          )}
          {mode === "months" && (
            <button
              type="button"
              onClick={openYears}
              className="rounded-md px-1 -mx-1 text-sm font-semibold text-ink-950 transition-colors duration-150 hover:bg-paper-100"
            >
              {viewDate.getFullYear()}
            </button>
          )}
          {mode === "years" && (
            <p className="text-sm font-semibold text-ink-950">
              {yearBlockStart} – {yearBlockStart + YEARS_PER_PAGE - 1}
            </p>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (mode === "days") changeMonth(-1)
                else if (mode === "months") changeYear(-1)
                else setYearBlockStart((start) => start - YEARS_PER_PAGE)
              }}
              aria-label="Previous"
              className="flex size-6 items-center justify-center rounded-lg text-ink-950/50 transition-colors duration-150 hover:bg-paper-100 hover:text-ink-950"
            >
              <ChevronDownIcon className="size-4 rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (mode === "days") changeMonth(1)
                else if (mode === "months") changeYear(1)
                else setYearBlockStart((start) => start + YEARS_PER_PAGE)
              }}
              aria-label="Next"
              className="flex size-6 items-center justify-center rounded-lg text-ink-950/50 transition-colors duration-150 hover:bg-paper-100 hover:text-ink-950"
            >
              <ChevronDownIcon className="size-4 -rotate-90" />
            </button>
          </div>
        </div>

        {mode === "days" && (
          <>
            <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-medium text-ink-950/40">
              {WEEKDAYS.map((day) => (
                <span key={day} className="py-1">
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-0.5 text-center text-sm">
              {buildGrid(viewDate).map((date) => {
                const inMonth = date.getMonth() === viewDate.getMonth()
                const isToday = sameDay(date, today)
                const isSelected = selected && sameDay(date, selected)
                const disabled = minDate && date < minDate
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => pick(date)}
                    disabled={disabled}
                    className={`mx-auto flex size-7 items-center justify-center rounded-full transition-colors duration-150 ease-out-smooth ${
                      isSelected
                        ? "bg-accent-dark font-semibold text-paper-50"
                        : disabled
                          ? "text-ink-950/20"
                          : inMonth
                            ? "text-ink-950 hover:bg-paper-100"
                            : "text-ink-950/30 hover:bg-paper-100"
                    } ${isToday && !isSelected ? "ring-1 ring-accent-dark/50" : ""}`}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {mode === "months" && (
          <div className="mt-2 grid grid-cols-4 gap-1">
            {MONTH_LABELS.map((label, index) => (
              <GridCell
                key={label}
                label={label}
                selected={index === viewDate.getMonth()}
                isNow={index === today.getMonth() && viewDate.getFullYear() === today.getFullYear()}
                onClick={() => {
                  setViewDate(new Date(viewDate.getFullYear(), index, 1))
                  setMode("days")
                }}
              />
            ))}
          </div>
        )}

        {mode === "years" && (
          <div className="mt-2 grid grid-cols-4 gap-1">
            {Array.from({ length: YEARS_PER_PAGE }, (_, index) => yearBlockStart + index).map((year) => (
              <GridCell
                key={year}
                label={year}
                selected={year === viewDate.getFullYear()}
                isNow={year === today.getFullYear()}
                onClick={() => {
                  setViewDate(new Date(year, viewDate.getMonth(), 1))
                  setMode("months")
                }}
              />
            ))}
          </div>
        )}

        {mode === "days" && (
          <div className="mt-2 flex items-center justify-between border-t border-ink-950/10 px-1 pt-2 text-xs font-medium">
            <button
              type="button"
              onClick={() => setValue("")}
              className="text-ink-950/50 transition-colors duration-150 hover:text-ink-950"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => pick(today)}
              className="text-accent-dark transition-opacity duration-150 hover:opacity-70"
            >
              Today
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
