import { getAllPaintings } from "@/lib/paintings";
import WorksGallery from "./WorksGallery";

// Cached, then refreshed instantly whenever something is saved in /admin
// (see revalidateSite in app/admin/actions.ts). The 5-minute revalidate is
// just a safety net in case an on-demand refresh is ever missed.
export const revalidate = 300;

export default async function WorksPage() {
  const paintings = await getAllPaintings();
  return <WorksGallery paintings={paintings} />;
}
