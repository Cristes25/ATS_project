import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import {
  MapPin, Phone, Briefcase, GraduationCap,
  Plus, Pencil, Download, Upload, LogOut, X, Check,
} from "lucide-react"

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Initials({ name }) {
  const initials = name ? name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "?"
  return (
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-2xl font-bold shrink-0">
      {initials}
    </div>
  )
}

// ─── Chip de habilidad ────────────────────────────────────────────────────────

function SkillChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 px-3 py-1 text-xs text-violet-700 font-medium">
      {label}
      <button onClick={onRemove} className="text-violet-400 hover:text-violet-600 transition-colors">
        <X className="size-3" />
      </button>
    </span>
  )
}

// ─── Formulario de experiencia ────────────────────────────────────────────────

function FormExperiencia({ onGuardar, onCancelar }) {
  const [puesto,   setPuesto]   = useState("")
  const [empresa,  setEmpresa]  = useState("")
  const [inicio,   setInicio]   = useState("")
  const [fin,      setFin]      = useState("")
  const [presente, setPresente] = useState(false)

  const handleGuardar = () => {
    if (!puesto.trim() || !empresa.trim() || !inicio.trim()) return
    const periodo = `${inicio} – ${presente ? "Presente" : fin || "?"}`
    onGuardar({ id: Date.now(), puesto: puesto.trim(), empresa: empresa.trim(), periodo })
  }

  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder-slate-400"

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Puesto *</label>
          <input value={puesto} onChange={e => setPuesto(e.target.value)} placeholder="Ej. Analista de Marketing" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Empresa *</label>
          <input value={empresa} onChange={e => setEmpresa(e.target.value)} placeholder="Ej. Empresa XYZ" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Año de inicio *</label>
          <input value={inicio} onChange={e => setInicio(e.target.value)} placeholder="Ej. 2021" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Año de fin</label>
          <input
            value={fin}
            onChange={e => setFin(e.target.value)}
            placeholder="Ej. 2023"
            disabled={presente}
            className={`${inputCls} ${presente ? "opacity-40 cursor-not-allowed" : ""}`}
          />
          <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
            <input type="checkbox" checked={presente} onChange={e => setPresente(e.target.checked)} className="rounded border-slate-300 text-violet-600 focus:ring-violet-400" />
            <span className="text-xs text-slate-500">Trabajo actual</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancelar} className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
        <button
          onClick={handleGuardar}
          disabled={!puesto.trim() || !empresa.trim() || !inicio.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Check className="size-3.5" /> Guardar
        </button>
      </div>
    </div>
  )
}

// ─── Formulario de educación ──────────────────────────────────────────────────

function FormEducacion({ onGuardar, onCancelar }) {
  const [titulo,      setTitulo]      = useState("")
  const [institucion, setInstitucion] = useState("")
  const [inicio,      setInicio]      = useState("")
  const [fin,         setFin]         = useState("")

  const handleGuardar = () => {
    if (!titulo.trim() || !institucion.trim() || !inicio.trim()) return
    const periodo = `${inicio} – ${fin || "?"}`
    onGuardar({ id: Date.now(), titulo: titulo.trim(), institucion: institucion.trim(), periodo })
  }

  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder-slate-400"

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Título / Carrera *</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej. Licenciatura en Administración" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Institución *</label>
          <input value={institucion} onChange={e => setInstitucion(e.target.value)} placeholder="Ej. Universidad Nacional" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Año de inicio *</label>
          <input value={inicio} onChange={e => setInicio(e.target.value)} placeholder="Ej. 2017" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Año de graduación</label>
          <input value={fin} onChange={e => setFin(e.target.value)} placeholder="Ej. 2021" className={inputCls} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancelar} className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
        <button
          onClick={handleGuardar}
          disabled={!titulo.trim() || !institucion.trim() || !inicio.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Check className="size-3.5" /> Guardar
        </button>
      </div>
    </div>
  )
}

// ─── Datos mock iniciales ─────────────────────────────────────────────────────

const experienciaInicial = [
  { id: 1, puesto: "Analista de Marketing", empresa: "Empresa XYZ", periodo: "2023 – Presente" },
  { id: 2, puesto: "Asistente de Ventas",   empresa: "Empresa ABC", periodo: "2021 – 2023"     },
]

const educacionInicial = [
  { id: 1, titulo: "Licenciatura en Administración de Empresas", institucion: "Universidad Nacional", periodo: "2017 – 2021" },
]

const habilidadesIniciales = ["Excel", "CRM", "Marketing Digital", "Análisis de datos", "PowerPoint"]

