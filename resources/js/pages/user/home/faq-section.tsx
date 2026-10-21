import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FaqSection() {
    const { t } = useTranslation('home');
    const [expanded, setExpanded] = useState<React.Key | null>('getting-started');

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-8 flex flex-col items-start gap-8 lg:flex-row lg:items-center">
        <div className="w-full text-start lg:w-1/2">
                <div className="mb-4 flex justify-start">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                        ❓ {t('faq.badge')}
                    </span>
                </div>
                <h2 className="font-av-estiana dark:text-primary-foreground mb-2 max-w-2xl text-2xl font-extrabold md:text-3xl">
                    {t('faq.titlePrefix')}
                    <span className="relative inline-block">
                        <span className="relative z-10">{t('faq.titleHighlight')}</span>
                        <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
                    </span>
                    {t('faq.titleSuffix')}
                </h2>
                <p className="dark:text-primary-foreground mb-8 max-w-3xl text-sm md:text-base text-gray-500">{t('faq.description')}</p>
            </div>
            <Accordion
                className="w-full lg:w-1/2 flex flex-col gap-2 divide-y divide-zinc-200 dark:divide-zinc-700"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                expandedValue={expanded}
                onValueChange={setExpanded}
            >
                <AccordionItem value="getting-started" className="rounded-lg border-2 border-primary/80 px-4 py-2">
                    <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                        <div className="flex items-center justify-between">
                            <p className="md:text-lg">{t('faq.q1')}</p>
                            <ChevronUp className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                            {t('faq.a1')}
                        </p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="animation-properties" className="rounded-lg border-2 border-primary/80 px-4 py-2">
                    <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                        <div className="flex items-center justify-between">
                            <p className="md:text-lg">{t('faq.q2')}</p>
                            <ChevronUp className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                            {t('faq.a2')}
                        </p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="advanced-usage" className="rounded-lg border-2 border-primary/80 px-4 py-2">
                    <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                        <div className="flex items-center justify-between">
                            <p className="md:text-lg">{t('faq.q3')}</p>
                            <ChevronUp className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                            {t('faq.a3')}
                        </p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="community-and-support" className="rounded-lg border-2 border-primary/80 px-4 py-2">
                    <AccordionTrigger className="w-full text-left text-zinc-950 hover:cursor-pointer dark:text-zinc-50">
                        <div className="flex items-center justify-between">
                            <p className="md:text-lg">{t('faq.q4')}</p>
                            <ChevronUp className="text-primary h-4 w-4 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm text-zinc-500 md:text-base dark:text-zinc-400">
                            {t('faq.a4_part1')}
                            <a href="https://wa.me/+6287775764475" className="text-primary hover:underline">
                                {t('faq.a4_phone')}
                            </a>
                            {t('faq.a4_part2')}
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    );
}
