import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import HeroSection from './hero-section';
import KeyPointsSection from './key-points-section';
import RegisterSection from './register-section';
import RelatedProduct from './related-product';
import ScheduleInfoSection from './schedule-info-section';

interface PartnershipProduct {
    id: string;
    title: string;
    slug: string;
    category?: { id: string; name: string };
    short_description?: string | null;
    description?: string | null;
    key_points?: string | null;
    thumbnail?: string | null;
    registration_deadline: string;
    duration_days: number;
    schedule_days: string[];
    strikethrough_price: number;
    price: number;
    product_url: string;
    registration_url: string;
    status: string;
    created_at: string | Date;
    type: 'regular' | 'scholarship';
}

interface RelatedPartnershipProduct {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string | null;
    price: number;
    strikethrough_price: number;
    registration_deadline: string;
    duration_days: number;
    schedule_days: string[];
    category?: {
        id: string;
        name: string;
    };
}

export default function PartnershipProductDetail({
    partnershipProduct,
    relatedPartnershipProducts,
}: {
    partnershipProduct: PartnershipProduct;
    relatedPartnershipProducts: RelatedPartnershipProduct[];
}) {
    return (
        <div className="from-primary/10 to-secondary/10 relative min-h-screen bg-gradient-to-br via-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
            {/* Global Decorative Background */}
            <div className="bg-primary/20 pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full blur-3xl" />
            <div className="bg-secondary/20 pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full blur-3xl" />
            <div className="bg-primary/20 pointer-events-none absolute -bottom-0 -left-32 z-0 h-[500px] w-[500px] rounded-full blur-3xl" />
            <div className="bg-secondary/20 pointer-events-none absolute -right-0 -bottom-0 z-0 h-[500px] w-[500px] rounded-full blur-3xl" />

            <UserLayout>
                <Head title={`${partnershipProduct.title} - Sertifikasi Kerjasama`} />

                <HeroSection partnershipProduct={partnershipProduct} />
                <ScheduleInfoSection partnershipProduct={partnershipProduct} />
                <KeyPointsSection partnershipProduct={partnershipProduct} />
                <RegisterSection partnershipProduct={partnershipProduct} />
                <RelatedProduct relatedPartnershipProducts={relatedPartnershipProducts} />
            </UserLayout>
        </div>
    );
}
