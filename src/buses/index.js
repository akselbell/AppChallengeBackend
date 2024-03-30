import converter from './data.js';
import { calculateRoute } from '../maps/index.js';

const calcTimeToBus = (courseStartTime, courseLocation, oppositeBusStop) => {
    //classStartTime must be in format: 6:30 AM
    const wrapper = [];
    wrapper.push(courseStartTime);

    const classTimeSeconds = converter(wrapper);

    const stopToClass = calculateRoute(oppositeBusStop, courseLocation);
    return classTimeSeconds - stopToClass - 9*60;
};

export default calcTimeToBus;
