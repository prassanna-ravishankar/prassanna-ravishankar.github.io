import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  achievements: string[];
}

interface TechTimelineProps {
  experiences: Experience[];
}

export const TechTimeline: React.FC<TechTimelineProps> = ({ experiences }) => {
  return (
    <div className="relative ml-2 md:ml-4 space-y-12">
      {/* The Main "Pipe" Line */}
      <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent border-r border-dashed border-subtle/20" />

      {experiences.map((job, index) => {
        const isCurrent = index === 0;
        
        return (
          <motion.div
            key={job.company}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-10 md:pl-12"
          >
            {/* Timeline Node (The "Junction") */}
            <div 
              className={`absolute left-0 top-6 w-4 h-4 rounded-full border-2 z-10 transition-colors duration-500
                ${isCurrent 
                  ? 'bg-primary border-primary shadow-[0_0_15px_rgba(47,168,152,0.5)]' 
                  : 'bg-surface border-subtle/30'
                }
              `} 
            >
              {isCurrent && (
                <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-30" />
              )}
            </div>
            
            {/* Horizontal Connector */}
            <div className={`absolute left-4 top-[30px] h-px w-6 
               ${isCurrent ? 'bg-primary/50' : 'bg-subtle/20'}
            `} />

            {/* Content Card */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 group
              ${isCurrent 
                ? 'bg-surface border-primary/20 shadow-xl shadow-primary/5' 
                : 'bg-surface border-subtle/10 hover:border-subtle/20'
              }
            `}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-2">
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${isCurrent ? 'text-primary' : 'text-main'}`}>
                    {job.role}
                  </h3>
                  <div className="flex items-center gap-2 text-lg font-medium text-main/80">
                    <Briefcase className="w-4 h-4 text-muted" />
                    {job.company}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className={`px-3 py-1 rounded-full border flex items-center gap-1
                    ${isCurrent 
                      ? 'bg-primary/10 border-primary/20 text-primary' 
                      : 'bg-subtle/5 border-subtle/10 text-muted'
                    }
                  `}>
                    <Calendar className="w-3 h-3" />
                    {job.duration}
                  </span>
                  <span className="px-3 py-1 rounded-full border bg-subtle/5 border-subtle/10 text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mt-6">
                {job.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted leading-relaxed text-sm">
                    <span className={`mt-2 w-1.5 h-1.5 rounded-none flex-shrink-0 
                      ${isCurrent ? 'bg-primary' : 'bg-subtle/40'}
                    `} /> {/* Square bullets for infra feel */}
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};