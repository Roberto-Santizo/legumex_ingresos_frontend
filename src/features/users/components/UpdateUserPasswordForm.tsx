// import type { FieldErrors, UseFormRegister } from "react-hook-form";
// import { Link } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import { useState } from "react";

// import { ErrorMessage } from "@/shared/components/ErrorMessage";
// // import type { UpdateUserPasswordSchema} from "@/features/users/schemas/types";

// // type CreateUserFormProps = {
// //   register: UseFormRegister<UpdateUserPasswordSchema>;
// //   errors: FieldErrors<UpdateUserPasswordSchema>;
// // };

// export default function UpdateUserPasswordForm({register,errors,}: CreateUserFormProps) {
//   const [showPassword, setShowPassword] = useState<boolean>(false);
  
// return (
//   <div className="min-h-screen bg-[var(--color-bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
//     <div className="max-w-2xl mx-auto">

//       {/* Título */}
//       <div className="text-center mb-8">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] bg-clip-text text-transparent mb-3">
//           Editar Contraseña
//         </h1>
//       </div>

//       {/* Botón regresar */}
//       <div className="mb-6">
//         <Link
//           to="/user"
//           className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-primary-dark)] font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-[var(--color-bg-secondary)] transition-all duration-200 border border-[var(--color-border-light)]"
//         >
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M10 19l-7-7m0 0l7-7m-7 7h18"
//             />
//           </svg>
//           Regresar
//         </Link>
//       </div>

//       {/* Card */}
//       <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border-light)] overflow-hidden">
//         <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] h-2"></div>

//         <div className="p-8 space-y-6">

//           <div className="form-group">
//             <label htmlFor="newPassword" className="form-label">
//               Contraseña <span className="required">*</span>
//             </label>

//             <div className="relative">
//               <input
//                 id="newPassword"
//                 type={showPassword ? "text" : "password"}
//                 className={`form-input pr-12 ${
//                   errors.newPassword
//                     ? "form-input-error"
//                     : "form-input-normal"
//                 }`}
//                 {...register("newPassword", {
//                   required: "La contraseña es obligatoria",
//                 })}
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-1/2 -translate-y-1/2
//                            text-slate-400 hover:text-slate-600 transition-colors"
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>

//             {errors.newPassword && (
//               <ErrorMessage>{errors.newPassword.message}</ErrorMessage>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] hover:from-[var(--color-primary-darker)] hover:to-[var(--color-primary-dark)] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-[var(--shadow-amber)] transform hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide"
//           >
//             Cambiar Contraseña
//           </button>

//         </div>
//       </div>

//     </div>
//   </div>
// );

// }
