import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import FeatureSection from './feature-section';
import HeroSection from './hero-section';
import PartnershipProductSection from './partnership-product-section';

type Category = {
    id: string;
    name: string;
};

interface PartnershipProduct {
    id: string;
    title: string;
    short_description: string | null;
    thumbnail: string | null;
    slug: string;
    strikethrough_price: number;
    price: number;
    registration_deadline: string;
    duration_days: number;
    schedule_days: string[];
    category: Category;
}

interface PartnershipProductPageProps {
    categories: Category[];
    partnershipProducts: PartnershipProduct[];
}

export default function PartnershipProductPage({ categories, partnershipProducts }: PartnershipProductPageProps) {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
            {/* Global Decorative Background */}
            <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0  -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
         
        <UserLayout>
            <Head title="Sertifikasi Kerjasama" />

            <HeroSection />
            {/* <FeatureSection /> */}
            <PartnershipProductSection categories={categories} partnershipProducts={partnershipProducts} />
        </UserLayout>
        </div>
    );
}
