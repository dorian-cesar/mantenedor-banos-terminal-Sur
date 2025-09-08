export function Info({ label, value }) {
    return (
        <div>
            <div className="text-base font-medium text-gray-500">{label}</div>
            <div className="mt-0.5 text-gray-900 font-semibold">{value}</div>
        </div>
    );
}