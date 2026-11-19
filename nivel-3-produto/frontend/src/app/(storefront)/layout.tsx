import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { getAllProducts } from "@/lib/products";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await getAllProducts().catch(() => []);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader products={products} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <ChatWidget />
    </div>
  );
}
