import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Magnetic } from '@/components/ui/magnetic';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Award, Calendar, Clock, GalleryVerticalEnd, Search } from 'lucide-react';
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
        <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-10" id="partnership-products">
            <div className="mb-12 flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-semibold text-secondary shadow-sm ring-1 ring-secondary/20">
                        <Award className="h-4 w-4" />
                        Pilihan Program Sertifikasi
                    </span>
                </div>
                <h2 className="font-av-estiana mb-4 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                    Raih Sertifikasi Profesional dan{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 text-primary">Tingkatkan Karirmu</span>
                        <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-primary/20" />
                    </span>
                </h2>
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                    Pilih program sertifikasi yang sesuai dengan tujuan karirmu. Belajar langsung dari ahlinya dan dapatkan sertifikat yang diakui industri.
                </p>
            </div>

            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Kategori */}
                <div
                    className="flex-1 overflow-x-auto hide-scrollbar"
                    ref={categoryRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
                >
                    <div className="flex w-max flex-nowrap gap-3 select-none pb-2">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory(null)}
                            className={`rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-all duration-300
                            ${selectedCategory === null
                                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5'}
                            `}
                        >
                            Semua Kategori
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setSelectedCategory(category.id)}
                                className={`rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-all duration-300
                                    ${selectedCategory === category.id
                                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                    : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5'}
                                `}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72 lg:w-96 shrink-0">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                        <Search className="h-5 w-5" />
                    </div>
                    <Input
                        type="search"
                        placeholder="Cari sertifikasi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-12 w-full rounded-full border-2 border-border bg-background pl-11 pr-4 shadow-sm transition-colors focus-visible:border-primary focus-visible:ring-0"
                    />
                </div>
            </div>

            {/* Card Products */}
            <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.length === 0 ? (
                    <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
                        <div className="mb-4 rounded-full bg-muted p-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Program Tidak Ditemukan</h3>
                        <p className="text-muted-foreground">Belum ada program sertifikasi yang sesuai dengan pencarian Anda.</p>
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
                                className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 dark:border-white/10 dark:bg-white/5"
                            >
                                {/* Badge Gratis/Deadline */}
                                {product.price === 0 ? (
                                    <span className="absolute left-3 top-3 z-10 rounded-full bg-green-500/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-sm">
                                        Gratis
                                    </span>
                                ) : daysLeft <= 7 && daysLeft > 0 ? (
                                    <span className="absolute left-3 top-3 z-10 rounded-full bg-destructive/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {daysLeft} Hari Lagi
                                    </span>
                                ) : null}

                                {/* Thumbnail */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                    <img
                                        src={product.thumbnail ? `/storage/${product.thumbnail}` : '/assets/images/placeholder.png'}
                                        alt={product.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                                    
                                    {/* Kategori Badge on Image */}
                                    <div className="absolute bottom-3 left-3">
                                        <span className="rounded-md bg-primary/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                                            {product.category.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Konten */}
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                                        {product.title}
                                    </h3>
                                    <p className="mb-6 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                                        {product.short_description || 'Program sertifikasi profesional kolaborasi dengan mitra industri terpercaya.'}
                                    </p>
                                    
                                    <div className="mt-auto space-y-4">
                                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                <span>Batas: {format(deadlineDate, 'dd MMM', { locale: id })}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4" />
                                                <span>{product.duration_days} Hari</span>
                                            </div>
                                        </div>
                                        
                                        <div className="h-px w-full bg-border" />
                                        
                                        <div className="flex items-end justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Investasi</span>
                                                {product.price > 0 ? (
                                                    <div className="flex flex-col">
                                                        {product.strikethrough_price > 0 && (
                                                            <span className="text-xs text-muted-foreground line-through decoration-destructive/50">
                                                                Rp {product.strikethrough_price.toLocaleString('id-ID')}
                                                            </span>
                                                        )}
                                                        <span className="text-lg font-bold text-foreground">
                                                            Rp {product.price.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-lg font-bold text-green-600">Gratis</span>
                                                )}
                                            </div>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
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