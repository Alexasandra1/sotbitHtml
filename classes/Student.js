import { Person } from './Person.js';

export class Student extends Person {
    constructor(name, age, email, studentId) {
        super(name, age, email);
        this.studentId = studentId;
        this._courses = [];
    }

    set studentId(studentId) {
        if (typeof studentId !== 'string' || studentId.trim() === '') {
            throw new Error('Student ID must be a non-empty string.');
        }
        this._studentId = studentId.trim();
    }

    get studentId() {
        return this._studentId;
    }

    get courses() {
        return [...this._courses];
    }

    enroll(course) {
        if (!this._courses.includes(course)) {
            this._courses.push(course);
        }
    }

    drop(course) {
        const index = this._courses.indexOf(course);
        if (index !== -1) {
            this._courses.splice(index, 1);
        }
    }

    getDetails() {
        const baseDetails = super.getDetails();
        const courseList = this._courses.length > 0 
            ? this._courses.map(c => c.title || c.courseId).join(', ') 
            : 'none';
        console.log(`${baseDetails}\nEnrolled courses: ${courseList}`);
    }
}