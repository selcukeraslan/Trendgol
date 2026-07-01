import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Takım başvurusu, sorular ve iş birlikleri için halı saha ligi iletişim bilgileri.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
