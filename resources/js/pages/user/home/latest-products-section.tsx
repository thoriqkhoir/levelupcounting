import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from '@inertiajs/react';
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
    type: 'course' | 'bootcamp' | 'webinar' | 'bundle' | 'partnership';
    created_at: string;
}

interface MyProductIds {
    courses: string[];
    bootcamps: string[];
    webinars: string[];
    bundles: string[];
    partnerships: string[];
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
        partnerships: myProductIds?.partnerships || [],
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
            case 'partnership':
                return (
                    <span className="absolute top-2 left-2 z-20 rounded-lg border border-white/40 bg-white/30 px-1 py-1 text-xs font-semibold shadow backdrop-blur-md dark:bg-gray-800/30">
                        Partnership
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
            case 'partnership':
                return safeMyProductIds.partnerships.includes(product.id);
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
            case 'partnership':
                return `/certification/${product.slug}`;
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
        } else if (product.type === 'partnership' && product.duration_days) {
            content = (
                <div className="flex items-center gap-2">
                    <Package size="18" />
                    <p className="text-xs font-semibold text-black dark:text-gray-400">Durasi: {product.duration_days} Hari</p>
                </div>
            );
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
    const availableProducts = safeLatestProducts.filter((product) => !hasAccess(product));

    return (
        <section id="latest-products" className="mx-auto w-full max-w-7xl px-4 py-8">
            <div className="mx-auto text-center">
                {/* <p className="border-primary bg-background text-primary mx-auto mb-4 w-fit rounded-full border bg-gradient-to-t from-[#D9E5FF] to-white px-4 py-1 text-sm font-medium shadow-xs">
                    Produk Terbaru
                </p> */}
                <h2 className="dark:text-primary-foreground mx-auto max-w-2xl pb-8 text-2xl font-semibold text-gray-900 md:text-3xl">
                    Pelatihan Terbaru
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {(() => {
                        if (safeLatestProducts.length === 0) {
                            return (
                                <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                                    <img src="/assets/images/not-found.webp" alt="Produk Belum Tersedia" className="w-48" />
                                    <div className="text-center text-gray-500">Belum ada produk yang tersedia saat ini.</div>
                                </div>
                            );
                        }

                        if (availableProducts.length === 0) {
                            return (
                                <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12">
                                    <div className="text-center text-lg font-semibold">Anda sudah memiliki akses semua produk terbaru kami. 😁🙏</div>
                                    <p className="text-center text-gray-500">Terima kasih telah menjadi bagian dari Sekolah Pajak!</p>
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
                                    <div className="group-hover:ring-primary/40 relative h-full overflow-hidden rounded-2xl border transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:ring-2 dark:bg-zinc-700/30">
                                        <div className="relative flex h-full flex-col rounded-lg bg-white dark:bg-zinc-800">
                                            <div className="w-full flex-shrink-0 overflow-hidden rounded-t-lg">
                                                <div className="relative">
                                                    <img
                                                        src={product.thumbnail ? `/storage/${product.thumbnail}` : '/assets/images/placeholder.png'}
                                                        alt={product.title}
                                                        className="h-48 w-full rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />

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
                                                    {getProductBadge(product.type)}
                                                    {getDateDisplay(product)}

                                                    {/* ✅ Discount Badge - Top Right (from bundling-section.tsx) */}
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
                                                    <p className="mb-0.5 px-2 text-xs text-red-600 line-through dark:text-gray-400">
                                                        Rp {product.strikethrough_price.toLocaleString('id-ID')}
                                                    </p>
                                                )}
                                                <div className="mb-2 flex items-center justify-between gap-2 px-2">
                                                    {product.price === 0 ? (
                                                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">Gratis</p>
                                                    ) : (
                                                        <p className="text-primary text-base font-bold dark:text-gray-200">
                                                            Rp {product.price.toLocaleString('id-ID')}
                                                        </p>
                                                    )}
                                                    {getCategoryDisplay(product)}
                                                </div>

                                                <div className="bg-primary/50 my-2 h-0.5 w-full rounded-full px-4" />
                                                <div className="mx-4 mt-4 flex items-center gap-3">
                                                    {product.type === 'bootcamp' && bootcampMentors.length > 0 ? (
                                                        <div className="flex -space-x-2">
                                                            {bootcampMentors.slice(0, 3).map((mentor, index) =>
                                                                getAvatarSrc(mentor.avatar) ? (
                                                                    <img
                                                                        key={`${mentor.name}-${index}`}
                                                                        src={getAvatarSrc(mentor.avatar) ?? undefined}
                                                                        alt={mentor.name}
                                                                        className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-lg"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        key={`${mentor.name}-${index}`}
                                                                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-gray-200 font-bold text-gray-600 shadow-lg"
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
                                                            className="h-10 w-10 rounded-full object-cover shadow-lg"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600 shadow-lg">
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
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                            {product.type === 'bootcamp'
                                                                ? getBootcampMentorSummary(product)
                                                                : `${presenter.name}${presenter.extraLabel}`}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {product.type === 'bootcamp'
                                                                ? `${bootcampMentors.length} mentor terdaftar`
                                                                : presenter.bio}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
