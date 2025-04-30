import { api } from './index';

export async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    // Ожидается, что сервер вернёт { url: string }
    return response.data.url;
}
