import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { Linkedin, Mail, Star, BookOpen, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useInitials } from '@/hooks/use-initials';

interface Mentor {
    id: string;
    name: string;
    bio?: string;
    avatar?: string;
    photo_url?: string;
    email?: string;
    total_courses: number;
    total_articles: number;
    total_webinars: number;
    total_bootcamps: number;
}

interface TeamSectionProps {
    mentors: Mentor[];
}

export function TeamSection({ mentors }: TeamSectionProps) {
    const getInitials = useInitials();

    // Jika tidak ada mentor, tampilkan data placeholder
    const displayMentors = mentors.length > 0 ? mentors : [
        {
            id: '1',
            name: 'Dr. Ahmad Hidayat',
            bio: 'Pakar perpajakan dengan pengalaman 15+ tahun',
            avatar: undefined,
            email: 'ahmad@levelupaccounting.id',
            total_courses: 0,
            total_articles: 0,
            total_webinars: 0,
            total_bootcamps: 0,
        },
        {
            id: '2',
            name: 'Siti Nurhaliza, S.E., M.Ak',
            bio: 'Spesialis pendidikan akuntansi dan perpajakan',
            avatar: undefined,
            email: 'siti@levelupaccounting.id',
            total_courses: 0,
            total_articles: 0,
            total_webinars: 0,
            total_bootcamps: 0,
        },
        {
            id: '3',
            name: 'Budi Santoso, BKP',
            bio: 'Konsultan pajak bersertifikat dengan track record solid',
            avatar: undefined,
            email: 'budi@levelupaccounting.id',
            total_courses: 0,
            total_articles: 0,
            total_webinars: 0,
            total_bootcamps: 0,
        },
        {
            id: '4',
            name: 'Dr. Lestari Wijaya',
            bio: 'Ahli konsultasi pajak internasional',
            avatar: undefined,
            email: 'lestari@levelupaccounting.id',
            total_courses: 0,
            total_articles: 0,
            total_webinars: 0,
            total_bootcamps: 0,
        },
        {
            id: '5',
            name: 'Rizki Pratama, S.Ak',
            bio: 'Spesialis perpajakan UMKM dan e-commerce',
            avatar: undefined,
            email: 'rizki@levelupaccounting.id',
            total_courses: 0,
            total_articles: 0,
            total_webinars: 0,
            total_bootcamps: 0,
        },
    ];

    return (
        <section className="w-full py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center md:mb-12"
                >
                    <div className="mb-4 flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                            👥 Tim &amp; Mentor
                        </span>
                    </div>
                    <h2 className="font-av-estiana mb-3 text-2xl font-extrabold md:text-3xl">
                        Profesional Mentor{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10">dan Tim Kami</span>
                            <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm text-gray-600 dark:text-gray-400 md:text-base">
                        Bertemu dengan para profesional yang berdedikasi membimbing perjalanan belajar Anda
                    </p>
                </motion.div>

                <InfiniteSlider speedOnHover={20} gap={16} className="mb-6 px-2 py-4 md:mb-8 md:gap-24 md:px-4 md:py-6">
                    {displayMentors.map((member) => (
                        <div
                            key={member.id}
                            className="group relative flex-shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 dark:border-gray-800 dark:bg-gray-900"
                            style={{ width: '300px', minWidth: '300px' }}
                        >
                            {/* Top Banner/Gradient */}
                            <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-blue-500 transition-all duration-500 group-hover:scale-105">
                                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-xl" />
                                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-black/10 blur-xl" />
                            </div>
                            
                            <div className="relative px-6 pb-6 pt-0">
                                {/* Avatar Positioned Overlapping the Banner */}
                                <div className="relative mx-auto -mt-14 mb-4 inline-block">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-md ring-2 ring-primary/20 transition-transform duration-300 group-hover:scale-105 dark:border-gray-900">
                                        <AvatarImage src={member.photo_url ? (member.photo_url.startsWith('http') ? member.photo_url : `/storage/${member.photo_url}`) : (member.avatar || undefined)} alt={member.name} className="object-cover" />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-2xl font-bold text-white">
                                            {getInitials(member.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Floating Badge */}
                                    <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-gradient-to-br from-yellow-400 to-yellow-500 p-1.5 shadow-sm dark:border-gray-900">
                                        <Star className="h-3.5 w-3.5 fill-white text-white" />
                                    </div>
                                </div>

                                {/* Text Info */}
                                <h3 className="mb-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white md:text-xl">
                                    {member.name}
                                </h3>
                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary/80">
                                    {member.total_courses > 0 || member.total_bootcamps > 0 || member.total_articles > 0 
                                        ? 'Mentor Profesional' 
                                        : 'Mentor'}
                                </p>
                                
                                {/* Stats Mini */}
                                <div className="mb-4 flex items-center justify-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-800">
                                        <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                                        <span>{member.total_courses + member.total_bootcamps + member.total_webinars} Kelas</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-800">
                                        <FileText className="h-3.5 w-3.5 text-purple-500" />
                                        <span>{member.total_articles} Artikel</span>
                                    </div>
                                </div>

                                <p className="mb-6 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                    {member.bio || 'Bergabung bersama Level Up Accounting untuk membimbing perjalanan belajar Anda.'}
                                </p>

                                {/* Button */}
                                <Button 
                                    className="group/btn relative w-full overflow-hidden rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 dark:bg-primary/20 dark:hover:bg-primary" 
                                    asChild
                                >
                                    <a href={`/mentor/${member.id}`}>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Lihat Profil
                                            <svg
                                                className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </a>
                                </Button>
                            </div>
                        </div>
                    ))}
                </InfiniteSlider>
            </div>
        </section>
    );
}