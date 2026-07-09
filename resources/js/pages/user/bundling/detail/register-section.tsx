import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { rupiahFormatter } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertTriangle, Calendar, Check, Package, Sparkles, BadgeCheck, InfinityIcon, Percent, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Bundle {
    id: string;
    title: string;
    slug: string;
    price: number;
    thumbnail?: string | null;
    registration_deadline?: string | null;
    registration_url: string;
    batch?: string | null;
    bundle_items_count: number;
}

interface OwnedItem {
    id: string;
    title: string;
    type: string;
}

interface RegisterSectionProps {
    bundle: Bundle;
    totalOriginalPrice: number;
    discountAmount: number;
    discountPercentage: number;
    hasOwnedItems: boolean;
    ownedItems: OwnedItem[];
}

export default function RegisterSection({
    bundle,
    totalOriginalPrice,
    discountAmount,
    discountPercentage,
    hasOwnedItems,
    ownedItems,
}: RegisterSectionProps) {
    const { auth } = usePage<SharedData>().props;

    const deadline = bundle.registration_deadline ? new Date(bundle.registration_deadline) : null;

    const isLoggedIn = !!auth.user;
    const isProfileComplete = isLoggedIn && auth.user?.phone_number;

    let registrationUrl: string;
    let buttonText: string;
    let warningMessage: string | null = null;
    let isDisabled = false;

    registrationUrl = bundle.registration_url;
    buttonText = 'Daftar Sekarang';
    warningMessage = null;

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
                    <p className="text-md text-gray-600 dark:text-gray-400">Investasi terbaik untuk masa depan karirmu</p>
                </motion.div>

                {/* Warning if user already owns items */}
                {hasOwnedItems && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-8"
                    >
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                <p className="mb-2 font-semibold">Anda sudah memiliki produk berikut dalam bundle ini:</p>
                                <ul className="ml-4 list-disc space-y-1">
                                    {ownedItems.map((item) => (
                                        <li key={item.id}>
                                            <span className="font-medium">{item.type}:</span> {item.title}
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-2 text-sm">Untuk menghindari duplikasi, Anda tidak dapat membeli bundle ini.</p>
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Left Column - Pricing Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:sticky lg:top-24 lg:self-start"
                    >
                        <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                            {/* Discount Badge */}
                            {discountPercentage > 0 && (
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2 text-white">
                                        <Percent className="h-5 w-5" />
                                        <span className="text-lg font-bold">Hemat {discountPercentage}% - Promo Terbatas!</span>
                                    </div>
                                </div>
                            )}

                            <div className="p-8">
                                {/* Price */}
                                <div className="mb-6 text-center">
                                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Investasi untuk Masa Depanmu</p>
                                    {bundle.price > 0 ? (
                                        <>
                                            {totalOriginalPrice > 0 && (
                                                <span className="block text-xl text-red-500 line-through">
                                                    {rupiahFormatter.format(totalOriginalPrice)}
                                                </span>
                                            )}
                                            <span className="block text-4xl font-extrabold text-primary">
                                                {rupiahFormatter.format(bundle.price)}
                                            </span>
                                            <span className="mt-2 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                                                Bayar Sekali, Akses Selamanya
                                            </span>
                                        </>
                                    ) : (
                                        <span className="block text-5xl font-extrabold text-green-600">GRATIS</span>
                                    )}
                                </div>

                                <Separator className="my-6" />

                                {/* Quick Info */}
                                <div className="mb-6 space-y-3">
                                    {bundle.batch && (
                                        <div className="flex items-center justify-between rounded-lg bg-gray-50/50 p-3 dark:bg-zinc-800/50 backdrop-blur-sm">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Batch</span>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {bundle.batch.toLowerCase().includes('batch') ? bundle.batch : `Batch ${bundle.batch}`}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between rounded-lg bg-gray-50/50 p-3 dark:bg-zinc-800/50 backdrop-blur-sm">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Program</span>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {bundle.bundle_items_count} Program
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-gray-50/50 p-3 dark:bg-zinc-800/50 backdrop-blur-sm">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Hemat</span>
                                        <span className="font-bold text-green-600">
                                            {rupiahFormatter.format(discountAmount)}
                                        </span>
                                    </div>
                                    {deadline && (
                                        <div className="flex items-center justify-between rounded-lg bg-gray-50/50 p-3 dark:bg-zinc-800/50 backdrop-blur-sm">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Deadline</span>
                                            <span className="font-bold text-red-600">
                                                {format(deadline, 'dd MMM yyyy', { locale: id })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Warning Message */}
                                {warningMessage && (
                                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <span>{warningMessage}</span>
                                    </div>
                                )}

                                {/* CTA Button */}
                                <Button className="w-full py-4 text-md font-bold shadow-lg" size="lg" asChild={!isDisabled} disabled={isDisabled}>
                                    {isDisabled ? (
                                        <span>{buttonText}</span>
                                    ) : (
                                        <Link href={registrationUrl}>
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            {buttonText}
                                        </Link>
                                    )}
                                </Button>

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
                        <div className="overflow-hidden rounded-2xl border border-white/40 shadow-xl dark:border-zinc-800/50">
                            <img
                                src={bundle.thumbnail ? `/storage/${bundle.thumbnail}` : '/assets/images/placeholder.png'}
                                alt={bundle.title}
                                className="aspect-video w-full object-cover"
                            />
                        </div>

                        {/* Benefits List */}
                        <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                                <Check className="h-6 w-6 text-green-600" />
                                Yang Akan Kamu Dapatkan
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    {
                                        icon: Package,
                                        text: `${bundle.bundle_items_count} Program Pembelajaran`,
                                        color: 'text-blue-600',
                                    },
                                    {
                                        icon: InfinityIcon,
                                        text: 'Akses Selamanya',
                                        color: 'text-purple-600',
                                    },
                                    {
                                        icon: BadgeCheck,
                                        text: 'Sertifikat untuk Semua Program',
                                        color: 'text-green-600',
                                    },
                                    {
                                        icon: Sparkles,
                                        text: 'Hemat ' + discountPercentage + '% dari Harga Normal',
                                        color: 'text-orange-600',
                                    },
                                    {
                                        icon: BadgeCheck,
                                        text: 'Materi Selalu Update',
                                        color: 'text-pink-600',
                                    },
                                ].map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                        className="flex items-center gap-3 rounded-lg bg-white/40 p-3 shadow-sm backdrop-blur-sm dark:bg-zinc-800/40"
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