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
        <UserLayout>
            <Head title="Pembayaran Berhasil" />

            {/* Hero Section with Gradient Background */}
            <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 px-4 py-20">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/30 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-teal-400/30 blur-3xl" />

                <div className="relative mx-auto max-w-4xl text-center">
                    {/* Success Icon with Animation */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
                        className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-2xl"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                        >
                            <BadgeCheck className="h-20 w-20 text-green-600" />
                        </motion.div>
                    </motion.div>

                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-2 backdrop-blur-sm"
                    >
                        <Sparkles className="h-5 w-5 text-white" />
                        <span className="font-semibold text-white">Pembayaran Berhasil</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
                    >
                        Selamat! 🎉
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-2 text-xl text-green-50"
                    >
                        Transaksi Anda telah berhasil diproses
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg text-green-100"
                    >
                        Invoice dapat diunduh di bawah
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="mx-auto my-12 w-full max-w-5xl px-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Product Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="lg:col-span-2"
                    >
                        <Card className="overflow-hidden border-2">
                            <div className="border-b bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:from-green-950/20 dark:to-emerald-950/20">
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    {icon}
                                    {subtitle}
                                </div>
                                <h2 className="text-2xl font-bold">{title}</h2>
                            </div>

                            {thumbnail && (
                                <div className=" pb-4 px-2 ">
                                    <img 
                                    src={thumbnail.startsWith('http') ? thumbnail : `/storage/${thumbnail}`}  
                                    alt={title} 
                                    className="h-64 w-full object-cover rounded-2xl" />
                                </div>
                            )}

                            
                        </Card>
                    </motion.div>

                    {/* Action Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-4 lg:col-span-1"
                    >
                        {/* Primary Action */}
                        <Card className="overflow-hidden border-2 border-green-500/20">
                            <div className=" p-6 dark:from-green-950/20 dark:to-emerald-950/20">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                    {icon}
                                </div>
                                <h3 className="mb-2 text-lg font-bold">Akses Sekarang</h3>
                                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                    Mulai perjalanan belajar Anda sekarang juga
                                </p>
                                <Button asChild size="lg" className="w-full  hover:scale-105 transition-transform">
                                    <Link href={link}>{label}</Link>
                                </Button>
                            </div>
                        </Card>

                        {/* Download Invoice */}
                        <Card className="overflow-hidden">
                            <div className="p-6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold">Download Invoice</h3>
                                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                    Simpan bukti pembayaran Anda
                                </p>
                                <Button asChild variant="outline" size="lg" className="w-full border-2">
                                    <a href={route('invoice.pdf', { id: invoice.id })} target="_blank" rel="noopener noreferrer">
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
    );
}