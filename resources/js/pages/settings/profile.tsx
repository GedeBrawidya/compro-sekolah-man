import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import { send } from '@/routes/verification';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Pengaturan Profil" />

            <div className="space-y-6">
                <div className="border-b border-[#b8ceb0] pb-4">
                    <h2 className="text-lg font-bold text-[#142921]">
                        Informasi Profil
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-[#2e5445]">
                        Perbarui nama dan alamat email akun pengguna Anda.
                    </p>
                </div>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="max-w-xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-extrabold text-[#142921]"
                                >
                                    Nama Lengkap
                                </Label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    defaultValue={auth.user.name}
                                    required
                                    autoComplete="name"
                                    placeholder="Masukkan nama lengkap"
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#b8ceb0',
                                        color: '#142921',
                                    }}
                                    className="w-full rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                />

                                <InputError
                                    className="mt-1 text-xs text-rose-600"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-extrabold text-[#142921]"
                                >
                                    Alamat Email
                                </Label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={auth.user.email}
                                    required
                                    autoComplete="username"
                                    placeholder="nama@email.com"
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#b8ceb0',
                                        color: '#142921',
                                    }}
                                    className="w-full rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                />

                                <InputError
                                    className="mt-1 text-xs text-rose-600"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                                        <p className="font-semibold">
                                            Alamat email Anda belum
                                            terverifikasi.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="font-bold text-amber-900 underline transition-colors hover:text-black"
                                            >
                                                Klik di sini untuk mengirim
                                                ulang email verifikasi.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-xs font-bold text-emerald-700">
                                                Link verifikasi baru telah
                                                dikirim ke alamat email Anda.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    style={{
                                        backgroundColor: '#265243',
                                        color: '#ffffff',
                                    }}
                                    className="rounded-xl px-6 py-2.5 text-xs font-bold shadow-xs transition-all hover:bg-[#1f4337] disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <div className="border-t border-[#b8ceb0] pt-6">
                <DeleteUser />
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Profil',
            href: edit(),
        },
    ],
};
