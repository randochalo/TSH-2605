"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { 
  Download, 
  Share2, 
  X, 
  QrCode,
  Printer
} from "lucide-react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  title?: string;
  description?: string;
}

export function QRCodeDisplay({ value, size = 200, title, description }: QRCodeDisplayProps) {
  const [showModal, setShowModal] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        title="View QR Code"
      >
        <QrCode className="w-5 h-5 text-slate-600" />
      </motion.button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">QR Code</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div ref={qrRef} className="p-4 bg-white rounded-lg border border-slate-200">
                <QRCodeSVG
                  value={value}
                  size={size}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/logo.png",
                    height: 30,
                    width: 30,
                    excavate: true,
                  }}
                />
              </div>

              {title && <p className="mt-4 font-medium text-slate-900">{title}</p>}
              {description && <p className="text-sm text-slate-500">{description}</p>}

              <div className="flex gap-2 mt-6 w-full">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => alert("Share functionality coming soon!")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

// QR Code with Asset Info
interface AssetQRCodeProps {
  assetId: string;
  assetName: string;
  assetCode: string;
  location?: string;
}

export function AssetQRCode({ assetId, assetName, assetCode, location }: AssetQRCodeProps) {
  const qrData = JSON.stringify({
    id: assetId,
    code: assetCode,
    name: assetName,
    location: location || "",
    url: `${typeof window !== "undefined" ? window.location.origin : ""}/ems/assets/${assetId}`,
  });

  return (
    <QRCodeDisplay
      value={qrData}
      title={assetName}
      description={`Code: ${assetCode}`}
      size={180}
    />
  );
}

// QR Code Badge for lists
export function QRCodeBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <QRCodeDisplay value={value} size={128} title={label} />
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}
