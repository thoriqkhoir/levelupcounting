import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface PartnershipProduct {
    title: string;
    category?: { name: string };
    thumbnail?: string | null;
    short_description?: string | null;
    description?: string | null;
    registration_deadline: string;
}

export default function HeroSection({ partnershipProduct }: { partnershipProduct: PartnershipProduct }) {
    const deadlineDate = new Date(partnershipProduct.registration_deadline);

    return (
        <section className="dark:via-background dark:to-background relative bg-gradient-to-b py-20 text-gray-900 dark:text-white">
            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-3">
                {/* Left Column - Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="col-span-2"
                >
                    {/* Category Badge */}
                    {partnershipProduct.category && (
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-secondary border-secondary bg-background mb-4 inline-block rounded-full border bg-gradient-to-t from-[#FED6AD] to-white px-3 py-1 text-sm font-medium shadow-xs hover:text-[#FF925B]"
                        >
                            {partnershipProduct.category.name}
                        </motion.span>
                    )}

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mb-4 text-4xl leading-tight font-bold sm:text-5xl"
                    >
                        {partnershipProduct.title}
                    </motion.h1>

                    {/* Short Description */}
                    {partnershipProduct.short_description && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-4 text-lg text-gray-600 dark:text-gray-400"
                        >
                            {partnershipProduct.short_description}
                        </motion.p>
                    )}

                    {/* Deadline Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                    >
                        ⏰ Daftar sebelum: {format(deadlineDate, 'dd MMMM yyyy, HH:mm', { locale: id })} WIB
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <a href="#register">
                            <Button>Daftar Sekarang</Button>
                        </a>
                        <a href="https://wa.me/+6281252683108" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline">Hubungi Kami</Button>
                        </a>
                        <a href="https://ppppmi.id" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline">Terafiliasi dengan P4MI</Button>
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
                        src={partnershipProduct.thumbnail ? `/storage/${partnershipProduct.thumbnail}` : '/assets/images/placeholder.png'}
                        alt={partnershipProduct.title}
                        className="rounded-xl shadow-lg"
                    />
                </motion.div>
            </div>
        </section>
    );
}