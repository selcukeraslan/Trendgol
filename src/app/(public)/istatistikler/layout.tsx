import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İstatistikler",
  description:
    "Sezonun gol krallığı ve kart istatistikleri. Oynanan maçların golcü ve kart kayıtlarından otomatik hesaplanır.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
