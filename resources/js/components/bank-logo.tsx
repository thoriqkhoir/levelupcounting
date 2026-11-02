import React, { useState } from 'react';

interface BankLogoProps {
    bankCode: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const BANK_IMAGE_MAP: Record<string, string> = {
    QRIS: '/assets/images/banks/qris.webp',
    BMRI: '/assets/images/banks/mandiri.webp',
    MANDIRI: '/assets/images/banks/mandiri.webp',
    BNIA: '/assets/images/banks/cimb.svg',
    CIMB: '/assets/images/banks/cimb.svg',
    CIMB_NIAGA: '/assets/images/banks/cimb.svg',
    BBBA: '/assets/images/banks/permata.webp',
    PERMATA: '/assets/images/banks/permata.webp',
    BNIN: '/assets/images/banks/permata.webp',
    BRIN: '/assets/images/banks/bri.png',
    BRI: '/assets/images/banks/bri.png',
    BSYI: '/assets/images/banks/bsi.webp',
    BSI: '/assets/images/banks/bsi.webp',
    BCA: '/assets/images/banks/bca.webp',
};

export default function BankLogo({ bankCode, className = '', size = 'md' }: BankLogoProps) {
    const code = (bankCode || '').toUpperCase().trim();
    const [imageError, setImageError] = useState(false);

    // Sizing maps
    const sizeClasses = {
        sm: 'h-5 w-auto max-w-[56px] object-contain',
        md: 'h-7 w-auto max-w-[76px] object-contain',
        lg: 'h-9 w-auto max-w-[100px] object-contain',
    };

    const containerClass = `inline-flex items-center justify-center shrink-0 rounded bg-white p-1 shadow-xs border border-slate-200/80 dark:border-slate-700/60 dark:bg-slate-900 ${className}`;

    // If there is an uploaded image asset and it hasn't errored, render it
    const imageSrc = BANK_IMAGE_MAP[code];
    if (imageSrc && !imageError) {
        return (
            <div className={containerClass}>
                <img
                    src={imageSrc}
                    alt={`${code} Logo`}
                    className={sizeClasses[size]}
                    loading="lazy"
                    onError={() => setImageError(true)}
                />
            </div>
        );
    }

    // 1. QRIS Fallback SVG
    if (code === 'QRIS') {
        return (
            <div className={containerClass}>
                <svg
                    viewBox="0 0 160 55"
                    className={`${sizeClasses[size]} object-contain`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="160" height="55" rx="6" fill="#FFFFFF" />
                    <path d="M12 10H32V18H20V24H30V32H20V45H12V10Z" fill="#ED1C24" />
                    <path d="M36 10H56V45H48V32H36V10ZM48 18H44V24H48V18Z" fill="#ED1C24" />
                    <text x="62" y="38" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="32" fill="#1F2937" letterSpacing="0.5">
                        QRIS
                    </text>
                </svg>
            </div>
        );
    }

    // 2. Bank BCA (BBBA / BCA) Fallback SVG
    if (code === 'BBBA' || code === 'BCA') {
        return (
            <div className={containerClass}>
                <svg
                    viewBox="0 0 120 40"
                    className={`${sizeClasses[size]} object-contain`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="120" height="40" rx="4" fill="#005BAB" />
                    <path d="M14 20L22 10L30 20L22 30L14 20Z" fill="#FFFFFF" />
                    <path d="M22 20L27 14L32 20L27 26L22 20Z" fill="#005BAB" />
                    <text x="40" y="28" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="24" fill="#FFFFFF" letterSpacing="1">
                        BCA
                    </text>
                </svg>
            </div>
        );
    }

    // 3. Bank Mandiri (BMRI / MANDIRI) Fallback SVG
    if (code === 'BMRI' || code === 'MANDIRI') {
        return (
            <div className={containerClass}>
                <svg
                    viewBox="0 0 130 40"
                    className={`${sizeClasses[size]} object-contain`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="130" height="40" rx="4" fill="#00355F" />
                    <path d="M10 26C16 16 26 12 36 18C44 23 50 18 54 13C48 24 38 28 28 22C20 18 14 22 10 26Z" fill="#F4B400" />
                    <text x="48" y="27" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="19" fill="#FFFFFF">
                        mandiri
                    </text>
                </svg>
            </div>
        );
    }

    // 4. Bank BRI (BRIN / BRI) Fallback SVG
    if (code === 'BRIN' || code === 'BRI') {
        return (
            <div className={containerClass}>
                <svg
                    viewBox="0 0 120 40"
                    className={`${sizeClasses[size]} object-contain`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="120" height="40" rx="4" fill="#00529C" />
                    <circle cx="22" cy="20" r="11" stroke="#FFFFFF" strokeWidth="3" fill="none" />
                    <circle cx="22" cy="20" r="5" fill="#FFFFFF" />
                    <text x="44" y="28" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="22" fill="#FFFFFF" letterSpacing="0.8">
                        BRI
                    </text>
                </svg>
            </div>
        );
    }

    // 5. Bank BNI (BNIA / BNI) Fallback SVG
    if (code === 'BNIA' || code === 'BNI') {
        return (
            <div className={containerClass}>
                <svg
                    viewBox="0 0 120 40"
                    className={`${sizeClasses[size]} object-contain`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="120" height="40" rx="4" fill="#005E6A" />
                    <path d="M14 12L24 28L30 18L22 12H14Z" fill="#F37021" />
                    <text x="40" y="28" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="22" fill="#FFFFFF" letterSpacing="0.5">
                        BNI
                    </text>
                </svg>
            </div>
        );
    }

    // 6. Bank Syariah Indonesia (BSYI / BSI) Fallback SVG
    if (code === 'BSYI' || code === 'BSI') {
        return (
            <div className={containerClass}>
                <svg
                    viewBox="0 0 120 40"
                    className={`${sizeClasses[size]} object-contain`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="120" height="40" rx="4" fill="#00A39D" />
                    <path d="M22 10L24 16L30 16L25 20L27 26L22 22L17 26L19 20L14 16L20 16Z" fill="#E8B122" />
                    <text x="42" y="28" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="22" fill="#FFFFFF" letterSpacing="0.5">
                        BSI
                    </text>
                </svg>
            </div>
        );
    }

    // 7. Bank Danamon (BDIN / DANAMON) Fallback SVG
    if (code === 'BDIN' || code === 'DANAMON') {
        return (
            <div className={containerClass}>
                <svg
                    viewBox="0 0 135 40"
                    className={`${sizeClasses[size]} object-contain`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="135" height="40" rx="4" fill="#002D62" />
                    <path d="M12 12H20V28H12Z" fill="#FF6600" />
                    <text x="26" y="27" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="18" fill="#FFFFFF">
                        Danamon
                    </text>
                </svg>
            </div>
        );
    }

    // 8. Bank Permata (BNIN / PERMATA) Fallback SVG
    if (code === 'BNIN' || code === 'PERMATA') {
        return (
            <div className={containerClass}>
                <svg
                    viewBox="0 0 130 40"
                    className={`${sizeClasses[size]} object-contain`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="130" height="40" rx="4" fill="#0E2338" />
                    <path d="M12 20L22 10L32 20L22 30Z" fill="#7AB800" />
                    <path d="M22 10L32 20L22 20Z" fill="#00A3E0" />
                    <text x="38" y="26" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="17" fill="#FFFFFF">
                        Permata
                    </text>
                </svg>
            </div>
        );
    }

    // Default Fallback
    return (
        <div className={containerClass}>
            <div className="flex h-6 min-w-[48px] items-center justify-center rounded bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[11px] font-black text-slate-800 dark:text-slate-200">
                {code || 'BANK'}
            </div>
        </div>
    );
}
