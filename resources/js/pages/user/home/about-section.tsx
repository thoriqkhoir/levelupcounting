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
        <section className="relative mx-auto w-full max-w-7xl px-4 py-8">
            <div className="bg-primary absolute bottom-50 -left-25 h-[200px] w-[100px] rounded-full blur-3xl xl:bottom-20 xl:-left-42"></div>
            <div className="bg-secondary absolute top-25 -right-25 h-[200px] w-[100px] blur-3xl xl:top-0 xl:-right-42"></div>
            <div className="mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="dark:text-primary-foreground mx-auto font-bold max-w-2xl text-3xl leading-snug md:text-4xl"
                >
                    Kenapa Harus Sekolah Pajak?
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="dark:text-primary-foreground mx-auto font-bold max-w-2xl text-3xl leading-snug md:text-4xl"
                >
                    Mulai Karier Profesionalmu dari Sini
                
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className=" text-zinc-600 dark:text-zinc-100 mx-auto w-fit px-4 py-1 mt-2 mb-4  text-sm font-medium sm:text-base"
                    >
                        Kami menghadirkan pelatihan Akuntansi dan Pajak berbasis praktik, sertifikasi, dan kelas online untuk membantumu siap bersaing di dunia kerja.
                    </motion.p>
                </motion.h2>

                </motion.h2>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Button asChild variant="outline" size="default" className="">
                        <Link href="/course">
                            Kenal Lebih Dekat
                        </Link>
                    </Button>
                </motion.div>
                {/* <h2 className="dark:text-primary-foreground mx-auto font-bold max-w-2xl text-3xl leading-snug md:text-4xl">
                    Lorem ipsum dolor sit amet consectetur adipisicing
                    <p className=" text-zinc-600 dark:text-zinc-100 mx-auto w-fit px-4 py-1 mt-2 mb-4  text-sm font-medium sm:text-base">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti, nesciunt! Officiis ratione necessitatibus animi doloremque.
                    </p>
                </h2>
                    <Button asChild variant="outline" size="default" className="">
                        <Link href="/course">
                            Bergabung Sekarang
                        </Link>
                    </Button> */}

                {/* <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div>
                        <Cursor
                            attachToParent
                            variants={{
                                initial: { scale: 0.3, opacity: 0 },
                                animate: { scale: 1, opacity: 1 },
                                exit: { scale: 0.3, opacity: 0 },
                            }}
                            transition={{
                                ease: 'easeInOut',
                                duration: 0.15,
                            }}
                            className="top-4 left-12"
                        >
                            <div>
                                <MouseIcon className="h-6 w-6" />
                                <div className="bg-secondary mt-1 ml-4 rounded-[4px] px-2 py-0.5 text-neutral-50">Web & App Development</div>
                            </div>
                        </Cursor>
                        <Tilt rotationFactor={10} isRevese>
                            <Link
                                href="/"
                                className="hover:border-secondary relative flex w-full cursor-none flex-col items-center justify-center rounded-xl border-2 border-gray-300 p-4 shadow-lg backdrop-blur-md transition duration-200 ease-in dark:border-zinc-100/20 dark:bg-zinc-800/20"
                            >
                                <img src="/assets/images/web-app-icon.webp" loading="lazy" alt="Web Development" className="mx-auto mb-4" />
                                <h2 className="mb-1 text-lg font-semibold">Web & App Development</h2>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    Membangun aplikasi web dan mobile yang responsif dan efisien
                                </p>
                            </Link>
                        </Tilt>
                    </div>
                    <div>
                        <Cursor
                            attachToParent
                            variants={{
                                initial: { scale: 0.3, opacity: 0 },
                                animate: { scale: 1, opacity: 1 },
                                exit: { scale: 0.3, opacity: 0 },
                            }}
                            transition={{
                                ease: 'easeInOut',
                                duration: 0.15,
                            }}
                            className="top-4 left-12"
                        >
                            <div>
                                <MouseIcon className="h-6 w-6" />
                                <div className="bg-secondary mt-1 ml-4 rounded-[4px] px-2 py-0.5 text-neutral-50">Data Science</div>
                            </div>
                        </Cursor>
                        <Tilt rotationFactor={10} isRevese>
                            <Link
                                href="/"
                                className="hover:border-secondary relative flex w-full cursor-none flex-col items-center justify-center rounded-xl border-2 border-gray-300 p-4 shadow-lg backdrop-blur-md transition duration-200 ease-in dark:border-zinc-100/20 dark:bg-zinc-800/20"
                            >
                                <img src="/assets/images/data-science-icon.webp" loading="lazy" alt="Data Science" className="mx-auto mb-4" />
                                <h2 className="mb-1 text-lg font-semibold">Data Science</h2>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    Menganalisis data untuk mendapatkan wawasan yang berharga
                                </p>
                            </Link>
                        </Tilt>
                    </div>
                    <div>
                        <Cursor
                            attachToParent
                            variants={{
                                initial: { scale: 0.3, opacity: 0 },
                                animate: { scale: 1, opacity: 1 },
                                exit: { scale: 0.3, opacity: 0 },
                            }}
                            transition={{
                                ease: 'easeInOut',
                                duration: 0.15,
                            }}
                            className="top-4 left-12"
                        >
                            <div>
                                <MouseIcon className="h-6 w-6" />
                                <div className="bg-secondary mt-1 ml-4 rounded-[4px] px-2 py-0.5 text-neutral-50">Graphic Design</div>
                            </div>
                        </Cursor>

                        <Tilt rotationFactor={10} isRevese>
                            <Link
                                href="/"
                                className="hover:border-secondary relative flex w-full cursor-none flex-col items-center justify-center rounded-xl border-2 border-gray-300 p-4 shadow-lg backdrop-blur-md transition duration-200 ease-in dark:border-zinc-100/20 dark:bg-zinc-800/20"
                            >
                                <img src="/assets/images/graphic-design-icon.webp" loading="lazy" alt="Graphic Design" className="mx-auto mb-4" />
                                <h2 className="mb-1 text-lg font-semibold">Graphic Design</h2>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Mendesain antarmuka yang menarik dan fungsional</p>
                            </Link>
                        </Tilt>
                    </div>
                    <div>
                        <Cursor
                            attachToParent
                            variants={{
                                initial: { scale: 0.3, opacity: 0 },
                                animate: { scale: 1, opacity: 1 },
                                exit: { scale: 0.3, opacity: 0 },
                            }}
                            transition={{
                                ease: 'easeInOut',
                                duration: 0.15,
                            }}
                            className="top-4 left-12"
                        >
                            <div>
                                <MouseIcon className="h-6 w-6" />
                                <div className="bg-secondary mt-1 ml-4 rounded-[4px] px-2 py-0.5 text-neutral-50">Accounting</div>
                            </div>
                        </Cursor>
                        <Tilt rotationFactor={10} isRevese>
                            <Link
                                href="/"
                                className="hover:border-secondary relative flex w-full cursor-none flex-col items-center justify-center rounded-xl border-2 border-gray-300 p-4 shadow-lg backdrop-blur-md transition duration-200 ease-in dark:border-zinc-100/20 dark:bg-zinc-800/20"
                            >
                                <img src="/assets/images/accounting-tax-icon.webp" loading="lazy" alt="Accounting" className="mx-auto mb-4" />
                                <h2 className="mb-1 text-lg font-semibold">Accounting, Finance, & Tax</h2>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Membantu mengelola keuangan dan laporan keuangan</p>
                            </Link>
                        </Tilt>
                    </div>
                </div> */}
            </div>
        </section>
    );
}
