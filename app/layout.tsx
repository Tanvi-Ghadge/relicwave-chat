import "./globals.css";
import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-white text-black antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
