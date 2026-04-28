import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, Clock, Package, Percent } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface User {
    name: string;
    bio?: string;
    avatar?: string | null;
}

interface PartnershipProduct {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string | null;
    price: number;
    strikethrough_price: number;
    registration_deadline: string;
    duration_days: number;
    schedule_days: string[];
    category?: Category;
    user?: User;
}

interface RelatedProductProps {
    relatedPartnershipProducts: PartnershipProduct[];
}

export default function RelatedProduct({ relatedPartnershipProducts }: RelatedProductProps) {
    if (!relatedPartnershipProducts || relatedPartnershipProducts.length === 0) {
        return null;
    }

    const calculateDiscount = (original: number, discounted: number) => {
        if (original === 0) return 0;
        return Math.round(((original - discounted) / original) * 100);
    };

    return (
        <section className="mx-auto mt-16 w-full max-w-7xl px-4 pb-12" id="related">
            <h2 className="dark:text-primary-foreground mb-4 text-center text-2xl md:text-3xl font-semibold text-gray-900">
                Program Sertifikasi Lainnya
            </h2>
            <p className="mb-8 text-center text-gray-600 dark:text-gray-400">Program sertifikasi lain yang mungkin menarik untuk Anda</p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedPartnershipProducts.map((product) => {
                    const discount = calculateDiscount(product.strikethrough_price, product.price);
                    const deadline = new Date(product.registration_deadline);
                    const now = new Date();
                    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                        <Link key={product.id} href={`/partnership-product/${product.slug}`} className="h-full group">
                            <div className="relative h-full overflow-hidden rounded-2xl border dark:bg-zinc-700/30 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-primary/40">
                                <div className="bg-white relative flex h-full flex-col rounded-lg dark:bg-zinc-800">
                                    <div className="w-full flex-shrink-0 overflow-hidden rounded-t-lg">
                                        <div className="relative">
                                            <img
                                                src={product.thumbnail ? `/storage/${product.thumbnail}` : '/assets/images/placeholder.png'}
                                                alt={product.title}
                                                className="h-48 w-full rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                            />

                                            {/* Partnership Badge - Top Left */}
                                            <span className="absolute top-2 left-2 text-xs font-semibold rounded-lg bg-white/30 backdrop-blur-md border border-white/40 px-1 py-1 shadow z-20 dark:bg-gray-800/30">
                                                Partnership
                                            </span>

                                            {/* Duration Badge - Bottom Left */}
                                            {product.duration_days > 0 && (
                                                <div className="absolute bottom-2 left-2 z-20">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-white/30 backdrop-blur-md border border-white/40 text-black font-semibold shadow dark:bg-gray-800/30 dark:text-white"
                                                    >
                                                        <Clock size={12} className="mr-1" />
                                                        {product.duration_days} Hari
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Deadline Display - Bottom Right */}
                                            <div className="absolute bottom-2 right-2 rounded-lg bg-white/30 backdrop-blur-md border border-white/40 px-2 py-1 shadow z-20 dark:bg-gray-800/30">
                                                <div className="flex items-center gap-2">
                                                    <Calendar
                                                        size={12}
                                                        className={daysLeft <= 3 ? 'text-red-500' : 'text-black dark:text-gray-400'}
                                                    />
                                                    <p
                                                        className={`text-xs font-semibold ${daysLeft <= 3 ? 'text-red-500' : 'text-black dark:text-gray-400'}`}
                                                    >
                                                        {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Ditutup'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Discount Badge - Top Right */}
                                            {discount > 0 && (
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-red-500 text-white shadow-lg">
                                                        <Percent size={12} className="mr-1" />
                                                        Hemat {discount}%
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="mx-4 mt-2 line-clamp-2 text-left text-lg font-semibold">{product.title}</h2>
                                    </div>

                                    <div className="mt-auto w-full p-2 text-left">
                                        {product.strikethrough_price > 0 && product.strikethrough_price > product.price && (
                                            <p className="text-xs px-2 text-red-600 line-through dark:text-gray-400 mb-0.5">
                                                Rp {product.strikethrough_price.toLocaleString('id-ID')}
                                            </p>
                                        )}
                                        <div className="flex items-center px-2 justify-between gap-2 mb-2">
                                            {product.price === 0 ? (
                                                <p className="text-lg font-semibold text-green-600 dark:text-green-400">Gratis</p>
                                            ) : (
                                                <p className="text-base font-bold text-primary dark:text-gray-200">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </p>
                                            )}
                                            {product.category && (
                                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                    {product.category.name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Schedule Days Display */}
                                        {product.schedule_days && product.schedule_days.length > 0 && (
                                            <div className="px-2 mb-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {product.schedule_days.slice(0, 3).map((day: string) => (
                                                        <span
                                                            key={day}
                                                            className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                                        >
                                                            {day}
                                                        </span>
                                                    ))}
                                                    {product.schedule_days.length > 3 && (
                                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                            +{product.schedule_days.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="px-4 my-2 h-0.5 w-full rounded-full bg-primary/50" />

                                        {/* Mentor Info Section */}
                                        <div className="mx-4 mt-4 flex items-center gap-3">
                                            {product.user?.avatar ? (
                                                <img
                                                    src={`/storage/${product.user.avatar}`}
                                                    alt={product.user.name}
                                                    className="h-10 w-10 rounded-full object-cover shadow-lg"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold">
                                                    {product.user?.name
                                                        ? product.user.name
                                                              .split(' ')
                                                              .map((n) => n[0])
                                                              .join('')
                                                              .toUpperCase()
                                                        : '-'}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                                    {product.user?.name ?? '-'}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {product.user?.bio ?? 'Tidak ada bio'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}