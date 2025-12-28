import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Server, Box, Terminal } from 'lucide-react';

interface TechStackProps {
  skills: {
    programming: string[];
    frameworks: string[];
    tools: string[];
  };
}

const Layer = ({ title, icon: Icon, items, index }: { title: string, icon: any, items: string[], index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="relative"
  >
    {/* Connector Line (The "Backbone") */}
    {index !== 3 && (
      <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-gradient-to-b from-primary/20 to-primary/5 z-0" />
    )}

    <div className="relative z-10 bg-surface border border-subtle/10 rounded-xl p-5 hover:border-primary/20 transition-colors group">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-subtle/5 text-primary group-hover:bg-primary/10 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-mono text-sm uppercase tracking-wider text-muted font-semibold">{title}</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 pl-11">
        {items.map(item => (
          <span key={item} className="px-3 py-1.5 bg-subtle/5 border border-subtle/10 text-main/80 rounded text-xs font-medium hover:border-primary/30 hover:text-primary transition-colors cursor-default">
            {item}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

export const TechStack: React.FC<TechStackProps> = ({ skills }) => {
  // Re-organizing skills into "Infrastructure Layers" for the ML Infra Persona
  // This categorization is visual; we use the props to populate.
  
  // Layer 4: Infrastructure (Bottom)
  const infra = skills.tools.filter(t => ['AWS', 'GCP', 'NVIDIA', 'Kubernetes', 'Docker'].includes(t));
  
  // Layer 3: Orchestration & Data
  const orchestration = skills.tools.filter(t => !['AWS', 'GCP', 'NVIDIA', 'Kubernetes', 'Docker'].includes(t))
    .concat(skills.frameworks.filter(f => ['Temporal', 'Apache Beam', 'Dask', 'Dagster/Airflow'].includes(f)));
    
  // Layer 2: Frameworks & Serving
  const frameworks = skills.frameworks.filter(f => !['Temporal', 'Apache Beam', 'Dask', 'Dagster/Airflow'].includes(f));
  
  // Layer 1: Languages (Top)
  const languages = skills.programming;

  return (
    <div className="space-y-6">
      <Layer index={0} title="Languages" icon={Terminal} items={languages} />
      <Layer index={1} title="ML Frameworks & Serving" icon={Box} items={frameworks} />
      <Layer index={2} title="Orchestration & Data" icon={Layers} items={orchestration} />
      <Layer index={3} title="Compute & Infrastructure" icon={Server} items={infra} />
    </div>
  );
};
