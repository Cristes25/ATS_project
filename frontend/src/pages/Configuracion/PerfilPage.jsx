import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar } from "@/components/ui/Avatar"
import { useAuth } from "@/context/AuthContext"

export default function PerfilPage({ onBack }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-applik-bg p-6">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Volver */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Volver
        </button>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Perfil</h1>
          <p className="text-sm text-slate-400">Información de tu cuenta</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Avatar */}
          <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col items-center gap-4">
            <Avatar name={user?.name ?? ""} size="lg" className="size-28 text-3xl" />
            <p className="font-semibold text-slate-800">{user?.name}</p>
          </div>

          {/* Campos */}
          <div className="space-y-5 lg:col-span-2">

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombre</label>
              <input
                value={user?.name ?? ""}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Empresa</label>
              <input
                value={user?.tenant_name ?? ""}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Correo Electrónico</label>
              <input
                value={user?.email ?? ""}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">Edición de perfil pendiente</p>
              <p className="mt-1 text-xs text-amber-700">
                La edición de nombre y foto estará disponible próximamente. Para cambiar tu contraseña, usa el{" "}
                <Link to="/recuperar-contrasena" className="font-medium underline hover:text-amber-900">
                  enlace de recuperación
                </Link>.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
