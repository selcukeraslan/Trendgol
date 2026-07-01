import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Puan Durumu",
  description:
    "Takımların güncel puan durumu, galibiyet, beraberlik, averaj ve puan istatistikleri.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
