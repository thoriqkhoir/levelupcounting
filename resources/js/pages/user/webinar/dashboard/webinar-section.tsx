import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Magnetic } from '@/components/ui/magnetic';
import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, GalleryVerticalEnd, Percent } from 'lucide-react';
import { useRef, useState } from 'react';

type Category = {
    id: string;
    name: string;
};

interface Webinar {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    start_time: string;
    category: Category;
    user: {
        id: string;
        name: string;
        bio?: string;
        avatar?: string | null;
    };
}

interface WebinarProps {
    categories: Category[];
    webinars: Webinar[];
    myWebinarIds: string[];
}

export default function WebinarSection({ categories, webinars, myWebinarIds }: WebinarProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);
    const categoryRef = useRef<HTMLDivElement | null>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.pageX - (categoryRef.current?.offsetLeft ?? 0);
        scrollLeft.current = categoryRef.current?.scrollLeft ?? 0;
    };
    const handleMouseLeave = () => { isDragging.current = false; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !categoryRef.current) return;
        e.preventDefault();
        const x = e.pageX - categoryRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        categoryRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const filteredWebinar = webinars.filter((w) => {
        const matchSearch = w.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === null ? true : w.category.id === selectedCategory;
        return matchSearch && matchCategory;
    });

    const visibleWebinars = filteredWebinar.slice(0, visibleCount);

    const calcDiscount = (original: number, price: number) => {
        if (original <= 0 || original <= price) return 0;
        return Math.round(((original - price) / original) * 100);
    };

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-20" id="webinar">
            <h2 className="dark:text-primary-foreground mx-auto mb-4 max-w-3xl text-center text-3xl font-extrabold text-gray-900 md:text-4xl">
                Tingkatkan kemampuan dan persiapkan diri untuk sukses di era digital.
            </h2>
            <p className="mx-auto mb-8 text-center text-gray-600 dark:text-gray-400">
                Perluas pengetahuan dan jaringan untuk menghadapi dunia kerja dengan lebih percaya diri.
            </p>

            {/* Kategori */}
            <div className="mb-8 overflow-x-auto scrollbar-hide" ref={categoryRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}>
                <div className="flex w-max flex-nowrap gap-3 select-none">
                    <button type="button" onClick={() => setSelectedCategory(null)} className={`rounded-full border-2 px-6 py-2 text-sm font-semibold transition-all duration-200 ${selectedCategory === null ? 'border-primary bg-primary/10 text-primary shadow' : 'border-gray-300 bg-white text-gray-800 hover:border-primary/40 hover:bg-primary/5 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'}`}>
                        Semua Kategori
                    </button>
                    {categories.map((category) => (
                        <button key={category.id} type="button" onClick={() => setSelectedCategory(category.id)} className={`rounded-full border-2 px-6 py-2 text-sm font-semibold transition-all duration-200 ${selectedCategory === category.id ? 'border-primary bg-primary/10 text-primary shadow' : 'border-gray-300 bg-white text-gray-800 hover:border-primary/40 hover:bg-primary/5 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'}`}>
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="mb-8 flex justify-center">
                <Input type="search" placeholder="Cari webinar..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md rounded-full border-2 border-primary/30 px-6 py-2 shadow-sm focus:border-primary" />
            </div>

            {/* Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleWebinars.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                        <img src="/assets/images/not-found.svg" alt="Webinar Belum Tersedia" className="w-48" />
                        <div className="text-center text-gray-500">Belum ada webinar yang tersedia saat ini.</div>
                    </div>
                ) : (
                    visibleWebinars.map((webinar) => {
                        const hasAccess = myWebinarIds.includes(webinar.id);
                        const discount = calcDiscount(webinar.strikethrough_price, webinar.price);

                        return (
                            <Link key={webinar.id} href={hasAccess ? `profile/my-webinars/${webinar.slug}` : `/webinar/${webinar.slug}`} className="group h-full">
                                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-primary group-hover:ring-2 group-hover:ring-primary dark:border-zinc-700 dark:bg-zinc-800">
                                    {/* Image */}
                                    <div className="relative w-full overflow-hidden">
                                        <img
                                            src={webinar.thumbnail ? `/storage/${webinar.thumbnail}` : '/assets/images/placeholder.png'}
                                            alt={webinar.title}
                                            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Type Badge - Top Left */}
                                        <span className="absolute top-2 left-2 z-20 rounded-lg border border-white/40 bg-white/30 px-1 py-1 text-xs font-semibold shadow backdrop-blur-md dark:bg-gray-800/30">
                                            Webinar
                                        </span>
                                        {/* Discount / Access Badge - Top Right */}
                                        {hasAccess ? (
                                            <span className="absolute top-2 right-2 z-20 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow">Sudah Akses</span>
                                        ) : discount > 0 ? (
                                            <div className="absolute top-2 right-2 z-20 inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                                <Percent size={10} />Hemat {discount}%
                                            </div>
                                        ) : null}
                                        {/* Category - Bottom Left */}
                                        <div className="absolute bottom-2 left-2 z-20">
                                            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">{webinar.category.name}</span>
                                        </div>
                                        {/* Date - Bottom Right */}
                                        <div className="absolute right-2 bottom-2 z-20 rounded-lg border border-white/40 bg-white/30 px-2 py-1 shadow backdrop-blur-md dark:bg-gray-800/30">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} />
                                                <p className="text-xs font-semibold text-black dark:text-gray-400">
                                                    {new Date(webinar.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col gap-3 p-5">
                                        <h2 className="line-clamp-2 text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{webinar.title}</h2>
                                        <div>
                                            {webinar.strikethrough_price > 0 && webinar.strikethrough_price > webinar.price && (
                                                <p className="text-base text-red-500 line-through">Rp. {webinar.strikethrough_price.toLocaleString('id-ID')}</p>
                                            )}
                                            {hasAccess ? (
                                                <p className="text-2xl font-bold text-primary">Sudah Terdaftar</p>
                                            ) : webinar.price === 0 ? (
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Gratis</p>
                                            ) : (
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Rp. {webinar.price.toLocaleString('id-ID')}</p>
                                            )}
                                        </div>
                                        {/* Presenter */}
                                        <div className="flex items-center gap-3">
                                            {webinar.user?.avatar ? (
                                                <img src={`/storage/${webinar.user.avatar}`} alt={webinar.user.name} className="h-10 w-10 rounded-full object-cover shadow" />
                                            ) : (
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 shadow">
                                                    {webinar.user?.name ? webinar.user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : '-'}
                                                </div>
                                            )}
                                            <span className="text-base font-medium text-gray-700 dark:text-gray-300">{webinar.user?.name ?? '-'}</span>
                                        </div>
                                    </div>

                                    {/* CTA Bar */}
                                    <div className="mt-auto flex items-center justify-between px-5 py-3 mx-4 mb-4 rounded-xl border border-gray-200 transition-all duration-300 group-hover:mx-0 group-hover:mb-0 group-hover:rounded-none group-hover:rounded-b-[14px] group-hover:border-transparent group-hover:bg-primary group-hover:px-5 group-hover:py-4 dark:border-zinc-600">
                                        <span className="text-base font-semibold text-gray-700 transition-colors duration-300 group-hover:text-white dark:text-gray-300">{hasAccess ? 'Lihat Materi' : 'Daftar Sekarang'}</span>
                                        <ArrowRight className="h-6 w-6 text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white dark:text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Load More */}
            {visibleCount < filteredWebinar.length && (
                <div className="mb-8 flex justify-center">
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
