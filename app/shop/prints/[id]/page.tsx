import { notFound } from "next/navigation";
import { getPaintingById, getAllPaintingIds } from "@/lib/paintings";
import ProductDetail from "@/components/ProductDetail";

// Cached, then refreshed instantly whenever something is saved in /admin.
export const revalidate = 300;

// Pre-builds every existing piece for speed. Pieces added later through
// /admin aren't in this list, but still work: Next renders them on first
// visit and caches them from then on.
export async function generateStaticParams() {
  return (await getAllPaintingIds()).map((id) => ({ id }));
}

export default async function PrintProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const painting = await getPaintingById(id);

  if (!painting) {
    notFound();
  }

  return (
    <ProductDetail
      painting={painting}
      kind="print"
      backHref="/shop/prints"
      backLabel="Prints"
    />
  );
}
