import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Payment Status",
  description: "Payment status gate for Zoho CRM payment schedules"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
