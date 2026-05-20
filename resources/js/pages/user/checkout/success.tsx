import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BadgeCheck, BookOpen, Calendar, Crown, FileText, Home, Sparkles } from 'lucide-react';

interface CourseItem {
    course: { title: string; slug: string; thumbnail: string };
}
interface BootcampItem {
    bootcamp: { title: string; slug: string; thumbnail: string };
}
interface WebinarItem {
    webinar: { title: string; slug: string; thumbnail: string };
}

interface Invoice {
    id: string;
    amount: number;
    course_items?: CourseItem[];
    bootcamp_items?: BootcampItem[];
    webinar_items?: WebinarItem[];
}

interface InvoiceProps {
    invoice: Invoice;
}

export default function CheckoutSuccess({ invoice }: InvoiceProps) {
    const courseItems = invoice.course_items ?? [];
    const bootcampItems = invoice.bootcamp_items ?? [];
    const webinarItems = invoice.webinar_items ?? [];

    let title = '';
    let subtitle = '';
    let link = '';
    let label = '';
    let thumbnail = '';
    let icon = <Crown className="h-6 w-6" />;

    if (courseItems.length > 0) {
        title = courseItems[0].course.title;
        subtitle = 'Kelas Online';
        link = `/profile/my-courses/${courseItems[0].course.slug}`;
        label = 'Mulai Belajar Sekarang';
        thumbnail = courseItems[0].course.thumbnail;
        icon = <BookOpen className="h-6 w-6" />;
    } else if (bootcampItems.length > 0) {
        title = bootcampItems[0].bootcamp.title;
        subtitle = 'Bootcamp';
        link = `/profile/my-bootcamps/${bootcampItems[0].bootcamp.slug}`;
        label = 'Akses Bootcamp';
        thumbnail = bootcampItems[0].bootcamp.thumbnail;
        icon = <Sparkles className="h-6 w-6" />;
    } else if (webinarItems.length > 0) {
        title = webinarItems[0].webinar.title;
        subtitle = 'Webinar';
        link = `/profile/my-webinars/${webinarItems[0].webinar.slug}`;
        label = 'Akses Webinar';
        thumbnail = webinarItems[0].webinar.thumbnail;
        icon = <Calendar className="h-6 w-6" />;
    } else {
        title = 'Pembelian Berhasil';
        subtitle = 'Terima Kasih';
        link = '/profile';
        label = 'Lihat Profil';
        icon = <Crown className="h-6 w-6" />;
    }

    return (
        <div className="relative min-h-screen bg-background">
            {/* Global Decorative Background — Blobs */}
            <div className="pointer-events-none absolute -left-32 -top-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-0 -top-32 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
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
                <Head title="Pembayaran Berhasil" />

                {/* Hero Section */}
                <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center text-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
                            className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-green-100 shadow-2xl dark:bg-green-900/30"
                        >
                            <BadgeCheck className="h-20 w-20 text-green-600 dark:text-green-400" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-6 py-2 dark:border-green-800/50 dark:bg-green-900/20"
                        >
                            <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="font-semibold text-green-700 dark:text-green-300">
                                Pembayaran Berhasil
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="font-av-estiana mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                        >
                            Selamat! 🎉
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mb-2 text-xl text-muted-foreground"
                        >
                            Transaksi Anda telah berhasil diproses
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-lg text-muted-foreground/80"
                        >
                            Detail produk dan invoice Anda dapat dilihat di bawah
                        </motion.p>
                    </motion.div>
                </div>

                {/* Content Section */}
                <section className="relative z-10 mx-auto mb-20 w-full max-w-5xl px-4">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Product Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="lg:col-span-2"
                        >
                            <Card className="overflow-hidden border border-border/50 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-primary/20 hover:shadow-2xl">
                                <div className="border-b border-border/50 bg-muted/30 p-6">
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                                        {icon}
                                        {subtitle}
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
                                </div>

                                {thumbnail && (
                                    <div className="p-6">
                                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted/20">
                                            <img
                                                src={thumbnail.startsWith('http') ? thumbnail : `/storage/${thumbnail}`}
                                                alt={title}
                                                className="h-[300px] w-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </motion.div>

                        {/* Action Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="space-y-6 lg:col-span-1"
                        >
                            {/* Primary Action */}
                            <Card className="overflow-hidden border border-border/50 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-primary/20 hover:shadow-2xl">
                                <div className="flex flex-col items-center p-6 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
                                        {icon}
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-foreground">Akses Sekarang</h3>
                                    <p className="mb-6 text-sm text-muted-foreground">
                                        Mulai perjalanan belajar Anda sekarang juga
                                    </p>
                                    <Button
                                        asChild
                                        size="lg"
                                        className="w-full font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/25"
                                    >
                                        <Link href={link}>{label}</Link>
                                    </Button>
                                </div>
                            </Card>

                            {/* Download Invoice */}
                            <Card className="overflow-hidden border border-border/50 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-blue-500/20 hover:shadow-2xl">
                                <div className="flex flex-col items-center p-6 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-500 shadow-sm">
                                        <FileText className="h-8 w-8" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-foreground">Download Invoice</h3>
                                    <p className="mb-6 text-sm text-muted-foreground">Simpan bukti pembayaran Anda</p>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="w-full border-border/50 font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/50"
                                    >
                                        <a
                                            href={route('invoice.pdf', { id: invoice.id })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FileText className="mr-2 h-4 w-4" />
                                            Unduh Invoice
                                        </a>
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </section>
            </UserLayout>
        </div>
    );
}