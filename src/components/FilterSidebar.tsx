import { FilterParams } from '../types/article';
export const FilterSidebar = ({
  filters,
  onFilterChange,
}: {
  filters: FilterParams;
  onFilterChange: (newFilters: FilterParams) => void;
}) => {
  const categories = ['Business', 'Technology', 'Sports', 'Health'];
  const sources = ['NewsAPI', 'The Guardian', 'New York Times'];

  return (
    <div className="w-full md:w-64 space-y-6 bg-gray-100 p-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Filters</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={filters.date || ''}
              onChange={(e) =>
                onFilterChange({ ...filters, date: e.target.value || undefined })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={filters.category || ''}
              onChange={(e) =>
                onFilterChange({ ...filters, category: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sources</label>
            <div className="space-y-2">
              {sources.map((source) => (
                <label key={source} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.sources?.includes(source) || false}
                    onChange={(e) => {
                      const newSources = e.target.checked
                        ? [...(filters.sources || []), source]
                        : (filters.sources || []).filter((s) => s !== source);
                      onFilterChange({ ...filters, sources: newSources });
                    }}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm">{source}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
