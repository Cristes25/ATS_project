import { Sparkles, BarChart3 } from "lucide-react"

export default function EstadisticasPage() {
  return (
    <div className="space-y-6 bg-applik-bg min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Estadísticas</h1>
        <p className="text-sm text-slate-400">Resumen de métricas de reclutamiento</p>
      </div>

      {/* Estado pendiente */}
      <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
        <div className="mx-auto max-w-md text-center space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-50">
            <BarChart3 className="size-7 text-violet-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Métricas en preparación</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Estamos construyendo el módulo de estadísticas para que tengas analítica real de tu proceso de reclutamiento.
              Esta sección se activará automáticamente cuando los datos estén disponibles.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Próximamente
            </p>
            <ul className="text-xs text-amber-700 space-y-1.5 list-disc list-inside">
              <li>Tendencia mensual de candidatos</li>
              <li>Distribución por departamento</li>
              <li>Tiempo promedio por etapa del proceso</li>
              <li>Calidad de match con IA</li>
              <li>Sugerencias automáticas para optimizar el proceso</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}
