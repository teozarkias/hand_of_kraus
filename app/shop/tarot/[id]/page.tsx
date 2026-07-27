import { notFound } from "next/navigation";
import { getAllTarotIds, getTarotCardById } from "@/lib/tarot";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return getAllTarotIds().map((id) => ({ id }));
}

export default async function TarotProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = getTarotCardById(id);

  if (!card) {
    notFound();
  }

  return (
    <ProductDetail
      painting={card}
      kind="tarot"
      backHref="/shop/tarot"
      backLabel="Tarot"
    />
  );
}
