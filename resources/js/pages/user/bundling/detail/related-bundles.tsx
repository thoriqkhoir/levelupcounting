import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { rupiahFormatter } from '@/lib/utils';
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

interface Bundle {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string | null;
    price: number;
    strikethrough_price: number;
    registration_deadline?: string | null;
    batch?: string | null;
    bundle_items_count: number;
    category?: Category;
    user?: User;
}

interface RelatedBundlesProps {
    relatedBundles: Bundle[];
}

export default function RelatedBundles({ relatedBundles }: RelatedBundlesProps) {
    if (!relatedBundles || relatedBundles.length === 0) {
        return null;
    }

    const calculateDiscount = (original: number, discounted: number) => {
        if (original === 0) return 0;
        return Math.round(((original - discounted) / original) * 100);
    };

    return (
        <section className="mx-auto mt-16 w-full max-w-7xl px-4 pb-12" id="related">
            <h2 className="dark:text-primary-foreground mb-4 text-center text-2xl md:text-3xl font-semibold text-gray-900">
                Paket Bundling Lainnya
            </h2>
            <p className="mb-8 text-center text-gray-600 dark:text-gray-400">Paket bundling lain yang mungkin menarik untuk Anda</p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedBundles.map((bundle) => {
                    const discount = calculateDiscount(bundle.strikethrough_price, bundle.price);
                    const hasDeadline = bundle.registration_deadline;

                    let daysLeft = 0;
                    if (hasDeadline) {
                        const deadline = new Date(bundle.registration_deadline!);
                        const now = new Date();
                        daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    }

                    return (
                        <Link key={bundle.id} href={route('bundle.detail', bundle.slug)} className="h-full group">
                            <div className="relative h-full overflow-hidden rounded-2xl border dark:bg-zinc-700/30 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-primary/40">
                                <div className="bg-white relative flex h-full flex-col rounded-lg dark:bg-zinc-800">
                                    <div className="w-full flex-shrink-0 overflow-hidden rounded-t-lg">
                                        <div className="relative">
                                            <img
                                                src={bundle.thumbnail ? `/storage/${bundle.thumbnail}` : '/assets/images/placeholder.png'}
                                                alt={bundle.title}
                                                className="h-48 w-full rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                            />

                                            {/* Bundle Badge - Top Left */}
                                            <span className="absolute top-2 left-2 text-xs font-semibold rounded-lg bg-white/30 backdrop-blur-md border border-white/40 px-1 py-1 shadow z-20 dark:bg-gray-800/30">
                                                Bundle
                                            </span>

                                            {/* Items Count Badge - Bottom Left */}
                                            <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2">
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-white/30 backdrop-blur-md border border-white/40 text-black font-semibold shadow dark:bg-gray-800/30 dark:text-white"
                                                >
                                                    <Package size={12} className="mr-1" />
                                                    {bundle.bundle_items_count} Program
                                                </Badge>
                                                {bundle.batch && (
                                                    <Badge className="border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                                        {bundle.batch.toLowerCase().includes('batch') ? bundle.batch : `Batch ${bundle.batch}`}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Deadline Display - Bottom Right */}
                                            {hasDeadline && (
                                                <div className="absolute bottom-2 right-2 rounded-lg bg-white/30 backdrop-blur-md border border-white/40 px-2 py-1 shadow z-20 dark:bg-gray-800/30">
                                                    <div className="flex items-center gap-2">
                                                        <Clock
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
                                            )}

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
                                        <div className="mx-4 mt-2">
                                            {bundle.batch && (
                                                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                                                    {bundle.batch.toLowerCase().includes('batch') ? bundle.batch : `Batch ${bundle.batch}`}
                                                </span>
                                            )}
                                            <h2 className="line-clamp-2 text-left text-lg font-semibold">{bundle.title}</h2>
                                        </div>
                                    </div>

                                    <div className="mt-auto w-full p-2 text-left">
                                        {bundle.strikethrough_price > 0 && bundle.strikethrough_price > bundle.price && (
                                            <p className="text-xs px-2 text-red-600 line-through dark:text-gray-400 mb-0.5">
                                                {rupiahFormatter.format(bundle.strikethrough_price)}
                                            </p>
                                        )}
                                        <div className="flex items-center px-2 justify-between gap-2 mb-2">
                                            {bundle.price === 0 ? (
                                                <p className="text-lg font-semibold text-green-600 dark:text-green-400">Gratis</p>
                                            ) : (
                                                <p className="text-base font-bold text-primary dark:text-gray-200">
                                                    {rupiahFormatter.format(bundle.price)}
                                                </p>
                                            )}
                                            {bundle.category && (
                                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                    {bundle.category.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="px-4 my-2 h-0.5 w-full rounded-full bg-primary/50" />

                                        {/* Mentor Info Section */}
                                        <div className="mx-4 mt-4 flex items-center gap-3">
                                            {bundle.user?.avatar ? (
                                                <img
                                                    src={`/storage/${bundle.user.avatar}`}
                                                    alt={bundle.user.name}
                                                    className="h-10 w-10 rounded-full object-cover shadow-lg"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold flex-shrink-0">
                                                    {bundle.user?.name
                                                        ? bundle.user.name
                                                              .split(' ')
                                                              .map((n) => n[0])
                                                              .join('')
                                                              .substring(0, 2)
                                                              .toUpperCase()
                                                        : '-'}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                                    {bundle.user?.name ?? '-'}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {bundle.user?.bio ?? 'Tidak ada bio'}
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