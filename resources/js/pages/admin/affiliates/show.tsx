import DeleteConfirmDialog from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowLeft, Banknote, CirclePower, DollarSign, Edit, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/use-permission';
import { Affiliate } from '../affiliates/columns';
import { Earning } from '../earnings/columns';
import EditAffiliate from './edit';
import AffiliateDetail from './show-details';
import AffiliateEarnings from './show-earnings';
import AffiliateWithdrawals from './show-withdrawals';

interface Stats {
    total_products: number;
    total_commission: number;
    paid_commission: number;
    available_commission: number;
}

export interface Withdrawal {
    id: string;
    affiliate_user_id: string;
    amount: number;
    withdrawn_at: string;
    created_at: string;
    updated_at: string;
}

interface AffiliateProps {
    affiliate: Affiliate;
    earnings?: Earning[];
    withdrawals?: Withdrawal[];
    stats: Stats;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ShowAffiliate({ affiliate, earnings, withdrawals, stats, flash }: AffiliateProps) {
    const { canManage } = usePermission();
    const canManageAffiliate = canManage('affiliates');
    const [open, setOpen] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Afiliasi',
            href: route('affiliates.index'),
        },
        {
            title: affiliate.name,
            href: route('affiliates.show', { affiliate: affiliate.id }),
        },
    ];

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDelete = () => {
        router.delete(route('affiliates.destroy', affiliate.id));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setWithdrawAmount(value);
    };

    const handleWithdraw = () => {
        const amount = parseInt(withdrawAmount);

        if (!amount || amount <= 0) {
            toast.error('Masukkan nominal yang valid');
            return;
        }

        if (amount > stats.available_commission) {
            toast.error(`Nominal melebihi komisi tersedia (${formatCurrency(stats.available_commission)})`);
            return;
        }

        setIsWithdrawing(true);
        router.post(
            route('affiliates.withdraw', affiliate.id),
            { amount },
            {
                onSuccess: () => {
                    setWithdrawOpen(false);
                    setWithdrawAmount('');
                },
                onFinish: () => setIsWithdrawing(false),
            },
        );
    };

    const handleQuickFill = (percentage: number) => {
        const amount = Math.floor(stats.available_commission * percentage);
        setWithdrawAmount(amount.toString());
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Afiliasi - ${affiliate.name}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{affiliate.name}</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('affiliates.index')}>
                            <ArrowLeft />
                            Kembali
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Tabs defaultValue="info" className="lg:col-span-2">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="info">Informasi</TabsTrigger>
                            <TabsTrigger value="history">Riwayat Komisi</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info">
                            <div className="rounded-lg border">
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="w-1/3 font-medium">Nama</TableCell>
                                            <TableCell>{affiliate.name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Email</TableCell>
                                            <TableCell>{affiliate.email}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">No. Telepon</TableCell>
                                            <TableCell>{affiliate.phone_number}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Kode Afiliasi</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{affiliate.affiliate_code || '-'}</Badge>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Status Afiliasi</TableCell>
                                            <TableCell>
                                                <Badge variant={affiliate.affiliate_status === 'Active' ? 'default' : 'destructive'}>
                                                    {affiliate.affiliate_status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                        <TabsContent value="history">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg border p-4">
                                        <p className="text-muted-foreground text-sm font-medium">Komisi Tersedia</p>
                                        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(stats.available_commission)}
                                        </h3>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <p className="text-muted-foreground text-sm font-medium">Total Ditarik</p>
                                        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(stats.paid_commission)}</h3>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {canManageAffiliate && (
                        <div>
                            <h2 className="my-2 text-lg font-medium">Edit & Kustom</h2>
                            <div className="space-y-4 rounded-lg border p-4">
                                {stats.available_commission > 0 && (
                                    <>
                                        <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                                    <DollarSign className="mr-2 h-4 w-4" />
                                                    Tarik Komisi
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Tarik Komisi</DialogTitle>
                                                    <DialogDescription>
                                                        Masukkan nominal komisi yang ingin ditarik untuk {affiliate.name}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="space-y-4 py-4">
                                                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Komisi Tersedia</p>
                                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                            {formatCurrency(stats.available_commission)}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="amount">Nominal Penarikan</Label>
                                                        <div className="relative">
                                                            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">Rp</span>
                                                            <Input
                                                                id="amount"
                                                                type="text"
                                                                placeholder="0"
                                                                value={withdrawAmount ? parseInt(withdrawAmount).toLocaleString('id-ID') : ''}
                                                                onChange={handleAmountChange}
                                                                className="pl-10"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm">Pilih Cepat</Label>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            <Button type="button" variant="outline" size="sm" onClick={() => handleQuickFill(0.25)}>
                                                                25%
                                                            </Button>
                                                            <Button type="button" variant="outline" size="sm" onClick={() => handleQuickFill(0.5)}>
                                                                50%
                                                            </Button>
                                                            <Button type="button" variant="outline" size="sm" onClick={() => handleQuickFill(0.75)}>
                                                                75%
                                                            </Button>
                                                            <Button type="button" variant="outline" size="sm" onClick={() => handleQuickFill(1)}>
                                                                100%
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setWithdrawOpen(false)} disabled={isWithdrawing}>
                                                        Batal
                                                    </Button>
                                                    <Button onClick={handleWithdraw} disabled={isWithdrawing} className="bg-green-600 hover:bg-green-700">
                                                        {isWithdrawing ? 'Memproses...' : 'Tarik Sekarang'}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Separator />
                                    </>
                                )}

                                <Button asChild className="w-full">
                                    <Link method="post" href={route('affiliates.toggleStatus', { affiliate: affiliate.id })}>
                                        <CirclePower />
                                        {affiliate.affiliate_status === 'Active' ? <span>Non Aktifkan Afiliasi</span> : <span>Aktifkan Afiliasi</span>}
                                    </Link>
                                </Button>
                                <Separator />
                                <div className="space-y-2">
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="w-full" variant="secondary">
                                                <Edit />
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <EditAffiliate affiliate={affiliate} setOpen={setOpen} />
                                    </Dialog>
                                    <DeleteConfirmDialog
                                        trigger={
                                            <Button variant="destructive" className="w-full">
                                                <Trash /> Hapus
                                            </Button>
                                        }
                                        title="Apakah Anda yakin ingin menghapus afiliasi ini?"
                                        itemName={affiliate.name}
                                        onConfirm={handleDelete}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-4 rounded-lg border p-4">
                    <h3 className="text-muted-foreground text-center text-sm">
                        Dibuat pada : {format(new Date(affiliate.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}
                    </h3>
                </div>
            </div>
        </AdminLayout>
    );
}
