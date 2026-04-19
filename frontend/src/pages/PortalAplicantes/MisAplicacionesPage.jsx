import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Briefcase, Bookmark, MapPin, Calendar, Building2, X } from "lucide-react"

// ─── Mock data ────────────────────────────────────────────────────────────────

const aplicaciones = [
  { id: 1, titulo: "Gerente de Ventas",    empresa: "Casa Peñas",   ubicacion: "Managua", fecha: "15/03/2026", estado: "En revisión"          },
  { id: 2, titulo: "Especialista Digital", empresa: "Casa del Café", ubicacion: "Managua", fecha: "27/02/2026", estado: "Rechazada"            },
  { id: 3, titulo: "Analista de Datos",    empresa: "Ogilvy",       ubicacion: "Managua", fecha: "05/03/2026", estado: "Entrevista Programada" },
]

const guardadosIniciales = [
  { id: 10, titulo: "Diseñador UX",           empresa: "Agencia Creativa", ubicacion: "Managua", categoria: "Tecnología",  guardadoEl: "12/04/2026" },
  { id: 11, titulo: "Creador de Contenido",   empresa: "MediaGroup",       ubicacion: "Managua", categoria: "Marketing",   guardadoEl: "10/04/2026" },
]

const estadoConfig = {
  "En revisión":           { dot: "bg-blue-400",  bg: "bg-blue-50",  text: "text-blue-600"  },
  "Rechazada":             { dot: "bg-red-400",   bg: "bg-red-50",   text: "text-red-500"   },
  "Entrevista Programada": { dot: "bg-teal-400",  bg: "bg-teal-50",  text: "text-teal-600"  },
  "Aceptada":              { dot: "bg-green-400", bg: "bg-green-50", text: "text-green-600" },
}

const filtros = [
  { key: "Todas",       label: "Todas",      dot: "bg-slate-400" },
  { key: "En revisión", label: "En revisión", dot: "bg-blue-400"  },
  { key: "Entrevista",  label: "Entrevista",  dot: "bg-teal-400"  },
  { key: "Rechazadas",  label: "Rechazadas",  dot: "bg-red-400"   },
]

// ─── Página ───────────────────────────────────────────────────────────────────

