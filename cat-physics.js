const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

class Cat {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.ax = 0;
        this.ay = 0;
        this.width = 40;
        this.height = 30;
        this.color = `hsl(${Math.random() * 60 + 20}, 70%, 50%)`;
        this.rotation = 0;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.momentOfInertia = 0.5;
        this.isJumping = false;
        this.jumpCooldown = 0;
        this.tailAngle = 0;
        this.earTwitch = 0;
        this.pawAnimation = 0;
        this.isGrounded = false;
        this.groundedTime = 0;
    }

    update(deltaTime) {
        this.jumpCooldown = Math.max(0, this.jumpCooldown - deltaTime);
        
        if (Math.random() < 0.02 && this.jumpCooldown === 0 && this.isGrounded) {
            this.vy = -15;
            this.isJumping = true;
            this.jumpCooldown = 1;
            this.angularVelocity = (Math.random() - 0.5) * 10;
        }

        if (Math.random() < 0.05) {
            this.ax = (Math.random() - 0.5) * 2;
        }

        this.ay = 0.5;

        this.vx += this.ax * deltaTime;
        this.vy += this.ay * deltaTime;

        this.vx *= 0.98;

        this.vx = Math.max(-15, Math.min(15, this.vx));
        this.vy = Math.max(-20, Math.min(20, this.vy));

        this.x += this.vx;
        this.y += this.vy;

        this.angularAcceleration = 0;
        
        if (this.isGrounded) {
            this.groundedTime += deltaTime;
            const targetRotation = 0;
            const rotationDiff = targetRotation - this.rotation;
            this.angularAcceleration = rotationDiff * 5 - this.angularVelocity * 2;
            
            if (this.groundedTime > 0.3) {
                this.angularVelocity *= 0.9;
            }
        } else {
            this.groundedTime = 0;
            this.angularAcceleration = this.vx * 0.001;
        }

        this.angularVelocity += this.angularAcceleration * deltaTime;
        this.angularVelocity *= 0.98;
        this.angularVelocity = Math.max(-10, Math.min(10, this.angularVelocity));
        
        this.rotation += this.angularVelocity * deltaTime;

        const collisionDamping = 0.8;
        const impactForce = 0.3;

        if (this.x <= this.width/2) {
            this.x = this.width/2;
            this.vx = Math.abs(this.vx) * collisionDamping;
            this.angularVelocity += (Math.random() - 0.5) * impactForce * Math.abs(this.vx);
        }
        if (this.x >= canvas.width - this.width/2) {
            this.x = canvas.width - this.width/2;
            this.vx = -Math.abs(this.vx) * collisionDamping;
            this.angularVelocity += (Math.random() - 0.5) * impactForce * Math.abs(this.vx);
        }
        if (this.y <= this.height/2) {
            this.y = this.height/2;
            this.vy = Math.abs(this.vy) * collisionDamping;
            this.angularVelocity += (Math.random() - 0.5) * impactForce * Math.abs(this.vy);
        }
        if (this.y >= canvas.height - this.height/2) {
            this.y = canvas.height - this.height/2;
            this.vy = -Math.abs(this.vy) * collisionDamping;
            this.isJumping = false;
            this.isGrounded = true;
            
            const landingImpact = Math.abs(this.vy) * 0.5;
            this.angularVelocity += (Math.random() - 0.5) * landingImpact;
        } else {
            this.isGrounded = false;
        }

        this.tailAngle = Math.sin(Date.now() * 0.01) * 0.3 + this.angularVelocity * 0.1;
        this.earTwitch = Math.sin(Date.now() * 0.02) * 0.1;
        this.pawAnimation = (this.pawAnimation + Math.abs(this.vx) * 0.1) % (Math.PI * 2);
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(-this.width/2.5, -2, this.height/2.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.save();
        ctx.rotate(this.earTwitch);
        ctx.beginPath();
        ctx.moveTo(-this.width/2.5 - 5, -this.height/2.5 - 5);
        ctx.lineTo(-this.width/2.5, -this.height/2.5 + 5);
        ctx.lineTo(-this.width/2.5 + 5, -this.height/2.5 - 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(-this.width/2.5 - 10, -this.height/2.5 - 5);
        ctx.lineTo(-this.width/2.5 - 5, -this.height/2.5 + 5);
        ctx.lineTo(-this.width/2.5, -this.height/2.5 - 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.width/2, 0);
        ctx.rotate(this.tailAngle);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(15, -5, 25, -10);
        ctx.stroke();
        ctx.restore();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-this.width/2.5 - 3, -5, 2, 0, Math.PI * 2);
        ctx.arc(-this.width/2.5 + 3, -5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-this.width/2.5 - 15, -2);
        ctx.lineTo(-this.width/2.5 - 25, -4);
        ctx.moveTo(-this.width/2.5 - 15, 0);
        ctx.lineTo(-this.width/2.5 - 25, 0);
        ctx.moveTo(-this.width/2.5 - 15, 2);
        ctx.lineTo(-this.width/2.5 - 25, 4);
        ctx.stroke();
        
        ctx.fillStyle = this.color;
        const legOffset = Math.sin(this.pawAnimation) * 3;
        ctx.beginPath();
        ctx.ellipse(-this.width/4, this.height/2 - 2 + legOffset, 4, 6, 0, 0, Math.PI * 2);
        ctx.ellipse(this.width/4, this.height/2 - 2 - legOffset, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

const cats = [];
for (let i = 0; i < 5; i++) {
    cats.push(new Cat(
        Math.random() * (canvas.width - 80) + 40,
        Math.random() * (canvas.height - 60) + 30
    ));
}

let lastTime = 0;
function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    cats.forEach(cat => {
        cat.update(deltaTime);
        cat.draw();
    });
    
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);