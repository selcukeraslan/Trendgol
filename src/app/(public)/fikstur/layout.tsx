import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fikstür",
  description:
    "Halı saha ligi fikstürü: haftalara göre maç programı, skorlar, tarih ve saha bilgileri.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
