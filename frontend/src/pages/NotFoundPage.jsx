import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-applik-bg flex flex-col items-center justify-center gap-4">
            <p className="text-8xl font-bold text-slate-800">404</p>
            <p className="text-xl font-medium text-slate-600">Página no encontrada</p>
            <Button variant="primary" onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
    );
};

export default NotFoundPage;
