import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserLayout from '@/layouts/user-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BadgeCheck, Check, Clock, CreditCard, Gift, Hourglass, Lock, Play, Shield, Star, Tag, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    key_points?: string | null;
    level: 'beginner' | 'intermediate' | 'advanced';
    modules?: {
        title: string;
        description?: string | null;
        lessons?: {
            title: string;
            description?: string | null;
            type: 'text' | 'video' | 'file' | 'quiz';
            attachment?: string | null;
            video_url?: string | null;
            is_free?: boolean;
        }[];
    }[];
}

interface DiscountData {
    valid: boolean;
    discount_amount: number;
    final_amount: number;
    discount_code: {
        id: string;
        code: string;
        name: string;
        type: string;
        formatted_value: string;
    };
    message?: string;
}

interface ReferralInfo {
    code?: string;
    hasActive: boolean;
}

interface PaymentInstruction {
    title: string;
    steps: string[];
}

interface TransactionDetail {
    reference: string;
    payment_name: string;
    pay_code: string;
    instructions: PaymentInstruction[];
    status: string;
    paid_at?: string | null;
}

interface PendingInvoice {
    id: string;
    invoice_code: string;
    status: string;
    amount: number;
    payment_method: string;
    // payment_channel: string;
    va_number?: string;
    qr_code_url?: string;
    bank_name?: string;
    created_at: string;
    expires_at: string;
}

// interface PaymentChannel {
//     active: boolean;
//     code: string;
//     fee_customer: {
//         flat: number;
//         percent: number;
//     };
//     fee_merchant: {
//         flat: number;
//         percent: number;
//     };
//     group: string;
//     icon_url: string;
//     maximum_amount: number;
//     maximum_fee: number | null;
//     minimum_amount: number;
//     minimum_fee: number | null;
//     name: string;
//     total_fee: {
//         flat: number;
//         percent: string;
//     };
//     type: string;
// }

interface InvoiceData {
    type: string;
    id: string;
    discount_amount: number;
    nett_amount: number;
    total_amount: number;
    // payment_channel?: string;
    discount_code_id?: string;
    discount_code_amount?: number;
}

function getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
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
    advanced: 'bg-primary-foreground text-black border-primary-500/20 dark:text-red-400',
};

const levelLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

