import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import { BookOpen, Calendar, Clock, MapPin, Sparkles, Users, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

interface Mentor {
    id: string;
    name: string;
    avatar?: string | null;
}

interface Bootcamp {
    title: string;
    thumbnail?: string | null;
    description?: string | null;
    start_date: string;
    end_date: string;
    quota?: number;
    curriculum?: string | null;
    mentors?: Mentor[];
}

export default function HeroSection({ bootcamp }: { bootcamp: Bootcamp }) {
    const getInitials = useInitials();
    const mentors = bootcamp.mentors ?? [];

    const getAvatarSrc = (avatar?: string | null) => {
        if (!avatar) return null;
        if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/')) return avatar;
        return `/storage/${avatar}`;
    };

    const durationDays = Math.ceil(
        (new Date(bootcamp.end_date).getTime() - new Date(bootcamp.start_date).getTime()) / (1000 * 60 * 60 * 24),
    );
    const curriculumCount = bootcamp.curriculum ? (bootcamp.curriculum.match(/<li>/g) ?? []).length : 0;

    const stats = [
        { icon: Clock, label: 'Durasi', value: durationDays < 7 ? `${durationDays} Hari` : `${Math.ceil(durationDays / 7)} Minggu`, color: 'text-primary', bg: 'bg-primary/10' },
        { icon: BookOpen, label: 'Modul', value: curriculumCount > 0 ? `${curriculumCount}` : '10+', color: 'text-secondary', bg: 'bg-secondary/10' },
        { icon: Users, label: 'Mentor', value: mentors.length > 0 ? `${mentors.length}` : '1', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
        { icon: MapPin, label: 'Format', value: 'Online', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    ];

    return (
        <section className="relative overflow-hidden py-12 md:py-16 lg:py-20">
            {/* Animated background blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">

                    {/* RIGHT: Image card — first on mobile */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="order-first lg:order-last"
                    >
                        {/* Thumbnail with floating badge */}
                        <div className="relative overflow-hidden rounded-3xl border-2 border-white/60 shadow-2xl dark:border-zinc-700">
                            <img
                                src={bootcamp.thumbnail ? `/storage/${bootcamp.thumbnail}` : '/assets/images/placeholder.png'}
                                alt={bootcamp.title}
                                className="aspect-video w-full object-cover md:aspect-[4/3]"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                            {/* Top-right live badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="absolute top-4 right-4"
                            >
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-primary shadow-lg backdrop-blur-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                    </span>
                                    🔥 Pendaftaran Terbuka
                                </span>
                            </motion.div>

                            {/* Bottom info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                <div className="flex items-center justify-between text-white">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-xs font-semibold md:text-sm">
                                            {new Date(bootcamp.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm border border-white/30">
                                        {durationDays} Hari
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
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
                                        <Icon className={`h-4 w-4 ${color}`} />
                                    </div>
                                    <p className={`text-base font-extrabold leading-none ${color}`}>{value}</p>
                                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* LEFT: Content — second on mobile */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.65 }}
                        className="order-last space-y-6 lg:order-first"
                    >
                        {/* Pill badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <span className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-white px-4 py-1.5 text-sm font-semibold shadow-lg dark:bg-zinc-900">
                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                                <span className="text-gray-900 dark:text-white">Bootcamp Intensif</span>
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.18 }}
                            className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
                        >
                            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                                {bootcamp.title}
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.28 }}
                            className="text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg"
                        >
                            {bootcamp.description ||
                                'Bergabunglah dengan bootcamp kami untuk meningkatkan keterampilan Anda dalam bidang teknologi. Pelajari dari para ahli dan tingkatkan karir Anda dengan pengetahuan praktis yang relevan.'}
                        </motion.p>

                        {/* Mentors cluster */}
                        {mentors.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.34 }}
                                className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-primary/15 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80"
                            >
                                <div className="flex -space-x-3">
                                    {mentors.slice(0, 4).map((mentor) =>
                                        getAvatarSrc(mentor.avatar) ? (
                                            <img
                                                key={mentor.id}
                                                src={getAvatarSrc(mentor.avatar) ?? undefined}
                                                alt={mentor.name}
                                                className="h-10 w-10 rounded-full border-2 border-white object-cover shadow dark:border-zinc-900"
                                            />
                                        ) : (
                                            <div
                                                key={mentor.id}
                                                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-white shadow dark:border-zinc-900"
                                            >
                                                {getInitials(mentor.name)}
                                            </div>
                                        ),
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        {mentors.length === 1 ? '1 mentor' : `${mentors.length} mentor`} bootcamp
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {mentors.slice(0, 2).map((m) => m.name).join(', ')}
                                        {mentors.length > 2 ? ` +${mentors.length - 2} lainnya` : ''}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Date info cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.4 }}
                            className="grid grid-cols-2 gap-3"
                        >
                            {[
                                { icon: Calendar, label: 'Mulai', value: new Date(bootcamp.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), color: 'text-primary', bg: 'bg-primary/10' },
                                { icon: Clock, label: 'Selesai', value: new Date(bootcamp.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), color: 'text-secondary', bg: 'bg-secondary/10' },
                            ].map(({ icon: Icon, label, value, color, bg }) => (
                                <div key={label} className="flex items-center gap-3 rounded-xl border-2 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${bg}`}>
                                        <Icon className={`h-5 w-5 ${color}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{label}</p>
                                        <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.48 }}
                            className="flex flex-wrap items-center gap-3"
                        >
                            <a href="#register">
                                <Button size="lg" className="gap-2 px-8 font-bold shadow-lg shadow-primary/30">
                                    <Sparkles className="h-4 w-4" />
                                    Daftar Sekarang
                                </Button>
                            </a>
                            <a href="#curriculum">
                                <Button size="lg" variant="outline" className="gap-2 px-6 font-semibold">
                                    <ArrowDown className="h-4 w-4" />
                                    Lihat Kurikulum
                                </Button>
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
