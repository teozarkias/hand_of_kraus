export default function SitePreloader({ images }: { images: string[] }) {
  return (
    <>
      {images.map((src) => (
        <link key={src} rel="prefetch" as="image" href={src} />
      ))}
    </>
  );
}
