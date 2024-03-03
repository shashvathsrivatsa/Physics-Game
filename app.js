//=  variables in caps are configurable parameters  =//

//==  VARIABLES  ==//
let particles = []

const mainContainer = document.querySelector(".main-container");
const containerHeight = mainContainer.clientHeight;
const containerWidth = mainContainer.clientWidth;

let wsad_keypress = [0, 0, 0, 0]  //=  top, down, left, right  =//
const wsadToAngle = [0, 180, 90, -90]

let mouse_cartesian_coords = {
    x: 0,
    y: 100
};

//==  OBJECTS  ==//
function spawnFood() {
    const foodSprite = document.createElement("div");
    
    const maxX = mainContainer.clientWidth - 3;
    const maxY = mainContainer.clientHeight - 3;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    new Food({
        sprite: foodSprite,
        type: "food",
        viewport_coords: {
            x: randomX,
            y: randomY,
        },
        diameter: 10
    });
}

function spawnQuark(viewport_coords, direction, backgroundColor) {
    const quarkSprite = document.createElement("div");
    
    const quark = new Quark({
        sprite: quarkSprite,
        type: "quark",
        viewport_coords: viewport_coords,
        direction: direction,
        diameter: 10,
        backgroundColor: backgroundColor
    });

    quark.animate();
}

//==  FUNCTIONS  ==//
function playerMove(purpose) {
    let INCREMENT = 5;
    
    //=  if moving diagonally, make increment less (increment / sqrt(2)) so that you're moving at the same speed  =//
    if (wsad_keypress[0] && (wsad_keypress[2] && !wsad_keypress[3] || wsad_keypress[3] && !wsad_keypress[2]) ||
    wsad_keypress[1] && (wsad_keypress[2] && !wsad_keypress[3] || wsad_keypress[3] && !wsad_keypress[2]) ||
    wsad_keypress[2] && (wsad_keypress[0] && !wsad_keypress[1] || wsad_keypress[0] && !wsad_keypress[1]) ||
    wsad_keypress[3] && (wsad_keypress[0] && !wsad_keypress[1] || wsad_keypress[0] && !wsad_keypress[1])) {
        player.movingDiagonally = true;
    } else {
        player.movingDiagonally = false;
    }

    async function animate() {
        if (purpose == 0 && wsad_keypress[0] ||
            purpose == 1 && wsad_keypress[1] ||
            purpose == 2 && wsad_keypress[2] ||
            purpose == 3 && wsad_keypress[3]) {
            particles.forEach(particle => {

                const angle = wsadToAngle[purpose];
                particle.playerMove(angle, INCREMENT);
                particle.isOutOfBounds();
                particle.collisionHandle();
                
            });
            requestAnimationFrame(animate);
        }
    }

    animate()
    
}

function angleBetweenPlayerAndMouse() {
    const player_cartesian_coords = calibratedCartesianCoords(player.viewport_coords, player.diameter);
    angle = angleBetween(player_cartesian_coords, mouse_cartesian_coords);
    return angle;
}

function splitParticle(particle) {
    const particle_coords = calibratedCartesianCoords(particle.viewport_coords, particle.diameter);
    const player_cartesian_coords = calibratedCartesianCoords(player.viewport_coords, player.diameter);
    const angle = angleBetween(particle_coords, player_cartesian_coords);

    const particle_viewport_coords = particle.viewport_coords;
    particle.remove();

    spawnQuark(particle_viewport_coords, angle + 90, "#f00");
    spawnQuark(particle_viewport_coords, angle + 180, "#0f0");
    spawnQuark(particle_viewport_coords, angle + 270, "#00f");

}

//==  EVENTS  ==//
document.addEventListener("keydown", function(event) {
    if (event.key === "w" && !wsad_keypress[0]) {
        wsad_keypress[0] = 1;
        playerMove(0);
    }
    if (event.key === "s" && !wsad_keypress[1]) {
        wsad_keypress[1] = 1;
        playerMove(1);
    }
    if (event.key === "a" && !wsad_keypress[2]) {
        wsad_keypress[2] = 1;
        playerMove(2);
    }
    if (event.key === "d" && !wsad_keypress[3]) {
        wsad_keypress[3] = 1;
        playerMove(3);
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "w") {
        wsad_keypress[0] = 0;
    }
    if (event.key === "s") {
        wsad_keypress[1] = 0;
    }
    if (event.key === "a") {
        wsad_keypress[2] = 0;
    }
    if (event.key === "d") {
        wsad_keypress[3] = 0;
    }
});

document.addEventListener('mousemove', function(event) {
    if (1 in wsad_keypress) {
        mouse_viewport_x = event.clientX;
        mouse_viewport_y = event.clientY;
        mouse_viewport_coords = {
            x: mouse_viewport_x,
            y: mouse_viewport_y
        }
        mouse_cartesian_coords = toCartesian(mouse_viewport_coords);
    }
});

//==  INITIALIZE  ==//
const player = new Player();

const MAXFOOD = 50;
for (let i = 0; i < MAXFOOD; i++) {
    spawnFood();
}
