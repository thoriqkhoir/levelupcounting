import { Link } from '@inertiajs/react';
import { Award, BadgeCheck, BookOpen, Sparkles, Star, Target, User } from 'lucide-react';
import { motion } from 'motion/react';

interface Course {
    title: string;
    description?: string | null;
    key_points?: string | null;
    user?: { id: string; name: string; bio: string | null };
    images?: { image_url: string }[];
}

function parseList(items?: string | null): string[] {
    if (!items) return [];
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => li.replace(/<\/?li>/g, '').trim());
}

export default function AboutSection({ course }: { course: Course }) {
    const keyPoints = parseList(course.key_points);

    return (
        <div className="space-y-12 py-4">
            {/* About Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mx-auto w-full max-w-7xl px-4"
                id="about"
            >
                <div className="mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-primary/20">
                        <BookOpen className="h-4 w-4" />
                        Tentang Kelas
                    </span>
                    <h2 className="mt-3 text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl">
                        Tentang Kelas Ini
                    </h2>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Kembangkan skill dengan pembelajaran terstruktur</p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-8 shadow-lg dark:border-zinc-700 dark:from-primary/10 dark:via-zinc-900 dark:to-secondary/10">
                    <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                    <p className="relative text-base leading-relaxed text-gray-700 dark:text-gray-300">
                        {course.description || 'Deskripsi kelas akan segera tersedia.'}
                    </p>
                </div>
            </motion.section>

            {/* Highlight Images */}
            {course.images && course.images.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mx-auto w-full max-w-7xl px-4"
                >
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 shadow-sm">
                            <Target className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Highlight Kelas</h3>
                            <p className="text-sm text-gray-500">Tampilan nyata dari materi pembelajaran</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {course.images.map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.45, delay: 0.08 * index }}
                                className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-700"
                            >
                                <img
                                    src={image.image_url ? `/storage/${image.image_url}` : '/assets/images/placeholder.png'}
                                    alt={`${course.title} - Highlight ${index + 1}`}
                                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Key Points */}
            {keyPoints.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mx-auto w-full max-w-7xl px-4"
                >
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 shadow-sm dark:bg-green-900/30">
                            <BadgeCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Yang Akan Kamu Pelajari</h3>
                            <p className="text-sm text-gray-500">{keyPoints.length} poin utama pembelajaran</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {keyPoints.map((point, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.04 * idx }}
                                className="group flex items-start gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
                            >
                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                                    <BadgeCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{point}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Instructor */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mx-auto w-full max-w-7xl px-4"
            >
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 shadow-sm dark:bg-blue-900/30">
                        <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Belajar dengan Ahlinya</h3>
                        <p className="text-sm text-gray-500">Instruktur berpengalaman di industri</p>
                    </div>
                </div>

                {course.user?.name === 'Admin' ? (
                    <div className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg dark:border-zinc-700 dark:from-blue-900/20 dark:to-indigo-900/20">
                        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
                        <div className="relative flex items-center gap-5">
                            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                                <User className="h-10 w-10 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{course.user?.name}</h4>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                        <Sparkles className="h-3 w-3" />Expert
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{course.user?.bio || 'Tim Expert Level Up Accounting'}</p>
                                <div className="mt-2 flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="ml-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">5.0 Rating</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link
                        href={`/mentor/${course.user?.id}`}
                        className="group relative block overflow-hidden rounded-3xl border-2 border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl dark:border-zinc-700 dark:from-blue-900/20 dark:to-indigo-900/20"
                    >
                        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
                        <div className="relative flex items-center gap-5">
                            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg transition-transform duration-300 group-hover:scale-105">
                                <User className="h-10 w-10 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{course.user?.name}</h4>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                        <Sparkles className="h-3 w-3" />Instructor
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{course.user?.bio || 'Professional Instructor'}</p>
                                <div className="mt-2 flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="ml-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">5.0 Rating</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}
            </motion.section>
        </div>
    );
}
