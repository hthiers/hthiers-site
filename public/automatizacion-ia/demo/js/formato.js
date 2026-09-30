// Formatos chilenos para montos y fechas.
// Compartido entre el navegador y el Worker (Fase 2): sin DOM ni APIs del Worker.
// Se formatea a mano, sin Intl, para que el resultado sea idéntico en cualquier entorno.

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function miles(n) {
    return String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 119000 → "$119.000"; null → "—" */
export function clp(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return '—';
    return (n < 0 ? '−$' : '$') + miles(n);
}

/** "2026-09-16" → "16-09-2026"; null → "—" */
export function fechaCorta(iso) {
    if (!iso) return '—';
    const [a, m, d] = iso.split('-');
    return `${d}-${m}-${a}`;
}

/** "2026-09-16" → "16 de septiembre de 2026" (como la imprime una factura electrónica) */
export function fechaLarga(iso) {
    if (!iso) return '—';
    const [a, m, d] = iso.split('-').map(Number);
    return `${d} de ${MESES[m - 1]} de ${a}`;
}
