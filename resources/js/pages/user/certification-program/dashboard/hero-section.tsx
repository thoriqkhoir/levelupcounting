import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Award, Sparkles, CheckCircle, TrendingUp, ArrowRight, BadgeCheck, Users } from 'lucide-react';

const stats = [
    { icon: BadgeCheck, value: '100%', label: 'Diakui Industri', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Users, value: '500+', label: 'Peserta Lulus', color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: TrendingUp, value: '95%', label: 'Tingkat Kepuasan', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
];

const badges = [
    { icon: CheckCircle, label: 'Sertifikat Profesional', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30', delay: 0.55 },
    { icon: Award, label: 'Partner Industri Terpercaya', color: 'text-primary', bg: 'bg-primary/5 dark:bg-primary/10', delay: 0.7 },
    { icon: TrendingUp, label: 'Peluang Karir Lebih Luas', color: 'text-secondary', bg: 'bg-secondary/5 dark:bg-secondary/10', delay: 0.85 },
];

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden py-20 text-foreground">
            <div className="relative z-10 mx-auto max-w-7xl px-4">

                {/* Top badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6 flex justify-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-semibold text-secondary shadow-sm ring-1 ring-secondary/20">
                        <Award className="h-4 w-4" />
                        Program Sertifikasi
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="font-av-estiana mx-auto mb-6 max-w-4xl text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                >
                    Raih{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 text-primary">Sertifikasi</span>
                        <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-primary/20" />
                    </span>{' '}
                    &amp;{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 text-secondary">Kredibilitas</span>
                        <span className="absolute bottom-1 left-0 z-0 h-3 w-full rotate-1 rounded bg-secondary/20" />
                    </span>{' '}
                    Profesional
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mx-auto mb-10 max-w-2xl text-center text-base text-muted-foreground md:text-lg"
                >
                    Tingkatkan kompetensi dan buka peluang karir lebih luas dengan program sertifikasi yang dirancang khusus bersama pakar industri terkemuka.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="mb-10 flex flex-wrap justify-center gap-4"
                >
                    <a href="#certification-programs">
                        <Button size="default" className="rounded-full px-8">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Lihat Program
                        </Button>
                    </a>
                    <a href="https://wa.me/+6287754764475" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="default" className="rounded-full px-8">
                            Konsultasi Gratis
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </a>
                </motion.div>

                {/* Floating feature badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mb-14 flex flex-wrap justify-center gap-3"
                >
                    {badges.map((badge) => (
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
                    transition={{ duration: 0.7, delay: 0.65 }}
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
