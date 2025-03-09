import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the LiveScoresTicker to ensure it's client-side only
const LiveScoresTicker = dynamic(
  () => import('@/components/home/LiveScoresTicker'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      {/* Live scores ticker */}
      <div className="w-full max-w-6xl mb-10">
        <LiveScoresTicker />
      </div>
      
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-primary">Welcome to </span> 
          <span className="text-primary">Walk</span>
          <span className="text-accent">Off</span>
          <span className="text-white">.io</span>
        </h1>
        <p className="text-text-muted text-xl mb-10 max-w-2xl mx-auto">
          Your comprehensive platform for MLB statistics, insights, and community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/discover" className="bg-primary hover:bg-primary-dark text-white py-3 px-8 rounded-full transition-colors duration-200 text-lg">
            Explore Stats
          </Link>
          <Link href="/scoreboard" className="bg-secondary hover:bg-secondary-dark text-white py-3 px-8 rounded-full transition-colors duration-200 text-lg">
            Today's Games
          </Link>
        </div>
      </section>
    </div>
  );
}
