// Los estados pueden cambiar desde otra sesion o por el cierre automatico.
// Estas consultas no deben heredar los cinco minutos de vigencia globales.
export const liveVisitQueryOptions = {
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 15_000,
} as const
