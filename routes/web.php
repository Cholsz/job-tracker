<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FollowUpController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\JobApplicationController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');


    /*
    |--------------------------------------------------------------------------
    | Analytics
    |--------------------------------------------------------------------------
    */

    Route::get('/analytics', [AnalyticsController::class, 'index'])
        ->name('analytics');

    /*
    |--------------------------------------------------------------------------
    | Calendar
    |--------------------------------------------------------------------------
    */

    Route::get('/calendar', [CalendarController::class, 'index'])
        ->name('calendar');

    /*
    |--------------------------------------------------------------------------
    | Job Applications
    |--------------------------------------------------------------------------
    */

    Route::get('/applications', [JobApplicationController::class, 'index'])
        ->name('applications.index');

    Route::get('/applications/create', [JobApplicationController::class, 'create'])
        ->name('applications.create');

    Route::post('/applications', [JobApplicationController::class, 'store'])
        ->name('applications.store');

    Route::get('/applications/{application}', [JobApplicationController::class, 'show'])
        ->name('applications.show');

    Route::get('/applications/{application}/edit', [JobApplicationController::class, 'edit'])
        ->name('applications.edit');

    Route::put('/applications/{application}', [JobApplicationController::class, 'update'])
        ->name('applications.update');

    Route::delete('/applications/{application}', [JobApplicationController::class, 'destroy'])
        ->name('applications.destroy');

    /*
    |--------------------------------------------------------------------------
    | Interviews
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/applications/{application}/interviews',
        [InterviewController::class, 'index']
    )->name('applications.interviews.index');

    Route::get(
        '/applications/{application}/interviews/create',
        [InterviewController::class, 'create']
    )->name('applications.interviews.create');

    Route::post(
        '/applications/{application}/interviews',
        [InterviewController::class, 'store']
    )->name('applications.interviews.store');

    Route::get(
        '/interviews/{interview}/edit',
        [InterviewController::class, 'edit']
    )->name('interviews.edit');

    Route::put(
        '/interviews/{interview}',
        [InterviewController::class, 'update']
    )->name('interviews.update');

    Route::delete(
        '/interviews/{interview}',
        [InterviewController::class, 'destroy']
    )->name('interviews.destroy');

    /*
    |--------------------------------------------------------------------------
    | Follow-ups
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/applications/{application}/follow-ups',
        [FollowUpController::class, 'index']
    )->name('applications.follow-ups.index');

    Route::get(
        '/applications/{application}/follow-ups/create',
        [FollowUpController::class, 'create']
    )->name('applications.follow-ups.create');

    Route::post(
        '/applications/{application}/follow-ups',
        [FollowUpController::class, 'store']
    )->name('applications.follow-ups.store');

    Route::get(
        '/follow-ups/{followUp}/edit',
        [FollowUpController::class, 'edit']
    )->name('follow-ups.edit');

    Route::put(
        '/follow-ups/{followUp}',
        [FollowUpController::class, 'update']
    )->name('follow-ups.update');

    Route::delete(
        '/follow-ups/{followUp}',
        [FollowUpController::class, 'destroy']
    )->name('follow-ups.destroy');
});