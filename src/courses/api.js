import { Router } from 'express';
import { courseSeeds } from './seeds.js';
import { converter } from '../buses/data.js'; 


const coursesRouter = Router();
const courses = courseSeeds;

const dateToESTTimeString = (date) => {
    // Set the time zone to Eastern Standard Time
    const options = { timeZone: 'America/New_York', hour12: true, hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
}

const dayNameToIndex = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
};

export const calculateNextClass = (netid) => {
    const courses = courseSeeds.filter(course => course.netid === netid);
    const today = new Date().getDay(); // Get the current day index (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    let closestCourses = null;
    let minDiff = 100;

    for (const course of courses) {
        const days = course.days.split(',').map(day => day.trim());
        for (const day of days) {
            const dayIndex = dayNameToIndex[day];
            let difference = dayIndex - today;
            if (difference < 0) {
                difference = dayIndex + 7 - today;
            }
            if (difference === 0 && converter([{"STOP": course.startTime}]) - converter([{"STOP": dateToESTTimeString(new Date())}]) > 0) {
                if (difference == minDiff) {
                    closestCourses.push(course);
                } else {
                    closestCourses = [course];
                }
                minDiff = difference;
            }
            if (difference > 0 && difference == minDiff) {
                closestCourses.push(course);
            }
            if (difference > 0 && difference < minDiff) {
                minDiff = difference;
                closestCourses = [course];
            }
        }
    }
    console.log(closestCourses);
    if (closestCourses.length === 1) {
        console.log(closestCourses[0]);
        return closestCourses[0];
    }


    // Both courses are on the same today, today (cant pick a class if the time has passed)
    if (minDiff === 0) {
        let minDiffSeconds = 1000000000;
        let closestCourse = null;
        const currentTimeSeconds = converter([{"STOP": dateToESTTimeString(new Date())}]);
        for (const course of closestCourses) {
            const classTimeSeconds = converter([{"STOP": course.startTime}])
            let difference = classTimeSeconds - currentTimeSeconds;
            if (difference > 0 && difference < minDiffSeconds) {
                closestCourse = course;
                minDiffSeconds = difference;
            }
        }
        console.log(closestCourse);
        return closestCourse;
    }

    // neither courses are on today, in this case select one with earlier time
    let minDiffSeconds = 1000000000;
    let closestCourse = null;
    const currentTimeSeconds = converter([{"STOP": dateToESTTimeString(new Date())}]);
    console.log(currentTimeSeconds);
    for (const course of closestCourses) {
        const classTimeSeconds = converter([{"STOP": course.startTime}])
        console.log(classTimeSeconds);
        let difference = classTimeSeconds - currentTimeSeconds;
        if (difference > 0 && difference < minDiffSeconds) {
            closestCourse = course;
            minDiffSeconds = difference;
        }
    }

    console.log(closestCourse);
    return closestCourse;
} 

//Example:   http://localhost:80/api/courses/adb117
coursesRouter.get('/courses/:netid', async (req, res) => {
    const { netid } = req.params;
    let ret = [];

    for(let i=0; i<courses.length; i++) {
        if(courses[i].netid == netid) {
            ret.push(courses[i]);
        }
    }    
    res.status(200).json(ret);
});

// when doing this request on frontent, make sure to send the course in course format
coursesRouter.post('/courses/new', async (req, res) => {
    const newCourse = req.body;
    console.log(newCourse);

    if (!newCourse.name || !newCourse.building || !newCourse.startTime || !newCourse.days || !newCourse.netid) {
        return res.status(400).json({ error: 'All fields are required for course creation' });
    }

    courses.push(newCourse);
    res.status(200).json(newCourse);
})

export default coursesRouter;