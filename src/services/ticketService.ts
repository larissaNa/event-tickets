import { supabase } from "@/integrations/supabase/client";

export interface Ticket {
  id: string;
  nome: string;
  telefone: string;
  status_pagamento: string;
  usado: boolean;
  criado_em: string;
  quantidade?: number;
  valor_total?: number;
}

export interface CreateTicketData {
  nome: string;
  telefone: string;
  quantidade: number;
  valor_total: number;
}

export const ticketService = {
  async create(data: CreateTicketData): Promise<Ticket> {
    // Primeiro verifica se já existe um ingresso para este telefone
    const { data: existingTickets, error: searchError } = await supabase
      .from("tickets")
      .select("*")
      .eq("telefone", data.telefone)
      .order("criado_em", { ascending: false })
      .limit(1);

    if (searchError) {
      console.error("Erro ao verificar duplicidade:", searchError);
      // Continua para criação se der erro na busca
    }

    if (existingTickets && existingTickets.length > 0) {
      // Se já existe, retorna o existente (pode-se adicionar lógica para atualizar quantidade se necessário)
      // Por enquanto, mantém a lógica de não criar duplicata
      return existingTickets[0];
    }

    // Se não existe, cria um novo
    const { data: ticket, error } = await supabase
      .from("tickets")
      .insert({
        ...data,
        status_pagamento: 'pendente',
        usado: false
      })
      .select()
      .single();

    if (error) throw error;
    return ticket;
  },

  async getById(id: string): Promise<Ticket | null> {
    const { data: ticket, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return ticket;
  },

  async getAll(): Promise<Ticket[]> {
    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) throw error;
    return tickets || [];
  },

  async search(query: string): Promise<Ticket[]> {
    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("*")
      .or(`nome.ilike.%${query}%,telefone.ilike.%${query}%`)
      .order("criado_em", { ascending: false });

    if (error) throw error;
    return tickets || [];
  },

  async confirmPayment(id: string): Promise<Ticket> {
    const { data: ticket, error } = await supabase
      .from("tickets")
      .update({ status_pagamento: "confirmado" })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return ticket;
  },

  async markAsUsed(id: string): Promise<Ticket> {
    const { data: ticket, error } = await supabase
      .from("tickets")
      .update({ usado: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return ticket;
  },

  async revertUsed(id: string): Promise<Ticket> {
    const { data: ticket, error } = await supabase
      .from("tickets")
      .update({ usado: false })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return ticket;
  },
};
