import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import HeroSection from './hero-section';
import InformationSection from './information-section';
import MentorSection from './mentor-section';
import RegisterSection from './register-section';
import RelatedPrograms from './related-programs';
import RequirementSection from './requirement-section';
import ScheduleInfoSection from './schedule-info-section';

interface Mentor {
    id: string;
    name: string;
    bio?: string;
    avatar?: string;
}

interface Schedule {
    id: string;
    title?: string | null;
    schedule_date?: string;
    start_date?: string;
    day?: string;
    start_time?: string;
    end_time?: string;
}

interface Program {
    id: string;
    title: string;
    slug: string;
    short_description: string;
    description: string;
    benefits: string;
    terms_conditions?: string | null;
    scholarship_flow?: string | null;
    type: 'regular' | 'scholarship';
    status: string;
    category: { id: string; name: string };
    price: number;
    scholarship_price?: number;
    strikethrough_price?: number;
    thumbnail?: string | null;
    registration_deadline?: string;
    socialization_registration_deadline?: string;
    group_url?: string;
    batch?: string;
    document_required?: boolean;
    document_description?: string | null;
    schedules: Schedule[];
    socializationSchedules: Schedule[];
    mentors: Mentor[];
}

interface RelatedProgram {
    id: string;
    title: string;
    slug: string;
    type: 'regular' | 'scholarship';
    price: number;
    strikethrough_price?: number;
    category?: { name: string };
    thumbnail?: string | null;
    registration_deadline?: string;
}

interface DetailProps {
    program: Program;
    relatedPrograms: RelatedProgram[];
    myProgramIds: string[];
    scholarshipApplication?: { status: string } | null;
}

export default function Detail({ program, relatedPrograms, myProgramIds, scholarshipApplication }: DetailProps) {
    const isEnrolled = myProgramIds.includes(program.id);

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
                <Head title={`${program.title} - Program Sertifikasi`} />

                <HeroSection program={program} />
                <ScheduleInfoSection program={program} />
                <InformationSection program={program} />
                {program.mentors && program.mentors.length > 0 && <MentorSection program={program} />}
                {(program.terms_conditions || (program.type === 'scholarship' && program.scholarship_flow)) && (
                    <RequirementSection program={program} />
                )}
                <RegisterSection program={program} isEnrolled={isEnrolled} scholarshipApplication={scholarshipApplication} />
                <RelatedPrograms relatedPrograms={relatedPrograms} />
            </UserLayout>
        </div>
    );
}
