import converter from './data.js';

const calcTimeToBus = (classStartTime, currentLocation, course) => {
    //classStartTime must be in format: 6:30 AM
    const wrapper = [];
    wrapper.push(classStartTime);

    const classTimeSeconds = converter(wrapper);
    const stopToClass = googleMaps(currentBusStop, course.location);
    return classTimeSeconds - stopToClass - 9*60;
};

