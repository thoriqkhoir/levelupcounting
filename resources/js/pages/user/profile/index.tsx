import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ProfileLayout from '@/layouts/profile/layout';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    BookTextIcon,
    ExternalLink,
    GraduationCap,
    MessageCircle,
    MonitorPlay,
    Play,
    Presentation,
    TrendingUp,
    Calendar,
    Clock,
    CheckCircle2,
    BriefcaseBusiness,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
    id: string;
    title: string;
    slug: string;
    type: 'course' | 'bootcamp' | 'webinar' | 'certification-program';
    routeParam?: string;
    is_scholarship?: boolean;
    progress?: number;
    completed_at?: string;
    start_date?: string;
    end_date?: string;
    start_time?: string;
    end_time?: string;
    group_url?: string;
    enrolled_at: string;
}

interface ProfileProps {
    stats: {
        courses: number;
        bootcamps: number;
        webinars: number;
        certificationPrograms: number;
        total: number;
    };
    recentProducts: Product[];
}

export default function Profile({ stats, recentProducts }: ProfileProps) {
    const getProductTypeLabel = (type: string): string => {
        switch (type) {
            case 'course':
                return 'Kelas Online';
            case 'bootcamp':
                return 'Bootcamp';
            case 'webinar':
                return 'Webinar';
            case 'certification-program':
                return 'Sertifikasi Program';
            default:
                return 'Produk';
        }
    };

    const getProductTypeIcon = (type: string) => {
        switch (type) {
            case 'course':
                return <BookTextIcon className="h-4 w-4" />;
            case 'bootcamp':
                return <Presentation className="h-4 w-4" />;
            case 'webinar':
                return <MonitorPlay className="h-4 w-4" />;
            case 'certification-program':
                return <BriefcaseBusiness className="h-4 w-4" />;
            default:
                return <GraduationCap className="h-4 w-4" />;
        }
    };

    const getProgressBadge = (progress: number) => {
        if (progress === 100) {
            return (
                <Badge className="border-green-300 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Selesai
                </Badge>
            );
        } else if (progress > 0) {
            return (
                <Badge className="border-blue-300 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Berlangsung
                </Badge>
            );
        } else {
            return (
                <Badge className="border-gray-300 bg-gray-100 text-gray-700">
                    <Clock className="mr-1 h-3 w-3" />
                    Belum Dimulai
                </Badge>
            );
        }
    };

    const formatSchedule = (product: Product): string => {
        if (product.type === 'bootcamp') {
            const startDate = format(new Date(product.start_date!), 'dd MMM yyyy', { locale: id });
            const endDate = product.end_date ? format(new Date(product.end_date), 'dd MMM yyyy', { locale: id }) : '';
            return endDate ? `${startDate} - ${endDate}` : startDate;
        }

        if (product.type === 'webinar') {
            const startTime = format(new Date(product.start_time!), 'dd MMM yyyy, HH:mm', { locale: id });
            const endTime = product.end_time ? format(new Date(product.end_time), 'HH:mm', { locale: id }) : '';
            return endTime ? `${startTime} - ${endTime}` : startTime;
        }

        return '-';
    };

    const statsCards = [
        {
            title: 'Total Produk',
            value: stats.total,
            description: 'Total item yang Anda ikuti',
            icon: GraduationCap,
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-50 to-purple-100',
        },
        {
            title: 'Kelas Online',
            value: stats.courses,
            description: 'Kelas yang telah Anda beli',
            icon: BookTextIcon,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100',
        },
        {
            title: 'Bootcamp',
            value: stats.bootcamps,
            description: 'Bootcamp yang Anda ikuti',
            icon: Presentation,
            gradient: 'from-green-500 to-green-600',
            bgGradient: 'from-green-50 to-green-100',
        },
        {
            title: 'Webinar',
            value: stats.webinars,
            description: 'Webinar yang Anda ikuti',
            icon: MonitorPlay,
            gradient: 'from-orange-500 to-orange-600',
            bgGradient: 'from-orange-50 to-orange-100',
        },
        {
            title: 'Sertifikasi Program',
            value: stats.certificationPrograms,
            description: 'Sertifikasi program yang Anda ikuti',
            icon: BriefcaseBusiness,
            gradient: 'from-teal-500 to-teal-600',
            bgGradient: 'from-teal-50 to-teal-100',
        },
    ];

    return (
        <UserLayout>
            <Head title="Profil" />
            <ProfileLayout>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Heading title="Dashboard" description="Pantau aktivitas dan progres belajar Anda di sini." />
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                        >
                            <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                {/* Background Gradient */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:${stat.bgGradient.replace('50', '950/20').replace('100', '900/30')}`}
                                />

                                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <stat.icon className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                    <p className="text-muted-foreground text-xs">{stat.description}</p>
                                </CardContent>

                                {/* Decorative Element */}
                                <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-20 transition-all duration-300 group-hover:scale-150 dark:from-gray-700 dark:to-gray-800" />
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Products Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-8"
                >
                    <Heading title="Produk Saya" description="Daftar produk yang telah Anda beli dan ikuti." />

                    {recentProducts.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {recentProducts.map((product, index) => (
                                <motion.div
                                    key={`${product.type}-${product.id}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                >
                                    <Card className="group h-full overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <CardHeader className="space-y-2 pb-4">
                                            {/* Type Badge & Icon */}
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="gap-1">
                                                    {getProductTypeIcon(product.type)}
                                                    {getProductTypeLabel(product.type)}
                                                </Badge>
                                                {product.type === 'course' && getProgressBadge(product.progress || 0)}
                                                {product.type !== 'course' && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-green-200 bg-green-50 text-green-700 dark:bg-green-950/50"
                                                    >
                                                        Terdaftar
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <CardTitle className="line-clamp-2 text-base group-hover:text-primary">
                                                <Link href={route(`profile.${product.type}.detail`, { [product.type]: product.slug })}>
                                                    {product.title}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="space-y-4 pb-4">
                                            {/* Progress Bar for Courses */}
                                            {product.type === 'course' && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                                        <span>Progress Belajar</span>
                                                        <span className="font-bold">{product.progress || 0}%</span>
                                                    </div>
                                                    <Progress value={product.progress || 0} className="h-2" />
                                                </div>
                                            )}

                                            {/* Schedule for Bootcamp/Webinar */}
                                            {product.type !== 'course' && (
                                                <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800">
                                                    <Calendar className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                                                    <div>
                                                        <p className="font-medium">Jadwal</p>
                                                        <p className="text-gray-600 dark:text-gray-400">{formatSchedule(product)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                {product.type === 'course' ? (
                                                    <Button asChild size="sm" className="w-full shadow-sm">
                                                        <Link href={route('profile.course.detail', { course: product.slug })}>
                                                            <Play className="mr-2 h-4 w-4" />
                                                            Mulai Belajar
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button asChild size="sm" variant="outline" className="flex-1">
                                                            <Link
                                                                href={route(`profile.${product.type}.detail`, {
                                                                    [product.type]: product.slug,
                                                                })}
                                                            >
                                                                <ExternalLink className="mr-1 h-4 w-4" />
                                                                Detail
                                                            </Link>
                                                        </Button>
                                                        {product.group_url && (
                                                            <Button asChild size="sm" className="flex-1 shadow-sm">
                                                                <a href={product.group_url} target="_blank" rel="noopener noreferrer">
                                                                    <MessageCircle className="mr-1 h-4 w-4" />
                                                                    Grup
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {/* Enrolled Date */}
                                            <div className="border-t pt-3 text-xs text-gray-500 dark:text-gray-400">
                                                Terdaftar: {format(new Date(product.enrolled_at), 'dd MMM yyyy', { locale: id })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Card className="border-2 border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                        <GraduationCap className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold">Belum Ada Produk</h3>
                                    <p className="text-muted-foreground mb-6 text-center text-sm">
                                        Anda belum membeli produk apapun. Mulai jelajahi dan pilih kelas yang sesuai untuk Anda!
                                    </p>
                                    <Button asChild size="lg" className="shadow-lg">
                                        <Link href={route('course.index')}>
                                            <BookTextIcon className="mr-2 h-4 w-4" />
                                            Jelajahi Kelas
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </motion.div>
            </ProfileLayout>
        </UserLayout>
    );
}