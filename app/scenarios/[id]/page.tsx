import { notFound } from 'next/navigation';
import { getScenarioById } from '@/data/scenarios';
import { references, Citation } from '@/data/references';
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
  
  // Pass full Citation objects to preserve all metadata (title, url, description, type, etc.)
  // Support up to 10 references per episode
  const citations: Citation[] = episodeReferences?.citations.slice(0, 10) || [];
  
  return (
    <ScenarioDetailClient 
      scenario={scenario} 
      references={citations}
    />
  );
}
