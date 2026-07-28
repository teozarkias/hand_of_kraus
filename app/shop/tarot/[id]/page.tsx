import { notFound } from "next/navigation";
import { getAllTarotIds, getTarotCardById } from "@/lib/tarot";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return getAllTarotIds().map((id) => ({ id }));
}

export default async function TarotProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { id } = await params;
  const { variant } = await searchParams;
  const card = getTarotCardById(id);

  if (!card) {
    notFound();
  }

  // Same underlying product page either way — just swap which image/title
  // it shows depending on which of the two versions was picked on the
  // "choose" screen.
  const isSketch = variant === "preview" && card.previewImage;
  const product = isSketch
    ? { ...card, title: `${card.title} — Sketch`, image: card.previewImage! }
    : card;

  return (
    <ProductDetail
      painting={product}
      kind="tarot"
      backHref={
        card.previewImage ? `/shop/tarot/${card.id}/choose` : "/shop/tarot"
      }
      backLabel={card.previewImage ? "Choices" : "Tarot"}
    />
  );
}
