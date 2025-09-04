import { ApiClient } from '@/lib/apiClient';

const api = new ApiClient({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

export const boletaService = {
    solicitar: (data) => api.post('/boletas/solicitar-folios', data)
};
