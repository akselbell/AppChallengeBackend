import { converter } from './data.js';
import { calculateRoute } from '../maps/index.js';

const calcTimeToBus = async (courseStartTime, courseLocation, oppositeBusStop) => {
    //classStartTime must be in format: 6:30 AM
    const classTimeSeconds = converter([{"STOP": courseStartTime}]);
    //converter([{"STOP": course.startTime}])
    //console.log("course: " + courseLocation + " oppositeBustStop = " + oppositeBusStop);

    const stopToClass = await calculateRoute(oppositeBusStop, courseLocation);
    return classTimeSeconds[0] - stopToClass - 7*60;
};

export default calcTimeToBus;
