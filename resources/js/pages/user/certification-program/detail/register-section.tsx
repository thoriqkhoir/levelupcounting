import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertCircle, BadgeCheck, CalendarDays, Clock, GraduationCap, Percent, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Mentor {
    id: string;
    name: string;
}

interface Schedule {
    id: string;
    schedule_date?: string;
    start_date?: string;
    day?: string;
    start_time?: string;
    end_time?: string;
}

interface CertificationProgram {
    id: string;
    title: string;
    slug: string;
    type: 'regular' | 'scholarship';
    price: number;
    scholarship_price?: number;
    strikethrough_price?: number;
    registration_deadline?: string;
    socialization_registration_deadline?: string;
    thumbnail?: string | null;
    mentors: Mentor[];
    schedules: Schedule[];
    document_required?: boolean;
    document_description?: string | null;
    batch?: string | null;
}

interface RegisterSectionProps {
    program: CertificationProgram;
    isEnrolled: boolean;
    scholarshipApplication?: { status: string } | null;
}

export default function RegisterSection({ program, isEnrolled, scholarshipApplication }: RegisterSectionProps) {
    const { auth } = usePage<SharedData>().props;

    // Regular program deadline
    const regularDeadline = program.registration_deadline ? new Date(program.registration_deadline) : null;
    const isRegularRegistrationOpen = regularDeadline ? new Date() < regularDeadline : true;

    // Check if scholarship is approved (only matters for scholarship programs)
    const isScholarshipApproved = program.type === 'scholarship' ? scholarshipApplication?.status === 'approved' : true;
    const canRegisterRegular = isRegularRegistrationOpen && !isEnrolled && isScholarshipApproved;

    // Scholarship program deadline
    const scholarshipDeadline = program.socialization_registration_deadline ? new Date(program.socialization_registration_deadline) : null;
    const isScholarshipRegistrationOpen = scholarshipDeadline ? new Date() < scholarshipDeadline : true;
    const canRegisterScholarship = isScholarshipRegistrationOpen && !isEnrolled;

    const displayPrice = program.type === 'scholarship' ? (program.scholarship_price ?? program.price) : program.price;

    const discount = program.strikethrough_price && program.strikethrough_price > 0 && displayPrice > 0
        ? Math.round(((program.strikethrough_price - displayPrice) / program.strikethrough_price) * 100)
        : 0;

    const getDate = (s: Schedule) => s.schedule_date || s.start_date || '';
    const firstSchedule = program.schedules.length > 0 ? getDate(program.schedules[0]) : null;
    const lastSchedule = program.schedules.length > 0 ? getDate(program.schedules[program.schedules.length - 1]) : null;

    let warningMessage: string | null = null;
    if (program.document_required) {
        warningMessage = program.document_description ?? 'Peserta wajib mengunggah dokumen pendukung sebelum pendaftaran diproses.';
    }

    return (
        <section className="relative mx-auto mt-16 w-full max-w-7xl overflow-hidden px-4 pb-16" id="register">
            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                            Penawaran Terbatas
                        </span>
                    </div>
                    <h2 className="dark:text-primary-foreground mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
                        Mulai Perjalanan Belajarmu Sekarang!
                    </h2>
                    <p className="text-md text-gray-600 dark:text-gray-400">
                        Investasi terbaik untuk masa depan karirmu
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Left Column - Pricing Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:sticky lg:top-24 lg:self-start"
                    >
                        <div className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-white shadow-lg dark:bg-zinc-900 dark:border-primary/50">
                            {/* Discount Badge */}
                            {discount > 0 && (
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2 text-white">
                                        <Percent className="h-5 w-5" />
                                        <span className="text-lg font-bold">Hemat {discount}% - Promo Terbatas!</span>
                                    </div>
                                </div>
                            )}

                            <div className="p-8">
                                {/* Price */}
                                <div className="mb-6 text-center">
                                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                        Investasi untuk Masa Depanmu
                                    </p>
                                    {displayPrice > 0 ? (
                                        <>
                                            {program.strikethrough_price && program.strikethrough_price > 0 && (
                                                <span className="block text-xl text-red-500 line-through">
                                                    Rp {program.strikethrough_price.toLocaleString('id-ID')}
                                                </span>
                                            )}
                                            <span className="block text-4xl font-extrabold text-primary">
                                                Rp {displayPrice.toLocaleString('id-ID')}
                                            </span>
                                            {program.type === 'scholarship' && program.scholarship_price !== undefined && program.scholarship_price > 0 && (
                                                <span className="mt-2 inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                    Harga Beasiswa
                                                </span>
                                            )}
                                            {!program.scholarship_price && (
                                                <span className="mt-2 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                                                    Bayar Sekali, Akses Selamanya
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="block text-5xl font-extrabold text-green-600">
                                            GRATIS
                                        </span>
                                    )}
                                </div>

                                <Separator className="my-6" />

                                {/* Quick Info */}
                                <div className="mb-6 space-y-3">
                                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-zinc-800">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Lokasi</span>
                                        <span className="font-bold text-gray-900 dark:text-white">Online</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-zinc-800">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Batch</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{program.batch || '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-zinc-800">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Sesi</span>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {program.schedules.length} Pertemuan
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-zinc-800">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Tipe Program</span>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {program.type === 'scholarship' ? 'Beasiswa' : 'Reguler'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 rounded-lg bg-gray-50 p-3 dark:bg-zinc-800">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Deadline</span>
                                            <span className="font-bold text-red-600">
                                                {program.type === 'scholarship' && scholarshipDeadline 
                                                    ? format(scholarshipDeadline, 'dd MMM yyyy', { locale: id })
                                                    : regularDeadline 
                                                        ? format(regularDeadline, 'dd MMM yyyy', { locale: id })
                                                        : 'Tidak Ada Batas'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Warning Message */}
                                {warningMessage && (
                                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <span>{warningMessage}</span>
                                    </div>
                                )}

                                {/* CTA Button */}
                                <div className="space-y-3">
                                    {isEnrolled && (
                                        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center dark:border-green-800 dark:bg-green-900/20">
                                            <p className="text-sm font-medium text-green-600 dark:text-green-400">✓ Anda sudah terdaftar di program ini</p>
                                        </div>
                                    )}

                                    {auth ? (
                                        <>
                                            {!isEnrolled && program.type === 'scholarship' && !isScholarshipApproved ? null : (
                                                <Button asChild className="w-full py-4 text-md font-bold shadow-lg" size="lg" disabled={!canRegisterRegular}>
                                                    <Link href={route('certification-programs.register', program.slug)}>
                                                        {isEnrolled
                                                            ? '✓ Sudah Terdaftar'
                                                            : canRegisterRegular
                                                            ? 'Daftar Program Reguler'
                                                            : 'Pendaftaran Reguler Ditutup'}
                                                    </Link>
                                                </Button>
                                            )}
                                            {program.type === 'scholarship' && (
                                                <Button
                                                    asChild
                                                    size="lg"
                                                    variant="outline"
                                                    disabled={!canRegisterScholarship}
                                                    className={`w-full py-4 text-md font-bold ${!canRegisterScholarship ? 'cursor-not-allowed opacity-50' : ''}`}
                                                >
                                                    <Link href={canRegisterScholarship ? route('certification-programs.scholarship-apply', program.slug) : '#'}>
                                                        <GraduationCap className="mr-2 h-5 w-5" />
                                                        {canRegisterScholarship ? 'Ajukan Beasiswa' : 'Pendaftaran Beasiswa Ditutup'}
                                                    </Link>
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <Button asChild className="w-full py-4 text-md font-bold shadow-lg" size="lg">
                                            <Link href={route('certification-programs.register', program.slug)}>
                                                <Sparkles className="mr-2 h-5 w-5" />
                                                Daftar Sekarang
                                            </Link>
                                        </Button>
                                    )}
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <BadgeCheck className="h-4 w-4 text-green-600" />
                                        <span>Terpercaya</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <BadgeCheck className="h-4 w-4 text-green-600" />
                                        <span>Aman</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <BadgeCheck className="h-4 w-4 text-green-600" />
                                        <span>Berkualitas</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secure Guarantee */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-4 text-center"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                🔒 Pembayaran aman & terpercaya
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Thumbnail & Schedule */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Thumbnail Card */}
                        <div className="overflow-hidden rounded-2xl border-2 shadow-xl dark:border-zinc-700">
                            <img
                                src={program.thumbnail ? `/storage/${program.thumbnail}` : '/assets/images/placeholder.png'}
                                alt={program.title}
                                className="aspect-video w-full object-cover"
                            />
                        </div>

                        {/* Jadwal List */}
                        <div className="rounded-2xl border-2 p-6 shadow-lg dark:border-zinc-700">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                                <CalendarDays className="h-6 w-6 text-primary" />
                                Jadwal Pelaksanaan
                            </h3>
                            
                            {/* Date Range */}
                            <div className="mb-4 rounded-lg bg-primary/5 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Periode Program</p>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {firstSchedule && lastSchedule ? (
                                        <>
                                            {format(new Date(firstSchedule), 'dd MMMM yyyy', { locale: id })}
                                            {' - '}
                                            {format(new Date(lastSchedule), 'dd MMMM yyyy', { locale: id })}
                                        </>
                                    ) : (
                                        'Jadwal belum tersedia'
                                    )}
                                </p>
                            </div>

                            {/* Schedule Details */}
                            <ul className="space-y-3">
                                {program.schedules && program.schedules.length > 0 ? (
                                    program.schedules.map((schedule, index) => {
                                        const scheduleDate = getDate(schedule);
                                        return (
                                            <motion.li
                                                key={schedule.id || index}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                                className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-zinc-800"
                                            >
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-700">
                                                    <Clock className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                                        {schedule.day || (scheduleDate ? format(new Date(scheduleDate), 'EEEE', { locale: id }) : `Sesi ${index + 1}`)}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {scheduleDate ? format(new Date(scheduleDate), 'dd MMM yyyy', { locale: id }) : '-'}
                                                    </p>
                                                    {(schedule.start_time || schedule.end_time) && (
                                                        <p className="text-sm font-medium text-primary">
                                                            {schedule.start_time ? schedule.start_time.slice(0, 5) : '--:--'} - {schedule.end_time ? schedule.end_time.slice(0, 5) : '--:--'} WIB
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.li>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-500 dark:text-gray-400">
                                        <Clock className="h-12 w-12 opacity-50" />
                                        <p className="text-sm">Jadwal akan segera diumumkan</p>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
