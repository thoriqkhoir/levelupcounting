import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Magnetic } from '@/components/ui/magnetic';
import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, GalleryVerticalEnd, Package, Percent } from 'lucide-react';
import { useState } from 'react';

interface BundleItem {
    id: string;
    bundleable_type: string;
    bundleable: { id: string; title: string; slug: string };
    price: number;
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
    short_description: string | null;
    thumbnail: string | null;
    price: number;
    strikethrough_price: number;
    registration_deadline: string | null;
    status: 'draft' | 'published' | 'archived';
    bundle_items: BundleItem[];
    bundle_items_count: number;
    user?: User;
}

interface BundlingSectionProps {
    bundles: Bundle[];
}

export default function BundlingSection({ bundles }: BundlingSectionProps) {
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);

    const filteredBundles = bundles.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) && b.status === 'published');
    const visibleBundles = filteredBundles.slice(0, visibleCount);

    const calcDiscount = (original: number, price: number) => {
        if (original === 0) return 0;
        return Math.round(((original - price) / original) * 100);
    };

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-12" id="bundles">
            <div className="mb-8 text-center">
                <h2 className="dark:text-primary-foreground mx-auto mb-4 max-w-3xl text-2xl md:text-3xl font-semibold text-gray-900">
                    Pilih Paket Bundling Terbaik Untukmu
                </h2>
                <p className="mx-auto text-gray-600 dark:text-gray-400">Hemat lebih banyak dengan membeli paket bundling program pembelajaran.</p>
            </div>

            <div className="mb-6 flex justify-center">
                <Input type="search" placeholder="Cari paket bundling..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md rounded-full border-2 border-primary/30 px-6 py-2 shadow-sm focus:border-primary" />
            </div>

            {/* Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleBundles.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                        <img src="/assets/images/not-found.svg" alt="Paket Bundling Belum Tersedia" className="w-48" />
                        <div className="text-center text-gray-500">
                            {search ? 'Tidak ada paket bundling yang sesuai dengan pencarian.' : 'Belum ada paket bundling yang tersedia saat ini.'}
                        </div>
                    </div>
                ) : (
                    visibleBundles.map((bundle) => {
                        const discount = calcDiscount(bundle.strikethrough_price, bundle.price);
                        const hasDeadline = !!bundle.registration_deadline;
                        let daysLeft = 0;
                        if (hasDeadline) {
                            const deadline = new Date(bundle.registration_deadline!);
                            daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                        }

                        return (
                            <Link key={bundle.id} href={route('bundle.detail', bundle.slug)} className="group h-full">
                                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-primary group-hover:ring-2 group-hover:ring-primary dark:border-zinc-700 dark:bg-zinc-800">
                                    {/* Image */}
                                    <div className="relative w-full overflow-hidden">
                                        <img
                                            src={bundle.thumbnail ? `/storage/${bundle.thumbnail}` : '/assets/images/placeholder.png'}
                                            alt={bundle.title}
                                            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Type Badge - Top Left */}
                                        <span className="absolute top-2 left-2 z-20 rounded-lg border border-white/40 bg-white/30 px-1 py-1 text-xs font-semibold shadow backdrop-blur-md dark:bg-gray-800/30">
                                            Bundle
                                        </span>
                                        {/* Discount Badge - Top Right */}
                                        {discount > 0 && (
                                            <div className="absolute top-2 right-2 z-20">
                                                <Badge className="bg-red-500 text-white shadow-lg">
                                                    <Percent size={12} className="mr-1" />Hemat {discount}%
                                                </Badge>
                                            </div>
                                        )}
                                        {/* Items Count - Bottom Left */}
                                        <div className="absolute bottom-2 left-2 z-20">
                                            <Badge variant="secondary" className="bg-white/30 backdrop-blur-md border border-white/40 text-black font-semibold shadow dark:bg-gray-800/30 dark:text-white">
                                                <Package size={12} className="mr-1" />{bundle.bundle_items_count} Program
                                            </Badge>
                                        </div>
                                        {/* Deadline - Bottom Right */}
                                        {hasDeadline && (
                                            <div className="absolute bottom-2 right-2 z-20 rounded-lg border border-white/40 bg-white/30 px-2 py-1 shadow backdrop-blur-md dark:bg-gray-800/30">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className={daysLeft <= 3 ? 'text-red-500' : 'text-black dark:text-gray-400'} />
                                                    <p className={`text-xs font-semibold ${daysLeft <= 3 ? 'text-red-500' : 'text-black dark:text-gray-400'}`}>
                                                        {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Ditutup'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col gap-3 p-5">
                                        <h2 className="line-clamp-2 text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{bundle.title}</h2>
                                        <div>
                                            {bundle.strikethrough_price > 0 && bundle.strikethrough_price > bundle.price && (
                                                <p className="text-base text-red-500 line-through">Rp. {bundle.strikethrough_price.toLocaleString('id-ID')}</p>
                                            )}
                                            {bundle.price === 0 ? (
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Gratis</p>
                                            ) : (
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Rp. {bundle.price.toLocaleString('id-ID')}</p>
                                            )}
                                        </div>
                                        {/* Presenter */}
                                        {bundle.user && (
                                            <div className="flex items-center gap-3">
                                                {bundle.user.avatar ? (
                                                    <img src={`/storage/${bundle.user.avatar}`} alt={bundle.user.name} className="h-10 w-10 rounded-full object-cover shadow" />
                                                ) : (
                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 shadow">
                                                        {bundle.user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="text-base font-medium text-gray-700 dark:text-gray-300">{bundle.user.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Bar */}
                                    <div className="mt-auto flex items-center justify-between px-5 py-3 mx-4 mb-4 rounded-xl border border-gray-200 transition-all duration-300 group-hover:mx-0 group-hover:mb-0 group-hover:rounded-none group-hover:rounded-b-[14px] group-hover:border-transparent group-hover:bg-primary group-hover:px-5 group-hover:py-4 dark:border-zinc-600">
                                        <span className="text-base font-semibold text-gray-700 transition-colors duration-300 group-hover:text-white dark:text-gray-300">Lihat Paket</span>
                                        <ArrowRight className="h-6 w-6 text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white dark:text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Load More */}
            {visibleCount < filteredBundles.length && (
                <div className="flex justify-center mt-8">
                    <Magnetic>
                        <Button type="button" size="lg" className="rounded-full px-8 py-3 text-base font-bold shadow-lg" onClick={() => setVisibleCount((prev) => prev + 6)}>
                            Lihat Lebih Banyak <GalleryVerticalEnd className="ml-2" />
                        </Button>
                    </Magnetic>
                </div>
            )}
        </section>
    );
}
