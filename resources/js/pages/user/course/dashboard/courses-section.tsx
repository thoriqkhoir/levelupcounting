import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Magnetic } from '@/components/ui/magnetic';
import { Spotlight } from '@/components/ui/spotlight';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from '@inertiajs/react';
import { GalleryVerticalEnd, LayoutGrid, Sparkles, Star } from 'lucide-react';
import { useRef, useState } from 'react';

type Category = {
    id: string;
    name: string;
};

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: Category;
    user: {
        id: string;
        name: string;
        bio?: string;
        avatar?: string | null;
    };
}

interface CourseProps {
    categories: Category[];
    courses: Course[];
    myCourseIds: string[];
}

export default function CoursesSection({ categories, courses, myCourseIds }: CourseProps) {
    const [level, setLevel] = useState('all');
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
        const walk = (x - startX.current) * 1.5; // scroll speed
        categoryRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const filteredCourses = courses.filter((course) => {
        const matchSearch = course.title.toLowerCase().includes(search.toLowerCase());
        const matchLevel = level === 'all' ? true : course.level === level;
        const matchCategory = selectedCategory === null ? true : course.category.id === selectedCategory;
        return matchSearch && matchLevel && matchCategory;
    });

    const visibleCourses = filteredCourses.slice(0, visibleCount);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-20" id="course">
            {/* Badge label */}
            <div className="mb-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                    <LayoutGrid className="h-4 w-4" />
                    Eksplorasi Kelas
                </span>
            </div>

            {/* Heading dengan underline highlight */}
            <h2 className="font-av-estiana mx-auto mb-4 max-w-3xl text-center text-2xl font-extrabold text-gray-900 dark:text-primary-foreground md:text-3xl">
                Ratusan Skill Impian{' '}
                <span className="relative inline-block">
                    <span className="relative z-10">Kini Dalam Genggamanmu</span>
                    <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
                </span>
            </h2>
            <p className="mx-auto mb-8 text-center text-base text-gray-600 dark:text-gray-400 md:text-base">
                Eksplorasi materi-materi unggulan dari rancangan experts yang akan selalu update setiap bulan.
            </p>
            {/* Filter Level */}

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
            <div className="mb-8 flex gap-2 justify-center">
                <Input
                    type="search"
                    placeholder="Cari kelas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md rounded-full border-2 border-primary/30 px-6 py-2 shadow-sm focus:border-primary"
                />
                <div className="mb-8 flex justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-full border-2 border-primary/30 px-6 py-2 shadow-sm">
                            Filter Tingkat: {level === 'all' ? 'Semua' : level === 'beginner' ? 'Beginner' : level === 'intermediate' ? 'Intermediate' : 'Advanced'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Pilih Tingkat Kesulitan</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={level} onValueChange={setLevel}>
                            <DropdownMenuRadioItem value="all">Semua</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="beginner">Beginner</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="intermediate">Intermediate</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="advanced">Advanced</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </div>
            {/* Card Courses */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {visibleCourses.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                        <img src="/assets/images/not-found.svg" alt="Kelas Belum Tersedia" className="w-48" />
                        <div className="text-center text-gray-500">Belum ada kelas yang tersedia saat ini.</div>
                    </div>
                ) : (
                    visibleCourses.map((course) => {
                        const hasAccess = myCourseIds.includes(course.id);

                        return (
                            <Link
                                key={course.id}
                                href={hasAccess ? `profile/my-courses/${course.slug}` : `/course/${course.slug}`}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40 dark:bg-zinc-800/80"
                            >
                                {/* Badge akses/gratis */}
                                {hasAccess && (
                                    <span className="absolute top-3 right-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow">
                                        Sudah Akses
                                    </span>
                                )}
                                {!hasAccess && course.price === 0 && (
                                    <span className="absolute top-3 right-3 z-10 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow">
                                        Gratis
                                    </span>
                                )}
                                {/* Thumbnail */}
                                <div className="relative w-full overflow-hidden rounded-t-2xl">
                                    <img
                                        src={course.thumbnail ? `/storage/${course.thumbnail}` : '/assets/images/placeholder.png'}
                                        alt={course.title}
                                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Level badge */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={`absolute bottom-3 right-3 rounded-lg font-semibold px-3 py-1 text-xs dark:bg-zinc-800 dark:text-green-300 ${
                                                    course.level === 'beginner'
                                                        ? 'bg-green-100 text-green-700 border border-green-300 '
                                                        : course.level === 'intermediate'
                                                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                                          : 'bg-red-100 text-red-700 border border-red-300'
                                                }`}
                                            >
                                                 {course.level === 'beginner' ? 'Beginner' : course.level === 'intermediate' ? 'Intermediate' : 'Advanced'}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {course.level === 'beginner' && <p>Level Beginner</p>}
                                            {course.level === 'intermediate' && <p>Level Intermediate</p>}
                                            {course.level === 'advanced' && <p>Level Advanced</p>}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                {/* Konten */}
                                <div className="flex flex-1 flex-col justify-between px-4">
                                    <h2 className="mb-2 mt-2 line-clamp-2 text-left text-lg font-semibold text-gray-900 dark:text-white">{course.title}</h2>
                                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{course.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        {!hasAccess && course.price > 0 ? (
                                            <div className="flex flex-col items-start">
                                                {course.strikethrough_price > 0 && (
                                                    <span className="text-xs text-red-500 line-through">
                                                        Rp {course.strikethrough_price.toLocaleString('id-ID')}
                                                    </span>
                                                )}
                                                <span className="text-base font-bold text-primary">
                                                    Rp {course.price.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        ) : !hasAccess && course.price === 0 ? (
                                            <span className="text-base font-bold text-green-600">Gratis</span>
                                        ) : (
                                            <span className="text-base font-bold text-primary">Sudah Terdaftar</span>
                                        )}
                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                            {course.category.name}
                                        </span>
                                    </div>
                                    <div className="px-4 mt-2 h-0.5 w-full rounded-full bg-primary/50" />
                                </div>

                                <div className="mx-4 my-4 flex items-center gap-3">
                                    {course.user?.avatar ? (
                                        <img
                                            src={`/storage/${course.user.avatar}`}
                                            alt={course.user.name}
                                            className="h-10 w-10 rounded-full object-cover shadow-lg"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold flex-shrink-0">
                                            {course.user?.name
                                                ? course.user.name
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
                                            {course.user?.name ?? '-'}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {course.user?.bio ?? 'Tidak ada bio'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
            {/* Tombol Lihat Lebih Banyak */}
            {visibleCount < filteredCourses.length && (
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
