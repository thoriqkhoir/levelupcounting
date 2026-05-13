import { CheckCircle, Gift, ListChecks, Sparkles, XCircle } from 'lucide-react';
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
        <section className="relative mx-auto w-full max-w-7xl px-4 py-12">
            {/* BG decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
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
                        <Sparkles className="h-4 w-4" />
                        Persyaratan & Manfaat
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                        Siap Untuk{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-primary">Bergabung?</span>
                            <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-primary/20" />
                        </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 dark:text-gray-400">
                        Pastikan kamu memenuhi persyaratan dan lihat manfaat luar biasa yang akan kamu dapatkan
                    </p>
                </motion.div>

                {/* Two-column layout */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Requirements Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="relative overflow-hidden rounded-3xl border-2 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                    >
                        {/* Gradient top accent */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
                        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 blur-3xl" />

                        <div className="relative p-6 md:p-8">
                            {/* Card header */}
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                                    <ListChecks className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Persyaratan Peserta</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Yang perlu kamu siapkan</p>
                                </div>
                            </div>

                            {/* Requirements list */}
                            {requirementList.length > 0 ? (
                                <ul className="space-y-3">
                                    {requirementList.map((req, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: 0.2 + idx * 0.07 }}
                                            className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20"
                                        >
                                            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/50">
                                                <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-100">{req}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-blue-200 py-10 dark:border-blue-900/30">
                                    <XCircle className="h-10 w-10 text-gray-300" />
                                    <p className="text-sm text-gray-500">Tidak ada persyaratan khusus</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Benefits Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="relative overflow-hidden rounded-3xl border-2 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                    >
                        {/* Gradient top accent */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-600" />
                        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-green-500/15 to-emerald-500/15 blur-3xl" />

                        <div className="relative p-6 md:p-8">
                            {/* Card header */}
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
                                    <Gift className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manfaat yang Didapatkan</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Investasi yang menguntungkan</p>
                                </div>
                            </div>

                            {/* Benefits list */}
                            {benefitList.length > 0 ? (
                                <ul className="space-y-3">
                                    {benefitList.map((benefit, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, x: 12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: 0.2 + idx * 0.07 }}
                                            className="flex items-start gap-3 rounded-xl bg-green-50 p-4 dark:bg-green-900/20"
                                        >
                                            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-800/50">
                                                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-100">{benefit}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-green-200 py-10 dark:border-green-900/30">
                                    <Gift className="h-10 w-10 text-gray-300" />
                                    <p className="text-sm text-gray-500">Manfaat akan segera ditambahkan</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
