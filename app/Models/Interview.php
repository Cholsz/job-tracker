<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interview extends Model
{
    protected $fillable = [
        'job_application_id',
        'interview_date',
        'interview_type',
        'interviewer',
        'meeting_url',
        'location',
        'notes',
        'result',
        'reminder_sent_at',
    ];

    protected $casts = [
        'interview_date' => 'datetime',
    ];

    public function jobApplication(): BelongsTo
    {
        return $this->belongsTo(JobApplication::class);
    }
}