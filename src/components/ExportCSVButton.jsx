// ExportCSVButton.jsx
import { saveAs } from 'file-saver';
import { json2csv } from 'json-2-csv';

export default function ExportCSVButton({ filename, filters, service }) {
    const handleExport = async () => {
        try {
            const res = await service.list({ ...filters, page: 1, pageSize: 10000 });
            const csv = await json2csv(res.data); // convierte JSON a CSV
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, filename);
        } catch (err) {
            console.error('Error exportando CSV', err);
            alert('Error al exportar CSV');
        }
    };

    return (
        <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
        >
            Exportar CSV
        </button>
    );
}
