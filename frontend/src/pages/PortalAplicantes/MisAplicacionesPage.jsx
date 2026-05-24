import { useNavigate } from "react-router-dom"
import { Briefcase, Sparkles } from "lucide-react"

export default function MisAplicacionesPage() {
  const navigate = useNavigate()

  return (
    <div className="pb-16 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">Mi Actividad</h1>
        <p className="mt-1 text-sm text-slate-400">Haz seguimiento de tus aplicaciones y vacantes guardadas.</p>
      </div>

      {/* Estado pendiente */}
      <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
        <div className="mx-auto max-w-md text-center space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-50">
            <Briefcase className="size-7 text-violet-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Seguimiento en preparación</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Estamos terminando el módulo de seguimiento para que puedas ver el estado de cada aplicación
              que envías y guardar vacantes para revisar después. Mientras tanto, explora todas las vacantes disponibles.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Próximamente
            </p>
            <ul className="text-xs text-amber-700 space-y-1.5 list-disc list-inside">
              <li>Lista de vacantes a las que has aplicado</li>
              <li>Estado de cada aplicación (en revisión, entrevista, rechazada, aceptada)</li>
              <li>Vacantes guardadas para revisar después</li>
              <li>Notificaciones cuando haya cambios en tus aplicaciones</li>
            </ul>
          </div>
          <button
            onClick={() => navigate("/trabajos")}
            className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Explorar vacantes
          </button>
        </div>
      </div>

    </div>
  )
}
