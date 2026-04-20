import { useState } from "react"
import { X, Mail, CheckCircle2 } from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/button"

const plantillas = [
    {
        asunto: "Invitación a entrevista",
        mensaje: "Estimado/a [Nombre],\n\nNos complace informarle que ha sido seleccionado/a para continuar en nuestro proceso de selección. Nos gustaría invitarle a una entrevista para conocerle mejor.\n\nEstaremos en contacto para coordinar los detalles.\n\nSaludos cordiales,\nEquipo de Reclutamiento",
    },
    {
        asunto: "Actualización de tu aplicación",
        mensaje: "Estimado/a [Nombre],\n\nGracias por tu interés en unirte a nuestro equipo. Queremos informarte que tu aplicación está siendo revisada y te notificaremos sobre los próximos pasos.\n\nSaludos cordiales,\nEquipo de Reclutamiento",
    },
    {
        asunto: "Solicitud de documentos",
        mensaje: "Estimado/a [Nombre],\n\nComo parte del proceso de selección, necesitamos que nos envíes los siguientes documentos:\n\n- CV actualizado\n- Referencias laborales\n- Copia de título\n\nPor favor envíalos a la brevedad posible.\n\nSaludos,\nEquipo de Reclutamiento",
    },
]

export default function EnviarCorreoModal({ candidato, onClose }) {
    const [asunto,     setAsunto]     = useState("")
    const [mensaje,    setMensaje]    = useState("")
    const [enviado,    setEnviado]    = useState(false)
    const [plantillaIdx, setPlantilla] = useState(null)

    const canSend = asunto.trim() && mensaje.trim()

    const aplicarPlantilla = (idx) => {
        const p = plantillas[idx]
        setAsunto(p.asunto)
        setMensaje(p.mensaje.replace("[Nombre]", candidato.nombre.split(" ")[0]))
        setPlantilla(idx)
    }

    const handleSend = () => {
        if (!canSend) return
        setEnviado(true)
        setTimeout(() => {
            onClose()
        }, 1400)
    }

    if (enviado) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl flex flex-col items-center gap-4 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-blue-dark/10">
                        <CheckCircle2 className="size-8 text-blue-dark" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">¡Correo Enviado!</h2>
                    <p className="text-sm text-slate-500">
                        Tu mensaje fue enviado a{" "}
                        <span className="font-medium text-slate-700">{candidato.email}</span>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
            <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-dark/10">
                            <Mail className="size-5 text-blue-dark" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Enviar Correo</h2>
                            <p className="text-sm text-slate-400">Redacta un mensaje para el candidato</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all shrink-0"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">

                    {/* Para */}
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <Avatar name={candidato.nombre} size="sm" />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800">{candidato.nombre}</p>
                            <p className="text-xs text-slate-400 truncate">{candidato.email}</p>
                        </div>
                    </div>

                    {/* Plantillas */}
                    <div>
                        <p className="mb-2 text-sm font-medium text-slate-700">Plantillas rápidas</p>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                            {plantillas.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => aplicarPlantilla(i)}
                                    className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                                        plantillaIdx === i
                                            ? "border-blue-dark bg-blue-dark/5 text-blue-dark"
                                            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    {p.asunto}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Asunto */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Asunto</label>
                        <input
                            type="text"
                            value={asunto}
                            onChange={(e) => { setAsunto(e.target.value); setPlantilla(null) }}
                            placeholder="Escribe el asunto del correo..."
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-dark/20"
                        />
                    </div>

                    {/* Mensaje */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Mensaje</label>
                        <textarea
                            value={mensaje}
                            onChange={(e) => { setMensaje(e.target.value); setPlantilla(null) }}
                            placeholder="Escribe tu mensaje aquí..."
                            rows={7}
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-dark/20"
                        />
                        <p className="mt-1 text-right text-xs text-slate-400">{mensaje.length} caracteres</p>
                    </div>

                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white px-6 pb-6 pt-3 border-t border-slate-100 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-1"
                        onClick={handleSend}
                        disabled={!canSend}
                    >
                        <Mail className="size-4" /> Enviar
                    </Button>
                </div>

            </div>
        </div>
    )
}
