import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProfileLayout from '@/layouts/profile/layout';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Course {
    id: string;
    title: string;
    slug: string;
}
interface Bootcamp {
    id: string;
    title: string;
    slug: string;
}
interface Webinar {
    id: string;
    title: string;
    slug: string;
}
interface Bundle {
    id: string;
    title: string;
    slug: string;
}

interface EnrollmentCourse {
    id: string;
    course: Course;
    price: number;
}
interface EnrollmentBootcamp {
    id: string;
    bootcamp: Bootcamp;
    price: number;
}
interface EnrollmentWebinar {
    id: string;
    webinar: Webinar;
    price: number;
}
interface BundleEnrollment {
    id: string;
    bundle: Bundle;
    price: number;
}

interface Invoice {
    id: string;
    invoice_code: string;
    invoice_url: string;
    amount: number;
    status: 'paid' | 'pending' | 'expired' | 'failed' | 'completed';
    paid_at: string | null;
    payment_channel: string | null;
    payment_method: string | null;
    course_items?: EnrollmentCourse[];
    courseItems?: EnrollmentCourse[];
    bootcamp_items?: EnrollmentBootcamp[];
    bootcampItems?: EnrollmentBootcamp[];
    webinar_items?: EnrollmentWebinar[];
    webinarItems?: EnrollmentWebinar[];
    bundle_enrollments?: BundleEnrollment[];
    bundleEnrollments?: BundleEnrollment[];
    created_at: string;
}

interface Props {
    myTransactions: Invoice[];
}

