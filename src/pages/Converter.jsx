import WelcomeMessage from '../components/WelcomeMessage';
import { useEffect, useMemo, useState } from "react"
import CurrencySelect from "../components/CurrencySelect"
import FloatingSymbols from "../components/FloatingSymbols"

const API_BASE = "https://open.er-api.com/v6"

function getCurrencyName(code) {
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "currency" })
    return dn.of(code) || code
  } catch {
    return code
  }
}

export default function Converter() {
  const [codes, setCodes] = useState([])
  const [amount, setAmount] = useState("1")
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("MUR")

  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadCurrencies() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${API_BASE}/latest/USD`)
        const data = await res.json()
        const list = Object.keys(data.rates || {}).sort()
        setCodes(list)

        if (!list.includes(from) && list.length) setFrom(list[0])
        if (!list.includes(to) && list.length) setTo(list[0])
      } catch {
        setError("Failed to load currency list")
      } finally {
        setLoading(false)
      }
    }

    loadCurrencies()
  }, [])

  useEffect(() => {
    if (!from) return

    async function loadRates() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${API_BASE}/latest/${encodeURIComponent(from)}`)
        const data = await res.json()
        setRates(data.rates || null)
      } catch {
        setError("Failed to load exchange rates")
      } finally {
        setLoading(false)
      }
    }

    loadRates()
  }, [from])

  const options = useMemo(() => {
    return codes.map((c) => ({
      code: c,
      name: getCurrencyName(c),
    }))
  }, [codes])

  const converted = useMemo(() => {
    const value = Number(amount)
    if (!rates || !rates[to] || !Number.isFinite(value)) return ""
    return (value * rates[to]).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [amount, rates, to])

  function swap() {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center animated-gradient px-4 overflow-hidden">
      <FloatingSymbols />

      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <WelcomeMessage />

        <h1 className="text-2xl font-semibold text-center">
          Currency Converter
        </h1>

        <div className="mt-6">
          <label className="text-sm font-medium">Amount</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value.replace(/[^0-9.]/g, ""))
            }
            placeholder="Enter amount"
            disabled={loading}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CurrencySelect
            label="From"
            value={from}
            onChange={setFrom}
            options={options}
            disabled={loading || options.length === 0}
          />

          <CurrencySelect
            label="To"
            value={to}
            onChange={setTo}
            options={options}
            disabled={loading || options.length === 0}
          />
        </div>

        <button
          onClick={swap}
          className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          disabled={loading || !from || !to}
        >
          Swap
        </button>

        <div className="mt-5 bg-slate-50 rounded-lg p-4 text-center">
          {loading && <p>Loading…</p>}
          {!loading && error && <p className="text-red-600">{error}</p>}

          {!loading && !error && converted && (
            <>
              <p className="text-sm text-slate-600">Result</p>
              <p className="text-xl font-semibold">
                {converted} {to}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {amount || "0"} {from} → {to}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}