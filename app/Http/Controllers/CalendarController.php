<?php

namespace App\Http\Controllers;

use App\Models\FollowUp;
use App\Models\Interview;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        /*
        |--------------------------------------------------------------------------
        | Interview Events
        |--------------------------------------------------------------------------
        */

        $interviews = Interview::whereHas(
                'jobApplication',
                function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            )
            ->with([
                'jobApplication:id,company_name,position',
            ])
            ->orderBy('interview_date')
            ->get([
                'id',
                'job_application_id',
                'interview_date',
                'interview_type',
                'interviewer',
                'location',
                'meeting_url',
                'result',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Follow-up Events
        |--------------------------------------------------------------------------
        */

        $followUps = FollowUp::whereHas(
                'jobApplication',
                function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            )
            ->with([
                'jobApplication:id,company_name,position',
            ])
            ->orderBy('follow_up_date')
            ->get([
                'id',
                'job_application_id',
                'follow_up_date',
                'type',
                'notes',
                'status',
            ]);

        return Inertia::render('calendar', [
            'interviews' => $interviews,
            'followUps' => $followUps,
        ]);
    }
}