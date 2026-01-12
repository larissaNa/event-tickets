import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { authService } from "@/services/authService";

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const checkSession = async () => {
      const session = await authService.getSession();
      if (session) {
        navigate("/admin/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.signIn(email, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError("Email ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-secondary border border-border mb-4 p-2">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display text-2xl font-bold">
            Área Administrativa
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Faça login para gerenciar ingressos
          </p>
        </div>

        {/* Login Card */}
        <div className="gradient-card rounded-2xl border border-border p-6 shadow-card">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Voltar para compra
          </a>
        </div>
      </div>
    </div>
  );
}
