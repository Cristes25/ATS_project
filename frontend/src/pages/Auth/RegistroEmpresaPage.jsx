import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2, Mail, Lock, User, MapPin, CheckCircle2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

const sectores = ["Tecnología", "Marketing", "Finanzas", "Manufactura", "Salud", "Educación", "Retail", "Otro"];

const RegistroEmpresaPage = () => {
    const [empresa,       setEmpresa]       = useState("");
    const [sector,        setSector]        = useState("");
    const [nombreContacto, setNombreContacto] = useState("");
    const [email,         setEmail]         = useState("");
    const [password,      setPassword]      = useState("");
    const [confirmar,     setConfirmar]     = useState("");
    const [showPassword,  setShowPassword]  = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);
    const [error,         setError]         = useState("");

    const { login } = useAuth();
    const navigate  = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmar) {
            setError("Las contraseñas no coinciden");
            return;
        }
        setError("");
        // Mock registro hasta conectar backend
        login({ id: Date.now(), name: nombreContacto, email, role: "reclutador", tenant_name: empresa, avatar_color: "from-blue-500 to-blue-700" });
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* ── Panel izquierdo ── */}
            <div className="hidden md:flex md:w-[55%] lg:w-[58%] flex-col justify-between p-10 relative overflow-hidden"
                style={{ background: "linear-gradient(150deg, #4E6CF0 0%, #514990 60%, #1e3a65 100%)" }}>

                <div className="flex items-center gap-2.5">
                    <Logo className="w-9 h-9" />
                    <span className="text-white text-xl font-bold tracking-wide">APPLIK</span>
                </div>

                <div className="space-y-4 flex flex-col items-center text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight w-full">
                        Encuentra el talento<br />que tu empresa necesita
                    </h1>
                    <p className="text-blue-200 text-sm lg:text-base leading-relaxed max-w-sm">
                        Publica vacantes, recibe aplicaciones y encuentra al candidato ideal con el poder del Match IA.
                    </p>

                    {/* Beneficios */}
                    <div className="w-full max-w-sm space-y-3 mt-4">
                        {[
                            "IA que filtra y rankea candidatos automáticamente",
                            "Panel de reclutamiento con métricas en tiempo real",
                            "Gestión completa del pipeline de selección",
                        ].map((b, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-left">
                                <CheckCircle2 className="size-4 text-blue-300 shrink-0" />
                                <span className="text-white text-sm">{b}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-blue-300 text-xs">
                    © 2026 Applik. Plataforma de reclutamiento impulsada por IA.
                </p>

                <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
            </div>

            {/* ── Panel derecho ── */}
            <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 py-10 sm:px-10 overflow-y-auto">

                {/* Logo mobile */}
                <div className="flex md:hidden flex-col items-center gap-3 mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(150deg, #4E6CF0 0%, #514990 100%)" }}>
                        <div style={{ filter: "brightness(0) invert(1)" }}>
                            <Logo className="w-9 h-9" />
                        </div>
                    </div>
                    <span className="text-slate-900 text-xl font-bold tracking-wide">APPLIK</span>
                </div>

                <div className="w-full max-w-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1 text-center md:text-left">Registrar empresa</h2>
                    <p className="text-slate-500 text-sm mb-6 text-center md:text-left">Crea tu cuenta empresarial y empieza a reclutar.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Nombre empresa */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre de la empresa</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Nombre de tu empresa"
                                    value={empresa}
                                    onChange={(e) => setEmpresa(e.target.value)}
                                    required
                                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Sector */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sector</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <select
                                    value={sector}
                                    onChange={(e) => setSector(e.target.value)}
                                    required
                                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all appearance-none bg-white"
                                >
                                    <option value="" disabled>Selecciona un sector</option>
                                    {sectores.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Nombre contacto */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del contacto</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    value={nombreContacto}
                                    onChange={(e) => setNombreContacto(e.target.value)}
                                    required
                                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo corporativo</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="contacto@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mínimo 8 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" tabIndex={-1}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmar contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    type={showConfirmar ? "text" : "password"}
                                    placeholder="Repite tu contraseña"
                                    value={confirmar}
                                    onChange={(e) => { setConfirmar(e.target.value); setError("") }}
                                    required
                                    className={`w-full border rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                                        error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:ring-blue-400 focus:border-transparent"
                                    }`}
                                />
                                <button type="button" onClick={() => setShowConfirmar(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" tabIndex={-1}>
                                    {showConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
                        </div>

                        <button type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98] text-sm mt-2">
                            Crear cuenta empresarial
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Iniciar sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistroEmpresaPage;
