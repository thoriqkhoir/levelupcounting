import { Button } from '@/components/ui/button';
import { TransitionPanel } from '@/components/ui/transition-panel';
import { CheckCircle, Clock, FileText, Lock, PlayCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Course {
    modules?: {
        title: string;
        description?: string | null;
        lessons?: {
            title: string;
            description?: string | null;
            type: 'text' | 'video' | 'file' | 'quiz';
            video_url?: string | null;
        }[];
    }[];
}

interface VideoSectionProps {
    course: Course;
    onNavigateToModules?: () => void;
}

function getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
}

export default function VideoSection({ course, onNavigateToModules }: VideoSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const items =
        course.modules
            ?.flatMap((module) =>
                (module.lessons?.filter((lesson) => lesson.type === 'video') || []).map((lesson) => ({
                    title: lesson.title,
                    videoUrl: lesson.video_url,
                    description: lesson.description,
                })),
            )
            .slice(0, 2) || [];

    const totalLessons = course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0;
    const totalVideos = course.modules?.reduce((total, module) => total + (module.lessons?.filter(l => l.type === 'video').length || 0), 0) || 0;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-4">
            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-primary/20">
                    <PlayCircle className="h-4 w-4" />
                    Preview Kelas
                </span>
                <h2 className="mt-3 text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl">
                    Lihat Contoh{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 text-primary">Materi Kelas</span>
                        <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-primary/20" />
                    </span>
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Akses {items.length} video preview sebelum bergabung — gratis!
                </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Video Player */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <div className="relative overflow-hidden rounded-3xl bg-gray-950 shadow-2xl">
                        <TransitionPanel
                            activeIndex={activeIndex}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            variants={{
                                enter: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
                                center: { opacity: 1, scale: 1, filter: 'blur(0px)' },
                                exit: { opacity: 0, scale: 1.05, filter: 'blur(8px)' },
                            }}
                            className="aspect-video w-full"
                        >
                            {items.map((item, index) => (
                                <div key={index} className="aspect-video w-full">
                                    {item?.videoUrl ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={
                                                item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be')
                                                    ? `https://www.youtube.com/embed/${getYoutubeId(item.videoUrl)}`
                                                    : ''
                                            }
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="h-full w-full"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                                            <div className="text-center">
                                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
                                                    <PlayCircle className="h-10 w-10 text-zinc-600" />
                                                </div>
                                                <p className="text-zinc-400">Video tidak tersedia</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </TransitionPanel>

                        {/* Bottom overlay with title */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{items[activeIndex]?.title || 'Pilih video preview'}</h3>
                                    {items[activeIndex]?.description && (
                                        <p className="mt-1 text-sm text-gray-300 line-clamp-1">{items[activeIndex].description}</p>
                                    )}
                                </div>
                                <span className="flex-shrink-0 rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-semibold text-green-400 backdrop-blur-sm ring-1 ring-green-500/30">
                                    Gratis
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Playlist Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <div className="overflow-hidden rounded-3xl border-2 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                        {/* Header */}
                        <div className="border-b border-gray-100 p-5 dark:border-zinc-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daftar Materi</h3>
                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <FileText className="h-4 w-4" />
                                    <span>{totalLessons} Materi</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <PlayCircle className="h-4 w-4" />
                                    <span>{totalVideos} Video</span>
                                </div>
                            </div>
                        </div>

                        {/* Playlist items */}
                        <div className="max-h-[320px] space-y-2 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-700">
                            {items.map((item, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`group w-full overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 ${
                                        activeIndex === index
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-gray-100 bg-gray-50 hover:border-primary/30 hover:bg-primary/3 dark:border-zinc-700 dark:bg-zinc-800/60'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 p-3.5">
                                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
                                            activeIndex === index
                                                ? 'bg-primary text-white shadow-md'
                                                : 'bg-gray-200 text-gray-500 group-hover:bg-primary/15 group-hover:text-primary dark:bg-zinc-700 dark:text-zinc-400'
                                        }`}>
                                            <PlayCircle className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-semibold leading-snug ${activeIndex === index ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
                                                {item?.title}
                                            </h4>
                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                                                <Clock className="h-3 w-3" />
                                                <span>Preview Gratis</span>
                                            </div>
                                        </div>
                                        {activeIndex === index && (
                                            <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                                        )}
                                    </div>
                                </motion.button>
                            ))}

                            {/* Locked content indicator */}
                            {totalLessons - items.length > 0 && (
                                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800/40">
                                    <div className="flex items-center gap-3 p-3.5">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-200 dark:bg-zinc-700">
                                            <Lock className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                +{totalLessons - items.length} Materi Lainnya
                                            </p>
                                            <p className="text-xs text-gray-400">Akses setelah bergabung</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CTA */}
                        <div className="border-t border-gray-100 p-4 dark:border-zinc-700">
                            <a href="#register">
                                <Button className="w-full gap-2 py-6 text-base font-bold shadow-lg shadow-primary/20" size="lg">
                                    <Sparkles className="h-5 w-5" />
                                    Gabung Sekarang
                                </Button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
