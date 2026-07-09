"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthSessionStatus from "@/app/[locale]/(auth)/AuthSessionStatus";
import { useAuth } from "@/hooks/auth";
import {
  Button,
  Checkbox,
  FieldError,
  Input,
  Label,
} from "@/components/common/form";

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/admin",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shouldRemember, setShouldRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (router.reset?.length > 0 && Object.keys(errors).length === 0) {
      setStatus(atob(router.reset));
    } else {
      setStatus(null);
    }
  }, [router.reset, errors]);

  const submitForm = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await login({
        email,
        password,
        remember: shouldRemember,
        setErrors,
        setStatus,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthSessionStatus className="mb-4" status={status} />

      <form onSubmit={submitForm}>
        <div>
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoFocus
          />

          <FieldError messages={errors.email} />
        </div>

        <div className="mt-4">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />

          <FieldError messages={errors.password} />
        </div>

        <div className="mt-4 block">
          <label htmlFor="remember_me" className="inline-flex items-center">
            <Checkbox
              id="remember_me"
              name="remember"
              checked={shouldRemember}
              onChange={(event) => setShouldRemember(event.target.checked)}
            />

            <span className="ml-2 text-sm text-gray-600">
              Remember me
            </span>
          </label>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-600 underline hover:text-gray-900"
          >
            Forgot your password?
          </Link>

          <Button className="ml-3" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Login;