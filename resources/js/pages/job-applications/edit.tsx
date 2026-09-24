import { Form, Head, Link } from '@inertiajs/react';

type JobApplication = {
    id: number;
    company_name: string;
    position: string;
    location: string | null;
    employment_type: string | null;
    source: string | null;
    job_url: string | null;
    applied_at: string | null;
    status: string;
    notes: string | null;
};

type Props = {
    application: JobApplication;
};

export default function Edit({ application }: Props) {
    return (
        <>
            <Head title="Edit Lamaran" />

            <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-800 md:px-8">
                <div className="mx-auto max-w-4xl">

                    {/* HEADER */}
                    <div className="mb-8">
                        <Link
                            href="/applications"
                            className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-green-700"
                        >
                            ← Kembali ke Applications
                        </Link>

                        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                            Career Tracker
                        </p>

                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                            Edit Lamaran
                        </h1>

                        <p className="mt-3 text-slate-500">
                            Perbarui informasi lamaran pekerjaan kamu.
                        </p>
                    </div>

                    {/* FORM CARD */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        <Form
                            action={`/applications/${application.id}`}
                            method="put"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* COMPANY */}
                                    <div>
                                        <label
                                            htmlFor="company_name"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Nama Perusahaan
                                        </label>

                                        <input
                                            id="company_name"
                                            name="company_name"
                                            defaultValue={
                                                application.company_name
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        />

                                        {errors.company_name && (
                                            <p className="mt-1.5 text-sm text-red-600">
                                                {errors.company_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* POSITION */}
                                    <div>
                                        <label
                                            htmlFor="position"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Posisi
                                        </label>

                                        <input
                                            id="position"
                                            name="position"
                                            defaultValue={application.position}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        />

                                        {errors.position && (
                                            <p className="mt-1.5 text-sm text-red-600">
                                                {errors.position}
                                            </p>
                                        )}
                                    </div>

                                    {/* LOCATION + EMPLOYMENT */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="location"
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                Lokasi
                                            </label>

                                            <input
                                                id="location"
                                                name="location"
                                                defaultValue={
                                                    application.location ?? ''
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="employment_type"
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                Tipe Pekerjaan
                                            </label>

                                            <select
                                                id="employment_type"
                                                name="employment_type"
                                                defaultValue={
                                                    application.employment_type ??
                                                    ''
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            >
                                                <option value="">
                                                    Pilih tipe pekerjaan
                                                </option>

                                                <option value="full-time">
                                                    Full-time
                                                </option>

                                                <option value="part-time">
                                                    Part-time
                                                </option>

                                                <option value="internship">
                                                    Internship
                                                </option>

                                                <option value="contract">
                                                    Contract
                                                </option>

                                                <option value="freelance">
                                                    Freelance
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* SOURCE + DATE */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="source"
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                Sumber Lamaran
                                            </label>

                                            <input
                                                id="source"
                                                name="source"
                                                defaultValue={
                                                    application.source ?? ''
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="applied_at"
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                Tanggal Melamar
                                            </label>

                                            <input
                                                id="applied_at"
                                                type="date"
                                                name="applied_at"
                                                defaultValue={
                                                    application.applied_at ?? ''
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            />
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Status Lamaran
                                        </label>

                                        <select
                                            id="status"
                                            name="status"
                                            defaultValue={application.status}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        >
                                            <option value="applied">
                                                Applied
                                            </option>

                                            <option value="screening">
                                                Screening
                                            </option>

                                            <option value="interview">
                                                Interview
                                            </option>

                                            <option value="offer">
                                                Offer
                                            </option>

                                            <option value="rejected">
                                                Rejected
                                            </option>
                                        </select>
                                    </div>

                                    {/* JOB URL */}
                                    <div>
                                        <label
                                            htmlFor="job_url"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Link Lowongan
                                        </label>

                                        <input
                                            id="job_url"
                                            name="job_url"
                                            type="url"
                                            defaultValue={
                                                application.job_url ?? ''
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            placeholder="https://..."
                                        />

                                        {errors.job_url && (
                                            <p className="mt-1.5 text-sm text-red-600">
                                                {errors.job_url}
                                            </p>
                                        )}
                                    </div>

                                    {/* NOTES */}
                                    <div>
                                        <label
                                            htmlFor="notes"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Catatan
                                        </label>

                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows={5}
                                            defaultValue={
                                                application.notes ?? ''
                                            }
                                            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            placeholder="Catatan tentang lamaran ini..."
                                        />
                                    </div>

                                    {/* ACTION */}
                                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                                        <Link
                                            href="/applications"
                                            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Batal
                                        </Link>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                </div>
            </div>
        </>
    );
}