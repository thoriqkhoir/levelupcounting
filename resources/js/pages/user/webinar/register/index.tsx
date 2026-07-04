import InputError from '@/components/input-error';
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
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BadgeCheck, Calendar, Check, CreditCard, Gift, Hourglass, LoaderCircle, RefreshCw, Tag, User, X } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Webinar {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    strikethrough_price: number;
    price: number;
    thumbnail?: string | null;
    description?: string | null;
    benefits?: string | null;
    group_url?: string | null;
    requirement_1?: string | null;
    requirement_2?: string | null;
    requirement_3?: string | null;
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
    va_number?: string;
    qr_code_url?: string;
    bank_name?: string;
    created_at: string;
    expires_at: string;
}

interface InvoiceData {
    type: string;
    id: string;
    discount_amount: number;
    nett_amount: number;
    total_amount: number;
    discount_code_id?: string;
    discount_code_amount?: number;
}

type RegisterForm = {
    name: string;
    email: string;
    phone_number: string;
    instance: string;
    city: string;
    password: string;
    password_confirmation: string;
};

type PendingCheckoutData = {
    webinarId: string;
    productType: 'webinar';
    termsAccepted: boolean;
    promoCode: string;
    discountData: DiscountData | null;
    timestamp: number;
    source: 'register' | 'login';
};

function parseList(items?: string | null): string[] {
    if (!items) return [];
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => li.replace(/<\/?li>/g, '').trim());
}

