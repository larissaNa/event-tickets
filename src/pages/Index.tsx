import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Sparkles } from "lucide-react";
import { TicketForm } from "@/components/TicketForm";
import { PixQRCode } from "@/components/PixQRCode";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ticketService } from "@/services/ticketService";
import { toast } from "sonner";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (data: { nome: string; telefone: string; quantidade: number }) => {
    setIsLoading(true);
    try {
      const ticketData = {
        ...data,
        valor_total: data.quantidade * 30
      };
      
      const ticket = await ticketService.create(ticketData);
      
      // Se o ingresso já estiver confirmado, redireciona direto para a página do ingresso
      if (ticket.status_pagamento === "confirmado") {
        navigate(`/ingresso/${ticket.id}`);
        return;
      }

      setTicketId(ticket.id);
      setQuantity(data.quantidade);
      setShowPayment(true);
      toast.success("Ingresso encontrado/gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar ingresso:", error);
      toast.error("Erro ao gerar ingresso. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTicket = () => {
    if (ticketId) {
      navigate(`/ingresso/${ticketId}`);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/logo.png" alt="Logo" className="w-32 h-32 object-contain" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">
            <span className="text-gradient">Compre seu Ingresso</span>
          </h1>
          <p className="text-muted-foreground">
            Preencha seus dados e efetue o pagamento via Pix
          </p>
        </div>

        {/* Main Card */}
        <div className="gradient-card rounded-2xl border border-border p-6 shadow-card animate-slide-up">
          {!showPayment ? (
            <TicketForm onSubmit={handleSubmit} isLoading={isLoading} />
          ) : (
            <div className="space-y-6">
              {/* Success message */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/20 mb-2">
                  <Sparkles className="w-6 h-6 text-success" />
                </div>
                <h2 className="font-display text-xl font-semibold">
                  Ingresso Reservado!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Agora faça o pagamento via Pix para confirmar
                </p>
              </div>

              {/* Pix QR Code */}
              <div className="space-y-4">
                <h3 className="text-center font-medium text-foreground/90">
                  Escaneie o QR Code Pix - R$ {(quantity * 30).toFixed(2)}
                </h3>
                <PixQRCode quantity={quantity} />
              </div>

              {/* Instructions */}
              <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-sm">Após o pagamento:</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Tire print do comprovante</li>
                  <li>Envie pelo WhatsApp abaixo</li>
                  <li>Aguarde a confirmação</li>
                </ol>
              </div>

              {/* WhatsApp Button */}
              <WhatsAppButton />

              {/* View Ticket */}
              <button
                onClick={handleViewTicket}
                className="w-full text-center text-sm text-primary hover:underline py-2"
              >
                Ver meu ingresso →
              </button>
            </div>
          )}
        </div>

        {/* Admin link */}
        <div className="text-center mt-8">
          <a
            href="/admin"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Área administrativa
          </a>
        </div>
      </div>
    </div>
  );
}