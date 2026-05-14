import { Award, BarChart3, BookOpen, Clock, Sparkles, Star, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface Course {
    title: string;
    short_description?: string | null;
    thumbnail?: string | null;
    level: 'beginner' | 'intermediate' | 'advanced';
    created_at: string;
    updated_at: string;
    modules?: { lessons?: { type: string }[] }[];
}

export default function HeroSection({ course }: { course: Course }) {
    const levelMap = {
        beginner: { label: 'Beginner', color: 'from-green-500 to-emerald-600', badge: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300' },
        intermediate: { label: 'Intermediate', color: 'from-yellow-500 to-orange-500', badge: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300' },
        advanced: { label: 'Advanced', color: 'from-red-500 to-rose-600', badge: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300' },
    };
    const lv = levelMap[course.level];

    const totalLessons = course.modules?.reduce((t, m) => t + (m.lessons?.length ?? 0), 0) ?? 0;
    const totalVideos = course.modules?.reduce((t, m) => t + (m.lessons?.filter(l => l.type === 'video').length ?? 0), 0) ?? 0;

    const stats = [
        { icon: Clock, label: 'Update', value: new Date(course.updated_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }), color: 'text-primary', bg: 'bg-primary/10' },
        { icon: BookOpen, label: 'Materi', value: `${totalLessons}`, color: 'text-secondary', bg: 'bg-secondary/10' },
        { icon: Star, label: 'Rating', value: '4.8', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
        { icon: Users, label: 'Siswa', value: '1.2K+', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    ];

    return (
        <section className="relative mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60 sm:p-12">
                {/* Animated background blobs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0.35, 0.2] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
                        className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"
                    />
                </div>

                <div className="relative z-10">
                    <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-14">

                    {/* RIGHT: Thumbnail — first on mobile */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="lg:col-span-2 lg:order-last"
                    >
                        <div className="relative overflow-hidden rounded-3xl border-2 border-white/60 shadow-2xl dark:border-zinc-700">
                            <img
                                src={course.thumbnail ? `/storage/${course.thumbnail}` : '/assets/images/placeholder.png'}
                                alt={course.title}
                                className="aspect-video w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                            {/* Level badge - top left */}
                            <div className="absolute top-3 left-3">
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shadow backdrop-blur-sm ${lv.badge}`}>
                                    <BarChart3 className="h-3 w-3" />
                                    {lv.label}
                                </span>
                            </div>

                            {/* Video count badge - top right */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="absolute top-3 right-3"
                            >
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-primary shadow-lg backdrop-blur-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                    </span>
                                    {totalVideos} Video Preview
                                </span>
                            </motion.div>

                            {/* Bottom info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <div className="flex items-center justify-between text-white">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="text-xs font-semibold">
                                            Rilis {new Date(course.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm border border-white/30">
                                        Kelas Online
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats strip below image */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-4 grid grid-cols-4 overflow-hidden rounded-2xl border-2 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                        >
                            {stats.map(({ icon: Icon, label, value, color, bg }, i) => (
                                <div key={label} className={`flex flex-col items-center gap-1 py-4 px-2 ${i < 3 ? 'border-r border-gray-100 dark:border-zinc-700' : ''}`}>
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                                        <Icon className={`h-4 w-4 ${color}`} />
                                    </div>
                                    <p className={`text-sm font-extrabold leading-none ${color}`}>{value}</p>
                                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* LEFT: Content */}
                    <div className="lg:col-span-3 lg:order-first space-y-6">
                        {/* Badges row */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className="flex flex-wrap gap-2"
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary/30 bg-white px-3 py-1.5 text-xs font-semibold shadow dark:bg-zinc-900">
                                <BookOpen className="h-3.5 w-3.5 text-primary" />
                                <span className="text-gray-900 dark:text-white">Kelas Online</span>
                            </span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${lv.badge}`}>
                                <Award className="h-3.5 w-3.5" />
                                {lv.label}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
                                <Sparkles className="h-3.5 w-3.5" />
                                Tersertifikasi
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.2 }}
                            className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
                        >
                            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                                {course.title}
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg"
                        >
                            {course.short_description || 'Tingkatkan kemampuan Anda dengan kelas online berkualitas tinggi yang dirancang oleh para ahli industri.'}
                        </motion.p>

                        {/* Rating row */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.38 }}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <div className="flex items-center gap-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="ml-1 text-sm font-bold text-gray-800 dark:text-white">4.8</span>
                                <span className="text-sm text-gray-500">(1,200+ siswa)</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <span>{totalLessons} materi · {totalVideos} video</span>
                            </div>
                        </motion.div>

                        {/* Quick feature tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.44 }}
                            className="flex flex-wrap gap-2"
                        >
                            {['Sertifikat', 'Akses Selamanya', 'Live Konsultasi', 'Project Based'].map((tag) => (
                                <span key={tag} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    {tag}
                                </span>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <a href="#register" className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40">
                                <Sparkles className="h-5 w-5" />
                                Daftar Sekarang
                            </a>
                        </motion.div>
                    </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
