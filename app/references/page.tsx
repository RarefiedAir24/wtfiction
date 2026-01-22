import { references } from '@/data/references';
import ReferenceSummary from '@/components/ReferenceSummary';
import { scenarios } from '@/data/scenarios';

/**
 * Formats a citation in the standard format: "Author, Title (Type, Year)."
 * The title should be italicized in the output.
 */
function formatCitation(citation: {
  citation?: string;
  title?: string;
  text?: string;
  type?: string;
  authors?: string[];
  extractedYear?: string;
  publishDate?: string;
  description?: string;
}): React.ReactNode {
  // If citation field exists, try to parse it
  if (citation.citation) {
    const citationText = citation.citation.trim();
    
    // First, check if citation is already in the format "Author, Title (Type, Year)."
    const citationPattern = /^(.+?),\s*(.+?)\s*\(([^,]+),\s*(\d{4})\)\.?$/;
    const match = citationText.match(citationPattern);
    
    if (match) {
      const [, author, title, type, year] = match;
      return (
        <>
          {author}, <em>{title}</em> ({type}, {year}).
        </>
      );
    }
    
    // Clean up corrupted citations: remove HTML fragments and normalize
    let cleaned = citationText
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[""]/g, '"') // Normalize quotes
      .replace(/\.\.\./g, '') // Remove ellipses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Try standard pattern on cleaned text
    const cleanedMatch = cleaned.match(citationPattern);
    if (cleanedMatch) {
      const [, author, title, type, year] = cleanedMatch;
      return (
        <>
          {author}, <em>{title}</em> ({type}, {year}).
        </>
      );
    }
    
    // For severely corrupted citations, look for the pattern at the END: ", Title (Type, Year)."
    // This handles cases where description text is mixed in at the beginning
    const endPattern = /,\s*([^,()]+?)\s*\(([^,]+),\s*(\d{4})\)\.?$/;
    const endMatch = cleaned.match(endPattern);
    
    if (endMatch) {
      const [, titleFromEnd, type, year] = endMatch;
      const titleToUse = citation.title || titleFromEnd.trim();
      
      // Try to extract organization name from the title field or citation
      // If title is "News - Organization Name", extract the organization
      let organization = '';
      if (citation.title) {
        const titleMatch = citation.title.match(/News\s*-\s*(.+)/i);
        if (titleMatch) {
          organization = titleMatch[1].trim();
        } else if (citation.title.includes('Corporation') || citation.title.includes('Organization')) {
          // Use the title as organization if it looks like an org name
          organization = citation.title;
        }
      }
      
      // If we found an organization, use it; otherwise use the title as-is
      if (organization) {
        return (
          <>
            {organization}, <em>{titleToUse}</em> ({type}, {year}).
          </>
        );
      } else {
        // No clear organization, just use title
        return (
          <>
            <em>{titleToUse}</em> ({type}, {year}).
          </>
        );
      }
    }
    
    // Last resort: if we can't parse it, try to construct from available fields
    // This handles severely corrupted citations by using title, type, and extracting year
    if (citation.title && citation.type) {
      // Try to extract year from the citation text (look for 4-digit year)
      const yearMatch = cleaned.match(/(\d{4})/);
      const year = yearMatch ? yearMatch[1] : (citation.extractedYear || (citation.publishDate 
        ? new Date(citation.publishDate).getFullYear().toString()
        : ''));
      
      // Extract organization from title if it's in "News - Organization" format
      let organization = '';
      let titleToUse = citation.title;
      
      const titleMatch = citation.title.match(/News\s*-\s*(.+)/i);
      if (titleMatch) {
        organization = titleMatch[1].trim();
        // For "News - Organization", use the organization as author and keep full title
        titleToUse = citation.title;
      } else if (citation.title.includes('Corporation') || citation.title.includes('Organization') || citation.title.includes('Institute')) {
        // If title looks like an organization name, use it as the organization
        organization = citation.title;
        // Try to get actual article title from description if available
        if (citation.description) {
          // Look for title-like text at the start of description
          const descLines = citation.description.split('\n');
          if (descLines.length > 0 && descLines[0].length > 20 && descLines[0].length < 150) {
            titleToUse = descLines[0].trim();
          }
        }
        if (titleToUse === citation.title) {
          // If we couldn't extract a better title, use a generic one
          titleToUse = 'News Article';
        }
      }
      
      if (organization && year) {
        return (
          <>
            {organization}, <em>{titleToUse}</em> ({citation.type}, {year}).
          </>
        );
      } else if (year) {
        return (
          <>
            <em>{titleToUse}</em> ({citation.type}, {year}).
          </>
        );
      } else {
        return (
          <>
            <em>{titleToUse}</em> ({citation.type}).
          </>
        );
      }
    }
    
    // If all else fails, return cleaned citation as-is
    return cleaned.endsWith('.') ? cleaned : cleaned + '.';
  }
  
  // Fallback: construct from available fields
  const authors = citation.authors && citation.authors.length > 0 
    ? citation.authors.join(' & ') 
    : '';
  const title = citation.title || citation.text || 'Untitled Reference';
  const type = citation.type || 'Unknown';
  const year = citation.extractedYear || (citation.publishDate 
    ? new Date(citation.publishDate).getFullYear().toString()
    : '');
  
  if (authors && title && type && year) {
    return (
      <>
        {authors}, <em>{title}</em> ({type}, {year}).
      </>
    );
  }
  
  if (title && type && year) {
    return (
      <>
        <em>{title}</em> ({type}, {year}).
      </>
    );
  }
  
  if (title && type) {
    return (
      <>
        <em>{title}</em> ({type}).
      </>
    );
  }
  
  return <em>{title}</em>;
}

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
                      const formattedCitation = formatCitation(citation);
                      
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
                            {/* Title - Clickable if URL exists */}
                            {citation.url ? (
                              <a
                                href={citation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground font-medium hover:text-[#3ea6ff] transition-all duration-300 ease-out inline-flex items-center group cursor-pointer"
                              >
                                <span className="relative inline-block">
                                  <span className="relative z-10">{title}</span>
                                  {/* Animated underline */}
                                  <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-[#3ea6ff] to-[#2d8fdd] transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
                                  {/* Subtle glow effect on hover */}
                                  <span className="absolute -bottom-1 left-0 w-0 h-[4px] bg-[#3ea6ff]/20 blur-sm transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
                                  {/* Subtle background highlight - constrained to text area */}
                                  <span className="absolute -inset-x-1 -inset-y-0.5 rounded-md bg-[#3ea6ff]/5 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out -z-10"></span>
                                </span>
                                {/* External link icon with smooth animation */}
                                <svg 
                                  className="inline-block w-3.5 h-3.5 ml-2 mb-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ) : (
                              <div className="text-foreground font-medium">
                                {title}
                              </div>
                            )}
                            {/* Description - with AI summarize option */}
                            <ReferenceSummary
                              url={citation.url}
                              title={title}
                              authors={(citation as any).authors || undefined}
                              type={citation.type}
                              existingDescription={description}
                            />
                            {/* Citation Format - Always show in standard format with italicized title */}
                            {formattedCitation && (
                              <div className="text-xs text-muted/70 mt-2 pt-2 border-t border-[#272727]">
                                {formattedCitation}
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
