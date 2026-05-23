export function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]))
  } catch {
    return null
  }
}

export function getTenantId() {
  const token = localStorage.getItem("applik_token")
  const payload = token ? decodeToken(token) : null
  return payload?.company_id ?? localStorage.getItem("applik_tenant_id") ?? null
}
