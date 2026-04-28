import { CheckCircle, Sparkles, Gift, ListChecks } from 'lucide-react';
import { motion } from 'motion/react';

interface Bootcamp {
    benefits?: string | null;
    requirements?: string | null;
}

function parseList(items?: string | null): string[] {
    if (!items) return [];
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => li.replace(/<\/?li>/g, '').trim());
}

export default function RequirementSection({ bootcamp }: { bootcamp: Bootcamp }) {
    const requirementList = parseList(bootcamp.requirements);
    const benefitList = parseList(bootcamp.benefits);

    return (
        <section className="relative mx-auto w-full max-w-7xl px-4 pt-6 pb-12">
            {/* Background Decoration */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                            Persyaratan & Manfaat
                        </span>
                    </div>
                    <h2 className="mb-4 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                        Siap Untuk Bergabung?
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                        Pastikan kamu memenuhi persyaratan dan lihat manfaat yang akan kamu dapatkan
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Requirements Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative overflow-hidden rounded-2xl border-2 bg-white dark:bg-zinc-900 dark:border-zinc-700 p-8 shadow-xl"
                    >
                        {/* Decorative gradient */}
                        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-3xl" />

                        {/* Header */}
                        <div className="relative mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                <ListChecks className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Persyaratan Peserta
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Yang perlu kamu siapkan
                                </p>
                            </div>
                        </div>

                        {/* Requirements List */}
                        <ul className="relative space-y-4">
                            {requirementList.length > 0 ? (
                                requirementList.map((req, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                                        className="flex items-start gap-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4"
                                    >
                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                            <CheckCircle className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {req}
                                        </span>
                                    </motion.li>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-500 dark:text-gray-400">
                                    <ListChecks className="h-12 w-12 opacity-50" />
                                    <p className="text-sm">Tidak ada persyaratan khusus</p>
                                </div>
                            )}
                        </ul>
                    </motion.div>

                    {/* Benefits Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative overflow-hidden rounded-2xl border-2 bg-white dark:bg-zinc-900 dark:border-zinc-700 p-8 shadow-xl"
                    >
                        {/* Decorative gradient */}
                        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-3xl" />

                        {/* Header */}
                        <div className="relative mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                <Gift className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Manfaat yang Didapatkan
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Investasi yang menguntungkan
                                </p>
                            </div>
                        </div>

                        {/* Benefits List */}
                        <ul className="relative space-y-4">
                            {benefitList.length > 0 ? (
                                benefitList.map((benefit, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                                        className="flex items-start gap-3 rounded-lg bg-green-50 dark:bg-green-900/20 p-4"
                                    >
                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {benefit}
                                        </span>
                                    </motion.li>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-500 dark:text-gray-400">
                                    <Gift className="h-12 w-12 opacity-50" />
                                    <p className="text-sm">Manfaat akan segera ditambahkan</p>
                                </div>
                            )}
                        </ul>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}