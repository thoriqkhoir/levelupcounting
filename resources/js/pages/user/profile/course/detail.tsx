import RatingDialog from '@/components/rating-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, BadgeCheck, BookOpen, Calendar, CheckCircle, Clock, Download, Eye, PlayCircle, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: string;
    name: string;
}

interface Course {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    level: string;
    category_id: string;
    category: Category;
    course_url: string;
    registration_url: string;
    key_points: string;
    description: string | null;
    short_description: string | null;
    status: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

interface EnrollmentCourseItem {
    id: string;
    invoice_id: string;
    course_id: string;
    course: Course;
    progress: number;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

interface CourseProps {
    id: string;
    invoice_code: string;
    invoice_url: string;
    amount: number;
    status: string;
    paid_at: string | null;
    user_id: string;
    course_items: EnrollmentCourseItem[];
    created_at: string;
    updated_at: string;
}

interface CourseRating {
    id: string;
    user_id: string;
    course_id: string;
    rating: number;
    review: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
}

interface Certificate {
    id: string;
    title: string;
    certificate_number: string;
    description?: string;
}

interface CertificateParticipant {
    id: string;
    certificate_code: string;
    certificate_number: number;
}

function parseList(items?: string | null): string[] {
    if (!items) return [];
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => li.replace(/<\/?li>/g, '').trim());
}

const levelColors = {
    beginner: 'bg-primary-foreground text-black border-primary-500/20 dark:text-red-400',
    intermediate: 'bg-primary-foreground text-black border-primary-500/20 dark:text-red-400',
    advanced: 'bg-red-500/40 text-black border-red-500/20 dark:text-red-400',
};

const levelLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

export default function DetailMyCourse({
    course,
    courseRating,
    certificate,
    certificateParticipant,
}: {
    course: CourseProps | null;
    courseRating: CourseRating | null;
    certificate?: Certificate | null;
    certificateParticipant?: CertificateParticipant | null;
}) {
    const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);

    if (!course) {
        return (
            <UserLayout>
                <Head title="Kelas Tidak Ditemukan" />
                <div className="flex h-screen items-center justify-center">
                    <Card className="p-8 text-center">
                        <p className="mb-4">Detail kelas tidak dapat ditemukan.</p>
                        <Button className="rounded-full" variant="secondary" asChild>
                            <Link href="/profile/my-courses">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali Ke Kelas Saya
                            </Link>
                        </Button>
                    </Card>
                </div>
            </UserLayout>
        );
    }

    const courseItem = course.course_items?.[0];
    const courseData = courseItem?.course;
    const courseInvoiceStatus = course.status;
    const keyPointList = parseList(courseData?.key_points);
    const isCompleted = courseItem?.progress === 100;
    const hasCertificate = certificate && isCompleted && courseRating && courseInvoiceStatus === 'paid';

