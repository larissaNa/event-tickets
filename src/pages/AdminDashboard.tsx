import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Ticket, CheckCircle, Clock, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { TicketCard } from "@/components/TicketCard";
import { ticketService, Ticket as TicketType } from "@/services/ticketService";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchTickets = useCallback(async () => {
    try {
      const data = await ticketService.getAll();
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.error("Erro ao buscar ingressos:", error);
      toast.error("Erro ao carregar ingressos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Check auth
    const checkAuth = async () => {
      const session = await authService.getSession();
      if (!session) {
        navigate("/admin");
        return;
      }
      fetchTickets();
    };

    const { data: { subscription } } = authService.onAuthStateChange((session) => {
      if (!session) {
        navigate("/admin");
      }
    });

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, fetchTickets]);

  useEffect(() => {
    if (search.trim()) {
      const filtered = tickets.filter(
        (t) =>
          t.nome.toLowerCase().includes(search.toLowerCase()) ||
          t.telefone.includes(search)
      );
      setFilteredTickets(filtered);
    } else {
      setFilteredTickets(tickets);
    }
  }, [search, tickets]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const handleLogout = async () => {
    await authService.signOut();
    navigate("/admin");
  };

  const handleConfirmPayment = async (id: string) => {
    try {
      const ticket = tickets.find(t => t.id === id);
      await ticketService.confirmPayment(id);
      toast.success("Pagamento confirmado!");
      
      if (ticket) {
        // Formata o telefone para o padrão internacional (remove não dígitos e adiciona 55 se necessário)
        let phone = ticket.telefone.replace(/\D/g, '');
        if (phone.length <= 11) {
          phone = `55${phone}`;
        }

        const ticketLink = `${window.location.origin}/ingresso/${ticket.id}`;
        const message = `Olá ${ticket.nome}, seu pagamento foi confirmado! 🎟️\n\nAcesse seu ingresso aqui: ${ticketLink}`;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        
        // Abre o WhatsApp em uma nova aba
        window.open(whatsappUrl, '_blank');
      }

      fetchTickets();
    } catch (error) {
      toast.error("Erro ao confirmar pagamento");
    }
  };

  const handleMarkAsUsed = async (id: string) => {
    try {
      await ticketService.markAsUsed(id);
      toast.success("Ingresso marcado como utilizado!");
      fetchTickets();
    } catch (error) {
      toast.error("Erro ao marcar ingresso");
    }
  };

  const handleRevertUsed = async (id: string) => {
    try {
      await ticketService.revertUsed(id);
      toast.success("Utilização revertida!");
      fetchTickets();
    } catch (error) {
      toast.error("Erro ao reverter utilização");
    }
  };

  // Stats
  const stats = {
    total: tickets.length,
    paid: tickets.filter((t) => t.status_pagamento === "confirmado").length,
    pending: tickets.filter((t) => t.status_pagamento === "pendente").length,
    used: tickets.filter((t) => t.usado).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-display font-bold">Painel Admin</h1>
                <p className="text-xs text-muted-foreground">
                  Gestão de ingressos
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<Users className="w-4 h-4" />}
            label="Total"
            value={stats.total}
            color="primary"
          />
          <StatCard
            icon={<CheckCircle className="w-4 h-4" />}
            label="Pagos"
            value={stats.paid}
            color="success"
          />
          <StatCard
            icon={<Clock className="w-4 h-4" />}
            label="Pendentes"
            value={stats.pending}
            color="warning"
          />
          <StatCard
            icon={<Ticket className="w-4 h-4" />}
            label="Usados"
            value={stats.used}
            color="muted"
          />
        </div>

        {/* Search and refresh */}
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Buscar por nome ou telefone..."
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-12 w-12 shrink-0 border-border"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Tickets list */}
        <div className="space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {search ? "Nenhum ingresso encontrado" : "Nenhum ingresso vendido ainda"}
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onConfirmPayment={handleConfirmPayment}
                onMarkAsUsed={handleMarkAsUsed}
                onRevertUsed={handleRevertUsed}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "primary" | "success" | "warning" | "muted";
}) {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    muted: "text-muted-foreground bg-muted",
  };

  return (
    <div className="gradient-card rounded-xl border border-border p-3">
      <div
        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${colorClasses[color]}`}
      >
        {icon}
      </div>
      <p className="text-2xl font-display font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
