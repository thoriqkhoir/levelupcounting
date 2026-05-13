import { motion } from 'framer-motion';
import { Award, Target, Users, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';

const stats = [
    {
        icon: Award,
        value: '100%',
        label: 'Mentor Tersertifikasi',
        color: 'text-primary',
        bg: 'bg-primary/10',
        accent: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
        icon: Users,
        value: '5.000+',
        label: 'Pengguna Terdaftar',
        color: 'text-secondary',
        bg: 'bg-secondary/10',
        accent: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
        icon: Target,
        value: '95%',
        label: 'Tingkat Kepuasan',
        color: 'text-rose-600',
        bg: 'bg-rose-500/10',
        accent: 'bg-rose-50 dark:bg-rose-900/20',
    },
];

const highlights = [
    { icon: CheckCircle, label: 'Kurikulum Berbasis Industri', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30', delay: 0.6 },
    { icon: TrendingUp, label: 'Update Regulasi Terkini', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30', delay: 0.75 },
    { icon: Award, label: 'Sertifikat Diakui Industri', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/30', delay: 0.9 },
];

export function HeroSection() {
    return (
        <section className="relative overflow-hidden py-20 text-gray-900 dark:text-white">
            <div className="relative z-10 mx-auto max-w-7xl px-4">

                {/* Top badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6 flex justify-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        Tentang Level Up Accounting
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="font-av-estiana mx-auto mb-6 max-w-4xl text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                >
                    Platform Edukasi Pajak{' '}
                    <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-clip-text text-transparent relative z-10">
                            Terdepan
                        </span>
                        <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
                    </span>{' '}
                    di Indonesia
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mx-auto mb-10 max-w-2xl text-center text-base text-gray-600 dark:text-gray-300 md:text-lg"
                >
                    Level Up Accounting hadir sebagai solusi pendidikan dan pelatihan perpajakan modern. Kami berfokus pada peningkatan kompetensi aplikatif di bidang akuntansi dan perpajakan untuk membantu mahasiswa, karyawan, hingga praktisi mencapai puncak karir mereka.
                </motion.p>

                {/* Logo / Visual */}
                {/* <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.45 }}
                    className="mb-12 flex justify-center"
                >
                    <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 p-8 shadow-2xl backdrop-blur-3xl md:h-64 md:w-64 dark:from-primary/20 dark:to-secondary/20">
                        <div className="absolute inset-0 rounded-full border border-white/40 bg-white/20 dark:border-white/10 dark:bg-white/5" />
                        <motion.div
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                            className="relative z-10 w-full"
                        >
                            <img
                                src="/assets/images/logo-primary.png"
                                alt="Logo Level Up Accounting"
                                className="h-auto w-full dark:hidden"
                                draggable={false}
                            />
                            <img
                                src="/assets/images/logo-secondary.png"
                                alt="Logo Level Up Accounting"
                                className="hidden h-auto w-full dark:block"
                                draggable={false}
                            />
                        </motion.div>
                    </div>
                </motion.div> */}

                {/* Floating feature badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    className="mb-14 flex flex-wrap justify-center gap-3"
                >
                    {highlights.map((badge) => (
                        <motion.div
                            key={badge.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: badge.delay }}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 ${badge.bg} ${badge.color}`}
                        >
                            <badge.icon className="h-4 w-4" />
                            {badge.label}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stat Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                    className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white/70 px-6 py-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5"
                        >
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div className="text-center">
                                <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}