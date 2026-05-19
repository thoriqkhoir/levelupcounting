import FakeNotifications from '@/components/fake-notifications';
import PromotionPopup from '@/components/promotion-popup';
import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import AboutSection from './about-section';
import CarouselSection from './carousel-section';
import CtaSection from './cta-section';
import FaqSection from './faq-section';
import GalerySection from './galery-section';
import LatestProductsSection from './latest-products-section';
import ProgramSection from './program-section';
import TestimonySection from './testimony-section';
import ToolsSection from './tools-section';


interface Tool {
    id: string;
    name: string;
    description: string;
    icon: string;
}

interface Category {
    id: string;
    name: string;
}

interface User {
    name: string;
    bio?: string;
    avatar?: string | null;
}

interface Mentor {
    name: string;
    bio?: string;
    avatar?: string | null;
}

interface Product {
    id: string;
    title: string;
    thumbnail: string;
    slug: string;
    strikethrough_price: number;
    price: number;
    level?: 'beginner' | 'intermediate' | 'advanced';
    start_date?: string;
    end_date?: string;
    start_time?: string;
    registration_deadline?: string;
    duration_days?: number;
    bundle_url?: string;
    category?: Category;
    user?: User;
    mentor?: Mentor | null;
    mentors?: Mentor[];
    type: 'course' | 'bootcamp' | 'webinar' | 'bundle' | 'partnership';
    created_at: string;
}

interface MyProductIds {
    courses: string[];
    bootcamps: string[];
    webinars: string[];
    bundles: string[];
    partnerships: string[];
}

interface ReferralInfo {
    code?: string;
    hasActive: boolean;
}

interface Promotion {
    id: string;
    promotion_flyer: string;
    start_date: string;
    end_date: string;
    url_redirect?: string;
    is_active: boolean;
}

interface HomeProps {
    tools: Tool[];
    latestProducts: Product[];
    myProductIds: MyProductIds;
    allProducts: Array<{
        id: string;
        title: string;
        type: 'course' | 'bootcamp' | 'webinar';
        price: number;
    }>;
    activePromotion?: Promotion | null;
    referralInfo: ReferralInfo;
}

export default function Home({ tools, latestProducts, myProductIds, allProducts, activePromotion, referralInfo }: HomeProps) {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref');

        if (refFromUrl) {
            sessionStorage.setItem('referral_code', refFromUrl);
        } else if (referralInfo.code) {
            sessionStorage.setItem('referral_code', referralInfo.code);
        }
    }, [referralInfo]);

    return (
        <div className="relative min-h-screen bg-background overflow-x-hidden">
            {/* Global Decorative Background — Blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 left-1/4 z-0 h-[400px] w-[400px] rounded-full bg-pink-300/10 blur-3xl" />
            <div className="pointer-events-none absolute top-2/3 -right-20 z-0 h-[400px] w-[400px] rounded-full bg-violet-400/10 blur-3xl" />
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
                <Head title="Beranda" />

                {activePromotion && <PromotionPopup promotion={activePromotion} suppressDuration={3} />}

                <div className="relative z-10">
                    <AboutSection />
                </div>
                <div className="relative z-10">
                    <CarouselSection />
                </div>
                <div className="relative z-10">
                    <ProgramSection />
                </div>
                <div className="relative z-10">
                    <LatestProductsSection latestProducts={latestProducts} myProductIds={myProductIds} />
                </div>
                <div className="relative z-10">
                    <TestimonySection />
                </div>
                <div className="relative z-10">
                    <FaqSection />
                </div>
                <div className="relative z-10">
                    <CtaSection />
                </div>

                {typeof window !== 'undefined' && window.innerWidth >= 1024 && <FakeNotifications products={allProducts} />}

                <a
                    href="https://wa.me/+6287754764475?text=Halo%20Admin%20Level%20Up%20Accounting,%20saya%20ingin%20bertanya%20tentang%20kelas%20online."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed right-4 bottom-18 z-50 transition duration-300 hover:scale-110 md:right-10 lg:bottom-6"
                    aria-label="Chat WhatsApp"
                >
                    <img src="/assets/images/wa.svg" alt="WhatsApp" className="h-16 w-16 drop-shadow-lg md:h-35 md:w-35" />
                </a>
            </UserLayout>
        </div>
    );
}
