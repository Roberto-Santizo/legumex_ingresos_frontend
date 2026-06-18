import CircularProgress from "@mui/material/CircularProgress";

type SpinnerProps = {
  size?: number;
  thickness?: number;
  fullScreen?: boolean;
  label?: string;
};

export function Spinner({
  size = 36,
  thickness = 4,
  fullScreen = false,
  label = "Cargando...",
}: SpinnerProps) {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="flex flex-col items-center gap-4 bg-white px-10 py-8 rounded-2xl shadow-xl border border-slate-200">
          <CircularProgress size={52} thickness={4} sx={{ color: "#f59e0b" }} />
          <p className="text-sm font-semibold text-slate-500 tracking-widest uppercase">
            {label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <CircularProgress size={size} thickness={thickness} sx={{ color: "#f59e0b" }} />
    </div>
  );
}
