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
                <img src={imageSrc} alt={imageAlt} className="h-full w-full object-contain" />
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
        { title: 'Bootcamp Intensif', description: 'Intensive Live Class bersama Experts. Praktikal & Mendalam. Kombinasi Case Study, Praktik di Tiap Sesi dari Basic to Advanced.', icon: '🖐', imageSrc: '/assets/images/bootcamp.svg', imageAlt: 'Bootcamp Intensif', href: '/bootcamp', reverse: false },
        { title: 'Online Class', description: 'Pelajari berbagai skill sekali bayar, praktik, dan bersertifikat. Belajar fleksibel via Video Materi, Project dan Studi Kasus.', icon: '🏆', imageSrc: '/assets/images/class.svg', imageAlt: 'Online Class', href: '/course', reverse: true },
        { title: 'Interactive Webinar', description: 'Pelajari berbagai topik terkini dari para ahli di bidangnya. Belajar insightful dengan pembicara yang expert di bidangnya.', icon: '🖐', imageSrc: '/assets/images/webinar.svg', imageAlt: 'Interactive Webinar', href: '/webinar', reverse: false },
    ];

    return (
        <section id="program-kami" className="w-full px-6 py-15">
            <div className="mb-12 text-center">
                <div className="mb-4 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                        🎯 Program Unggulan
                    </span>
                </div>
                <h2 className="font-av-estiana mb-3 text-2xl font-extrabold md:text-3xl">
                    LevelUp Accounting&apos;s{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10">Programs</span>
                        <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
                    </span>
                </h2>
                <p className="mx-auto max-w-[460px] text-sm leading-relaxed text-gray-500 md:text-base">
                    Pilih program yang sesuai dengan kebutuhanmu dan tingkatkan kemampuan akuntansimu bersama para ahli.
                </p>
            </div>
            <div className="relative mx-auto max-w-6xl">
                {/* Cards */}
                <div className=" relative flex flex-col gap-2 md:gap-4">
                    {programs.map((p) => (
                        <div key={p.title}><ProgramCard {...p} /></div>
                    ))}
                </div>
            </div>
        </section>
    );
}
