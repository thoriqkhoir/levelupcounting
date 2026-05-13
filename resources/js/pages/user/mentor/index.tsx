import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, BookText, FileText, Users, Award, Star, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Mentor {
    id: string;
    name: string;
    bio?: string;
    avatar?: string;
    photo_url?: string;
    total_courses: number;
    total_articles: number;
    total_webinars: number;
    total_bootcamps: number;
}

interface MentorIndexProps {
    mentors: Mentor[];
}

const GRID_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230000ff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function MentorIndex({ mentors }: MentorIndexProps) {
    const getInitials = useInitials();

    const getTotalContent = (mentor: Mentor) =>
        mentor.total_courses + mentor.total_articles + mentor.total_webinars + mentor.total_bootcamps;

    const globalStats = [
        { icon: Users, value: mentors.length, label: 'Mentor Aktif', color: 'text-primary', bg: 'bg-primary/10' },
        { icon: BookText, value: mentors.reduce((s, m) => s + m.total_courses, 0), label: 'Total Kelas', color: 'text-blue-600', bg: 'bg-blue-500/10' },
        { icon: BookOpen, value: mentors.reduce((s, m) => s + m.total_bootcamps, 0), label: 'Total Bootcamp', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
        { icon: FileText, value: mentors.reduce((s, m) => s + m.total_articles, 0), label: 'Total Artikel', color: 'text-violet-600', bg: 'bg-violet-500/10' },
    ];

    return (
        <div className="relative min-h-screen bg-background">
            {/* Global Decorative Background — Blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/4 z-0 h-[400px] w-[400px] rounded-full bg-violet-300/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            {/* Global Decorative Background — Grid Pattern */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]" style={{ backgroundImage: GRID_PATTERN }} />

            <UserLayout>
                <Head title="Mentor Kami" />

                {/* ── Hero Section ── */}
                <section className="relative z-10 overflow-hidden py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-6 flex justify-center"
                        >
                            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                                <Award className="h-4 w-4" />
                                Mentor Profesional
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.25 }}
                            className="font-av-estiana mx-auto mb-6 max-w-4xl text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                        >
                            Belajar dari{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-primary">Expert</span>
                                <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-primary/20" />
                            </span>{' '}
                            Terbaik
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mx-auto mb-10 max-w-2xl text-center text-base text-muted-foreground md:text-lg"
                        >
                            Raih kesuksesan bersama mentor berpengalaman yang siap membimbing perjalanan belajar Anda di bidang perpajakan dan akuntansi.
                        </motion.p>

                        {/* Floating badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mb-14 flex flex-wrap justify-center gap-3"
                        >
                            {[
                                { icon: Star, label: '100% Tersertifikasi', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30', delay: 0.55 },
                                { icon: TrendingUp, label: 'Berpengalaman Industri', color: 'text-primary', bg: 'bg-primary/5', delay: 0.7 },
                                { icon: Sparkles, label: 'Kurikulum Praktis', color: 'text-secondary', bg: 'bg-secondary/10', delay: 0.85 },
                            ].map((b) => (
                                <motion.div
                                    key={b.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: b.delay }}
                                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 ${b.bg} ${b.color}`}
                                >
                                    <b.icon className="h-4 w-4" />
                                    {b.label}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Stat Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.65 }}
                            className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
                        >
                            {globalStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white/70 px-4 py-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5"
                                >
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ── Mentors Grid ── */}
                <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20">
                    {mentors.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {mentors.map((mentor) => (
                                <motion.div key={mentor.id} variants={cardVariants}>
                                    <Link href={`/mentor/${mentor.id}`} className="group block h-full">
                                        <div className="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 dark:border-white/10 dark:bg-white/5">
                                            {/* Banner gradient */}
                                            <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-secondary transition-all duration-500 group-hover:scale-[1.02]">
                                                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-xl" />
                                                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-black/10 blur-xl" />
                                            </div>

                                            <div className="relative px-6 pb-6 pt-0">
                                                {/* Avatar overlapping banner */}
                                                <div className="relative mx-auto -mt-14 mb-4 inline-block">
                                                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-2 ring-primary/20 transition-all group-hover:ring-primary/50 dark:border-zinc-900">
                                                        <AvatarImage
                                                            src={mentor.photo_url ? (mentor.photo_url.startsWith('http') ? mentor.photo_url : `/storage/${mentor.photo_url}`) : (mentor.avatar || undefined)}
                                                            alt={mentor.name}
                                                            className="object-cover"
                                                        />
                                                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-2xl font-bold text-white">
                                                            {getInitials(mentor.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-2 -right-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 shadow-lg">
                                                        <Star className="h-3.5 w-3.5 fill-white text-white" />
                                                    </div>
                                                </div>

                                                {/* Name & Bio */}
                                                <div className="mb-4 text-center">
                                                    <h3 className="mb-1 text-xl font-bold text-foreground transition-colors group-hover:text-primary">{mentor.name}</h3>
                                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                                        {mentor.bio || 'Mentor Profesional di Level Up Accounting'}
                                                    </p>
                                                </div>

                                                {/* Stats mini grid */}
                                                <div className="mb-4 grid grid-cols-3 gap-2">
                                                    {[
                                                        { icon: BookText, value: mentor.total_courses, label: 'Kelas', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                                                        { icon: BookOpen, value: mentor.total_bootcamps, label: 'Bootcamp', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                                                        { icon: FileText, value: mentor.total_articles, label: 'Artikel', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                                                    ].map((s) => (
                                                        <div key={s.label} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 ${s.bg}`}>
                                                            <s.icon className={`h-4 w-4 ${s.color}`} />
                                                            <span className={`text-lg font-extrabold ${s.color}`}>{s.value}</span>
                                                            <span className={`text-[10px] font-medium ${s.color}`}>{s.label}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Total & CTA */}
                                                <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-primary/5 px-4 py-2.5">
                                                    <TrendingUp className="h-4 w-4 text-primary" />
                                                    <span className="text-sm text-muted-foreground">Total Konten</span>
                                                    <span className="text-lg font-extrabold text-primary">{getTotalContent(mentor)}</span>
                                                </div>

                                                <Button className="w-full rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 dark:bg-primary/20">
                                                    <span className="flex items-center gap-2">
                                                        Lihat Profil
                                                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                        >
                            <div className="mb-6 text-8xl">👨‍🏫</div>
                            <h3 className="mb-2 text-2xl font-bold">Belum Ada Mentor</h3>
                            <p className="mb-8 max-w-md text-center text-muted-foreground">
                                Mentor profesional kami akan segera hadir untuk membimbing perjalanan belajar Anda
                            </p>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/">Kembali ke Beranda</Link>
                            </Button>
                        </motion.div>
                    )}
                </div>
            </UserLayout>
        </div>
    );
}