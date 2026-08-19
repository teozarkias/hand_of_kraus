import { notFound } from "next/navigation";
import { getPaintingById, getOriginalsForSale } from "@/lib/paintings";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return getOriginalsForSale().map((p) => ({ id: p.id }));
}

export default async function OriginalProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const painting = getPaintingById(id);

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
