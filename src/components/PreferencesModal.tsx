import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect, useState } from 'react';

const availableSources = ['NewsAPI', 'The Guardian', 'New York Times'];
const availableCategories = [
  'Business',
  'Technology',
  'Sports',
  'Entertainment',
  'Health',
  'Science',
];

export const PreferencesModal = ({
  isOpen,
  onClose,
  preferences,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  preferences: {
    sources: string[];
    categories: string[];
    authors: string[];
  };
  onSave: (prefs: {
    sources: string[];
    categories: string[];
    authors: string[];
  }) => void;
}) => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string>('');

  useEffect(() => {
    setSelectedSources(preferences.sources);
    setSelectedCategories(preferences.categories);
    setSelectedAuthors(preferences.authors.join(', '));
  }, [preferences]);

  const handleSave = () => {
    onSave({
      sources: selectedSources,
      categories: selectedCategories,
      authors: selectedAuthors
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-xl p-6">
          <DialogTitle className="text-lg font-bold mb-4">
            News Preferences
          </DialogTitle>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Preferred Sources</h4>
              <div className="space-y-2">
                {availableSources.map((source) => (
                  <label key={source} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source)}
                      onChange={() =>
                        setSelectedSources((prev) =>
                          prev.includes(source)
                            ? prev.filter((s) => s !== source)
                            : [...prev, source]
                        )
                      }
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm">{source}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Preferred Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableCategories.map((category) => {
                  const isSelected = selectedCategories.some(
                    (c) => c.toLowerCase() === category.toLowerCase()
                  );
                  return (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            setSelectedCategories((prev) =>
                              prev.filter(
                                (c) => c.toLowerCase() !== category.toLowerCase()
                              )
                            );
                          } else {
                            setSelectedCategories((prev) => [...prev, category]);
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Preferred Authors</h4>
              <input
                type="text"
                value={selectedAuthors}
                onChange={(e) => setSelectedAuthors(e.target.value)}
                placeholder="Enter author names, separated by commas"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
