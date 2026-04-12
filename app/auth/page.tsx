"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import {
  validateEmail,
  validatePassword,
  validateNickname,
} from "@/lib/utils";
import { Shield, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, loading } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Некорректный email");
      return;
    }

    if (!validatePassword(password)) {
      setError("Пароль минимум 6 символов");
      return;
    }

    if (mode === "register" && !validateNickname(nickname)) {
      setError("Никнейм: 3-15 символов, только буквы и цифры");
      return;
    }

    if (mode === "login") {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        setError(authError);
      } else {
        router.push("/missions");
      }
    } else {
      const { error: authError } = await signUp(email, password, nickname);
      if (authError) {
        setError(authError);
      } else {
        router.push("/missions");
      }
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-4 neon-glow">
            <Shield size={32} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-gradient">КИБЕРЩИТ</h1>
          <p className="text-muted text-sm mt-1 font-mono">
            {mode === "login" ? "Вход в систему" : "Создать аккаунт"}
          </p>
        </div>

        <div className="flex mb-6 bg-background rounded-btn p-1 border border-card-border">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2 rounded-btn text-sm font-semibold transition-all ${
              mode === "login"
                ? "bg-accent text-foreground neon-glow"
                : "text-muted hover:text-foreground"
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2 rounded-btn text-sm font-semibold transition-all ${
              mode === "register"
                ? "bg-accent text-foreground neon-glow"
                : "text-muted hover:text-foreground"
            }`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="password"
              placeholder="Пароль (мин. 6 символов)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              disabled={loading}
            />
          </div>

          {mode === "register" && (
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Никнейм (3-15 символов)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="input-field pl-10"
                autoComplete="nickname"
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-error text-sm font-mono bg-error/10 p-3 rounded-btn">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-btn font-semibold text-foreground transition-all disabled:opacity-50"
            style={{
              background: loading
                ? "#0066CC"
                : "linear-gradient(135deg, #0066CC, #00CC66)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Загрузка...
              </span>
            ) : mode === "login" ? (
              "Войти"
            ) : (
              "Зарегистрироваться"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={switchMode}
            className="text-muted text-sm hover:text-foreground transition-colors"
          >
            {mode === "login"
              ? "Нет аккаунта? Зарегистрируйся"
              : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}
