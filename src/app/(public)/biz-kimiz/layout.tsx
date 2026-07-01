import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biz Kimiz",
  description:
    "Halı saha ligimizin hikayesi, misyonu ve güven veren değerleri hakkında bilgi alın.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
