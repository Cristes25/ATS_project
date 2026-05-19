const BASE = import.meta.env.VITE_JOB_SERVICE_URL

export async function fetchJobStats(token) {
  const res = await fetch(`${BASE}/api/v1/jobs/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("stats fetch failed")
  return res.json()
}

export async function fetchJobs(token) {
  const res = await fetch(`${BASE}/api/v1/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("jobs fetch failed")
  return res.json()
}
