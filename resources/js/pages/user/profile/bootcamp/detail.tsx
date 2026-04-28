import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Award,
    BadgeCheck,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    LinkIcon,
    MessageSquare,
    Star,
    Upload,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: string;
    name: string;
}

interface BootcampSchedule {
    id: string;
    schedule_date: string;
    day: string;
    start_time: string;
    end_time: string;
    recording_url: string | null;
}

interface BootcampAttendance {
    id: string;
    enrollment_bootcamp_id: string;
    bootcamp_schedule_id: string;
    attendance_proof: string;
    verified: boolean;
    notes?: string;
    bootcamp_schedule: BootcampSchedule;
}

interface Bootcamp {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    category_id: string;
    start_date: string;
    end_date: string;
    category: Category;
    bootcamp_url: string;
    registration_url: string;
    benefits: string;
    curriculum: string;
    description: string | null;
    short_description: string | null;
    group_url: string | null;
    status: string;
    schedules: BootcampSchedule[];
    has_submission_link: boolean;
    created_at: string;
    updated_at: string;
}

interface EnrollmentBootcampItem {
    id: string;
    invoice_id: string;
    bootcamp_id: string;
    bootcamp: Bootcamp;
    progress: number;
    completed_at: string | null;
    attendances: BootcampAttendance[];
    submission?: string | null;
    submission_verified: boolean;
    rating?: number | null;
    review?: string | null;
    reviewed_at?: string | null;
    created_at: string;
    updated_at: string;
}

interface BootcampProps {
    id: string;
    invoice_code: string;
    invoice_url: string;
    amount: number;
    status: string;
    paid_at: string | null;
    user_id: string;
    bootcamp_items: EnrollmentBootcampItem[];
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

interface DetailBootcampProps {
    bootcamp: BootcampProps;
    certificate?: Certificate | null;
    certificateParticipant?: CertificateParticipant | null;
}

function parseList(items?: string | null): string[] {
    if (!items) return [];
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => li.replace(/<\/?li>/g, '').trim());
}

function getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
}

