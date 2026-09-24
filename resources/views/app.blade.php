<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Tidak menggunakan favicon/logo --}}
        <link
            rel="icon"
            href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
        >

        @fonts

        @viteReactRefresh
        @vite([
            'resources/css/app.css',
            'resources/js/app.tsx',
            "resources/js/pages/{$page['component']}.tsx"
        ])

        <x-inertia::head>
            <title>{{ config('app.name', 'Job Tracker') }}</title>
        </x-inertia::head>
    </head>

    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>