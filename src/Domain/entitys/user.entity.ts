import { UserProps } from "../types/userProps.types.js";

export class User {
    private readonly _id: string;
    private _email: string;
    private readonly _passwordHash: string;
    private readonly _createAt: Date;
    private _updateAt: Date;

    constructor(props: UserProps) {
        this._id = props.id;
        this._email = props.email;
        this._passwordHash = props.passwordHash;
        this._createAt = props.createdAt ?? new Date();
        this._updateAt = props.updatedAt ?? new Date();
    }
    get id(): string {
        return this._id;
    }
    get email(): string {
        return this._email;
    }

    get passwordHash(): string {
        return this._passwordHash;
    }

    get createdAt(): Date {
        return this._createAt;
    }
    
    get updatedAt(): Date {
        return this._updateAt;
    }

    static create(props: Omit<UserProps, 'id'| 'createAt' | 'updateAt'>): User {
        const email = props.email.trim().toLowerCase();
        if (!email || !email.includes('@')) {
            throw new Error('Некорректный email');
        }

        if (!props.passwordHash) {
            throw new Error('Хеш пароля обязателен');
        }
        return new User({
            id: crypto.randomUUID(),
            email,
            passwordHash: props.passwordHash
        })
    }
}
