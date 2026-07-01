import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Lig haberleri, maç özetleri, röportajlar ve duyurular halı saha ligi blogunda.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
