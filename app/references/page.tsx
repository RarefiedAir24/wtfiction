import { references } from '@/data/references';
import { scenarios } from '@/data/scenarios';

export default function ReferencesPage() {
  // Sort references by publish date (newest first), matching scenarios order
  const sortedReferences = [...references].sort((a, b) => {
    if (a.publishDate && b.publishDate) {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    }
    return 0;
  });

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light mb-6 text-foreground">
            References
          </h1>
          
          {/* Intro Block - Critical Framing */}
          <div className="max-w-3xl space-y-4 mb-12">
            <p className="text-base md:text-lg text-muted leading-relaxed">
              WTFiction scenarios are grounded in publicly available research, reporting, and data.
            </p>
            <p className="text-base md:text-lg text-muted leading-relaxed">
              Sources are grouped by episode and provided for transparency, context, and further exploration — not as definitive predictions.
            </p>
          </div>
        </div>

        {/* Episode-Based Grouping */}
        <div className="space-y-12">
          {sortedReferences.map((reference, index) => {
            // Get scenario for publish date if not in reference
            const scenario = scenarios.find(s => s.id === reference.episodeId);
            const publishDate = reference.publishDate || scenario?.publishDate;
            
            return (
              <section 
                key={reference.episodeId} 
                className="border-b border-[#272727] pb-10 last:border-b-0"
              >
                {/* Episode Header */}
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-medium mb-2 text-foreground leading-snug">
                    {reference.episodeTitle}
                  </h2>
                  {publishDate && (
                    <p className="text-sm text-muted">
                      Published: {new Date(publishDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                </div>

                {/* Sources List */}
                <div>
                  <h3 className="text-sm font-medium text-muted/80 mb-4 uppercase tracking-wide">
                    Sources
                  </h3>
                  <ul className="space-y-4 text-sm md:text-base text-muted leading-relaxed">
                    {reference.citations.map((citation, citationIndex) => {
                      // Backward compatibility: convert old format to new
                      const title = citation.title || citation.text || 'Untitled Reference';
                      const description = citation.description;
                      const citationText = citation.citation || citation.text || '';
                      
                      return (
                        <li key={citationIndex} className="flex items-start gap-4">
                          {/* Source Type Label - Left Side */}
                          {citation.type && (
                            <span className="text-xs text-muted/60 font-medium uppercase tracking-wide flex-shrink-0 pt-0.5 min-w-[80px]">
                              [{citation.type}]
                            </span>
                          )}
                          {/* Citation Content - Right Side */}
                          <div className="flex-1 space-y-1.5">
                            {/* Title */}
                            <div className="text-foreground font-medium">
                              {title}
                            </div>
                            {/* Description */}
                            {description && (
                              <div className="text-muted text-sm leading-relaxed">
                                {description}
                              </div>
                            )}
                            {/* Link */}
                            {citation.url && (
                              <div>
                                <a
                                  href={citation.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#3ea6ff] hover:text-[#2d8fdd] transition-colors underline underline-offset-2 text-sm break-all"
                                >
                                  {citation.url}
                                </a>
                              </div>
                            )}
                            {/* Citation Format */}
                            {citationText && (
                              <div className="text-xs text-muted/70 italic mt-2 pt-2 border-t border-[#272727]">
                                {citationText}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer Note - Restrained */}
        <div className="mt-16 pt-8 border-t border-[#272727]">
          <p className="text-sm text-muted/80 leading-relaxed max-w-3xl">
            These references are maintained for credibility, transparency, and further exploration. Sources are verified and linked where publicly available.
          </p>
        </div>
      </div>
    </main>
  );
}
