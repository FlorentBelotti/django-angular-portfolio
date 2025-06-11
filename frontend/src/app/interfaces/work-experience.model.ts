export interface WorkExperience {
    id: number;
    company: string;
    position: string;
    location: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description: string;
}