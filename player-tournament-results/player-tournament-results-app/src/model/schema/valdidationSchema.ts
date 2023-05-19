import { object, string, number } from 'yup';

export const playerResultSchema = object({
    firstName: string().required('First name is required'),
    lastName: string().required('Last name is required'),
    dateOfBirth: string().required('Date of birth is required'),
    tournament: string().required('Tournament is required'),
    points: number().required('Points is required'),
});
