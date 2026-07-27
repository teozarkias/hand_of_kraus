import { notFound } from "next/navigation";
import { getPaintingById, getAllPaintingIds } from "@/lib/paintings";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return getAllPaintingIds().map((id) => ({ id }));
}

export default async function PrintProductPage({
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
      kind="print"
      backHref="/shop/prints"
      backLabel="Prints"
    />
  );
}
