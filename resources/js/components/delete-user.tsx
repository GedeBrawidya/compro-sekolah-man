import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-4 max-w-xl">
            <div>
                <h3 className="text-base font-bold text-rose-700">Hapus Akun</h3>
                <p className="text-xs font-semibold text-[#2e5445] mt-0.5">Hapus akun pengguna Anda beserta seluruh data yang terkait secara permanen.</p>
            </div>
            <div className="space-y-4 rounded-xl border border-rose-200 bg-rose-50/50 p-4">
                <div className="text-xs text-rose-700 space-y-0.5">
                    <p className="font-bold">Peringatan</p>
                    <p className="font-medium">
                        Harap berhati-hati, tindakan ini tidak dapat dibatalkan setelah dikonfirmasi.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            data-test="delete-user-button"
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                            Hapus Akun Saya
                        </button>
                    </DialogTrigger>
                    <DialogContent style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0' }} className="rounded-2xl border p-6">
                        <DialogTitle className="text-base font-extrabold text-[#142921]">
                            Apakah Anda yakin ingin menghapus akun ini?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#2e5445]">
                            Setelah akun Anda dihapus, semua sumber daya dan data terkait akan dihapus secara permanen. Masukkan kata sandi Anda untuk mengonfirmasi.
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-4 mt-2"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="text-xs font-extrabold text-[#142921]"
                                        >
                                            Kata Sandi Konfirmasi
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Masukkan kata sandi Anda"
                                            autoComplete="current-password"
                                            style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                            className="w-full px-4 py-2.5 text-xs rounded-xl border font-semibold placeholder:text-[#527365]"
                                        />

                                        <InputError message={errors.password} className="text-xs text-rose-600" />
                                    </div>

                                    <DialogFooter className="gap-2 pt-2">
                                        <DialogClose asChild>
                                            <button
                                                type="button"
                                                onClick={() => resetAndClearErrors()}
                                                style={{ backgroundColor: '#eef4eb', color: '#142921', borderColor: '#b8ceb0' }}
                                                className="px-4 py-2 rounded-xl border text-xs font-bold hover:bg-[#dce8d7] transition-all"
                                            >
                                                Batal
                                            </button>
                                        </DialogClose>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            data-test="confirm-delete-user-button"
                                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                                        >
                                            {processing ? 'Menghapus...' : 'Konfirmasi Hapus Akun'}
                                        </button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
