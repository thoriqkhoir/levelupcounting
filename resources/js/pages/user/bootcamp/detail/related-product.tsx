import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Percent } from 'lucide-react';
import { motion } from 'motion/react';

interface Category {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
    bio?: string;
    avatar?: string | null;
}

interface Bootcamp {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string | null;
    price: number;
    strikethrough_price: number;
    start_date: string;
    end_date: string;
    category?: Category;
    mentors?: User[];
}

interface RelatedProductProps {
    relatedBootcamps: Bootcamp[];
    myBootcampIds: string[];
}

export default function RelatedProduct({ relatedBootcamps, myBootcampIds }: RelatedProductProps) {
    const calcDiscount = (original: number, price: number) => {
        if (original === 0) return 0;
        return Math.round(((original - price) / original) * 100);
    };

    const getAvatarSrc = (avatar?: string | null) => {
        if (!avatar) return null;
        if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/')) return avatar;
        return `/storage/${avatar}`;
    };

    if (!relatedBootcamps || relatedBootcamps.length === 0) return null;
    const availableBootcamps = relatedBootcamps.filter((b) => !myBootcampIds.includes(b.id));
    if (availableBootcamps.length === 0) return null;

    return (
        <section className="mx-auto mt-16 w-full max-w-7xl px-4 pb-16" id="related">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-10 text-center"
            >
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-primary/20">
                    Bootcamp Serupa
                </span>
                <h2 className="dark:text-primary-foreground mt-3 text-2xl font-extrabold text-gray-900 md:text-3xl">
                    Mungkin Kamu Juga Tertarik
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Eksplorasi bootcamp lain yang relevan dengan topik ini</p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {availableBootcamps.map((bootcamp, idx) => {
                    const discount = calcDiscount(bootcamp.strikethrough_price, bootcamp.price);
                    const mentors = bootcamp.mentors ?? [];
                    const primaryMentor = mentors[0];

                    return (
                        <motion.div
                            key={bootcamp.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                        >
                            <Link href={`/bootcamp/${bootcamp.slug}`} className="group h-full">
                                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-primary group-hover:ring-2 group-hover:ring-primary dark:border-zinc-700 dark:bg-zinc-800">
                                    {/* Image */}
                                    <div className="relative w-full overflow-hidden">
                                        <img
                                            src={bootcamp.thumbnail ? `/storage/${bootcamp.thumbnail}` : '/assets/images/placeholder.png'}
                                            alt={bootcamp.title}
                                            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Type Badge - Top Left */}
                                        <span className="absolute top-2 left-2 z-20 rounded-lg border border-white/40 bg-white/30 px-1 py-1 text-xs font-semibold shadow backdrop-blur-md dark:bg-gray-800/30">
                                            Bootcamp
                                        </span>
                                        {/* Discount Badge - Top Right */}
                                        {discount > 0 && (
                                            <div className="absolute top-2 right-2 z-20 inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                                <Percent size={10} />Hemat {discount}%
                                            </div>
                                        )}
                                        {/* Category - Bottom Left */}
                                        {bootcamp.category && (
                                            <div className="absolute bottom-2 left-2 z-20">
                                                <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">{bootcamp.category.name}</span>
                                            </div>
                                        )}
                                        {/* Date - Bottom Right */}
                                        <div className="absolute right-2 bottom-2 z-20 rounded-lg border border-white/40 bg-white/30 px-2 py-1 shadow backdrop-blur-md dark:bg-gray-800/30">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} />
                                                <p className="text-xs font-semibold text-black dark:text-gray-400">
                                                    {new Date(bootcamp.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    {' - '}
                                                    {new Date(bootcamp.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col gap-3 p-5">
                                        <h2 className="line-clamp-2 text-lg font-bold text-gray-900 dark:text-gray-100">{bootcamp.title}</h2>
                                        <div>
                                            {bootcamp.strikethrough_price > 0 && bootcamp.strikethrough_price > bootcamp.price && (
                                                <p className="text-base text-red-500 line-through">Rp. {bootcamp.strikethrough_price.toLocaleString('id-ID')}</p>
                                            )}
                                            {bootcamp.price === 0 ? (
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Gratis</p>
                                            ) : (
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Rp. {bootcamp.price.toLocaleString('id-ID')}</p>
                                            )}
                                        </div>
                                        {/* Mentor */}
                                        <div className="flex items-center gap-3">
                                            {primaryMentor && getAvatarSrc(primaryMentor.avatar) ? (
                                                <img src={getAvatarSrc(primaryMentor.avatar) ?? undefined} alt={primaryMentor.name} className="h-10 w-10 rounded-full object-cover shadow" />
                                            ) : (
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 shadow">
                                                    {primaryMentor?.name ? primaryMentor.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : '-'}
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {primaryMentor?.name ?? '-'}
                                                {mentors.length > 1 ? ` +${mentors.length - 1} mentor` : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA Bar */}
                                    <div className="mt-auto flex items-center justify-between px-5 py-3 mx-4 mb-4 rounded-xl border border-gray-200 transition-all duration-300 group-hover:mx-0 group-hover:mb-0 group-hover:rounded-none group-hover:rounded-b-[14px] group-hover:border-transparent group-hover:bg-primary group-hover:px-5 group-hover:py-4 dark:border-zinc-600">
                                        <span className="text-base font-semibold text-gray-700 transition-colors duration-300 group-hover:text-white dark:text-gray-300">Daftar Sekarang</span>
                                        <ArrowRight className="h-6 w-6 text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white dark:text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
