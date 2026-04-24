'use client';

import { motion } from 'framer-motion';

const projects = [
  { title: 'Clean your mind', date: 'February 14, 2023', cover: '/assets/cover4.jpg' },
  { title: 'I Finished 75 hard', date: 'February 14, 2023', cover: '/assets/cover2.jpg' },
  { title: 'Mindfulness For Parents', date: 'February 14, 2023', cover: '/assets/cover3.jpg' },
  { title: 'Clean your mind', date: 'February 14, 2023', cover: '/assets/cover1.jpg' },
  { title: 'Clean your mind', date: 'February 14, 2023', cover: '/assets/cover1.jpg' },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.7,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function RecentProjects() {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={container}
      className="w-full px-6 pb-12"
    >
      <motion.h2
        variants={item}
        className="mb-6 text-xl font-medium leading-7 text-[#1f2532]"
        style={{ fontFamily: "'Graphik', sans-serif" }}
      >
        Recent projects
      </motion.h2>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ y: -4 }}
            className="group flex w-[271px] shrink-0 cursor-pointer flex-col gap-1.5"
          >
            {/* Cover thumbnail */}
            <div className="relative h-[214px] w-full overflow-hidden rounded-xl bg-surface transition-shadow group-hover:shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.cover}
                alt={project.title}
                className="absolute left-1/2 top-[7.5%] h-[120%] w-auto -translate-x-1/2 rounded object-cover"
              />
            </div>

            {/* Title & date */}
            <div className="flex flex-col gap-0.5 pt-1">
              <p
                className="text-sm font-medium leading-[18px] text-text-primary"
                style={{ fontFamily: "'Graphik', sans-serif" }}
              >
                {project.title}
              </p>
              <p
                className="text-xs leading-4 text-text-muted"
                style={{ fontFamily: "'Graphik', sans-serif" }}
              >
                {project.date}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
