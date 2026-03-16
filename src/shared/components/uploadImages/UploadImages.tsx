import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/shared/components/ui/button";

type Props = {
  onClose: () => void;
  onSave: (imgBase64: string) => void;
};


export default function UploadImagenes({ onClose, onSave }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(true);

  const capture = useCallback(() => {
    const img = webcamRef.current?.getScreenshot();
    if (img) {
      setPreview(img);
      setCameraActive(false);
    }
  }, []);

  /* ======================================================
     IMAGE UPLOAD (FILE INPUT)
     - Desktop: Opens file explorer
     - Mobile: Opens gallery / camera
  ====================================================== */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande. Máximo 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setCameraActive(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6">

        <h2 className="mb-4 text-lg font-semibold">Tomar o subir imagen</h2>

        {cameraActive && !preview && (
          <>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg"
              videoConstraints={{ facingMode: "environment" }}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <Button onClick={capture}>📸 Tomar foto</Button>
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                📁 Subir imagen
              </Button>

              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </>
        )}

        {preview && (
          <>
            <img src={preview} alt="Vista previa" className="w-full rounded-lg" />

            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setPreview(null);
                  setCameraActive(true);
                }}
              >
                🔄 Retomar
              </Button>

              <Button
                onClick={() => {
                  onSave(preview);
                  onClose();
                }}
              >
                💾 Guardar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}