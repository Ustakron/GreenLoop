"use client";

import { useEffect, useRef, useState } from "react";
import { aiWasteDetectionLiveCamera, type AiWasteDetectionOutput } from "@/ai/flows/ai-waste-detection-live-camera";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";

interface CameraScannerProps {
  active: boolean;
  onDetection: (output: AiWasteDetectionOutput) => void;
}

export function CameraScanner({ active, onDetection }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);
      } catch (err) {
        console.error("Camera error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    }

    if (active) {
      setupCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [active]);

  async function captureFrame() {
    if (!videoRef.current || !canvasRef.current || isScanning) return;

    setIsScanning(true);
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const dataUri = canvasRef.current.toDataURL("image/jpeg", 0.8);

    try {
      const result = await aiWasteDetectionLiveCamera({ photoDataUri: dataUri });
      if (result) {
        onDetection(result);
      }
    } catch (err) {
      console.error("Detection error:", err);
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="relative w-full aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl">
      {error ? (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-white">
          <p className="mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute inset-0 border-[2px] border-white/30 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-2xl animate-pulse" />
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button
              onClick={captureFrame}
              disabled={isScanning}
              className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                isScanning ? "bg-white/50 scale-90" : "bg-primary scale-100 hover:scale-105"
              }`}
            >
              {isScanning ? (
                <RefreshCw className="text-white animate-spin" size={32} />
              ) : (
                <Camera className="text-white" size={32} />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
