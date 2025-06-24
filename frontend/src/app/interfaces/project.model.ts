export interface Project {
    id?: number;
    title: string;
    description: string;
    type: 'school' | 'side' | 'professional';
    date: string;
    technologies: string;
    github_link?: string;
    demo_link?: string;
    school_name?: string;
    company_name?: string;
    images?: ProjectImage[];
}

export interface ProjectImage {
    id?: number;
    project?: number;
    image?: File;
    image_url?: string;
    description?: string;
    order?: number;
}