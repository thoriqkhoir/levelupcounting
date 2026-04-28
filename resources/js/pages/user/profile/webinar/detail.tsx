import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, BadgeCheck, Calendar, CheckCircle, Clock, Download, Eye, MessageSquare, Upload, Users, X, Youtube, Star } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: string;
    name: string;
}

interface Webinar {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    category_id: string;
    category: Category;
    start_time: string;
    end_time: string;
    webinar_url: string;
    registration_url: string;
    recording_url: string | null;
    benefits: string;
    description: string | null;
    short_description: string | null;
    group_url: string | null;
    status: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

interface EnrollmentWebinarItem {
    id: string;
    invoice_id: string;
    webinar_id: string;
    webinar: Webinar;
    progress: number;
    completed_at: string | null;
    attendance_proof?: string | null;
    attendance_verified: boolean;
    review?: string | null;
    rating?: number | null;
    created_at: string;
    updated_at: string;
}

interface WebinarProps {
    id: string;
    invoice_code: string;
    invoice_url: string;
    amount: number;
    status: string;
    paid_at: string | null;
    user_id: string;
    webinar_items: EnrollmentWebinarItem[];
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

interface DetailWebinarProps {
    webinar: WebinarProps;
    certificate?: Certificate | null;
    certificateParticipant?: CertificateParticipant | null;
}

function parseList(items?: string | null): string[] {
    if (!items) return [];
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => li.replace(/<\/?li>/g, '').trim());
}

function getYoutubeEmbedUrl(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
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
                    className={`text-2xl transition-colors ${star <= rating ? 'text-yellow-400' : readonly ? 'text-gray-300' : 'text-gray-300 hover:text-yellow-300'
                        } ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default function DetailMyWebinar({ webinar, certificate, certificateParticipant }: DetailWebinarProps) {
    const webinarItem = webinar.webinar_items?.[0];
    const webinarData = webinarItem?.webinar;
    const webinarInvoiceStatus = webinar.status;
    const benefitList = parseList(webinarData?.benefits);
    const [isLoading, setIsLoading] = useState(true);

    const [submittingForm, setSubmittingForm] = useState(false);
    const [showCombinedForm, setShowCombinedForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const thumbnail = webinarData?.thumbnail ?? '';
    const thumbnailSrc = thumbnail
        ? (thumbnail.startsWith('http') || thumbnail.startsWith('/storage')
            ? thumbnail
            : `/storage/${thumbnail}`)
        : '/assets/images/placeholder.png';

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

            setSelectedFile(file);
        }
    };

    const handleSubmitForm = async () => {
        if (!selectedFile || !reviewText.trim() || rating === 0 || !webinarItem) {
            alert('Mohon lengkapi semua field: upload bukti kehadiran, review, dan rating');
            return;
        }

        setSubmittingForm(true);

        const formData = new FormData();
        formData.append('attendance_proof', selectedFile);
        formData.append('review', reviewText);
        formData.append('rating', rating.toString());
        formData.append('enrollment_id', webinarItem.id);

        router.post(route('profile.webinar.attendance-review.submit'), formData, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: () => {
                setShowCombinedForm(false);
                resetForm();
            },
            onError: (errors) => {
                console.error('Submit errors:', errors);
                alert('Gagal mengirim data');
            },
            onFinish: () => {
                setSubmittingForm(false);
            },
        });
    };

    const resetForm = () => {
        setSelectedFile(null);
        setReviewText('');
        setRating(0);
    };

    if (!webinarData || !webinarItem) {
        return (
            <UserLayout>
                <Head title="Webinar Tidak Ditemukan" />
                <div className="flex h-screen items-center justify-center">
                    <Card className="p-8 text-center">
                        <p className="mb-4">Detail webinar tidak dapat ditemukan.</p>
                        <Button className="rounded-full" variant="secondary" asChild>
                            <Link href="/profile/my-webinars">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali Ke Webinar Saya
                            </Link>
                        </Button>
                    </Card>
                </div>
            </UserLayout>
        );
    }

    const webinarEndDate = new Date(webinarData.end_time);
    const isWebinarFinished = new Date() > webinarEndDate;
    const isCompleted = isWebinarFinished;
    const hasRecording = webinarData.recording_url && getYoutubeEmbedUrl(webinarData.recording_url);
    const isAttendanceVerified = webinarItem.attendance_verified;
    const hasReview = webinarItem.review && webinarItem.rating;

    const hasCertificate = certificate && isCompleted && webinarInvoiceStatus === 'paid' && isAttendanceVerified && hasReview;

    const renderCertificateSection = () => {
        if (!isCompleted) return null;

        // Need review to get certificate
        if (!hasReview && webinarInvoiceStatus === 'paid') {
            return (
                <>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                        <Card className="mb-6 overflow-hidden border-2 border-blue-500/20">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-950/20 dark:to-indigo-950/20">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                            <Upload className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                                                🎉 Webinar Telah Selesai!
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Upload bukti kehadiran dan berikan review untuk mendapatkan sertifikat
                                            </p>
                                        </div>
                                    </div>
                                    {!showCombinedForm && (
                                        <Button size="lg" className="bg-primary" onClick={() => setShowCombinedForm(true)}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Bukti & Review
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Form langsung di sini, bukan di luar */}
                    {showCombinedForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:border-purple-800 dark:from-purple-900/20 dark:to-pink-900/20"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200">Lengkapi Data untuk Sertifikat</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setShowCombinedForm(false);
                                        resetForm();
                                    }}
                                    className="text-purple-600 hover:text-purple-800"
                                >
                                    <X size={20} />
                                </Button>
                            </div>

                            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                {/* File Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="attendance_proof" className="text-sm font-medium">
                                        Upload Bukti Kehadiran *
                                    </Label>
                                    <Input
                                        id="attendance_proof"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-sm file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                    <p className="text-xs text-gray-500">Format: JPG, PNG, WEBP (Maks. 5MB)</p>
                                </div>

                                {selectedFile && (
                                    <div className="text-center">
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Preview"
                                            className="mx-auto max-h-32 rounded-lg border shadow-sm"
                                        />
                                        <p className="mt-2 text-sm text-gray-600">Preview bukti kehadiran</p>
                                    </div>
                                )}

                                {/* Rating */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Rating Webinar *</Label>
                                    <StarRating rating={rating} onRatingChange={setRating} />
                                    <p className="text-xs text-gray-500">Berikan rating 1-5 bintang</p>
                                </div>

                                {/* Review */}
                                <div className="space-y-2">
                                    <Label htmlFor="review" className="text-sm font-medium">
                                        Review Webinar *
                                    </Label>
                                    <textarea
                                        id="review"
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Bagikan pengalaman Anda mengikuti webinar ini..."
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        rows={4}
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500">Maksimal 500 karakter</p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowCombinedForm(false);
                                            resetForm();
                                        }}
                                        className="flex-1"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        onClick={handleSubmitForm}
                                        disabled={submittingForm || !selectedFile || !reviewText.trim() || rating === 0}
                                        className="flex-1"
                                    >
                                        {submittingForm ? 'Mengirim...' : 'Kirim Data'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </>
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
                                    <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                                        Terima kasih atas rating Anda!
                                    </h3>
                                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                        {!certificate ? 'Sertifikat belum dibuat untuk webinar ini.' : 'Sertifikat sedang diproses.'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Rating Anda:</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={`text-lg ${star <= (webinarItem.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            ({webinarItem.rating}/5)
                                        </span>
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
                                    <h3 className="mb-1 text-lg font-bold text-green-900 dark:text-green-100">
                                        🎉 Sertifikat Kelulusan Tersedia!
                                    </h3>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        Anda telah berhasil menyelesaikan webinar ini dan sertifikat sudah siap diunduh
                                    </p>
                                </div>
                            </div>

                            {certificateParticipant && (
                                <div className="mb-4 rounded-lg border border-green-200 bg-white/50 p-4 dark:border-green-800 dark:bg-green-950/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-800 dark:text-green-200">Nomor Sertifikat</p>
                                            <p className="font-mono text-lg font-bold text-green-900 dark:text-green-100">
                                                {certificateParticipant.certificate_code}
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
                                <Button
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    asChild
                                >
                                    <a href={route('profile.webinar.certificate', { webinar: webinarData.slug })} target="_blank">
                                        <Download className="mr-2 h-4 w-4" />
                                        Unduh Sertifikat
                                    </a>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-2 border-green-600 text-green-600 hover:bg-green-50"
                                    asChild
                                >
                                    <a
                                        href={route('profile.webinar.certificate.preview', { webinar: webinarData.slug })}
                                        target="_blank"
                                    >
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
            <Head title={webinarData.title} />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-foreground px-4 py-16">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/30 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-400/30 blur-3xl" />

                <div className="relative mx-auto max-w-7xl">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                        <Button className="mb-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20" asChild>
                            <Link href="/profile/my-webinars">
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
                            {new Date(webinarItem.created_at).toLocaleDateString('id-ID', {
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

                        {hasRecording && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                            >
                                <Youtube className="h-4 w-4" />
                                Recording Tersedia
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
                        {webinarData.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6 max-w-3xl text-lg text-justify text-black"
                    >
                        {webinarData.description}
                    </motion.p>

                    {webinarInvoiceStatus !== 'paid' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="border-2 border-red-500/20 bg-red-50/50 p-4 backdrop-blur-sm dark:bg-red-950/50">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                                        <span className="text-lg">⚠️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-red-900 dark:text-red-100">
                                            Status Pembayaran: {webinarInvoiceStatus}
                                        </p>
                                        <p className="text-sm text-red-700 dark:text-red-300">
                                            Selesaikan pembayaran untuk mengikuti webinar dan mendapatkan akses penuh.
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <Card className="p-6">
                            {renderCertificateSection()}

                            {isWebinarFinished ? (
                                <>
                                    {/* Hapus blok showCombinedForm yang lama di sini */}
                                    {/* Thank you message */}
                                    <div className="mb-8 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6 dark:border-green-800 dark:from-green-900/20 dark:to-blue-900/20">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Award className="text-green-600" size={24} />
                                            <h2 className="text-xl font-bold text-green-800 dark:text-green-200">Terima Kasih Telah Berpartisipasi!</h2>
                                        </div>
                                        <p className="mb-4 text-green-700 dark:text-green-300">
                                            Semoga ilmu yang didapat bermanfaat untuk pengembangan karir dan skill Anda. Jangan lupa terapkan ilmu yang
                                            telah dipelajari!
                                        </p>
                                        {isCompleted && (
                                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                                <CheckCircle size={16} />
                                                <span>
                                                    Selesai pada:{' '}
                                                    {new Date(webinarData.end_time).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {hasRecording ? (
                                        <div className="mb-8 rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-6 dark:border-red-800 dark:from-red-900/20 dark:to-pink-900/20">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="rounded-full bg-red-100 p-2 dark:bg-red-800">
                                                    <Youtube className="text-red-600 dark:text-red-400" size={20} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-red-800 dark:text-red-200">🎬 Recording Webinar</h2>
                                                    <p className="text-sm text-red-600 dark:text-red-400">Tonton ulang materi webinar</p>
                                                </div>
                                            </div>

                                            <div className="group relative">
                                                <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                                                    <iframe
                                                        className="h-full w-full"
                                                        src={getYoutubeEmbedUrl(webinarData.recording_url!)!}
                                                        title="Rekaman Webinar"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            </div>

                                            <p className="mt-4 text-sm text-red-700 dark:text-red-300">✨ Akses selamanya untuk materi webinar ini</p>
                                        </div>
                                    ) : (
                                        <div className="mb-8 rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-800">
                                                    <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">⏳ Recording Sedang Diproses</h2>
                                                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Harap tunggu beberapa saat</p>
                                                </div>
                                            </div>
                                            <div className="rounded-lg bg-yellow-100 p-4 dark:bg-yellow-800/50">
                                                <p className="text-center text-yellow-800 dark:text-yellow-200">
                                                    📹 Tim kami sedang memproses recording webinar. Anda akan mendapat notifikasi ketika sudah siap
                                                    ditonton.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Combined Form for attendance proof + review */}
                                    {!hasReview && webinarInvoiceStatus === 'paid' && showCombinedForm && (
                                        <div className="mb-8 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:border-purple-800 dark:from-purple-900/20 dark:to-pink-900/20">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200">Lengkapi Data untuk Sertifikat</h2>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowCombinedForm(false)}
                                                    className="text-purple-600 hover:text-purple-800"
                                                >
                                                    <X size={20} />
                                                </Button>
                                            </div>

                                            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                                {/* File Upload */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="attendance_proof" className="text-sm font-medium">
                                                        Upload Bukti Kehadiran *
                                                    </Label>
                                                    <Input
                                                        id="attendance_proof"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileSelect}
                                                        className="file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-sm file:text-gray-700 hover:file:bg-gray-200"
                                                    />
                                                    <p className="text-xs text-gray-500">Format: JPG, PNG, WEBP (Maks. 5MB)</p>
                                                </div>

                                                {selectedFile && (
                                                    <div className="text-center">
                                                        <img
                                                            src={URL.createObjectURL(selectedFile)}
                                                            alt="Preview"
                                                            className="mx-auto max-h-32 rounded-lg border shadow-sm"
                                                        />
                                                        <p className="mt-2 text-sm text-gray-600">Preview bukti kehadiran</p>
                                                    </div>
                                                )}

                                                {/* Rating */}
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        Rating Webinar *
                                                    </Label>
                                                    <StarRating rating={rating} onRatingChange={setRating} />
                                                    <p className="text-xs text-gray-500">Berikan rating 1-5 bintang</p>
                                                </div>

                                                {/* Review */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="review" className="text-sm font-medium">
                                                        Review Webinar *
                                                    </Label>
                                                    <textarea
                                                        id="review"
                                                        value={reviewText}
                                                        onChange={(e) => setReviewText(e.target.value)}
                                                        placeholder="Bagikan pengalaman Anda mengikuti webinar ini..."
                                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                        rows={4}
                                                        maxLength={500}
                                                    />
                                                    <p className="text-xs text-gray-500">Maksimal 500 karakter</p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setShowCombinedForm(false);
                                                            resetForm();
                                                        }}
                                                        className="flex-1"
                                                    >
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        onClick={handleSubmitForm}
                                                        disabled={submittingForm || !selectedFile || !reviewText.trim() || rating === 0}
                                                        className="flex-1"
                                                    >
                                                        {submittingForm ? 'Mengirim...' : 'Kirim Data'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Schedule */}
                                    <div className="mb-8">
                                        <h2 className="mb-4 text-2xl font-bold">Jadwal Webinar</h2>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                                                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-800">
                                                    <Calendar size={16} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                                                        {new Date(webinarData.start_time).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </h4>
                                                    <p className="text-sm text-blue-600 dark:text-blue-400">
                                                        {new Date(webinarData.start_time).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}{' '}
                                                        -{' '}
                                                        {new Date(webinarData.end_time).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}{' '}
                                                        WIB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Benefits */}
                            <div className="mb-8">
                                <h2 className="mb-4 text-2xl font-bold">Fasilitas Webinar</h2>
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
                        </Card>
                    </motion.div>

                    {/* Right Column - Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-4 space-y-4">
                            {/* Webinar Card */}
                            <Card className="overflow-hidden">
                                <div className="relative">
                                    <img
                                        src={thumbnailSrc}
                                        alt={webinarData.title}
                                        className="aspect-video w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-lg font-bold text-white drop-shadow-lg">{webinarData.title}</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Join WA Button - BELOW THUMBNAIL */}
                                    {webinarData.group_url && (
                                        <Button
                                            size="lg"
                                            className="mb-4 w-full"
                                            disabled={webinarInvoiceStatus !== 'paid'}
                                            onClick={() => window.open(webinarData.group_url ?? undefined, '_blank')}
                                        >
                                            <Users className="mr-2 h-5 w-5" />
                                            Gabung Grup WA
                                        </Button>
                                    )}

                                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{webinarData.short_description}</p>

                                    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status Pembayaran</span>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${webinarInvoiceStatus === 'paid'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}
                                            >
                                                {webinarInvoiceStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status Webinar</span>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${isCompleted
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                    }`}
                                            >
                                                {isCompleted ? 'Selesai' : 'Akan Datang'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sertifikat</span>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${hasCertificate
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                    }`}
                                            >
                                                {hasCertificate ? 'Tersedia' : 'Belum Tersedia'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Certificate Section */}
                            {isWebinarFinished && (
                                <Card className="p-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Award className="text-yellow-500" size={20} />
                                        <h3 className="font-semibold">Sertifikat Partisipasi</h3>
                                    </div>

                                    {isLoading && hasCertificate ? (
                                        <div className="space-y-3">
                                            <Skeleton className="h-[250px] w-full rounded-lg" />
                                            <div className="space-y-2">
                                                <Skeleton className="mx-auto h-3 w-3/4" />
                                                <Skeleton className="mx-auto h-3 w-1/2" />
                                            </div>
                                            <div className="space-y-2">
                                                <Skeleton className="mx-auto h-8 w-full" />
                                                <Skeleton className="mx-auto h-8 w-full" />
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="relative">
                                        {hasCertificate ? (
                                            <div className={`group ${isLoading ? 'absolute opacity-0' : 'relative opacity-100'}`}>
                                                <iframe
                                                    src={`${route('profile.webinar.certificate.preview', { webinar: webinarData.slug })}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                                    className="h-[238px] w-full rounded-lg border shadow-lg dark:border-zinc-700"
                                                    title="Preview Sertifikat"
                                                    onLoad={handleIframeLoad}
                                                />
                                                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                            </div>
                                        ) : (
                                            <div className="group relative">
                                                <img
                                                    src={'/assets/images/placeholder.png'}
                                                    alt="Sertifikat"
                                                    className="aspect-video rounded-lg border object-cover shadow-lg transition-transform group-hover:scale-105 dark:border-zinc-700"
                                                />
                                                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                            </div>
                                        )}
                                    </div>

                                    {hasCertificate ? (
                                        <div className={`${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                                            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                                Unduh sertifikat sebagai bukti keikutsertaan dalam webinar ini.
                                            </p>
                                            {certificateParticipant && (
                                                <div className="mt-2 text-center">
                                                    <p className="text-xs text-gray-500">Nomor Sertifikat:</p>
                                                    <Link
                                                        href={route('certificate.participant.detail', {
                                                            code: certificateParticipant.certificate_code,
                                                        })}
                                                        className="font-mono text-sm font-semibold text-blue-600 underline hover:text-blue-800"
                                                    >
                                                        {certificateParticipant.certificate_code}
                                                    </Link>
                                                </div>
                                            )}
                                            <div className="mt-3 space-y-2">
                                                <Button className="w-full" asChild>
                                                    <a href={route('profile.webinar.certificate', { webinar: webinarData.slug })} target="_blank">
                                                        <Download size={16} className="mr-2" />
                                                        Unduh Sertifikat
                                                    </a>
                                                </Button>
                                                <Button variant="outline" className="w-full" asChild>
                                                    <a
                                                        href={route('profile.webinar.certificate.preview', { webinar: webinarData.slug })}
                                                        target="_blank"
                                                    >
                                                        <Eye size={16} className="mr-2" />
                                                        Lihat Preview
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                                {!isCompleted
                                                    ? 'Sertifikat akan tersedia setelah webinar selesai dan syarat terpenuhi.'
                                                    : !isAttendanceVerified
                                                        ? 'Upload bukti kehadiran untuk mendapatkan sertifikat.'
                                                        : !hasReview
                                                            ? 'Berikan rating dan review untuk mendapatkan sertifikat.'
                                                            : 'Sertifikat sedang diproses.'}
                                            </p>
                                            <Button variant="outline" className="mt-3 w-full" disabled>
                                                <Download size={16} className="mr-2" />
                                                {!isCompleted
                                                    ? 'Webinar Belum Selesai'
                                                    : !isAttendanceVerified
                                                        ? 'Bukti Kehadiran Diperlukan'
                                                        : !hasReview
                                                            ? 'Review Diperlukan'
                                                            : 'Sertifikat Tidak Tersedia'}
                                            </Button>
                                        </>
                                    )}
                                </Card>
                            )}

                            {/* Review Section */}
                            {hasReview && (
                                <Card className="p-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <MessageSquare className="text-amber-500" size={20} />
                                        <h3 className="font-semibold">Review Anda</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`text-lg ${star <= (webinarItem.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold">({webinarItem.rating}/5)</span>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">"{webinarItem.review}"</p>
                                        </div>

                                        {webinarItem.attendance_proof && (
                                            <div className="text-center">
                                                <img
                                                    src={`/storage/${webinarItem.attendance_proof}`}
                                                    alt="Bukti Kehadiran"
                                                    className="mx-auto max-h-32 rounded-lg border shadow-sm"
                                                />
                                                <p className="mt-2 text-xs text-gray-500">Bukti Kehadiran</p>
                                            </div>
                                        )}
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