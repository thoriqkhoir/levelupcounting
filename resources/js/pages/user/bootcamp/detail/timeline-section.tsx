import { BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Bootcamp {
    curriculum?: string | null;
}

function parseCurriculum(curriculum?: string | null): string[] {
    if (!curriculum) return [];
    const matches = curriculum.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => li.replace(/<\/?li>/g, '').trim());
}

export default function TimelineSection({ bootcamp }: { bootcamp: Bootcamp }) {
    const curriculumList = parseCurriculum(bootcamp.curriculum);

    return (
        <section className="relative mx-auto w-full max-w-7xl px-4 py-12" id="curriculum">
            {/* BG decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-primary/20">
                        <Sparkles className="h-4 w-4" />
                        Kurikulum Bootcamp
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                        Materi yang Akan{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-primary">Kamu Pelajari</span>
                            <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-primary/20" />
                        </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 dark:text-gray-400">
                        Kurikulum terstruktur yang dirancang membawamu dari pemula hingga mahir dalam waktu singkat
                    </p>

                    {curriculumList.length > 0 && (
                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                            <BookOpen className="h-4 w-4" />
                            {curriculumList.length} Modul Pembelajaran
                        </div>
                    )}
                </motion.div>

                {/* Curriculum grid */}
                {curriculumList.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {curriculumList.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: idx * 0.04 }}
                                className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
                            >
                                {/* Hover gradient fill */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl" />

                                {/* Number badge */}
                                <div className="relative z-10 mb-4 flex items-start justify-between gap-2">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md shadow-primary/30">
                                        <BookOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                        {idx + 1}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="relative z-10 mb-3 text-sm font-semibold leading-snug text-gray-800 dark:text-gray-100">
                                    {item}
                                </h3>

                                {/* Included badge */}
                                <div className="relative z-10 flex items-center gap-1.5">
                                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                    <span className="text-[11px] font-medium text-green-600 dark:text-green-400">Included</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-gray-200 py-16 dark:border-zinc-700"
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                            <BookOpen className="h-10 w-10 text-gray-400" />
                        </div>
                        <p className="text-center text-gray-500 dark:text-gray-400">Kurikulum akan segera ditambahkan</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
