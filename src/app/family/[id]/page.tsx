import { notFound } from "next/navigation";
import { getFamily } from "@/lib/families";
import Dashboard from "@/components/Dashboard";

export default async function FamilyPage({ params }: { params: { id: string } }) {
  const family = await getFamily(params.id);
  if (!family) notFound();
  return <Dashboard family={family} />;
}
