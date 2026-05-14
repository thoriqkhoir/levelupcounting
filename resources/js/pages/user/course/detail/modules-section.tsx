import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronUp, FileText, Layers, Lock, PlayCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Course {
    modules?: {
        title: string;
        description?: string | null;
        lessons?: {
            title: string;
            description?: string | null;
            type: 'text' | 'video' | 'file' | 'quiz';
            is_free?: boolean;
        }[];
    }[];
}

const lessonTypeIcon = (type: string) => {
    switch (type) {
        case 'video': return <PlayCircle className="h-3.5 w-3.5 text-primary" />;
        case 'quiz': return <Sparkles className="h-3.5 w-3.5 text-yellow-500" />;
        default: return <FileText className="h-3.5 w-3.5 text-blue-500" />;
    }
};

export default function ModulesSection({ course }: { course: Course }) {
    const [expanded, setExpanded] = useState<React.Key | null>('0');

    const totalLessons = course.modules?.reduce((t, m) => t + (m.lessons?.length ?? 0), 0) ?? 0;
    const totalModules = course.modules?.length ?? 0;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-4" id="modules">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-primary/20">
                    <Layers className="h-4 w-4" />
                    Kurikulum Kelas
                </span>
                <h2 className="mt-3 text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl">
                    Modul{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 text-primary">Pembelajaran</span>
                        <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-primary/20" />
                    </span>
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {totalModules} modul · {totalLessons} materi pembelajaran terstruktur
                </p>
            </motion.div>

            {/* Summary bar */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 overflow-hidden rounded-2xl border-2 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
                <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
                <div className="grid grid-cols-3 divide-x divide-gray-100 text-center dark:divide-zinc-700">
                    <div className="py-4 px-2">
                        <p className="text-2xl font-extrabold text-primary">{totalModules}</p>
                        <p className="text-xs text-gray-500">Modul</p>
                    </div>
                    <div className="py-4 px-2">
                        <p className="text-2xl font-extrabold text-secondary">{totalLessons}</p>
                        <p className="text-xs text-gray-500">Materi</p>
                    </div>
                    <div className="py-4 px-2">
                        <p className="text-2xl font-extrabold text-green-600">∞</p>
                        <p className="text-xs text-gray-500">Akses</p>
                    </div>
                </div>
            </motion.div>

            {/* Accordion modules */}
            <Accordion
                className="flex w-full flex-col gap-3"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                expandedValue={expanded}
                onValueChange={setExpanded}
            >
                {course.modules?.map((module, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.06 * idx }}
                    >
                        <AccordionItem
                            value={String(idx)}
                            className="overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-200 data-[expanded]:border-primary/40 data-[expanded]:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
                        >
                            <AccordionTrigger className="w-full text-left hover:cursor-pointer">
                                <div className="flex w-full items-center justify-between gap-3 px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* Module number badge */}
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white shadow-md">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white md:text-lg">{module.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{module.lessons?.length ?? 0} materi</p>
                                        </div>
                                    </div>
                                    <ChevronUp className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 group-data-expanded:-rotate-180" />
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="border-t border-gray-100 dark:border-zinc-700">
                                    <ul className="space-y-1 p-3">
                                        {module.lessons?.length ? (
                                            module.lessons.map((lesson, lidx) => (
                                                <motion.li
                                                    key={lidx}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.04 * lidx }}
                                                    className="flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        {lessonTypeIcon(lesson.type)}
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{lesson.title}</span>
                                                    </div>
                                                    {lesson.is_free ? (
                                                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            Gratis
                                                        </span>
                                                    ) : (
                                                        <Lock className="h-3.5 w-3.5 text-gray-400" />
                                                    )}
                                                </motion.li>
                                            ))
                                        ) : (
                                            <li className="py-4 text-center text-sm text-gray-400">Belum ada materi</li>
                                        )}
                                    </ul>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </motion.div>
                ))}
            </Accordion>
        </section>
    );
}
