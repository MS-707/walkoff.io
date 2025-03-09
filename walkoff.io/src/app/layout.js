import "./globals.css";
import "/public/output.css";
import Navigation from "@/components/navigation/Navigation";
import { TeamLogoProvider } from "@/components/teams/TeamLogoProvider";

export const metadata = {
  title: "WalkOff.io - MLB Stats",
  description: "Your go-to place for MLB stats",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-base-dark text-text">
        <TeamLogoProvider>
          <Navigation />
          <main className="pt-20 md:pt-24">
            {children}
          </main>
        </TeamLogoProvider>
      </body>
    </html>
  );
}
