import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Link } from '@inertiajs/react';
import { ArrowRight, Award, Linkedin, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface Mentor {
    id: string;
    name: string;
    bio?: string;
    avatar?: string | null;
}

interface Bootcamp {
    mentors?: Mentor[];
}

export default function MentorSection({ bootcamp }: { bootcamp: Bootcamp }) {
    const getInitials = useInitials();
    const mentors = bootcamp.mentors ?? [];

    const getAvatarSrc = (avatar?: string | null) => {
        if (!avatar) return null;
        if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/')) return avatar;
        return `/storage/${avatar}`;
    };

    if (mentors.length === 0) return null;

    return (
        <section className="relative mx-auto w-full max-w-7xl px-4 py-12">
            {/* BG decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
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
                        {mentors.length === 1 ? 'Mentor Profesional' : 'Para Mentor Profesional'}
                    </span>
                    <h2 className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                        {mentors.length === 1 ? 'Belajar dari ' : 'Belajar dari '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-primary">{mentors.length === 1 ? 'Ahlinya' : 'Para Ahli'}</span>
                            <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-primary/20" />
                        </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 dark:text-gray-400">
                        Dipandu langsung oleh praktisi berpengalaman yang aktif di industri
                    </p>
                </motion.div>

                {/* Mentor cards */}
                <div className={`grid gap-6 ${mentors.length === 1 ? 'max-w-md mx-auto' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
                    {mentors.map((mentor, idx) => (
                        <motion.div
                            key={mentor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <Link
                                href={`/mentor/${mentor.id}`}
                                className="group relative block overflow-hidden rounded-3xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
                            >
                                {/* Top gradient accent */}
                                <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />

                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-3xl" />

                                <div className="relative p-6 md:p-8">
                                    <div className="flex flex-col items-center gap-5 text-center">
                                        {/* Avatar with badge */}
                                        <div className="relative flex-shrink-0">
                                            <Avatar className="h-24 w-24 border-4 border-white shadow-xl dark:border-zinc-800 md:h-28 md:w-28">
                                                <AvatarImage src={getAvatarSrc(mentor.avatar) ?? undefined} alt={mentor.name} />
                                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-3xl font-bold text-white">
                                                    {getInitials(mentor.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {/* Verified badge */}
                                            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-green-500 shadow-lg dark:border-zinc-900">
                                                <Award className="h-3.5 w-3.5 text-white" />
                                            </div>
                                        </div>

                                        <div className="w-full space-y-3">
                                            {/* Name */}
                                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{mentor.name}</h3>

                                            {/* Stars */}
                                            <div className="flex items-center justify-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                                <span className="ml-1.5 text-sm font-bold text-gray-600 dark:text-gray-400">5.0</span>
                                            </div>

                                            {/* Mentor badge */}
                                            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                <Linkedin className="h-3 w-3" />
                                                Mentor Profesional
                                            </div>

                                            {/* Bio */}
                                            <p className="line-clamp-3 min-h-[4rem] text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                                {mentor.bio ?? 'Mentor profesional Level Up Accounting dengan pengalaman industri yang luas.'}
                                            </p>

                                            {/* CTA link */}
                                            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary transition-all duration-200 group-hover:gap-3">
                                                <span>Lihat Profile Lengkap</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
