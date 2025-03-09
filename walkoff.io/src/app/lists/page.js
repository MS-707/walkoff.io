export default function ListsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-6">Lists</h1>
      <p className="text-text-muted mb-8">
        Create and explore custom player and team lists.
      </p>
      <div className="bg-surface rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Lists</h2>
        <p className="text-center py-8">Sign in to create custom lists of your favorite players and teams.</p>
        <button className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-full transition-colors duration-200">
          Sign In to Create Lists
        </button>
      </div>
      <div className="bg-surface rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Popular Lists</h2>
        <p className="text-center py-4">Trending and popular lists from the WalkOff.io community.</p>
      </div>
    </div>
  );
}