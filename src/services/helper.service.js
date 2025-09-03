import { ApiClient } from '@/lib/apiClient';
import { todayChile } from '@/utils/helper';

const api = new ApiClient({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

const toYYYYMMDDChile = (date) =>
    new Date(date).toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });

export const helperService = {
    getMetadata: () => api.get('/helpers/metadata'),
    getResumen: () => api.get('/helpers/resumen'),
    getCajas: (fecha = todayChile()) => {
        const f =
            fecha instanceof Date
                ? toYYYYMMDDChile(fecha)
                : typeof fecha === 'string'
                    ? fecha
                    : todayChile();
        return api.get('/helpers/resumen-cajas', { fecha: f });
    },
};
