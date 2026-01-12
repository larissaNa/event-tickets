import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface PixQRCodeProps {
  quantity: number;
}

export function PixQRCode({ quantity }: PixQRCodeProps) {
  const [copied, setCopied] = useState(false);
  const PIX_CODE = "03348965330"; // Chave Pix para cópia

  // Seleciona a imagem do QR Code baseada na quantidade
  // Se for 1 ingresso, usa QRCODE30.jpg (R$ 30,00)
  // Se for mais de 1, usa QRCODE.jpg (valor a definir/somar)
  const qrCodeImage = quantity === 1 ? "/QRCODE30.jpg" : "/QRCODE.jpg";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CODE);
      setCopied(true);
      toast.success("Chave Pix copiada!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar código");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-card w-full max-w-[220px]">
        <img 
          src={qrCodeImage} 
          alt="QR Code Pix" 
          className="w-full h-auto rounded-lg object-contain"
        />
      </div>
      
      <Button
        variant="outline"
        onClick={handleCopy}
        className="w-full border-border hover:bg-secondary"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2 text-success" />
            Copiado!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copiar Chave Pix
          </>
        )}
      </Button>
    </div>
  );
}
