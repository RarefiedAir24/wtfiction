import { notFound } from 'next/navigation';
import { getScenarioById } from '@/data/scenarios';
import { references } from '@/data/references';
import ScenarioDetailClient from '@/components/ScenarioDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // For static export, we'll generate all scenario pages at build time
  const { scenarios } = await import('@/data/scenarios');
  return scenarios.map((scenario) => ({
    id: scenario.id,
  }));
}

export default async function ScenarioDetailPage({ params }: PageProps) {
  const { id } = await params;
  const scenario = getScenarioById(id);
  
  if (!scenario) {
    notFound();
  }
  
  const episodeReferences = references.find(r => r.episodeId === id);
  
  // Convert Citation objects to strings for display
  // Support both new format (citation field) and legacy format (text field)
  const citationStrings = episodeReferences?.citations.map(c => {
    if (c.citation) {
      // New format: use citation field
      return c.citation;
    } else if (c.text) {
      // Legacy format: use text field
      return c.text;
    } else if (c.title) {
      // Fallback: use title if available
      return c.title;
    }
    return '';
  }).filter(c => c.length > 0) || [];
  
  return (
    <ScenarioDetailClient 
      scenario={scenario} 
      references={citationStrings}
    />
  );
}
