import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserLayout from '@/layouts/user-layout';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { AlertCircle, Award, Calendar, Download, ExternalLink, Mail, Phone, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CertificateParticipant {
    id: string;
    certificate_code: string;
    certificate_number: number;
    created_at: string;
    user?: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    } | null;
    certificate: {
        id: string;
        title: string;
        issued_date: string;
        course?: { title: string } | null;
        bootcamp?: { title: string } | null;
        webinar?: { title: string } | null;
        design?: {
            id: string;
            name: string;
            image_1: string | null;
            image_2: string | null;
        } | null;
    };
}

interface CheckCertificateProps {
    participants: CertificateParticipant[];
    searched: boolean;
    error: string | null;
    filters: {
        email: string | null;
        phone_number: string | null;
    };
}

export default function CheckCertificate({ participants, searched, error, filters }: CheckCertificateProps) {
    const { t, i18n } = useTranslation('user');
    const dateLocale = i18n.language === 'en' ? enUS : id;
    const { auth } = usePage<SharedData>().props;

    const [email, setEmail] = useState(filters.email || (auth.user?.email as string) || '');
    const [phone, setPhone] = useState(filters.phone_number || (auth.user?.phone_number as string) || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !phone.trim()) return;

        setLoading(true);
        router.get(
            route('certificates.check'),
            { email, phone_number: phone },
            {
                preserveState: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const getProgramDetails = (participant: CertificateParticipant) => {
        const cert = participant.certificate;
        if (cert.course) {
            return { title: cert.course.title, type: t('certificate.types.course'), color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
        }
        if (cert.bootcamp) {
            return { title: cert.bootcamp.title, type: t('certificate.types.bootcamp'), color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
        }
        if (cert.webinar) {
            return { title: cert.webinar.title, type: t('certificate.types.webinar'), color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
        }
        return { title: cert.title, type: t('certificate.types.certificate'), color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' };
    };

    const renderCertificatePreview = (participant: CertificateParticipant) => {
        return (
            <div className="relative aspect-[1.414/1] w-full overflow-hidden bg-muted border-b">
                <iframe
                    src={`/certificate/${participant.certificate_code}/pdf#toolbar=0`}
                    className="h-full w-full border-0 select-none pointer-events-none"
                    title={`${t('certificate.types.certificate')} ${participant.certificate_code}`}
                    loading="lazy"
                />
            </div>
        );
    };

    return (
        <UserLayout>
            <Head title={t('certificate.headTitle')} />

            {/* Decorative Background */}
            <div className="relative min-h-screen bg-background overflow-x-hidden">
                <div className="pointer-events-none absolute -top-24 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/15 blur-3xl" />
                <div className="pointer-events-none absolute -top-24 -right-16 z-0 h-[450px] w-[450px] rounded-full bg-secondary/15 blur-3xl" />

                {/* Hero Section */}
                <section className="relative z-10 pt-28 pb-10 text-center px-4">
                    <div className="mx-auto max-w-4xl">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-5 flex justify-center"
                        >
                            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-xs ring-1 ring-primary/20">
                                <Sparkles className="h-4 w-4 animate-pulse" />
                                {t('certificate.headTitle', 'Verifikasi Sertifikat')}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="font-av-estiana mx-auto mb-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                        >
                            {t('certificate.title').split(' ')[0]}{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-primary">{t('certificate.title').split(' ').slice(1).join(' ') || 'Sertifikat'}</span>
                                <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground"
                        >
                            {t('certificate.subtitle')}
                        </motion.p>
                    </div>
                </section>

                {/* Main Content Section */}
                <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 space-y-10">
                    {/* Centered Modern Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="mx-auto max-w-2xl"
                    >
                        <div className="relative rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-xl backdrop-blur-md">
                            <div className="mb-6 text-center">
                                <h2 className="text-xl font-bold tracking-tight text-foreground">{t('certificate.searchFormTitle')}</h2>
                                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{t('certificate.searchFormDesc')}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5 text-primary" /> {t('certificate.registeredEmail')}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="contoh@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-11 rounded-xl bg-background/70 border-border/70 focus-visible:ring-primary text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5 text-primary" /> {t('certificate.waNumber')}
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="text"
                                            placeholder="0812xxxxxxxx"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            className="h-11 rounded-xl bg-background/70 border-border/70 focus-visible:ring-primary text-sm"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    size="lg"
                                    className="w-full gap-2 rounded-xl text-sm font-semibold shadow-md transition-all active:scale-[0.99]"
                                >
                                    <Search className="h-4 w-4" />
                                    {loading ? t('certificate.searching') : t('certificate.searchButton')}
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Results Section */}
                    <div className="w-full">
                        {searched ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b pb-3">
                                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                        {t('certificate.searchResults')}
                                    </h3>
                                    <Badge variant="secondary" className="font-semibold text-xs rounded-full px-3 py-1">
                                        {t('certificate.certificatesFound', { count: participants.length })}
                                    </Badge>
                                </div>

                                {error && (
                                    <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive max-w-2xl mx-auto shadow-xs">
                                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">{t('certificate.searchFailed')}</p>
                                            <p className="text-muted-foreground mt-0.5 text-xs">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {!error && participants.length === 0 && (
                                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center bg-card/40 max-w-2xl mx-auto backdrop-blur-xs">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 mb-4 text-muted-foreground">
                                            <Award className="h-8 w-8 opacity-60" />
                                        </div>
                                        <p className="font-bold text-foreground text-base">{t('certificate.notAvailable')}</p>
                                        <p className="text-muted-foreground mt-1 text-xs sm:text-sm max-w-sm">
                                            {t('certificate.notAvailableDesc')}
                                        </p>
                                    </div>
                                )}

                                {!error && participants.length > 0 && (
                                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                        {participants.map((p) => {
                                            const details = getProgramDetails(p);
                                            return (
                                                <Card key={p.id} className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1">
                                                    {renderCertificatePreview(p)}
                                                    <CardHeader className="p-4 pb-2">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider rounded-md px-2 py-0.5 ${details.color}`}>
                                                                {details.type}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground font-mono">
                                                                {p.certificate_code}
                                                            </span>
                                                        </div>
                                                        <CardTitle className="text-base line-clamp-2 leading-snug font-bold">
                                                            {details.title}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="h-3.5 w-3.5 text-primary" />
                                                            <span>{t('certificate.issuedDate')}</span>
                                                            <span className="font-semibold text-foreground">
                                                                {p.certificate.issued_date 
                                                                    ? format(new Date(p.certificate.issued_date), 'dd MMMM yyyy', { locale: dateLocale }) 
                                                                    : '-'}
                                                            </span>
                                                        </div>
                                                    </CardContent>
                                                    <div className="border-t bg-muted/30 px-4 py-3 flex items-center justify-between gap-2">
                                                        <span className="text-[10px] text-muted-foreground font-mono">
                                                            No: {p.certificate_number}
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <Button asChild size="sm" variant="ghost" className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 rounded-lg px-2.5">
                                                                <a href={route('certificate.participant.detail', p.certificate_code)} target="_blank" rel="noopener noreferrer">
                                                                    {t('certificate.view')}
                                                                    <ExternalLink className="h-3 w-3" />
                                                                </a>
                                                            </Button>
                                                            <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 text-xs px-2.5 rounded-lg border-primary/20 text-primary hover:bg-primary/10">
                                                                <a href={route('certificate.participant.download.public', p.certificate_code)}>
                                                                    {t('certificate.download')}
                                                                    <Download className="h-3 w-3" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.55 }}
                                className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center bg-card/40 min-h-[260px] max-w-2xl mx-auto backdrop-blur-xs"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                                    <Award className="h-8 w-8 animate-pulse" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">{t('certificate.initialStateTitle')}</h3>
                                <p className="text-muted-foreground mt-1.5 text-xs sm:text-sm max-w-sm">
                                    {t('certificate.initialStateDesc')}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </section>
            </div>
        </UserLayout>
    );
}
