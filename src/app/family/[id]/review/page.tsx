import { notFound } from "next/navigation";
import { getFamily } from "@/lib/store";
import ReviewEditor from "@/components/ReviewEditor";

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const family = await getFamily(params.id);
  if (!family) notFound();
  return <ReviewEditor family={family} />;
}
