import {IAchievement} from "@/Interfeces/Achievement.interface.ts";

export interface IExtracurricularActivity {
    id: string;
    type: 'club' | 'organization' | 'course' | 'olympiad';
    name: string;
    description: string;
    schedule: string;
    teacher: string;
    location: string;
    startDate: string;
    endDate?: string;
    status: 'active' | 'completed' | 'planned';
    achievements?: IAchievement[];
    skills: string[];
    members?: number;
    image?: string;
}