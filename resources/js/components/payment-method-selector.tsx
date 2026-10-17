import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { QrCode, Building2, Check, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import BankLogo from '@/components/bank-logo';

export interface SupportedBank {
    code?: string;
    name?: string;
    bank_code: string;
    bank_name: string;
    va_type?: string[];
}

interface PaymentMethodSelectorProps {
    selectedChannel: string;
    onChannelChange: (channel: string) => void;
    className?: string;
}

const DEFAULT_BANKS: SupportedBank[] = [
    { bank_code: 'BMRI', bank_name: 'Bank Mandiri', va_type: ['DYNAMIC', 'STATIC'] },
    { bank_code: 'BRIN', bank_name: 'Bank BRI', va_type: ['DYNAMIC', 'STATIC'] },
    { bank_code: 'BNIA', bank_name: 'Bank BNI', va_type: ['DYNAMIC', 'STATIC'] },
    { bank_code: 'BBBA', bank_name: 'Bank BCA', va_type: ['DYNAMIC', 'STATIC'] },
    { bank_code: 'BSYI', bank_name: 'Bank Syariah Indonesia (BSI)', va_type: ['DYNAMIC', 'STATIC'] },
    { bank_code: 'BDIN', bank_name: 'Bank Danamon', va_type: ['DYNAMIC', 'STATIC'] },
    { bank_code: 'BNIN', bank_name: 'Bank Permata', va_type: ['DYNAMIC', 'STATIC'] },
];

export default function PaymentMethodSelector({
    selectedChannel,
    onChannelChange,
    className = '',
}: PaymentMethodSelectorProps) {
    const isQris = !selectedChannel || selectedChannel.toLowerCase() === 'qris';
    const isVa = !isQris;

    const [banks, setBanks] = useState<SupportedBank[]>(DEFAULT_BANKS);
    const [selectedBank, setSelectedBank] = useState<string>(
        isVa && selectedChannel ? selectedChannel : DEFAULT_BANKS[0].bank_code
    );
    const [showBankList, setShowBankList] = useState<boolean>(true);

    // Fetch daftar bank aktual dari API
    useEffect(() => {
        let isMounted = true;
        axios
            .get('/payment/va-banks')
            .then((res) => {
                if (isMounted && res.data && res.data.success) {
                    const bankList = res.data.banks || res.data.data;
                    if (Array.isArray(bankList) && bankList.length > 0) {
                        setBanks(bankList);
                    }
                }
            })
            .catch(() => {
                // Fallback default sudah tersedia
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const handleSelectMethod = (method: 'qris' | 'va') => {
        if (method === 'qris') {
            onChannelChange('qris');
        } else {
            const bankToSet = selectedBank || banks[0]?.bank_code || 'BMRI';
            setSelectedBank(bankToSet);
            onChannelChange(bankToSet);
            setShowBankList(true);
        }
    };

    const handleSelectBank = (bankCode: string) => {
        setSelectedBank(bankCode);
        onChannelChange(bankCode);
    };

    const currentBankObj =
        banks.find((b) => (b.bank_code || b.code || '').toUpperCase() === selectedBank.toUpperCase()) || banks[0];

    return (
        <div className={`space-y-3.5 ${className}`}>
            <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-foreground">Metode Pembayaran</Label>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Pembayaran Aman
                </span>
            </div>

            {/* Method Cards - Stacked Vertically to prevent narrow sidebar squishing/offset */}
            <div className="space-y-2.5">
                {/* 1. QRIS Card */}
                <div
                    onClick={() => handleSelectMethod('qris')}
                    role="button"
                    tabIndex={0}
                    className={`group relative flex cursor-pointer items-center justify-between rounded-xl border-2 p-3 sm:p-3.5 transition-all duration-200 select-none ${
                        isQris
                            ? 'border-orange-500 bg-orange-50/70 dark:border-orange-500 dark:bg-orange-950/20 shadow-xs'
                            : 'border-border/70 bg-card hover:border-orange-300 dark:hover:border-orange-800'
                    }`}
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <BankLogo bankCode="QRIS" size="md" className="shrink-0" />
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-sm text-foreground">QRIS</span>
                                <Badge
                                    variant="outline"
                                    className="border-emerald-300 bg-emerald-50 text-[10px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 py-0 px-1.5 font-bold"
                                >
                                    Instan
                                </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                                GoPay, BCA, Mandiri, OVO, Dana, ShopeePay
                            </p>
                        </div>
                    </div>

                    <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ml-2 ${
                            isQris
                                ? 'border-orange-500 bg-orange-500 text-white shadow-xs'
                                : 'border-muted-foreground/30'
                        }`}
                    >
                        {isQris && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                </div>

                {/* 2. Virtual Account Card */}
                <div
                    onClick={() => handleSelectMethod('va')}
                    role="button"
                    tabIndex={0}
                    className={`group relative flex cursor-pointer items-center justify-between rounded-xl border-2 p-3 sm:p-3.5 transition-all duration-200 select-none ${
                        isVa
                            ? 'border-orange-500 bg-orange-50/70 dark:border-orange-500 dark:bg-orange-950/20 shadow-xs'
                            : 'border-border/70 bg-card hover:border-orange-300 dark:hover:border-orange-800'
                    }`}
                >
                    <div className="flex min-w-0 items-center gap-3">
                        {isVa && currentBankObj ? (
                            <BankLogo bankCode={currentBankObj.bank_code || currentBankObj.code || 'BMRI'} size="md" className="shrink-0" />
                        ) : (
                            <div className="flex h-7 w-12 items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                                <Building2 className="h-4 w-4" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-sm text-foreground">Virtual Account</span>
                                <Badge
                                    variant="outline"
                                    className="border-blue-300 bg-blue-50 text-[10px] text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 py-0 px-1.5 font-bold"
                                >
                                    Verifikasi Otomatis
                                </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                                {isVa && currentBankObj ? currentBankObj.bank_name || currentBankObj.name : 'Mandiri, BRI, BNI, BCA, BSI, dll.'}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ml-2 ${
                            isVa
                                ? 'border-orange-500 bg-orange-500 text-white shadow-xs'
                                : 'border-muted-foreground/30'
                        }`}
                    >
                        {isVa && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                </div>
            </div>

            {/* Bank Selector List (shown when VA is active) */}
            {isVa && (
                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 sm:p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between pb-1 border-b border-border/50">
                        <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-orange-600" />
                            <span className="text-xs font-bold text-foreground">Pilih Bank Virtual Account</span>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowBankList(!showBankList);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                        >
                            <span>{showBankList ? 'Tutup Pilihan' : 'Ganti Bank'}</span>
                            {showBankList ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                    </div>

                    {showBankList && (
                        <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-0.5 scrollbar-thin">
                            {banks.map((bank) => {
                                const bankCode = bank.bank_code || bank.code || '';
                                const bankName = bank.bank_name || bank.name || bankCode;
                                const isBankSelected = selectedBank.toUpperCase() === bankCode.toUpperCase();

                                return (
                                    <div
                                        key={bankCode}
                                        onClick={() => handleSelectBank(bankCode)}
                                        role="button"
                                        tabIndex={0}
                                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition-all select-none ${
                                            isBankSelected
                                                ? 'border-orange-500 bg-orange-500/10 dark:border-orange-500 dark:bg-orange-950/40 text-foreground font-semibold shadow-2xs'
                                                : 'border-border/60 bg-card hover:border-orange-300 dark:hover:border-orange-800 text-foreground'
                                        }`}
                                    >
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <BankLogo bankCode={bankCode} size="sm" className="shrink-0" />
                                            <div className="min-w-0">
                                                <div className="text-xs font-semibold text-foreground truncate">{bankName}</div>
                                                <div className="text-[10px] text-muted-foreground font-mono">Kode: {bankCode}</div>
                                            </div>
                                        </div>

                                        <div
                                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ml-2 ${
                                                isBankSelected
                                                    ? 'border-orange-500 bg-orange-500 text-white'
                                                    : 'border-muted-foreground/30'
                                            }`}
                                        >
                                            {isBankSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
