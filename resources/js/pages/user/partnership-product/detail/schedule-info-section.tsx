import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, Clock, CalendarDays, Sparkles } from 'lucide-react';

interface PartnershipProduct {
    schedule_days: string[];
    duration_days: number;
}

export default function ScheduleInfoSection({ partnershipProduct }: { partnershipProduct: PartnershipProduct }) {
    if (!partnershipProduct.schedule_days || partnershipProduct.schedule_days.length === 0) {
        return null;
    }

    const dayColors = [
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-pink-500 to-pink-600',
        'from-red-500 to-red-600',
        'from-orange-500 to-orange-600',
        'from-yellow-500 to-yellow-600',
        'from-green-500 to-green-600',
    ];

    const dayMap: { [key: string]: number } = {
        Senin: 0,
        Selasa: 1,
        Rabu: 2,
        Kamis: 3,
        Jumat: 4,
        Sabtu: 5,
        Minggu: 6,
    };

    return (
        <section className="relative mx-auto w-full max-w-7xl px-4 py-12">
            {/* Decorative Background */}
            <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="pointer-events-none absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/5 px-4 py-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">Jadwal & Durasi</span>
                    </div>
                    <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">Informasi Pelaksanaan</h2>
                    <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
                        Rencanakan waktu belajar Anda dengan jadwal yang telah disesuaikan
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Schedule Days Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="group relative overflow-hidden rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-blue-100/50 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl dark:border-blue-800 dark:from-blue-950/30 dark:via-gray-900 dark:to-blue-900/20"
                    >
                        {/* Icon Header */}
                        <div className="mb-6 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 animate-pulse rounded-full bg-blue-400/30 blur-xl" />
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                    <Calendar className="h-10 w-10 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="mb-6 text-center">
                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Jadwal Pelaksanaan</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Hari belajar yang telah ditentukan</p>
                        </div>

                        {/* Days Grid */}
                        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {partnershipProduct.schedule_days.map((day: string, index: number) => {
                                const dayIndex = dayMap[day] ?? 0;
                                const gradient = dayColors[dayIndex];

                                return (
                                    <motion.div
                                        key={day}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                        className="group/day"
                                    >
                                        <div
                                            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                                        >
                                            <div className="relative z-10 text-center">
                                                <p className="text-lg font-bold text-white">{day}</p>
                                            </div>
                                            {/* Shine Effect */}
                                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/day:translate-x-full" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Info Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="text-center"
                        >
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                <Sparkles className="mr-1 h-3 w-3" />
                                {partnershipProduct.schedule_days.length} Hari per Minggu
                            </Badge>
                        </motion.div>

                        {/* Decorative Corner */}
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl transition-all duration-500 group-hover:bg-blue-400/20" />
                        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />
                    </motion.div>

                    {/* Duration Card */}
                    {partnershipProduct.duration_days > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="group relative overflow-hidden rounded-3xl border-2 border-green-200 bg-gradient-to-br from-green-50/80 via-white to-green-100/50 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl dark:border-green-800 dark:from-green-950/30 dark:via-gray-900 dark:to-green-900/20"
                        >
                            {/* Icon Header */}
                            <div className="mb-6 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 animate-pulse rounded-full bg-green-400/30 blur-xl" />
                                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                                        <Clock className="h-10 w-10 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="mb-6 text-center">
                                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Durasi Program</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total waktu pembelajaran</p>
                            </div>

                            {/* Duration Display */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mb-6 text-center"
                            >
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 animate-pulse rounded-full bg-green-400/20 blur-2xl" />
                                    <div className="relative flex items-baseline justify-center gap-3">
                                        <span className="bg-gradient-to-br from-green-600 to-green-700 bg-clip-text text-7xl font-extrabold text-transparent md:text-8xl">
                                            {partnershipProduct.duration_days}
                                        </span>
                                        <span className="text-3xl font-bold text-gray-600 dark:text-gray-400">Hari</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Progress Bar Representation */}
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="mb-6"
                            >
                                <div className="relative h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-lg">
                                        <div className="absolute inset-0 animate-pulse bg-white/20" />
                                    </div>
                                </div>
                                <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                    <span>Hari 1</span>
                                    <span>Hari {partnershipProduct.duration_days}</span>
                                </div>
                            </motion.div>

                            {/* Features */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.7 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                                        <Sparkles className="h-3 w-3 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Program Intensif & Terstruktur</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                                        <Sparkles className="h-3 w-3 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pembelajaran Berkelanjutan</span>
                                </div>
                            </motion.div>

                            {/* Decorative Corner */}
                            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-400/10 blur-2xl transition-all duration-500 group-hover:bg-green-400/20" />
                            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-green-500/10 blur-2xl transition-all duration-500 group-hover:bg-green-500/20" />
                        </motion.div>
                    )}
                </div>

                {/* Bottom Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-6 text-center shadow-lg dark:from-primary/10 dark:to-secondary/10"
                >
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        📚 Program dirancang dengan jadwal yang fleksibel namun tetap terstruktur untuk hasil pembelajaran yang maksimal
                    </p>
                </motion.div>
            </div>
        </section>
    );
}