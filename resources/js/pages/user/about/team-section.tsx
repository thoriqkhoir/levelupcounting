import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { Linkedin, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useInitials } from '@/hooks/use-initials';

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
            email: 'ahmad@sekolahpajak.id',
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
            email: 'siti@sekolahpajak.id',
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
            email: 'budi@sekolahpajak.id',
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
            email: 'lestari@sekolahpajak.id',
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
            email: 'rizki@sekolahpajak.id',
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
                    <h2 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl lg:text-4xl">Tim Kami</h2>
                    <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400 md:text-lg">
                        Bertemu dengan para profesional yang berdedikasi membimbing perjalanan belajar Anda
                    </p>
                </motion.div>

                <InfiniteSlider speedOnHover={20} gap={16} className="mb-6 px-2 py-4 md:mb-8 md:gap-24 md:px-4 md:py-6">
                    {displayMentors.map((member) => (
                        <div
                            key={member.id}
                            className="group relative flex-shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 md:p-8"
                            style={{ width: '280px', minWidth: '280px' }}
                        >
                            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-2xl transition-transform group-hover:scale-150 md:h-32 md:w-32 md:-translate-y-8 md:translate-x-8" />
                            
                            <div className="relative">
                                <Avatar className="mx-auto mb-3 h-20 w-20 border-4 border-white shadow-lg ring-4 ring-primary/20 dark:border-gray-800 md:mb-4 md:h-24 md:w-24">
                                    <AvatarImage src={member.avatar || undefined} alt={member.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-xl font-bold text-white md:text-2xl">
                                        {getInitials(member.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <h3 className="mb-1 text-lg font-bold md:text-xl">{member.name}</h3>
                                <p className="mb-2 text-xs font-medium text-primary md:mb-3 md:text-sm">
                                    {member.total_courses > 0 || member.total_bootcamps > 0 || member.total_articles > 0 
                                        ? 'Mentor Profesional' 
                                        : 'Mentor'}
                                </p>
                                <p className="mb-4 line-clamp-3 text-xs text-gray-600 dark:text-gray-400 md:mb-6 md:text-sm">
                                    {member.bio || 'Mentor berpengalaman di Sekolah Pajak'}
                                </p>

                                <Button size="sm" variant="default" className="w-full text-xs md:text-sm" asChild>
                                    <a href={`/mentor/${member.id}`}>
                                        Lihat Profil
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