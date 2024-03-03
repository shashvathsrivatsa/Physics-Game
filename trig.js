function toCartesian(viewport_coords) {    
    const cartesian_x = viewport_coords.x - containerWidth/2;
    const cartesian_y = containerHeight/2 - viewport_coords.y;
    
    const cartesian_coords = {
        x: cartesian_x,
        y: cartesian_y
    }
    
    return cartesian_coords
}

function toViewport(cartesian_coords) {
    const viewport_x = containerWidth/2 + cartesian_coords.x;
    const viewport_y = containerHeight/2 - cartesian_coords.y;

    const viewport_coords = {
        x: viewport_x,
        y: viewport_y
    };

    return viewport_coords;
}

function calibratedCartesianCoords(viewport_coords, diameter) {
    const offset_cartesian_coords = toCartesian(viewport_coords);
    const calibrated_cartesian_x = offset_cartesian_coords.x + diameter/2;
    const calibrated_cartesian_y = offset_cartesian_coords.y - diameter/2;
    const calibrated_cartesian_coords = {
        x: calibrated_cartesian_x,
        y: calibrated_cartesian_y
    }
    return calibrated_cartesian_coords;
}

function distanceBetween(coords1, coords2) {
    const dx = coords2.x - coords1.x;
    const dy = coords2.y - coords1.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    return distance;
}

function toDegrees(radians) {
    const degrees = radians * 180 / Math.PI;
    return degrees;
}

function toRadians(degrees) {
    const radians = degrees * Math.PI / 180;
    return radians;
}

function cos(degrees) {
    const radians = toRadians(degrees);
    const result = Math.cos(radians);
    return result;
}

function sin(degrees) {
    const radians = toRadians(degrees);
    const result = Math.sin(radians);
    return result;
}

function angleBetween(coords1, coords2) {
    const dx = coords2.x - coords1.x;
    const dy = coords2.y - coords1.y;
    const angleRad = Math.atan2(dy, dx);
    const angle = toDegrees(angleRad);
    return angle;
}
