import type { Metadata } from "next";

// PWA lives on the admin app only — the manifest link is attached here so
// public pages never advertise installability.
export const metadata: Metadata = {
  manifest: "/manifest.json",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
