import { useEffect, useMemo, useRef, useState } from "react"

export default function CurrencySelect({
  label,
  value,
  onChange,
  options, // [{ code, name }]
  disabled,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  const selected = useMemo(
    () => options.find((o) => o.code === value),
    [options, value]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => {
      return (
        o.code.toLowerCase().includes(q) ||
        (o.name || "").toLowerCase().includes(q)
      )
    })
  }, [options, query])

  useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery("")
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  function pick(code) {
    onChange(code)
    setOpen(false)
  }

  return (
    <div className="relative" ref={wrapRef}>
      <label className="text-sm font-medium">{label}</label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left disabled:opacity-50"
      >
        {selected ? `${selected.name} (${selected.code})` : value}
      </button>

      {open && !disabled && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow">
          <div className="p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search currency..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="max-h-64 overflow-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-3 text-sm text-slate-600">
                No matches
              </div>
            )}

            {filtered.map((o) => (
              <button
                key={o.code}
                type="button"
                onClick={() => pick(o.code)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                {o.name} ({o.code})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}