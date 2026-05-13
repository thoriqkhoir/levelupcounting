import { CheckCircle, Sparkles, Wrench, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface Bootcamp {
    tools?: { name: string; description?: string | null; icon: string | null }[];
}

export default function ToolsSection({ bootcamp }: { bootcamp: Bootcamp }) {
    const tools = bootcamp.tools ?? [];

    return (
        <section className="relative mx-auto w-full max-w-7xl px-4 py-12" id="tools">
            {/* BG decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-primary/20">
                        <Wrench className="h-4 w-4" />
                        Tools & Teknologi
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                        Tools yang Akan{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-primary">Kamu Kuasai</span>
                            <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-primary/20" />
                        </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 dark:text-gray-400">
                        Teknologi dan tools industri yang akan kamu gunakan selama bootcamp berlangsung
                    </p>
                </motion.div>

                {tools.length > 0 ? (
                    <>
                        {/* Tools grid */}
                        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {tools.map((tool, idx) => (
                                <motion.div
                                    key={tool.name}
                                    initial={{ opacity: 0, scale: 0.88 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.45, delay: idx * 0.05 }}
                                    className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
                                >
                                    {/* Hover gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl" />

                                    {/* Corner wrench badge */}
                                    <div className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Wrench className="h-3 w-3 text-primary" />
                                    </div>

                                    <div className="relative flex flex-col items-center gap-3 text-center">
                                        {/* Icon container */}
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-2.5 shadow-inner transition-transform duration-300 group-hover:scale-110 dark:from-zinc-800 dark:to-zinc-700">
                                            {tool.icon ? (
                                                <img
                                                    src={`/storage/${tool.icon}`}
                                                    alt={tool.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <Zap className="h-8 w-8 text-primary" />
                                            )}
                                        </div>

                                        {/* Name */}
                                        <h3 className="text-sm font-bold text-gray-900 leading-tight dark:text-white">{tool.name}</h3>

                                        {/* Description */}
                                        {tool.description && (
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{tool.description}</p>
                                        )}

                                        {/* Industry badge */}
                                        <div className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400">
                                            <CheckCircle className="h-3 w-3" />
                                            <span className="font-medium">Industry Standard</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom summary card */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            className="mt-10 overflow-hidden rounded-3xl border-2 bg-gradient-to-r from-primary/5 via-white to-secondary/5 shadow-lg dark:border-zinc-700 dark:from-primary/10 dark:via-zinc-900 dark:to-secondary/10"
                        >
                            <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
                            <div className="grid grid-cols-3 divide-x divide-gray-100 text-center dark:divide-zinc-700">
                                <div className="flex flex-col items-center gap-1 py-6 px-4">
                                    <p className="text-3xl font-extrabold text-primary">{tools.length}</p>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tools</p>
                                </div>
                                <div className="flex flex-col items-center gap-1 py-6 px-4">
                                    <p className="text-3xl font-extrabold text-secondary">100%</p>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry Ready</p>
                                </div>
                                <div className="flex flex-col items-center gap-1 py-6 px-4">
                                    <p className="text-2xl font-extrabold text-green-600">Hands-On</p>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Praktik Langsung</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-gray-200 py-16 dark:border-zinc-700"
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                            <Wrench className="h-10 w-10 text-gray-400" />
                        </div>
                        <p className="text-center text-gray-500 dark:text-gray-400">Tools akan segera ditambahkan</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
