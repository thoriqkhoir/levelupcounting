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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { rupiahFormatter } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowRight, GalleryVerticalEnd, LayoutGrid, Percent } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation('user');
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
    const handleMouseLeave = () => { isDragging.current = false; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !categoryRef.current) return;
        e.preventDefault();
        const x = e.pageX - categoryRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        categoryRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const filteredCourses = courses.filter((course) => {
        const matchSearch = course.title.toLowerCase().includes(search.toLowerCase());
        const matchLevel = level === 'all' ? true : course.level === level;
        const matchCategory = selectedCategory === null ? true : course.category.id === selectedCategory;
        return matchSearch && matchLevel && matchCategory;
    });

    const visibleCourses = filteredCourses.slice(0, visibleCount);

    const calcDiscount = (original: number, price: number) => {
        if (original <= 0 || original <= price) return 0;
        return Math.round(((original - price) / original) * 100);
    };

    const levelConfig: Record<string, { label: string; cls: string }> = {
        beginner: { label: t('course.catalog.beginner'), cls: 'rounded-lg border border-green-300 bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-zinc-800 dark:text-green-300' },
        intermediate: { label: t('course.catalog.intermediate'), cls: 'rounded-lg border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-zinc-800 dark:text-yellow-300' },
        advanced: { label: t('course.catalog.advanced'), cls: 'rounded-lg border border-red-300 bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-zinc-800 dark:text-red-300' },
    };

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-20" id="course">
            <div className="mb-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                    <LayoutGrid className="h-4 w-4" />{t('course.catalog.badge')}
                </span>
            </div>
            <h2 className="font-av-estiana mx-auto mb-4 max-w-3xl text-center text-2xl font-extrabold text-gray-900 dark:text-primary-foreground md:text-3xl">
                {t('course.catalog.titlePart1')}{' '}
                <span className="relative inline-block">
                    <span className="relative z-10">{t('course.catalog.titlePart2')}</span>
                    <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
                </span>
            </h2>
            <p className="mx-auto mb-8 text-center text-base text-gray-600 dark:text-gray-400">
                {t('course.catalog.subtitle')}
            </p>

            {/* Kategori */}
            <div className="mb-8 overflow-x-auto scrollbar-hide" ref={categoryRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}>
                <div className="flex w-max flex-nowrap gap-3 select-none">
                    <button type="button" onClick={() => setSelectedCategory(null)} className={`rounded-full border-2 px-6 py-2 text-sm font-semibold transition-all duration-200 ${selectedCategory === null ? 'border-primary bg-primary/10 text-primary shadow' : 'border-gray-300 bg-white text-gray-800 hover:border-primary/40 hover:bg-primary/5 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'}`}>
                        {t('course.catalog.allCategories')}
                    </button>
                    {categories.map((category) => (
                        <button key={category.id} type="button" onClick={() => setSelectedCategory(category.id)} className={`rounded-full border-2 px-6 py-2 text-sm font-semibold transition-all duration-200 ${selectedCategory === category.id ? 'border-primary bg-primary/10 text-primary shadow' : 'border-gray-300 bg-white text-gray-800 hover:border-primary/40 hover:bg-primary/5 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'}`}>
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search + Level Filter */}
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
                <Input type="search" placeholder={t('course.catalog.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md rounded-full border-2 border-primary/30 px-6 py-2 shadow-sm focus:border-primary" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-full border-2 border-primary/30 px-6 py-2 shadow-sm">
                            {t('course.catalog.filterLabel', {
                                level: level === 'all'
                                    ? t('course.catalog.allLevels')
                                    : level === 'beginner'
                                      ? t('course.catalog.beginner')
                                      : level === 'intermediate'
                                        ? t('course.catalog.intermediate')
                                        : t('course.catalog.advanced'),
                            })}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>{t('course.catalog.selectDifficulty')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={level} onValueChange={setLevel}>
                            <DropdownMenuRadioItem value="all">{t('course.catalog.allLevels')}</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="beginner">{t('course.catalog.beginner')}</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="intermediate">{t('course.catalog.intermediate')}</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="advanced">{t('course.catalog.advanced')}</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCourses.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                        <img src="/assets/images/not-found.svg" alt={t('course.catalog.emptyAlt')} className="w-48" />
                        <div className="text-center text-gray-500">{t('course.catalog.empty')}</div>
                    </div>
                ) : (
                    visibleCourses.map((course) => {
                        const hasAccess = myCourseIds.includes(course.id);
                        const discount = calcDiscount(course.strikethrough_price, course.price);
                        const lvl = levelConfig[course.level] || { label: course.level, cls: '' };

                        return (
                            <Link key={course.id} href={hasAccess ? `profile/my-courses/${course.slug}` : `/course/${course.slug}`} className="group h-full">
                                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-primary group-hover:ring-2 group-hover:ring-primary dark:border-zinc-700 dark:bg-zinc-800">
                                    {/* Image */}
                                    <div className="relative w-full overflow-hidden">
                                        <img
                                            src={course.thumbnail ? `/storage/${course.thumbnail}` : '/assets/images/placeholder.png'}
                                            alt={course.title}
                                            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Type Badge - Top Left */}
                                        <span className="absolute top-2 left-2 z-20 rounded-lg border border-white/40 bg-white/30 px-1 py-1 text-xs font-semibold shadow backdrop-blur-md dark:bg-gray-800/30">
                                            {t('course.catalog.onlineCourse')}
                                        </span>
                                        {/* Discount / Access Badge - Top Right */}
                                        {hasAccess ? (
                                            <span className="absolute top-2 right-2 z-20 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow">{t('course.catalog.owned')}</span>
                                        ) : discount > 0 ? (
                                            <div className="absolute top-2 right-2 z-20 inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                                <Percent size={10} />{t('course.catalog.saveDiscount', { discount })}
                                            </div>
                                        ) : null}
                                        {/* Level Badge - Bottom Left */}
                                        <div className="absolute bottom-2 left-2 z-20">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className={lvl.cls}>{lvl.label}</div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {course.level === 'beginner'
                                                            ? t('course.catalog.levelBeginner')
                                                            : course.level === 'intermediate'
                                                              ? t('course.catalog.levelIntermediate')
                                                              : t('course.catalog.levelAdvanced')}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        {/* Category - Bottom Right */}
                                        <div className="absolute bottom-2 right-2 z-20">
                                            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">{course.category.name}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col gap-3 p-5">
                                        <h2 className="line-clamp-2 text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{course.title}</h2>
                                        <div>
                                            {course.strikethrough_price > 0 && course.strikethrough_price > course.price && (
                                                <p className="text-base text-red-500 line-through">{rupiahFormatter.format(course.strikethrough_price)}</p>
                                            )}
                                            {hasAccess ? (
                                                <p className="text-2xl font-bold text-primary">{t('course.catalog.registered')}</p>
                                            ) : course.price === 0 ? (
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{t('course.catalog.free')}</p>
                                            ) : (
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{rupiahFormatter.format(course.price)}</p>
                                            )}
                                        </div>
                                        {/* Presenter */}
                                        <div className="flex items-center gap-3">
                                            {course.user?.avatar ? (
                                                <img src={`/storage/${course.user.avatar}`} alt={course.user.name} className="h-10 w-10 rounded-full object-cover shadow" />
                                            ) : (
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 shadow">
                                                    {course.user?.name ? course.user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : '-'}
                                                </div>
                                            )}
                                            <span className="text-base font-medium text-gray-700 dark:text-gray-300">{course.user?.name ?? '-'}</span>
                                        </div>
                                    </div>

                                    {/* CTA Bar */}
                                    <div className="mt-auto flex items-center justify-between px-5 py-3 mx-4 mb-4 rounded-xl border border-gray-200 transition-all duration-300 group-hover:mx-0 group-hover:mb-0 group-hover:rounded-none group-hover:rounded-b-[14px] group-hover:border-transparent group-hover:bg-primary group-hover:px-5 group-hover:py-4 dark:border-zinc-600">
                                        <span className="text-base font-semibold text-gray-700 transition-colors duration-300 group-hover:text-white dark:text-gray-300">
                                            {hasAccess ? t('course.catalog.viewMaterial') : t('course.catalog.registerNow')}
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
            {visibleCount < filteredCourses.length && (
                <div className="mb-8 flex justify-center">
                    <Magnetic>
                        <Button type="button" size="lg" className="rounded-full px-8 py-3 text-base font-bold shadow-lg" onClick={() => setVisibleCount((prev) => prev + 6)}>
                            {t('course.catalog.loadMore')} <GalleryVerticalEnd className="ml-2" />
                        </Button>
                    </Magnetic>
                </div>
            )}
        </section>
    );
}
