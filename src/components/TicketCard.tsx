import { User, Phone, CheckCircle, Clock, XCircle, MoreVertical, Ticket as TicketIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Ticket } from "@/services/ticketService";

interface TicketCardProps {
  ticket: Ticket;
  onConfirmPayment: (id: string) => void;
  onMarkAsUsed: (id: string) => void;
  onRevertUsed: (id: string) => void;
}

export function TicketCard({
  ticket,
  onConfirmPayment,
  onMarkAsUsed,
  onRevertUsed,
}: TicketCardProps) {
  const isPaid = ticket.status_pagamento === "confirmado";
  const isUsed = ticket.usado;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isUsed
          ? "bg-muted/50 border-muted opacity-70"
          : isPaid
          ? "gradient-card border-success/30"
          : "gradient-card border-warning/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary shrink-0" />
            <span className="font-medium truncate">{ticket.nome}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 shrink-0" />
            <span>{ticket.telefone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <TicketIcon className="w-4 h-4 shrink-0" />
             <span className="font-semibold">{ticket.quantidade || 1} {(ticket.quantidade || 1) > 1 ? 'Ingressos' : 'Ingresso'}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {isUsed ? (
              <Badge variant="secondary" className="text-xs">
                <XCircle className="w-3 h-3 mr-1" />
                Utilizado
              </Badge>
            ) : isPaid ? (
              <Badge className="bg-success/20 text-success border-success/30 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Pago
              </Badge>
            ) : (
              <Badge className="bg-warning/20 text-warning border-warning/30 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Pendente
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(ticket.criado_em)}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            {!isPaid && (
              <DropdownMenuItem onClick={() => onConfirmPayment(ticket.id)}>
                <CheckCircle className="w-4 h-4 mr-2 text-success" />
                Confirmar pagamento
              </DropdownMenuItem>
            )}
            {isPaid && !isUsed && (
              <DropdownMenuItem onClick={() => onMarkAsUsed(ticket.id)}>
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                Marcar como usado
              </DropdownMenuItem>
            )}
            {isUsed && (
              <DropdownMenuItem onClick={() => onRevertUsed(ticket.id)}>
                <XCircle className="w-4 h-4 mr-2" />
                Reverter utilização
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
