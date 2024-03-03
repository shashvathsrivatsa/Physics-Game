class Player {
    constructor() {
        const DIAMETER = 50;
        const x = mainContainer.clientWidth/2 - DIAMETER/2;
        const y = mainContainer.clientHeight/2 - DIAMETER/2;
        const viewport_coords = {
            x: x,
            y: y
        }

        this.sprite = document.getElementById("player");
        this.viewport_coords = viewport_coords;
        this.diameter = DIAMETER;
        
        this.sprite.style.height = DIAMETER + "px";
        this.sprite.style.width = DIAMETER + "px";
        this.sprite.style.backgroundColor = "#fff";

        this.movingDiagonally = false

    }
}

class Food {
    constructor({ sprite, type, viewport_coords, diameter, backgroundColor="#fff" }) {
        this.sprite = sprite;
        this.viewport_coords = viewport_coords;
        this.diameter = diameter;
        this.type = type;
        
        sprite.classList.add(type);
        sprite.style.left = viewport_coords.x + "px";
        sprite.style.top = viewport_coords.y + "px";
        sprite.style.height = diameter + "px";
        sprite.style.width = diameter + "px";
        sprite.style.backgroundColor = backgroundColor;
        
        mainContainer.appendChild(sprite);
        particles.push(this);
    }

    async playerMove(key_angle, magnitude) {
        if (player.movingDiagonally) {
            magnitude /= Math.sqrt(2);
        }

        const cartesian_coords = toCartesian(this.viewport_coords);

        const angle = angleBetweenPlayerAndMouse() - 180 + key_angle;
        
        const dx = magnitude * cos(angle);
        const dy = magnitude * sin(angle);
        const cartesian_x_new = cartesian_coords.x + dx;
        const cartesian_y_new = cartesian_coords.y + dy;
        const cartesian_coords_new = {
            x: cartesian_x_new,
            y: cartesian_y_new
        }

        const viewport_coords = toViewport(cartesian_coords_new);
        this.viewport_coords = viewport_coords;
        this.sprite.style.left = this.viewport_coords.x + "px";
        this.sprite.style.top = this.viewport_coords.y + "px";

    }

    isOutOfBounds() {
        const BOUNDS = 50;

        if (this.viewport_coords.y < -BOUNDS ||
            this.viewport_coords.y > mainContainer.clientHeight + BOUNDS - this.diameter ||
            this.viewport_coords.x < -BOUNDS ||
            this.viewport_coords.x > mainContainer.clientWidth + BOUNDS - this.diameter) {
            this.remove();
        }
    }
    
    remove() {
        mainContainer.removeChild(this.sprite);
        removeFromArray(particles, this);
        spawnFood();
    }

    collisionHandle() {
        const collision = collisionDetect(this, player);
        if (collision) {
            splitParticle(this);
        }
    }

}

class Quark {
    constructor({ sprite, type, viewport_coords, diameter, direction, backgroundColor="#f00" }) {
        this.sprite = sprite;
        this.viewport_coords = viewport_coords;
        this.diameter = diameter;
        this.type = type;
        this.direction = direction;
        
        sprite.classList.add(type);
        sprite.style.left = viewport_coords.x + "px";
        sprite.style.top = viewport_coords.y + "px";
        sprite.style.height = diameter + "px";
        sprite.style.width = diameter + "px";
        sprite.style.backgroundColor = backgroundColor;
        
        mainContainer.appendChild(sprite);
        particles.push(this);

    }

    async animate() {
        const INCREMENT = 10;
        this.move(this.direction, INCREMENT);
        this.isOutOfBounds();
        this.collisionHandle();

        // requestAnimationFrame(this.animate.bind(this));
        requestAnimationFrame(() => this.animate());
    }

    async playerMove(key_angle, magnitude) {
        if (player.movingDiagonally) {
            magnitude /= Math.sqrt(2);
        }

        const cartesian_coords = toCartesian(this.viewport_coords);

        const angle = angleBetweenPlayerAndMouse() - 180 + key_angle;
        
        const dx = magnitude * cos(angle);
        const dy = magnitude * sin(angle);
        const cartesian_x_new = cartesian_coords.x + dx;
        const cartesian_y_new = cartesian_coords.y + dy;
        const cartesian_coords_new = {
            x: cartesian_x_new,
            y: cartesian_y_new
        }

        const viewport_coords = toViewport(cartesian_coords_new);
        this.viewport_coords = viewport_coords;
        this.sprite.style.left = this.viewport_coords.x + "px";
        this.sprite.style.top = this.viewport_coords.y + "px";

    }
    
    async move(angle, magnitude) {

        const cartesian_coords = toCartesian(this.viewport_coords);
        
        const dx = magnitude * cos(angle);
        const dy = magnitude * sin(angle);
        const cartesian_x_new = cartesian_coords.x + dx;
        const cartesian_y_new = cartesian_coords.y + dy;
        const cartesian_coords_new = {
            x: cartesian_x_new,
            y: cartesian_y_new
        }

        const viewport_coords = toViewport(cartesian_coords_new);
        this.viewport_coords = viewport_coords;
        this.sprite.style.left = this.viewport_coords.x + "px";
        this.sprite.style.top = this.viewport_coords.y + "px";

    }

    isOutOfBounds() {
        const BOUNDS = this.diameter * 1.5;

        if (this.viewport_coords.y < -BOUNDS ||
            this.viewport_coords.y > mainContainer.clientHeight + BOUNDS - this.diameter ||
            this.viewport_coords.x < -BOUNDS ||
            this.viewport_coords.x > mainContainer.clientWidth + BOUNDS - this.diameter) {
            this.remove();
        }
    }
    
    remove() {
        if (particles.includes(this)) {
            mainContainer.removeChild(this.sprite);
            removeFromArray(particles, this);
        }
    }

    collisionHandle() {
        return new Promise((resolve) => {
            const collision = collisionDetect(this, player);
            if (collision) {}
            
            const foods = particles.filter(particle => particle.type == "food");
            foods.forEach(particle => {
                const collision = collisionDetect(this, particle);
                if (collision) {
                    splitParticle(particle);
                }
            });

            resolve();
        });
    }

}
