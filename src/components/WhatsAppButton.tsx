import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "5586998003577";
const WHATSAPP_MESSAGE = "Olá, acabei de efetuar o pagamento do ingresso. Segue o comprovante.";

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <Button
      asChild
      className="w-full h-14 text-lg font-semibold bg-[#25D366] hover:bg-[#20BA5C] text-white"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="w-5 h-5 mr-2" />
        Enviar comprovante via WhatsApp
      </a>
    </Button>
  );
}
