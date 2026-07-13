"use client";

import { useEffect, useState } from "react";

export default function RegimeAuthGate({ children }) {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/regime", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (res.ok && data.ok) {
          setIsAuthed(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/regime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.message || "パスワードが違います");
        return;
      }

      setIsAuthed(true);
      setPassword("");
    } catch (error) {
      console.error("Authentication error:", error);
      setError("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
        }}
      >
        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          認証状態を確認しています...
        </p>
      </main>
    );
  }

  if (isAuthed) {
    return children;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          border: "1px solid rgba(148, 163, 184, 0.35)",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
        }}
      >
        <h1
          style={{
            marginBottom: "8px",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          Password
        </h1>

        <p
          style={{
            marginBottom: "20px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          このページを表示するにはパスワードを入力してください。
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            fontSize: "16px",
            outline: "none",
            marginBottom: "14px",
          }}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            background: "#0f172a",
            color: "#fff",
            fontWeight: 700,
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "確認中..." : "表示する"}
        </button>

        {error && (
          <p
            style={{
              marginTop: "12px",
              color: "#dc2626",
              fontSize: "14px",
            }}
          >
            {error}
          </p>
        )}
      </form>
    </main>
  );
}