// import { useParams, Navigate, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";

// import UpdateUserPasswordForm from "@/features/users/components/UpdateUserPasswordForm";
// import { updateUserPasswordAPI } from "@/features/users/api/UserAPI";
// import type { UpdateUserPasswordSchema } from "@/features/users/schemas/types";

// export default function UpdateUserPasswordView() {
//   const { userId } = useParams<{ userId: string }>();
//   const navigate = useNavigate();

  
//   const {
//       register,
//       handleSubmit,
//       formState: { errors },
//     } = useForm<UpdateUserPasswordSchema>({
//         mode: "onChange",
//     });
    
//     const { mutate } = useMutation({
//         mutationFn: updateUserPasswordAPI,
//         onSuccess: (response) => {
//             toast.success(response);
//             navigate("/user");
//         },
//         onError: (error: Error) => toast.error(error.message),
//     });
    
//     if (!userId) return <Navigate to="/404" />;
    
//     const onSubmit = (data: UpdateUserPasswordSchema) => {
//         mutate({
//             userId: Number(userId),
//             newPassword: data,
//         });
//     };
    

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} noValidate>
//       <UpdateUserPasswordForm register={register} errors={errors} />
//     </form>
//   );
// }
