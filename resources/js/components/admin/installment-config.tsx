import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn, parseRupiah, rupiahFormatter } from '@/lib/utils';
import { addWeeks, format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarDays, CalendarFold, Info, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface InstallmentTerm {
    id?: string;
    term_number: number;
    amount: number;
    due_date: string;
}

interface InstallmentConfigProps {
    productType: string;
    productId: string;
    productPrice: number;
    installmentEnabled: boolean;
    initialTerms?: InstallmentTerm[];
    registrationDeadline?: string | Date | null;
}

export default function InstallmentConfig({
    productType,
    productId,
    productPrice,
    installmentEnabled: initialEnabled,
    initialTerms = [],
    registrationDeadline,
}: InstallmentConfigProps) {
    const isFree = !productPrice || productPrice <= 0;

    const [enabled, setEnabled] = useState(isFree ? false : initialEnabled);

    // Hitung tanggal default
    const getDefaultTerm1Date = (): Date => {
        if (!registrationDeadline) return new Date();
        try {
            const d = typeof registrationDeadline === 'string' ? parseISO(registrationDeadline) : new Date(registrationDeadline);
            return isNaN(d.getTime()) ? new Date() : d;
        } catch {
            return new Date();
        }
    };

    const [terms, setTerms] = useState<InstallmentTerm[]>(() => {
        if (initialTerms.length > 0) {
            return initialTerms.map(t => ({
                ...t,
                due_date: t.due_date ? format(typeof t.due_date === 'string' ? parseISO(t.due_date) : t.due_date, 'yyyy-MM-dd') : ''
            }));
        }

        const t1Date = getDefaultTerm1Date();
        const t2Date = addWeeks(t1Date, 3);
        const t1Amount = productPrice > 0 ? Math.floor(productPrice / 2) : 0;
        const t2Amount = productPrice > 0 ? productPrice - t1Amount : 0;

        return [
            { term_number: 1, amount: t1Amount, due_date: format(t1Date, 'yyyy-MM-dd') },
            { term_number: 2, amount: t2Amount, due_date: format(t2Date, 'yyyy-MM-dd') },
        ];
    });

    const [isSaving, setIsSaving] = useState(false);

    // Auto-split jika productPrice > 0 dan terms masih bernilai 0
    useEffect(() => {
        if (initialTerms.length === 0 && productPrice > 0) {
            setTerms(prev => {
                const allZero = prev.every(t => !t.amount || t.amount === 0);
                if (allZero && prev.length >= 2) {
                    const splitAmount = Math.floor(productPrice / prev.length);
                    return prev.map((t, idx) => ({
                        ...t,
                        amount: idx === prev.length - 1 ? productPrice - splitAmount * (prev.length - 1) : splitAmount
                    }));
                }
                return prev;
            });
        }
    }, [productPrice, initialTerms.length]);

    // Fungsi bagi rata nominal ke semua termin aktif
    function distributeEvenly() {
        if (productPrice <= 0 || terms.length === 0) return;
        const splitAmount = Math.floor(productPrice / terms.length);
        setTerms(prev => prev.map((t, idx) => ({
            ...t,
            amount: idx === prev.length - 1 ? productPrice - splitAmount * (prev.length - 1) : splitAmount
        })));
        toast.success('Nominal berhasil dibagi rata ke seluruh termin');
    }

    const totalTermsAmount = terms.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    // Validasi: total termin TIDAK BOLEH KURANG dari harga produk (boleh sama atau lebih)
    const isTermsValid = totalTermsAmount >= productPrice && productPrice > 0 && terms.length >= 2 && terms.every(t => t.amount > 0 && t.due_date);

    const fetchFreshCsrfToken = async (): Promise<string> => {
        try {
            const res = await axios.get('/csrf-token');
            if (res.data?.token) {
                const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
                if (meta) meta.content = res.data.token;
                return res.data.token;
            }
        } catch (e) {
            console.error('Failed to fetch CSRF token:', e);
        }
        const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        return meta ? meta.content : '';
    };

    async function handleSave() {
        if (enabled && !isTermsValid) {
            if (totalTermsAmount < productPrice) {
                toast.error(`Total nominal seluruh termin (${rupiahFormatter.format(totalTermsAmount)}) tidak boleh kurang dari harga produk (${rupiahFormatter.format(productPrice)})`);
            } else if (terms.length < 2) {
                toast.error('Minimal harus ada 2 termin cicilan.');
            } else {
                toast.error('Pastikan semua termin memiliki nominal dan tanggal jatuh tempo yang valid.');
            }
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                type: productType,
                id: productId,
                installment_enabled: enabled,
                terms: enabled ? terms.map(t => ({
                    term_number: t.term_number,
                    amount: Number(t.amount),
                    due_date: t.due_date,
                })) : [],
            };

            const metaToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content;
            const token = metaToken || (await fetchFreshCsrfToken());

            const sendRequest = (csrf: string) =>
                axios.post('/admin/installment-terms', payload, {
                    headers: {
                        'X-CSRF-TOKEN': csrf,
                    },
                });

            let res;
            try {
                res = await sendRequest(token);
            } catch (err: any) {
                if (err.response?.status === 419) {
                    const freshToken = await fetchFreshCsrfToken();
                    res = await sendRequest(freshToken);
                } else {
                    throw err;
                }
            }

            if (res.data.success) {
                toast.success(res.data.message || 'Konfigurasi cicilan berhasil disimpan.');
                if (res.data.terms) {
                    setTerms(res.data.terms.map((t: any) => ({
                        ...t,
                        due_date: t.due_date ? format(parseISO(t.due_date), 'yyyy-MM-dd') : '',
                    })));
                }
            } else {
                toast.error(res.data.message || 'Gagal menyimpan konfigurasi cicilan.');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan.');
        } finally {
            setIsSaving(false);
        }
    }

    function addTerm() {
        const newNumber = terms.length + 1;
        const lastDueDate = terms[terms.length - 1]?.due_date;
        const nextDate = lastDueDate ? addWeeks(parseISO(lastDueDate), 2) : new Date();

        setTerms(prev => [
            ...prev,
            {
                term_number: newNumber,
                amount: 0,
                due_date: format(nextDate, 'yyyy-MM-dd'),
            }
        ]);
    }

    function removeTerm(index: number) {
        if (terms.length <= 2) {
            toast.error('Minimal harus ada 2 termin cicilan.');
            return;
        }
        setTerms(prev => {
            const updated = prev.filter((_, i) => i !== index);
            return updated.map((t, i) => ({ ...t, term_number: i + 1 }));
        });
    }

    function updateTerm(index: number, field: keyof InstallmentTerm, value: any) {
        setTerms(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }

    const difference = totalTermsAmount - productPrice;

    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
            {/* Header: Title + Switch */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">Pengaturan Pembayaran Cicilan</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Aktifkan opsi pembayaran bertahap (cicilan) untuk produk ini
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={cn("text-xs font-medium", enabled ? "text-primary" : "text-muted-foreground")}>
                        {enabled ? 'Cicilan Aktif' : 'Cicilan Nonaktif'}
                    </span>
                    <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => {
                            if (isFree && checked) {
                                toast.error('Produk gratis tidak dapat mengaktifkan fitur cicilan.');
                                return;
                            }
                            setEnabled(checked);
                        }}
                        disabled={isFree}
                        id="installment-toggle"
                    />
                </div>
            </div>

            {/* Info jika produk gratis */}
            {isFree && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg">
                    <Info className="h-4 w-4 flex-shrink-0" />
                    <span>Fitur cicilan dinonaktifkan karena produk ini berstatus gratis (harga Rp 0).</span>
                </div>
            )}

            {/* Content saat cicilan aktif */}
            {enabled && !isFree && (
                <div className="space-y-4">
                    {/* Ringkasan Perhitungan */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/50 rounded-lg p-3.5 border border-border">
                        <div className="text-xs space-y-0.5">
                            <span className="text-muted-foreground">Harga Produk: </span>
                            <span className="font-semibold text-foreground">{rupiahFormatter.format(productPrice)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className={cn(
                                "font-medium",
                                totalTermsAmount >= productPrice ? "text-green-600 dark:text-green-400" : "text-destructive"
                            )}>
                                Total: {rupiahFormatter.format(totalTermsAmount)}
                            </span>
                            <span className="text-muted-foreground">/ {rupiahFormatter.format(productPrice)}</span>
                            {difference > 0 && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-800">
                                    +{rupiahFormatter.format(difference)}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {totalTermsAmount < productPrice && (
                        <div className="flex items-center justify-between gap-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3.5 py-2.5 rounded-lg">
                            <span>⚠️ Total nominal seluruh termin ({rupiahFormatter.format(totalTermsAmount)}) tidak boleh kurang dari harga produk ({rupiahFormatter.format(productPrice)})</span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={distributeEvenly}
                                className="h-7 text-xs bg-background text-foreground border-border hover:bg-muted"
                            >
                                Bagi Rata Nominal
                            </Button>
                        </div>
                    )}

                    <div className="space-y-3">
                        {terms.map((term, index) => {
                            const dueDateObj = term.due_date ? parseISO(term.due_date) : undefined;

                            return (
                                <div key={index} className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-end rounded-lg border border-border bg-muted/30 p-3.5">
                                    {/* Number Badge */}
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold self-end mb-0.5">
                                        {term.term_number}
                                    </div>

                                    {/* Nominal */}
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-foreground">
                                            Nominal {index === 0 ? '(DP)' : ''}
                                        </Label>
                                        <Input
                                            type="text"
                                            value={rupiahFormatter.format(term.amount || 0)}
                                            onChange={e => updateTerm(index, 'amount', parseRupiah(e.target.value))}
                                            placeholder="Rp 0"
                                            className="h-9 text-sm"
                                        />
                                    </div>

                                    {/* Due Date with Shadcn Popover & Calendar */}
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-foreground">
                                            Jatuh Tempo
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-between text-left font-normal h-9 text-sm bg-background",
                                                        !term.due_date && "text-muted-foreground"
                                                    )}
                                                >
                                                    {dueDateObj ? (
                                                        format(dueDateObj, 'dd MMMM yyyy', { locale: id })
                                                    ) : (
                                                        <span>Pilih tanggal</span>
                                                    )}
                                                    <CalendarFold className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dueDateObj}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            const formatted = format(date, 'yyyy-MM-dd');
                                                            updateTerm(index, 'due_date', formatted);
                                                        }
                                                    }}
                                                    defaultMonth={dueDateObj || new Date()}
                                                    captionLayout="dropdown"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Delete Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive self-end"
                                        onClick={() => removeTerm(index)}
                                        disabled={terms.length <= 2}
                                        title="Hapus termin"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={addTerm} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Termin
                        </Button>
                        <Button variant="secondary" size="sm" onClick={distributeEvenly}>
                            Bagi Rata Nominal
                        </Button>
                    </div>
                </div>
            )}

            {/* Save Button for both enabled and disabled states */}
            <div className="pt-2 flex justify-start">
                <Button
                    size="default"
                    onClick={handleSave}
                    disabled={isSaving || (enabled && !isTermsValid)}
                    className="gap-2"
                >
                    {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                </Button>
            </div>
        </div>
    );
}
