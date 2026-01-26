import React from 'react';
import { Citation } from '@/data/references';

/**
 * Formats a citation in the standard format: "Author, Title (Type, Year)."
 * The title should be italicized in the output.
 */
export function formatCitation(citation: Citation): React.ReactNode {
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
      const year = yearMatch ? yearMatch[1] : '';
      
      if (year) {
        return (
          <>
            <em>{citation.title}</em> ({citation.type}, {year}).
          </>
        );
      } else {
        return (
          <>
            <em>{citation.title}</em> ({citation.type}).
          </>
        );
      }
    }
    
    // If we have authors, use them
    if (citation.authors && citation.authors.length > 0 && citation.title) {
      const authors = citation.authors.join(', ');
      const type = citation.type || '';
      
      if (type) {
        return (
          <>
            {authors}, <em>{citation.title}</em> ({type}).
          </>
        );
      } else {
        return (
          <>
            {authors}, <em>{citation.title}</em>.
          </>
        );
      }
    }
    
    // Fallback: just return the cleaned citation text or title
    if (cleaned && cleaned.length > 0) {
      return <>{cleaned}</>;
    }
    
    if (citation.title) {
      return <em>{citation.title}</em>;
    }
    
    if (citation.text) {
      return <>{citation.text}</>;
    }
    
    return null;
  }
  
  // If no citation field, try to construct from available fields
  if (citation.title) {
    const authors = citation.authors && citation.authors.length > 0 
      ? `${citation.authors.join(', ')}, `
      : '';
    const type = citation.type ? ` (${citation.type})` : '';
    
    if (authors || type) {
      return (
        <>
          {authors}<em>{citation.title}</em>{type}.
        </>
      );
    }
    
    return <em>{citation.title}</em>;
  }
  
  if (citation.text) {
    return <>{citation.text}</>;
  }
  
  return null;
}
