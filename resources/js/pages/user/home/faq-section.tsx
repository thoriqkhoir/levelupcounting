import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function FaqSection() {
    const [expanded, setExpanded] = useState<React.Key | null>('getting-started');

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-8 flex items-center gap-8">
            <div className="w-1/2 text-start">
                <h2 className="dark:text-primary-foreground mx-auto mb-2 max-w-2xl text-2xl md:text-3xl font-av-estiana font-semibold">Explore the Frequently Asked Questions</h2>
                <h3 className="dark:text-primary-foreground mx-auto mb-8 max-w-3xl ">Here's a Frequently Asked Questions (FAQ) section for your AP! Selling Website, API key, and start integrating</h3>
            </div>
            <Accordion
                className="w-1/2 flex flex-col gap-2 divide-y divide-zinc-200 dark:divide-zinc-700"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                expandedValue={expanded}
                onValueChange={setExpanded}
            >
                <AccordionItem value="getting-started" className="rounded-lg border-2 border-primary/80 px-4 py-2">
                    <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                        <div className="flex items-center justify-between">
                            <p className="md:text-lg">Apa itu Sekolah Pajak?</p>
                            <ChevronUp className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                            Sekolah Pajak adalah lembaga yang berfokus pada pengembangan kompetensi di bidang perpajakan dan akuntansi. Program kami dirancang praktis dan aplikatif untuk membantu peserta memahami pajak serta mempersiapkan diri menghadapi dunia kerja.
                        </p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="animation-properties" className="rounded-lg border-2 border-primary/80 px-4 py-2">
                    <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                        <div className="flex items-center justify-between">
                            <p className="md:text-lg">Apa saja program yang tersedia di Sekolah Pajak?</p>
                            <ChevronUp className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                            Sekolah Pajak menyediakan program kelas online, sertifikasi, dan pelatihan di bidang perpajakan dan akuntansi yang dirancang sesuai dengan kebutuhan industri dan dunia kerja.
                        </p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="advanced-usage" className="rounded-lg border-2 border-primary/80 px-4 py-2">
                    <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                        <div className="flex items-center justify-between">
                            <p className="md:text-lg">Siapa saja yang bisa mengikuti program di Sekolah Pajak?</p>
                            <ChevronUp className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                            Program Sekolah Pajak terbuka untuk mahasiswa, fresh graduate, karyawan, pelaku UMKM, hingga praktisi yang ingin meningkatkan pemahaman dan keterampilan di bidang perpajakan dan akuntansi.
                        </p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="community-and-support" className="rounded-lg border-2 border-primary/80 px-4 py-2">
                    <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                        <div className="flex items-center justify-between">
                            <p className="md:text-lg">Bagaimana cara mendapatkan informasi lebih lanjut tentang Sekolah Pajak?</p>
                            <ChevronUp className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                            Untuk informasi lebih lengkap, Anda dapat menghubungi admin Sekolah Pajak melalui WhatsApp di{' '}
                            <a href="https://wa.me/+6281252683108" className="text-primary hover:underline">
                                +6281252683108
                            </a>
                             . Kami juga aktif di media sosial seperti Instagram, TikTok, dan LinkedIn untuk berbagi update program serta tips belajar terbaru.

                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    );
}
