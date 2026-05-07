import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <UserLayout>
            <Head title="Kebijakan Privasi" />

            <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Kebijakan Privasi</h1>
                            <p className="text-gray-600 dark:text-gray-400">Level Up Accounting</p>
                        </div>

                        <div className="prose prose-gray dark:prose-invert text-justify max-w-none">
                            <section className="mb-8">
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Level Up Accounting ("Kami") berkomitmen untuk menjaga kerahasiaan, keamanan, dan perlindungan data pribadi setiap pengguna dan peserta ("Anda") yang mengakses situs, platform, maupun layanan pendidikan dan pelatihan yang kami selenggarakan.
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Kebijakan Privasi ini menjelaskan bagaimana Kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda. Dengan mengakses situs, mendaftar, atau mengikuti program Level Up Accounting, Anda dianggap telah membaca, memahami, dan menyetujui Kebijakan Privasi ini. Kebijakan ini berlaku untuk seluruh layanan, program pelatihan, kelas, webinar, dan fitur yang disediakan oleh Level Up Accounting.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">A. INFORMASI YANG DIKUMPULKAN SECARA OTOMATIS</h2>
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Saat Anda mengakses atau menggunakan platform Level Up Accounting, sistem kami dapat secara otomatis mengumpulkan informasi tertentu, antara lain:
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">a. Informasi pribadi dasar</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Seperti nama, alamat email, nomor telepon, dan detail akun yang Anda berikan saat pendaftaran.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">b. Data penggunaan</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Meliputi aktivitas Anda selama mengikuti kelas atau pelatihan, materi yang diakses, kehadiran, serta interaksi dengan fitur pembelajaran.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">c. Informasi teknis</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Seperti alamat IP, jenis perangkat, sistem operasi, browser, serta data log lainnya yang digunakan untuk keamanan dan pengembangan layanan.
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-4 text-gray-700 dark:text-gray-300">
                                    Kami dapat menggunakan cookies dan teknologi serupa untuk membantu mengelola sesi pengguna, meningkatkan performa sistem, menjaga keamanan, serta mengoptimalkan pengalaman belajar.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">B. INFORMASI YANG DIBERIKAN SECARA SUKARELA</h2>
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Kami mengumpulkan data pribadi yang Anda berikan secara langsung melalui formulir pendaftaran, pengisian data peserta, atau komunikasi dengan Kami, antara lain:
                                </p>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Nama lengkap</li>
                                    <li>Alamat email</li>
                                    <li>Nomor telepon</li>
                                    <li>Data pendidikan atau pekerjaan (jika relevan dengan program pelatihan)</li>
                                    <li>Informasi lain yang diperlukan untuk keperluan administrasi dan pembelajaran</li>
                                </ul>
                                <p className="mt-4 text-gray-700 dark:text-gray-300">
                                    Informasi ini digunakan untuk keperluan pendaftaran, penyelenggaraan pelatihan, komunikasi, sertifikat, serta layanan pendukung lainnya.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">C. PENGGUNAAN INFORMASI</h2>
                                <p className="mb-3 text-gray-700 dark:text-gray-300">Data pribadi yang Kami kumpulkan digunakan untuk:</p>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Menyediakan, mengelola, dan menjalankan program pelatihan Level Up Accounting</li>
                                    <li>Mengelola administrasi peserta, kehadiran, dan sertifikat</li>
                                    <li>Meningkatkan kualitas materi, metode pembelajaran, dan layanan</li>
                                    <li>Menyampaikan informasi terkait jadwal, materi, promo, atau program baru</li>
                                    <li>Menjaga keamanan sistem dan mencegah penyalahgunaan</li>
                                    <li>Memenuhi kewajiban hukum dan peraturan perundang-undangan yang berlaku di Indonesia</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">D. HAK PENGGUNA & PENGHAPUSAN DATA</h2>
                                <p className="mb-3 text-gray-700 dark:text-gray-300">Anda memiliki hak untuk:</p>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Meminta akses atas data pribadi yang Kami simpan</li>
                                    <li>Memperbaiki data yang tidak akurat</li>
                                    <li>Mengajukan permohonan penghapusan data pribadi</li>
                                </ul>
                                <p className="mt-4 text-gray-700 dark:text-gray-300">
                                    Permintaan dapat diajukan melalui email resmi Level Up Accounting.
                                </p>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">
                                    Apabila penghapusan akun disetujui, maka akses Anda ke layanan akan dihentikan, dan data akan dihapus atau disimpan sesuai ketentuan hukum yang berlaku.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">E. COOKIES</h2>
                                <p className="mb-3 text-gray-700 dark:text-gray-300">Level Up Accounting menggunakan cookies untuk:</p>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Mengidentifikasi pengguna</li>
                                    <li>Meningkatkan kinerja dan keamanan situs</li>
                                    <li>Menyesuaikan pengalaman pengguna</li>
                                </ul>
                                <p className="mt-4 text-gray-700 dark:text-gray-300">
                                    Anda dapat mengatur atau menonaktifkan cookies melalui pengaturan browser masing-masing. Namun, penonaktifan cookies dapat memengaruhi fungsi optimal layanan.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">F. PERUBAHAN KEBIJAKAN PRIVASI</h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Kebijakan Privasi ini dapat diperbarui sewaktu-waktu untuk menyesuaikan dengan perkembangan layanan, teknologi, maupun peraturan hukum. Versi terbaru akan dipublikasikan melalui situs resmi Level Up Accounting dan berlaku sejak tanggal ditetapkan.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">G. HUBUNGI KAMI</h2>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <p className="mb-4">
                                        Apabila Anda memiliki pertanyaan, masukan, atau permintaan terkait Kebijakan Privasi ini, silakan hubungi Kami melalui:
                                    </p>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                        <p className="font-semibold">Level Up Accounting</p>
                                        <p>Permata Permadani Residence</p>
                                        <p>3HRP+R38, Pendem, Kec. Junrejo, Kota Batu, Jawa Timur</p>
                                        <p className="mt-2">Info: @levelupaccounting.id</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Dengan menggunakan layanan Level Up Accounting, Anda menyetujui kebijakan privasi di atas.
                            </p>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Baca juga{' '}
                                <Link href={route('terms-and-conditions')} className="text-blue-600 underline hover:text-blue-800">
                                    Syarat dan Ketentuan
                                </Link>{' '}
                                kami.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}