import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Magnetic } from '@/components/ui/magnetic';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, Clock, GalleryVerticalEnd } from 'lucide-react';
import { useRef, useState } from 'react';

type Category = {
    id: string;
    name: string;
};

interface PartnershipProduct {
    id: string;
    title: string;
    short_description: string | null;
    thumbnail: string | null;
    slug: string;
    strikethrough_price: number;
    price: number;
    registration_deadline: string;
    duration_days: number;
    schedule_days: string[];
    category: Category;
}

interface PartnershipProductProps {
    categories: Category[];
    partnershipProducts: PartnershipProduct[];
}

export default function PartnershipProductSection({ categories, partnershipProducts }: PartnershipProductProps) {
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

    const handleMouseLeave = () => {
        isDragging.current = false;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !categoryRef.current) return;
        e.preventDefault();
        const x = e.pageX - categoryRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        categoryRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const filteredProducts = partnershipProducts.filter((product) => {
        const matchSearch = product.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === null ? true : product.category.id === selectedCategory;
        return matchSearch && matchCategory;
    });

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-20" id="partnership-products">
            <h2 className="dark:text-primary-foreground mx-auto mb-4 max-w-3xl text-center text-3xl font-extrabold text-gray-900 md:text-4xl">
                Raih Sertifikasi Profesional dan Tingkatkan Karirmu
            </h2>
            <p className="mx-auto mb-8 text-center text-gray-600 dark:text-gray-400">
                Pilih program sertifikasi yang sesuai dengan tujuan karirmu.
            </p>

            {/* Kategori */}
            <div
                className="mb-8 overflow-x-auto scrollbar-hide"
                ref={categoryRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
            >
                <div className="flex w-max flex-nowrap gap-3 select-none">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className={`rounded-full border-2 px-6 py-2 text-sm font-semibold transition-all duration-200
                        ${selectedCategory === null
                            ? 'border-primary bg-primary/10 text-primary shadow'
                            : 'border-gray-300 bg-white text-gray-800 hover:border-primary/40 hover:bg-primary/5 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'}
                        `}
                    >
                        Semua Kategori
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => setSelectedCategory(category.id)}
                            className={`rounded-full border-2 px-6 py-2 text-sm font-semibold transition-all duration-200
                                ${selectedCategory === category.id
                                ? 'border-primary bg-primary/10 text-primary shadow'
                                : 'border-gray-300 bg-white text-gray-800 hover:border-primary/40 hover:bg-primary/5 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'}
                            `}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="mb-8 flex justify-center">
                <Input
                    type="search"
                    placeholder="Cari program sertifikasi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md rounded-full border-2 border-primary/30 px-6 py-2 shadow-sm focus:border-primary"
                />
            </div>

            {/* Card Products */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {visibleProducts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                        <img src="/assets/images/not-found.webp" alt="Program Belum Tersedia" className="w-48" />
                        <div className="text-center text-gray-500">Belum ada program sertifikasi yang tersedia saat ini.</div>
                    </div>
                ) : (
                    visibleProducts.map((product) => {
                        const deadlineDate = new Date(product.registration_deadline);
                        const now = new Date();
                        const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                        return (
                            <Link
                                key={product.id}
                                href={route('partnership-product.detail', product.slug)}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40 dark:bg-zinc-800/80"
                            >
                                {/* Badge Gratis/Deadline */}
                                {product.price === 0 && (
                                    <span className="absolute top-3 right-3 z-10 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow">
                                        Gratis
                                    </span>
                                )}
                                {product.price > 0 && daysLeft <= 7 && daysLeft > 0 && (
                                    <span className="absolute top-3 right-3 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
                                        {daysLeft} Hari Lagi
                                    </span>
                                )}

                                {/* Thumbnail */}
                                <div className="relative w-full overflow-hidden rounded-t-2xl">
                                    <img
                                        src={product.thumbnail ? `/storage/${product.thumbnail}` : '/assets/images/placeholder.png'}
                                        alt={product.title}
                                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Deadline Badge on Image */}
                                    <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs rounded-lg bg-white/30 backdrop-blur-md px-2 py-1 text-black shadow font-semibold">
                                        <Calendar size={12} />
                                        <span>{format(deadlineDate, 'dd MMM yyyy', { locale: id })}</span>
                                    </div>
                                </div>

                                {/* Konten */}
                                <div className="flex flex-1 flex-col justify-between px-4">
                                    <h2 className="mb-2 mt-2 line-clamp-2 text-left text-lg font-semibold text-gray-900 dark:text-white">
                                        {product.title}
                                    </h2>
                                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                        {product.short_description || 'Program sertifikasi profesional'}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        {product.price > 0 ? (
                                            <div className="flex flex-col items-start">
                                                {product.strikethrough_price > 0 && (
                                                    <span className="text-xs text-red-500 line-through">
                                                        Rp {product.strikethrough_price.toLocaleString('id-ID')}
                                                    </span>
                                                )}
                                                <span className="text-base font-bold text-primary">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-base font-bold text-green-600">Gratis</span>
                                        )}
                                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                            <Clock size={14} />
                                            <span>{product.duration_days} Hari</span>
                                        </div>
                                    </div>
                                    <div className="px-4 mt-2 h-0.5 w-full rounded-full bg-primary/50" />
                                </div>

                                <div className="mx-4 my-4">
                                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                        {product.category.name}
                                    </span>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Tombol Lihat Lebih Banyak */}
            {visibleCount < filteredProducts.length && (
                <div className="mb-8 flex justify-center">
                    <Magnetic>
                        <Button
                            type="button"
                            size="lg"
                            className="rounded-full px-8 py-3 text-base font-bold shadow-lg"
                            onClick={() => setVisibleCount((prev) => prev + 6)}
                        >
                            Lihat Lebih Banyak <GalleryVerticalEnd className="ml-2" />
                        </Button>
                    </Magnetic>
                </div>
            )}
        </section>
    );
}