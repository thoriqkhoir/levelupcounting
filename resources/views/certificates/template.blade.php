<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sertifikat {{ $data['participant_name'] }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4 landscape;
            margin: 0;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            width: 297mm;
            height: 210mm;
            position: relative;
            overflow: hidden;
            background-image: url("{{ public_path('storage/' . $certificate->design->image_1) }}");
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        .certificate-container {
            width: 100%;
            position: relative;
            padding-top: 40mm;
            margin-left: 48mm;
        }

        .certificate-content {
            width: 100%;
            max-width: 260mm;
            padding: 20px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* .header {
            margin-bottom: 15px;
        } */

        /* .header-top {
            font-size: 38px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 500;
        }

        .header-bottom {
            font-size: 38px;
            color: #6b7280;
            margin-bottom: 14px;
        } */

        .certificate-title {
            font-size: 130px;
            font-weight: bold;
            color: #1B805B;
            text-transform: uppercase;
        }

        .certificate-subtitle {
            font-size: 72px;
            color: #1B805B;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 2px 0;
        }

        .content-text {
            font-size: 46px;
            font-style: italic;

        }
        .content-text2 {
            font-size: 46px;
            color: #000000;
            margin: 90px 0 90p 0;
            font-style: italic;
        }

        .participant-name {
            font-size: 90px;
            font-weight: bold;
            color: #1B805B;
            margin: 30 0 10 0 ;
            display: inline-block;
            min-width: 250px;
        }

        .program-name {
            color: #1B805B;
            font-style: italic;
            display: block;
            margin-top: 24px;
            font-size: 38px;
        }

        .program-description {
            font-size: 46px;
            
        }

        .description {
            font-size: 38px;
            max-width: 1200px;
        }

        .period {
            font-size: 38px;
            color: #9ca3af;
            margin-top: 24px;
            font-style: italic;
            font-weight: 900;
        }

        .footer {
            position: relative;
            margin-top: 150px;
            height: 120px;
            clear: both;
        }

        .signature-container {
            float: left;
            width: 50%;
            text-align: left;
        }

        .period-section {
            float: right;
            width: 50%;
            text-align: right;
            margin-top: 150px;
            margin-right: 600px;
        }

        .qr-container {
            margin-bottom: 16px;
            position: relative;
            text-align: right;
        }

        .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 0 16px auto;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 4px;
            background: white;
            display: block;
        }

        .qr-placeholder {
            width: 120px;
            height: 120px;
            margin: 0 auto 16px auto;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            background: #f9fafb;
            font-size: 10px;
            display: block;
        }

        .certificate-url {
            font-size: 32px;
            color: #6b7280;
            font-weight: 600;
        }

        .certificate-period {
            font-size: 32px;
            margin-bottom: 2px;
        }

        .signature-space {
            width: 150px;
            height: 250px;
            margin-bottom: 8px;
            position: relative;
        }

        .signature-image {
            max-width: 500px;
            max-height: 500px;
            object-fit: contain;
        }

        .signature-name {
            font-size: 46px;
            font-weight: bold;
            margin-bottom: 2px;
            text-decoration: underline;
        }

        .signature-title,
        .signature-date {
            font-size: 38px;
        }

        /* Clearfix untuk footer */
        .footer::after {
            content: "";
            display: table;
            clear: both;
        }

        /* Print optimization */
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>

<body>
    <div class="certificate-container">
        <div class="certificate-content">
            {{-- Header --}}
            <div class="header">
                {{-- @if ($certificate->header_top)
                    <div class="header-top">{{ $certificate->header_top }}</div>
                @endif

                @if ($certificate->header_bottom)
                    <div class="header-bottom">{{ $certificate->header_bottom }}</div>
                @endif --}}

                <div class="certificate-title">Sertifikat</div>
                {{-- <div class="certificate-subtitle">
                    @if ($certificate->webinar_id)
                        Partisipasi
                    @else
                        Kompetensi Kelulusan
                    @endif
                </div> --}}
            </div>

            {{-- Content --}}
            <div class="content">
    <div class="content-text">
        No. {{ sprintf('%04d', $data['certificate_number']) }}/{{ $certificate->certificate_number }}
    </div>
    
    <div class="content-text2">
        Sertifikat ini diberikan kepada :
    </div>
    
    <div class="participant-name">
        {{ $data['participant_name'] }}
    </div>

    <div class="program-description">
        @if ($certificate->webinar_id)
            Telah aktif berpartisipasi dan menyelesaikan
        @elseif ($certificate->bootcamp_id)
            Sebagai peserta yang mengikuti pelatihan dan lulus 
        @else
            Telah menyelesaikan kelas online
        @endif
    </div>
    <div class="program-description" >
    @if ($certificate->webinar_id && $certificate->webinar)
        {{ $certificate->description }}<br> pada {{ \Carbon\Carbon::parse($certificate->webinar->start_time)->locale('id')->translatedFormat('d F Y') }}.
    @elseif ($certificate->bootcamp_id && $certificate->bootcamp)
        {{ $certificate->description }}<br> pada {{ \Carbon\Carbon::parse($certificate->bootcamp->start_date)->locale('id')->translatedFormat('d F Y') }}{{ $certificate->bootcamp->end_date ? ' - ' . \Carbon\Carbon::parse($certificate->bootcamp->end_date)->locale('id')->translatedFormat('d F Y') : '' }}.
    @elseif ($certificate->issued_date)
    {{ $certificate->description }} <br> pada {{ \Carbon\Carbon::parse($data['participant_issued_at'])->locale('id')->translatedFormat('d F Y') }}.
        
    @else
       {{ $certificate->description }} pada {{ \Carbon\Carbon::parse($certificate->issued_date)->locale('id')->translatedFormat('d F Y') }}. 
    @endif
</div>
</div>
            {{-- Footer --}}
            <div class="footer">
                <div class="signature-container">
                    <div class="signature-date" style="font-weight:500">
                        Batu, {{ \Carbon\Carbon::parse($certificate->issued_date)->locale('id')->translatedFormat('d F Y') }}
                    </div>
                    <div class="signature-space">
                        @if ($certificate->sign && $certificate->sign->image)
                            <img src="{{ public_path('storage/' . $certificate->sign->image) }}" alt="Tanda Tangan" 
                                class="signature-image">
                        @else
                            <div style="color: #9ca3af; font-style: italic; font-size: 10px;">Tanda Tangan</div>
                        @endif
                    </div>

                    @if ($certificate->sign)
                        <div class="signature-name">{{ $certificate->sign->name }}</div>
                        <div class="signature-title">
                            {{ $certificate->sign->position ?? 'Direktur Sekolah Pajak' }}
                        </div>
                    @else
                        <div class="signature-name">Direktur</div>
                        <div class="signature-title">Sekolah Pajak</div>
                    @endif
                </div>

                <div class="period-section">
                    {{-- QR Code Section --}}
                    <div class="qr-container">
                        @if ($qrCode)
                            <div class="qr-code">
                                @if (str_contains($qrCode, 'image/png'))
                                    <img src="{{ $qrCode }}" alt="QR Code"
                                        style="width: 100%; height: 100%; object-fit: contain;">
                                @else
                                    {!! $qrCode !!}
                                @endif
                            </div>
                        @else
                            <div class="qr-placeholder">
                                QR Code<br>Not Available
                            </div>
                        @endif

                        @if ($certificateUrl)
                            <div class="certificate-url">{{ $certificateUrl }}</div>
                        @else
                            <div class="certificate-url">
                                https://sekolahpajak.id/certificate/{{ $data['certificate_code'] }}
                            </div>
                        @endif
                    </div>

                    <div class="certificate-period">{{ $certificate->period }}</div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
