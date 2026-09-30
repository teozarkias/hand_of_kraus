import { notFound } from "next/navigation";
import { getAllTarotIds, getTarotCardById } from "@/lib/tarot";
import ProductDetail from "@/components/ProductDetail";

// Cached, then refreshed instantly whenever something is saved in /admin.
export const revalidate = 300;

// Pre-builds every existing card for speed. Cards added later through
// /admin aren't in this list, but still work: Next renders them on first
// visit and caches them from then on.
export async function generateStaticParams() {
  return (await getAllTarotIds()).map((id) => ({ id }));
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
  const card = await getTarotCardById(id);

  if (!card) {
    notFound();
  }

  // Always the full-quality image here — this is the page with the zoom
  // feature, where the extra resolution actually matters.
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
