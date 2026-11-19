import { formatPrice } from "./format";
import type { CartItem, Product } from "./types";

const STORE_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";

interface CartLine {
  item: CartItem;
  product: Product;
}

function unitPrice(product: Product): number {
  return product.offerPrice ?? product.price;
}

export function buildOrderMessage(lines: CartLine[]): string {
  const total = lines.reduce(
    (sum, { item, product }) => sum + unitPrice(product) * item.quantity,
    0,
  );

  const itemLines = lines
    .map(({ item, product }) => {
      const subtotal = unitPrice(product) * item.quantity;
      return `• ${item.quantity}x ${product.brand} — ${product.name}${
        product.volumeMl ? ` (${product.volumeMl}ml)` : ""
      } — ${formatPrice(subtotal)}`;
    })
    .join("\n");

  return [
    "Olá! Vim pelo site e gostaria de fazer este pedido:",
    "",
    itemLines,
    "",
    `Total: ${formatPrice(total)}`,
  ].join("\n");
}

export function buildWhatsAppOrderUrl(lines: CartLine[]): string {
  const message = buildOrderMessage(lines);
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppProductInquiryUrl(product: Product): string {
  const message = `Olá! Tenho interesse em ${product.brand} — ${product.name}. Ainda está disponível?`;
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppSupportUrl(): string {
  const message = "Olá! Vim pelo site e gostaria de falar com a vendedora.";
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
