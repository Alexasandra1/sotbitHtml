export class Person {
    constructor(name, age, email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }

    set name(name) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new Error('Name must be a non-empty string.');
        }
        this._name = name.trim();
    }

    set age(age) {
        if (typeof age !== 'number' || (age < 0 && age > 150) || !Number.isInteger(age)) {
            throw new Error('Age must be an integer between 0 and 150.');
        }
        this._age = age;
    }

    set email(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof email !== 'string' || !emailRegex.test(email)) {
            throw new Error('Email must be a valid email address.');
        }
        this._email = email;
    }

    get name() {
        return this._name;
    }

    get age() {
        return this._age;
    }

    get email() {
        return this._email;
    }

    getDetails() {
        return `Information about ${this._name}: age - ${this._age}, email - ${this._email}`;
    }
}