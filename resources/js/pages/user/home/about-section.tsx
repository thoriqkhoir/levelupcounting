import { Button } from '@/components/ui/button';
import { Cursor } from '@/components/ui/cursor';
import { Tilt } from '@/components/ui/tilt';
import { Link } from '@inertiajs/react';
import { SVGProps } from 'react';
import { motion } from 'motion/react';


const MouseIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={26} height={31} fill="none" {...props}>
            <g clipPath="url(#a)">
                <path
                    fill={'#FF7F3E'} // Ubah warna di sini
                    fillRule="evenodd"
                    stroke={'#fff'}
                    strokeLinecap="square"
                    strokeWidth={2}
                    d="M21.993 14.425 2.549 2.935l4.444 23.108 4.653-10.002z"
                    clipRule="evenodd"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill={'#FF7F3E'} d="M0 0h26v31H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default function AboutSection() {
    return (
        <section className="relative mx-auto w-full max-w-7xl px-4 py-16">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center">

                {/* Kolom Kiri */}
                <div className="flex flex-1 flex-col gap-6">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-1.5 text-sm font-medium text-primary">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Educate, Innovate and Lead
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="space-y-1"
                    >
                        <h1 className="font-av-estiana text-4xl font-bold leading-tight text-foreground md:text-5xl">
                            Learn Without Limits
                        </h1>
                        <h2 className="text-4xl font-bold leading-tight md:text-5xl">
                            Grow Without{' '}
                            <span className="text-primary">Boundaries</span>
                        </h2>
                    </motion.div>

                    {/* Deskripsi */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-md text-base text-muted-foreground"
                    >
                        Kami menghadirkan pelatihan Akuntansi dan Pajak berbasis praktik, sertifikasi, dan kelas online untuk membantumu siap bersaing di dunia kerja.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap gap-3"
                    >
                        <Button asChild size="default" className="rounded-full px-6">
                            <Link href="/course">Browse Program</Link>
                        </Button>
                        <Button asChild variant="outline" size="default" className="rounded-full px-6">
                            <Link href="/contact">Get In Touch</Link>
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2"
                    >
                        {/* Success Rate */}
                        <div>
                            <p className="text-4xl font-extrabold text-foreground">99%</p>
                            <p className="text-sm text-muted-foreground">Success Rate</p>
                        </div>

                        {/* Total Students */}
                        <div className="flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2">
                            <div className="flex -space-x-2">
                                <div className="h-8 w-8 rounded-full border-2 border-white bg-primary/30 overflow-hidden">
                                    <img src="/assets/images/avatar-1.jpg" alt="Student" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                </div>
                                <div className="h-8 w-8 rounded-full border-2 border-white bg-primary/50 overflow-hidden">
                                    <img src="/assets/images/avatar-2.jpg" alt="Student" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                </div>
                                <div className="h-8 w-8 rounded-full border-2 border-white bg-primary/70 overflow-hidden">
                                    <img src="/assets/images/avatar-3.jpg" alt="Student" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-primary">30k Total Students</p>
                        </div>
                    </motion.div>
                </div>

                {/* Kolom Kanan — Gambar Header */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="flex w-full flex-1 justify-center lg:justify-end items-center"
                >
                    <img
                        src="/assets/images/header-home.svg"
                        alt="Level Up Counting Header"
                        className="w-full max-w-lg object-contain lg:max-w-xl xl:max-w-2xl"
                    />
                </motion.div>

            </div>
        </section>
    );
}


