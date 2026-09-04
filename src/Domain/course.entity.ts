export interface CourseProps {
    id: string;
    title: string;
    description: string;
    duration: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Course {
    private readonly _id: string;
    private _title: string;
    private _description: string;
    private _duration: number;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: CourseProps) {
        this._id = props.id;
        this._title = props.title;
        this._description = props.description;
        this._duration = props.duration;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? new Date();
    }
    get id(): string { return this._id }
    get title(): string { return this._title }
    get description(): string { return this._description }
    get duration(): number { return this._duration }
    get createdAt(): Date { return this._createdAt }
    get updatedAt(): Date { return this._updatedAt }

    updateDetails(newTitle: string, newDescription: string, newDuration: number): void {
        if (!newTitle) {
            throw new Error('Название не заполнено');
        }
        if (!newDescription) {
            throw new Error('Описание не заполнено');
        }
        if (newDuration < 1 || newDuration > 40) {
            throw new Error('Некорректное число в Duration (не меньше 1 и не более 40)');
        }
        this._title = newTitle.trim();
        this._description = newDescription.trim();
        this._duration = newDuration;
        this._updatedAt = new Date();
    }

    changeDuration(newDuration: number): void {
        if (newDuration < 1 || newDuration > 40) {
            throw new Error('Некорректное число в Duration (не меньше 1 и не более 40)');
        }
        this._duration = newDuration;
        this._updatedAt = new Date();
    }
    static create(props: Omit<CourseProps, 'id' | 'createdAt' | 'updatedAt'>) {
        if ((!props.title || props.title.trim().length === 0) || (props.description.length < 10) || (props.duration < 1 || props.duration > 40)) {
            throw new Error('Заполните все поля!');
        };
        const id = crypto.randomUUID();
        return new Course({
            id,
            title: props.title.trim(),
            description: props.description.trim(),
            duration: props.duration,
        });

    }
    inShort(): boolean {
        return this._duration < 2;
    }
}