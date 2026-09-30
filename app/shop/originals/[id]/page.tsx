import { notFound } from "next/navigation";
import { getPaintingById, getOriginalsForSale } from "@/lib/paintings";
import ProductDetail from "@/components/ProductDetail";

// Cached, then refreshed instantly whenever something is saved in /admin.
export const revalidate = 300;

// Pre-builds every existing piece for speed. Pieces added later through
// /admin aren't in this list, but still work: Next renders them on first
// visit and caches them from then on.
export async function generateStaticParams() {
  return (await getOriginalsForSale()).map((p) => ({ id: p.id }));
}

export default async function OriginalProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const painting = await getPaintingById(id);

  // Not found at all, or found but not sellable as an original — either
  // way, this page shouldn't exist for it. It may still be reachable
  // under /shop/prints/[id].
  if (!painting || painting.originalForSale === false) {
    notFound();
  }

  return (
    <ProductDetail
      painting={painting}
      kind="original"
      backHref="/shop/originals"
      backLabel="Originals"
    />
  );
}
