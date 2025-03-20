export interface Training {
    _id?: string;
    dogId: string;
    date?: string;
    type: 'Markering' | 'Sök' | 'Dirigering' | 'Vattenapport' | 'Jaktlydnad' | 'Annat';
    notes: string;
    rating: number;
}

export interface TrainingSession {
    title: string;
    date: string;
    details: string;
}
