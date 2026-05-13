"use client";

import { useRouter } from "next/navigation";
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
import styles from "../login/AuthForm.module.css";

const schema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const { success, error } = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.register({ username: data.username, email: data.email, password: data.password });
      setUser(res.user);
      await fetchCart();
      success("Account created! Welcome to KritimStore.");
      router.push("/");
    } catch (err: unknown) {
      const e = err as ApiError;
      error(e.message ?? "Registration failed");
    }
  };

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>Create Account</h1>
      <p className={styles.subtitle}>Join KritimStore today</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.fields}>
        <Input label="Username" autoComplete="username" {...register("username")} error={errors.username?.message} />
        <Input label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" autoComplete="new-password" {...register("password")} error={errors.password?.message} />
        <Input label="Confirm Password" type="password" autoComplete="new-password" {...register("confirm")} error={errors.confirm?.message} />
        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>Create Account</Button>
      </form>
      <p className={styles.switch}>
        Already have an account?{" "}
        <Link href="/login" className={styles.switchLink}>Sign in</Link>
      </p>
    </div>
  );
}
