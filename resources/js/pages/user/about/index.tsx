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
        <div className="relative min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
            {/* Global Decorative Background */}
            <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0  -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
          
        
        <UserLayout>
            <Head title="Tentang Kami" />

            <div className="min-h-screen">
                <HeroSection />
                <VisionMissionSection />
                <TeamSection mentors={mentors} />
            </div>
        </UserLayout>
        </div>
    );
}