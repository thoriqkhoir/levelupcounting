import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    Building2,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Hourglass,
    QrCode,
    RefreshCw,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CourseItem {
    course: { title: string; slug: string; thumbnail?: string };
}
interface BootcampItem {
    bootcamp: { title: string; slug: string; thumbnail?: string };
}
interface WebinarItem {
    webinar: { title: string; slug: string; thumbnail?: string };
}
interface CertificationProgramItem {
    certification_program: { title: string; slug: string; thumbnail?: string };
}
interface BundleItem {
    bundle: { title: string; slug: string; thumbnail?: string };
}

interface Invoice {
    id: string;
    invoice_code: string;
    amount: number;
    nett_amount: number;
    transaction_fee: number;
    status: 'pending' | 'paid' | 'failed' | 'installment_pending';
    payment_method?: string;
    payment_channel?: string;
    payment_reference?: string;
    va_number?: string;
    qr_code_url?: string;
    created_at?: string;
    expires_at?: string;
    course_items?: CourseItem[];
    bootcamp_items?: BootcampItem[];
    webinar_items?: WebinarItem[];
    certification_program_items?: CertificationProgramItem[];
    bundle_enrollments?: BundleItem[];
}

interface PendingProps {
    invoice: Invoice;
}

export default function CheckoutPending({ invoice }: PendingProps) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isExpired, setIsExpired] = useState<boolean>(false);
    const [copiedVa, setCopiedVa] = useState<boolean>(false);
    const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [isChecking, setIsChecking] = useState<boolean>(false);

    // Hitung countdown expiry
    useEffect(() => {
        if (!invoice.expires_at) return;

        const updateTimer = () => {
            const diff = new Date(invoice.expires_at!).getTime() - new Date().getTime();
            if (diff <= 0) {
                setTimeLeft('00:00:00');
                setIsExpired(true);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const pad = (n: number) => n.toString().padStart(2, '0');
            setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [invoice.expires_at]);

    const isQris = invoice.payment_channel === 'qris';
    const isVa = !isQris && !!invoice.va_number;

    const copyToClipboard = (text: string, type: 'va' | 'amount') => {
        navigator.clipboard.writeText(text);
        if (type === 'va') {
            setCopiedVa(true);
            setTimeout(() => setCopiedVa(false), 2000);
            toast.success('Nomor Virtual Account berhasil disalin');
        } else {
            setCopiedAmount(true);
            setTimeout(() => setCopiedAmount(false), 2000);
            toast.success('Nominal pembayaran berhasil disalin');
        }
    };

    const handleCheckStatus = () => {
        setIsChecking(true);
        router.reload({
            onFinish: () => {
                setIsChecking(false);
                toast.info('Status pembayaran diperbarui');
            },
        });
    };

    const handleCancelInvoice = async () => {
        if (!confirm('Apakah Anda yakin ingin membatalkan tagihan pembayaran ini?')) return;
        setIsCancelling(true);
        try {
            await axios.post(route('invoice.cancel', invoice.id));
            toast.success('Tagihan berhasil dibatalkan');
            router.reload();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal membatalkan tagihan');
        } finally {
            setIsCancelling(false);
        }
    };

    // Nama produk
    let productTitle = 'Tagihan Pembayaran';
    if (invoice.course_items && invoice.course_items.length > 0) {
        productTitle = invoice.course_items[0].course.title;
    } else if (invoice.bootcamp_items && invoice.bootcamp_items.length > 0) {
        productTitle = invoice.bootcamp_items[0].bootcamp.title;
    } else if (invoice.webinar_items && invoice.webinar_items.length > 0) {
        productTitle = invoice.webinar_items[0].webinar.title;
    } else if (invoice.certification_program_items && invoice.certification_program_items.length > 0) {
        productTitle = invoice.certification_program_items[0].certification_program.title;
    } else if (invoice.bundle_enrollments && invoice.bundle_enrollments.length > 0) {
        productTitle = invoice.bundle_enrollments[0].bundle.title;
    }

    const bankNameMap: Record<string, string> = {
        BMRI: 'Bank Mandiri',
        BRIN: 'Bank BRI',
        BNIA: 'Bank BNI',
        BBBA: 'Bank BCA',
        BSYI: 'Bank Syariah Indonesia (BSI)',
        BDIN: 'Bank Danamon',
        BNIN: 'Bank Permata',
    };

    const bankName = bankNameMap[invoice.payment_channel || ''] || invoice.payment_channel || 'Virtual Account';

    return (
        <div className="relative min-h-screen bg-background">
            <UserLayout>
                <Head title={`Menunggu Pembayaran - ${invoice.invoice_code}`} />

                <div className="mx-auto max-w-4xl px-4 py-12">
                    {/* Status Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        {invoice.status === 'failed' ? (
                            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                                <XCircle className="h-4 w-4" />
                                Transaksi Dibatalkan / Gagal
                            </div>
                        ) : isExpired ? (
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                                <AlertCircle className="h-4 w-4" />
                                Masa Pembayaran Telah Habis
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300">
                                <Hourglass className="h-4 w-4 animate-spin text-orange-600" />
                                Menunggu Pembayaran
                            </div>
                        )}

                        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                            {invoice.status === 'failed'
                                ? 'Pembayaran Tidak Terselesaikan'
                                : 'Selesaikan Pembayaran Anda'}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            No. Invoice: <span className="font-mono font-semibold text-foreground">{invoice.invoice_code}</span>
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Main Payment Section */}
                        <div className="md:col-span-2 space-y-6">
                            {/* QRIS Card */}
                            {isQris && (
                                <Card className="overflow-hidden border border-border/60 bg-card p-6 shadow-md">
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div className="flex items-center gap-2">
                                            <QrCode className="h-6 w-6 text-primary" />
                                            <div>
                                                <h3 className="font-bold text-foreground">QRIS Dynamic (SNAP BI)</h3>
                                                <p className="text-xs text-muted-foreground">Merchant: Level Up Counting</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600">
                                            <Clock className="h-4 w-4" />
                                            <span>{timeLeft || 'Memuat timer...'}</span>
                                        </div>
                                    </div>

                                    {/* QR Image Display */}
                                    <div className="my-6 flex flex-col items-center justify-center">
                                        <div className="rounded-2xl border-2 border-border/80 bg-white p-4 shadow-sm dark:bg-white">
                                            {invoice.qr_code_url ? (
                                                <img
                                                    src={invoice.qr_code_url}
                                                    alt="QRIS Code"
                                                    className={`h-64 w-64 object-contain ${isExpired ? 'opacity-30 blur-[2px]' : ''}`}
                                                />
                                            ) : (
                                                <div className="flex h-64 w-64 items-center justify-center text-center text-sm text-muted-foreground">
                                                    Memuat QRIS...
                                                </div>
                                            )}
                                        </div>

                                        {isExpired ? (
                                            <p className="mt-3 text-sm font-semibold text-red-600">
                                                QRIS telah kedaluwarsa. Silakan batalkan transaksi untuk membuat baru.
                                            </p>
                                        ) : (
                                            <p className="mt-3 text-center text-xs text-muted-foreground">
                                                Scan QR di atas menggunakan aplikasi m-Banking atau E-Wallet apa pun
                                                (BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, Dana, dll.)
                                            </p>
                                        )}
                                    </div>

                                    {/* QRIS Instructions */}
                                    <div className="rounded-xl bg-muted/40 p-4 text-xs space-y-2 text-muted-foreground">
                                        <p className="font-semibold text-foreground">Cara Pembayaran QRIS:</p>
                                        <ol className="list-inside list-decimal space-y-1">
                                            <li>Buka aplikasi Mobile Banking atau E-Wallet pilihan Anda.</li>
                                            <li>Pilih menu <strong>Scan QR / Bayar</strong>.</li>
                                            <li>Arahkan kamera smartphone ke kode QR di atas.</li>
                                            <li>Pastikan nama merchant adalah <strong>Level Up Counting</strong> dan total nominal sesuai.</li>
                                            <li>Konfirmasi pembayaran dan masukkan PIN Anda.</li>
                                        </ol>
                                    </div>
                                </Card>
                            )}

                            {/* Virtual Account Card */}
                            {isVa && (
                                <Card className="overflow-hidden border border-border/60 bg-card p-6 shadow-md">
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-6 w-6 text-primary" />
                                            <div>
                                                <h3 className="font-bold text-foreground">Virtual Account {bankName}</h3>
                                                <p className="text-xs text-muted-foreground">Transfer Otomatis Terverifikasi</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600">
                                            <Clock className="h-4 w-4" />
                                            <span>{timeLeft || 'Memuat timer...'}</span>
                                        </div>
                                    </div>

                                    {/* VA Number Section */}
                                    <div className="my-6 rounded-2xl bg-muted/30 p-6 text-center border">
                                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Nomor Rekening Virtual Account
                                        </span>
                                        <div className="mt-2 flex items-center justify-center gap-3">
                                            <span className="font-mono text-2xl font-black tracking-wider text-foreground sm:text-3xl">
                                                {invoice.va_number}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyToClipboard(invoice.va_number!, 'va')}
                                                className="h-9 px-3 gap-1.5"
                                            >
                                                {copiedVa ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                                <span>{copiedVa ? 'Disalin' : 'Salin'}</span>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* VA Instructions */}
                                    <div className="rounded-xl bg-muted/40 p-4 text-xs space-y-2 text-muted-foreground">
                                        <p className="font-semibold text-foreground">Cara Pembayaran Virtual Account:</p>
                                        <ol className="list-inside list-decimal space-y-1">
                                            <li>Buka aplikasi m-Banking atau kunjungi ATM terdekat.</li>
                                            <li>Pilih menu <strong>Transfer / Bayar &gt; Virtual Account</strong>.</li>
                                            <li>Masukkan nomor Virtual Account di atas.</li>
                                            <li>Periksa rincian nama dan jumlah tagihan yang tertera di layar.</li>
                                            <li>Konfirmasi dan selesaikan pembayaran.</li>
                                        </ol>
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Order Summary & Actions */}
                        <div className="space-y-6">
                            <Card className="border border-border/60 bg-card p-6 shadow-md">
                                <h3 className="font-bold text-foreground border-b pb-3">Ringkasan Tagihan</h3>

                                <div className="mt-4 space-y-3 text-sm">
                                    <div>
                                        <span className="text-xs text-muted-foreground">Produk:</span>
                                        <p className="font-semibold text-foreground line-clamp-2">{productTitle}</p>
                                    </div>

                                    <div className="flex justify-between text-muted-foreground pt-2 border-t">
                                        <span>Harga Produk</span>
                                        <span>Rp {(invoice.nett_amount || 0).toLocaleString('id-ID')}</span>
                                    </div>

                                    {invoice.transaction_fee > 0 && (
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Biaya Layanan</span>
                                            <span>Rp {invoice.transaction_fee.toLocaleString('id-ID')}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-3 border-t font-bold text-foreground">
                                        <span>Total Pembayaran</span>
                                        <div className="text-right">
                                            <span className="text-lg text-primary">
                                                Rp {(invoice.amount || 0).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-xs text-muted-foreground hover:text-foreground"
                                        onClick={() => copyToClipboard(invoice.amount.toString(), 'amount')}
                                    >
                                        {copiedAmount ? <Check className="mr-1 h-3 w-3 text-green-600" /> : <Copy className="mr-1 h-3 w-3" />}
                                        {copiedAmount ? 'Nominal Disalin' : 'Salin Nominal Tepat'}
                                    </Button>
                                </div>

                                <div className="mt-6 space-y-2 pt-4 border-t">
                                    <Button
                                        type="button"
                                        className="w-full font-semibold gap-2"
                                        onClick={handleCheckStatus}
                                        disabled={isChecking}
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                                        Cek Status Pembayaran
                                    </Button>

                                    {invoice.status === 'pending' && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
                                            onClick={handleCancelInvoice}
                                            disabled={isCancelling}
                                        >
                                            {isCancelling ? 'Membatalkan...' : 'Batalkan Tagihan'}
                                        </Button>
                                    )}

                                    <Button asChild variant="ghost" className="w-full text-xs">
                                        <Link href="/profile/my-courses">Kembali ke Dashboard</Link>
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </UserLayout>
        </div>
    );
}
