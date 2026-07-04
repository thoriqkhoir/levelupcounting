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
import { BadgeCheck, Calendar, Check, CreditCard, Gift, Hourglass, LoaderCircle, RefreshCw, Shield, Star, Tag, Upload, User, X } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Bootcamp {
    id: string;
    title: string;
    schedules?: { day: string; start_time: string; end_time: string }[];
    start_date: string;
    end_date: string;
    strikethrough_price: number;
    price: number;
    thumbnail?: string | null;
    description?: string | null;
    benefits?: string | null;
    requirements?: string | null;
    curriculum?: string | null;
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
    // payment_channel: string;
    va_number?: string;
    qr_code_url?: string;
    bank_name?: string;
    created_at: string;
    expires_at: string;
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

function parseList(items?: string | null): string[] {
    if (!items) return [];
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => li.replace(/<\/?li>/g, '').trim());
}

export default function RegisterBootcamp({
    bootcamp,
    hasAccess,
    pendingInvoice,
    transactionDetail,
    // channels,
    referralInfo,
}: {
    bootcamp: Bootcamp;
    hasAccess: boolean;
    pendingInvoice?: PendingInvoice | null;
    transactionDetail?: TransactionDetail | null;
    // channels: PaymentChannel[];
    referralInfo: ReferralInfo;
}) {
    const [emailExists, setEmailExists] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const isLoggedIn = !!auth.user;
    const isProfileComplete = isLoggedIn && auth.user?.phone_number && auth.user?.instance && auth.user?.city;

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [discountData, setDiscountData] = useState<DiscountData | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState('');
    // const [selectedChannel, setSelectedChannel] = useState<PaymentChannel | null>(channels.length > 0 ? channels[0] : null);

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

    const requirementList = parseList(bootcamp.requirements);
    const benefitList = parseList(bootcamp.benefits);
    const curriculumList = parseList(bootcamp.curriculum);
    const isFree = bootcamp.price === 0;

    const basePrice = bootcamp.price;
    const discountAmount = discountData?.discount_amount || 0;
    const finalBootcampPrice = basePrice - discountAmount;

    // const calculateAdminFee = (channel: PaymentChannel | null): number => {
    //     if (!channel || isFree) return 0;
    //     const flatFee = channel.fee_customer.flat || 0;
    //     const percentFee = Math.round(finalBootcampPrice * ((channel.fee_customer.percent || 0) / 100));
    //     return flatFee + percentFee;
    // };

    const adminFee = isFree ? 0 : 5000; //calculateAdminFee(selectedChannel);
    const totalPrice = isFree ? 0 : finalBootcampPrice + adminFee;
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
                const response = await axios.post('/api/check-email', {
                    email: data.email,
                });

                if (response.data.exists) {
                    setEmailExists(true);
                    setData('name', response.data.name || '');
                    setData('phone_number', response.data.phone_number || '');
                    setData('instance', response.data.instance || '');
                    setData('city', response.data.city || '');
                } else {
                    setEmailExists(false);
                }
            } catch (error) {
                console.error('Error checking email:', error);
                setEmailExists(false);
            } finally {
                setCheckingEmail(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [data.email]);

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
    }, [promoCode]);

    const validatePromoCode = async () => {
        if (!promoCode.trim() || isFree) return;

        setPromoLoading(true);
        setPromoError('');

        try {
            const requestData: any = {
                code: promoCode,
                amount: bootcamp.price,
                product_type: 'bootcamp',
                product_id: bootcamp.id,
            };

            if (!isLoggedIn && emailExists && data.email) {
                requestData.email = data.email;
            }

            const response = await axios.post('/api/discount-codes/validate', requestData);

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
            toast.error('Profil Anda belum lengkap! Harap lengkapi nomor telepon, instansi, dan kota domisili terlebih dahulu untuk mendaftar bootcamp.');
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
        formData.append('type', 'bootcamp');
        formData.append('id', bootcamp.id);
        formData.append('requirement_1_proof', freeFormData.requirement_1_proof);
        formData.append('requirement_2_proof', freeFormData.requirement_2_proof);
        formData.append('requirement_3_proof', freeFormData.requirement_3_proof);

        router.post(route('enroll.free'), formData, {
            onError: (errors) => {
                toast.error(errors.message || 'Gagal mendaftar bootcamp gratis.');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        // Jika belum login, lakukan registrasi/login terlebih dahulu
        if (!isLoggedIn) {
            if (!data.email || !data.name || !data.phone_number || !data.instance || !data.city) {
                toast.error('Lengkapi data terlebih dahulu');
                return;
            }

            setLoading(true);

            try {
                if (emailExists) {
                    // Gunakan axios yang sudah auto-handle CSRF token
                    const response = await axios.post('/auto-login', {
                        email: data.email,
                        phone_number: data.phone_number,
                        instance: data.instance,
                        city: data.city,
                    });

                    if (!response.data.success) {
                        throw new Error(response.data.message || 'Login gagal. Pastikan nomor telepon sesuai dengan yang terdaftar.');
                    }

                    toast.success('Login berhasil! Menyiapkan pembayaran...');

                    sessionStorage.setItem(
                        'pendingCheckout',
                        JSON.stringify({
                            bootcampId: bootcamp.id,
                            productType: 'bootcamp',
                            termsAccepted: termsAccepted,
                            promoCode: promoCode,
                            discountData: discountData,
                            timestamp: Date.now(),
                            source: 'login',
                        }),
                    );

                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    window.location.reload();
                    return;
                } else {
                    // Registrasi juga menggunakan axios
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
                            bootcampId: bootcamp.id,
                            productType: 'bootcamp',
                            termsAccepted: termsAccepted,
                            promoCode: promoCode,
                            discountData: discountData,
                            timestamp: Date.now(),
                            source: 'register',
                        }),
                    );

                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    window.location.reload();
                    return;
                }
            } catch (error: any) {
                console.error('Login/Register error:', error);
                setLoading(false);

                // Better error messages
                if (error.response?.status === 419) {
                    toast.error('Sesi telah berakhir. Silakan muat ulang halaman.');
                } else {
                    toast.error(error.response?.data?.message || error.message || 'Gagal login/registrasi');
                }
                return;
            }
        }

        // Validasi terms untuk pembayaran berbayar
        if (!termsAccepted && !isFree) {
            toast.error('Anda harus menyetujui syarat dan ketentuan!');
            setLoading(false);
            return;
        }

        if (!loading) {
            setLoading(true);
        }

        if (isFree) {
            setShowFreeForm(true);
            setLoading(false);
            return;
        }

        // Lanjutkan ke submit payment
        const submitPayment = async (retryCount = 0): Promise<void> => {
            const originalDiscountAmount = bootcamp.strikethrough_price > 0 ? bootcamp.strikethrough_price - bootcamp.price : 0;
            const promoDiscountAmount = discountData?.discount_amount || 0;

            const invoiceData: InvoiceData = {
                type: 'bootcamp',
                id: bootcamp.id,
                discount_amount: originalDiscountAmount + promoDiscountAmount,
                nett_amount: finalBootcampPrice,
                total_amount: totalPrice,
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
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(invoiceData),
                });

                if (res.status === 419 && retryCount < 2) {
                    await refreshCSRFToken();
                    return submitPayment(retryCount + 1);
                }

                if (res.status === 401 && retryCount < 2) {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    return submitPayment(retryCount + 1);
                }

                const data = await res.json();

                if (res.ok && data.success) {
                    if (data.payment_url) {
                        // Hapus pending checkout setelah berhasil
                        sessionStorage.removeItem('pendingCheckout');
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
            toast.error(error.message || 'Terjadi kesalahan saat proses pembayaran.');
            setLoading(false);
        }
    };

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

    useEffect(() => {
        const pendingCheckout = sessionStorage.getItem('pendingCheckout');

        if (pendingCheckout && isLoggedIn) {
            try {
                const checkoutData = JSON.parse(pendingCheckout);

                // Validasi timestamp (maksimal 5 menit)
                const timestamp = checkoutData.timestamp || 0;
                const now = Date.now();
                const fiveMinutes = 5 * 60 * 1000;

                if (now - timestamp > fiveMinutes) {
                    sessionStorage.removeItem('pendingCheckout');
                    toast.error('Sesi checkout telah kadaluarsa');
                    return;
                }

                // Validasi bootcamp ID
                if (checkoutData.bootcampId !== bootcamp.id) {
                    sessionStorage.removeItem('pendingCheckout');
                    return;
                }

                if (checkoutData.source !== 'register') {
                    sessionStorage.removeItem('pendingCheckout');
                    return;
                }

                // Restore state
                if (checkoutData.promoCode) {
                    setPromoCode(checkoutData.promoCode);
                }
                if (checkoutData.discountData) {
                    setDiscountData(checkoutData.discountData);
                }
                setTermsAccepted(checkoutData.termsAccepted || false);

                // Toast notification
                toast.success('Melanjutkan pembayaran...');

                // Auto-submit setelah delay
                setTimeout(async () => {
                    setLoading(true);

                    const submitPayment = async (retryCount = 0): Promise<void> => {
                        const originalDiscountAmount = bootcamp.strikethrough_price > 0 ? bootcamp.strikethrough_price - bootcamp.price : 0;
                        const promoDiscountAmount = checkoutData.discountData?.discount_amount || 0;
                        const finalPrice = bootcamp.price - promoDiscountAmount;
                        const totalAmount = finalPrice + 5000; // Admin fee

                        const invoiceData: InvoiceData = {
                            type: 'bootcamp',
                            id: bootcamp.id,
                            discount_amount: originalDiscountAmount + promoDiscountAmount,
                            nett_amount: finalPrice,
                            total_amount: totalAmount,
                        };

                        if (checkoutData.discountData?.valid) {
                            invoiceData.discount_code_id = checkoutData.discountData.discount_code.id;
                            invoiceData.discount_code_amount = checkoutData.discountData.discount_amount;
                        }

                        try {
                            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

                            const res = await fetch(route('invoice.store'), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': csrfToken || '',
                                    Accept: 'application/json',
                                    'X-Requested-With': 'XMLHttpRequest',
                                },
                                credentials: 'same-origin',
                                body: JSON.stringify(invoiceData),
                            });

                            if (res.status === 419 && retryCount < 2) {
                                await refreshCSRFToken();
                                return submitPayment(retryCount + 1);
                            }

                            if (res.status === 401 && retryCount < 2) {
                                await new Promise((resolve) => setTimeout(resolve, 2000));
                                return submitPayment(retryCount + 1);
                            }

                            const data = await res.json();

                            if (res.ok && data.success) {
                                if (data.payment_url) {
                                    sessionStorage.removeItem('pendingCheckout');
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
                        console.error('Failed to process payment:', error);
                        toast.error(error.message || 'Terjadi kesalahan saat proses pembayaran.');
                        sessionStorage.removeItem('pendingCheckout');
                        setLoading(false);
                    }
                }, 2000);
            } catch (error) {
                console.error('Error processing pending checkout:', error);
                sessionStorage.removeItem('pendingCheckout');
                toast.error('Gagal memproses checkout');
            }
        }
    }, [isLoggedIn, bootcamp.id]);

    // if (!isLoggedIn) {
    //     const currentUrl = window.location.href;
    //     const loginUrl = route('login', { redirect: currentUrl });

    //     return (
    //         <UserLayout>
    //             <Head title="Login Required" />

    //             <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 px-4 py-16">
    //                 <div className="bg-grid-white/[0.05] absolute inset-0 bg-[size:20px_20px]" />
    //                 <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/30 blur-3xl" />
    //                 <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-400/30 blur-3xl" />

    //                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-4xl text-center">
    //                     <motion.div
    //                         initial={{ opacity: 0, scale: 0.9 }}
    //                         animate={{ opacity: 1, scale: 1 }}
    //                         transition={{ delay: 0.1 }}
    //                         className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
    //                     >
    //                         <Lock className="h-4 w-4 text-white" />
    //                         <span className="text-sm font-medium text-white">Login Diperlukan</span>
    //                     </motion.div>

    //                     <motion.h1
    //                         initial={{ opacity: 0, y: 20 }}
    //                         animate={{ opacity: 1, y: 0 }}
    //                         transition={{ delay: 0.2 }}
    //                         className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
    //                     >
    //                         {bootcamp.title}
    //                     </motion.h1>

    //                     <motion.p
    //                         initial={{ opacity: 0, y: 20 }}
    //                         animate={{ opacity: 1, y: 0 }}
    //                         transition={{ delay: 0.3 }}
    //                         className="text-lg text-blue-100"
    //                     >
    //                         Silakan login terlebih dahulu untuk melanjutkan pendaftaran
    //                     </motion.p>
    //                 </motion.div>
    //             </section>

    //             <section className="mx-auto my-8 w-full max-w-2xl px-4">
    //                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
    //                     <Card className="overflow-hidden border-2">
    //                         <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 dark:from-blue-950/20 dark:to-purple-950/20">
    //                             <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
    //                                 <User className="h-10 w-10 text-white" />
    //                             </div>

    //                             <h2 className="mb-3 text-center text-2xl font-bold">Login untuk Melanjutkan</h2>
    //                             <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
    //                                 Anda perlu login untuk mendaftar bootcamp ini.
    //                                 {referralInfo.hasActive && ' Kode referral Anda akan tetap tersimpan.'}
    //                             </p>

    //                             <div className="flex flex-col gap-3 sm:flex-row">
    //                                 <Button
    //                                     asChild
    //                                     size="lg"
    //                                     className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
    //                                 >
    //                                     <a href={loginUrl}>
    //                                         <User className="mr-2 h-4 w-4" />
    //                                         Login Sekarang
    //                                     </a>
    //                                 </Button>
    //                                 <Button asChild variant="outline" size="lg" className="flex-1 border-2">
    //                                     <Link href={route('register', referralInfo.code ? { ref: referralInfo.code } : {})}>Buat Akun Baru</Link>
    //                                 </Button>
    //                             </div>
    //                         </div>
    //                     </Card>
    //                 </motion.div>
    //             </section>
    //         </UserLayout>
    //     );
    // }

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
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-4xl text-center">
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
                            {bootcamp.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-orange-100"
                        >
                            Lengkapi profil Anda terlebih dahulu untuk melanjutkan
                        </motion.p>
                    </motion.div>
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
                                    Kami memerlukan nomor telepon Anda untuk melanjutkan pendaftaran bootcamp ini.
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
            <Head title={`Checkout - ${bootcamp.title}`} />

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

                            {bootcamp.strikethrough_price > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 backdrop-blur-sm"
                                >
                                    <Tag className="h-3.5 w-3.5" />
                                    Diskon {Math.round(((bootcamp.strikethrough_price - bootcamp.price) / bootcamp.strikethrough_price) * 100)}%
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md dark:text-primary"
                            >
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(bootcamp.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} -{' '}
                                {new Date(bootcamp.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </motion.div>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl"
                        >
                            {bootcamp.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-2 max-w-3xl text-justify text-lg leading-relaxed text-zinc-700 dark:text-zinc-300"
                        >
                            {bootcamp.description}
                        </motion.p>
                    </div>
                </motion.div>
            </section>

            {/* Main Content */}
            <section className="mx-auto my-8 w-full max-w-7xl px-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Bootcamp Details */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
                        <Tabs defaultValue="detail" className="w-full">
                            <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white/60 p-1.5 shadow-lg backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                <TabsList className="grid h-auto w-full grid-cols-2 bg-transparent gap-2">
                                    <TabsTrigger value="detail" className="gap-2 rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                        <BadgeCheck className="h-4 w-4" />
                                        <span className="hidden sm:inline">Detail Bootcamp</span>
                                        <span className="sm:hidden">Detail</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="curriculum" className="gap-2 rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                        <Star className="h-4 w-4" />
                                        <span className="hidden sm:inline">Kurikulum</span>
                                        <span className="sm:hidden">Materi</span>
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="detail" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div className="mb-6">
                                        <h2 className="mb-2 text-2xl font-bold">Yang Akan Kamu Dapatkan</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Manfaat yang akan kamu peroleh setelah mengikuti bootcamp ini
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

                                    <div className="mt-8">
                                        <h2 className="mb-4 text-2xl font-bold">Persyaratan Peserta</h2>
                                        <div className="space-y-2">
                                            {requirementList.map((requirement, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-3 rounded-lg border bg-gray-50 p-3 dark:bg-gray-900/50"
                                                >
                                                    <BadgeCheck size={18} className="mt-1 min-w-6 flex-shrink-0 text-blue-600" />
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{requirement}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="curriculum" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                                <Card className="border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div className="mb-6">
                                        <h2 className="mb-2 text-2xl font-bold">Kurikulum Pembelajaran</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Daftar materi yang akan dipelajari selama bootcamp</p>
                                    </div>

                                    <div className="space-y-3">
                                        {curriculumList.map((curriculum, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * idx }}
                                                className="flex items-start gap-4 rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-blue-950/20 dark:to-indigo-950/20"
                                            >
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-white shadow-lg">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-300">{curriculum}</p>
                                            </motion.div>
                                        ))}
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
                        {!isLoggedIn && (
                            <Card className="mt-6 border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                <form className="flex flex-col gap-6 p-6" onSubmit={submit}>
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
                                                onClick={async () => {
                                                    if (!data.email || !data.email.includes('@')) {
                                                        toast.error('Masukkan email yang valid');
                                                        return;
                                                    }
                                                    setCheckingEmail(true);
                                                    try {
                                                        const response = await axios.post('/api/check-email', {
                                                            email: data.email,
                                                        });
                                                        if (response.data.exists) {
                                                            setEmailExists(true);
                                                            setData('name', response.data.name || '');
                                                            setData('phone_number', response.data.phone_number || '');
                                                            toast.success('Email ditemukan!');
                                                        } else {
                                                            setEmailExists(false);
                                                            toast.info('Email tidak terdaftar');
                                                        }
                                                    } catch (error) {
                                                        console.error('Error checking email:', error);
                                                        setEmailExists(false);
                                                        toast.error('Gagal mengecek email');
                                                    } finally {
                                                        setCheckingEmail(false);
                                                    }
                                                }}
                                                disabled={checkingEmail || !data.email}
                                                className="flex-shrink-0"
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
                                            Anda sudah terdaftar di bootcamp ini. Silakan masuk ke grup.
                                        </p>

                                        <Button
                                            asChild
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        >
                                            <a href={bootcamp.group_url ?? ''} target="_blank" rel="noopener noreferrer">
                                                Masuk Group Bootcamp
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
                            ) : !showFreeForm ? (
                                <Card className="overflow-hidden border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div className="bg-primary/90 border-b border-primary/20 p-4 backdrop-blur-md">
                                        <h2 className="text-center text-lg font-bold text-white">
                                            {isFree ? 'Pendaftaran Gratis' : 'Detail Pembayaran'}
                                        </h2>
                                    </div>

                                    <form onSubmit={handleCheckout} className="p-6">
                                        {isFree ? (
                                            <div className="mb-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center dark:from-green-950/20 dark:to-emerald-950/20">
                                                <Gift className="mx-auto mb-3 h-12 w-12 text-green-600" />
                                                <p className="mb-2 text-2xl font-bold text-green-600">BOOTCAMP GRATIS</p>
                                                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Dapatkan akses penuh tanpa biaya</p>
                                                <div className="space-y-2 text-left text-sm text-gray-700 dark:text-gray-300">
                                                    <p className="font-semibold">Untuk mendapatkan akses gratis:</p>
                                                    <ul className="space-y-1">
                                                        {bootcamp.requirement_1 && <li>• {bootcamp.requirement_1}</li>}
                                                        {bootcamp.requirement_2 && <li>• {bootcamp.requirement_2}</li>}
                                                        {bootcamp.requirement_3 && <li>• {bootcamp.requirement_3}</li>}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Bootcamp Thumbnail */}
                                                {bootcamp.thumbnail && (
                                                    <div className="mb-6 overflow-hidden rounded-lg border">
                                                        <img
                                                            src={
                                                                bootcamp.thumbnail.startsWith('http') || bootcamp.thumbnail.startsWith('/storage')
                                                                    ? bootcamp.thumbnail
                                                                    : `/storage/${bootcamp.thumbnail}`
                                                            }
                                                            alt={bootcamp.title}
                                                            className="h-40 w-full object-cover"
                                                        />
                                                    </div>
                                                )}

                                                {/* Promo Code Section */}
                                                <div className="mb-6 space-y-2">
                                                    <Label htmlFor="promo-code" className="flex items-center gap-2 text-sm font-medium">
                                                        <Tag className="h-4 w-4" />
                                                        Punya Kode Promo?
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <Input
                                                                id="promo-code"
                                                                type="text"
                                                                placeholder="Masukkan kode promo"
                                                                value={promoCode}
                                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                                className="pr-10"
                                                            />
                                                            {promoLoading && (
                                                                <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                                                    <LoaderCircle className="h-4 w-4 animate-spin text-gray-400" />
                                                                </div>
                                                            )}
                                                            {!promoLoading && promoCode && (
                                                                <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                                                    {discountData?.valid ? (
                                                                        <Check className="h-5 w-5 text-green-600" />
                                                                    ) : promoError ? (
                                                                        <X className="h-5 w-5 text-red-600" />
                                                                    ) : null}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={async () => {
                                                                if (!promoCode.trim()) {
                                                                    toast.error('Masukkan kode promo terlebih dahulu');
                                                                    return;
                                                                }
                                                                await validatePromoCode();
                                                            }}
                                                            disabled={promoLoading || !promoCode.trim()}
                                                            className="flex-shrink-0"
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                        </Button>
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
                                                    {bootcamp.strikethrough_price > 0 && (
                                                        <>
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">Harga Asli</span>
                                                                <span className="font-medium text-gray-500 line-through">
                                                                    Rp {bootcamp.strikethrough_price.toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">Diskon</span>
                                                                <span className="font-semibold text-red-600">
                                                                    -Rp {(bootcamp.strikethrough_price - bootcamp.price).toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                            <Separator />
                                                        </>
                                                    )}

                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">Harga Bootcamp</span>
                                                        <span className="font-semibold">Rp {bootcamp.price.toLocaleString('id-ID')}</span>
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
                                                        <span className="text-2xl font-bold text-orange-600">
                                                            Rp {totalPrice.toLocaleString('id-ID')}
                                                        </span>
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
                                                    <Upload className="mr-2 h-5 w-5" />
                                                    Upload Bukti Follow
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
                            ) : (
                                <Card className="overflow-hidden border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                                    <div className="border-b border-green-500/20 bg-gradient-to-r from-green-600/90 to-emerald-600/90 p-4 backdrop-blur-md">
                                        <h2 className="text-center text-lg font-bold text-white">Upload Bukti Follow & Tag</h2>
                                    </div>

                                    <form onSubmit={handleFreeCheckout} className="p-6">
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((index) => {
                                                const requirementKey = `requirement_${index}` as keyof Bootcamp;
                                                const proofKey = `requirement_${index}_proof` as const;
                                                const requirementText =
                                                    (bootcamp[requirementKey] as string | null | undefined) || `Persyaratan ${index}`;

                                                return (
                                                    <div key={index}>
                                                        <Label htmlFor={proofKey}>Bukti: {requirementText}</Label>
                                                        <Input
                                                            id={proofKey}
                                                            data-field={proofKey}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(proofKey, e.target.files?.[0] || null)}
                                                            className={fileErrors[proofKey] ? 'border-red-500' : ''}
                                                            required
                                                        />
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Screenshot atau bukti untuk: {requirementText} (Maks. 2MB)
                                                        </p>
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
