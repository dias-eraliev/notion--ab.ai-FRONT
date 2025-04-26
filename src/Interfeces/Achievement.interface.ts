export interface IAchievement {
    id: string;
    title: string;
    date: string;
    typeAchievement: 'competition' | 'certificate' | 'award';
    description: string;
    issuer: string;
    place?: string;
    image?: string;
}