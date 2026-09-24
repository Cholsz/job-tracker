import { Head, Link, router } from '@inertiajs/react';

type JobApplication = {
    id: number;
    company_name: string;
    position: string;
};

type FollowUp = {
    id: number;
    job_application_id: number;
    follow_up_date: string;
    type: string;
    notes: string | null;
    status: string;
};

type Props = {
    application: JobApplication;
    followUps: FollowUp[];
};

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function formatType(type: string) {
    const types: Record<string, string> = {
        follow_up: 'Follow-up Lamaran',
        email: 'Email',
        phone: 'Telepon',
        whatsapp: 'WhatsApp',
        other: 'Lainnya',
    };

    return types[type] ?? type;
}

function formatStatus(status: string) {
    const statuses: Record<string, string> = {
        pending: 'Belum Dilakukan',
        completed: 'Sudah Dilakukan',
        cancelled: 'Dibatalkan',
    };

    return statuses[status] ?? status;
}

function getStatusClass(status: string) {
    const classes: Record<string, string> = {
        pending: 'bg-amber-50 text-amber-700 ring-amber-200',
        completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        cancelled: 'bg-red-50 text-red-700 ring-red-200',
    };

    return (
        classes[status] ??
        'bg-slate-50 text-slate-700 ring-slate-200'
    );
}

export default function Index({ application, followUps }: Props) {
    function handleDelete(id: number) {
        if (
            confirm(
                'Apakah kamu yakin ingin menghapus follow-up ini?',
            )
        ) {
            router.delete(`/follow-ups/${id}`);
        }
    }

    return (
        <>
            <Head title={`Follow-up - ${application.company_name}`} />

            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <Link
                                href="/applications"
                                className="text-sm font-medium text-slate-500 transition hover:text-emerald-600"
                            >
                                ← Kembali ke Lamaran
                            </Link>

                            <h1 className="mt-1 text-xl font-bold text-slate-900">
                                Follow-up Lamaran
                            </h1>
                        </div>

                        <Link
                            href={`/applications/${application.id}/follow-ups/create`}
                            className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                        >
                            + Tambah Follow-up
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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

                    {/* Follow-ups */}
                    {followUps.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
                                📅
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                Belum ada follow-up
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                Tambahkan jadwal follow-up agar kamu bisa
                                mengingat kapan harus menghubungi perusahaan.
                            </p>

                            <Link
                                href={`/applications/${application.id}/follow-ups/create`}
                                className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                + Tambah Follow-up
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {followUps.map((followUp) => (
                                <div
                                    key={followUp.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold text-slate-900">
                                                    {formatType(
                                                        followUp.type,
                                                    )}
                                                </h3>

                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusClass(
                                                        followUp.status,
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        followUp.status,
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-medium text-emerald-600">
                                                {formatDate(
                                                    followUp.follow_up_date,
                                                )}
                                            </p>

                                            {followUp.notes && (
                                                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                                    {followUp.notes}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <Link
                                                href={`/follow-ups/${followUp.id}/edit`}
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        followUp.id,
                                                    )
                                                }
                                                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}