export default function MisAplicacionesPage() {
  const navigate = useNavigate()

  const [tabActivo,    setTabActivo]    = useState("aplicaciones") // "aplicaciones" | "guardados"
  const [filtroActivo, setFiltroActivo] = useState("Todas")
  const [guardados,    setGuardados]    = useState(guardadosIniciales)

  const lista = aplicaciones.filter((a) => {
    if (filtroActivo === "Todas")       return true
    if (filtroActivo === "En revisión") return a.estado === "En revisión"
    if (filtroActivo === "Entrevista")  return a.estado === "Entrevista Programada"
    if (filtroActivo === "Rechazadas")  return a.estado === "Rechazada"
    return true
  })

  const conteo = (key) => {
    if (key === "Todas")       return aplicaciones.length
    if (key === "En revisión") return aplicaciones.filter(a => a.estado === "En revisión").length
    if (key === "Entrevista")  return aplicaciones.filter(a => a.estado === "Entrevista Programada").length
    if (key === "Rechazadas")  return aplicaciones.filter(a => a.estado === "Rechazada").length
    return 0
  }

  return (
    <div className="pb-16 max-w-3xl mx-auto">

      {/* ── Header ── */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">Mi Actividad</h1>
        <p className="mt-1 text-sm text-slate-400">Haz seguimiento de tus aplicaciones y vacantes guardadas.</p>
      </div>

      {/* ── Tabs principales ── */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setTabActivo("aplicaciones")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
            tabActivo === "aplicaciones"
              ? "border-violet-600 text-violet-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Briefcase className="size-4" />
          Mis Aplicaciones
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            tabActivo === "aplicaciones" ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-500"
          }`}>
            {aplicaciones.length}
          </span>
        </button>
        <button
          onClick={() => setTabActivo("guardados")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
            tabActivo === "guardados"
              ? "border-violet-600 text-violet-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Bookmark className="size-4" />
          Guardados
          {guardados.length > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              tabActivo === "guardados" ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-500"
            }`}>
              {guardados.length}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════ TAB: MIS APLICACIONES ══════════════ */}
      {tabActivo === "aplicaciones" && (
        <>
          {/* Filtros */}
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filtros.map((f) => {
              const activo = filtroActivo === f.key
              const n = conteo(f.key)
              return (
                <button
                  key={f.key}
                  onClick={() => setFiltroActivo(f.key)}
                  className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activo
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600"
                  }`}
                >
                  <span className={`size-2 rounded-full shrink-0 ${activo ? "bg-white/70" : f.dot}`} />
                  {f.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold leading-none ${
                    activo ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {n}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Lista */}
          <div className="space-y-3">
            {lista.length > 0 ? lista.map((ap) => {
              const config = estadoConfig[ap.estado] ?? { dot: "bg-slate-300", bg: "bg-slate-50", text: "text-slate-500" }
              return (
                <div key={ap.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-violet-200 hover:shadow-md">

                  {/* Desktop */}
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="size-12 shrink-0 rounded-2xl bg-violet-50 flex items-center justify-center">
                      <Building2 className="size-5 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800">{ap.titulo}</h3>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Building2 className="size-3" />{ap.empresa}</span>
                        <span className="flex items-center gap-1"><MapPin className="size-3" />{ap.ubicacion}</span>
                        <span className="flex items-center gap-1"><Calendar className="size-3" />{ap.fecha}</span>
                      </div>
                    </div>
                    <div className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.text}`}>
                      <span className={`size-1.5 rounded-full ${config.dot}`} />
                      {ap.estado}
                    </div>
                    <button
                      onClick={() => navigate(`/trabajo/${ap.id}`)}
                      className="shrink-0 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      Ver detalles
                    </button>
                  </div>

                  {/* Mobile */}
                  <div className="flex sm:hidden items-start gap-3">
                    <div className="size-11 shrink-0 rounded-2xl bg-violet-50 flex items-center justify-center">
                      <Building2 className="size-4 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{ap.titulo}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{ap.empresa} · {ap.ubicacion}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Aplicaste el {ap.fecha}</p>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.text}`}>
                        <span className={`size-1.5 rounded-full ${config.dot}`} />
                        {ap.estado}
                      </div>
                      <button
                        onClick={() => navigate(`/trabajo/${ap.id}`)}
                        className="w-full rounded-xl bg-violet-600 py-2 text-xs font-semibold text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-slate-200 bg-white">
                <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Briefcase className="size-6 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-700">No tienes aplicaciones aquí</p>
                <p className="mt-1 text-sm text-slate-400">Explora los trabajos disponibles y aplica</p>
                <button onClick={() => navigate("/trabajos")} className="mt-4 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-violet-700">
                  Ver trabajos
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════════ TAB: GUARDADOS ══════════════ */}
      {tabActivo === "guardados" && (
        <div className="space-y-3">
          {guardados.length > 0 ? guardados.map((g) => (
            <div key={g.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-violet-200 hover:shadow-md">

              {/* Desktop */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="size-12 shrink-0 rounded-2xl bg-violet-50 flex items-center justify-center">
                  <Building2 className="size-5 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800">{g.titulo}</h3>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Building2 className="size-3" />{g.empresa}</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{g.ubicacion}</span>
                    <span className="flex items-center gap-1"><Bookmark className="size-3" />Guardado el {g.guardadoEl}</span>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                  {g.categoria}
                </span>
                <button
                  onClick={() => navigate(`/trabajo/${g.id}`)}
                  className="shrink-0 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Ver detalles
                </button>
                <button
                  onClick={() => setGuardados(prev => prev.filter(x => x.id !== g.id))}
                  className="shrink-0 text-slate-300 hover:text-red-400 transition-colors"
                  title="Quitar de guardados"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Mobile */}
              <div className="flex sm:hidden items-start gap-3">
                <div className="size-11 shrink-0 rounded-2xl bg-violet-50 flex items-center justify-center">
                  <Building2 className="size-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{g.titulo}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{g.empresa} · {g.ubicacion}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Guardado el {g.guardadoEl}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/trabajo/${g.id}`)}
                      className="flex-1 rounded-xl bg-violet-600 py-2 text-xs font-semibold text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={() => setGuardados(prev => prev.filter(x => x.id !== g.id))}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-slate-400 hover:text-red-400 hover:border-red-200 transition-all"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-slate-200 bg-white">
              <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-slate-100">
                <Bookmark className="size-6 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700">No tienes vacantes guardadas</p>
              <p className="mt-1 text-sm text-slate-400">Guarda vacantes que te interesen para verlas después</p>
              <button onClick={() => navigate("/trabajos")} className="mt-4 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-violet-700">
                Explorar trabajos
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
