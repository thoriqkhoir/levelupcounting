import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import { HeroSection } from './hero-section';
import { VisionMissionSection } from './vision-mission-section';
import { TeamSection } from './team-section';

interface Mentor {
    id: string;
    name: string;
    bio?: string;
    avatar?: string;
    email?: string;
    total_courses: number;
    total_articles: number;
    total_webinars: number;
    total_bootcamps: number;
}

interface AboutProps {
    mentors: Mentor[];
}

export default function About({ mentors }: AboutProps) {
    return (
        <div className="relative min-h-screen bg-background">
            {/* Global Decorative Background — Blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/4 z-0 h-[400px] w-[400px] rounded-full bg-violet-300/10 blur-3xl" />
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
                <Head title="Tentang Kami" />

                <div className="relative z-10">
                    <HeroSection />
                </div>
                <div className="relative z-10">
                    <VisionMissionSection />
                </div>
                <div className="relative z-10">
                    <TeamSection mentors={mentors} />
                </div>
            </UserLayout>
        </div>
    );
}