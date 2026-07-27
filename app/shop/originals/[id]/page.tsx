import { notFound } from "next/navigation";
import { getPaintingById, getAllPaintingIds } from "@/lib/paintings";
import ProductDetail from "@/components/ProductDetail";
ProductDetail;

export function generateStaticParams() {
  return getAllPaintingIds().map((id) => ({ id }));
}

export default async function OriginalProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const painting = getPaintingById(id);

  if (!painting) {
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
