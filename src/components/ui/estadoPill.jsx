export function EstadoPill({ value, type }) {
    // type: 'apertura' | 'caja'
    const v = (value || '').toLowerCase();
    let text = v || '—';
    let cls = 'bg-gray-100 text-gray-700';
    if (type === 'apertura') {
        if (v === 'abierta') cls = 'bg-blue-500 text-white';
        if (v === 'cerrada') cls = 'bg-red-500 text-white';
    } else if (type === 'caja') {
        if (v === 'activa') cls = 'bg-green-500 text-white';
        if (v === 'inactiva') cls = 'bg-gray-300 text-gray-900';
    }
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium ${cls}`}>
            {type === 'apertura' ? 'Apertura:' : 'Caja:'} {text}
        </span>
    );
}