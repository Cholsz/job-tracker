<?php

namespace App\Console\Commands;

use App\Models\Interview;
use App\Notifications\InterviewReminder;
use Carbon\Carbon;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:send-interview-reminders')]
#[Description('Mengirim pengingat email untuk interview yang akan berlangsung besok')]
class SendInterviewReminders extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $tomorrow = Carbon::tomorrow();

        $startOfTomorrow = $tomorrow->copy()->startOfDay();
        $endOfTomorrow = $tomorrow->copy()->endOfDay();

        $interviews = Interview::with([
            'jobApplication.user',
        ])
            ->whereBetween('interview_date', [
                $startOfTomorrow,
                $endOfTomorrow,
            ])
            ->where('result', 'scheduled')
            ->whereNull('reminder_sent_at')
            ->get();

        if ($interviews->isEmpty()) {
            $this->info('Tidak ada interview yang perlu dikirim reminder.');

            return self::SUCCESS;
        }

        $sent = 0;

        foreach ($interviews as $interview) {
            /** @var Interview $interview */

            $application = $interview->jobApplication;
            $user = $application?->user;

            if (!$user) {
                $this->warn(
                    "Interview #{$interview->id} dilewati karena user tidak ditemukan."
                );

                continue;
            }

            $user->notify(
                new InterviewReminder($interview)
            );

            $interview->update([
                'reminder_sent_at' => now(),
            ]);

            $this->info(
                "Reminder dikirim ke {$user->email} - {$application->company_name}"
            );

            $sent++;
        }

        $this->info("Total email reminder dikirim: {$sent}");

        return self::SUCCESS;
    }
}