import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import type { FormEvent } from 'react';

interface JobApplication {
    id: number;
    company_name: string;
    position: string;
}

interface Props {
    application: JobApplication;
}

export default function Create({ application }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        interview_date: '',
        interview_type: 'HR Interview',
        interviewer: '',
        meeting_url: '',
        location: '',
        notes: '',
        result: 'scheduled',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(`/applications/${application.id}/interviews`);
    };

    return (
        <>
            <Head title="Tambah Interview" />

            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={`/applications/${application.id}/interviews`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Interview
                        </Link>

                        <div className="mt-5 flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                <CalendarDays className="h-6 w-6 text-green-600" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Tambah Interview
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    {application.position} · {application.company_name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={submit}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                        <div className="space-y-6">

                            {/* Tanggal Interview */}
                            <div>
                                <label
                                    htmlFor="interview_date"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Tanggal & Waktu Interview
                                </label>

                                <input
                                    id="interview_date"
                                    type="datetime-local"
                                    value={data.interview_date}
                                    onChange={(e) =>
                                        setData('interview_date', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    required
                                />

                                {errors.interview_date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.interview_date}
                                    </p>
                                )}
                            </div>

                            {/* Jenis Interview */}
                            <div>
                                <label
                                    htmlFor="interview_type"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Jenis Interview
                                </label>

                                <select
                                    id="interview_type"
                                    value={data.interview_type}
                                    onChange={(e) =>
                                        setData('interview_type', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                >
                                    <option value="HR Interview">
                                        HR Interview
                                    </option>
                                    <option value="User Interview">
                                        User Interview
                                    </option>
                                    <option value="Technical Interview">
                                        Technical Interview
                                    </option>
                                    <option value="Final Interview">
                                        Final Interview
                                    </option>
                                    <option value="Other">
                                        Lainnya
                                    </option>
                                </select>

                                {errors.interview_type && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.interview_type}
                                    </p>
                                )}
                            </div>

                            {/* Interviewer */}
                            <div>
                                <label
                                    htmlFor="interviewer"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Interviewer
                                </label>

                                <input
                                    id="interviewer"
                                    type="text"
                                    value={data.interviewer}
                                    onChange={(e) =>
                                        setData('interviewer', e.target.value)
                                    }
                                    placeholder="Contoh: Budi - HRD"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                />

                                {errors.interviewer && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.interviewer}
                                    </p>
                                )}
                            </div>

                            {/* Lokasi */}
                            <div>
                                <label
                                    htmlFor="location"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Lokasi
                                </label>

                                <input
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                    placeholder="Contoh: Kantor PT Telkom Jakarta"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                />

                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                            {/* Meeting URL */}
                            <div>
                                <label
                                    htmlFor="meeting_url"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Link Meeting
                                </label>

                                <input
                                    id="meeting_url"
                                    type="url"
                                    value={data.meeting_url}
                                    onChange={(e) =>
                                        setData('meeting_url', e.target.value)
                                    }
                                    placeholder="https://meet.google.com/..."
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                />

                                {errors.meeting_url && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.meeting_url}
                                    </p>
                                )}
                            </div>

                            {/* Hasil */}
                            <div>
                                <label
                                    htmlFor="result"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Status Interview
                                </label>

                                <select
                                    id="result"
                                    value={data.result}
                                    onChange={(e) =>
                                        setData('result', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                >
                                    <option value="scheduled">
                                        Terjadwal
                                    </option>
                                    <option value="passed">
                                        Lolos
                                    </option>
                                    <option value="failed">
                                        Tidak Lolos
                                    </option>
                                    <option value="cancelled">
                                        Dibatalkan
                                    </option>
                                </select>

                                {errors.result && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.result}
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
                                    placeholder="Catatan mengenai interview..."
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                />

                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={`/applications/${application.id}/interviews`}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Interview'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}