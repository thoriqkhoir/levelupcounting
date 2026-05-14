import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import { BookOpen, Layers, PlayCircle, Wrench } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AboutSection from './about-section';
import HeroSection from './hero-section';
import ModulesSection from './modules-section';
import RegisterSection from './register-section';
import RelatedProduct from './related-product';
import ToolsSection from './tools-section';
import VideoSection from './video-section';

interface Course {
    id: string;
    title: string;
    user?: { id: string; name: string; bio: string | null };
    category?: { name: string };
    category_id?: string;
    tools?: { name: string; description?: string | null; icon: string | null }[];
    images?: { image_url: string }[];
    short_description?: string | null;
    description?: string | null;
    key_points?: string | null;
    strikethrough_price: number;
    price: number;
    thumbnail?: string | null;
    course_url: string;
    registration_url: string;
    status: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    created_at: string;
    updated_at: string;
    modules?: {
        title: string;
        description?: string | null;
        lessons?: {
            title: string;
            description?: string | null;
            type: 'text' | 'video' | 'file' | 'quiz';
            attachment?: string | null;
            video_url?: string | null;
            is_free?: boolean;
        }[];
    }[];
}

interface RelatedCourse {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string | null;
    price: number;
    strikethrough_price: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    category?: { name: string };
}

interface ReferralInfo {
    code?: string;
    hasActive: boolean;
}

const TABS = [
    { value: 'preview', label: 'Preview Kelas', shortLabel: 'Preview', icon: PlayCircle },
    { value: 'about', label: 'Informasi Kelas', shortLabel: 'Info', icon: BookOpen },
    { value: 'modules', label: 'Modul', shortLabel: 'Modul', icon: Layers },
    { value: 'tools', label: 'Tools', shortLabel: 'Tools', icon: Wrench },
];

export default function DetailCourse({
    course,
    relatedCourses,
    myCourseIds,
    referralInfo,
}: {
    course: Course;
    relatedCourses: RelatedCourse[];
    myCourseIds: string[];
    referralInfo: ReferralInfo;
}) {
    const [activeTab, setActiveTab] = useState('preview');
    const tabsRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref');
        if (refFromUrl) sessionStorage.setItem('referral_code', refFromUrl);
        else if (referralInfo.code) sessionStorage.setItem('referral_code', referralInfo.code);
    }, [referralInfo]);

    useEffect(() => {
        const handleScroll = () => {
            if (tabsRef.current) {
                setIsSticky(tabsRef.current.getBoundingClientRect().top <= 64);
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
                <Head title={`${course.title} - Kelas Online`} />

                <HeroSection course={course} />

                {/* Tabs Section */}
                <div ref={tabsRef} className="relative z-10 mx-auto mt-6 mb-6 w-full max-w-7xl px-3 sm:px-4 md:mt-8 md:mb-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        {/* Sticky glassmorphism tab bar */}
                        <div className={`sticky top-16 z-30 transition-all duration-300 ${isSticky ? 'py-3' : 'mb-6'}`}>
                            <TabsList className={`grid h-auto w-full grid-cols-2 gap-2 rounded-2xl p-1.5 transition-all duration-300 sm:grid-cols-4 sm:p-2 ${isSticky ? 'bg-white/80 shadow-xl backdrop-blur-lg border border-white/40 dark:bg-zinc-900/80 dark:border-zinc-700/60' : 'border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60'}`}>
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

                        <TabsContent value="preview" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                            <VideoSection course={course} onNavigateToModules={() => setActiveTab('modules')} />
                        </TabsContent>
                        <TabsContent value="about" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                            <AboutSection course={course} />
                        </TabsContent>
                        <TabsContent value="modules" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                            <ModulesSection course={course} />
                        </TabsContent>
                        <TabsContent value="tools" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                            <ToolsSection course={course} />
                        </TabsContent>
                    </Tabs>
                </div>

                <RegisterSection course={course} />
                <RelatedProduct relatedCourses={relatedCourses} myCourseIds={myCourseIds} />
            </UserLayout>
        </div>
    );
}
