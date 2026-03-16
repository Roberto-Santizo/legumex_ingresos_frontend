import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import type { LoginRequest } from "@/features/auth/schemas/types";
import { loginApi } from "@/features/auth/api/LoginAPI";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ErrorMessage } from "@/shared/components/ErrorMessage";

export default function LoginView() {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({ mode: "onChange" });

  // CRÍTICO: Limpiar TODO al montar el componente de login
  useEffect(() => {
    localStorage.clear();
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      // Limpiar y guardar nuevo token
      localStorage.clear();
      localStorage.setItem("token", response.token);
      
      toast.success("Login exitoso");
      
      // Recargar página para estado completamente limpio
      window.location.href = "/visits";
    },
  });
  
  const onSubmit = (formData: LoginRequest) => {
    mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-slate-600/10"></div>
            <div className="relative">
              <div>
                <img 
                  src={import.meta.env.VITE_IMAGE_LOGO} 
                  alt="Legumex Logo" 
                  className="w-28 h-16 mx-auto object-contain" 
                />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                Legumex Apps
              </h1>
              <p className="text-slate-300 text-sm font-medium">
                Departamento de Rercursos Humanos
              </p>
            </div>
          </div>

          <form
            className="px-8 py-8"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="on"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Iniciar Sesión
              </h2>
              <p className="text-sm text-slate-500">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label 
                  htmlFor="username" 
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    autoComplete="username"
                    disabled={isPending}
                    className="pl-12 pr-4 py-3 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    {...register("username", {
                      required: "El usuario es obligatorio",
                    })}
                  />
                  {errors.username && (
                    <ErrorMessage>{errors.username.message}</ErrorMessage>
                  )}
                </div>
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    disabled={isPending}
                    className="pl-12 pr-12 py-3 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                    })}
                  />
                  {errors.password && (
                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isPending}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white font-semibold py-3.5 text-base rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          © 2026 Legumex Apps. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}