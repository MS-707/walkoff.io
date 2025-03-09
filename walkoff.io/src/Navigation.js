export default function Navigation() {
    return (
      <nav className="bg-base-dark text-text p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-primary mr-8">WalkOff.io</h1>
            <div className="hidden md:flex space-x-6">
              <a href="/scoreboard" className="hover:text-primary">Scoreboard</a>
              <a href="/discover" className="hover:text-primary">Discover</a>
              <a href="/lists" className="hover:text-primary">Lists</a>
              <a href="/community" className="hover:text-primary">Community</a>
            </div>
          </div>
  
          <div className="flex flex-col w-full md:flex-row md:w-auto space-y-2 md:space-y-0 md:space-x-4">
            <input 
              type="text" 
              placeholder="Search players or teams..." 
              className="p-2 rounded bg-surface text-text w-full md:w-64"
            />
  
            <input 
              type="date" 
              className="p-2 rounded bg-surface text-text"
            />
  
            <button className="bg-primary hover:bg-primary-dark p-2 rounded">
              Log In
            </button>
          </div>
        </div>
  
        <div className="md:hidden mt-4 flex justify-center space-x-6">
          <a href="/scoreboard" className="hover:text-primary">Scoreboard</a>
          <a href="/discover" className="hover:text-primary">Discover</a>
          <a href="/lists" className="hover:text-primary">Lists</a>
          <a href="/community" className="hover:text-primary">Community</a>
        </div>
      </nav>
    );
  }
  