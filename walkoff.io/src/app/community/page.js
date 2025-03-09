export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-6">Community</h1>
      <p className="text-text-muted mb-8">
        Connect with other baseball fans and join the conversation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Discussions</h2>
          <p className="mb-6">Join conversations about games, players, and baseball analysis.</p>
          <button className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-full transition-colors duration-200">
            Browse Topics
          </button>
        </div>
        <div className="bg-surface rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Latest Activity</h2>
          <div className="space-y-4">
            <div className="p-3 bg-base-dark rounded">
              <p className="text-sm text-text-muted">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}