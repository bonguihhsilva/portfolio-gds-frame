import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BotpressWebchat } from "@/components/chat/BotpressWebchat";
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
      <BotpressWebchat />
    </div>
  );
}
