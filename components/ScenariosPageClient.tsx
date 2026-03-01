// A3: run-1772384872518 | 2026-03-01T17:09:09.893Z
'use client';

import { useState, useEffect } from 'react';
import { Scenario } from '@/data/scenarios';
import EpisodeThumbnail from './EpisodeThumbnail';
import PlayButton from './PlayButton';
import YouTubeModal from './YouTubeModal';
import PostWatchContinuation from './PostWatchContinuation';
import { logEvent } from '@/lib/analytics';

interface ScenariosPageClientProps {
  scenarios: Scenario[];
}

export default function ScenariosPageClient({ scenarios }: ScenariosPageClientProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [showPostWatch, setShowPostWatch] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [highlightedScenarioId, setHighlightedScenarioId] = useState<string | null>(null);

  const sortedScenarios = [...scenarios].sort((a, b) => {
    if (!a.publishDate || !b.publishDate) return 0;
    const dateA = new Date(a.publishDate).getTime();
    const dateB = new Date(b.publishDate).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const handleVideoClick = (scenario: Scenario) => {
    // Highlight the selected row
    setHighlightedScenarioId(scenario.id);
    
    // Small delay to show the highlight before opening modal
    setTimeout(() => {
      setSelectedVideoId(scenario.id);
      logEvent('scenario_click', {
        scenario_id: scenario.id,
        scenario_title: scenario.title,
        page: 'scenarios'
      });
    }, 150);
  };

  const handleCloseModal = () => {
    setSelectedVideoId(null);
    setShowPostWatch(false);
    // Clear highlight when modal closes
    setHighlightedScenarioId(null);
  };

  const handleVideoEnd = () => {
    setShowPostWatch(true);
  };

  const handleContinue = (nextScenarioId: string) => {
    setShowPostWatch(false);
    setSelectedVideoId(nextScenarioId);
    setHighlightedScenarioId(nextScenarioId);
  };

  const selectedScenario = scenarios.find(s => s.id === selectedVideoId);

  // Clear highlight when clicking outside (on the backdrop)
  useEffect(() => {
    if (!selectedVideoId && highlightedScenarioId) {
      const timer = setTimeout(() => {
        setHighlightedScenarioId(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedVideoId, highlightedScenarioId]);

  return (
    <div className="relative">
      {/* Backdrop overlay - dims the page when a video is highlighted */}
      {highlightedScenarioId && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 transition-opacity duration-300"
          onClick={() => {
            if (!selectedVideoId) {
              setHighlightedScenarioId(null);
            }
          }}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">All Scenarios</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder('newest')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortOrder === 'newest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortOrder === 'oldest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Oldest First
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {sortedScenarios.map((scenario) => {
            const isHighlighted = highlightedScenarioId === scenario.id;
            
            return (
              <div
                key={scenario.id}
                className={`relative transition-all duration-300 ${
                  isHighlighted ? 'z-40' : 'z-10'
                }`}
              >
                <div
                  onClick={() => handleVideoClick(scenario)}
                  className={`group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    isHighlighted
                      ? 'ring-4 ring-blue-500 shadow-2xl scale-[1.02] transform'
                      : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-4 p-4">
                    {/* Thumbnail Section */}
                    <div className="relative w-full md:w-80 flex-shrink-0">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <EpisodeThumbnail
                          videoId={scenario.id}
                          title={scenario.title}
                          thumbnailUrl={scenario.thumbnailUrl}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayButton size="large" />
                        </div>
                        {scenario.runtime && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
                            {scenario.runtime}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {scenario.title}
                      </h2>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {scenario.premise}
                      </p>
                      {scenario.publishDate && (
                        <p className="text-sm text-gray-500">
                          Published: {new Date(scenario.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                      {scenario.keyInsight && (
                        <p className="text-sm text-blue-600 mt-2 italic">
                          💡 {scenario.keyInsight}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* YouTube Modal */}
      {selectedVideoId && selectedScenario && (
        <YouTubeModal
          videoId={selectedVideoId}
          title={selectedScenario.title}
          onClose={handleCloseModal}
          onVideoEnd={handleVideoEnd}
        />
      )}

      {/* Post-Watch Continuation */}
      {showPostWatch && selectedScenario && (
        <PostWatchContinuation
          currentScenario={selectedScenario}
          allScenarios={scenarios}
          onContinue={handleContinue}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}