<?php

namespace App\Notifications;

use App\Models\Interview;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InterviewReminder extends Notification
{
    use Queueable;

    public function __construct(
        public Interview $interview
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $application = $this->interview->jobApplication;

        return (new MailMessage)
            ->subject('Pengingat Interview - ' . $application->company_name)
            ->markdown('emails.interview-reminder', [
                'user' => $notifiable,
                'application' => $application,
                'interview' => $this->interview,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'interview_reminder',
            'interview_id' => $this->interview->id,
            'job_application_id' => $this->interview->job_application_id,
        ];
    }
}