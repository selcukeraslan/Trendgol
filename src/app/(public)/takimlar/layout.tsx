import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Takımlar",
  description: "Ligde mücadele eden takımlar, kaptanlar ve kadro bilgileri.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
