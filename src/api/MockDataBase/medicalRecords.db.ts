import {IMedicalRecord} from "@/Interfeces/MedicalRecord.interface.ts";

export const medicalRecords: IMedicalRecord[] = [
    {
        date: '2024-03-15',
        reason: 'Головная боль',
        diagnosis: 'Мигрень',
        prescription: 'Отдых, обезболивающее',
        doctor: 'Асанова А.К.'
    },
    {
        date: '2024-02-20',
        reason: 'Плановый осмотр',
        diagnosis: 'Здоров',
        prescription: '-',
        doctor: 'Асанова А.К.'
    }
];