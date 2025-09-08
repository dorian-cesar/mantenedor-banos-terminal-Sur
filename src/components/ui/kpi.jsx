export function Kpi({ icon, label, value, hint, subtle = false, tone = 'default' }) {
    const toneClasses = {
        default: 'border bg-white',
        warning: 'border bg-amber-100',
        success: 'border bg-emerald-100',
    };
    return (
        <div className={`rounded-xl px-3 py-3 ${toneClasses[tone]}`}>
            <div className="flex items-center gap-2 text-gray-600">
                {icon || null}
                <span className="text-xs">{label}</span>
            </div>
            <div className={`mt-1 text-base font-semibold ${subtle ? 'text-gray-700' : 'text-gray-900'}`}>{value}</div>
            {hint && <div className="mt-0.5 text-xs text-gray-500">{hint}</div>}
        </div>
    );
}