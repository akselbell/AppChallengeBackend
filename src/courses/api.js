import { Router } from 'express';

const router1 = Router();
const courses = [
    {
        name: "English",
        building: "LSRC",
        startTime: "12:10",
        endTime: "12:40",
        days: "Monday and Wednesday",
        netid: "adb117"
    },
    {
        name: "Math",
        building: "LSRC",
        startTime: "12:10",
        endTime: "12:40",
        days: "Monday and Wednesday",
        netid: "pkb31"
    }
];

//Example:   http://localhost:80/api/courses/adb117
router1.get('/courses/:netid', async (req, res) => {
    const { netid } = req.params;
    let ret = [];

    for(let i=0; i<courses.length; i++) {
        if(courses[i].netid == netid) {
            ret.push(courses[i]);
        }
    }    
    res.status(200).json(ret);
});


export default router1;