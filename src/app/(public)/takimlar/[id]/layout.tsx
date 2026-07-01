import type { Metadata } from "next";

import { getTeamById } from "@/lib/repository/teamRepository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const team = await getTeamById(id);
  if (!team) {
    return { title: "Takım Bulunamadı" };
  }
  return {
    title: team.name,
    description: `${team.name} — Kaptan: ${team.captain}. ${team.description}`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
