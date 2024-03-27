import { Router } from 'express';
import { courseSeeds } from './seeds.js';


const coursesRouter = Router();
const courses = courseSeeds;

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

    if (!newCourse.name || !newCourse.building || !newCourse.startTime || !newCourse.endTime || !newCourse.days || !newCourse.netid) {
        return res.status(400).json({ error: 'All fields are required for course creation' });
    }

    courses.push(newCourse);
    res.status(200).json(newCourse);
})

export default coursesRouter;