import CircularProgress from "@mui/material/CircularProgress";

type SpinnerProps = {
  size?: number;
  thickness?: number;
  fullScreen?: boolean;
};

export function Spinner({
  size = 24,
  thickness = 4,
  fullScreen = false,
}: SpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : ""
      }`}
    >
      <CircularProgress size={size} thickness={thickness} />
    </div>
  );
}
