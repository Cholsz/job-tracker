import { Head, Link, useForm } from '@inertiajs/react';

type JobApplication = {
    id: number;
    company_name: string;
    position: string;
};

type Props = {
    application: JobApplication;
};

export default function Create({ application }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        follow_up_date: '',
        type: 'follow_up',
        notes: '',
        status: 'pending',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(`/applications/${application.id}/follow-ups`);
    }

    return (
        <>
            <Head title={`Tambah Follow-up - ${application.company_name}`} />

            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
                        <Link
                            href={`/applications/${application.id}/follow-ups`}
                            className="text-sm font-medium text-slate-500 transition hover:text-emerald-600"
                        >
                            ← Kembali ke Follow-up
                        </Link>

                        <h1 className="mt-1 text-xl font-bold text-slate-900">
                            Tambah Follow-up
                        </h1>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Application Info */}
                    <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-emerald-600">
                            Lamaran
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            {application.position}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {application.company_name}
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={submit}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="space-y-5">
                            {/* Tanggal */}
                            <div>
                                <label
                                    htmlFor="follow_up_date"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Tanggal Follow-up
                                </label>

                                <input
                                    id="follow_up_date"
                                    type="date"
                                    value={data.follow_up_date}
                                    onChange={(e) =>
                                        setData(
                                            'follow_up_date',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />

                                {errors.follow_up_date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.follow_up_date}
                                    </p>
                                )}
                            </div>

                            {/* Jenis */}
                            <div>
                                <label
                                    htmlFor="type"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Jenis Follow-up
                                </label>

                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                >
                                    <option value="follow_up">
                                        Follow-up Lamaran
                                    </option>
                                    <option value="email">Email</option>
                                    <option value="phone">Telepon</option>
                                    <option value="whatsapp">
                                        WhatsApp
                                    </option>
                                    <option value="other">Lainnya</option>
                                </select>

                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.type}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Status
                                </label>

                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                >
                                    <option value="pending">
                                        Belum Dilakukan
                                    </option>
                                    <option value="completed">
                                        Sudah Dilakukan
                                    </option>
                                    <option value="cancelled">
                                        Dibatalkan
                                    </option>
                                </select>

                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            {/* Catatan */}
                            <div>
                                <label
                                    htmlFor="notes"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Catatan
                                </label>

                                <textarea
                                    id="notes"
                                    rows={5}
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    placeholder="Contoh: Follow-up melalui email untuk menanyakan perkembangan proses rekrutmen."
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />

                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href={`/applications/${application.id}/follow-ups`}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Follow-up'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}