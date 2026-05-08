import { Link } from '@inertiajs/react';

interface ProgramCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    imageSrc: string;
    imageAlt: string;
    href: string;
    reverse?: boolean;
}

function ProgramCard({ title, description, icon, imageSrc, imageAlt, href, reverse = false }: ProgramCardProps) {
    return (
        <div
            className={`relative z-2 flex flex-col md:items-center gap-5 md:gap-8 p-4 md:min-h-[280px] ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
        >
            <div className="shrink-0 w-full h-[220px] md:w-[340px] md:h-[260px] rounded-[20px] overflow-hidden">
                <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
            </div>
            <div
                className={`flex flex-1 flex-col gap-3 w-full items-center text-center ${reverse ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}
            >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 text-xl">
                    {icon}
                </div>
                <h3 className="m-0 text-2xl font-extrabold font-av-estiana">{title}</h3>
                <p className="m-0 text-sm leading-relaxed text-[#555]">{description}</p>
                <Link
                    href={href}
                    className="mt-1.5 inline-block rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white no-underline"
                >
                    Pelajari Sekarang →
                </Link>
            </div>
        </div>
    );
}

export default function ProgramSection() {
    const programs = [
        { title: 'Bootcamp Intensif', description: 'Intensive Live Class bersama Experts. Praktikal & Mendalam. Kombinasi Case Study, Praktik di Tiap Sesi dari Basic to Advanced.', icon: '🖐', imageSrc: '/assets/images/illustration-bootcamp.webp', imageAlt: 'Bootcamp Intensif', href: '/bootcamp', reverse: false },
        { title: 'Online Class', description: 'Pelajari berbagai skill sekali bayar, praktik, dan bersertifikat. Belajar fleksibel via Video Materi, Project dan Studi Kasus.', icon: '🏆', imageSrc: '/assets/images/illustration-course.webp', imageAlt: 'Online Class', href: '/course', reverse: true },
        { title: 'Interactive Webinar', description: 'Pelajari berbagai topik terkini dari para ahli di bidangnya. Belajar insightful dengan pembicara yang expert di bidangnya.', icon: '🖐', imageSrc: '/assets/images/illustration-webinar.webp', imageAlt: 'Interactive Webinar', href: '/webinar', reverse: false },
    ];

    return (
        <section id="program-kami" className="w-full px-6 py-15">
            <div className="mb-12 text-center">
                <h2 className="mb-3 text-3xl font-black font-av-estiana">
                    LevelUp Accounting&apos;s Programs
                </h2>
                <p className="mx-auto max-w-[440px] text-sm leading-relaxed text-[#888]">
                    Pilih program yang sesuai dengan kebutuhanmu dan tingkatkan kemampuan akuntansimu bersama para ahli.
                </p>
            </div>
            <div className="relative mx-auto max-w-6xl">
                {/* Cards */}
                <div className="relative flex flex-col gap-12 md:gap-[80px]">
                    {programs.map((p) => (
                        <div key={p.title}><ProgramCard {...p} /></div>
                    ))}
                </div>
            </div>
        </section>
    );
}
