import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ProfileLayout from '@/layouts/profile/layout';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id as idLocale, enUS as enLocale } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
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
import { formatExternalUrl } from '@/lib/utils';

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
    is_installment?: boolean;
    is_fully_paid?: boolean;
    is_suspended?: boolean;
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
    const { t, i18n } = useTranslation('profile');
    const currentLocale = i18n.language === 'en' ? enLocale : idLocale;

    const getProductTypeLabel = (type: string): string => {
        switch (type) {
            case 'course':
                return t('dashboard.stats.courses');
            case 'bootcamp':
                return t('dashboard.stats.bootcamps');
            case 'webinar':
                return t('dashboard.stats.webinars');
            case 'certification-program':
                return t('dashboard.stats.certifications');
            default:
                return t('dashboard.table.product');
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
                    {t('dashboard.table.statusCompleted')}
                </Badge>
            );
        } else if (progress > 0) {
            return (
                <Badge className="border-blue-300 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {t('dashboard.table.statusOngoing')}
                </Badge>
            );
        } else {
            return (
                <Badge className="border-gray-300 bg-gray-100 text-gray-700">
                    <Clock className="mr-1 h-3 w-3" />
                    {t('dashboard.table.statusNotStarted')}
                </Badge>
            );
        }
    };

    const formatSchedule = (product: Product): string => {
        if (product.type === 'bootcamp') {
            if (!product.start_date) return '-';
            const startDate = format(new Date(product.start_date), 'dd MMM yyyy', { locale: currentLocale });
            const endDate = product.end_date ? format(new Date(product.end_date), 'dd MMM yyyy', { locale: currentLocale }) : '';
            return endDate ? `${startDate} - ${endDate}` : startDate;
        }

        if (product.type === 'webinar') {
            if (!product.start_time) return '-';
            const startTime = format(new Date(product.start_time), 'dd MMM yyyy, HH:mm', { locale: currentLocale });
            const endTime = product.end_time ? format(new Date(product.end_time), 'HH:mm', { locale: currentLocale }) : '';
            return endTime ? `${startTime} - ${endTime}` : startTime;
        }

        return '-';
    };

    const getProductDetailUrl = (product: Product): string => {
        if (!product.slug) return '#';
        if (product.type === 'certification-program') {
            return route('profile.certification-program.detail', { program: product.slug });
        }
        const paramKey = product.routeParam || product.type;
        return route(`profile.${product.type}.detail`, { [paramKey]: product.slug });
    };

    const statsCards = [
        {
            title: t('dashboard.stats.total'),
            value: stats.total,
            description: t('dashboard.stats.totalDesc'),
            icon: GraduationCap,
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-50 to-purple-100',
        },
        {
            title: t('dashboard.stats.courses'),
            value: stats.courses,
            description: t('dashboard.stats.coursesDesc'),
            icon: BookTextIcon,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100',
        },
        {
            title: t('dashboard.stats.bootcamps'),
            value: stats.bootcamps,
            description: t('dashboard.stats.bootcampsDesc'),
            icon: Presentation,
            gradient: 'from-green-500 to-green-600',
            bgGradient: 'from-green-50 to-green-100',
        },
        {
            title: t('dashboard.stats.webinars'),
            value: stats.webinars,
            description: t('dashboard.stats.webinarsDesc'),
            icon: MonitorPlay,
            gradient: 'from-orange-500 to-orange-600',
            bgGradient: 'from-orange-50 to-orange-100',
        },
        {
            title: t('dashboard.stats.certifications'),
            value: stats.certificationPrograms,
            description: t('dashboard.stats.certificationsDesc'),
            icon: BriefcaseBusiness,
            gradient: 'from-teal-500 to-teal-600',
            bgGradient: 'from-teal-50 to-teal-100',
        },
    ];

    return (
        <UserLayout>
            <Head title={t('sidebar.dashboard')} />
            <ProfileLayout>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Heading title={t('dashboard.title')} description={t('dashboard.description')} />
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                    <Heading title={t('dashboard.myProducts')} description={t('dashboard.myProductsDesc')} />

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
                                                {product.type === 'certification-program' && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/50"
                                                    >
                                                        {product.is_scholarship ? t('dashboard.table.scholarship') : t('dashboard.table.regular')}
                                                    </Badge>
                                                )}
                                                {product.type !== 'course' && product.type !== 'certification-program' && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-green-200 bg-green-50 text-green-700 dark:bg-green-950/50"
                                                    >
                                                        {t('dashboard.table.statusRegistered')}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <CardTitle className="line-clamp-2 text-base group-hover:text-primary">
                                                <Link href={getProductDetailUrl(product)}>
                                                    {product.title}
                                                </Link>
                                            </CardTitle>

                                            {/* Installment Badge if applicable */}
                                            {product.is_installment && (
                                                <div className="pt-1">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            product.is_fully_paid
                                                                ? 'border-green-300 bg-green-50 text-green-700 dark:bg-green-950/50'
                                                                : product.is_suspended
                                                                ? 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950/50'
                                                                : 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50'
                                                        }
                                                    >
                                                        {product.is_fully_paid ? t('dashboard.table.installmentPaid') : product.is_suspended ? t('dashboard.table.installmentSuspended') : t('dashboard.table.installmentActive')}
                                                    </Badge>
                                                </div>
                                            )}
                                        </CardHeader>

                                        <CardContent className="space-y-4 pb-4">
                                            {/* Progress Bar for Courses */}
                                            {product.type === 'course' && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                                        <span>{t('dashboard.learningProgress')}</span>
                                                        <span className="font-bold">{product.progress || 0}%</span>
                                                    </div>
                                                    <Progress value={product.progress || 0} className="h-2" />
                                                </div>
                                            )}

                                            {/* Program Info for Certification Program */}
                                            {product.type === 'certification-program' && (
                                                <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800">
                                                    <BriefcaseBusiness className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                                                    <div>
                                                        <p className="font-medium">{t('dashboard.info')}</p>
                                                        <p className="text-gray-600 dark:text-gray-400">{t('dashboard.table.certRegistration')}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Schedule for Bootcamp/Webinar */}
                                            {(product.type === 'bootcamp' || product.type === 'webinar') && (
                                                <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800">
                                                    <Calendar className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                                                    <div>
                                                        <p className="font-medium">{t('dashboard.schedule')}</p>
                                                        <p className="text-gray-600 dark:text-gray-400">{formatSchedule(product)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                {product.is_installment && !product.is_fully_paid && (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                                                    >
                                                        <Link href={route('profile.installments')}>
                                                            {t('dashboard.table.btnInstallment')}
                                                        </Link>
                                                    </Button>
                                                )}

                                                {product.type === 'course' ? (
                                                    <Button asChild size="sm" className="flex-1 shadow-sm">
                                                        <Link href={route('profile.course.detail', { course: product.slug })}>
                                                            <Play className="mr-2 h-4 w-4" />
                                                            {t('dashboard.btnStartLearning')}
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button asChild size="sm" variant="outline" className="flex-1">
                                                            <Link href={getProductDetailUrl(product)}>
                                                                <ExternalLink className="mr-1 h-4 w-4" />
                                                                {t('dashboard.table.btnDetail')}
                                                            </Link>
                                                        </Button>
                                                        {product.group_url && (
                                                            <Button asChild size="sm" className="flex-1 shadow-sm">
                                                                <a href={formatExternalUrl(product.group_url)} target="_blank" rel="noopener noreferrer">
                                                                    <MessageCircle className="mr-1 h-4 w-4" />
                                                                    {t('dashboard.table.btnGroup')}
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {/* Enrolled Date */}
                                            <div className="border-t pt-3 text-xs text-gray-500 dark:text-gray-400">
                                                {t('dashboard.enrolled', { date: format(new Date(product.enrolled_at), 'dd MMM yyyy', { locale: currentLocale }) })}
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
                                    <h3 className="mb-2 text-lg font-semibold">{t('dashboard.emptyTitle')}</h3>
                                    <p className="text-muted-foreground mb-6 text-center text-sm">
                                        {t('dashboard.emptyDesc')}
                                    </p>
                                    <Button asChild size="lg" className="shadow-lg">
                                        <Link href={route('course.index')}>
                                            <BookTextIcon className="mr-2 h-4 w-4" />
                                            {t('dashboard.table.browseCourses')}
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