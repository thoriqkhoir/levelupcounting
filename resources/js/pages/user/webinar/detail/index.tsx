import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import BenefitsSection from './benefits-section';
import HeroSection from './hero-section';
import MentorSection from './mentor-section';
import RegisterSection from './register-section';
import RelatedProduct from './related-product';
import ToolsSection from './tools-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Wrench, Users } from 'lucide-react';

interface Webinar {
    id: string;
    title: string;
    category?: { name: string };
    category_id?: string;
    tools?: { name: string; description?: string | null; icon: string | null }[];
    batch?: string | null;
    strikethrough_price: number;
    price: number;
    quota: number;
    start_time: string;
    end_time: string;
    registration_deadline: string;
    status: string;
    webinar_url: string;
    registration_url: string;
    thumbnail?: string | null;
    description?: string | null;
    benefits?: string | null;
    instructions?: string | null;
    user?: {
        id: string;
        name: string;
        bio?: string;
        avatar?: string;
    };
    created_at: string | Date;
}

interface RelatedWebinar {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string | null;
    price: number;
    strikethrough_price: number;
    start_time: string;
    category?: {
        name: string;
    };
}

interface ReferralInfo {
    code?: string;
    hasActive: boolean;
}

export default function Webinar({
    webinar,
    relatedWebinars,
    myWebinarIds,
    referralInfo,
}: {
    webinar: Webinar;
    relatedWebinars: RelatedWebinar[];
    myWebinarIds: string[];
    referralInfo: ReferralInfo;
}) {
    const [activeTab, setActiveTab] = useState('benefits');

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
            <Head title={`${webinar.title} - Webinar`} />

            <HeroSection webinar={webinar} />
            
            {/* Tabs Section */}
            <div className="relative z-10 mx-auto mt-6 md:mt-8 mb-6 md:mb-8 w-full max-w-7xl px-3 sm:px-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid h-auto w-full grid-cols-3 gap-2 rounded-2xl p-1.5 transition-all duration-300 sm:p-2 border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                        <TabsTrigger 
                            value="benefits" 
                            className="group relative flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md sm:gap-2 sm:px-3 sm:py-3 sm:text-sm"
                        >
                            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>Benefits</span>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="tools" 
                            className="group relative flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md sm:gap-2 sm:px-3 sm:py-3 sm:text-sm"
                        >
                            <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>Tools</span>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="mentor" 
                            className="group relative flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md sm:gap-2 sm:px-3 sm:py-3 sm:text-sm"
                        >
                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>Mentor</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="benefits" className="mt-4 sm:mt-6 md:mt-8">
                        <BenefitsSection webinar={webinar} />
                    </TabsContent>

                    <TabsContent value="tools" className="mt-4 sm:mt-6 md:mt-8">
                        <ToolsSection webinar={webinar} />
                    </TabsContent>

                    <TabsContent value="mentor" className="mt-4 sm:mt-6 md:mt-8">
                        <MentorSection webinar={webinar} />
                    </TabsContent>
                </Tabs>
            </div>

            <RegisterSection webinar={webinar} />
            <RelatedProduct relatedWebinars={relatedWebinars} myWebinarIds={myWebinarIds} />
        </UserLayout>
        </div>
    );
}