import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold text-red-600">403</h1>
      <p className="text-lg text-gray-600">No tienes permiso para acceder a esta sección.</p>
      <Link to="/visits" className="text-blue-500 underline">Volver al inicio</Link>
    </div>
  );
}