export default function CheckoutCourse({
    course,
    hasAccess,
    pendingInvoice,
    transactionDetail,
    // channels,
    referralInfo,
}: {
    course: Course;
    hasAccess: boolean;
    pendingInvoice?: PendingInvoice | null;
    transactionDetail?: TransactionDetail | null;
    // channels: PaymentChannel[];
    referralInfo: ReferralInfo;
}) {
    const { auth } = usePage<SharedData>().props;
    const isLoggedIn = !!auth.user;
    const isProfileComplete = isLoggedIn && auth.user?.phone_number;

    const firstVideoLesson = course.modules?.flatMap((module) => module.lessons || []).find((lesson) => lesson.type === 'video' && lesson.video_url);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [discountData, setDiscountData] = useState<DiscountData | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState('');

    const keyPointList = parseList(course.key_points);

    const totalModules = course.modules?.length || 0;
    const totalLessons = course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;
    // const [selectedChannel, setSelectedChannel] = useState<PaymentChannel | null>(channels.length > 0 ? channels[0] : null);

    const isFree = course.price === 0;

    const basePrice = course.price;
    const discountAmount = discountData?.discount_amount || 0;
    const finalCoursePrice = basePrice - discountAmount;

    // const calculateAdminFee = (channel: PaymentChannel | null): number => {
    //     if (!channel || isFree) return 0;
    //     const flatFee = channel.fee_customer.flat || 0;
    //     const percentFee = Math.round(finalCoursePrice * ((channel.fee_customer.percent || 0) / 100));
    //     return flatFee + percentFee;
    // };

    const adminFee = isFree ? 0 : 5000; //calculateAdminFee(selectedChannel);
    const totalPrice = isFree ? 0 : finalCoursePrice + adminFee;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref');

        if (refFromUrl) {
            sessionStorage.setItem('referral_code', refFromUrl);
        } else if (referralInfo.code) {
            sessionStorage.setItem('referral_code', referralInfo.code);
        }
    }, [referralInfo]);

    useEffect(() => {
        if (!promoCode.trim() || isFree) {
            setDiscountData(null);
            setPromoError('');
            return;
        }

        const timer = setTimeout(() => {
            validatePromoCode();
        }, 500);

        return () => clearTimeout(timer);
    }, [promoCode]);

    const validatePromoCode = async () => {
        if (!promoCode.trim() || isFree) return;

        setPromoLoading(true);
        setPromoError('');

        try {
            const response = await fetch('/api/discount-codes/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    code: promoCode,
                    amount: course.price,
                    product_type: 'course',
                    product_id: course.id,
                }),
            });

            const data = await response.json();

            if (data.valid) {
                setDiscountData(data);
                setPromoError('');
            } else {
                setDiscountData(null);
                setPromoError(data.message || 'Kode promo tidak valid');
            }
        } catch {
            setDiscountData(null);
            setPromoError('Terjadi kesalahan saat memvalidasi kode promo');
        } finally {
            setPromoLoading(false);
        }
    };

    const refreshCSRFToken = async (): Promise<string> => {
        try {
            const response = await fetch('/csrf-token', {
                method: 'GET',
                credentials: 'same-origin',
            });
            const data = await response.json();

            const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
            if (metaTag) {
                metaTag.content = data.token;
            }

            return data.token;
        } catch (error) {
            console.error('Failed to refresh CSRF token:', error);
            throw error;
        }
    };

    const handleFreeCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isProfileComplete) {
            alert('Profil Anda belum lengkap! Harap lengkapi nomor telepon terlebih dahulu.');
            window.location.href = route('profile.edit');
            return;
        }

        setLoading(true);

        router.post(
            route('enroll.free'),
            {
                type: 'course',
                id: course.id,
            },
            {
                onError: (errors) => {
                    console.log('Free enrollment errors:', errors);
                    alert(errors.message || 'Gagal mendaftar kelas gratis.');
                },
                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isProfileComplete) {
            alert('Profil Anda belum lengkap! Harap lengkapi nomor telepon terlebih dahulu.');
            window.location.href = route('profile.edit');
            return;
        }

        if (!termsAccepted && !isFree) {
            alert('Anda harus menyetujui syarat dan ketentuan!');
            return;
        }

        setLoading(true);

        if (isFree) {
            return handleFreeCheckout(e);
        }

        const submitPayment = async (retryCount = 0): Promise<void> => {
            const originalDiscountAmount = course.strikethrough_price > 0 ? course.strikethrough_price - course.price : 0;
            const promoDiscountAmount = discountData?.discount_amount || 0;

            const invoiceData: InvoiceData = {
                type: 'course',
                id: course.id,
                discount_amount: originalDiscountAmount + promoDiscountAmount,
                nett_amount: finalCoursePrice,
                total_amount: totalPrice,
                // payment_channel: selectedChannel?.code,
            };

            if (discountData?.valid) {
                invoiceData.discount_code_id = discountData.discount_code.id;
                invoiceData.discount_code_amount = discountData.discount_amount;
            }

            try {
                const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

                const res = await fetch(route('invoice.store'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken || '',
                        Accept: 'application/json',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(invoiceData),
                });

                if (res.status === 419 && retryCount < 2) {
                    console.log(`CSRF token expired, refreshing... (attempt ${retryCount + 1})`);
                    await refreshCSRFToken();
                    return submitPayment(retryCount + 1);
                }

                const data = await res.json();

                if (res.ok && data.success) {
                    if (data.payment_url) {
                        window.location.href = data.payment_url;
                    } else {
                        throw new Error('Payment URL not received');
                    }
                } else {
                    throw new Error(data.message || 'Gagal membuat invoice.');
                }
            } catch (error) {
                console.error('Payment error:', error);
                throw error;
            }
        };

        try {
            await submitPayment();
        } catch (error: any) {
            alert(error.message || 'Terjadi kesalahan saat proses pembayaran.');
            setLoading(false);
        }
    };

    // const getPaymentChannelName = (code: string): string => {
    //     const channel = channels.find((c) => c.code === code);
    //     return channel?.name || code;
    // };

    // const getPaymentGroupIcon = (channelCode: string): string => {
    //     const channel = channels.find((c) => c.code === channelCode);
    //     return channel?.icon_url || '';
    // };

    const formatExpiryTime = (expiresAt: string): { time: string; status: 'expired' | 'urgent' | 'normal' } => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = expiry.getTime() - now.getTime();

        if (diff <= 0) {
            return { time: 'Sudah kadaluarsa', status: 'expired' };
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours < 1) {
            return { time: `${minutes} menit lagi`, status: 'urgent' };
        }

        return { time: `${hours} jam ${minutes} menit lagi`, status: hours < 3 ? 'urgent' : 'normal' };
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Berhasil menyalin ke clipboard!');
        });
    };

    if (!isLoggedIn) {
        const currentUrl = window.location.href;
        const loginUrl = route('login', { redirect: currentUrl });

        return (
            <div className="relative min-h-screen bg-background">
                {/* Global Decorative Background — Blobs */}
                <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
                <div className="pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-0 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-0 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
                {/* Global Decorative Background — Grid Pattern */}
                <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230000ff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                
                <UserLayout>
                    <Head title="Login Required" />

                    <section className="relative mx-auto mt-12 w-full max-w-4xl px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-blue-600/90 via-blue-700/90 to-purple-700/90 p-12 text-center shadow-2xl backdrop-blur-xl">
                            <div className="bg-grid-white/[0.05] absolute inset-0 bg-[size:20px_20px]" />
                            <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/30 blur-3xl" />
                            <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-400/30 blur-3xl" />

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
                                >
                                    <Lock className="h-4 w-4 text-white" />
                                    <span className="text-sm font-medium text-white">Login Diperlukan</span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
                                >
                                    {course.title}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg text-blue-100"
                                >
                                    Silakan login terlebih dahulu untuk melanjutkan pendaftaran
                                </motion.p>
                            </div>
                        </motion.div>
                    </section>

                    <section className="mx-auto my-8 w-full max-w-2xl px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="overflow-hidden border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 dark:from-blue-950/20 dark:to-purple-950/20">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                                    <User className="h-10 w-10 text-white" />
                                </div>

                                <h2 className="mb-3 text-center text-2xl font-bold">Login untuk Melanjutkan</h2>
                                <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
                                    Anda perlu login untuk mendaftar kelas ini.
                                    {referralInfo.hasActive && ' Kode referral Anda akan tetap tersimpan.'}
                                </p>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <a href={loginUrl}>
                                            <User className="mr-2 h-4 w-4" />
                                            Login Sekarang
                                        </a>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="flex-1 border-2">
                                        <Link href={route('register', referralInfo.code ? { ref: referralInfo.code } : {})}>Buat Akun Baru</Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </section>
            </UserLayout>
            </div>
        );
    }

    if (!isProfileComplete) {
        return (
            <div className="relative min-h-screen bg-background">
                {/* Global Decorative Background — Blobs */}
                <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
                <div className="pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-0 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-0 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
                {/* Global Decorative Background — Grid Pattern */}
                <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230000ff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                
                <UserLayout>
                    <Head title="Lengkapi Profil" />

                    <section className="relative mx-auto mt-12 w-full max-w-4xl px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-orange-600/90 via-orange-700/90 to-red-700/90 p-12 text-center shadow-2xl backdrop-blur-xl">
                            <div className="bg-grid-white/[0.05] absolute inset-0 bg-[size:20px_20px]" />
                            <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/30 blur-3xl" />
                            <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-red-400/30 blur-3xl" />

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
                                >
                                    <User className="h-4 w-4 text-white" />
                                    <span className="text-sm font-medium text-white">Profil Belum Lengkap</span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
                                >
                                    {course.title}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg text-orange-100"
                                >
                                    Lengkapi profil Anda terlebih dahulu untuk melanjutkan
                                </motion.p>
                            </div>
                        </motion.div>
                    </section>

                    <section className="mx-auto my-8 w-full max-w-2xl px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="overflow-hidden border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 dark:from-orange-950/20 dark:to-red-950/20">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                                    <User className="h-10 w-10 text-white" />
                                </div>

                                <h2 className="mb-3 text-center text-2xl font-bold">Lengkapi Profil Anda</h2>
                                <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
                                    Kami memerlukan nomor telepon Anda untuk melanjutkan pendaftaran kelas ini.
                                </p>

                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                                >
                                    <Link href={route('profile.edit', { redirect: window.location.href })}>
                                        <User className="mr-2 h-4 w-4" />
                                        Lengkapi Profil Sekarang
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </section>
            </UserLayout>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-background">
            {/* Global Decorative Background — Blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            {/* Global Decorative Background — Grid Pattern */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230000ff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />
            
        <UserLayout>
            <Head title={`Checkout - ${course.title}`} />

            {/* Hero Section */}
            <section className="relative mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60 sm:p-12">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
                    <div className="relative z-10">
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium backdrop-blur-sm ${levelColors[course.level]}`}
                            >
                                <Star className="h-3.5 w-3.5" />
                                {levelLabels[course.level]}
                            </motion.div>

                            {isFree && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 backdrop-blur-sm"
                                >
                                    <Gift className="h-3.5 w-3.5" />
                                    Gratis
                                </motion.div>
                            )}

                            {course.strikethrough_price > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 backdrop-blur-sm"
                                >
                                    <Tag className="h-3.5 w-3.5" />
                                    Diskon {Math.round(((course.strikethrough_price - course.price) / course.strikethrough_price) * 100)}%
                                </motion.div>
                            )}
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl"
                        >
                            {course.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-6 max-w-3xl text-justify text-lg leading-relaxed text-zinc-700 dark:text-zinc-300"
                        >
                            {course.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap gap-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary backdrop-blur-sm">
                                    <Play className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Modul</p>
                                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{totalModules} Modul</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary backdrop-blur-sm">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Pelajaran</p>
                                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{totalLessons} Pelajaran</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Main Content */}
            <section className="mx-auto my-8 w-full max-w-7xl px-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Course Details */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
                        <Tabs defaultValue="detail" className="w-full">
                            <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white/60 p-1.5 shadow-lg backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                <TabsList className="grid h-auto w-full grid-cols-2 bg-transparent gap-2">
                                    <TabsTrigger value="detail" className="gap-2 rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                        <BadgeCheck className="h-4 w-4" />
                                        <span className="hidden sm:inline">Yang Akan Dipelajari</span>
                                        <span className="sm:hidden">Detail</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="preview" className="gap-2 rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                        <Play className="h-4 w-4" />
                                        <span className="hidden sm:inline">Preview Video</span>
                                        <span className="sm:hidden">Preview</span>
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="detail" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div className="mb-6">
                                        <h2 className="mb-2 text-2xl font-bold">Yang Akan Kamu Pelajari</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Materi lengkap yang akan kamu kuasai setelah menyelesaikan kelas ini
                                        </p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {keyPointList.map((keyPoint, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * idx }}
                                                className="group flex items-start gap-3 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 p-4 transition-all hover:shadow-md dark:from-green-950/20 dark:to-emerald-950/20"
                                            >
                                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform group-hover:scale-110">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                                <p className="text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-300">{keyPoint}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="preview" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="overflow-hidden border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div className="mb-4">
                                        <h2 className="mb-2 text-2xl font-bold">Preview Video Kelas</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Tonton preview untuk mendapatkan gambaran materi yang akan dipelajari
                                        </p>
                                    </div>

                                    <div className="aspect-video w-full overflow-hidden rounded-xl border-4 border-gray-200 shadow-2xl dark:border-gray-800">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={
                                                firstVideoLesson?.video_url &&
                                                (firstVideoLesson.video_url.includes('youtube.com') ||
                                                    firstVideoLesson.video_url.includes('youtu.be'))
                                                    ? `https://www.youtube.com/embed/${getYoutubeId(firstVideoLesson.video_url)}`
                                                    : ''
                                            }
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="h-full w-full"
                                        ></iframe>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                        {/* {!isFree && channels.length > 0 && !pendingInvoice && !hasAccess && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6">
                                <Card className="p-6">
                                    <div className="mb-6">
                                        <h2 className="mb-2 text-2xl font-bold">Metode Pembayaran</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Pilih metode pembayaran yang Anda inginkan</p>
                                    </div>

                                    <div className="grid gap-3">
                                        {channels.map((channel) => (
                                            <div
                                                key={channel.code}
                                                onClick={() => setSelectedChannel(channel)}
                                                className={`group cursor-pointer rounded-xl border-2 p-4 transition-all ${
                                                    selectedChannel?.code === channel.code
                                                        ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
                                                        : 'border-gray-200 hover:border-orange-300 dark:border-gray-700 dark:hover:border-orange-600'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-1 items-center gap-4">
                                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                                                            <img
                                                                src={channel.icon_url}
                                                                alt={channel.name}
                                                                className="h-full w-full object-contain p-1"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900 dark:text-white">{channel.name}</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">{channel.group}</p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all"
                                                        style={{
                                                            borderColor: selectedChannel?.code === channel.code ? '#ea580c' : '#d1d5db',
                                                            backgroundColor: selectedChannel?.code === channel.code ? '#ea580c' : 'transparent',
                                                        }}
                                                    >
                                                        {selectedChannel?.code === channel.code && <Check className="h-3 w-3 text-white" />}
                                                    </div>
                                                </div>
                                                {selectedChannel?.code === channel.code && (
                                                    <div className="mt-4 border-t border-orange-200 pt-4 dark:border-orange-900">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                                Biaya Admin
                                                            </span>
                                                            <span className="font-semibold text-orange-600">
                                                                Rp {calculateAdminFee(channel).toLocaleString('id-ID')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )} */}
                    </motion.div>

                    {/* Right Column - Checkout Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1">
                        <div className="sticky top-4">
                            {hasAccess ? (
                                <Card className="overflow-hidden border border-green-500/20 bg-white/60 shadow-xl backdrop-blur-xl dark:border-green-500/10 dark:bg-zinc-900/60">
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center dark:from-green-950/20 dark:to-emerald-950/20">
                                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                            <BadgeCheck className="h-10 w-10 text-white" />
                                        </div>

                                        <h2 className="mb-3 text-2xl font-bold text-green-900 dark:text-green-100">Sudah Terdaftar</h2>
                                        <p className="mb-6 text-sm text-green-700 dark:text-green-300">
                                            Anda sudah memiliki akses ke kelas ini. Lanjutkan belajar untuk menyelesaikan materi.
                                        </p>

                                        <Button
                                            asChild
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        >
                                            <a href={`/profile/my-courses/${course.slug}`}>
                                                <Play className="mr-2 h-4 w-4" />
                                                Masuk ke Kelas
                                            </a>
                                        </Button>
                                    </div>
                                </Card>
                            ) : pendingInvoice ? (
                                <Card className="overflow-hidden border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div
                                        className="border-b p-4"
                                        style={{
                                            backgroundColor: (() => {
                                                const expiryInfo = formatExpiryTime(pendingInvoice.expires_at);
                                                const isExpired = expiryInfo.status === 'expired' && pendingInvoice.status === 'pending';
                                                return isExpired ? '#fee2e2' : 'rgba(254, 249, 195, 0.5)';
                                            })(),
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const expiryInfo = formatExpiryTime(pendingInvoice.expires_at);
                                                const isExpired = expiryInfo.status === 'expired' && pendingInvoice.status === 'pending';
                                                if (isExpired) {
                                                    return (
                                                        <>
                                                            <X className="h-5 w-5 text-red-600" />
                                                            <h2 className="text-lg font-semibold text-red-700">Pembayaran Gagal</h2>
                                                        </>
                                                    );
                                                }
                                                return (
                                                    <>
                                                        <Hourglass className="h-5 w-5 text-yellow-600" />
                                                        <h2 className="text-lg font-semibold text-yellow-900">Pembayaran Tertunda</h2>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    <div className="space-y-6 p-6">
                                        {/* Invoice Info */}
                                        <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">No. Invoice</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{pendingInvoice.invoice_code}</span>
                                            </div>
                                            {/* <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Metode Pembayaran</span>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={getPaymentGroupIcon(pendingInvoice.payment_channel)}
                                                        alt={pendingInvoice.payment_channel}
                                                        className="h-5 w-5 object-contain"
                                                    />
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {transactionDetail?.payment_name || getPaymentChannelName(pendingInvoice.payment_channel)}
                                                    </span>
                                                </div>
                                            </div> */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Pembayaran</span>
                                                <span className="text-xl font-bold text-orange-600">
                                                    Rp {pendingInvoice.amount.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>

                                        {(() => {
                                            const expiryInfo = formatExpiryTime(pendingInvoice.expires_at);
                                            const isExpired = expiryInfo.status === 'expired' && pendingInvoice.status === 'pending';

                                            if (isExpired) {
                                                return (
                                                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                                                        <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                                                            Waktu pembayaran telah habis. Jika Anda sudah membayar atau butuh bantuan, silakan hubungi
                                                            admin melalui&nbsp;
                                                            <a
                                                                href="https://wa.me/6289528514480"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="font-bold text-orange-600 underline"
                                                            >
                                                                WhatsApp Admin
                                                            </a>
                                                            .
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <>
                                                    {pendingInvoice.va_number && (
                                                        <div className="space-y-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                Nomor Virtual Account
                                                            </p>
                                                            <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-700">
                                                                <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                                                                    {pendingInvoice.va_number}
                                                                </span>
                                                                <button
                                                                    onClick={() => copyToClipboard(pendingInvoice.va_number!)}
                                                                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:cursor-pointer hover:bg-blue-700"
                                                                >
                                                                    Salin
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {pendingInvoice.qr_code_url && (
                                                        <div className="space-y-3 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Kode QR Pembayaran</p>
                                                            <div className="flex justify-center rounded-lg bg-white p-4 dark:bg-gray-700">
                                                                <img
                                                                    src={pendingInvoice.qr_code_url}
                                                                    alt="QR Code"
                                                                    className="h-48 w-48 object-contain"
                                                                />
                                                            </div>
                                                            <a
                                                                href={pendingInvoice.qr_code_url}
                                                                download
                                                                className="block rounded-lg bg-purple-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-purple-700"
                                                            >
                                                                Download QR Code
                                                            </a>
                                                        </div>
                                                    )}

                                                    {transactionDetail?.instructions && transactionDetail.instructions.length > 0 && (
                                                        <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Langkah Pembayaran</p>
                                                            <div className="space-y-4">
                                                                {transactionDetail.instructions.map((instruction, idx) => (
                                                                    <details
                                                                        key={idx}
                                                                        className="group rounded-lg border border-gray-200 dark:border-gray-600"
                                                                        open={idx === 0}
                                                                    >
                                                                        <summary className="flex cursor-pointer items-center justify-between bg-gray-100 px-4 py-3 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">
                                                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                                                {instruction.title}
                                                                            </span>
                                                                            <span className="text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-300">
                                                                                ▼
                                                                            </span>
                                                                        </summary>
                                                                        <div className="space-y-3 bg-white px-4 py-4 dark:bg-gray-700">
                                                                            <ol className="space-y-2">
                                                                                {instruction.steps.map((step, stepIdx) => (
                                                                                    <li key={stepIdx} className="flex gap-3">
                                                                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-bold text-white">
                                                                                            {stepIdx + 1}
                                                                                        </span>
                                                                                        <span className="flex-1 pt-0.5 text-sm text-gray-700 dark:text-gray-300">
                                                                                            <div dangerouslySetInnerHTML={{ __html: step }} />
                                                                                        </span>
                                                                                    </li>
                                                                                ))}
                                                                            </ol>
                                                                        </div>
                                                                    </details>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}

                                        <Button onClick={() => window.location.reload()} variant="outline" className="w-full" size="lg">
                                            Cek Status Pembayaran
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                <Card className="overflow-hidden border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div className="bg-primary/90 border-b border-primary/20 p-4 backdrop-blur-md">
                                        <h2 className="text-center text-lg font-bold text-white">
                                            {isFree ? 'Pendaftaran Gratis' : 'Detail Pembayaran'}
                                        </h2>
                                    </div>

                                    <form onSubmit={handleCheckout} className="px-4 pb-6">
                                        {isFree ? (
                                            <div className="mb-2 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center dark:from-green-950/20 dark:to-emerald-950/20">
                                                <Gift className="mx-auto mb-3 h-12 w-12 text-green-600" />
                                                <p className="text-2xl font-bold text-green-600">KELAS GRATIS</p>
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Dapatkan akses penuh tanpa biaya</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mb-6 space-y-2">
                                                    <Label htmlFor="promo-code" className="flex items-center gap-2 text-sm font-medium">
                                                        <Tag className="h-4 w-4" />
                                                        Punya Kode Promo?
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="promo-code"
                                                            type="text"
                                                            placeholder="Masukkan kode promo"
                                                            value={promoCode}
                                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                            className="pr-10 font-mono"
                                                        />
                                                        {promoLoading && (
                                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                                            </div>
                                                        )}
                                                        {!promoLoading && promoCode && (
                                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                                                {discountData?.valid ? (
                                                                    <Check className="h-4 w-4 text-green-600" />
                                                                ) : promoError ? (
                                                                    <X className="h-4 w-4 text-red-600" />
                                                                ) : null}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {promoError && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/20"
                                                        >
                                                            <X className="h-4 w-4 flex-shrink-0 text-red-600" />
                                                            <p className="text-sm text-red-600 dark:text-red-400">{promoError}</p>
                                                        </motion.div>
                                                    )}

                                                    {discountData?.valid && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:from-green-950/20 dark:to-emerald-950/20"
                                                        >
                                                            <div className="mb-2 flex items-center gap-2">
                                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                                                                    <Check className="h-4 w-4 text-white" />
                                                                </div>
                                                                <p className="font-semibold text-green-800 dark:text-green-200">
                                                                    Kode Promo Diterapkan!
                                                                </p>
                                                            </div>
                                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                                <span className="font-mono font-bold">{discountData.discount_code.code}</span> -{' '}
                                                                {discountData.discount_code.name}
                                                            </p>
                                                            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                                                Hemat {discountData.discount_code.formatted_value}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {/* Price Breakdown */}
                                                <div className="mb-6 space-y-3 rounded-lg border bg-gray-50 p-4 dark:bg-gray-900/50">
                                                    {course.strikethrough_price > 0 && (
                                                        <>
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">Harga Asli</span>
                                                                <span className="font-medium text-gray-500 line-through">
                                                                    Rp {course.strikethrough_price.toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">Diskon</span>
                                                                <span className="font-semibold text-red-600">
                                                                    -Rp {(course.strikethrough_price - course.price).toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                            <Separator />
                                                        </>
                                                    )}

                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">Harga Kelas</span>
                                                        <span className="font-semibold">Rp {course.price.toLocaleString('id-ID')}</span>
                                                    </div>

                                                    {discountData?.valid && (
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                                <Gift className="h-3.5 w-3.5" />
                                                                Promo ({discountData.discount_code.code})
                                                            </span>
                                                            <span className="font-semibold text-green-600">
                                                                -Rp {discountData.discount_amount.toLocaleString('id-ID')}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">Biaya Transaksi</span>
                                                        <span className="font-semibold">Rp {adminFee.toLocaleString('id-ID')}</span>
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold">Total Pembayaran</span>
                                                        <div className="text-right">
                                                            {discountData?.valid && finalCoursePrice < course.price && (
                                                                <div className="text-xs text-gray-500 line-through">
                                                                    Rp {(course.price + adminFee).toLocaleString('id-ID')}
                                                                </div>
                                                            )}
                                                            <span className="text-2xl font-bold text-blue-600">
                                                                Rp {totalPrice.toLocaleString('id-ID')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Security Note */}
                                                <div className="mb-4 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
                                                    <Shield className="h-5 w-5 flex-shrink-0 text-blue-600" />
                                                    <div className="text-xs text-blue-700 dark:text-blue-300">
                                                        <p className="mb-1 font-semibold">Pembayaran Aman & Terpercaya</p>
                                                        <p>Transaksi Anda dilindungi dengan enkripsi SSL</p>
                                                    </div>
                                                </div>

                                                {/* Terms Checkbox */}
                                                <div className="mb-4 flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
                                                    <Checkbox
                                                        id="terms"
                                                        checked={termsAccepted}
                                                        onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                                                        className="mt-0.5"
                                                    />
                                                    <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                                                        Saya menyetujui{' '}
                                                        <a
                                                            href="/terms-and-conditions"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-medium text-blue-600 hover:underline"
                                                        >
                                                            syarat dan ketentuan
                                                        </a>{' '}
                                                        yang berlaku
                                                    </Label>
                                                </div>
                                            </>
                                        )}

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={(isFree ? false : !termsAccepted) || loading}
                                            className="w-full disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                    Memproses...
                                                </>
                                            ) : isFree ? (
                                                <>
                                                    <Gift className="mr-2 h-5 w-5" />
                                                    Dapatkan Akses Gratis
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="mr-2 h-5 w-5" />
                                                    Lanjutkan Pembayaran
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
            <Toaster position="top-center" richColors />
        </UserLayout>
        </div>
    );
}
