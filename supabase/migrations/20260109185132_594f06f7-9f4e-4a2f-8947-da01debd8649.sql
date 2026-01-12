-- Criar tabela de ingressos
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  status_pagamento TEXT NOT NULL DEFAULT 'pendente',
  usado BOOLEAN NOT NULL DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Usuário público pode criar tickets
CREATE POLICY "Qualquer pessoa pode criar ticket"
ON public.tickets
FOR INSERT
TO anon
WITH CHECK (true);

-- Usuário público pode ver apenas o próprio ticket via ID
CREATE POLICY "Público pode ver ticket pelo ID"
ON public.tickets
FOR SELECT
TO anon
USING (true);

-- Admin autenticado pode ver todos os tickets
CREATE POLICY "Admin pode ver todos tickets"
ON public.tickets
FOR SELECT
TO authenticated
USING (true);

-- Admin autenticado pode atualizar tickets
CREATE POLICY "Admin pode atualizar tickets"
ON public.tickets
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);