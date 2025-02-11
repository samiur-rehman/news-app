import { useEffect, useReducer, useCallback } from 'react';
import { useQuery } from 'react-query';
import { ArticleCard } from './components/ArticleCard';
import { SearchHeader } from './components/SearchHeader';
import { FilterSidebar } from './components/FilterSidebar';
import { PreferencesModal } from './components/PreferencesModal';
import { fetchNewsApiArticles } from './services/newsApiService';
import { fetchGuardianArticles } from './services/guardianService';
import { fetchNYTArticles } from './services/nytService';
import { Article, FilterParams } from './types/article';

type AppState = {
  filters: FilterParams;
  preferences: {
    sources: string[];
    categories: string[];
    authors: string[];
  };
  isPreferencesOpen: boolean;
};

const initialState: AppState = {
  filters: { date: new Date().toISOString().split('T')[0] },
  preferences: {
    sources: ['NewsAPI', 'The Guardian', 'New York Times'],
    categories: [],
    authors: [],
  },
  isPreferencesOpen: false,
};

type Action =
  | { type: 'SET_FILTERS'; payload: FilterParams }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_PREFERENCES'; payload: AppState['preferences'] }
  | { type: 'TOGGLE_PREFERENCES_MODAL' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
      case 'SET_QUERY':
        if (state.filters.query === action.payload) return state;
        return { ...state, filters: { ...state.filters, query: action.payload } };
    case 'SET_PREFERENCES':
      return { ...state, preferences: action.payload };
    case 'TOGGLE_PREFERENCES_MODAL':
      return { ...state, isPreferencesOpen: !state.isPreferencesOpen };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    const savedPrefs = localStorage.getItem('newsPreferences');
    return {
      ...init,
      preferences: savedPrefs
        ? { ...init.preferences, ...JSON.parse(savedPrefs) }
        : init.preferences,
    };
  });

  const onSearch = useCallback((query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  }, []);

  const { data: articles, isLoading, isError } = useQuery(
    ['articles', state.filters, state.preferences],
    async () => {
      const effectiveCategory =
        state.filters.category ||
        (state.preferences.categories.length > 0
          ? state.preferences.categories.map((cat) => cat.toLowerCase()).join(',')
          : undefined);
      const effectiveSources =
        state.filters.sources && state.filters.sources.length > 0
          ? state.filters.sources
          : state.preferences.sources;
      const effectiveQuery = state.filters.query || '';
      const effectiveDate =
        state.filters.date && state.filters.date.trim() !== ''
          ? state.filters.date
          : undefined;

      const results = await Promise.allSettled([
        effectiveSources.includes('NewsAPI')
          ? fetchNewsApiArticles({
              ...state.filters,
              category: effectiveCategory,
              query: effectiveQuery,
              date: effectiveDate,
            })
          : [],
        effectiveSources.includes('The Guardian')
          ? fetchGuardianArticles({
              ...state.filters,
              category: effectiveCategory,
              query: effectiveQuery,
              date: effectiveDate,
            })
          : [],
        effectiveSources.includes('New York Times')
          ? fetchNYTArticles({
              ...state.filters,
              category: effectiveCategory,
              query: effectiveQuery,
              date: effectiveDate,
            })
          : [],
      ]);

      let combinedArticles: Article[] = results.flatMap((result) =>
        result.status === 'fulfilled' ? result.value : []
      );

      combinedArticles.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      if (state.preferences.authors.length > 0) {
        combinedArticles = combinedArticles.filter((article) =>
          state.preferences.authors.some((prefAuthor) =>
            article.author.toLowerCase().includes(prefAuthor.toLowerCase())
          )
        );
      }

      return combinedArticles;
    },
    {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    }
  );

  useEffect(() => {
    localStorage.setItem('newsPreferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  const handleSavePreferences = useCallback(
    (prefs: AppState['preferences']) => {
      dispatch({ type: 'SET_PREFERENCES', payload: prefs });
    },
    []
  );

  const handleFilterChange = useCallback((newFilters: FilterParams) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader
        onSearch={onSearch}
        onOpenPreferences={() => dispatch({ type: 'TOGGLE_PREFERENCES_MODAL' })}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      <FilterSidebar filters={state.filters} onFilterChange={handleFilterChange} />

      
      {isError && (
        <div className="p-4 bg-red-50 text-red-700 text-center">
          Failed to load articles. Please try again later.
        </div>
      )}
      
      {isLoading && (
        <div className="text-center py-8 text-gray-500">Loading articles...</div>
      )}
     
      {!isLoading && !isError && articles?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No articles found matching your criteria
        </div>
      )}
      
        {!isLoading && !isError && articles && articles.length > 0 && (
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>

      <PreferencesModal
        isOpen={state.isPreferencesOpen}
        onClose={() => dispatch({ type: 'TOGGLE_PREFERENCES_MODAL' })}
        preferences={state.preferences}
        onSave={handleSavePreferences}
      />
    </div>
  );
}
