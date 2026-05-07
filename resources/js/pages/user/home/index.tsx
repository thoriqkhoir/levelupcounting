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
        <div className="from-primary/10 to-secondary/10 relative min-h-screen bg-background via-white">

            <UserLayout>
                <Head title="Beranda" />

                {activePromotion && <PromotionPopup promotion={activePromotion} suppressDuration={3} />}

                {/* AboutSection with decorative blobs */}
                <div className="relative">
                    <div className="pointer-events-none absolute -top-16 -right-24 z-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute top-1/2 -left-20 z-0 h-[350px] w-[350px] rounded-full bg-secondary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 right-1/3 z-0 h-[300px] w-[300px] rounded-full bg-rose-300/10 blur-3xl" />
                    <div className="relative z-10">
                        <AboutSection />
                    </div>
                </div>
                <CarouselSection />

                {/* ProgramSection with decorative blobs */}
                <div className="relative">
                    <div className="pointer-events-none absolute -top-20 -left-32 z-0 h-[400px] w-[400px] rounded-full bg-primary/15 blur-3xl" />
                    <div className="pointer-events-none absolute top-1/2 -right-20 z-0 h-[300px] w-[300px] rounded-full bg-pink-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 left-1/3 z-0 h-[350px] w-[350px] rounded-full bg-amber-300/10 blur-3xl" />
                    <div className="relative z-10">
                        <ProgramSection />
                    </div>
                </div>

                {/* LatestProductsSection with decorative blobs */}
                <div className="relative">
                    <div className="pointer-events-none absolute -top-10 right-1/4 z-0 h-[350px] w-[350px] rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute top-1/3 -left-24 z-0 h-[300px] w-[300px] rounded-full bg-secondary/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 right-10 z-0 h-[400px] w-[400px] rounded-full bg-violet-400/10 blur-3xl" />
                    <div className="relative z-10">
                        <LatestProductsSection latestProducts={latestProducts} myProductIds={myProductIds} />
                    </div>
                </div>

                {/* <ToolsSection tools={tools} /> */}

                {/* TestimonySection with decorative blobs */}
                <div className="relative">
                    <div className="pointer-events-none absolute -top-16 left-10 z-0 h-[350px] w-[350px] rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-1/4 -right-16 z-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl" />
                    <div className="relative z-10">
                        <TestimonySection />
                    </div>
                </div>

                {/* <GalerySection /> */}

                {/* FaqSection with decorative blobs */}
                <div className="relative">
                    <div className="pointer-events-none absolute top-10 -right-20 z-0 h-[400px] w-[400px] rounded-full bg-rose-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-1/4 z-0 h-[350px] w-[350px] rounded-full bg-amber-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute top-1/2 left-0 z-0 h-[250px] w-[250px] rounded-full bg-cyan-300/10 blur-3xl" />
                    <div className="relative z-10">
                        <FaqSection />
                    </div>
                </div>

                {/* CtaSection with decorative blobs */}
                <div className="relative">
                    <div className="pointer-events-none absolute -top-24 left-1/3 z-0 h-[400px] w-[400px] rounded-full bg-violet-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute top-1/3 -right-10 z-0 h-[300px] w-[300px] rounded-full bg-primary/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-16 z-0 h-[350px] w-[350px] rounded-full bg-pink-300/10 blur-3xl" />
                    <div className="relative z-10">
                        <CtaSection />
                    </div>
                </div>

                {typeof window !== 'undefined' && window.innerWidth >= 1024 && <FakeNotifications products={allProducts} />}

                <a
                    href="https://wa.me/+6281252683108?text=Halo%20Admin%20Sekolah%20Pajak,%20saya%20ingin%20bertanya%20tentang%20kelas%20online."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sha fixed right-4 bottom-18 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition duration-1000 hover:bg-green-200 md:right-10 md:h-16 md:w-16 lg:bottom-6"
                    aria-label="Chat WhatsApp"
                >
                    <img src="/assets/images/wa-icon.png" alt="WhatsApp" className="h-8 w-8 md:h-12 md:w-12" />
                </a>
            </UserLayout>
        </div>
    );
}
