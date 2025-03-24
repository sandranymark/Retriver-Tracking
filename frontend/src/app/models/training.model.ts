import { Dog } from './dog.model';

export interface Training {
    _id?: string;
    dog: string | Dog;
    date?: string;
    type: 'Markering' | 'Sök' | 'Dirigering' | 'Vattenapport' | 'Jaktlydnad' | 'Annat';
    notes: string;
    rating: number;
    createdAt?: string;
}



export interface TrainingSession {
    title: string;
    date: string;
    details: string;
    dogImageUrl?: string;
}
