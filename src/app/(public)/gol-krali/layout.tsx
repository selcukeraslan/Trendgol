import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gol Krallığı",
  description:
    "Sezonun en golcü oyuncuları. Gol krallığı, oynanan maçların golcü kayıtlarından otomatik hesaplanır.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
