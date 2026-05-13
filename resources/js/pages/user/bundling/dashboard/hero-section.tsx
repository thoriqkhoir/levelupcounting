import { Button } from '@/components/ui/button';
import { BookOpen, Check, Infinity, Layers, Package, Percent, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
    { label: 'Hemat Lebih Banyak', value: '70%', icon: Percent, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Program dalam 1 Paket', value: '2+', icon: Layers, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Akses Selamanya', value: '100%', icon: Infinity, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
];

const floatingBadges = [
    { icon: Check, label: 'Hemat Hingga 70%', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30', delay: 0.6 },
    { icon: Layers, label: 'Multi Program', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/30', delay: 0.75 },
    { icon: BookOpen, label: 'Sertifikat Semua Program', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30', delay: 0.9 },
];

export default function HeroSection() {
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
                        Penawaran Spesial Paket Bundling
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="font-av-estiana mx-auto mb-6 max-w-4xl text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                >
                    <span className="text-primary">Belajar Lebih Banyak</span>,{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10">Bayar Lebih Hemat!</span>
                        <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
                    </span>{' '}
                    🎉
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mx-auto mb-10 max-w-2xl text-center text-base text-gray-600 dark:text-gray-300 md:text-lg"
                >
                    Dapatkan akses ke beberapa program pembelajaran sekaligus dengan harga spesial. Tingkatkan skill-mu dengan paket bundling yang dirancang khusus untuk percepatan karirmu!
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-14 flex flex-wrap justify-center gap-4"
                >
                    <a href="#bundles">
                        <Button size="lg" className="gap-2 px-8 text-base rounded-full shadow-lg">
                            <Package size={20} />
                            Lihat Paket Bundling
                        </Button>
                    </a>
                    <a href="https://wa.me/+6287754764475" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" variant="outline" className="px-8 text-base rounded-full">
                            Konsultasi Gratis
                        </Button>
                    </a>
                </motion.div>

                {/* Floating feature badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    className="mb-14 flex flex-wrap justify-center gap-3"
                >
                    {floatingBadges.map((badge) => (
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
                            className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white/70 px-6 py-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
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