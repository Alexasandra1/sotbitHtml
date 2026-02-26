import { Person } from './Person.js';

export class Instructor extends Person {
    constructor(name, age, email, employeeId) {
        super(name, age, email);
        this.employeeId = employeeId;
        this._courses = [];
    }

    set employeeId(employeeId) {
        if (typeof employeeId !== 'string' || employeeId.trim() === '') {
            throw new Error('Employee ID must be a non-empty string.');
        }
        this._employeeId = employeeId.trim();
    }

    get employeeId() {
        return this._employeeId;
    }

    get courses() {
        return this._courses;
    }

    assignCourse(course) {
        if (!this._courses.includes(course)) {
            this._courses.push(course);
        } else {
            console.warn(`Course "${course.title || course.courseId}" is already assigned to instructor ${this.name}.`);
        }
    }

    removeCourse(course) {
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
         console.log(`${baseDetails}\nTeaches courses: ${courseList}\nEmployee ID: ${this._employeeId}`);
    }
}
