import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dramalist",
  description: "Track and discover dramas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
