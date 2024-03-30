import converter from './data.js';

const calcTimeToBus = (courseStartTime, courseLocation) => {
    //classStartTime must be in format: 6:30 AM
    const wrapper = [];
    wrapper.push(courseStartTime);

    const classTimeSeconds = converter(wrapper);

    const stopToClass = calculateRoute(oppositeBusStop, courseLocation);
    return classTimeSeconds - stopToClass - 9*60;
};

export default calcTimeToBus;