export default function Transactions({ myTransactions }: Props) {
    const { t, i18n } = useTranslation('profile');
    const dateLocale = i18n.language === 'en' ? 'en-US' : 'id-ID';
    const [search, setSearch] = useState('');

    const getItemHref = (type: string, slug: string, status: Invoice['status']) => {
        const isPaid = status === 'paid' || status === 'completed';

        if (type === 'Course') {
            return isPaid ? `/profile/my-courses/${slug}` : route('course.detail', { slug });
        }
        if (type === 'Bootcamp') {
            return isPaid ? `/profile/my-bootcamps/${slug}` : route('bootcamp.detail', { slug });
        }
        if (type === 'Webinar') {
            return isPaid ? `/profile/my-webinars/${slug}` : route('webinar.detail', { slug });
        }
        if (type === 'Bundle') {
            return route('bundle.detail', { slug });
        }

        return '#';
    };

    // Gabungkan semua items dari semua invoice menjadi satu array
    const allItems = myTransactions.flatMap((invoice) => [
        ...(invoice.course_items || invoice.courseItems || []).map((item) => ({
            type: 'Course',
            title: item.course?.title || '',
            slug: item.course?.slug || '',
            price: item.price,
            invoice_id: invoice.id,
            invoice_status: invoice.status,
            invoice_code: invoice.invoice_code,
            invoice_url: invoice.invoice_url,
            paid_at: invoice.paid_at,
            payment_channel: invoice.payment_channel,
            payment_method: invoice.payment_method,
            created_at: invoice.created_at,
        })),
        ...(invoice.bootcamp_items || invoice.bootcampItems || []).map((item) => ({
            type: 'Bootcamp',
            title: item.bootcamp?.title || '',
            slug: item.bootcamp?.slug || '',
            price: item.price,
            invoice_id: invoice.id,
            invoice_status: invoice.status,
            invoice_code: invoice.invoice_code,
            invoice_url: invoice.invoice_url,
            paid_at: invoice.paid_at,
            payment_channel: invoice.payment_channel,
            payment_method: invoice.payment_method,
            created_at: invoice.created_at,
        })),
        ...(invoice.webinar_items || invoice.webinarItems || []).map((item) => ({
            type: 'Webinar',
            title: item.webinar?.title || '',
            slug: item.webinar?.slug || '',
            price: item.price,
            invoice_id: invoice.id,
            invoice_status: invoice.status,
            invoice_code: invoice.invoice_code,
            invoice_url: invoice.invoice_url,
            paid_at: invoice.paid_at,
            payment_channel: invoice.payment_channel,
            payment_method: invoice.payment_method,
            created_at: invoice.created_at,
        })),
        ...(invoice.bundle_enrollments || invoice.bundleEnrollments || []).map((item) => ({
            type: 'Bundle',
            title: item.bundle?.title || t('transactions.typeBundle'),
            slug: item.bundle?.slug || '',
            price: item.price,
            invoice_id: invoice.id,
            invoice_status: invoice.status,
            invoice_code: invoice.invoice_code,
            invoice_url: invoice.invoice_url,
            paid_at: invoice.paid_at,
            payment_channel: invoice.payment_channel,
            payment_method: invoice.payment_method,
            created_at: invoice.created_at,
        })),
    ]);

    const filteredItems = allItems.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

    const getStatusComponent = (status: Invoice['status']) => {
        if (status === 'paid' || status === 'completed') {
            return <span className="font-medium text-green-600">{t('transactions.statusPaid')}</span>;
        }
        if (status === 'pending') {
            return <span className="font-medium text-yellow-600">{t('transactions.statusPending')}</span>;
        }
        return <span className="font-medium text-red-600">{t('transactions.statusFailed')}</span>;
    };

    return (
        <UserLayout>
            <Head title={t('transactions.headTitle')} />
            <ProfileLayout>
                <Heading title={t('transactions.title')} description={t('transactions.description')} />
                <div className="mb-4 flex justify-between gap-2">
                    <Input type="search" placeholder={t('transactions.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-zinc-800">
                            <tr className="text-left">
                                <th className="p-2 font-medium">{t('transactions.colTitle')}</th>
                                <th className="p-2 font-medium">{t('transactions.colType')}</th>
                                <th className="p-2 font-medium">{t('transactions.colStatus')}</th>
                                <th className="p-2 font-medium">{t('transactions.colPaymentMethod')}</th>
                                <th className="p-2 font-medium">{t('transactions.colInvoice')}</th>
                                <th className="p-2 font-medium">{t('transactions.colPaidAt')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        {t('transactions.empty')}
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item, idx) => (
                                    <tr key={idx} className="border-t dark:border-zinc-800">
                                        <td className="p-2">
                                            <Link
                                                href={getItemHref(item.type, item.slug, item.invoice_status)}
                                                className="text-primary hover:underline"
                                            >
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td className="p-2">
                                            {item.type === 'Course'
                                                ? t('transactions.typeCourse')
                                                : item.type === 'Bundle'
                                                  ? t('transactions.typeBundle')
                                                  : item.type === 'Bootcamp'
                                                    ? t('transactions.typeBootcamp')
                                                    : item.type === 'Webinar'
                                                      ? t('transactions.typeWebinar')
                                                      : item.type}
                                        </td>
                                        <td className="p-2">{getStatusComponent(item.invoice_status)}</td>
                                        <td className="p-2">
                                            {item.price === 0 ? (
                                                <span className="font-semibold text-green-600">{t('transactions.free')}</span>
                                            ) : (
                                                item.payment_channel || item.payment_method || '-'
                                            )}
                                        </td>
                                        <td className="p-2">
                                            <Link href={route('invoice.show', { id: item.invoice_id })} className="text-primary hover:underline">
                                                {item.invoice_code}
                                            </Link>
                                        </td>
                                        <td className="p-2">
                                            {item.invoice_status === 'pending' && item.invoice_url ? (
                                                <Button asChild size="sm" variant="outline">
                                                    <a href={item.invoice_url} target="_blank">
                                                        {t('transactions.continuePayment')}
                                                    </a>
                                                </Button>
                                            ) : item.paid_at ? (
                                                new Date(item.paid_at).toLocaleString(dateLocale)
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </ProfileLayout>
        </UserLayout>
    );
}
