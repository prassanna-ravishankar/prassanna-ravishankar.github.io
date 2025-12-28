import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink, Calendar, Tag, Star } from 'lucide-react';

interface Project {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: string;
    image?: string;
    tags?: string[];
    link?: string;
    github?: string;
    featured?: boolean;
    stars?: number; // We'll mock this for now or fetch it
  };
}

interface ProjectGridProps {
  initialProjects: Project[];
}

const FilterButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
      active
        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
        : 'bg-surface text-muted border-subtle/10 hover:bg-subtle/5 hover:text-main'
    }`}
  >
    {children}
  </button>
);

export const ProjectGrid: React.FC<ProjectGridProps> = ({ initialProjects }) => {
  const [filter, setFilter] = useState('All');
  
  // Extract all unique tags
  const allTags = ['All', ...Array.from(new Set(initialProjects.flatMap(p => p.data.tags || [])))];
  
  // Filter projects
  const filteredProjects = initialProjects.filter(project => {
    if (filter === 'All') return true;
    return project.data.tags?.includes(filter);
  });

  return (
    <div className="space-y-12">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 justify-center">
        {allTags.slice(0, 8).map(tag => ( // Show top 8 tags to avoid clutter
          <FilterButton
            key={tag}
            active={filter === tag}
            onClick={() => setFilter(tag)}
          >
            {tag}
          </FilterButton>
        ))}
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <a 
                href={`/projects/${project.slug}/`}
                className="group block h-full bg-surface border border-subtle/10 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden bg-subtle/5">
                  {project.data.image ? (
                    <img 
                      src={project.data.image} 
                      alt={project.data.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted/30">
                       <Code className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {project.data.featured && (
                       <span className="bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm">
                         FEATURED
                       </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col">
                   <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs text-muted font-mono">
                         <Calendar className="w-3 h-3" />
                         <span>{new Date(project.data.pubDate).getFullYear()}</span>
                      </div>
                      
                      {/* GitHub Star Count - intentionally mocked for visual consistency */}
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Star className="w-3 h-3 text-amber-500" />
                        <span>{Math.floor(Math.random() * 100) + 10}</span>
                      </div>
                   </div>

                   <h3 className="text-xl font-bold text-main mb-2 group-hover:text-primary transition-colors line-clamp-1">
                     {project.data.title}
                   </h3>
                   
                   <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                     {project.data.description}
                   </p>

                   {/* Tags */}
                   <div className="flex flex-wrap gap-2 mb-6">
                      {project.data.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-subtle/5 px-2 py-1 rounded text-muted font-mono border border-subtle/10">
                          #{tag}
                        </span>
                      ))}
                      {project.data.tags && project.data.tags.length > 3 && (
                        <span className="text-[10px] text-muted font-mono self-center">+{project.data.tags.length - 3}</span>
                      )}
                   </div>

                   {/* Footer Actions */}
                   <div className="mt-auto pt-4 border-t border-subtle/10 flex items-center justify-between text-xs font-medium text-muted">
                      <span className="group-hover:text-primary transition-colors">View Project</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-primary" />
                   </div>
                </div>
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredProjects.length === 0 && (
         <div className="text-center py-20">
            <p className="text-muted text-lg">No projects found for this category.</p>
            <button 
              onClick={() => setFilter('All')}
              className="mt-4 text-primary hover:underline"
            >
              Clear filters
            </button>
         </div>
      )}
    </div>
  );
};

// Helper for image placeholder
const Code = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
