import Dexie, { Table } from 'dexie';

export interface Course {
    id: string;
    title: string;
    code: string;
    professor: string;
    courseEmail?: string;
    profEmail?: string;
    description?: string;
    color?: string;
    type?: CourseType;
    createdOn: Date;
    endsOn: Date;
    midtermDate?: Date;
    finalExamDate?: Date;
    archived?: boolean;
    updatedOn: Date;
    updatedFrom?: 'calendar' | 'assignment' | 'other';
    officeHours?: OfficeHour[];
    homepage?: CourseHomepage;
}

export interface Resource {
    id: string;
    title: string;
    link: string;
    type?: "pdf" | "video" | "link" | "other";
}

export interface Deadline {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    type?: 'assignment' | 'homework' | 'lab' | 'exam' | 'project' | 'quiz' | 'meeting' | 'other';
    dueDate?: Date;
    startDate?: Date;
    endDate?: Date;
    recurrence?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
    customIntervalDays?: number;
    nextOccurrence?: Date;
    completed?: boolean;
    progress?: number;
    color?: string;
    createdOn: Date;
    updatedOn: Date;
}

export interface CourseHomepage {
    deadlines: Deadline[];
    tasks: Task[];
    resources: Resource[];
    notes?: string;
    announcements?: string[];
}

export type CourseType = 'lecture-tutorial' | 'project-studio' | 'lab';

export const courseTypeLabels: Record<CourseType, string> = {
    'lecture-tutorial': 'Lecture & Tutorial',
    'project-studio': 'Project / Studio',
    'lab': 'Lab Session',
};

export interface Contact {
    id: string;
    name: string;
    email: string;
    role: 'professor' | 'TA' | 'student' | 'other';
    courseId?: string;
}

export interface Task {
    id: string;
    courseId: string;
    title: string;
    type: 'default'| 'homework' | 'lab' | 'exam' | 'project' | 'report' | 'quiz';
    deadline: Date;
    completed: boolean;
    color: string;
}

export interface CalendarEvent {
    id: string;
    title?: string;
    description?: string;
    location?: string;
    start: Date;
    end: Date;
    source?: string;
    sourceId?: string;
    type?: 'deadline' | 'meeting' | 'exam' | 'office-hours';
    summary: string;
    color?: string;
}

export interface MicrosoftFile {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    createdOn: Date;
    lastModified: Date;
}

export interface OfficeHour {
    days?: string[];
    startTime?: string;
    endTime?: string;
    location?: string;
    byAppointment: boolean;
}

export class CalmecaDB extends Dexie {
    courses!: Table<Course, string>;
    tasks!: Table<Task, string>;
    calendarEvents!: Table<CalendarEvent, string>;
    microsoftFiles!: Table<MicrosoftFile, string>;
    courseItems!: Table<Deadline, string>;

    constructor() {
        super('CalmecaDB');
        this.version(2).stores({
            courses: 'id, title, type, color, archived, updatedOn, updatedFrom, endsOn, professor, courseEmail, profEmail, code, midtermDate, finalExamDate',
            tasks: 'id, title, courseId, type, deadline, completed, color',
            calendarEvents: 'id, title, start, end, type, source, sourceId, color',
            courseItems: 'id, courseId, title, type, dueDate, startDate, endDate, recurrence, nextOccurrence, completed'
        });
    }
}

export const db = new CalmecaDB();
