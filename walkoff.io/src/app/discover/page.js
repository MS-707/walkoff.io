export default function DiscoverPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-6">Discover</h1>
      <p className="text-text-muted mb-8">
        Explore players, teams, and MLB statistics.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Players</h2>
          <p>Discover MLB player statistics and profiles.</p>
        </div>
        <div className="bg-surface rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Teams</h2>
          <p>Explore MLB team standings and statistics.</p>
        </div>
        <div className="bg-surface rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Insights</h2>
          <p>Advanced analytics and baseball insights.</p>
        </div>
      </div>
    </div>
  );
}