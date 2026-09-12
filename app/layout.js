import "./globals.css";

export const metadata = {
  title: "Ajovi_article Studio",
  description: "Research and presentation studio for Islamic banking studies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
