export interface Training {
    id: string;
    dogId: string;
    date: Date;
    type: 'Landapport' | 'Vattenapport' | 'Dirigering' | 'Annat';
    notes: string;
    rating: number; // stars 1-5
}

export interface TrainingSession {
    title: string;
    date: string;
    details: string;
}
