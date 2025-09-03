export function Card({ titulo, valor }) {
    return (
        <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600">{titulo}</h3>
            <p className="text-2xl font-bold text-gray-900">{valor}</p>
        </div>
    );
}

export function GananciaCard({ titulo, data }) {
    if (!data) return null;

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">{titulo}</h3>
            <ul className="space-y-2 text-gray-700">
                {Object.entries(data).map(([medio, valor]) => (
                    <li key={medio} className="flex justify-between">
                        <span className="capitalize">{medio}</span>
                        <span className="font-bold">${valor}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function CardResumen({ titulo, valor = 0, Icon, color }) {
    const colorClasses = {
        blue: "border-blue-500 text-blue-500",
        green: "border-green-500 text-green-500",
        purple: "border-purple-500 text-purple-500",
        orange: "border-orange-500 text-orange-500",
        red: "border-red-500 text-red-500",
        yellow: "border-yellow-500 text-yellow-500",
    };

    const selected = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`bg-white rounded-2xl shadow p-5 border-t-4 h-40 flex flex-col ${selected.split(" ")[0]}`}>
            <div className="w-full flex items-center justify-between">
                <p className="text-xl text-black font-bold">{titulo}</p>
                <Icon className={`h-6 w-6 ${selected.split(" ")[1]}`} />
            </div>

            <div className="flex-grow flex items-center justify-center">
                <p className={`text-4xl font-bold ${selected.split(" ")[1]}`}>{valor}</p>
            </div>
        </div>

    );
}
