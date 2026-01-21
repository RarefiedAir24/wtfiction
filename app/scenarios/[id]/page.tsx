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
  
  // Convert Citation objects to strings for backward compatibility
  const citationStrings = episodeReferences?.citations.map(c => c.text) || [];
  
  return (
    <ScenarioDetailClient 
      scenario={scenario} 
      references={citationStrings}
    />
  );
}
