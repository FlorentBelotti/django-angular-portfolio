export interface Education {
    id: number;
    institution: string;
    degree: string;
    location: string;
    field_of_study: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description: string;
}