import { apiFetch } from "./client"

const TALENT = import.meta.env.VITE_TALENT_SERVICE_URL

export const updateApplicationStage = (applicationId, stage) =>
  apiFetch(`${TALENT}/api/v1/talents/applications/${applicationId}/stage`, {
    method: "PATCH",
    body: JSON.stringify({ stage }),
  })
