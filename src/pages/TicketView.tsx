import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { DigitalTicket } from "@/components/DigitalTicket";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ticketService, Ticket } from "@/services/ticketService";

export default function TicketView() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      
      try {
        const data = await ticketService.getById(id);
        if (data) {
          setTicket(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erro ao buscar ingresso:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-display font-bold mb-2">
            Ingresso não encontrado
          </h1>
          <p className="text-muted-foreground mb-4">
            Verifique se o link está correto
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const isPending = ticket.status_pagamento === "pendente";

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-md mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Comprar outro ingresso
        </Link>

        {/* Digital Ticket */}
        <DigitalTicket ticket={ticket} />

        {/* Payment reminder */}
        {isPending && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 text-center">
              <p className="text-sm text-warning">
                Seu pagamento ainda não foi confirmado. Envie o comprovante para liberar o ingresso.
              </p>
            </div>
            <WhatsAppButton />
          </div>
        )}
      </div>
    </div>
  );
}
