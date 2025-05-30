const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './screens/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                main: 'var(--main)',
                warn: 'var(--warn)',
                success: 'var(--success)',
                error: 'var(--error)',
                accent: 'var(--accent)',
                info: 'var(--info)',
                overlay: 'var(--overlay)',
                bg: 'var(--bg)',
                bw: 'var(--bw)',
                blank: 'var(--blank)',
                text: 'var(--text)',
                mtext: 'var(--mtext)',
                border: 'var(--border)',
                ring: 'var(--ring)',
                ringOffset: 'var(--ring-offset)',

                secondaryBlack: '#212121',
            },
            borderRadius: {
                base: '5px',
            },
            boxShadow: {
                shadow: 'var(--shadow)',
            },
            translate: {
                boxShadowX: '2px',
                boxShadowY: '2px',
                reverseBoxShadowX: '-2px',
                reverseBoxShadowY: '-2px',
            },
            fontFamily: {
                serif: ['RedHatText', 'serif'],
                mono: ['SpaceMono', 'monospace'],
            },
            fontWeight: {
                base: '500',
                heading: '700',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
