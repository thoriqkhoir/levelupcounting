import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Package, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Bundle {
    title: string;
    thumbnail?: string | null;
    short_description?: string | null;
    registration_deadline?: string | null;
    bundle_items_count: number;
}

interface HeroSectionProps {
    bundle: Bundle;
    discountPercentage: number;
}

export default function HeroSection({ bundle, discountPercentage }: HeroSectionProps) {
    const deadlineDate = bundle.registration_deadline ? new Date(bundle.registration_deadline) : null;

    return (
        <section className="relative mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60 sm:p-12">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
                <div className="relative z-10">
                    <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
                        {/* Left Column - Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="col-span-2"
                >
                    {/* Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-4 flex flex-wrap items-center gap-3"
                    >
                        <span className="text-primary border-primary bg-background mb-4 inline-flex w-fit items-center gap-2 rounded-full border bg-gradient-to-t from-[#D9E5FF] to-white px-4 py-1 text-sm font-medium shadow-xs">
                            <Sparkles size={14} className="mr-1" />
                            Paket Bundling
                        </span>
                        {discountPercentage > 0 && (
                            <span className="text-secondary border-secondary bg-background mb-4 inline-flex w-fit items-center rounded-full border bg-gradient-to-t from-[#FED6AD] to-white px-3 py-1 text-sm font-medium shadow-xs hover:text-[#FF925B]">
                                Hemat {discountPercentage}%
                            </span>
                        )}
                        <span className="text-primary border-primary bg-background mb-4 inline-flex w-fit items-center gap-2 rounded-full border bg-gradient-to-t from-[#D9E5FF] to-white px-4 py-1 text-sm font-medium shadow-xs">
                            <Package size={14} className="mr-1" />
                            {bundle.bundle_items_count} Program
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mb-4 text-4xl leading-tight font-bold sm:text-5xl"
                    >
                        {bundle.title}
                    </motion.h1>

                    {/* Description */}
                    {bundle.short_description && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-4 text-lg text-gray-600 dark:text-gray-400"
                        >
                            {bundle.short_description}
                        </motion.p>
                    )}

                    {/* Deadline Badge */}
                    {deadlineDate && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                        >
                            ⏰ Daftar sebelum: {format(deadlineDate, 'dd MMMM yyyy, HH:mm', { locale: id })} WIB
                        </motion.div>
                    )}

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <a href="#register">
                            <Button size="lg">
                                <Package className="mr-2 h-4 w-4" />
                                Daftar Sekarang
                            </Button>
                        </a>
                        <a href="https://wa.me/+6287775764475" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" variant="outline">
                                Hubungi Kami
                            </Button>
                        </a>
                    </motion.div>
                </motion.div>

                {/* Right Column - Image */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="col-span-1 hidden lg:block"
                >
                    <img
                        src={bundle.thumbnail ? `/storage/${bundle.thumbnail}` : '/assets/images/placeholder.png'}
                        alt={bundle.title}
                        className="rounded-xl shadow-lg"
                    />
                </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}