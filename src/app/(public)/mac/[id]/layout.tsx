import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maç Detayı",
  description: "Maç skoru, golcüler ve karşılaşma bilgileri.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