    const renderCertificateSection = () => {
        if (!courseItem || courseItem.progress !== 100) return null;

        if (!courseRating) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="mb-6 overflow-hidden border-2 border-blue-500/20">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-950/20 dark:to-indigo-950/20">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                        <Star className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                                            🎉 Selamat! Kelas Selesai
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Berikan rating dan review untuk mendapatkan sertifikat kelulusan
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="bg-primary"
                                    onClick={() => setIsRatingDialogOpen(true)}
                                >
                                    <Star className="mr-2 h-4 w-4" />
                                    Beri Rating
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            );
        }

        if (courseRating && !hasCertificate) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="mb-6 overflow-hidden border-2 border-yellow-500/20">
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 dark:from-yellow-950/20 dark:to-orange-950/20">
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg">
                                    <Award className="h-7 w-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                                        Terima kasih atas rating Anda!
                                    </h3>
                                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                        {!certificate ? 'Sertifikat belum dibuat untuk course ini.' : 'Sertifikat sedang diproses.'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Rating Anda:</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${
                                                        star <= courseRating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            ({courseRating.rating}/5)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            );
        }

        if (hasCertificate) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="mb-6 overflow-hidden border-2 border-green-500/20">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-950/20 dark:to-emerald-950/20">
                            <div className="mb-4 flex items-start gap-4">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                    <Award className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-1 text-lg font-bold text-green-900 dark:text-green-100">
                                        🎉 Sertifikat Kelulusan Tersedia!
                                    </h3>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        Anda telah berhasil menyelesaikan kelas ini dan sertifikat sudah siap diunduh
                                    </p>
                                </div>
                            </div>

                            {certificateParticipant && (
                                <div className="mb-4 rounded-lg border border-green-200 bg-white/50 p-4 dark:border-green-800 dark:bg-green-950/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                                Nomor Sertifikat
                                            </p>
                                            <p className="mt-1 font-mono text-lg font-bold text-green-700 dark:text-green-300">
                                                {String(certificateParticipant.certificate_number).padStart(4, '0')}/
                                                {certificate.certificate_number}
                                            </p>
                                        </div>
                                        <Link
                                            href={route('certificate.participant.detail', {
                                                code: certificateParticipant.certificate_code,
                                            })}
                                            className="text-sm font-medium text-green-600 underline hover:text-green-800 dark:text-green-400"
                                        >
                                            Lihat Detail →
                                        </Link>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" asChild>
                                    <a href={route('profile.course.certificate', { course: courseData.slug })} target="_blank">
                                        <Download className="mr-2 h-4 w-4" />
                                        Unduh Sertifikat
                                    </a>
                                </Button>

                                <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50" asChild>
                                    <a href={route('profile.course.certificate.preview', { course: courseData.slug })} target="_blank">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Lihat Preview
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            );
        }

        return null;
    };

    return (
        <UserLayout>
            <Head title={courseData?.title || 'Detail Kelas'} />
            {!courseData ? (
                <div className="flex h-screen items-center justify-center">
                    <Card className="p-8 text-center">
                        <p className="mb-4">Detail kelas tidak dapat ditemukan.</p>
                        <Button className="rounded-full" variant="secondary" asChild>
                            <Link href="/profile/my-courses">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali Ke Kelas Saya
                            </Link>
                        </Button>
                    </Card>
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-foreground px-4 py-16">
                        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                        <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/30 blur-3xl" />
                        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400/30 blur-3xl" />

                        <div className="relative mx-auto max-w-7xl">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                                <Button className="mb-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20" asChild>
                                    <Link href="/profile/my-courses">
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                    </Link>
                                </Button>
                            </motion.div>

                            <div className="flex flex-wrap items-center gap-3">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                                >
                                    <Calendar className="h-4 w-4" />
                                    Terdaftar{' '}
                                    {courseItem &&
                                        new Date(courseItem.created_at).toLocaleDateString('id-ID', {
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-4 py-1.5 text-sm font-medium text-white shadow-lg ${
                                        levelColors[courseData.level as keyof typeof levelColors]
                                    }`}
                                >
                                    <TrendingUp className="h-4 w-4" />
                                    Level {levelLabels[courseData.level as keyof typeof levelLabels]}
                                </motion.div>

                                {hasCertificate && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                                    >
                                        <Award className="h-4 w-4" />
                                        Bersertifikat
                                    </motion.div>
                                )}

                                {isCompleted && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        Selesai
                                    </motion.div>
                                )}
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mb-4 mt-6 text-4xl font-bold text-black sm:text-5xl"
                            >
                                {courseData.title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mb-6 max-w-3xl text-lg text-justify text-black"
                            >
                                {courseData.description}
                            </motion.p>

                            {courseInvoiceStatus !== 'paid' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Card className="border-2 border-red-500/20 bg-red-50/50 p-4 backdrop-blur-sm dark:bg-red-950/50">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                                                <span className="text-lg">⚠️</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-red-900 dark:text-red-100">
                                                    Status Pembayaran: {courseInvoiceStatus.toUpperCase()}
                                                </p>
                                                <p className="text-sm text-red-700 dark:text-red-300">
                                                    {courseInvoiceStatus === 'failed'
                                                        ? 'Pembayaran gagal atau dibatalkan. Silakan lakukan pembelian ulang.'
                                                        : 'Selesaikan pembayaran untuk mengakses kelas.'}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}
                        </div>
                    </section>

                    {/* Main Content */}
                    <section className="mx-auto my-12 w-full max-w-7xl px-4">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Left Column - Progress & Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="lg:col-span-2"
                            >
                                <Card className="p-6">
                                    {renderCertificateSection()}

                                    {/* Progress Section */}
                                    <div className="mb-8">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-2xl font-bold">Progres Pembelajaran</h2>
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-md font-bold text-white shadow-lg">
                                                    {courseItem?.progress || 0}%
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative mb-4">
                                            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner dark:bg-gray-700">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${courseItem?.progress || 0}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className={`relative h-4 rounded-full shadow-lg ${
                                                        (courseItem?.progress || 0) === 100
                                                            ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600'
                                                            : 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600'
                                                    }`}
                                                >
                                                    <div className="absolute inset-0 animate-pulse rounded-full bg-white/20"></div>
                                                </motion.div>
                                            </div>
                                        </div>

                                        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-800 dark:to-gray-900">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {courseItem?.completed_at ? (
                                                        <>
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                                                <CheckCircle className="h-5 w-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-green-900 dark:text-green-100">
                                                                    Kelas Selesai
                                                                </p>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {new Date(courseItem.completed_at).toLocaleDateString('id-ID', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                                                <Clock className="h-5 w-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                                    Sedang Berlangsung
                                                                </p>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    Terus belajar untuk menyelesaikan kelas
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Key Points */}
                                    <div>
                                        <h2 className="mb-4 text-2xl font-bold">Poin Utama</h2>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {keyPointList.map((keyPoint, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * idx + 0.6 }}
                                                    className="group flex items-start gap-3 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 p-4 transition-all hover:shadow-md dark:from-green-950/20 dark:to-emerald-950/20"
                                                >
                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform group-hover:scale-110">
                                                        <BadgeCheck className="h-4 w-4" />
                                                    </div>
                                                    <p className="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                                                        {keyPoint}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Right Column - Course Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="lg:col-span-1"
                            >
                                <div className="sticky top-4">
                                    <Card className="overflow-hidden">
                                        <div className="relative">
                                            <img
                                                src={
                                                    courseData.thumbnail.startsWith('http') || courseData.thumbnail.startsWith('/storage')
                                                        ? courseData.thumbnail
                                                        : `/storage/${courseData.thumbnail}`
                                                }
                                                alt={courseData.title}
                                                className="aspect-video w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-lg font-bold text-white drop-shadow-lg">{courseData.title}</h3>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                                                {courseData.short_description}
                                            </p>

                                            <Button
                                                size="lg"
                                                className="w-full "
                                                onClick={() => router.get(route('learn.course.detail', { course: courseData.slug }))}
                                            >
                                                {isCompleted ? (
                                                    <>
                                                        <Eye className="mr-2 h-5 w-5" />
                                                        Lihat Kembali Materi
                                                    </>
                                                ) : (
                                                    <>
                                                        <PlayCircle className="mr-2 h-5 w-5" />
                                                        Lanjutkan Belajar
                                                    </>
                                                )}
                                            </Button>

                                            {/* Stats */}
                                            
                                        </div>
                                    </Card>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </>
            )}

            {courseData && (
                <RatingDialog
                    isOpen={isRatingDialogOpen}
                    onClose={() => setIsRatingDialogOpen(false)}
                    course={{
                        id: courseData.id,
                        title: courseData.title,
                        thumbnail: courseData.thumbnail,
                        description: courseData.description || courseData.short_description || '',
                    }}
                />
            )}
        </UserLayout>
    );
}