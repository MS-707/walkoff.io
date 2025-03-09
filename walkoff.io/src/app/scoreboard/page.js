export default function ScoreboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-6">Scoreboard</h1>
      <p className="text-text-muted mb-8">
        View today's MLB game scores and upcoming matchups.
      </p>
      <div className="bg-surface rounded-lg p-6 shadow-lg">
        <p className="text-center text-xl">Game scores will appear here</p>
      </div>
    </div>
  );
}