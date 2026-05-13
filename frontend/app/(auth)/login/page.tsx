"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/types";
import styles from "./AuthForm.module.css";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const setUser = useAuthStore((s) => s.setUser);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const { success, error } = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.login(data);
      setUser(res.user);
      await fetchCart();
      success("Welcome back!");
      router.push(callbackUrl);
    } catch (err: unknown) {
      const e = err as ApiError;
      error(e.message ?? "Login failed");
    }
  };

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>Sign In</h1>
      <p className={styles.subtitle}>Welcome back to KritimStore</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.fields}>
        <Input label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" autoComplete="current-password" {...register("password")} error={errors.password?.message} />
        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>Sign In</Button>
      </form>
      <p className={styles.switch}>
        Don&apos;t have an account?{" "}
        <Link href="/register" className={styles.switchLink}>Create one</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.form}><p>Loading…</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
