import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Ticket } from "lucide-react";

interface TicketFormProps {
  onSubmit: (data: { nome: string; telefone: string; quantidade: number }) => Promise<void>;
  isLoading: boolean;
}

export function TicketForm({ onSubmit, isLoading }: TicketFormProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const TICKET_PRICE = 30;

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) return;
    await onSubmit({ nome: nome.trim(), telefone, quantidade });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome" className="text-foreground/90">
          Nome completo
        </Label>
        <Input
          id="nome"
          type="text"
          placeholder="Digite seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="h-12 bg-secondary border-border focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone" className="text-foreground/90">
          WhatsApp
        </Label>
        <Input
          id="telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          value={telefone}
          onChange={handlePhoneChange}
          maxLength={15}
          required
          className="h-12 bg-secondary border-border focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantidade" className="text-foreground/90">
          Quantidade de Ingressos
        </Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-12 text-xl"
            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
          >
            -
          </Button>
          <Input
            id="quantidade"
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-12 text-center text-lg bg-secondary border-border focus:border-primary focus:ring-primary"
          />
          <Button
            type="button"
            variant="outline"
            className="h-12 w-12 text-xl"
            onClick={() => setQuantidade(quantidade + 1)}
          >
            +
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-right">
          Total: R$ {(quantidade * TICKET_PRICE).toFixed(2)}
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !nome.trim() || !telefone.trim()}
        className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity shadow-glow"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : (
          <Ticket className="w-5 h-5 mr-2" />
        )}
        {isLoading ? "Gerando ingresso..." : `Gerar ${quantidade > 1 ? 'ingressos' : 'ingresso'} - R$ ${(quantidade * TICKET_PRICE).toFixed(2)}`}
      </Button>
    </form>
  );
}