const StarRating = ({
    rating,
    onRatingChange,
    readonly = false,
}: {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
}) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onRatingChange?.(star)}
                    className={`text-2xl transition-colors ${
                        star <= rating ? 'text-yellow-400' : readonly ? 'text-gray-300' : 'text-gray-300 hover:text-yellow-300'
                    } ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default function DetailMyBootcamp({ bootcamp, certificate, certificateParticipant }: DetailBootcampProps) {
    const bootcampItem = bootcamp.bootcamp_items?.[0];
    const bootcampData = bootcampItem?.bootcamp;
    const bootcampInvoiceStatus = bootcamp.status;
    const benefitList = parseList(bootcampData?.benefits);
    const curriculumList = parseList(bootcampData?.curriculum);

    const [showUploadForms, setShowUploadForms] = useState<{ [key: string]: boolean }>({});
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
    const [notes, setNotes] = useState<{ [key: string]: string }>({});
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

    const [showSubmissionForm, setShowSubmissionForm] = useState(false);
    const [submissionUrl, setSubmissionUrl] = useState(bootcampItem?.submission || '');
    const [submittingSubmission, setSubmittingSubmission] = useState(false);

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewText, setReviewText] = useState(bootcampItem?.review || '');
    const [rating, setRating] = useState(bootcampItem?.rating || 0);
    const [submittingReview, setSubmittingReview] = useState(false);
    const thumbnail = bootcampData?.thumbnail ?? '';
    const thumbnailSrc = thumbnail
        ? thumbnail.startsWith('http') || thumbnail.startsWith('/storage')
            ? thumbnail
            : `/storage/${thumbnail}`
        : '/assets/images/placeholder.png';

    const handleFileSelect = (scheduleId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Format file harus berupa gambar (JPG, PNG, WEBP)');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');
                return;
            }

            setSelectedFiles((prev) => ({ ...prev, [scheduleId]: file }));
        }
    };

    const handleUploadAttendance = (scheduleId: string) => {
        const file = selectedFiles[scheduleId];
        if (!file || !bootcampItem) return;

        setUploading((prev) => ({ ...prev, [scheduleId]: true }));

        const formData = new FormData();
        formData.append('attendance_proof', file);
        formData.append('enrollment_id', bootcampItem.id);
        formData.append('schedule_id', scheduleId);
        formData.append('notes', notes[scheduleId] || '');

        router.post(route('profile.bootcamp.attendance.upload'), formData, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: () => {
                setShowUploadForms((prev) => ({ ...prev, [scheduleId]: false }));
                setSelectedFiles((prev) => ({ ...prev, [scheduleId]: null }));
                setNotes((prev) => ({ ...prev, [scheduleId]: '' }));
            },
            onError: (errors) => {
                console.error('Upload errors:', errors);
                alert('Gagal mengupload bukti kehadiran');
            },
            onFinish: () => {
                setUploading((prev) => ({ ...prev, [scheduleId]: false }));
            },
        });
    };

    const getAttendanceForSchedule = (scheduleId: string) => {
        return bootcampItem?.attendances?.find((att) => att.bootcamp_schedule_id === scheduleId);
    };

    const handleSubmitSubmission = () => {
        if (!submissionUrl.trim() || !bootcampItem) {
            alert('Mohon isi link submission');
            return;
        }

        setSubmittingSubmission(true);

        router.post(
            route('profile.bootcamp.submission.submit'),
            {
                submission: submissionUrl,
                enrollment_id: bootcampItem.id,
            },
            {
                preserveState: false,
                preserveScroll: true,
                onSuccess: () => {
                    setShowSubmissionForm(false);
                },
                onError: (errors) => {
                    console.error('Submit errors:', errors);
                    alert('Gagal mengirim submission');
                },
                onFinish: () => {
                    setSubmittingSubmission(false);
                },
            },
        );
    };

    const handleSubmitReview = () => {
        if (!reviewText.trim() || rating === 0 || !bootcampItem) {
            alert('Mohon lengkapi rating dan review');
            return;
        }

        setSubmittingReview(true);

        router.post(
            route('profile.bootcamp.review.submit'),
            {
                rating: rating,
                review: reviewText,
                enrollment_id: bootcampItem.id,
            },
            {
                preserveState: false,
                preserveScroll: true,
                onSuccess: () => {
                    setShowReviewForm(false);
                },
                onError: (errors) => {
                    console.error('Submit errors:', errors);
                    alert('Gagal mengirim review');
                },
                onFinish: () => {
                    setSubmittingReview(false);
                },
            },
        );
    };

    if (!bootcampData || !bootcampItem) {
        return (
            <UserLayout>
                <Head title="Bootcamp Tidak Ditemukan" />
                <div className="flex h-screen items-center justify-center">
                    <Card className="p-8 text-center">
                        <p className="mb-4">Detail bootcamp tidak dapat ditemukan.</p>
                        <Button className="rounded-full" variant="secondary" asChild>
                            <Link href="/profile/my-bootcamps">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali Ke Bootcamp Saya
                            </Link>
                        </Button>
                    </Card>
                </div>
            </UserLayout>
        );
    }

    const bootcampEndDate = new Date(bootcampData.end_date);
    bootcampEndDate.setHours(23, 59, 59, 999);
    const lastSchedule = bootcampData.schedules?.[bootcampData.schedules.length - 1];
    const isCompleted = lastSchedule ? new Date(`${lastSchedule.schedule_date}T${lastSchedule.end_time}`) < new Date() : bootcampEndDate < new Date();

    const totalSchedules = bootcampData.schedules?.length || 0;
    const verifiedAttendances = bootcampItem.attendances?.filter((att) => att.verified).length || 0;
    const allAttendanceVerified = totalSchedules > 0 && verifiedAttendances === totalSchedules;

    const needsSubmission = bootcampData.has_submission_link;
    const hasSubmission = bootcampItem.submission && bootcampItem.submission_verified;

    const hasReview = bootcampItem.rating && bootcampItem.review;

    const hasCertificate =
        certificate && isCompleted && bootcampInvoiceStatus === 'paid' && allAttendanceVerified && (!needsSubmission || hasSubmission) && hasReview;

    const renderCertificateSection = () => {
        if (!isCompleted) return null;

        // Need review to get certificate
        if (!hasReview && allAttendanceVerified && (!needsSubmission || hasSubmission)) {
            return (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                    <Card className="mb-6 overflow-hidden border-2 border-blue-500/20">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-950/20 dark:to-indigo-950/20">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                        <Star className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">🎉 Selamat! Bootcamp Selesai</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Berikan rating dan review untuk mendapatkan sertifikat kelulusan
                                        </p>
                                    </div>
                                </div>
                                <Button size="lg" className="bg-primary" onClick={() => setShowReviewForm(true)}>
                                    <Star className="mr-2 h-4 w-4" />
                                    Beri Rating
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            );
        }

        // Has review but no certificate yet
        if (hasReview && !hasCertificate) {
            return (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                    <Card className="mb-6 overflow-hidden border-2 border-yellow-500/20">
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 dark:from-yellow-950/20 dark:to-orange-950/20">
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg">
                                    <Award className="h-7 w-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">Terima kasih atas rating Anda!</h3>
                                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                        {!certificate ? 'Sertifikat belum dibuat untuk bootcamp ini.' : 'Sertifikat sedang diproses.'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Rating Anda:</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${
                                                        star <= (bootcampItem.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">({bootcampItem.rating}/5)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            );
        }

        // Has certificate
        if (hasCertificate) {
            return (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                    <Card className="mb-6 overflow-hidden border-2 border-green-500/20">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-950/20 dark:to-emerald-950/20">
                            <div className="mb-4 flex items-start gap-4">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                    <Award className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="mb-1 text-lg font-bold text-green-900 dark:text-green-100">🎉 Sertifikat Kelulusan Tersedia!</h3>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        Anda telah berhasil menyelesaikan bootcamp ini dan sertifikat sudah siap diunduh
                                    </p>
                                </div>
                            </div>

                            {certificateParticipant && (
                                <div className="mb-4 rounded-lg border border-green-200 bg-white/50 p-4 dark:border-green-800 dark:bg-green-950/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-900 dark:text-green-100">Nomor Sertifikat</p>
                                            <p className="mt-1 font-mono text-lg font-bold text-green-700 dark:text-green-300">
                                                {String(certificateParticipant.certificate_number).padStart(4, '0')}/{certificate.certificate_number}
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
                                    <a href={route('profile.bootcamp.certificate', { bootcamp: bootcampData.slug })} target="_blank">
                                        <Download className="mr-2 h-4 w-4" />
                                        Unduh Sertifikat
                                    </a>
                                </Button>

                                <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50" asChild>
                                    <a href={route('profile.bootcamp.certificate.preview', { bootcamp: bootcampData.slug })} target="_blank">
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
            <Head title={bootcampData.title} />

            {/* Hero Section */}
            <section className="from-primary to-primary-foreground relative overflow-hidden bg-gradient-to-br px-4 py-16">
                <div className="bg-grid-white/[0.05] absolute inset-0 bg-[size:20px_20px]" />
                <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/30 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-400/30 blur-3xl" />

                <div className="relative mx-auto max-w-7xl">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                        <Button className="mb-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20" asChild>
                            <Link href="/profile/my-bootcamps">
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
                            {new Date(bootcampItem.created_at).toLocaleDateString('id-ID', {
                                month: 'long',
                                year: 'numeric',
                            })}
                        </motion.div>

                        {hasCertificate && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                            >
                                <Award className="h-4 w-4" />
                                Bersertifikat
                            </motion.div>
                        )}

                        {allAttendanceVerified && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Kehadiran Lengkap ({verifiedAttendances}/{totalSchedules})
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
                        className="mt-6 mb-4 text-4xl font-bold text-black sm:text-5xl"
                    >
                        {bootcampData.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6 max-w-3xl text-justify text-lg text-black"
                    >
                        {bootcampData.description}
                    </motion.p>

                    {bootcampInvoiceStatus !== 'paid' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="border-2 border-red-500/20 bg-red-50/50 p-4 backdrop-blur-sm dark:bg-red-950/50">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                                        <span className="text-lg">⚠️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-red-900 dark:text-red-100">
                                            Status Pembayaran: {bootcampInvoiceStatus.toUpperCase()}
                                        </p>
                                        <p className="text-sm text-red-700 dark:text-red-300">
                                            {bootcampInvoiceStatus === 'failed'
                                                ? 'Pembayaran gagal atau dibatalkan. Silakan lakukan pembelian ulang.'
                                                : 'Selesaikan pembayaran untuk mengakses bootcamp.'}
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
                    {/* Left Column - Main Content */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
                        <Card className="p-6">
                            {renderCertificateSection()}

                            {/* Attendance Upload Section */}
                            {bootcampInvoiceStatus === 'paid' && bootcampData.schedules && bootcampData.schedules.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="mb-4 text-2xl font-bold">Jadwal & Kehadiran</h2>
                                    <div className="space-y-4">
                                        {bootcampData.schedules.map((schedule, idx) => {
                                            const attendance = getAttendanceForSchedule(schedule.id);
                                            const showForm = showUploadForms[schedule.id];
                                            const isUploading = uploading[schedule.id];
                                            const scheduleDate = new Date(schedule.schedule_date);
                                            const isPast = scheduleDate < new Date();
                                            const videoId = schedule.recording_url ? getYoutubeId(schedule.recording_url) : '';
                                            const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

                                            return (
                                                <motion.div
                                                    key={schedule.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * idx }}
                                                    className="group rounded-lg border bg-gradient-to-br from-purple-50 to-pink-50 p-4 transition-all hover:shadow-md dark:from-purple-950/20 dark:to-pink-950/20"
                                                >
                                                    <div className="mb-3 flex items-start justify-between">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg">
                                                                <span className="font-bold">{idx + 1}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{schedule.day}</h4>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {new Date(schedule.schedule_date).toLocaleDateString('id-ID', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                    })}{' '}
                                                                    • {schedule.start_time} - {schedule.end_time}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {attendance ? (
                                                            <div
                                                                className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                                                                    attendance.verified
                                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                                }`}
                                                            >
                                                                {attendance.verified ? (
                                                                    <>
                                                                        <CheckCircle className="h-3 w-3" />
                                                                        Terverifikasi
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Clock className="h-3 w-3" />
                                                                        Pending
                                                                    </>
                                                                )}
                                                            </div>
                                                        ) : isPast ? (
                                                            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                                Belum Upload
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    {/* Recording */}
                                                    {embedUrl && attendance?.verified && (
                                                        <div className="mb-3 overflow-hidden rounded-lg">
                                                            <div className="aspect-video">
                                                                <iframe
                                                                    src={embedUrl}
                                                                    title={`Recording ${schedule.day}`}
                                                                    className="h-full w-full"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Upload Form */}
                                                    {attendance ? (
                                                        <div className="mt-3 rounded-lg border border-gray-200 bg-white/50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                                                            <div className="mb-2 flex items-center justify-between">
                                                                <p className="text-sm font-medium">Bukti Kehadiran:</p>
                                                                <a
                                                                    href={`/storage/${attendance.attendance_proof}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-blue-600 hover:underline"
                                                                >
                                                                    Lihat Bukti →
                                                                </a>
                                                            </div>
                                                            {attendance.notes && (
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    Catatan: {attendance.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : isPast ? (
                                                        !showForm ? (
                                                            <Button
                                                                size="sm"
                                                                className="mt-3 w-full bg-purple-600 hover:bg-purple-700"
                                                                onClick={() => setShowUploadForms((prev) => ({ ...prev, [schedule.id]: true }))}
                                                            >
                                                                <Upload className="mr-2 h-4 w-4" />
                                                                Upload Bukti Kehadiran
                                                            </Button>
                                                        ) : (
                                                            <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                                                                <div className="flex items-center justify-between">
                                                                    <Label className="text-sm font-medium">Upload Bukti</Label>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() =>
                                                                            setShowUploadForms((prev) => ({
                                                                                ...prev,
                                                                                [schedule.id]: false,
                                                                            }))
                                                                        }
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleFileSelect(schedule.id, e)}
                                                                        className="text-sm"
                                                                    />
                                                                    {selectedFiles[schedule.id] && (
                                                                        <p className="text-xs text-green-600">✓ {selectedFiles[schedule.id]?.name}</p>
                                                                    )}
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label htmlFor={`notes-${schedule.id}`} className="text-sm">
                                                                        Catatan (opsional)
                                                                    </Label>
                                                                    <Textarea
                                                                        id={`notes-${schedule.id}`}
                                                                        value={notes[schedule.id] || ''}
                                                                        onChange={(e) =>
                                                                            setNotes((prev) => ({
                                                                                ...prev,
                                                                                [schedule.id]: e.target.value,
                                                                            }))
                                                                        }
                                                                        placeholder="Tambahkan catatan..."
                                                                        className="text-sm"
                                                                        rows={2}
                                                                    />
                                                                </div>

                                                                <Button
                                                                    size="sm"
                                                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                                                    onClick={() => handleUploadAttendance(schedule.id)}
                                                                    disabled={!selectedFiles[schedule.id] || isUploading}
                                                                >
                                                                    {isUploading ? 'Mengupload...' : 'Upload'}
                                                                </Button>
                                                            </div>
                                                        )
                                                    ) : null}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Submission Section */}
                            {bootcampInvoiceStatus === 'paid' && needsSubmission && allAttendanceVerified && isCompleted && !hasSubmission && (
                                <div className="mb-8">
                                    <h2 className="mb-4 text-2xl font-bold">Project Submission</h2>
                                    <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:from-blue-950/20 dark:to-cyan-950/20">
                                        <div className="mb-4 flex items-start gap-4">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                                <LinkIcon className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="mb-1 text-lg font-bold">Upload Project Akhir</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Upload link project akhir untuk mendapatkan sertifikat
                                                </p>
                                            </div>
                                        </div>

                                        {!showSubmissionForm ? (
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setShowSubmissionForm(true)}>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Link Project
                                            </Button>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="submission_url">Link Project</Label>
                                                    <Input
                                                        id="submission_url"
                                                        type="url"
                                                        value={submissionUrl}
                                                        onChange={(e) => setSubmissionUrl(e.target.value)}
                                                        placeholder="https://link-project-anda"
                                                    />
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                        onClick={handleSubmitSubmission}
                                                        disabled={submittingSubmission || !submissionUrl.trim()}
                                                    >
                                                        {submittingSubmission ? 'Mengirim...' : 'Kirim'}
                                                    </Button>
                                                    <Button variant="outline" onClick={() => setShowSubmissionForm(false)}>
                                                        Batal
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            )}

                            {/* Benefits */}
                            <div className="mb-8">
                                <h2 className="mb-4 text-2xl font-bold">Fasilitas Bootcamp</h2>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {benefitList.map((benefit, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="group flex items-start gap-3 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 p-4 transition-all hover:shadow-md dark:from-green-950/20 dark:to-emerald-950/20"
                                        >
                                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform group-hover:scale-110">
                                                <BadgeCheck className="h-4 w-4" />
                                            </div>
                                            <p className="text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-300">{benefit}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Curriculum */}
                            <div>
                                <h2 className="mb-4 text-2xl font-bold">Kurikulum</h2>
                                <div className="space-y-3">
                                    {curriculumList.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="flex items-start gap-3 rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-blue-950/20 dark:to-indigo-950/20"
                                        >
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white shadow-lg">
                                                {idx + 1}
                                            </div>
                                            <p className="pt-1 text-sm font-medium text-gray-700 dark:text-gray-300">{item}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Right Column - Sidebar */}
                    {/* Right Column - Sidebar */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-1">
                        <div className="sticky top-4 space-y-4">
                            {/* Bootcamp Card */}
                            <Card className="overflow-hidden">
                                <div className="relative">
                                    <img src={thumbnailSrc} alt={bootcampData.title} className="aspect-video w-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute right-4 bottom-4 left-4">
                                        <h3 className="text-lg font-bold text-white drop-shadow-lg">{bootcampData.title}</h3>
                                    </div>
                                </div>

                                <div className="px-6">
                                    {/* Tombol Join WA - DI BAWAH THUMBNAIL */}

                                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{bootcampData.short_description}</p>

                                    <div className="mb-8 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="h-4 w-4" />
                                                Periode
                                            </span>
                                            <span className="text-sm font-semibold">
                                                {new Date(bootcampData.start_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}{' '}
                                                -{' '}
                                                {new Date(bootcampData.end_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Clock className="h-4 w-4" />
                                                Total Sesi
                                            </span>
                                            <span className="text-sm font-semibold">{totalSchedules} Pertemuan</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <CheckCircle className="h-4 w-4" />
                                                Kehadiran
                                            </span>
                                            <span className="text-sm font-semibold">
                                                {verifiedAttendances}/{totalSchedules} Terverifikasi
                                            </span>
                                        </div>
                                    </div>
                                    {bootcampData.group_url && (
                                        <Button
                                            size="lg"
                                            className="mb-6 w-full"
                                            disabled={bootcampInvoiceStatus !== 'paid'}
                                            onClick={() => window.open(bootcampData.group_url ?? undefined, '_blank')}
                                        >
                                            <Users className="mr-2 h-5 w-5" />
                                            Gabung Grup WA
                                        </Button>
                                    )}
                                </div>
                            </Card>

                            {/* Review Section */}
                            {bootcampInvoiceStatus === 'paid' &&
                                isCompleted &&
                                allAttendanceVerified &&
                                (!needsSubmission || hasSubmission) &&
                                hasReview &&
                                !showReviewForm && (
                                    <Card className="p-6">
                                        <div className="mb-4 flex items-center gap-2">
                                            <MessageSquare className="text-amber-500" size={20} />
                                            <h3 className="font-semibold">Review Anda</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-5 w-5 ${
                                                                star <= (bootcampItem.rating || 0)
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-semibold">({bootcampItem.rating}/5)</span>
                                            </div>

                                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{bootcampItem.review}</p>
                                            </div>

                                            {bootcampItem.reviewed_at && (
                                                <p className="text-xs text-gray-500">
                                                    Dikirim pada{' '}
                                                    {new Date(bootcampItem.reviewed_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </Card>
                                )}

                            {/* Review Form */}
                            {showReviewForm && (
                                <Card className="p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Star className="text-amber-500" size={20} />
                                            <h3 className="font-semibold">Berikan Review</h3>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => setShowReviewForm(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Rating</Label>
                                            <StarRating rating={rating} onRatingChange={setRating} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="review">Review Anda</Label>
                                            <Textarea
                                                id="review"
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                placeholder="Bagikan pengalaman Anda..."
                                                rows={4}
                                            />
                                        </div>

                                        <Button
                                            className="w-full bg-amber-500 hover:bg-amber-600"
                                            onClick={handleSubmitReview}
                                            disabled={submittingReview || rating === 0 || !reviewText.trim()}
                                        >
                                            {submittingReview ? 'Mengirim...' : 'Kirim Review'}
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </UserLayout>
    );
}
