import "./globals.css";
import Navigation from "@/components/navigation/Navigation";

export const metadata = {
  title: "WalkOff.io - MLB Stats",
  description: "Your go-to place for MLB stats",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-base-dark text-text">
        <Navigation />
        <main className="pt-20 md:pt-24">
          {children}
        </main>
      </body>
    </html>
  );
}
