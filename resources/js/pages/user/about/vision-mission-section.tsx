import { motion } from 'framer-motion';
import { Eye, Target } from 'lucide-react';

export function VisionMissionSection() {
    return (
        <section className="pb-12 dark:bg-gray-900 md:pb-16 lg:pb-20">
            <div className="mx-auto max-w-7xl px-4">
                {/* Title */}
                <div className="py-4 text-center">
                    <div className="mb-4 flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                            🎯 Visi &amp; Misi
                        </span>
                    </div>
                    <h2 className="font-av-estiana text-2xl font-extrabold md:text-3xl">
                        Visi &amp;{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10">Misi Kami</span>
                            <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
                        </span>
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                    {/* Visi */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 md:p-8"
                    >
                        <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-2xl transition-transform group-hover:scale-150 md:h-32 md:w-32 md:-translate-y-8 md:translate-x-8" />
                        
                        <div className="relative">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg md:mb-6 md:h-16 md:w-16">
                                <Eye className="h-6 w-6 text-white md:h-8 md:w-8" />
                            </div>
                            
                            <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">Visi Kami</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                                Menjadi platform pembelajaran perpajakan terdepan di Indonesia yang menghasilkan 
                                profesional berkompeten dan berintegritas tinggi dalam bidang perpajakan dan akuntansi.
                            </p>
                        </div>
                    </motion.div>

                    {/* Misi */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 md:p-8"
                    >
                        <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-2xl transition-transform group-hover:scale-150 md:h-32 md:w-32 md:-translate-y-8 md:translate-x-8" />
                        
                        <div className="relative">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg md:mb-6 md:h-16 md:w-16">
                                <Target className="h-6 w-6 text-white md:h-8 md:w-8" />
                            </div>
                            
                            <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">Misi Kami</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400 md:space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary md:mt-1 md:h-6 md:w-6">
                                        1
                                    </span>
                                    <span className="text-sm md:text-base">Memberikan pendidikan perpajakan berkualitas tinggi dan aplikatif</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary md:mt-1 md:h-6 md:w-6">
                                        2
                                    </span>
                                    <span className="text-sm md:text-base">Mengembangkan kompetensi profesional di bidang perpajakan</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary md:mt-1 md:h-6 md:w-6">
                                        3
                                    </span>
                                    <span className="text-sm md:text-base">Membangun ekosistem pembelajaran yang inovatif dan kolaboratif</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}