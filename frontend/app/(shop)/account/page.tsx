"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { clientFetch } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/types";
import styles from "./AccountPage.module.css";

const schema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
});
type FormData = z.infer<typeof schema>;

export default function AccountPage() {
  const { user, setUser } = useAuth();
  const { success, error } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: user?.username ?? "", email: user?.email ?? "" },
  });

  useEffect(() => {
    if (user) reset({ username: user.username, email: user.email });
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    try {
      const updated = await clientFetch<{ message: string; user: typeof user }>(`/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setUser(updated.user);
      success("Profile updated!");
    } catch (err: unknown) {
      const e = err as ApiError;
      error(e.message ?? "Update failed");
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>My Account</h1>
      <div className={styles.layout}>
        {/* Avatar card */}
        <div className={styles.avatarCard}>
          <div className={styles.avatar}><UserIcon size={40} /></div>
          <p className={styles.userName}>{user?.username}</p>
          <p className={styles.userEmail}>{user?.email}</p>
          {user?.is_admin && <span className={styles.adminBadge}>Admin</span>}
        </div>

        {/* Edit form */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
          <h2 className={styles.formTitle}>Edit Profile</h2>
          <Input label="Username" {...register("username")} error={errors.username?.message} />
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
