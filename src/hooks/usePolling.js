// hooks/usePolling.js  — drop-in replacement, no server needed
// Each endpoint key returns mock data that mutates on every "poll"

import { useState, useEffect, useRef } from "react"

// ─── Seed helpers ────────────────────────────────────────────────────────────
const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const frand = (min, max) => +(Math.random() * (max - min) + min).toFixed(2)
const pick  = arr => arr[Math.floor(Math.random() * arr.length)]

const CITIES   = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune"]
const PRODUCTS = ["Laptop", "Phone", "Earbuds", "Tablet", "Charger", "Smartwatch"]
const REASONS  = ["velocity_spike", "geo_mismatch", "amount_anomaly"]

// ─── Static-ish base state (mutated each tick) ────────────────────────────────
let _kpis = {
  total_orders:  rand(18000, 20000),
  total_revenue: rand(14000000, 16000000),
  avg_order_val: rand(720, 810),
  active_cities: 6,
}

let _fraudAlerts = Array.from({ length: 12 }, (_, i) => ({
  order_id:    crypto.randomUUID(),
  user_id:     `user_${rand(1000, 9999)}`,
  amount:      rand(4000, 28000),
  city:        pick(CITIES),
  flag_reason: pick(REASONS),
  timestamp:   new Date(Date.now() - i * 42000).toISOString(),
}))

let _fraudSummary = REASONS.map(r => ({
  flag_reason: r,
  total:       rand(4, 14),
  avg_amount:  rand(8000, 22000),
}))

let _topProducts = PRODUCTS.map((p, i) => ({
  product:       p,
  total_orders:  rand(900, 3200) - i * 100,
  total_revenue: rand(500000, 3000000) - i * 50000,
})).sort((a, b) => b.total_revenue - a.total_revenue)

const makeWindow = (offsetMin = 0) => {
  const d = new Date(Date.now() - offsetMin * 60000)
  return {
    window_start:  d.toISOString(),
    city:          pick(CITIES),
    total_orders:  rand(8, 60),
    total_revenue: rand(40000, 320000),
    avg_order_val: rand(600, 900),
  }
}
let _series = Array.from({ length: 60 }, (_, i) => makeWindow(60 - i))

let _cities = CITIES.map(city => ({
  city,
  total_revenue: rand(800000, 3200000),
}))

// ─── Mutation helpers (called on each tick) ────────────────────────────────────
function mutatekpis() {
  _kpis = {
    ..._kpis,
    total_orders:  _kpis.total_orders  + rand(1, 8),
    total_revenue: _kpis.total_revenue + rand(3000, 18000),
    avg_order_val: Math.max(600, _kpis.avg_order_val + rand(-5, 7)),
  }
  return { ..._kpis }
}

function mutateFraudAlerts() {
  // occasionally prepend a new alert, drop oldest
  if (Math.random() < 0.45) {
    const fresh = {
      order_id:    crypto.randomUUID(),
      user_id:     `user_${rand(1000, 9999)}`,
      amount:      rand(4000, 28000),
      city:        pick(CITIES),
      flag_reason: pick(REASONS),
      timestamp:   new Date().toISOString(),
    }
    _fraudAlerts = [fresh, ..._fraudAlerts.slice(0, 19)]
  }
  return [..._fraudAlerts]
}

function mutateFraudSummary() {
  _fraudSummary = _fraudSummary.map(s => ({
    ...s,
    total:      Math.max(1, s.total + rand(-1, 2)),
    avg_amount: Math.max(5000, s.avg_amount + rand(-200, 400)),
  }))
  return [..._fraudSummary]
}

function mutateTopProducts() {
  _topProducts = _topProducts.map(p => ({
    ...p,
    total_orders:  p.total_orders  + rand(0, 4),
    total_revenue: p.total_revenue + rand(0, 15000),
  }))
  return [..._topProducts]
}

function mutateSeries() {
  // shift window: drop oldest, add newest
  _series = [..._series.slice(1), makeWindow(0)]
  return [..._series]
}

function mutateCities() {
  _cities = _cities.map(c => ({
    ...c,
    total_revenue: c.total_revenue + rand(-20000, 60000),
  }))
  return [..._cities]
}

// ─── Endpoint router ─────────────────────────────────────────────────────────
const ENDPOINT_MAP = {
  "/api/kpis":               mutatekpis,
  "/api/fraud-alerts":       mutateFraudAlerts,
  "/api/fraud-summary":      mutateFraudSummary,
  "/api/top-products":       mutateTopProducts,
  "/api/orders-per-minute":  mutateSeries,
  "/api/city-breakdown":     mutateCities,
}

function getEndpointKey(url) {
  try {
    const path = new URL(url).pathname
    return Object.keys(ENDPOINT_MAP).find(k => path.endsWith(k))
  } catch {
    return Object.keys(ENDPOINT_MAP).find(k => url.includes(k))
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function usePolling(url, intervalMs = 5000) {
  const key      = getEndpointKey(url)
  const mutator  = key ? ENDPOINT_MAP[key] : null

  const [data,   setData]   = useState(() => mutator ? mutator() : null)
  const [error]             = useState(null)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!mutator) return
    // Initial slightly-delayed "fetch" feel
    setLoading(true)
    const init = setTimeout(() => {
      setData(mutator())
      setLoading(false)
    }, 120)

    timerRef.current = setInterval(() => {
      setData(mutator())
    }, intervalMs)

    return () => {
      clearTimeout(init)
      clearInterval(timerRef.current)
    }
  }, [url, intervalMs]) // eslint-disable-line

  return { data, error, loading }
}