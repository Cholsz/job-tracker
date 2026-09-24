<x-mail::message>
# Pengingat Interview

Halo {{ $user->name }},

Kamu memiliki **jadwal interview yang akan datang**.

<div style="margin: 24px 0; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">

**Perusahaan**  
{{ $application->company_name }}

**Posisi**  
{{ $application->position }}

**Tanggal**  
{{ $interview->interview_date->translatedFormat('d F Y') }}

**Waktu**  
{{ $interview->interview_date->format('H:i') }} WITA

**Jenis Interview**  
{{ ucfirst($interview->interview_type) }}

@if ($interview->interviewer)
**Interviewer**  
{{ $interview->interviewer }}
@endif

@if ($interview->location)
**Lokasi**  
{{ $interview->location }}
@endif

</div>

@if ($interview->meeting_url)
<x-mail::button :url="$interview->meeting_url">
Buka Link Interview
</x-mail::button>
@endif

<x-mail::button :url="url('/applications/' . $application->id)">
Lihat Lamaran
</x-mail::button>

Semoga interview kamu berjalan lancar.

Salam,  
**Job Tracker**

</x-mail::message>
