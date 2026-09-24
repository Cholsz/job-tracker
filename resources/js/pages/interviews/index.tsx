import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, MapPin, Pencil, Plus, Trash2, Video } from 'lucide-react';

interface JobApplication {
    id: number;
    company_name: string;
    position: string;
}

interface Interview {
    id: number;
    job_application_id: number;
    interview_date: string;
    interview_type: string;
    interviewer?: string | null;
    meeting_url?: string | null;
    location?: string | null;
    notes?: string | null;
    result: string;
}

interface Props {
    application: JobApplication;
    interviews: Interview[];
}

export default function Index({ application, interviews }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getResultLabel = (result: string) => {
        switch (result) {
            case 'scheduled':
                return 'Terjadwal';
            case 'passed':
                return 'Lolos';
            case 'failed':
                return 'Tidak Lolos';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return result;
        }
    };

    const getResultClass = (result: string) => {
        switch (result) {
            case 'scheduled':
                return 'bg-blue-50 text-blue-700';
            case 'passed':
                return 'bg-green-50 text-green-700';
            case 'failed':
                return 'bg-red-50 text-red-700';
            case 'cancelled':
                return 'bg-slate-100 text-slate-600';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <>
            <Head title={`Interview - ${application.company_name}`} />

            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link
                                href={`/applications/${application.id}`}
                                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-700"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Lamaran
                            </Link>

                            <h1 className="text-2xl font-bold text-slate-900">
                                Interview
                            </h1>

                            <p className="mt-1 text-slate-500">
                                {application.position} · {application.company_name}
                            </p>
                        </div>

                        <Link
                            href={`/applications/${application.id}/interviews/create`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Interview
                        </Link>
                    </div>

                    {/* Empty State */}
                    {interviews.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                                <CalendarDays className="h-7 w-7 text-green-600" />
                            </div>

                            <h2 className="text-lg font-semibold text-slate-900">
                                Belum ada interview
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                Tambahkan jadwal interview untuk melacak proses
                                rekrutmen pada lamaran ini.
                            </p>

                            <Link
                                href={`/applications/${application.id}/interviews/create`}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Interview
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {interviews.map((interview) => (
                                <div
                                    key={interview.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                        <div className="min-w-0 flex-1">
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <span className="rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                    {interview.interview_type}
                                                </span>

                                                <span
                                                    className={`rounded-lg px-3 py-1 text-xs font-semibold ${getResultClass(interview.result)}`}
                                                >
                                                    {getResultLabel(interview.result)}
                                                </span>
                                            </div>

                                            <h2 className="text-lg font-semibold text-slate-900">
                                                {formatDate(interview.interview_date)}
                                            </h2>

                                            <div className="mt-4 space-y-2 text-sm text-slate-600">

                                                {interview.interviewer && (
                                                    <p>
                                                        <span className="font-medium text-slate-800">
                                                            Interviewer:
                                                        </span>{' '}
                                                        {interview.interviewer}
                                                    </p>
                                                )}

                                                {interview.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-slate-400" />
                                                        <span>{interview.location}</span>
                                                    </div>
                                                )}

                                                {interview.meeting_url && (
                                                    <a
                                                        href={interview.meeting_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 font-medium text-green-600 hover:text-green-700"
                                                    >
                                                        <Video className="h-4 w-4" />
                                                        Link Meeting
                                                    </a>
                                                )}
                                            </div>

                                            {interview.notes && (
                                                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                                                    <p className="text-sm leading-6 text-slate-600">
                                                        {interview.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <Link
                                                href={`/interviews/${interview.id}/edit`}
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Apakah kamu yakin ingin menghapus interview ini?'
                                                        )
                                                    ) {
                                                        router.delete(`/interviews/${interview.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}