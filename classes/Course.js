export class Course {
    constructor(courseId, title, instructor) {
        this.courseId = courseId;
        this.title = title;
        this.instructor = instructor;
        this._students = [];
    }

    set courseId(courseId) {
        if (typeof courseId !== 'string' || courseId.trim() === '') {
            throw new Error('Course ID must be a non-empty string.');
        }
        this._courseId = courseId.trim();
    }

    set title(title) {
        if (typeof title !== 'string' || title.trim() === '') {
            throw new Error('Course title must be a non-empty string.');
        }
        this._title = title.trim();
    }

    set instructor(instructor) {
        if (!instructor || typeof instructor !== 'object' || !('name' in instructor)) {
            throw new Error('Instructor must be a valid Instructor object.');
        }
        this._instructor = instructor;
    }

    get courseId() {
        return this._courseId;
    }

    get title() {
        return this._title;
    }

    get instructor() {
        return this._instructor;
    }

    get students() {
        return this._students;
    }

    addStudent(student) {
        if (!this._students.includes(student)) {
            this._students.push(student);
            student.enroll(this);
        } else {
            console.warn(`Student ${student.name} is already enrolled in course "${this._title}".`);
        }
    }

    removeStudent(student) {
        const index = this._students.indexOf(student);
        if (index !== -1) {
            this._students.splice(index, 1);
            student.drop(this);
        }
    }

    getDetails() {
        const studentList = this._students.length > 0
            ? this._students.map(s => s.name).join(', ')
            : 'none';
         console.log(`Course: ${this._title} (ID: ${this._courseId})\nInstructor: ${this._instructor.name}\nStudents: ${studentList}`);
    }
}