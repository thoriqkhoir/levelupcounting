import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { AlertCircle, Award, BadgeCheck, Check, Percent, Sparkles, TrendingUp, Users } from 'lucide-react';

interface PartnershipProduct {
    id: string;
    title: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    registration_deadline: string;
    registration_url: string;
    thumbnail?: string | null;
    schedule_days: string[];
    duration_days: number;
    type: 'regular' | 'scholarship';
}

export default function RegisterSection({ partnershipProduct }: { partnershipProduct: PartnershipProduct }) {
    const deadline = new Date(partnershipProduct.registration_deadline);
    const isRegistrationOpen = new Date() < deadline;
    const canRegister = isRegistrationOpen;

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleRegister = () => {
        if (partnershipProduct.type === 'scholarship') {
            window.location.href = route('partnership-products.scholarship-apply', partnershipProduct.slug);
        } else {
            window.open(route('partnership-products.track-click', partnershipProduct.id), '_blank');
        }
    };

    let buttonText: string;
    let warningMessage: string | null = null;

    if (!isRegistrationOpen) {
        buttonText = 'Pendaftaran Ditutup';
        warningMessage = 'Pendaftaran sudah ditutup!';
    } else {
        buttonText = 'Daftar Sekarang';
        warningMessage = null;
    }

    const discount =
        partnershipProduct.strikethrough_price > 0
            ? Math.round(((partnershipProduct.strikethrough_price - partnershipProduct.price) / partnershipProduct.strikethrough_price) * 100)
            : 0;

    return (
        <section className="relative mx-auto mt-16 w-full max-w-6xl overflow-hidden px-4 pb-16" id="register">
            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <Sparkles className="text-primary h-6 w-6" />
                        <span className="bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-semibold">Penawaran Terbatas</span>
                    </div>
                    <h2 className="dark:text-primary-foreground mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
                        Tingkatkan Kompetensi Profesional Anda!
                    </h2>
                    <p className="text-md text-gray-600 dark:text-gray-400">Dapatkan sertifikat profesional yang diakui industri</p>
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
                        <div className="border-primary/30 dark:border-primary/50 overflow-hidden rounded-2xl border-2 bg-white shadow-lg dark:bg-zinc-900">
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
                                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Investasi untuk Masa Depanmu</p>
                                    {partnershipProduct.price > 0 ? (
                                        <>
                                            {partnershipProduct.strikethrough_price > 0 && (
                                                <span className="block text-xl text-red-500 line-through">
                                                    {formatRupiah(partnershipProduct.strikethrough_price)}
                                                </span>
                                            )}
                                            <span className="text-primary block text-4xl font-extrabold">
                                                {formatRupiah(partnershipProduct.price)}
                                            </span>
                                            <span className="bg-primary/10 text-primary mt-2 inline-block rounded-full px-4 py-1 text-sm font-medium">
                                                Sertifikasi Profesional
                                            </span>
                                        </>
                                    ) : (
                                        <span className="block text-5xl font-extrabold text-green-600">GRATIS</span>
                                    )}
                                </div>

                                <Separator className="my-6" />

                                {/* Quick Info */}
                                <div className="mb-6 space-y-3">
                                    {partnershipProduct.schedule_days && partnershipProduct.schedule_days.length > 0 && (
                                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-zinc-800">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Hari Belajar</span>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {partnershipProduct.schedule_days.length} Hari/Minggu
                                            </span>
                                        </div>
                                    )}
                                    {partnershipProduct.duration_days > 0 && (
                                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-zinc-800">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Durasi</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{partnershipProduct.duration_days} Hari</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-zinc-800">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Deadline</span>
                                        <span className="font-bold text-red-600">{format(deadline, 'dd MMM yyyy', { locale: id })}</span>
                                    </div>
                                </div>

                                {/* Warning Message */}
                                {warningMessage && (
                                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <span>{warningMessage}</span>
                                    </div>
                                )}

                                {/* CTA Button */}
                                <Button
                                    className="text-md w-full py-4 font-bold shadow-lg"
                                    size="lg"
                                    onClick={handleRegister}
                                    disabled={!canRegister}
                                >
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    {buttonText}
                                </Button>
                                <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                                    Anda akan diarahkan ke halaman pendaftaran partner
                                </p>

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

                        {/* Money Back Guarantee */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-4 text-center"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400">🔒 Pembayaran aman & terpercaya</p>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Thumbnail & Benefits */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Thumbnail Card */}
                        <div className="overflow-hidden rounded-2xl border-2 shadow-xl dark:border-zinc-700">
                            <img
                                src={partnershipProduct.thumbnail ? `/storage/${partnershipProduct.thumbnail}` : '/assets/images/placeholder.png'}
                                alt={partnershipProduct.title}
                                className="aspect-video w-full object-cover"
                            />
                        </div>

                        {/* Benefits List */}
                        <div className="rounded-2xl border-2 p-6 shadow-lg dark:border-zinc-700">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                                <Check className="h-6 w-6 text-green-600" />
                                Yang Akan Kamu Dapatkan
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { icon: Award, text: 'Sertifikat Resmi dari Partner Industri', color: 'text-blue-600' },
                                    { icon: TrendingUp, text: 'Materi Relevan dengan Kebutuhan Industri', color: 'text-purple-600' },
                                    { icon: BadgeCheck, text: 'Meningkatkan Kredibilitas Profesional', color: 'text-green-600' },
                                    { icon: Users, text: 'Kesempatan Networking dengan Profesional', color: 'text-orange-600' },
                                    { icon: Sparkles, text: 'Pengakuan Kompetensi Nasional', color: 'text-pink-600' },
                                ].map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                        className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-zinc-800"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-700">
                                            <item.icon className={`h-5 w-5 ${item.color}`} />
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{item.text}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
