function collisionDetect(object1, object2) {
    const center_1 = calibratedCartesianCoords(object1.viewport_coords, object1.diameter);
    const center_2 = calibratedCartesianCoords(object2.viewport_coords, object2.diameter);
    const distance = distanceBetween(center_1, center_2);
    const spaceBetween = distance - object1.diameter/2 - object2.diameter/2;
    
    if (spaceBetween <= 0) return true;
    return false;
}
