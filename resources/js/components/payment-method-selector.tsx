import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { QrCode, Building2, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import axios from 'axios';

export interface SupportedBank {
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
    const isQris = selectedChannel === 'qris';
    const isVa = !isQris;

    const [banks, setBanks] = useState<SupportedBank[]>(DEFAULT_BANKS);
    const [selectedBank, setSelectedBank] = useState<string>(
        isVa && selectedChannel ? selectedChannel : DEFAULT_BANKS[0].bank_code
    );
    const [showBankList, setShowBankList] = useState<boolean>(true);

    // Fetch daftar bank aktual dari API jika tersedia
    useEffect(() => {
        let isMounted = true;
        axios
            .get('/payment/va-banks')
            .then((res) => {
                if (isMounted && res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
                    setBanks(res.data.data);
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

    const currentBankObj = banks.find((b) => b.bank_code.toUpperCase() === selectedBank.toUpperCase()) || banks[0];

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-foreground">Metode Pembayaran</Label>
                <span className="text-xs text-muted-foreground">Pilih metode yang diinginkan</span>
            </div>

            {/* Method Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* QRIS Option */}
                <div
                    onClick={() => handleSelectMethod('qris')}
                    className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                        isQris
                            ? 'border-orange-500 bg-orange-50/60 dark:border-orange-500 dark:bg-orange-950/20 shadow-sm'
                            : 'border-border/70 bg-card hover:border-orange-300 dark:hover:border-orange-700/60'
                    }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                    isQris
                                        ? 'bg-orange-500 text-white shadow-sm'
                                        : 'bg-muted text-muted-foreground group-hover:text-foreground'
                                }`}
                            >
                                <QrCode className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-sm text-foreground">QRIS</span>
                                    <Badge variant="outline" className="border-orange-300 bg-orange-100/50 text-[10px] text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300 py-0 px-1.5 font-semibold">
                                        Instan
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                    Scan via GoPay, BCA, Mandiri, Dana, dll.
                                </p>
                            </div>
                        </div>

                        <div
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                isQris
                                    ? 'border-orange-500 bg-orange-500 text-white'
                                    : 'border-muted-foreground/30'
                            }`}
                        >
                            {isQris && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                    </div>
                </div>

                {/* Virtual Account Option */}
                <div
                    onClick={() => handleSelectMethod('va')}
                    className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                        isVa
                            ? 'border-orange-500 bg-orange-50/60 dark:border-orange-500 dark:bg-orange-950/20 shadow-sm'
                            : 'border-border/70 bg-card hover:border-orange-300 dark:hover:border-orange-700/60'
                    }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                    isVa
                                        ? 'bg-orange-500 text-white shadow-sm'
                                        : 'bg-muted text-muted-foreground group-hover:text-foreground'
                                }`}
                            >
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-sm text-foreground">Virtual Account</span>
                                    <Badge variant="outline" className="border-blue-300 bg-blue-100/50 text-[10px] text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 py-0 px-1.5 font-semibold">
                                        Transfer
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                    {isVa && currentBankObj ? currentBankObj.bank_name : 'Mandiri, BRI, BNI, BCA, BSI, dll.'}
                                </p>
                            </div>
                        </div>

                        <div
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                isVa
                                    ? 'border-orange-500 bg-orange-500 text-white'
                                    : 'border-muted-foreground/30'
                            }`}
                        >
                            {isVa && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bank Selector Section (when VA is active) */}
            {isVa && (
                <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-orange-600" />
                            <span className="text-xs font-bold text-foreground">Pilih Bank Virtual Account</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowBankList(!showBankList)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                        >
                            <span>{currentBankObj?.bank_name || selectedBank}</span>
                            {showBankList ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                    </div>

                    {showBankList && (
                        <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                            {banks.map((bank) => {
                                const isBankSelected = selectedBank.toUpperCase() === bank.bank_code.toUpperCase();
                                return (
                                    <div
                                        key={bank.bank_code}
                                        onClick={() => handleSelectBank(bank.bank_code)}
                                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                                            isBankSelected
                                                ? 'border-orange-500 bg-orange-500/10 dark:border-orange-500/80 dark:bg-orange-950/40 text-foreground font-semibold shadow-xs'
                                                : 'border-border/60 bg-card hover:border-orange-300 dark:hover:border-orange-800 text-muted-foreground'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex h-6 w-11 items-center justify-center rounded bg-muted/80 font-mono text-[11px] font-bold text-foreground">
                                                {bank.bank_code}
                                            </span>
                                            <span className="text-xs">{bank.bank_name}</span>
                                        </div>

                                        <div
                                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
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
