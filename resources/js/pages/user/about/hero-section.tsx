import { motion } from 'framer-motion';
import { Award, Target, Users, Sparkles } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-12 pb-8 md:pt-24 md:pb-16">
            {/* Animated Background Blobs */}
            <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px] dark:bg-primary/10" />

            <div className="relative mx-auto max-w-7xl px-4">
                <div className="mb-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
                    {/* Content - Kiri */}
                    <div className="order-2 text-center lg:order-1 lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-sm shadow-sm"
                        >
                            <Sparkles className="h-4 w-4" />
                            <span>Tentang Level Up Accounting</span>
                        </motion.div>
                        
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="mb-6 text-4xl font-av-estiana font-black leading-tight text-zinc-900 dark:text-white md:text-5xl lg:text-6xl"
                        >
                            Platform Edukasi Pajak
                            <span className="bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-clip-text text-transparent"> Terdepan </span>
                            di Indonesia
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-lg lg:mx-0"
                        >
                            Level Up Accounting hadir sebagai solusi pendidikan dan pelatihan perpajakan modern. Kami berfokus pada peningkatan 
                            kompetensi aplikatif di bidang akuntansi dan perpajakan untuk membantu mahasiswa, karyawan, hingga praktisi mencapai puncak karir mereka.
                        </motion.p>
                    </div>

                    {/* Logo/Illustration - Kanan */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="order-1 flex justify-center lg:order-2"
                    >
                        <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 p-8 shadow-2xl backdrop-blur-3xl md:h-80 md:w-80 lg:h-96 lg:w-96 dark:from-primary/20 dark:to-secondary/20">
                            {/* Glowing ring */}
                            <div className="absolute inset-0 rounded-full border border-white/40 bg-white/20 dark:border-white/10 dark:bg-white/5" />
                            
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                                className="relative z-10 w-full"
                            >
                                <img
                                    src="/assets/images/logo-primary.png"
                                    alt="Logo Level Up Accounting"
                                    className="h-auto w-full dark:hidden"
                                    draggable={false}
                                />
                                <img
                                    src="/assets/images/logo-secondary.png"
                                    alt="Logo Level Up Accounting"
                                    className="hidden h-auto w-full dark:block"
                                    draggable={false}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative z-10 mx-auto max-w-5xl"
                >
                    <div className="mb-10 text-center">
                        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 md:text-2xl font-av-estiana">
                            Rintis Karir Bersama Ribuan Profesional Pajak Lainnya
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                        {/* Stat 1 */}
                        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:bg-zinc-900/50 dark:shadow-none dark:ring-1 dark:ring-white/10">
                            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150 dark:bg-blue-900/20" />
                            <div className="relative z-10">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-white">
                                    <Award className="h-7 w-7" />
                                </div>
                                <h4 className="mb-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">100%</h4>
                                <p className="font-medium text-zinc-500 dark:text-zinc-400">Mentor Tersertifikasi</p>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:bg-zinc-900/50 dark:shadow-none dark:ring-1 dark:ring-white/10">
                            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-50 transition-transform duration-500 group-hover:scale-150 dark:bg-indigo-900/20" />
                            <div className="relative z-10">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-600 dark:text-white">
                                    <Users className="h-7 w-7" />
                                </div>
                                <h4 className="mb-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">5000+</h4>
                                <p className="font-medium text-zinc-500 dark:text-zinc-400">Pengguna Terdaftar</p>
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:col-span-2 lg:col-span-1 dark:bg-zinc-900/50 dark:shadow-none dark:ring-1 dark:ring-white/10">
                            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-50 transition-transform duration-500 group-hover:scale-150 dark:bg-rose-900/20" />
                            <div className="relative z-10">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-600 dark:text-white">
                                    <Target className="h-7 w-7" />
                                </div>
                                <h4 className="mb-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">95%</h4>
                                <p className="font-medium text-zinc-500 dark:text-zinc-400">Tingkat Kepuasan</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}