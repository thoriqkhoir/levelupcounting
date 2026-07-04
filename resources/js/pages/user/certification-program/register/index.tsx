import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserLayout from '@/layouts/user-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    BadgeCheck,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Gift,
    GraduationCap,
    Loader2,
    LoaderCircle,
    Lock,
    RefreshCw,
    Tag,
    User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Mentor {
    id: string;
    name: string;
}
interface Schedule {
    id: string;
    schedule_date?: string;
    start_date?: string;
}

interface Program {
    id: string;
    title: string;
    slug: string;
    description?: string;
    benefits?: string;
    terms_conditions?: string | null;
    scholarship_flow?: string | null;
    type: 'regular' | 'scholarship';
    price: number;
    scholarship_price?: number;
    strikethrough_price?: number;
    thumbnail?: string | null;
    registration_deadline?: string;
    mentors: Mentor[];
    schedules: Schedule[];
    document_required?: boolean;
    document_description?: string | null;
}

interface Application {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
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

interface GuestFormData {
    name: string;
    email: string;
    phone_number: string;
    instance: string;
    city: string;
}

interface PendingCheckoutData {
    programSlug: string;
    timestamp: number;
    promoCode: string;
    termsAccepted: boolean;
    discountData: DiscountData | null;
    needsDocumentUpload?: boolean;
}

interface ListItem {
    text: string;
    html?: string;
}

function parseList(items?: string | null): ListItem[] {
    if (!items) return [];
    const matches = items.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map((li) => {
        const html = li.replace(/<\/?li>/g, '').trim();
        const text = html.replace(/<[^>]*>/g, '').trim();
        return { text, html };
    });
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) return error.message;
    return fallback;
}

interface RegisterProps {
    program: Program;
    hasAccess: boolean;
    pendingInvoiceUrl?: string | null;
    regularApplication?: Application | null;
    scholarshipApplication?: Application | null;
    isScholarship: boolean;
}

