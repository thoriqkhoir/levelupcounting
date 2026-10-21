import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
    const { i18n } = useTranslation();
    const isEn = i18n.language === 'en';

    return (
        <UserLayout>
            <Head title={isEn ? 'Privacy Policy' : 'Kebijakan Privasi'} />

            <div className="min-h-screen bg-background py-12 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                                {isEn ? 'Privacy Policy' : 'Kebijakan Privasi'}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">Level Up Accounting</p>
                        </div>

                        {isEn ? (
                            <div className="prose prose-gray dark:prose-invert text-justify max-w-none">
                                <section className="mb-8">
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting ("We", "Us", or "Our") is committed to protecting the privacy and maintaining the security of the personal data of every user, participant, and visitor to our platform ("You"). This Privacy Policy explains how We collect, use, store, manage, and protect the personal information You provide when using Level Up Accounting services.
                                    </p>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        By accessing the website, registering, or using the services available on the Level Up Accounting platform, You are deemed to have read, understood, and agreed to the entire contents of this Privacy Policy.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        This policy applies to all services, training programs, webinars, classes, certifications, mentoring, and other features provided by Level Up Accounting.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">A. INFORMATION COLLECTED AUTOMATICALLY</h2>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        When You access or use the Level Up Accounting platform, our system may automatically obtain and record certain information to support service operations, security, and user experience enhancement, including:
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">a. Basic User Information</h3>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                Includes name, email address, phone number, and account information You provide during the registration process or use of services.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">b. User Activity Data</h3>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                Covers activity while participating in programs or training, such as materials studied, learning progress, attendance rates, and interactions on features available on the platform.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">c. Technical Information</h3>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                Includes IP address, device type, operating system, browser used, access times, and other technical data required to maintain system security and service development.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">B. INFORMATION PROVIDED BY USERS</h2>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting collects personal data that You provide directly through registration, participant form submission, or communication with our team. Information that may be collected includes:
                                    </p>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Full name</li>
                                        <li>Email address</li>
                                        <li>Phone number</li>
                                        <li>Educational or employment information relevant to the program</li>
                                        <li>Other data required for administrative needs and learning processes</li>
                                    </ul>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                                        This information is used to support registration processes, training program execution, communication with participants, certificate issuance, and other supporting services related to learning activities.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">C. USE OF INFORMATION</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">
                                        Personal data obtained will be used for operational interests and service development of Level Up Accounting, including but not limited to:
                                    </p>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Providing and running training programs and educational services</li>
                                        <li>Managing participant administration, attendance, and certification</li>
                                        <li>Enhancing material quality, learning methods, and user experience</li>
                                        <li>Delivering information regarding class schedules, service updates, promotions, and new programs</li>
                                        <li>Maintaining platform security and preventing service misuse</li>
                                        <li>Fulfilling legal obligations in accordance with applicable laws and regulations in Indonesia</li>
                                    </ul>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting does not sell or trade users' personal data to any party.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">D. USER RIGHTS & DATA MANAGEMENT</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">As a service user, You have the right to:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Request access to stored personal data</li>
                                        <li>Update or correct inaccurate data</li>
                                        <li>Submit a request for deletion of personal data</li>
                                        <li>Withdraw consent for specific data usage in accordance with applicable provisions</li>
                                    </ul>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                                        Requests regarding personal data management can be submitted via official Level Up Accounting contacts.
                                    </p>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                                        If an account deletion request is approved, access to services will be terminated and data will be deleted or retained according to applicable legal obligations.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">E. COOKIES</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">Level Up Accounting uses cookies and similar technologies to:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Recognize user identity when accessing the platform</li>
                                        <li>Improve website performance and security</li>
                                        <li>Customize service user experience</li>
                                        <li>Assist platform analysis and development processes</li>
                                    </ul>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                                        Users can configure or disable cookies via their respective browser settings. However, doing so may affect the function and performance of certain services on the platform.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">F. DATA SECURITY</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">
                                        We apply reasonable technical and administrative measures to safeguard users' personal data against unauthorized access, use, modification, or disclosure.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Nevertheless, no digital security system is completely free from risk. Therefore, users are also responsible for keeping their accounts and personal login information confidential.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">G. PRIVACY POLICY UPDATES</h2>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Level Up Accounting reserves the right to update or modify this Privacy Policy at any time according to service needs, technological developments, or regulatory changes.
                                    </p>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                                        The latest version of the Privacy Policy will be published on the official Level Up Accounting website and becomes effective as of the date specified.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">H. CONTACT US</h2>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        If You have any questions, suggestions, or requests regarding this Privacy Policy, please contact Level Up Accounting through the official contacts available on our website.
                                    </p>
                                </section>
                            </div>
                        ) : (
                            <div className="prose prose-gray dark:prose-invert text-justify max-w-none">
                                <section className="mb-8">
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting (“Kami”) berkomitmen untuk melindungi privasi dan menjaga keamanan data pribadi setiap pengguna, peserta, maupun pengunjung platform kami (“Anda”). Kebijakan Privasi ini menjelaskan bagaimana Kami mengumpulkan, menggunakan, menyimpan, mengelola, dan melindungi informasi pribadi yang Anda berikan saat menggunakan layanan Level Up Accounting.
                                    </p>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        Dengan mengakses website, melakukan pendaftaran, atau menggunakan layanan yang tersedia pada platform Level Up Accounting, Anda dianggap telah membaca, memahami, dan menyetujui seluruh isi Kebijakan Privasi ini.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Kebijakan ini berlaku untuk seluruh layanan, program pelatihan, webinar, kelas, sertifikasi, mentoring, serta fitur lain yang disediakan oleh Level Up Accounting.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">A. INFORMASI YANG DIKUMPULKAN SECARA OTOMATIS</h2>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        Ketika Anda mengakses atau menggunakan platform Level Up Accounting, sistem kami dapat secara otomatis memperoleh dan mencatat informasi tertentu untuk mendukung operasional layanan, keamanan, serta peningkatan pengalaman pengguna, di antaranya:
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">a. Informasi Dasar Pengguna</h3>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                Meliputi nama, alamat email, nomor telepon, serta informasi akun yang Anda berikan saat proses registrasi atau penggunaan layanan.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">b. Data Aktivitas Pengguna</h3>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                Mencakup aktivitas selama mengikuti program atau pelatihan, seperti materi yang dipelajari, progres pembelajaran, tingkat kehadiran, serta interaksi pada fitur-fitur yang tersedia di platform.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">c. Informasi Teknis</h3>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                Termasuk alamat IP, jenis perangkat, sistem operasi, browser yang digunakan, waktu akses, dan data teknis lainnya yang diperlukan untuk menjaga keamanan sistem serta pengembangan layanan.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">B. INFORMASI YANG DIBERIKAN OLEH PENGGUNA</h2>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting mengumpulkan data pribadi yang Anda berikan secara langsung melalui proses pendaftaran, pengisian formulir peserta, maupun komunikasi dengan tim kami. Informasi yang dapat dikumpulkan meliputi:
                                    </p>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Nama lengkap</li>
                                        <li>Alamat email</li>
                                        <li>Nomor telepon</li>
                                        <li>Informasi pendidikan atau pekerjaan yang relevan dengan program</li>
                                        <li>Data lain yang diperlukan untuk kebutuhan administrasi dan proses pembelajaran</li>
                                    </ul>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                                        Informasi tersebut digunakan untuk mendukung proses registrasi, pelaksanaan program pelatihan, komunikasi dengan peserta, penerbitan sertifikat, serta layanan pendukung lainnya yang berkaitan dengan kegiatan pembelajaran.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">C. PENGGUNAAN INFORMASI</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">
                                        Data pribadi yang diperoleh akan digunakan untuk kepentingan operasional dan pengembangan layanan Level Up Accounting, termasuk namun tidak terbatas pada:
                                    </p>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Menyediakan dan menjalankan program pelatihan serta layanan pendidikan</li>
                                        <li>Mengelola administrasi peserta, kehadiran, dan sertifikasi</li>
                                        <li>Meningkatkan kualitas materi, metode pembelajaran, dan pengalaman pengguna</li>
                                        <li>Menyampaikan informasi terkait jadwal kelas, pembaruan layanan, promo, maupun program terbaru</li>
                                        <li>Menjaga keamanan platform dan mencegah penyalahgunaan layanan</li>
                                        <li>Memenuhi kewajiban hukum sesuai ketentuan peraturan perundang-undangan yang berlaku di Indonesia</li>
                                    </ul>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting tidak menjual maupun memperdagangkan data pribadi pengguna kepada pihak mana pun.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">D. HAK PENGGUNA & PENGELOLAAN DATA</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">Sebagai pengguna layanan, Anda memiliki hak untuk:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Meminta akses terhadap data pribadi yang tersimpan</li>
                                        <li>Memperbarui atau memperbaiki data yang tidak sesuai</li>
                                        <li>Mengajukan permohonan penghapusan data pribadi</li>
                                        <li>Menarik persetujuan atas penggunaan data tertentu sesuai ketentuan yang berlaku</li>
                                    </ul>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                                        Permohonan terkait pengelolaan data pribadi dapat disampaikan melalui kontak resmi Level Up Accounting.
                                    </p>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                                        Apabila permintaan penghapusan akun disetujui, akses terhadap layanan akan dihentikan dan data akan dihapus atau disimpan sesuai kewajiban hukum yang berlaku.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">E. COOKIES</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">Level Up Accounting menggunakan cookies dan teknologi serupa untuk:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Mengenali identitas pengguna saat mengakses platform</li>
                                        <li>Meningkatkan performa dan keamanan website</li>
                                        <li>Menyesuaikan pengalaman penggunaan layanan</li>
                                        <li>Membantu proses analisis dan pengembangan platform</li>
                                    </ul>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                                        Pengguna dapat mengatur atau menonaktifkan cookies melalui pengaturan browser masing-masing. Namun, hal tersebut dapat memengaruhi fungsi dan performa layanan tertentu pada platform.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">F. KEAMANAN DATA</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">
                                        Kami menerapkan langkah-langkah teknis dan administratif yang wajar untuk menjaga keamanan data pribadi pengguna dari akses, penggunaan, perubahan, maupun pengungkapan tanpa izin.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Meskipun demikian, tidak ada sistem keamanan digital yang sepenuhnya bebas dari risiko. Oleh karena itu, pengguna juga bertanggung jawab untuk menjaga kerahasiaan akun dan informasi login pribadi masing-masing.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">G. PERUBAHAN KEBIJAKAN PRIVASI</h2>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Level Up Accounting berhak untuk memperbarui atau mengubah Kebijakan Privasi ini sewaktu-waktu sesuai kebutuhan layanan, perkembangan teknologi, maupun perubahan peraturan yang berlaku.
                                    </p>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                                        Versi terbaru Kebijakan Privasi akan dipublikasikan melalui website resmi Level Up Accounting dan mulai berlaku sejak tanggal ditetapkan.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">H. HUBUNGI KAMI</h2>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Apabila Anda memiliki pertanyaan, saran, atau permintaan terkait Kebijakan Privasi ini, silakan menghubungi Level Up Accounting melalui kontak resmi yang tersedia pada website kami.
                                    </p>
                                </section>
                            </div>
                        )}

                        <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isEn ? 'By using Level Up Accounting services, you agree to the privacy policy above.' : 'Dengan menggunakan layanan Level Up Accounting, Anda menyetujui kebijakan privasi di atas.'}
                            </p>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {isEn ? 'Also read our ' : 'Baca juga '}
                                <Link href={route('terms-and-conditions')} className="text-blue-600 underline hover:text-blue-800">
                                    {isEn ? 'Terms and Conditions' : 'Syarat dan Ketentuan'}
                                </Link>
                                {isEn ? '.' : ' kami.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}