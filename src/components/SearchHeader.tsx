import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useDebounce } from 'use-debounce';

export const SearchHeader = ({
  onSearch,
  onOpenPreferences,
}: {
  onSearch: (query: string) => void;
  onOpenPreferences: () => void;
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news articles by keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={onOpenPreferences}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
};