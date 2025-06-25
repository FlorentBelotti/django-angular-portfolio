export interface ProjectImage {
    id: number;
    project: number;
    image: string;
    image_url?: string;
    description: string;
    order: number;
}

export interface Project {
    id: number; // Gardons number car l'API retourne toujours un ID
    type: 'school' | 'side' | 'professional';
    title: string;
    description: string;
    date: string;
    technologies: string;
    github_link?: string;
    demo_link?: string;
    school_name?: string;
    company_name?: string;
    images: ProjectImage[];
}