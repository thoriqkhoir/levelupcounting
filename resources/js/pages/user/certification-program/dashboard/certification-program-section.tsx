import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Magnetic } from '@/components/ui/magnetic';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowRight, Award, Calendar, Clock, GalleryVerticalEnd, GraduationCap, Percent, Search } from 'lucide-react';
import { useRef, useState } from 'react';

type Category = {
    id: string;
    name: string;
};

interface Program {
    id: string;
    title: string;
    slug: string;
    short_description: string;
    type: 'regular' | 'scholarship';
    category: Category;
    price: number;
    scholarship_price?: number;
    strikethrough_price?: number;
    thumbnail?: string | null;
    registration_deadline?: string;
}

interface MyProgramIds {
    certificationPrograms?: string[];
}

interface CertificationProgramSectionProps {
    categories: Category[];
    programs: Program[];
    myProgramIds?: string[] | MyProgramIds;
}

export default function CertificationProgramSection({ categories, programs, myProgramIds }: CertificationProgramSectionProps) {
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

    const filteredPrograms = programs.filter((program) => {
        const matchSearch = program.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === null ? true : program.category.id === selectedCategory;
        return matchSearch && matchCategory;
    });

    const visiblePrograms = filteredPrograms.slice(0, visibleCount);

    const safeMyProgramIds = Array.isArray(myProgramIds) ? myProgramIds : myProgramIds?.certificationPrograms || [];
    const hasProgramAccess = (programId: string) => safeMyProgramIds.includes(programId);

    const calcDiscount = (original: number, price: number) => {
        if (original <= 0 || original <= price) return 0;
        return Math.round(((original - price) / original) * 100);
    };

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-10" id="certification-programs">
            <div className="mb-12 flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-semibold text-secondary shadow-sm ring-1 ring-secondary/20">
                        <Award className="h-4 w-4" />Pilihan Program Sertifikasi
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
                <div className="flex-1 overflow-x-auto scrollbar-hide" ref={categoryRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}>
                    <div className="flex w-max flex-nowrap gap-3 select-none pb-2">
                        <button type="button" onClick={() => setSelectedCategory(null)} className={`rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${selectedCategory === null ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5'}`}>
                            Semua Kategori
                        </button>
                        {categories.map((category) => (
                            <button key={category.id} type="button" onClick={() => setSelectedCategory(category.id)} className={`rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${selectedCategory === category.id ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5'}`}>
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
                    <Input type="search" placeholder="Cari program sertifikasi..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-12 w-full rounded-full border-2 border-border bg-background pl-11 pr-4 shadow-sm transition-colors focus-visible:border-primary focus-visible:ring-0" />
                </div>
            </div>

            {/* Cards */}
            <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePrograms.length === 0 ? (
                    <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
                        <div className="mb-4 rounded-full bg-muted p-4"><Search className="h-8 w-8 text-muted-foreground" /></div>
                        <h3 className="mb-2 text-xl font-bold">Program Tidak Ditemukan</h3>
                        <p className="text-muted-foreground">Belum ada program sertifikasi yang sesuai dengan pencarian Anda.</p>
                    </div>
                ) : (
                    visiblePrograms.map((program) => {
                        const displayPrice = program.type === 'scholarship' ? (program.scholarship_price ?? program.price) : program.price;
                        const deadlineDate = program.registration_deadline ? new Date(program.registration_deadline) : null;
                        const daysLeft = deadlineDate ? Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
                        const discount = calcDiscount(program.strikethrough_price ?? 0, displayPrice);
                        const hasAccess = hasProgramAccess(program.id);
                        const programUrl = hasAccess
                            ? `/profile/my-certification-programs/${program.slug}`
                            : route('certification-programs.detail', program.slug);

                        return (
                            <Link key={program.id} href={programUrl} className="group h-full">
                                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-primary group-hover:ring-2 group-hover:ring-primary dark:border-zinc-700 dark:bg-zinc-800">
                                    {/* Image */}
                                    <div className="relative w-full overflow-hidden">
                                        <img
                                            src={program.thumbnail ? `/storage/${program.thumbnail}` : '/assets/images/placeholder.png'}
                                            alt={program.title}
                                            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                                        {/* Type Badge - Top Left */}
                                        <span className="absolute top-2 left-2 z-20 rounded-lg border border-white/40 bg-white/30 px-1 py-1 text-xs font-semibold shadow backdrop-blur-md dark:bg-gray-800/30 flex items-center gap-1">
                                            <GraduationCap size={12} />
                                            {program.type === 'scholarship' ? 'Beasiswa' : 'Reguler'}
                                        </span>
                                        {/* Discount / Urgency / Free / Purchased Badge - Top Right */}
                                        {hasAccess ? (
                                            <span className="absolute top-2 right-2 z-20 rounded-full bg-emerald-500/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-sm">Sudah Dibeli</span>
                                        ) : displayPrice === 0 ? (
                                            <span className="absolute top-2 right-2 z-20 rounded-full bg-green-500/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-sm">Gratis</span>
                                        ) : discount > 0 ? (
                                            <div className="absolute top-2 right-2 z-20 inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                                <Percent size={10} />Hemat {discount}%
                                            </div>
                                        ) : daysLeft <= 7 && daysLeft > 0 ? (
                                            <span className="absolute top-2 right-2 z-20 rounded-full bg-destructive/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1">
                                                <Clock className="h-3 w-3" />{daysLeft} Hari Lagi
                                            </span>
                                        ) : null}
                                        {/* Category - Bottom Left */}
                                        <div className="absolute bottom-2 left-2 z-20">
                                            <span className="rounded-md bg-primary/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                                                {program.category.name}
                                            </span>
                                        </div>
                                        {/* Deadline - Bottom Right */}
                                        {deadlineDate && (
                                            <div className="absolute right-2 bottom-2 z-20 rounded-lg border border-white/40 bg-white/30 px-2 py-1 shadow backdrop-blur-md dark:bg-gray-800/30">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} />
                                                    <p className="text-xs font-semibold text-black dark:text-gray-400">{format(deadlineDate, 'dd MMM yyyy', { locale: id })}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col gap-3 p-5">
                                        <h2 className="line-clamp-2 text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{program.title}</h2>
                                        {program.short_description && (
                                            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">{program.short_description}</p>
                                        )}
                                        <div>
                                            {(program.strikethrough_price ?? 0) > 0 && (program.strikethrough_price ?? 0) > displayPrice && (
                                                <p className="text-base text-red-500 line-through">Rp. {(program.strikethrough_price ?? 0).toLocaleString('id-ID')}</p>
                                            )}
                                            {displayPrice === 0 ? (
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Gratis</p>
                                            ) : (
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Rp. {displayPrice.toLocaleString('id-ID')}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* CTA Bar */}
                                    <div className="mt-auto flex items-center justify-between px-5 py-3 mx-4 mb-4 rounded-xl border border-gray-200 transition-all duration-300 group-hover:mx-0 group-hover:mb-0 group-hover:rounded-none group-hover:rounded-b-[14px] group-hover:border-transparent group-hover:bg-primary group-hover:px-5 group-hover:py-4 dark:border-zinc-600">
                                        <span className="text-base font-semibold text-gray-700 transition-colors duration-300 group-hover:text-white dark:text-gray-300">
                                            {hasAccess ? 'Akses Program' : 'Daftar Sekarang'}
                                        </span>
                                        <ArrowRight className="h-6 w-6 text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white dark:text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Load More */}
            {visibleCount < filteredPrograms.length && (
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
