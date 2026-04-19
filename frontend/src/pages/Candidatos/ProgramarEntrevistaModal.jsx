import { useState } from "react"
import { X, Calendar, Clock, Video, MapPin, Phone, LinkIcon, CheckCircle2 } from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/button"

const tipos = [
    { key: "presencial", label: "Presencial",  icon: MapPin,     color: "text-teal-dark",   bg: "bg-teal-dark/10"   },
    { key: "virtual",    label: "Virtual",     icon: Video,      color: "text-blue-dark",   bg: "bg-blue-dark/10"   },
    { key: "telefonica", label: "Telefónica",  icon: Phone,      color: "text-purple-dark", bg: "bg-purple-dark/10" },
]

const horas = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00",
]

export default function ProgramarEntrevistaModal({ candidato, onClose, onConfirm }) {
    const [tipo,       setTipo]       = useState("virtual")
    const [fecha,      setFecha]      = useState("")
    const [hora,       setHora]       = useState("")
    const [enlace,     setEnlace]     = useState("")
    const [notas,      setNotas]      = useState("")
    const [confirmado, setConfirmado] = useState(false)

    const tipoActivo = tipos.find((t) => t.key === tipo)
    const esVirtual  = tipo === "virtual"
    const canConfirm = fecha && hora

    const handleConfirm = () => {
        if (!canConfirm) return
        setConfirmado(true)
        setTimeout(() => {
            onConfirm?.({ tipo, fecha, hora, enlace, notas })
            onClose()
        }, 1200)
    }

    if (confirmado) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl flex flex-col items-center gap-4 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-teal-dark/10">
                        <CheckCircle2 className="size-8 text-teal-dark" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">¡Entrevista Programada!</h2>
                    <p className="text-sm text-slate-500">
                        Se ha programado la entrevista con <span className="font-medium text-slate-700">{candidato.nombre}</span>
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
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Programar Entrevista</h2>
                        <p className="text-sm text-slate-400">Agenda una sesión con el candidato</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all shrink-0"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-6">

                    {/* Candidato */}
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <Avatar name={candidato.nombre} size="sm" />
                        <div>
                            <p className="text-sm font-medium text-slate-800">{candidato.nombre}</p>
                            <p className="text-xs text-slate-400">{candidato.posicion}</p>
                        </div>
                    </div>

                    {/* Tipo de entrevista */}
                    <div>
                        <p className="mb-3 text-sm font-medium text-slate-700">Tipo de entrevista</p>
                        <div className="grid grid-cols-3 gap-2">
                            {tipos.map((t) => {
                                const Icon = t.icon
                                const active = tipo === t.key
                                return (
                                    <button
                                        key={t.key}
                                        onClick={() => setTipo(t.key)}
                                        className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                                            active
                                                ? `border-current ${t.color} bg-opacity-5 ${t.bg}`
                                                : "border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                    >
                                        <Icon className={`size-5 ${active ? t.color : ""}`} />
                                        <span className="text-xs font-medium">{t.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Fecha */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <Calendar className="size-4 text-slate-400" /> Fecha
                        </label>
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-dark/20"
                        />
                    </div>

                    {/* Hora */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <Clock className="size-4 text-slate-400" /> Hora
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {horas.map((h) => (
                                <button
                                    key={h}
                                    onClick={() => setHora(h)}
                                    className={`rounded-xl border px-3 py-1.5 text-sm transition-all ${
                                        hora === h
                                            ? "border-blue-dark bg-blue-dark/5 text-blue-dark font-medium"
                                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                                    }`}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Enlace — solo si es virtual */}
                    {esVirtual && (
                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                                <LinkIcon className="size-4 text-slate-400" /> Enlace de reunión
                                <span className="text-xs font-normal text-slate-400">(opcional)</span>
                            </label>
                            <input
                                type="url"
                                value={enlace}
                                onChange={(e) => setEnlace(e.target.value)}
                                placeholder="https://meet.google.com/..."
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-dark/20"
                            />
                        </div>
                    )}

                    {/* Notas */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Notas <span className="text-xs font-normal text-slate-400">(opcional)</span>
                        </label>
                        <textarea
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Instrucciones para el candidato, temas a tratar..."
                            rows={3}
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-dark/20"
                        />
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
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                    >
                        Confirmar
                    </Button>
                </div>

            </div>
        </div>
    )
}
