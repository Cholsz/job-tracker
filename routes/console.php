<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Job Tracker Scheduled Tasks
|--------------------------------------------------------------------------
*/

Schedule::command('app:send-interview-reminders')
    ->dailyAt('08:00');