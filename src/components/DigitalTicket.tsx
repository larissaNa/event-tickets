import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Ticket as TicketIcon, Calendar, User, Phone, CheckCircle, Clock, Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Ticket } from "@/services/ticketService";
import { toast } from "sonner";

interface DigitalTicketProps {
  ticket: Ticket;
}

export function DigitalTicket({ ticket }: DigitalTicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const ticketUrl = `https://event-tickets-seven.vercel.app/ingresso/${ticket.id}`;
  const isPaid = ticket.status_pagamento === "confirmado";
  const isUsed = ticket.usado;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = async (type: 'png' | 'pdf') => {
    if (!ticketRef.current) return;
    setIsExporting(true);

    try {
      // Add a small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: "#ffffff", // Force white background if transparent
        useCORS: true, // Allow loading cross-origin images if any
        logging: false,
      });

      if (type === 'png') {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `ingresso-${ticket.nome}-${ticket.id}.png`;
        link.click();
        toast.success("Ingresso baixado com sucesso!");
      } else {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate PDF dimensions to match image aspect ratio
        // Using points (pt) is standard for PDF. 
        // We'll set the PDF page size to match the image dimensions in points
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? "landscape" : "portrait",
          unit: "px",
          format: [imgWidth, imgHeight]
        });

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`ingresso-${ticket.nome}-${ticket.id}.pdf`);
        toast.success("Ingresso exportado como PDF!");
      }
    } catch (error) {
      console.error("Erro ao exportar ingresso:", error);
      toast.error("Erro ao exportar o ingresso. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        ref={ticketRef} 
        className="relative overflow-hidden rounded-2xl gradient-card border border-border shadow-card animate-fade-in bg-background"
      >
        {/* Header */}
        <div className="bg-background/95 p-6 text-center border-b border-border/50 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <span className="font-display font-bold text-xl text-foreground">INGRESSO DIGITAL</span>
          </div>
          <p className="text-sm text-muted-foreground">Apresente este QR Code na entrada</p>
        </div>

        {/* Decorative notches */}
        <div className="absolute left-0 top-[140px] w-6 h-6 bg-background rounded-full -translate-x-1/2 border-r border-border/50" />
        <div className="absolute right-0 top-[140px] w-6 h-6 bg-background rounded-full translate-x-1/2 border-l border-border/50" />

        {/* Content */}
        <div className="p-6 space-y-6 bg-white/50 dark:bg-black/20">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {isUsed ? (
              <Badge className="bg-muted text-muted-foreground">
                Ingresso Utilizado
              </Badge>
            ) : isPaid ? (
              <Badge className="bg-success/20 text-success border-success/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Pagamento Confirmado
              </Badge>
            ) : (
              <Badge className="bg-warning/20 text-warning border-warning/30">
                <Clock className="w-3 h-3 mr-1" />
                Aguardando Pagamento
              </Badge>
            )}
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className={`bg-white p-4 rounded-xl shadow-sm transition-opacity ${isUsed ? 'opacity-50' : ''}`}>
              <QRCodeSVG
                value={ticketUrl}
                size={200}
                level="H"
                includeMargin
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Ticket Info */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 text-foreground/80">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium">{ticket.nome}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/80">
              <Phone className="w-4 h-4 text-primary" />
              <span>{ticket.telefone}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/80">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm">{formatDate(ticket.criado_em)}</span>
            </div>
          </div>

          {/* Ticket ID */}
          <div className="text-center pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-mono">
              ID: {ticket.id}
            </p>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3 justify-center">
        <Button 
          onClick={() => handleDownload('png')} 
          variant="outline" 
          className="flex-1"
          disabled={isExporting}
        >
          {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          Baixar PNG
        </Button>
        <Button 
          onClick={() => handleDownload('pdf')} 
          variant="outline" 
          className="flex-1"
          disabled={isExporting}
        >
          {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          Baixar PDF
        </Button>
      </div>
    </div>
  );
}
