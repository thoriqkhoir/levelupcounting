import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, Percent } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface User {
    name: string;
    bio?: string;
    avatar?: string | null;
}

interface Mentor {
    name: string;
    bio?: string;
    avatar?: string | null;
}

interface Product {
    id: string;
    title: string;
    thumbnail: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    level?: 'beginner' | 'intermediate' | 'advanced';
    start_date?: string;
    end_date?: string;
    start_time?: string;
    registration_deadline?: string;
    duration_days?: number;
    category?: Category;
    user?: User;
    mentor?: Mentor | null;
    mentors?: Mentor[];
    type: 'course' | 'bootcamp' | 'webinar' | 'bundle' | 'certification-program';
    created_at: string;
}

interface MyProductIds {
    courses: string[];
    bootcamps: string[];
    webinars: string[];
    bundles: string[];
    certificationPrograms: string[];
}

interface LatestProductsProps {
    latestProducts: Product[];
    myProductIds: MyProductIds;
}

export default function LatestProductsSection({ latestProducts, myProductIds }: LatestProductsProps) {
    const safeMyProductIds = {
        courses: myProductIds?.courses || [],
        bootcamps: myProductIds?.bootcamps || [],
        webinars: myProductIds?.webinars || [],
        bundles: myProductIds?.bundles || [],
        certificationPrograms: myProductIds?.certificationPrograms || [],
    };

    const getProductBadge = (type: string) => {
        switch (type) {
            case 'course':
                return (
                    <span className="absolute top-2 left-2 z-20 rounded-lg border border-white/40 bg-white/30 px-1 py-1 text-xs font-semibold shadow backdrop-blur-md dark:bg-gray-800/30">
                        Kelas Online
                    </span>
                );
            case 'bootcamp':
                return (
                    <span className="absolute top-2 left-2 z-20 rounded-lg border border-white/40 bg-white/30 px-1 py-1 text-xs font-semibold shadow backdrop-blur-md dark:bg-gray-800/30">
                        Bootcamp
                    </span>
                );
            case 'webinar':
                return (
                    <span className="absolute top-2 left-2 z-20 rounded-lg border border-white/40 bg-white/30 px-1 py-1 text-xs font-semibold shadow backdrop-blur-md dark:bg-gray-800/30">
                        Webinar
                    </span>
                );
            case 'bundle':
                return (
                    <span className="absolute top-2 left-2 z-20 rounded-lg border border-white/40 bg-white/30 px-1 py-1 text-xs font-semibold shadow backdrop-blur-md dark:bg-gray-800/30">
                        Bundle
                    </span>
                );
            case 'certification-program':
                return (
                    <span className="absolute top-2 left-2 rounded-full bg-cyan-100 px-2 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                        Sertifikasi
                    </span>
                );
            default:
                return null;
        }
    };

    // ✅ Calculate discount percentage (from bundling-section.tsx)
    const calculateDiscount = (original: number, discounted: number) => {
        if (original === 0) return 0;
        return Math.round(((original - discounted) / original) * 100);
    };

    const hasAccess = (product: Product) => {
        switch (product.type) {
            case 'course':
                return safeMyProductIds.courses.includes(product.id);
            case 'bootcamp':
                return safeMyProductIds.bootcamps.includes(product.id);
            case 'webinar':
                return safeMyProductIds.webinars.includes(product.id);
            case 'bundle':
                return safeMyProductIds.bundles.includes(product.id);
            case 'certification-program':
                return safeMyProductIds.certificationPrograms.includes(product.id);
            default:
                return false;
        }
    };

    const getProductUrl = (product: Product) => {
        const hasProductAccess = hasAccess(product);
        switch (product.type) {
            case 'course':
                return hasProductAccess ? `profile/my-courses/${product.slug}` : `/course/${product.slug}`;
            case 'bootcamp':
                return hasProductAccess ? `profile/my-bootcamps/${product.slug}` : `/bootcamp/${product.slug}`;
            case 'webinar':
                return hasProductAccess ? `profile/my-webinars/${product.slug}` : `/webinar/${product.slug}`;
            case 'bundle':
                return `/bundle/${product.slug}`;
            case 'certification-program':
                return hasProductAccess ? `profile/my-certification-programs/${product.slug}` : `/certification-program/${product.slug}`;
            default:
                return '#';
        }
    };

    const getDateDisplay = (product: Product) => {
        let content = null;

        if (product.type === 'bootcamp') {
            content = (
                <div className="flex items-center gap-2">
                    <Calendar size="12" />
                    <p className="text-xs font-semibold text-black dark:text-gray-400">
                        {new Date(product.start_date!).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })}{' '}
                        -{' '}
                        {new Date(product.end_date!).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            );
        } else if (product.type === 'webinar') {
            content = (
                <div className="flex items-center gap-2">
                    <Calendar size="18" />
                    <p className="text-xs font-semibold text-black dark:text-gray-400">
                        {new Date(product.start_time!).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            );
        } else if (product.type === 'bundle' && product.registration_deadline) {
            const deadline = new Date(product.registration_deadline);
            const now = new Date();
            const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            content = (
                <div className="flex items-center gap-2">
                    <Clock size="18" className={daysLeft <= 3 ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'} />
                    <p className={`text-xs font-semibold ${daysLeft <= 3 ? 'text-red-500' : 'text-black dark:text-gray-400'}`}>
                        {daysLeft > 0 ? `Daftar sebelum ${daysLeft} hari lagi` : 'Pendaftaran ditutup'}
                    </p>
                </div>
            );

            return null;
        }

        if (!content) return null;

        return (
            <div className="absolute right-2 bottom-2 z-20 rounded-lg border border-white/40 bg-white/30 px-2 py-1 shadow backdrop-blur-md dark:bg-gray-800/30">
                {content}
            </div>
        );
    };

    const getCategoryDisplay = (product: Product) => {
        if (product.type === 'bundle') {
            return null;
        }

        if (product.category) {
            return <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">{product.category.name}</span>;
        }

        return null;
    };

    const getAvatarSrc = (avatar?: string | null) => {
        if (!avatar) {
            return null;
        }

        if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/')) {
            return avatar;
        }

        return `/storage/${avatar}`;
    };

    const getProductPresenter = (product: Product) => {
        if (product.type === 'bootcamp') {
            const primaryMentor = product.mentor ?? product.mentors?.[0];
            const mentorCount = product.mentors?.length ?? (primaryMentor ? 1 : 0);

            return {
                name: primaryMentor?.name ?? '-',
                bio: primaryMentor?.bio ?? 'Tidak ada bio',
                avatar: primaryMentor?.avatar,
                extraLabel: mentorCount > 1 ? ` +${mentorCount - 1} mentor` : '',
            };
        }

        return {
            name: product.user?.name ?? '-',
            bio: product.user?.bio ?? 'Tidak ada bio',
            avatar: product.user?.avatar,
            extraLabel: '',
        };
    };

    const getBootcampMentorSummary = (product: Product) => {
        const mentors = product.mentors ?? (product.mentor ? [product.mentor] : []);
        const names = mentors.map((mentor) => mentor.name).filter(Boolean);

        if (names.length === 0) {
            return '-';
        }

        if (names.length <= 2) {
            return names.join(', ');
        }

        return `${names.slice(0, 2).join(', ')} +${names.length - 2} mentor`;
    };

    const safeLatestProducts = Array.isArray(latestProducts) ? latestProducts : [];
    const availableProducts = safeLatestProducts.filter((product) => product.type === 'certification-program' || !hasAccess(product));

    return (
        <section id="latest-products" className="mx-auto w-full max-w-7xl px-4 py-8">
            <div className="mx-auto">
                <h2 className="dark:text-primary-foreground font-av-estiana mx-auto max-w-2xl pb-8 text-center text-2xl font-semibold text-gray-900 md:text-3xl">
                    Unlock New Possibilities
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(() => {
                        if (safeLatestProducts.length === 0) {
                            return (
                                <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                                    <img src="/assets/images/not-found.svg" alt="Produk Belum Tersedia" className="w-48" />
                                    <div className="text-center text-gray-500">Belum ada produk yang tersedia saat ini.</div>
                                </div>
                            );
                        }

                        if (availableProducts.length === 0) {
                            return (
                                <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                                    <div className="text-center text-lg font-semibold">Anda sudah memiliki akses semua produk terbaru kami. 😁🙏</div>
                                    <p className="text-center text-gray-500">Terima kasih telah menjadi bagian dari Level Up Accounting!</p>
                                </div>
                            );
                        }

                        return availableProducts.map((product) => {
                            const productUrl = getProductUrl(product);
                            // ✅ Calculate discount for each product
                            const discount = calculateDiscount(product.strikethrough_price, product.price);
                            const presenter = getProductPresenter(product);
                            const bootcampMentors = product.type === 'bootcamp' ? (product.mentors ?? (product.mentor ? [product.mentor] : [])) : [];

                            return (
                                <Link key={product.id} href={productUrl} className="group h-full">
                                    <div className="group-hover:border-primary group-hover:ring-primary relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:ring-2 dark:border-zinc-700 dark:bg-zinc-800">
                                        {/* Image Section */}
                                        <div className="relative w-full overflow-hidden">
                                            <img
                                                src={product.thumbnail ? `/storage/${product.thumbnail}` : '/assets/images/placeholder.png'}
                                                alt={product.title}
                                                className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />

                                            {/* Type Badge - Top Left */}
                                            {getProductBadge(product.type)}
                                            {product.type === 'certification-program' && product.registration_deadline && (
                                                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Daftar s/d {new Date(product.registration_deadline).toLocaleDateString('id-ID')}</span>
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

                                            {/* Level Badge for courses - Bottom Left */}
                                            {product.type === 'course' && product.level && (
                                                <div className="absolute bottom-2 left-2 z-20">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                className={
                                                                    product.level === 'beginner'
                                                                        ? 'rounded-lg border border-green-300 bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-zinc-800 dark:text-green-300'
                                                                        : product.level === 'intermediate'
                                                                          ? 'rounded-lg border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-zinc-800 dark:text-yellow-300'
                                                                          : 'rounded-lg border border-red-300 bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-zinc-800 dark:text-red-300'
                                                                }
                                                            >
                                                                <p>
                                                                    {product.level === 'beginner'
                                                                        ? 'Beginner'
                                                                        : product.level === 'intermediate'
                                                                          ? 'Intermediate'
                                                                          : 'Advanced'}
                                                                </p>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {product.level === 'beginner' && <p>Level Beginner</p>}
                                                            {product.level === 'intermediate' && <p>Level Intermediate</p>}
                                                            {product.level === 'advanced' && <p>Level Advanced</p>}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            )}

                                            {/* Category Badge - Bottom Left (non-course types) */}
                                            {product.type !== 'course' && getCategoryDisplay(product) && (
                                                <div className="absolute bottom-2 left-2 z-20">{getCategoryDisplay(product)}</div>
                                            )}

                                            {/* Date Display - Bottom Right */}
                                            {getDateDisplay(product)}
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex flex-1 flex-col gap-3 p-5 transition-all duration-300 group-hover:rounded-b-2xl">
                                            {/* Title */}
                                            <h2 className="line-clamp-2 text-lg font-bold text-gray-900 lg:text-xl dark:text-gray-100">
                                                {product.title}
                                            </h2>

                                            {/* Pricing */}
                                            <div>
                                                {product.strikethrough_price > 0 && product.strikethrough_price > product.price && (
                                                    <p className="text-base text-red-500 line-through">
                                                        Rp. {product.strikethrough_price.toLocaleString('id-ID')}
                                                    </p>
                                                )}
                                                {product.price === 0 ? (
                                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">Gratis</p>
                                                ) : (
                                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                        Rp. {product.price.toLocaleString('id-ID')}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Mentor / Presenter Info */}
                                            <div className="flex items-center gap-3">
                                                {product.type === 'bootcamp' && bootcampMentors.length > 0 ? (
                                                    <div className="flex -space-x-2">
                                                        {bootcampMentors.slice(0, 3).map((mentor, index) =>
                                                            getAvatarSrc(mentor.avatar) ? (
                                                                <img
                                                                    key={`${mentor.name}-${index}`}
                                                                    src={getAvatarSrc(mentor.avatar) ?? undefined}
                                                                    alt={mentor.name}
                                                                    className="h-10 w-10 rounded-full border-2 border-white object-cover shadow"
                                                                />
                                                            ) : (
                                                                <div
                                                                    key={`${mentor.name}-${index}`}
                                                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-sm font-bold text-gray-600 shadow"
                                                                >
                                                                    {mentor.name
                                                                        .split(' ')
                                                                        .map((n) => n[0])
                                                                        .join('')
                                                                        .substring(0, 2)
                                                                        .toUpperCase()}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : getAvatarSrc(presenter.avatar) ? (
                                                    <img
                                                        src={getAvatarSrc(presenter.avatar) ?? undefined}
                                                        alt={presenter.name}
                                                        className="h-10 w-10 rounded-full object-cover shadow"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 shadow">
                                                        {presenter.name !== '-'
                                                            ? presenter.name
                                                                  .split(' ')
                                                                  .map((n) => n[0])
                                                                  .join('')
                                                                  .substring(0, 2)
                                                                  .toUpperCase()
                                                            : '-'}
                                                    </div>
                                                )}
                                                <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                                                    {product.type === 'bootcamp'
                                                        ? getBootcampMentorSummary(product)
                                                        : `${presenter.name}${presenter.extraLabel}`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* CTA Button - Outside content padding for flush edges on hover */}
                                        <div className="group-hover:bg-primary mx-4 mt-auto mb-4 flex items-center justify-between rounded-xl border border-gray-200 px-5 py-3 transition-all duration-300 group-hover:mx-0 group-hover:mb-0 group-hover:rounded-none group-hover:rounded-b-[14px] group-hover:border-transparent group-hover:px-5 group-hover:py-4 dark:border-zinc-600">
                                            <span className="text-base font-semibold text-gray-700 transition-colors duration-300 group-hover:text-white dark:text-gray-300">
                                                Daftar Sekarang
                                            </span>
                                            <ArrowRight className="h-6 w-6 text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white dark:text-gray-400" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        });
                    })()}
                </div>
            </div>
            <div className="mt-8 flex justify-center">
                <Link href="/bootcamp" className="text-primary font-semibold">
                    View More...
                </Link>
            </div>
        </section>
    );
}