// ─── Página ───────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const { user, logout } = useAuth()

  const [telefono,     setTelefono]     = useState("+505 8888-0000")
  const [ciudad,       setCiudad]       = useState("Managua, Nicaragua")
  const [editandoInfo, setEditandoInfo] = useState(false)
  const [telefonoEdit, setTelefonoEdit] = useState(telefono)
  const [ciudadEdit,   setCiudadEdit]   = useState(ciudad)

  const [experiencia,       setExperiencia]       = useState(experienciaInicial)
  const [mostrarFormExp,    setMostrarFormExp]    = useState(false)
  const [educacion,         setEducacion]         = useState(educacionInicial)
  const [mostrarFormEdu,    setMostrarFormEdu]    = useState(false)

  const [habilidades,    setHabilidades]    = useState(habilidadesIniciales)
  const [nuevaHabilidad, setNuevaHabilidad] = useState("")
  const [agregandoSkill, setAgregandoSkill] = useState(false)

  const guardarInfo = () => { setTelefono(telefonoEdit); setCiudad(ciudadEdit); setEditandoInfo(false) }

  const agregarExperiencia = (item) => { setExperiencia(prev => [item, ...prev]); setMostrarFormExp(false) }
  const agregarEducacion   = (item) => { setEducacion(prev => [item, ...prev]);   setMostrarFormEdu(false) }

  const agregarHabilidad = () => {
    const trimmed = nuevaHabilidad.trim()
    if (trimmed && !habilidades.includes(trimmed)) setHabilidades(prev => [...prev, trimmed])
    setNuevaHabilidad(""); setAgregandoSkill(false)
  }

  return (
    <div className="pb-16 space-y-6 max-w-3xl mx-auto">

      {/* ── Header ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Initials name={user?.name} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-800">{user?.name ?? "Candidato"}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><MapPin className="size-3.5" />{ciudad}</span>
              <span className="flex items-center gap-1"><Phone className="size-3.5" />{telefono}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end shrink-0">
            <button
              onClick={() => { setEditandoInfo(true); setTelefonoEdit(telefono); setCiudadEdit(ciudad) }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Pencil className="size-3.5" /> Editar perfil
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-xl border border-red-100 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="size-3.5" /> Cerrar sesión
            </button>
          </div>
        </div>

        {editandoInfo && (
          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Teléfono</label>
                <input value={telefonoEdit} onChange={e => setTelefonoEdit(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Ciudad</label>
                <input value={ciudadEdit} onChange={e => setCiudadEdit(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditandoInfo(false)} className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
              <button onClick={guardarInfo} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 transition-all">
                <Check className="size-3.5" /> Guardar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Experiencia Laboral ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-800">Experiencia Laboral</h2>
          {!mostrarFormExp && (
            <button onClick={() => setMostrarFormExp(true)} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors">
              <Plus className="size-3.5" /> Agregar
            </button>
          )}
        </div>

        {experiencia.length === 0 && !mostrarFormExp && (
          <p className="text-sm text-slate-400">Agrega tu experiencia laboral.</p>
        )}

        {experiencia.length > 0 && (
          <div className="space-y-4">
            {experiencia.map((exp) => (
              <div key={exp.id} className="flex items-start justify-between gap-3 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Briefcase className="size-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{exp.puesto}</p>
                    <p className="text-xs text-slate-500">{exp.empresa}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{exp.periodo}</p>
                  </div>
                </div>
                <button onClick={() => setExperiencia(prev => prev.filter(e => e.id !== exp.id))}
                  className="text-slate-300 hover:text-red-400 transition-colors shrink-0">
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {mostrarFormExp && (
          <FormExperiencia onGuardar={agregarExperiencia} onCancelar={() => setMostrarFormExp(false)} />
        )}
      </div>

      {/* ── Educación ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-800">Educación</h2>
          {!mostrarFormEdu && (
            <button onClick={() => setMostrarFormEdu(true)} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors">
              <Plus className="size-3.5" /> Agregar
            </button>
          )}
        </div>

        {educacion.length === 0 && !mostrarFormEdu && (
          <p className="text-sm text-slate-400">Agrega tu formación académica.</p>
        )}

        {educacion.length > 0 && (
          <div className="space-y-4">
            {educacion.map((edu) => (
              <div key={edu.id} className="flex items-start justify-between gap-3 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="size-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{edu.titulo}</p>
                    <p className="text-xs text-slate-500">{edu.institucion}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{edu.periodo}</p>
                  </div>
                </div>
                <button onClick={() => setEducacion(prev => prev.filter(e => e.id !== edu.id))}
                  className="text-slate-300 hover:text-red-400 transition-colors shrink-0">
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {mostrarFormEdu && (
          <FormEducacion onGuardar={agregarEducacion} onCancelar={() => setMostrarFormEdu(false)} />
        )}
      </div>

      {/* ── Habilidades ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-4">Habilidades</h2>
        <div className="flex flex-wrap gap-2">
          {habilidades.map(h => (
            <SkillChip key={h} label={h} onRemove={() => setHabilidades(prev => prev.filter(s => s !== h))} />
          ))}
          {agregandoSkill ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={nuevaHabilidad}
                onChange={e => setNuevaHabilidad(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") agregarHabilidad(); if (e.key === "Escape") setAgregandoSkill(false) }}
                placeholder="Nueva habilidad"
                className="border border-violet-300 rounded-full px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 w-36"
              />
              <button onClick={agregarHabilidad} className="text-teal-500 hover:text-teal-600 transition-colors"><Check className="size-4" /></button>
              <button onClick={() => setAgregandoSkill(false)} className="text-slate-300 hover:text-slate-500 transition-colors"><X className="size-4" /></button>
            </div>
          ) : (
            <button
              onClick={() => setAgregandoSkill(true)}
              className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs text-slate-400 hover:border-violet-400 hover:text-violet-500 transition-all"
            >
              <Plus className="size-3.5" /> Agregar
            </button>
          )}
        </div>
      </div>

      {/* ── CV ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-4">Currículum Vitae</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-4 text-sm text-slate-400 hover:border-violet-400 hover:text-violet-500 transition-all">
            <Upload className="size-4" /> Subir CV (PDF)
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-4 text-sm text-slate-600 hover:bg-slate-50 transition-all">
            <Download className="size-4" /> Descargar actual
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">Formato PDF, máximo 5 MB</p>
      </div>

    </div>
  )
}