export default function Register({
    program,
    hasAccess,
    pendingInvoiceUrl,
    regularApplication,
    scholarshipApplication,
    isScholarship,
}: RegisterProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user as
        | {
              name?: string;
              email?: string;
              phone_number?: string;
              instance?: string;
              city?: string;
          }
        | null
        | undefined;
    const isLoggedIn = !!user;
    const isProfileComplete = !!(isLoggedIn && user?.phone_number && user?.instance && user?.city);

    const [isLoading, setIsLoading] = useState(false);
    const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
    const [documentAttachment, setDocumentAttachment] = useState<File | null>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [discountData, setDiscountData] = useState<DiscountData | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [guestScholarshipStatus, setGuestScholarshipStatus] = useState<string | null>(null);
    const [guestFormData, setGuestFormData] = useState<GuestFormData>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone_number: user?.phone_number ?? '',
        instance: user?.instance ?? '',
        city: (user as any)?.city ?? '',
    });

    const formatRupiah = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const isApprovedScholarship = scholarshipApplication?.status === 'approved' || guestScholarshipStatus === 'approved';
    const isScholarshipNotApproved = program.type === 'scholarship' && !isApprovedScholarship;
    const displayPrice = isScholarshipNotApproved ? 0 : (isScholarship && program.scholarship_price ? program.scholarship_price : program.price);
    const deadline = program.registration_deadline ? new Date(program.registration_deadline) : null;
    const getDate = (s: Schedule) => s.schedule_date || s.start_date || '';
    const requiresDocumentUpload = program.type === 'regular' && !!program.document_required && !isScholarship;
    const documentStatus = regularApplication?.status ?? null;
    const hasApprovedDocument = !requiresDocumentUpload || documentStatus === 'approved';
    const isDocumentPending = documentStatus === 'pending';
    const isDocumentRejected = documentStatus === 'rejected';

    const updateGuestForm = (field: keyof GuestFormData, value: string) => {
        setGuestFormData((prev) => ({ ...prev, [field]: value }));
    };

    const isGuestFormComplete = useCallback(() => {
        if (isLoggedIn) return true;

        const hasEmail = !!guestFormData.email;
        const hasPhone = !!guestFormData.phone_number;
        const hasName = !!guestFormData.name || emailExists;
        const hasInstance = !!guestFormData.instance;
        const hasCity = !!guestFormData.city;

        return hasEmail && hasPhone && hasName && hasInstance && hasCity;
    }, [isLoggedIn, guestFormData, emailExists]);

    const validatePromoCode = useCallback(async () => {
        if (!promoCode.trim() || displayPrice === 0) return;

        setPromoLoading(true);
        setPromoError('');

        try {
            const requestData: Record<string, string | number> = {
                code: promoCode,
                amount: displayPrice,
                product_type: 'certification_program',
                product_id: program.id,
            };

            if (!isLoggedIn && emailExists && guestFormData.email) {
                requestData.email = guestFormData.email;
            }

            const response = await axios.post('/api/discount-codes/validate', requestData);
            const data = response.data;

            if (data.valid) {
                setDiscountData(data);
                setPromoError('');
            } else {
                setDiscountData(null);
                setPromoError(data.message || 'Kode promo tidak valid');
            }
        } catch (error: unknown) {
            setDiscountData(null);
            if (axios.isAxiosError(error)) {
                setPromoError(error.response?.data?.message || 'Terjadi kesalahan saat memvalidasi kode promo');
            } else {
                setPromoError('Terjadi kesalahan saat memvalidasi kode promo');
            }
        } finally {
            setPromoLoading(false);
        }
    }, [displayPrice, emailExists, guestFormData.email, isLoggedIn, program.id, promoCode]);

    useEffect(() => {
        if (!promoCode.trim() || displayPrice === 0) {
            setDiscountData(null);
            setPromoError('');
            return;
        }

        const timer = setTimeout(() => {
            validatePromoCode();
        }, 500);

        return () => clearTimeout(timer);
    }, [displayPrice, promoCode, validatePromoCode]);

    useEffect(() => {
        if (isLoggedIn) return;

        const email = guestFormData.email.trim();
        if (!email || !email.includes('@')) {
            setEmailExists(false);
            return;
        }

        const timer = setTimeout(async () => {
            setCheckingEmail(true);

            try {
                const response = await axios.post('/api/check-email', {
                    email,
                    program_id: program.id,
                });
                const data = response.data;

                if (data.exists) {
                    setEmailExists(true);
                    setGuestFormData((prev) => ({
                        ...prev,
                        name: data.name || prev.name,
                        phone_number: data.phone_number || prev.phone_number,
                        instance: data.instance || prev.instance,
                        city: data.city || prev.city,
                    }));
                } else {
                    setEmailExists(false);
                }

                // Always check and store scholarship application status, regardless of user existence
                if (data.scholarship_application_status) {
                    setGuestScholarshipStatus(data.scholarship_application_status);
                } else {
                    setGuestScholarshipStatus(null);
                }
            } catch {
                setEmailExists(false);
                setGuestScholarshipStatus(null);
            } finally {
                setCheckingEmail(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [guestFormData.email, isLoggedIn, program.id]);

    const savePendingCheckout = useCallback(
        (needsDocumentUpload = false) => {
            const pendingCheckoutData: PendingCheckoutData = {
                programSlug: program.slug,
                timestamp: Date.now(),
                promoCode,
                termsAccepted,
                discountData,
                needsDocumentUpload,
            };

            sessionStorage.setItem('pendingCertificationCheckout', JSON.stringify(pendingCheckoutData));
        },
        [discountData, program.slug, promoCode, termsAccepted],
    );

    const refreshCSRFToken = useCallback(async (): Promise<string> => {
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
    }, []);

    const ensureAuthenticated = useCallback(async (): Promise<boolean> => {
        if (isLoggedIn) return true;

        if (!guestFormData.email || !guestFormData.phone_number || !guestFormData.instance || !guestFormData.city) {
            toast.error('Lengkapi semua data diri terlebih dahulu.');
            return false;
        }

        setIsLoading(true);

        try {
            if (emailExists) {
                const loginResponse = await axios.post(route('auto-login'), {
                    email: guestFormData.email,
                    phone_number: guestFormData.phone_number,
                    instance: guestFormData.instance,
                    city: guestFormData.city,
                });

                const loginData = loginResponse.data;
                if (!loginData.success) {
                    throw new Error(loginData.message || 'Gagal login otomatis.');
                }

                toast.success('Login berhasil. Melanjutkan pendaftaran...');
            } else {
                if (!guestFormData.name) {
                    toast.error('Nama wajib diisi.');
                    setIsLoading(false);
                    return false;
                }

                await axios.post(route('register'), {
                    name: guestFormData.name,
                    email: guestFormData.email,
                    phone_number: guestFormData.phone_number,
                    instance: guestFormData.instance,
                    city: guestFormData.city,
                    password: guestFormData.phone_number,
                    password_confirmation: guestFormData.phone_number,
                });

                toast.success('Registrasi berhasil. Melanjutkan pendaftaran...');
            }

            savePendingCheckout();
            window.location.reload();
            return false;
        } catch (error: unknown) {
            setIsLoading(false);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Gagal memproses login/registrasi otomatis.');
            } else {
                toast.error(getErrorMessage(error, 'Gagal memproses login/registrasi otomatis.'));
            }
            return false;
        }
    }, [emailExists, guestFormData.email, guestFormData.instance, guestFormData.city, guestFormData.name, guestFormData.phone_number, isLoggedIn, savePendingCheckout]);

    // Show scholarship prompt only when the user hasn't applied yet or their application was rejected.
    // For guests, consider `guestScholarshipStatus` returned by `/api/check-email`.
    const showScholarshipWarning = !!(
        isScholarship &&
        ((!scholarshipApplication && !guestScholarshipStatus) ||
            (scholarshipApplication && scholarshipApplication.status === 'rejected') ||
            guestScholarshipStatus === 'rejected')
    );

    // Determine if scholarship is not approved (either for logged user or guest)
    const scholarshipNotApproved = !!(
        isScholarship &&
        ((scholarshipApplication && scholarshipApplication.status !== 'approved') ||
            (guestScholarshipStatus && guestScholarshipStatus !== 'approved'))
    );

    const handleDocumentSubmit = () => {
        if (!documentAttachment) {
            toast.error('Pilih dokumen pendukung terlebih dahulu');
            return;
        }

        const formData = new FormData();
        formData.append('document_attachment', documentAttachment);

        router.post(route('certification-programs.apply-regular', program.slug), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsDocumentDialogOpen(false);
                setDocumentAttachment(null);
                toast.success('Dokumen berhasil dikirim. Menunggu verifikasi admin.');
            },
            onError: () => {
                toast.error('Gagal mengirim dokumen pendukung');
            },
        });
    };

    const submitPayment = useCallback(
        async (retryCount = 0): Promise<void> => {
            const originalDiscountAmount =
                program.strikethrough_price && program.strikethrough_price > 0 ? program.strikethrough_price - program.price : 0;
            const promoDiscountAmount = discountData?.valid ? discountData.discount_amount : 0;
            const activeFinalPrice = displayPrice - promoDiscountAmount;
            const adminFee = displayPrice === 0 ? 0 : 5000;
            const invoiceData: Record<string, string | number> = {
                type: 'certification_program',
                id: program.id,
                discount_amount: originalDiscountAmount + promoDiscountAmount,
                nett_amount: activeFinalPrice,
                transaction_fee: adminFee,
                total_amount: activeFinalPrice + adminFee,
                isScholarship: isScholarship ? 1 : 0,
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
                    await refreshCSRFToken();
                    return submitPayment(retryCount + 1);
                }

                const data = await res.json();

                if (res.ok && data.success) {
                    if (data.payment_url) {
                        sessionStorage.removeItem('pendingCertificationCheckout');
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
        },
        [displayPrice, discountData, program.id, program.price, program.strikethrough_price, isScholarship, refreshCSRFToken],
    );

    const handleCheckout = useCallback(async () => {
        if (!termsAccepted && displayPrice > 0) {
            toast.error('Anda harus menyetujui syarat dan ketentuan.');
            return;
        }

        // Check if guest form is complete before proceeding
        if (!isLoggedIn && !isGuestFormComplete()) {
            toast.error('Lengkapi semua data diri terlebih dahulu.');
            return;
        }

        const authenticated = await ensureAuthenticated();
        if (!authenticated) {
            return;
        }

        if (!isProfileComplete) {
            window.location.href = route('profile.edit');
            return;
        }

        if (requiresDocumentUpload && !hasApprovedDocument) {
            if (isDocumentPending || isDocumentRejected) {
                return;
            }

            setIsDocumentDialogOpen(true);
            return;
        }

        setIsLoading(true);

        try {
            await submitPayment();
        } catch (error) {
            toast.error(getErrorMessage(error, 'Terjadi kesalahan saat proses pembayaran.'));
            setIsLoading(false);
        }
    }, [
        displayPrice,
        ensureAuthenticated,
        hasApprovedDocument,
        isDocumentPending,
        isDocumentRejected,
        isProfileComplete,
        requiresDocumentUpload,
        submitPayment,
        termsAccepted,
        isLoggedIn,
        isGuestFormComplete,
    ]);

    const ensureAuthenticatedForDocument = useCallback(async () => {
        if (!guestFormData.email || !guestFormData.phone_number || !guestFormData.instance || !guestFormData.city) {
            toast.error('Lengkapi semua data diri terlebih dahulu.');
            return;
        }

        setIsLoading(true);

        try {
            if (emailExists) {
                const loginResponse = await axios.post(route('auto-login'), {
                    email: guestFormData.email,
                    phone_number: guestFormData.phone_number,
                    instance: guestFormData.instance,
                    city: guestFormData.city,
                });

                const loginData = loginResponse.data;
                if (!loginData.success) {
                    throw new Error(loginData.message || 'Gagal login otomatis.');
                }

                toast.success('Login berhasil. Membuka form upload dokumen...');
            } else {
                if (!guestFormData.name) {
                    toast.error('Nama wajib diisi.');
                    setIsLoading(false);
                    return;
                }

                await axios.post(route('register'), {
                    name: guestFormData.name,
                    email: guestFormData.email,
                    phone_number: guestFormData.phone_number,
                    instance: guestFormData.instance,
                    city: guestFormData.city,
                    password: guestFormData.phone_number,
                    password_confirmation: guestFormData.phone_number,
                });

                toast.success('Registrasi berhasil. Membuka form upload dokumen...');
            }

            savePendingCheckout(true);
            window.location.reload();
        } catch (error: unknown) {
            setIsLoading(false);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Gagal memproses login/registrasi otomatis.');
            } else {
                toast.error(getErrorMessage(error, 'Gagal memproses login/registrasi otomatis.'));
            }
        }
    }, [emailExists, guestFormData.email, guestFormData.instance, guestFormData.city, guestFormData.name, guestFormData.phone_number, savePendingCheckout]);

    useEffect(() => {
        if (!isLoggedIn) return;

        const pendingCheckoutRaw = sessionStorage.getItem('pendingCertificationCheckout');
        if (!pendingCheckoutRaw) return;

        try {
            const pendingCheckout = JSON.parse(pendingCheckoutRaw) as PendingCheckoutData;

            const fiveMinutes = 5 * 60 * 1000;
            if (Date.now() - pendingCheckout.timestamp > fiveMinutes) {
                sessionStorage.removeItem('pendingCertificationCheckout');
                return;
            }

            if (pendingCheckout.programSlug !== program.slug) {
                sessionStorage.removeItem('pendingCertificationCheckout');
                return;
            }

            // Check if pending document upload
            if (pendingCheckout.needsDocumentUpload) {
                sessionStorage.removeItem('pendingCertificationCheckout');
                setIsDocumentDialogOpen(true);
                return;
            }

            if (pendingCheckout.promoCode) {
                setPromoCode(pendingCheckout.promoCode);
            }

            setTermsAccepted(pendingCheckout.termsAccepted || false);
            setDiscountData(pendingCheckout.discountData || null);
            sessionStorage.removeItem('pendingCertificationCheckout');

            void handleCheckout();
        } catch {
            sessionStorage.removeItem('pendingCertificationCheckout');
        }
    }, [handleCheckout, isLoggedIn, program.slug]);

    if (hasAccess) {
        return (
            <UserLayout>
                <Head title={`Terdaftar - ${program.title}`} />
                <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-800">
                    <div className="to-primary relative overflow-hidden bg-gradient-to-tl from-black px-4 py-8 md:py-12">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 size-96 rounded-full bg-white blur-3xl" />
                            <div className="absolute right-0 bottom-0 size-96 rounded-full bg-white blur-3xl" />
                        </div>
                        <div className="relative mx-auto w-full max-w-3xl text-center">
                            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-300" />
                            <h1 className="text-3xl font-bold text-white md:text-4xl">Anda Sudah Terdaftar!</h1>
                            <p className="mt-2 text-blue-100 md:text-lg">Akses materi pembelajaran tersedia di dashboard.</p>
                        </div>
                    </div>
                    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-8">
                        <Button asChild className="w-full">
                            <Link href={route('user.dashboard')}>Ke Dashboard</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={route('certification-programs.index')}>Lihat Program Lain</Link>
                        </Button>
                    </div>
                </div>
            </UserLayout>
        );
    }

    if (isLoggedIn && !isProfileComplete) {
        return (
            <UserLayout>
                <Head title={`Daftar - ${program.title}`} />
                <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-800">
                    <div className="to-primary relative overflow-hidden bg-gradient-to-tl from-black px-4 py-8 md:py-12">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 size-96 rounded-full bg-white blur-3xl" />
                            <div className="absolute right-0 bottom-0 size-96 rounded-full bg-white blur-3xl" />
                        </div>
                        <div className="relative mx-auto w-full max-w-3xl text-center">
                            <User className="mx-auto mb-4 h-16 w-16 text-amber-300" />
                            <h1 className="text-3xl font-bold text-white md:text-4xl">Profil Belum Lengkap</h1>
                            <p className="mt-2 text-blue-100 md:text-lg">
                                Silakan lengkapi nomor telepon, instansi, dan kota domisili terlebih dahulu sebelum melanjutkan pendaftaran.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-8">
                        <Button asChild className="w-full">
                            <Link href={route('profile.edit', { redirect: window.location.href })}>Lengkapi Profil</Link>
                        </Button>
                    </div>
                </div>
            </UserLayout>
        );
    }

    const handlePrimaryAction = () => {
        if (requiresDocumentUpload && !hasApprovedDocument) {
            if (isDocumentPending || isDocumentRejected) {
                return;
            }

            // If guest, need to authenticate first
            if (!isLoggedIn) {
                if (!isGuestFormComplete()) {
                    toast.error('Lengkapi semua data diri terlebih dahulu.');
                    return;
                }

                // Proceed with auto-login/register
                void ensureAuthenticatedForDocument();
                return;
            }

            setIsDocumentDialogOpen(true);
            return;
        }

        void handleCheckout();
    };

    const requirementList = parseList(program.terms_conditions || program.scholarship_flow);
    const benefitList = parseList(program.benefits);

    return (
        <UserLayout>
            <Head title={`Daftar - ${program.title}`} />

            {/* Hero Section */}
            <section className="from-primary to-primary-foreground relative overflow-hidden bg-gradient-to-br px-4 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-7xl">
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                        {displayPrice === 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-white px-3 py-1.5 text-sm font-medium text-green-600 backdrop-blur-sm"
                            >
                                <Gift className="h-3.5 w-3.5" />
                                Gratis
                            </motion.div>
                        )}

                        {program.strikethrough_price && program.strikethrough_price > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-red-700 bg-red-200 px-3 py-1.5 text-sm font-medium text-red-600 backdrop-blur-sm"
                            >
                                <Tag className="h-3.5 w-3.5" />
                                Diskon {Math.round(((program.strikethrough_price - displayPrice) / program.strikethrough_price) * 100)}%
                            </motion.div>
                        )}

                        {program.schedules.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-sm font-medium text-white shadow-lg backdrop-blur-md"
                            >
                                <Calendar className="h-3.5 w-3.5" />
                                {format(new Date(getDate(program.schedules[0])), 'dd MMMM yyyy', { locale: idLocale })}
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className={`inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-md ${isScholarship ? 'bg-purple-500/20 text-purple-100' : 'bg-white/20 text-white'}`}
                        >
                            <GraduationCap className="h-3.5 w-3.5" />
                            {isScholarship ? 'Beasiswa' : 'Reguler'}
                        </motion.div>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
                    >
                        {program.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6 max-w-3xl text-justify text-lg text-blue-100"
                    >
                        {program.description}
                    </motion.p>
                </motion.div>
            </section>

            {/* Main Content */}
            <section className="mx-auto my-8 w-full max-w-7xl px-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Details & Forms */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6 lg:col-span-2"
                    >
                        <Tabs defaultValue="detail" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="detail" className="gap-2">
                                    <BadgeCheck className="h-4 w-4" />
                                    <span className="hidden sm:inline">Detail Program</span>
                                    <span className="sm:hidden">Detail</span>
                                </TabsTrigger>
                                <TabsTrigger value="schedule" className="gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span className="hidden sm:inline">Jadwal Pelaksanaan</span>
                                    <span className="sm:hidden">Jadwal</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="detail" className="mt-4">
                                <Card className="p-6">
                                    {benefitList.length > 0 && (
                                        <div className="mb-8">
                                            <div className="mb-6">
                                                <h2 className="mb-2 text-2xl font-bold">Yang Akan Kamu Dapatkan</h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Manfaat yang akan kamu peroleh setelah mengikuti program ini
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
                                                        <p className="text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-300">
                                                            {benefit.html ? <span dangerouslySetInnerHTML={{ __html: benefit.html }} /> : benefit.text}
                                                        </p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {requirementList.length > 0 && (
                                        <div className="mt-8">
                                            <h2 className="mb-4 text-2xl font-bold">Persyaratan Peserta</h2>
                                            <div className="space-y-2">
                                                {requirementList.map((requirement, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-start gap-3 rounded-lg border bg-gray-50 p-3 dark:bg-gray-900/50"
                                                    >
                                                        <BadgeCheck size={18} className="mt-1 min-w-6 flex-shrink-0 text-blue-600" />
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                            {requirement.html ? <span dangerouslySetInnerHTML={{ __html: requirement.html }} /> : requirement.text}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {program.mentors && program.mentors.length > 0 && (
                                        <div className="mt-8">
                                            <h2 className="mb-4 text-2xl font-bold">Mentor Program</h2>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {program.mentors.map((mentor, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-zinc-800"
                                                    >
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50">
                                                            <User size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">{mentor.name}</h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Mentor Profesional</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </TabsContent>

                            <TabsContent value="schedule" className="mt-4">
                                <Card className="p-6">
                                    <div className="mb-6">
                                        <h2 className="mb-2 text-2xl font-bold">Jadwal Pelaksanaan</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Daftar jadwal pertemuan selama program berlangsung</p>
                                    </div>

                                    <div className="space-y-3">
                                        {program.schedules.map((schedule, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * idx }}
                                                className="flex items-center justify-between rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-blue-950/20 dark:to-indigo-950/20"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-white shadow-lg">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">Pertemuan {idx + 1}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm dark:bg-zinc-800 dark:text-gray-300">
                                                    <Calendar size={14} className="text-blue-500" />
                                                    {format(new Date(getDate(schedule)), 'dd MMMM yyyy', { locale: idLocale })}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {!isLoggedIn && (
                            <Card className="p-6">
                                <form
                                    className="flex flex-col gap-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    <div className="mb-2">
                                        <h1 className="text-xl font-bold">Masukkan Data Diri Anda</h1>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Isi data di bawah ini. Sistem akan melanjutkan ke login atau registrasi otomatis.
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="guest-email">Email</Label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Input
                                                    id="guest-email"
                                                    type="email"
                                                    required
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    value={guestFormData.email}
                                                    onChange={(e) => updateGuestForm('email', e.target.value)}
                                                    disabled={isLoading}
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
                                        </div>
                                        {emailExists && <p className="text-xs text-green-600">Email ditemukan, data terisi otomatis</p>}
                                    </div>
                                    <div className="grid gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="guest-name">Nama</Label>
                                            <Input
                                                id="guest-name"
                                                type="text"
                                                required
                                                tabIndex={2}
                                                autoComplete="name"
                                                value={guestFormData.name}
                                                onChange={(e) => updateGuestForm('name', e.target.value)}
                                                disabled={isLoading || emailExists}
                                                placeholder="Nama lengkap Anda"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="guest-phone">No. Telepon</Label>
                                            <Input
                                                id="guest-phone"
                                                type="tel"
                                                required
                                                tabIndex={3}
                                                autoComplete="tel"
                                                value={guestFormData.phone_number}
                                                onChange={(e) => updateGuestForm('phone_number', e.target.value)}
                                                disabled={isLoading || emailExists}
                                                placeholder="08xxxxxxxxxx"
                                            />
                                            {!emailExists && (
                                                <p className="text-xs text-gray-500">Nomor telepon akan digunakan sebagai password anda</p>
                                            )}
                                            {emailExists && (
                                                <p className="text-xs text-blue-600">Pastikan nomor telepon sesuai dengan yang terdaftar</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2 pb-2">
                                            <Label htmlFor="guest-instance">Instansi/Perusahaan</Label>
                                            <Input
                                                id="guest-instance"
                                                type="text"
                                                tabIndex={4}
                                                autoComplete="organization"
                                                value={guestFormData.instance}
                                                onChange={(e) => updateGuestForm('instance', e.target.value)}
                                                disabled={isLoading}
                                                placeholder="Instansi atau perusahaan Anda"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2 pb-2">
                                            <Label htmlFor="guest-city">Kota Domisili</Label>
                                            <Input
                                                id="guest-city"
                                                type="text"
                                                tabIndex={5}
                                                autoComplete="city"
                                                value={guestFormData.city}
                                                onChange={(e) => updateGuestForm('city', e.target.value)}
                                                disabled={isLoading}
                                                placeholder="Kota domisili Anda"
                                                required
                                            />
                                        </div>
                                    </div>
                                </form>
                            </Card>
                        )}

                        {/* Alerts for Pending Invoice / Scholarship / Documents */}
                        {pendingInvoiceUrl && !isLoading && (
                            <Alert>
                                <Clock className="h-4 w-4" />
                                <AlertTitle>Pembayaran Menunggu</AlertTitle>
                                <AlertDescription>
                                    Anda memiliki invoice yang belum dibayar.
                                    <Button asChild size="sm" className="mt-2 w-full">
                                        <a href={pendingInvoiceUrl} target="_blank" rel="noopener noreferrer">
                                            Lanjutkan Pembayaran
                                        </a>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}
                        {requiresDocumentUpload && (
                            <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                                <Lock className="h-4 w-4 text-amber-600" />
                                <AlertTitle className="text-amber-900 dark:text-amber-200">Dokumen Pendukung Diperlukan</AlertTitle>
                                <AlertDescription className="space-y-3 text-amber-800 dark:text-amber-300">
                                    <p>{program.document_description ?? 'Program ini memerlukan dokumen pendukung sebelum pendaftaran diproses.'}</p>
                                    {!documentStatus && (
                                        <Button type="button" size="sm" className="w-full" variant="secondary" onClick={() => handlePrimaryAction()}>
                                            Upload Dokumen Pendukung
                                        </Button>
                                    )}
                                    {isDocumentPending && <p>Dokumen sudah dikirim dan sedang menunggu verifikasi admin.</p>}
                                    {isDocumentRejected && (
                                        <p className="text-red-600 dark:text-red-300">
                                            Dokumen Anda ditolak. Silakan hubungi admin untuk tindak lanjut.
                                        </p>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                        {showScholarshipWarning && (
                            <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                                <Lock className="h-4 w-4 text-amber-600" />
                                <AlertTitle className="text-amber-900 dark:text-amber-200">Aplikasi Beasiswa Diperlukan</AlertTitle>
                                <AlertDescription className="text-amber-800 dark:text-amber-300">
                                    Silakan ajukan aplikasi beasiswa dan tunggu persetujuan admin.
                                    <Button asChild size="sm" className="mt-2 w-full" variant="secondary">
                                        <Link href={route('certification-programs.scholarship-apply', program.slug)}>Ajukan Beasiswa</Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}
                        {regularApplication && regularApplication.status !== 'approved' && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Status Dokumen: {regularApplication.status}</AlertTitle>
                                <AlertDescription>
                                    {regularApplication.status === 'pending' ? (
                                        'Dokumen Anda sedang diverifikasi oleh admin.'
                                    ) : (
                                        <span className="text-red-600 dark:text-red-300">Dokumen Anda ditolak. Silakan ajukan ulang.</span>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                        {scholarshipApplication && scholarshipApplication.status !== 'approved' && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Status Beasiswa: {scholarshipApplication.status}</AlertTitle>
                                <AlertDescription>
                                    {scholarshipApplication.status === 'pending' ? (
                                        'Aplikasi beasiswa Anda sedang diverifikasi oleh admin.'
                                    ) : (
                                        <span className="text-red-600 dark:text-red-300">Aplikasi beasiswa Anda ditolak. Silakan ajukan ulang.</span>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}

                        {guestScholarshipStatus && guestScholarshipStatus !== 'approved' && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Status Beasiswa: {guestScholarshipStatus}</AlertTitle>
                                <AlertDescription>
                                    {guestScholarshipStatus === 'pending' ? (
                                        'Aplikasi beasiswa Anda sedang diverifikasi oleh admin.'
                                    ) : (
                                        <span className="text-red-600 dark:text-red-300">Aplikasi beasiswa Anda ditolak. Silakan ajukan ulang.</span>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}

                        {guestScholarshipStatus === 'approved' && (
                            <Alert className="border-emerald-200 bg-emerald-50">
                                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                                <AlertTitle>Status Beasiswa: Disetujui</AlertTitle>
                                <AlertDescription>Pengajuan beasiswa Anda telah disetujui. Silakan lanjutkan pendaftaran.</AlertDescription>
                            </Alert>
                        )}
                    </motion.div>

                    {/* Right Column - Checkout Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1">
                        <div className="sticky top-4">
                            <Card className="overflow-hidden border-2">
                                <div className="bg-primary border-b p-4">
                                    <h2 className="text-center text-lg font-bold text-white">
                                        {displayPrice === 0 ? 'Pendaftaran Gratis' : 'Detail Pembayaran'}
                                    </h2>
                                </div>

                                <div className="p-6">
                                    {/* Thumbnail */}
                                    {program.thumbnail && (
                                        <div className="mb-6 overflow-hidden rounded-lg border">
                                            <img
                                                src={
                                                    program.thumbnail.startsWith('http') || program.thumbnail.startsWith('/storage')
                                                        ? program.thumbnail
                                                        : `/storage/${program.thumbnail}`
                                                }
                                                alt={program.title}
                                                className="h-40 w-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {displayPrice > 0 && (
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
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={validatePromoCode}
                                                    disabled={promoLoading || !promoCode.trim()}
                                                    className="flex-shrink-0"
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {promoError && <p className="text-sm text-red-600">{promoError}</p>}

                                            {discountData?.valid && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="mt-3 rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:from-green-950/20 dark:to-emerald-950/20"
                                                >
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                                                            <Check className="h-4 w-4 text-white" />
                                                        </div>
                                                        <p className="font-semibold text-green-800 dark:text-green-200">Kode Promo Diterapkan!</p>
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
                                    )}

                                    {/* Price Breakdown */}
                                    <div className="mb-6 space-y-3 rounded-lg border bg-gray-50 p-4 dark:bg-gray-900/50">
                                        {!isScholarshipNotApproved && program.strikethrough_price && program.strikethrough_price > 0 && (
                                            <>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Harga Asli</span>
                                                    <span className="font-medium text-gray-500 line-through">
                                                        {formatRupiah(program.strikethrough_price)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Diskon</span>
                                                    <span className="font-semibold text-red-600">
                                                        -{formatRupiah(program.strikethrough_price - displayPrice)}
                                                    </span>
                                                </div>
                                                <Separator />
                                            </>
                                        )}

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Harga Program</span>
                                            <span className="font-semibold">{formatRupiah(displayPrice)}</span>
                                        </div>

                                        {discountData?.valid && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                    <Gift className="h-3.5 w-3.5" />
                                                    Promo ({discountData.discount_code.code})
                                                </span>
                                                <span className="font-semibold text-green-600">-{formatRupiah(discountData.discount_amount)}</span>
                                            </div>
                                        )}

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <span className="font-bold">Total Pembayaran</span>
                                            <span className="text-2xl font-bold text-orange-600">
                                                {displayPrice === 0 ? 'GRATIS' : formatRupiah(displayPrice - (discountData?.discount_amount || 0))}
                                            </span>
                                        </div>
                                    </div>

                                    {deadline && (
                                        <div className="mt-4 mb-4 flex items-start gap-2 text-sm">
                                            <Calendar size="16" className="text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium">Batas Pendaftaran:</p>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {format(deadline, "dd MMMM yyyy 'pukul' HH:mm", { locale: idLocale })} WIB
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {displayPrice > 0 && (
                                        <div className="mt-4 mb-6 flex items-start gap-3 rounded-lg border border-dashed p-3 text-sm">
                                            <Checkbox
                                                id="terms"
                                                checked={termsAccepted}
                                                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                                                className="mt-0.5"
                                            />
                                            <Label htmlFor="terms" className="leading-5">
                                                Saya menyetujui syarat dan ketentuan pendaftaran.
                                            </Label>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Button
                                            onClick={handlePrimaryAction}
                                            disabled={
                                                isLoading ||
                                                showScholarshipWarning ||
                                                (!isLoggedIn && !isGuestFormComplete()) ||
                                                (requiresDocumentUpload && (isDocumentPending || isDocumentRejected)) ||
                                                (!!regularApplication &&
                                                    regularApplication.status !== 'approved' &&
                                                    !isScholarship &&
                                                    requiresDocumentUpload) ||
                                                scholarshipNotApproved ||
                                                (displayPrice > 0 && !termsAccepted)
                                            }
                                            className="w-full"
                                            size="lg"
                                        >
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {isLoading
                                                ? 'Memproses...'
                                                : requiresDocumentUpload && !hasApprovedDocument && !isDocumentPending && !isDocumentRejected
                                                  ? 'Upload Dokumen Pendukung'
                                                  : 'Lanjutkan ke Pembayaran'}
                                        </Button>
                                        <Button asChild variant="outline" className="w-full" size="lg">
                                            <Link href={route('certification-programs.detail', program.slug)}>← Kembali ke Detail</Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Upload Dokumen Pendukung</DialogTitle>
                        <DialogDescription>
                            {program.document_description ?? 'Unggah dokumen yang diminta agar admin dapat memverifikasi pendaftaran Anda.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                            <p className="font-semibold">Format dokumen yang diterima</p>
                            <p className="mt-1">PDF, JPG, JPEG, PNG, atau WebP. Maksimal 5 MB.</p>
                        </div>
                        <Input type="file" accept=".pdf,image/*" onChange={(event) => setDocumentAttachment(event.target.files?.[0] ?? null)} />
                        {documentAttachment && <p className="text-muted-foreground text-sm">File terpilih: {documentAttachment.name}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="button" onClick={handleDocumentSubmit} disabled={isLoading || !documentAttachment}>
                            Upload Dokumen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </UserLayout>
    );
}
