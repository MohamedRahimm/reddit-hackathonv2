import Matter from 'matter-js';
import { player, playerRadius, playerSensor } from '../Player/character';
import { levelData, TILE_SIZE, Tiles, engine, World } from './levelGen';

// X Velocity to maintain
const fixedSpeed = 0.3;

// ensure player has no friction
player.friction = 0;
player.frictionAir = 0;
player.frictionStatic = 0;

const Engine = Matter.Engine;
const Render = Matter.Render;
const Events = Matter.Events;
const Body = Matter.Body;
const Bodies = Matter.Bodies;


var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    background: 'rgba(16, 5, 28, 0.84)',

    wireframeBackground: '#222',
    // wireframes: false,
    showVelocity: false,
    // showAngleIndicator: true,
    showCollisions: true,
  },
});


//looks for key presses and logs them
var keys: { [key: string]: boolean } = {};
document.body.addEventListener('keydown', function (e) {
  keys[e.code] = true;
  // console.log(`Key down: ${e.code}`);
});
document.body.addEventListener('keyup', function (e) {
  keys[e.code] = false;
  // console.log(`Key up: ${e.code}`);
});

Events.on(engine, 'afterUpdate', function () {
  if (player && playerSensor) {
    //set sensor velocity to zero so it collides properly
    Matter.Body.setVelocity(playerSensor, {
      x: 0,
      y: 0,
    });
    //move sensor to below the player
    // console.log('Moving sensor to player');
    Body.setPosition(playerSensor, {
      x: player.position.x,
      y: player.position.y + playerRadius,
    });
  }
});

function cameraDebug() {
  console.log(Matter.Body.scale)
}

cameraDebug()

function checkCollision(start: boolean, event: Matter.IEventCollision<Matter.Engine>) {
  const pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;
    console.log(`  Body B ${bodyB.label}, Body A ${bodyA.label}`);

    if (
      (bodyA.label === 'Sensor' && bodyB.label.includes('Floor')) ||
      (bodyA.label.includes('Floor') && bodyB.label === 'Sensor')
    ) {
      //   console.log(`Player sensor left floor ${start === true ? 'collisionEnd' : 'collisionStart'}`);
      //   console.log(`  Body A ${bodyA.label}`);
      if (!start) {
        return false;
      }
    }
  }
  return true;
}

Events.on(engine, 'collisionEnd', (event) => {
  player.plugin.ground = checkCollision(false, event);
});

Events.on(engine, 'collisionStart', (event) => {
  player.plugin.ground = checkCollision(true, event);
});

Events.on(engine, 'beforeUpdate', function () {
  if (player && playerSensor) {
    // console.log(`Player Grounded: ${player.ground}, JumpCD: ${player.jumpCD}`);
    // Jump
    if (keys['ArrowUp'] && player.plugin.ground) {
      console.log('Jumping!');
      Body.applyForce(player, player.position, { x: 0, y: -0.005 });
    } else if (keys['ArrowUp'] && !player.plugin.ground) {
      console.log('Jump attempt failed, player is not grounded.');
    }

    // console.log(`Player Velocity: ${player.velocity.x}`);

    let moveDirection = 1;
    // moving player left or right, as long as they are not exceeding maximum x velocity (1.5)
    if (keys['ArrowLeft']) {
      //   console.log('Moving left!');
      moveDirection = -1;
    } else if (keys['ArrowRight']) {
      //   console.log('Moving right!');
      moveDirection = 1;
    } else {
      moveDirection = player.velocity.x > 0 ? 1 : -1;
    }
    // console.log(`Player Velocity: ${player.velocity.x}`);
    // console.log(`Move Direction: ${moveDirection}`);

    // Set velocity to fixed speed
    Body.setVelocity(player, { x: moveDirection * fixedSpeed, y: player.velocity.y });
  }
});

// Add player and collision sensor to world
// World.add(engine.world, [player, playerSensor]);
World.add(engine.world, [player]);

// run the engine
var runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

// run the renderer
Render.run(render);
const button = document.createElement('button');
button.innerText = 'stop sim';
document.body.appendChild(button);
button?.addEventListener('click', () => {
  Render.stop(render);
  Matter.Runner.stop(runner);
});
document.body.append();
