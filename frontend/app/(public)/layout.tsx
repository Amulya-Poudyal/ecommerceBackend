import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "100dvh", paddingTop: "var(--header-h)" }}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
