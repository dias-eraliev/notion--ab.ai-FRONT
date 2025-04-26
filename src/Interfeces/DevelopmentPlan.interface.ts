export interface IDevelopmentPlan {
    goal: string;
    subject: string;
    currentLevel: number;
    targetLevel: number;
    deadline: string;
    status: 'in_progress' | 'completed' | 'not_started';
    tasks: {
        title: string;
        deadline: string;
        status: 'completed' | 'in_progress' | 'not_started';
        description: string;
    }[];
    mentor: string;
}