export default function RegisterWebinar({
    webinar,
    hasAccess,
    pendingInvoice,
    transactionDetail,
    referralInfo,
}: {
    webinar: Webinar;
    hasAccess: boolean;
    pendingInvoice?: PendingInvoice | null;
    transactionDetail?: TransactionDetail | null;
    referralInfo: ReferralInfo;
}) {
    const { auth } = usePage<SharedData>().props;
    const isLoggedIn = !!auth.user;
    const isProfileComplete = isLoggedIn && auth.user?.phone_number && auth.user?.instance && auth.user?.city;

    const [emailExists, setEmailExists] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [discountData, setDiscountData] = useState<DiscountData | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState('');

    const [showFreeForm, setShowFreeForm] = useState(false);
    const [freeFormData, setFreeFormData] = useState<Record<string, File | null>>({
        requirement_1_proof: null,
        requirement_2_proof: null,
        requirement_3_proof: null,
    });
    const [fileErrors, setFileErrors] = useState<Record<string, boolean>>({
        requirement_1_proof: false,
        requirement_2_proof: false,
        requirement_3_proof: false,
    });

    const submitInFlightRef = useRef(false);
    const pendingProcessedRef = useRef(false);
    const pendingTimerRef = useRef<number | null>(null);

    const benefitList = parseList(webinar.benefits);
    const isFree = webinar.price === 0;

    const basePrice = webinar.price;
    const discountAmount = discountData?.discount_amount || 0;
    const finalWebinarPrice = basePrice - discountAmount;

    const adminFee = isFree ? 0 : 5000;
    const totalPrice = isFree ? 0 : finalWebinarPrice + adminFee;

    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        phone_number: '',
        instance: '',
        city: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (!data.email || !data.email.includes('@')) {
            setEmailExists(false);
            return;
        }

        const timer = setTimeout(async () => {
            setCheckingEmail(true);
            try {
                const response = await axios.post('/api/check-email', { email: data.email });
                if (response.data.exists) {
                    setEmailExists(true);
                    setData('name', response.data.name || '');
                    setData('phone_number', response.data.phone_number || '');
                    setData('instance', response.data.instance || '');
                    setData('city', response.data.city || '');
                } else {
                    setEmailExists(false);
                }
            } catch {
                setEmailExists(false);
            } finally {
                setCheckingEmail(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [data.email, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

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
    }, [promoCode, isFree]);

    const validatePromoCode = async () => {
        if (!promoCode.trim() || isFree) return;

        setPromoLoading(true);
        setPromoError('');

        try {
            const payload: any = {
                code: promoCode,
                amount: webinar.price,
                product_type: 'webinar',
                product_id: webinar.id,
            };

            if (!isLoggedIn && emailExists && data.email) {
                payload.email = data.email;
            }

            const response = await axios.post('/api/discount-codes/validate', payload);

            if (response.data.valid) {
                setDiscountData(response.data);
                setPromoError('');
            } else {
                setDiscountData(null);
                setPromoError(response.data.message || 'Kode promo tidak valid');
            }
        } catch (error: any) {
            setDiscountData(null);
            setPromoError(error.response?.data?.message || 'Terjadi kesalahan saat memvalidasi kode promo');
        } finally {
            setPromoLoading(false);
        }
    };

    const refreshCSRFToken = async (): Promise<string> => {
        const response = await fetch('/csrf-token', {
            method: 'GET',
            credentials: 'same-origin',
        });
        const dataRes = await response.json();

        const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        if (metaTag) metaTag.content = dataRes.token;

        return dataRes.token;
    };

    const createInvoicePayload = (overrideDiscount?: DiscountData | null): InvoiceData => {
        const activeDiscount = overrideDiscount ?? discountData;
        const originalDiscountAmount = webinar.strikethrough_price > 0 ? webinar.strikethrough_price - webinar.price : 0;
        const promoDiscountAmount = activeDiscount?.discount_amount || 0;

        const payload: InvoiceData = {
            type: 'webinar',
            id: webinar.id,
            discount_amount: originalDiscountAmount + promoDiscountAmount,
            nett_amount: webinar.price - promoDiscountAmount,
            total_amount: webinar.price - promoDiscountAmount + 5000,
        };

        if (activeDiscount?.valid) {
            payload.discount_code_id = activeDiscount.discount_code.id;
            payload.discount_code_amount = activeDiscount.discount_amount;
        }

        return payload;
    };

    const submitPayment = async (payload: InvoiceData, retryCount = 0): Promise<void> => {
        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

        const res = await fetch(route('invoice.store'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
            body: JSON.stringify(payload),
        });

        if (res.status === 419 && retryCount < 2) {
            await refreshCSRFToken();
            return submitPayment(payload, retryCount + 1);
        }

        if (res.status === 401 && retryCount < 2) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            return submitPayment(payload, retryCount + 1);
        }

        const dataRes = await res.json().catch(() => ({}));

        if (!res.ok || !dataRes.success) {
            throw new Error(dataRes.message || 'Gagal membuat invoice.');
        }

        if (!dataRes.payment_url) {
            throw new Error('Payment URL not received');
        }

        sessionStorage.removeItem('pendingCheckout');
        window.location.href = dataRes.payment_url;
    };

    const handleFreeCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isProfileComplete) {
            toast.error('Profil Anda belum lengkap! Harap lengkapi nomor telepon terlebih dahulu.');
            setTimeout(() => {
                window.location.href = route('profile.edit');
            }, 1500);
            return;
        }

        if (!freeFormData.requirement_1_proof || !freeFormData.requirement_2_proof || !freeFormData.requirement_3_proof) {
            toast.error('Harap upload semua bukti yang diperlukan!');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('type', 'webinar');
        formData.append('id', webinar.id);
        formData.append('requirement_1_proof', freeFormData.requirement_1_proof);
        formData.append('requirement_2_proof', freeFormData.requirement_2_proof);
        formData.append('requirement_3_proof', freeFormData.requirement_3_proof);

        router.post(route('enroll.free'), formData, {
            onError: (errors) => {
                toast.error(errors.message || 'Gagal mendaftar webinar gratis.');
            },
            onFinish: () => setLoading(false),
        });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            if (!data.email || !data.name || !data.phone_number || !data.instance || !data.city) {
                toast.error('Lengkapi data terlebih dahulu');
                return;
            }

            setLoading(true);
            try {
                if (emailExists) {
                    const response = await axios.post('/auto-login', {
                        email: data.email,
                        phone_number: data.phone_number,
                        instance: data.instance,
                        city: data.city,
                    });

                    if (!response.data.success) {
                        throw new Error(response.data.message || 'Login gagal. Pastikan nomor telepon sesuai.');
                    }

                    toast.success('Login berhasil! Menyiapkan pembayaran...');
                    sessionStorage.setItem(
                        'pendingCheckout',
                        JSON.stringify({
                            webinarId: webinar.id,
                            productType: 'webinar',
                            termsAccepted,
                            promoCode,
                            discountData,
                            timestamp: Date.now(),
                            source: 'login',
                        } satisfies PendingCheckoutData),
                    );
                } else {
                    const response = await axios.post('/register', {
                        name: data.name,
                        email: data.email,
                        phone_number: data.phone_number,
                        instance: data.instance,
                        city: data.city,
                        password: data.phone_number,
                        password_confirmation: data.phone_number,
                    });

                    if (!(response.data.success || response.status === 200 || response.status === 201)) {
                        throw new Error('Registrasi gagal');
                    }

                    toast.success('Registrasi berhasil! Menyiapkan pembayaran...');
                    sessionStorage.setItem(
                        'pendingCheckout',
                        JSON.stringify({
                            webinarId: webinar.id,
                            productType: 'webinar',
                            termsAccepted,
                            promoCode,
                            discountData,
                            timestamp: Date.now(),
                            source: 'register',
                        } satisfies PendingCheckoutData),
                    );
                }

                await new Promise((resolve) => setTimeout(resolve, 900));
                window.location.reload();
                return;
            } catch (error: any) {
                setLoading(false);
                toast.error(error.response?.data?.message || error.message || 'Gagal login/registrasi');
                return;
            }
        }

        if (!isProfileComplete) {
            toast.error('Profil Anda belum lengkap! Harap lengkapi nomor telepon, instansi, dan kota domisili terlebih dahulu.');
            setTimeout(() => {
                window.location.href = route('profile.edit');
            }, 1500);
            return;
        }

        if (!termsAccepted && !isFree) {
            toast.error('Anda harus menyetujui syarat dan ketentuan!');
            return;
        }

        if (submitInFlightRef.current) return;
        submitInFlightRef.current = true;
        setLoading(true);

        if (isFree) {
            setShowFreeForm(true);
            setLoading(false);
            submitInFlightRef.current = false;
            return;
        }

        try {
            await submitPayment(createInvoicePayload());
        } catch (error: any) {
            toast.error(error.message || 'Terjadi kesalahan saat proses pembayaran.');
            setLoading(false);
            submitInFlightRef.current = false;
        }
    };

    useEffect(() => {
        const raw = sessionStorage.getItem('pendingCheckout');
        if (!raw || !isLoggedIn || pendingProcessedRef.current) return;

        pendingProcessedRef.current = true;

        let checkoutData: PendingCheckoutData;
        try {
            checkoutData = JSON.parse(raw);
        } catch {
            sessionStorage.removeItem('pendingCheckout');
            return;
        }

        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() - (checkoutData.timestamp || 0) > fiveMinutes) {
            sessionStorage.removeItem('pendingCheckout');
            toast.error('Sesi checkout telah kadaluarsa');
            return;
        }

        if (checkoutData.webinarId !== webinar.id) {
            sessionStorage.removeItem('pendingCheckout');
            return;
        }

        if (checkoutData.source !== 'register') {
            sessionStorage.removeItem('pendingCheckout');
            return;
        }

        if (checkoutData.promoCode) setPromoCode(checkoutData.promoCode);
        if (checkoutData.discountData) setDiscountData(checkoutData.discountData);
        setTermsAccepted(!!checkoutData.termsAccepted);

        pendingTimerRef.current = window.setTimeout(async () => {
            if (submitInFlightRef.current) return;
            submitInFlightRef.current = true;
            setLoading(true);

            try {
                await submitPayment(createInvoicePayload(checkoutData.discountData ?? null));
            } catch (error: any) {
                toast.error(error.message || 'Terjadi kesalahan saat proses pembayaran.');
                sessionStorage.removeItem('pendingCheckout');
                setLoading(false);
                submitInFlightRef.current = false;
            }
        }, 1200);

        return () => {
            if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
        };
    }, [isLoggedIn, webinar.id]);

    const validateFileSize = (file: File, maxSizeMB: number = 2): boolean => {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return file.size <= maxSizeBytes;
    };

    const handleFileChange = (fieldName: keyof typeof freeFormData, file: File | null) => {
        if (!file) {
            setFreeFormData((prev) => ({ ...prev, [fieldName]: null }));
            setFileErrors((prev) => ({ ...prev, [fieldName]: false }));
            return;
        }

        if (!validateFileSize(file, 2)) {
            setFileErrors((prev) => ({ ...prev, [fieldName]: true }));
            const input = document.querySelector(`input[data-field="${fieldName}"]`) as HTMLInputElement;
            if (input) input.value = '';
            toast.error('Ukuran file terlalu besar. Maksimal 2MB.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setFileErrors((prev) => ({ ...prev, [fieldName]: true }));
            const input = document.querySelector(`input[data-field="${fieldName}"]`) as HTMLInputElement;
            if (input) input.value = '';
            toast.error('Hanya file gambar (JPG, PNG, GIF, dll) yang diperbolehkan.');
            return;
        }

        setFreeFormData((prev) => ({ ...prev, [fieldName]: file }));
        setFileErrors((prev) => ({ ...prev, [fieldName]: false }));
        toast.success('File berhasil diunggah.');
    };

    const formatExpiryTime = (expiresAt: string): { time: string; status: 'expired' | 'urgent' | 'normal' } => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = expiry.getTime() - now.getTime();

        if (diff <= 0) return { time: 'Sudah kadaluarsa', status: 'expired' };

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours < 1) return { time: `${minutes} menit lagi`, status: 'urgent' };
        return { time: `${hours} jam ${minutes} menit lagi`, status: hours < 3 ? 'urgent' : 'normal' };
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => toast.success('Berhasil menyalin ke clipboard!'));
    };

    if (isLoggedIn && !isProfileComplete) {
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
                                    {webinar.title}
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
                                    Kami memerlukan nomor telepon, instansi, dan kota domisili Anda untuk melanjutkan pendaftaran webinar ini.
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
            <Head title={`Checkout - ${webinar.title}`} />

            {/* Hero Section */}
            <section className="relative mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60 sm:p-12">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
                    <div className="relative z-10">
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                            {isFree && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 backdrop-blur-sm"
                                >
                                    <Gift className="h-3.5 w-3.5" />
                                    Gratis
                                </motion.div>
                            )}

                            {webinar.strikethrough_price > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 backdrop-blur-sm"
                                >
                                    <Tag className="h-3.5 w-3.5" />
                                    Diskon {Math.round(((webinar.strikethrough_price - webinar.price) / webinar.strikethrough_price) * 100)}%
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary shadow-lg backdrop-blur-md"
                            >
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(webinar.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} -{' '}
                                {new Date(webinar.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </motion.div>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl"
                        >
                            {webinar.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-6 max-w-3xl text-justify text-lg leading-relaxed text-zinc-700 dark:text-zinc-300"
                        >
                            {webinar.description}
                        </motion.p>
                    </div>
                </motion.div>
            </section>

            <section className="mx-auto my-8 w-full max-w-7xl px-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
                        <Tabs defaultValue="detail" className="w-full">
                            <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white/60 p-1.5 shadow-lg backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                <TabsList className="grid h-auto w-full grid-cols-1 bg-transparent gap-2">
                                    <TabsTrigger value="detail" className="gap-2 rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                        <BadgeCheck className="h-4 w-4" />
                                        <span className="hidden sm:inline">Detail Webinar</span>
                                        <span className="sm:hidden">Detail</span>
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="detail" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div className="mb-6">
                                        <h2 className="mb-2 text-2xl font-bold">Yang Akan Kamu Dapatkan</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Manfaat yang akan kamu peroleh setelah mengikuti webinar ini
                                        </p>
                                    </div>

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
                                                    <Check className="h-4 w-4" />
                                                </div>
                                                <p className="text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-300">{benefit}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {!isLoggedIn && (
                            <Card className="mt-6 border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                <form className="flex flex-col gap-6 p-6 pt-0" onSubmit={submit}>
                                    <h1 className="text-xl font-bold">Masukkan Data Diri Anda</h1>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="email@example.com"
                                                    className="pr-10"
                                                />
                                                {checkingEmail && (
                                                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                                        <LoaderCircle className="h-4 w-4 animate-spin text-gray-400" />
                                                    </div>
                                                )}
                                                {!checkingEmail && emailExists && (
                                                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                                        <Check className="h-5 w-5 text-green-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                disabled={checkingEmail || !data.email}
                                                onClick={async () => {
                                                    if (!data.email || !data.email.includes('@')) {
                                                        toast.error('Masukkan email yang valid');
                                                        return;
                                                    }

                                                    setCheckingEmail(true);
                                                    try {
                                                        const response = await axios.post('/api/check-email', { email: data.email });
                                                        if (response.data.exists) {
                                                            setEmailExists(true);
                                                            setData('name', response.data.name || '');
                                                            setData('phone_number', response.data.phone_number || '');
                                                            toast.success('Email ditemukan!');
                                                        } else {
                                                            setEmailExists(false);
                                                            toast.info('Email tidak terdaftar');
                                                        }
                                                    } catch {
                                                        setEmailExists(false);
                                                        toast.error('Gagal mengecek email');
                                                    } finally {
                                                        setCheckingEmail(false);
                                                    }
                                                }}
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {emailExists && <p className="text-xs text-green-600">Email ditemukan, data terisi otomatis</p>}
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Nama</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                tabIndex={2}
                                                autoComplete="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                disabled={processing || emailExists}
                                                placeholder="Nama lengkap Anda"
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="phone_number">No. Telepon</Label>
                                            <Input
                                                id="phone_number"
                                                type="tel"
                                                required
                                                tabIndex={3}
                                                autoComplete="tel"
                                                value={data.phone_number}
                                                onChange={(e) => setData('phone_number', e.target.value)}
                                                disabled={processing || emailExists}
                                                placeholder="08xxxxxxxxxx"
                                            />
                                            {!emailExists && (
                                                <p className="text-xs text-gray-500">Nomor telepon akan digunakan sebagai password anda</p>
                                            )}
                                            {emailExists && (
                                                <p className="text-xs text-blue-600">Pastikan nomor telepon sesuai dengan yang terdaftar</p>
                                            )}
                                            <InputError message={errors.phone_number} />
                                        </div>
                                        <div className="grid gap-2 pb-2">
                                            <Label htmlFor="instance">Instansi/Perusahaan</Label>
                                            <Input
                                                id="instance"
                                                type="text"
                                                tabIndex={4}
                                                autoComplete="organization"
                                                value={data.instance}
                                                onChange={(e) => setData('instance', e.target.value)}
                                                disabled={processing}
                                                placeholder="Instansi atau perusahaan Anda"
                                            />
                                            <InputError message={errors.instance} />
                                        </div>
                                        <div className="grid gap-2 pb-2">
                                            <Label htmlFor="city">Kota Domisili</Label>
                                            <Input
                                                id="city"
                                                type="text"
                                                tabIndex={5}
                                                autoComplete="city"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                disabled={processing}
                                                placeholder="Kota domisili Anda"
                                            />
                                            <InputError message={errors.city} />
                                        </div>
                                    </div>
                                </form>
                            </Card>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1">
                        <div className="sticky top-4">
                            {hasAccess ? (
                                <Card className="overflow-hidden border border-green-500/20 bg-white/60 shadow-xl backdrop-blur-xl dark:border-green-500/10 dark:bg-zinc-900/60">
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-950/20 dark:to-emerald-950/20">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                            <BadgeCheck className="h-8 w-8 text-white" />
                                        </div>

                                        <h2 className="mb-2 text-center text-xl font-bold">Anda Sudah Memiliki Akses</h2>
                                        <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                            Anda sudah terdaftar di webinar ini. Silakan masuk ke dalam grup.
                                        </p>

                                        <Button
                                            asChild
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        >
                                            <a href={webinar.group_url ?? ''} target="_blank" rel="noopener noreferrer">
                                                Masuk Group Webinar
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
                                                            <div>
                                                                <p className="font-semibold text-red-800">Pembayaran Kadaluarsa</p>
                                                                <p className="text-sm text-red-600">Silakan buat pembayaran baru</p>
                                                            </div>
                                                        </>
                                                    );
                                                }

                                                return (
                                                    <>
                                                        <Hourglass className="h-5 w-5 text-orange-600" />
                                                        <div>
                                                            <p className="font-semibold text-orange-800">Menunggu Pembayaran</p>
                                                            <p className="text-sm text-orange-600">Berakhir {expiryInfo.time}</p>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    <div className="space-y-6 p-6">
                                        <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Kode Invoice</span>
                                                <span className="font-mono text-sm font-semibold">{pendingInvoice.invoice_code}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pembayaran</span>
                                                <span className="text-lg font-bold text-orange-600">
                                                    Rp {pendingInvoice.amount.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Metode Pembayaran</span>
                                                <span className="font-semibold">{pendingInvoice.payment_method}</span>
                                            </div>
                                        </div>

                                        {pendingInvoice.va_number && (
                                            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                                                <div className="mb-3 flex items-center gap-2">
                                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Virtual Account</h3>
                                                </div>
                                                <div className="flex items-center justify-between rounded border bg-white p-3 dark:bg-gray-800">
                                                    <span className="font-mono text-lg font-bold">{pendingInvoice.va_number}</span>
                                                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(pendingInvoice.va_number!)}>
                                                        Copy
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {pendingInvoice.qr_code_url && (
                                            <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-950/20">
                                                <h3 className="mb-2 font-semibold text-purple-800 dark:text-purple-200">QR Code</h3>
                                                <div className="mx-auto w-fit rounded-lg bg-white p-4">
                                                    <img src={pendingInvoice.qr_code_url} alt="QR Code Payment" className="mx-auto h-32 w-32" />
                                                </div>
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

                                        <Button onClick={() => window.location.reload()} variant="outline" className="w-full" size="lg">
                                            Cek Status Pembayaran
                                        </Button>
                                    </div>
                                </Card>
                            ) : !showFreeForm ? (
                                <Card className="overflow-hidden border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div className="bg-primary/90 border-b border-primary/20 p-6 backdrop-blur-md">
                                        <h2 className="text-xl font-bold text-white">Detail {isFree ? 'Pendaftaran' : 'Pembayaran'}</h2>
                                        <p className="text-sm text-white/80">
                                            {isFree ? 'Persyaratan pendaftaran gratis' : 'Ringkasan pembayaran webinar'}
                                        </p>
                                    </div>

                                    <form onSubmit={handleCheckout} className="p-6">
                                        {isFree ? (
                                            <div className="space-y-4 text-center">
                                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                                    <Gift className="h-8 w-8 text-white" />
                                                </div>

                                                <h3 className="text-lg font-bold text-green-600">Webinar Gratis!</h3>
                                                <p className="text-sm text-gray-600">
                                                    Untuk mengikuti webinar gratis ini, silakan lengkapi persyaratan berikut:
                                                </p>

                                                <ul className="mt-4 space-y-1 text-left text-sm text-green-700 dark:text-green-300">
                                                    {webinar.requirement_1 && <li>• {webinar.requirement_1}</li>}
                                                    {webinar.requirement_2 && <li>• {webinar.requirement_2}</li>}
                                                    {webinar.requirement_3 && <li>• {webinar.requirement_3}</li>}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">Harga Webinar</span>
                                                        <div className="text-right">
                                                            {webinar.strikethrough_price > 0 && (
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    Rp {webinar.strikethrough_price.toLocaleString('id-ID')}
                                                                </span>
                                                            )}
                                                            <div className="font-semibold">Rp {webinar.price.toLocaleString('id-ID')}</div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="promoCode" className="text-sm font-medium">
                                                            Kode Promo (Opsional)
                                                        </Label>
                                                        <div className="mt-1 flex gap-2">
                                                            <Input
                                                                id="promoCode"
                                                                placeholder="Masukkan kode promo"
                                                                value={promoCode}
                                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                                className="flex-1"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                disabled={promoLoading || !promoCode.trim()}
                                                                onClick={async () => {
                                                                    if (!promoCode.trim()) {
                                                                        toast.error('Masukkan kode promo terlebih dahulu');
                                                                        return;
                                                                    }
                                                                    await validatePromoCode();
                                                                }}
                                                            >
                                                                <RefreshCw className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        {promoLoading && <p className="mt-1 text-xs text-gray-500">Memvalidasi kode promo...</p>}
                                                        {promoError && <p className="mt-1 text-sm text-red-600">{promoError}</p>}
                                                        {discountData?.valid && (
                                                            <p className="mt-1 text-sm text-green-600">
                                                                Kode promo "{discountData.discount_code.code}" berhasil diterapkan!
                                                            </p>
                                                        )}
                                                    </div>

                                                    {discountData?.valid && (
                                                        <div className="flex items-center justify-between text-green-600">
                                                            <span>Diskon ({discountData.discount_code.code})</span>
                                                            <span>-Rp {discountData.discount_amount.toLocaleString('id-ID')}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between text-gray-600">
                                                        <span>Biaya Admin</span>
                                                        <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center justify-between text-lg font-bold">
                                                        <span>Total</span>
                                                        <span className="text-orange-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!isFree && (
                                            <div className="mt-6 flex items-start gap-3">
                                                <Checkbox
                                                    id="terms"
                                                    checked={termsAccepted}
                                                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                                                />
                                                <Label htmlFor="terms" className="text-sm leading-relaxed">
                                                    Saya menyetujui{' '}
                                                    <Link href="/terms" className="font-medium text-blue-600 hover:underline">
                                                        syarat dan ketentuan
                                                    </Link>{' '}
                                                    yang berlaku
                                                </Label>
                                            </div>
                                        )}

                                        <Button
                                            className="mt-6 w-full"
                                            type="submit"
                                            size="lg"
                                            disabled={(isFree ? false : !termsAccepted) || loading}
                                        >
                                            {loading ? 'Memproses...' : isFree ? 'Upload Bukti Follow' : 'Lanjutkan Pembayaran'}
                                        </Button>
                                    </form>
                                </Card>
                            ) : (
                                <Card className="overflow-hidden border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div className="bg-primary/90 border-b border-primary/20 p-6 backdrop-blur-md">
                                        <h2 className="text-xl font-bold text-white">Upload Bukti Follow</h2>
                                        <p className="text-sm text-white/80">Upload bukti bahwa Anda telah memenuhi persyaratan</p>
                                    </div>

                                    <form onSubmit={handleFreeCheckout} className="p-6">
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((index) => {
                                                const requirementKey = `requirement_${index}`;
                                                const proofKey = `${requirementKey}_proof` as const;
                                                const requirementText = webinar[requirementKey as keyof Webinar] as string | null | undefined;

                                                return (
                                                    <div key={index}>
                                                        <Label htmlFor={proofKey}>
                                                            Bukti Persyaratan {index}: {requirementText || `Persyaratan ${index}`}
                                                        </Label>
                                                        <Input
                                                            id={proofKey}
                                                            data-field={proofKey}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(proofKey, e.target.files?.[0] || null)}
                                                            className={fileErrors[proofKey] ? 'border-red-500' : ''}
                                                            required
                                                        />
                                                        <p className="mt-1 text-xs text-gray-500">{requirementText} (Maks. 2MB)</p>
                                                    </div>
                                                );
                                            })}

                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowFreeForm(false);
                                                        setFileErrors({
                                                            requirement_1_proof: false,
                                                            requirement_2_proof: false,
                                                            requirement_3_proof: false,
                                                        });
                                                        setFreeFormData({
                                                            requirement_1_proof: null,
                                                            requirement_2_proof: null,
                                                            requirement_3_proof: null,
                                                        });
                                                    }}
                                                    className="flex-1"
                                                >
                                                    Kembali
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        loading ||
                                                        !freeFormData.requirement_1_proof ||
                                                        !freeFormData.requirement_2_proof ||
                                                        !freeFormData.requirement_3_proof ||
                                                        Object.values(fileErrors).some((e) => e)
                                                    }
                                                    className="flex-1"
                                                >
                                                    {loading ? 'Memproses...' : 'Dapatkan Akses Gratis'}
                                                </Button>
                                            </div>
                                        </div>
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
