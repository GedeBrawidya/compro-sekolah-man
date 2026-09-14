import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar Akun - Portal Admin" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="name"
                                className="text-xs font-extrabold tracking-wider text-[#142921] uppercase"
                            >
                                Nama Lengkap
                            </Label>
                            <div className="relative">
                                <svg
                                    className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#527365]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nama lengkap Anda"
                                    className="h-11 rounded-2xl border-[#c8dac5] bg-[#f8faf7] pl-10 text-sm font-semibold text-[#142921] focus:border-[#265243] focus:ring-[#265243]"
                                />
                            </div>
                            <InputError
                                message={errors.name}
                                className="mt-1"
                            />
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="email"
                                className="text-xs font-extrabold tracking-wider text-[#142921] uppercase"
                            >
                                Email Address
                            </Label>
                            <div className="relative">
                                <svg
                                    className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#527365]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@sekolah.com"
                                    className="h-11 rounded-2xl border-[#c8dac5] bg-[#f8faf7] pl-10 text-sm font-semibold text-[#142921] focus:border-[#265243] focus:ring-[#265243]"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-xs font-extrabold tracking-wider text-[#142921] uppercase"
                            >
                                Kata Sandi
                            </Label>
                            <div className="relative">
                                <svg
                                    className="absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-[#527365]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Buat kata sandi baru"
                                    passwordrules={passwordRules}
                                    className="h-11 rounded-2xl border-[#c8dac5] bg-[#f8faf7] pl-10 text-sm font-semibold text-[#142921] focus:border-[#265243] focus:ring-[#265243]"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-xs font-extrabold tracking-wider text-[#142921] uppercase"
                            >
                                Konfirmasi Kata Sandi
                            </Label>
                            <div className="relative">
                                <svg
                                    className="absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-[#527365]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi kata sandi"
                                    passwordrules={passwordRules}
                                    className="h-11 rounded-2xl border-[#c8dac5] bg-[#f8faf7] pl-10 text-sm font-semibold text-[#142921] focus:border-[#265243] focus:ring-[#265243]"
                                />
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        {/* Info box */}
                        <div className="mt-1 flex items-start gap-2.5 rounded-2xl border border-[#c8dac5] bg-[#f4f8f3] px-4 py-3">
                            <svg
                                className="mt-0.5 h-4 w-4 shrink-0 text-[#265243]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-[11px] leading-relaxed font-medium text-[#527365]">
                                Akun baru memerlukan verifikasi oleh
                                administrator sebelum dapat mengakses semua
                                fitur.
                            </p>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="mt-1 h-11 w-full rounded-2xl bg-[#265243] text-sm font-black text-white shadow-md transition-all hover:scale-[1.01] hover:bg-[#142921] hover:shadow-lg active:scale-[0.99]"
                            tabIndex={5}
                            data-test="register-user-button"
                        >
                            {processing && <Spinner />}
                            {processing ? 'Mendaftar...' : 'Buat Akun Sekarang'}
                        </Button>

                        {/* Divider */}
                        <div className="relative flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#e2ebd9]" />
                            <span className="text-[11px] font-bold text-[#527365]">
                                atau
                            </span>
                            <div className="h-px flex-1 bg-[#e2ebd9]" />
                        </div>

                        <div className="text-center text-sm font-medium text-[#527365]">
                            Sudah punya akun?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-extrabold text-[#265243] hover:text-[#142921]"
                            >
                                Masuk di sini
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Buat Akun Baru',
    description: 'Daftarkan diri Anda ke portal administrasi sekolah',
};
