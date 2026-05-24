import { Bell, Sparkles } from "lucide-react"

export default function NotificacionesPage() {
  return (
    <div className="max-w-2xl mx-auto pb-16">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Notificaciones</h1>
        <p className="text-sm text-slate-400 mt-0.5">Mantente al día con la actividad de tus aplicaciones</p>
      </div>

      {/* Estado pendiente */}
      <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
        <div className="mx-auto max-w-md text-center space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-50">
            <Bell className="size-7 text-violet-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Notificaciones en preparación</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Estamos construyendo el sistema de notificaciones para que sepas en tiempo real cuándo
              hay cambios en tus aplicaciones o aparecen nuevas vacantes que coinciden con tu perfil.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Próximamente
            </p>
            <ul className="text-xs text-amber-700 space-y-1.5 list-disc list-inside">
              <li>Aviso cuando una empresa revisa tu aplicación</li>
              <li>Aviso cuando avanzas a la siguiente etapa</li>
              <li>Nuevas vacantes recomendadas según tu perfil</li>
              <li>Marcar notificaciones como leídas</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}
