import { useEffect, useState } from 'react';

type Interview = {
    id: number;
    job_application_id: number;
    interview_date: string;
    interview_type: string;
    interviewer: string | null;
    location: string | null;
    meeting_url: string | null;
    result: string;
    job_application: {
        company_name: string;
        position: string;
    };
};

type FollowUp = {
    id: number;
    job_application_id: number;
    follow_up_date: string;
    type: string;
    notes: string | null;
    status: string;
    job_application: {
        company_name: string;
        position: string;
    };
};

type Props = {
    upcomingInterviews?: Interview[];
    upcomingFollowUps?: FollowUp[];
    overdueFollowUps?: FollowUp[];
};

function startOfDay(date: Date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );
}

function isSameDay(dateA: Date, dateB: Date) {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
}

function isTomorrow(date: Date) {
    const tomorrow = startOfDay(new Date());

    tomorrow.setDate(tomorrow.getDate() + 1);

    return isSameDay(date, tomorrow);
}

function isToday(date: Date) {
    return isSameDay(date, new Date());
}

function formatTime(date: Date) {
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatFollowUpType(type: string) {
    const types: Record<string, string> = {
        follow_up: 'Follow-up Lamaran',
        email: 'Email',
        phone: 'Telepon',
        whatsapp: 'WhatsApp',
        other: 'Lainnya',
    };

    return types[type] ?? type;
}

function getOverdueDays(date: string) {
    const today = startOfDay(new Date());
    const followUpDate = startOfDay(new Date(date));

    const difference =
        today.getTime() - followUpDate.getTime();

    return Math.max(
        1,
        Math.floor(
            difference / (1000 * 60 * 60 * 24),
        ),
    );
}

function getStorageKey(key: string) {
    return `career-tracker-notification-${key}`;
}

function hasBeenNotified(key: string) {
    if (typeof window === 'undefined') {
        return false;
    }

    return localStorage.getItem(
        getStorageKey(key),
    ) === 'true';
}

function markAsNotified(key: string) {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(
        getStorageKey(key),
        'true',
    );
}

function sendNotification(
    title: string,
    body: string,
    tag: string,
) {
    if (
        typeof window === 'undefined' ||
        !('Notification' in window) ||
        Notification.permission !== 'granted'
    ) {
        return;
    }

    if (hasBeenNotified(tag)) {
        return;
    }

    const notification = new Notification(
        title,
        {
            body,
            tag,
            icon: '/favicon.ico',
        },
    );

    notification.onclick = () => {
        window.focus();
        notification.close();
    };

    markAsNotified(tag);
}

export default function NotificationReminder({
    upcomingInterviews = [],
    upcomingFollowUps = [],
    overdueFollowUps = [],
}: Props) {
    const [permission, setPermission] =
        useState<NotificationPermission | 'unsupported'>(
            'default',
        );

    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !('Notification' in window)
        ) {
            setPermission('unsupported');
            return;
        }

        setPermission(Notification.permission);
    }, []);

    const requestPermission = async () => {
        if (
            typeof window === 'undefined' ||
            !('Notification' in window)
        ) {
            setPermission('unsupported');
            return;
        }

        try {
            const result =
                await Notification.requestPermission();

            setPermission(result);
        } catch (error) {
            console.error(
                'Gagal meminta izin notifikasi:',
                error,
            );
        }
    };

    useEffect(() => {
        if (
            permission !== 'granted' ||
            typeof window === 'undefined'
        ) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Interview Notifications
        |--------------------------------------------------------------------------
        */

        upcomingInterviews
            .filter(
                (interview) =>
                    interview.result === 'scheduled',
            )
            .forEach((interview) => {
                const date = new Date(
                    interview.interview_date,
                );

                const company =
                    interview.job_application.company_name;

                const position =
                    interview.job_application.position;

                if (isToday(date)) {
                    sendNotification(
                        'Interview Hari Ini',
                        `${position} — ${company} pukul ${formatTime(date)}.`,
                        `interview-today-${interview.id}-${date.toDateString()}`,
                    );
                } else if (isTomorrow(date)) {
                    sendNotification(
                        'Interview Besok',
                        `${position} — ${company} besok pukul ${formatTime(date)}.`,
                        `interview-tomorrow-${interview.id}-${date.toDateString()}`,
                    );
                }
            });

        /*
        |--------------------------------------------------------------------------
        | Upcoming Follow-up Notifications
        |--------------------------------------------------------------------------
        */

        upcomingFollowUps
            .filter(
                (followUp) =>
                    followUp.status === 'pending',
            )
            .forEach((followUp) => {
                const date = new Date(
                    followUp.follow_up_date,
                );

                const company =
                    followUp.job_application.company_name;

                const position =
                    followUp.job_application.position;

                const type =
                    formatFollowUpType(followUp.type);

                if (isToday(date)) {
                    sendNotification(
                        'Follow-up Hari Ini',
                        `${position} — ${company}. ${type} perlu dilakukan hari ini.`,
                        `follow-up-today-${followUp.id}-${followUp.follow_up_date}`,
                    );
                } else if (isTomorrow(date)) {
                    sendNotification(
                        'Follow-up Besok',
                        `${position} — ${company}. ${type} dijadwalkan besok.`,
                        `follow-up-tomorrow-${followUp.id}-${followUp.follow_up_date}`,
                    );
                }
            });

        /*
        |--------------------------------------------------------------------------
        | Overdue Follow-up Notifications
        |--------------------------------------------------------------------------
        */

        overdueFollowUps
            .filter(
                (followUp) =>
                    followUp.status === 'pending',
            )
            .forEach((followUp) => {
                const company =
                    followUp.job_application.company_name;

                const position =
                    followUp.job_application.position;

                const overdueDays =
                    getOverdueDays(
                        followUp.follow_up_date,
                    );

                sendNotification(
                    'Follow-up Terlambat',
                    `${position} — ${company} terlambat ${overdueDays} hari.`,
                    `follow-up-overdue-${followUp.id}-${followUp.follow_up_date}`,
                );
            });
    }, [
        permission,
        upcomingInterviews,
        upcomingFollowUps,
        overdueFollowUps,
    ]);

    if (permission === 'unsupported') {
        return null;
    }

    return (
        <button
            type="button"
            onClick={requestPermission}
            disabled={permission === 'granted'}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                permission === 'granted'
                    ? 'cursor-default bg-emerald-50 text-emerald-700'
                    : permission === 'denied'
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
            title={
                permission === 'granted'
                    ? 'Notifikasi sudah aktif'
                    : permission === 'denied'
                      ? 'Notifikasi diblokir oleh browser'
                      : 'Aktifkan notifikasi'
            }
        >
            <span>
                {permission === 'granted'
                    ? '🔔'
                    : permission === 'denied'
                      ? '🔕'
                      : '🔔'}
            </span>

            <span>
                {permission === 'granted'
                    ? 'Notifikasi Aktif'
                    : permission === 'denied'
                      ? 'Notifikasi Diblokir'
                      : 'Aktifkan Notifikasi'}
            </span>
        </button>
    );
}