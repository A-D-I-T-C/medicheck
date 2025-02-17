import SearchIcon from "./Searchicon";
interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export default function SearchBar({ onSearch, className = '' }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder="Search for a patient..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-xl
          bg-gray-900/50 backdrop-blur-sm
          border border-gray-700/50
          text-gray-100 placeholder-gray-400
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
          hover:bg-gray-800/50 hover:border-gray-600/50
          shadow-lg shadow-black/10"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
    </div>
  );
}