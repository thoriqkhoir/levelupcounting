import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import { BookOpen, ListChecks, Users, Wrench } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import HeroSection from './hero-section';
import MentorSection from './mentor-section';
import RegisterSection from './register-section';
import RelatedProduct from './related-product';
import RequirementSection from './requirement-section';
import TimelineSection from './timeline-section';
import ToolsSection from './tools-section';

interface Mentor {
    id: string;
    name: string;
    bio?: string;
    avatar?: string | null;
}

interface Bootcamp {
    id: string;
    title: string;
    category?: { name: string };
    category_id?: string;
    schedules?: { schedule_date: string; day: string; start_time: string; end_time: string }[];
    tools?: { name: string; description?: string | null; icon: string | null }[];
    batch?: string | null;
    strikethrough_price: number;
    price: number;
    quota: number;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    status: string;
    bootcamp_url: string;
    registration_url: string;
    thumbnail?: string | null;
    description?: string | null;
    benefits?: string | null;
    instructions?: string | null;
    requirements?: string | null;
    curriculum?: string | null;
    mentors?: Mentor[];
    created_at: string | Date;
}

interface RelatedBootcamp {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string | null;
    price: number;
    strikethrough_price: number;
    start_date: string;
    end_date: string;
    category?: { id: string; name: string };
    mentors?: Mentor[];
}

interface ReferralInfo {
    code?: string;
    hasActive: boolean;
}

const TABS = [
    { value: 'curriculum', label: 'Kurikulum', shortLabel: 'Materi', icon: BookOpen },
    { value: 'requirements', label: 'Persyaratan', shortLabel: 'Syarat', icon: ListChecks },
    { value: 'tools', label: 'Tools', shortLabel: 'Tools', icon: Wrench },
    { value: 'mentor', label: 'Mentor', shortLabel: 'Mentor', icon: Users },
];

export default function Bootcamp({
    bootcamp,
    relatedBootcamps,
    myBootcampIds,
    referralInfo,
}: {
    bootcamp: Bootcamp;
    relatedBootcamps: RelatedBootcamp[];
    myBootcampIds: string[];
    referralInfo: ReferralInfo;
}) {
    const [activeTab, setActiveTab] = useState('curriculum');
    const tabsRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref');
        if (refFromUrl) {
            sessionStorage.setItem('referral_code', refFromUrl);
        } else if (referralInfo.code) {
            sessionStorage.setItem('referral_code', referralInfo.code);
        }
    }, [referralInfo]);

    useEffect(() => {
        const handleScroll = () => {
            if (tabsRef.current) {
                const rect = tabsRef.current.getBoundingClientRect();
                setIsSticky(rect.top <= 64);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                <Head title={`${bootcamp.title} - Bootcamp`} />

                <HeroSection bootcamp={bootcamp} />

                {/* Tabs Section */}
                <div ref={tabsRef} className="relative z-10 mx-auto mt-6 mb-6 w-full max-w-7xl px-3 sm:px-4 md:mt-8 md:mb-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        {/* Premium Glassmorphism Tab Bar */}
                        <div className={`sticky top-16 z-30 transition-all duration-300 ${isSticky ? 'py-3' : 'py-0 mb-6'}`}>
                            <TabsList className={`grid h-auto w-full grid-cols-4 gap-2 rounded-2xl p-1.5 transition-all duration-300 sm:gap-2 sm:p-2 ${isSticky ? 'bg-white/80 shadow-xl backdrop-blur-lg border border-white/40 dark:bg-zinc-900/80 dark:border-zinc-700/60' : 'border-2 border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900'}`}>
                                {TABS.map(({ value, label, shortLabel, icon: Icon }) => (
                                    <TabsTrigger
                                        key={value}
                                        value={value}
                                        className="group relative flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md sm:gap-2 sm:px-3 sm:py-3 sm:text-sm"
                                    >
                                        <Icon className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                                        <span className="hidden sm:inline">{label}</span>
                                        <span className="sm:hidden">{shortLabel}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* Tab Contents */}
                        <TabsContent value="curriculum" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                            <TimelineSection bootcamp={bootcamp} />
                        </TabsContent>

                        <TabsContent value="requirements" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                            <RequirementSection bootcamp={bootcamp} />
                        </TabsContent>

                        <TabsContent value="tools" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                            <ToolsSection bootcamp={bootcamp} />
                        </TabsContent>

                        <TabsContent value="mentor" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                            <MentorSection bootcamp={bootcamp} />
                        </TabsContent>
                    </Tabs>
                </div>

                <RegisterSection bootcamp={bootcamp} />
                <RelatedProduct relatedBootcamps={relatedBootcamps} myBootcampIds={myBootcampIds} />
            </UserLayout>
        </div>
    );
}
