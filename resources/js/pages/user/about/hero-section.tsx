import { motion } from 'framer-motion';
import { Award, Target, Users } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden ">
            
            <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20 lg:py-24">
                <div className="text-center">
                    {/* Badge - Mobile Center, Desktop stays */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-6 flex justify-center md:hidden"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                            <Award className="h-4 w-4" />
                            <span>Tentang Level Up Accounting</span>
                        </div>
                    </motion.div>

                    <div className="mb-12 grid items-center gap-8 md:grid-cols-[40%_60%]">
                        {/* Logo Level Up Accounting - Kiri (40%) */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="flex items-center justify-center"
                        >
                            <img
                                src="/assets/images/logo-primary.png"
                                alt="Logo Level Up Accounting"
                                className="h-auto w-full max-w-[200px] md:max-w-xs dark:hidden"
                                draggable={false}
                            />
                            <img
                                src="/assets/images/logo-secondary.png"
                                alt="Logo Level Up Accounting"
                                className="hidden h-auto w-full max-w-[200px] md:max-w-xs dark:block"
                                draggable={false}
                            />
                        </motion.div>

                        {/* Content - Kanan (60%) */}
                        <div className="text-center md:text-left">
                            {/* Badge - Desktop Only */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="mb-4 hidden md:inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                            >
                                <Award className="h-4 w-4" />
                                <span>Tentang Level Up Accounting</span>
                            </motion.div>
                            
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl lg:text-4xl xl:text-5xl"
                            >
                                Platform Pembelajaran Perpajakan
                                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Terdepan </span>
                                di Indonesia
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-sm text-gray-600 dark:text-gray-400 md:text-base lg:text-lg"
                            >
                                Level Up Accounting adalah lembaga pendidikan dan pelatihan perpajakan yang berfokus pada peningkatan 
                                kompetensi di bidang akuntansi dan perpajakan untuk mahasiswa, fresh graduate, karyawan, maupun praktisi.
                            </motion.p>
                        </div>
                    </div>

                    {/* Stats Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mb-6 px-2 py-4 text-lg font-semibold md:text-xl lg:text-2xl"
                    >
                        Rintis Karir Bersama Ribuan Profesional Pajak Lainnya
                    </motion.div>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 md:p-8"
                        >
                            <Users className="mx-auto mb-3 h-10 w-10 text-primary md:mb-4 md:h-12 md:w-12" />
                            <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">1000+</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">Siswa Aktif</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 md:p-8"
                        >
                            <Award className="mx-auto mb-3 h-10 w-10 text-primary md:mb-4 md:h-12 md:w-12" />
                            <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">50+</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">Kelas & Program</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 md:p-8 sm:col-span-2 lg:col-span-1"
                        >
                            <Target className="mx-auto mb-3 h-10 w-10 text-primary md:mb-4 md:h-12 md:w-12" />
                            <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">95%</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">Tingkat Kepuasan</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}