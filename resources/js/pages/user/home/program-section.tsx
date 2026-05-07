import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

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
            className={`relative z-2 flex items-center gap-5 p-4 min-h-[280px] ${reverse ? 'flex-row-reverse' : 'flex-row'}`}
        >
            <div className="shrink-0 w-[340px] h-[260px] rounded-[20px] overflow-hidden">
                <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
            </div>
            <div
                className={`flex flex-1 flex-col gap-2.5 ${reverse ? 'items-end text-right' : 'items-start text-left'}`}
            >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 text-xl">
                    {icon}
                </div>
                <h3 className="m-0 text-2xl font-extrabold font-av-estiana">{title}</h3>
                <p className="m-0 max-w-[300px] text-sm leading-relaxed text-[#555]">{description}</p>
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

function buildPath(W: number, cardHeights: number[], gap: number) {
    const SR = 30;  // small corner radius (text side)
    const yPos: number[] = [];
    let cy = 0;
    for (let i = 0; i < cardHeights.length; i++) {
        yPos.push(cy);
        cy += cardHeights[i] + gap;
    }

    const segments: string[] = [];

    for (let i = 0; i < 3; i++) {
        const y = yPos[i];
        const H = cardHeights[i];
        const LR = H / 2; // large radius = half height for D-shape on image side
        const isLeft = i % 2 === 0; // image on left for cards 0,2; right for card 1

        if (isLeft) {
            // Card with image LEFT: D-shape on left, small corners on right
            // Trace counterclockwise (sweep=0): start right side top, end right side bottom
            if (i === 0) {
                segments.push(`M ${W},${y + SR}`);
            }
            segments.push(
                `A ${SR},${SR} 0 0 0 ${W - SR},${y}`,
                `L ${LR},${y}`,
                `A ${LR},${LR} 0 0 0 ${LR},${y + H}`,
                `L ${W - SR},${y + H}`,
                `A ${SR},${SR} 0 0 0 ${W},${y + H - SR}`,
            );
        } else {
            // Card with image RIGHT: D-shape on right, small corners on left
            // Trace clockwise (sweep=1): start left side top, end left side bottom
            segments.push(
                `A ${SR},${SR} 0 0 1 ${SR},${y}`,
                `L ${W - LR},${y}`,
                `A ${LR},${LR} 0 0 1 ${W - LR},${y + H}`,
                `L ${SR},${y + H}`,
                `A ${SR},${SR} 0 0 1 0,${y + H - SR}`,
            );
        }

        // Transition to next card
        if (i < 2) {
            const nextY = yPos[i + 1];
            const midY = (y + H - SR + nextY + SR) / 2;

            if (isLeft) {
                // From right side bottom → to left side top of next card
                segments.push(`C ${W + 60},${midY} ${-60},${midY} 0,${nextY + SR}`);
            } else {
                // From left side bottom → to right side top of next card
                segments.push(`C ${-60},${midY} ${W + 60},${midY} ${W},${nextY + SR}`);
            }
        }
    }

    return { d: segments.join(' '), totalHeight: yPos[2] + cardHeights[2] };
}

export default function ProgramSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState<{ width: number; heights: number[] } | null>(null);
    const gap = 80;

    useEffect(() => {
        const measure = () => {
            if (!containerRef.current) return;
            const cards = containerRef.current.querySelectorAll<HTMLElement>('[data-card]');
            const heights = Array.from(cards).map((el) => el.offsetHeight);
            const width = containerRef.current.offsetWidth;
            if (heights.length === 3) setDims({ width, heights });
        };
        measure();
        const t = setTimeout(measure, 200);
        window.addEventListener('resize', measure);
        return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
    }, []);

    const pathData = dims ? buildPath(dims.width, dims.heights, gap) : null;

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
            <div ref={containerRef} className="relative mx-auto max-w-[760px]">
                {/* SVG flowing gradient line — needs inline style for dynamic height */}
                {pathData && (
                    <svg
                        viewBox={`-10 -10 ${dims!.width + 20} ${pathData.totalHeight + 20}`}
                        fill="none"
                        className="pointer-events-none absolute top-0 left-0 z-1 w-full overflow-visible"
                        style={{ height: `${pathData.totalHeight}px` }}
                        preserveAspectRatio="xMidYMin meet"
                    >
                        <defs>
                            <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366F1" />
                                <stop offset="25%" stopColor="#3B82F6" />
                                <stop offset="50%" stopColor="#818CF8" />
                                <stop offset="75%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#6366F1" />
                            </linearGradient>
                        </defs>
                        <path d={pathData.d} stroke="url(#flowGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                )}

                {/* Cards */}
                <div className="relative flex flex-col" style={{ gap: `${gap}px` }}>
                    {programs.map((p) => (
                        <div key={p.title} data-card><ProgramCard {...p} /></div>
                    ))}
                </div>
            </div>
        </section>
    );
}
