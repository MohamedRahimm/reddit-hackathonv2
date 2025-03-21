import Matter, { Composite, Mouse, MouseConstraint } from 'matter-js';
import { player, playerRadius, playerSensor } from '../Player/character';
import { engine, levelData, TILE_SIZE, Tiles, World } from './levelGen';

// X Velocity to maintain
const fixedSpeed = 0.9;

// ensure player has no friction
player.friction = 0;
player.frictionAir = 0;
player.frictionStatic = 0;

const Render = Matter.Render;
const Events = Matter.Events;
const Body = Matter.Body;
const Bodies = Matter.Bodies;

var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: TILE_SIZE * 9,
    height: TILE_SIZE * 6,
    background: 'rgba(16, 5, 28, 0.84)',

    wireframeBackground: '#222',
    wireframes: false,
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

function checkCollision(start: boolean, event: Matter.IEventCollision<Matter.Engine>) {
  const pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;
    // console.log(`  Body B ${bodyB.label}, Body A ${bodyA.label}`);

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

let moveDirection = 1;
Events.on(engine, 'beforeUpdate', function () {
  if (player && playerSensor) {
    // console.log(`Player Grounded: ${player.ground}, JumpCD: ${player.jumpCD}`);
    // Jump
    if (keys['ArrowUp'] && player.plugin.ground) {
      console.log('Jumping!');
      Body.applyForce(player, player.position, { x: 0, y: -0.003 });
    } else if (keys['ArrowUp'] && !player.plugin.ground) {
      console.log('Jump attempt failed, player is not grounded.');
    }

    // console.log(`Player Velocity: ${player.velocity.x}`);

    // moving player left or right, as long as they are not exceeding maximum x velocity (1.5)
    if (keys['ArrowLeft']) {
      //   console.log('Moving left!');
      moveDirection = -1;
    } else if (keys['ArrowRight']) {
      //   console.log('Moving right!');
      moveDirection = 1;
    }
    // console.log(`Player Velocity: ${player.velocity.x}`);
    // console.log(`Move Direction: ${moveDirection}`);

    // Set velocity to fixed speed
    Body.setVelocity(player, { x: moveDirection * fixedSpeed, y: player.velocity.y });
  }
});

// Add player and collision sensor to world
// World.add(engine.world, [player, playerSensor]);
World.add(engine.world, [player, playerSensor]);

// run the engine
var runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

// run the renderer
Render.run(render);
/*
TODO:
Improve UI
Fix traps snapping to off the map
Stop trap collisions
Use reddit api to save levelData change
Make traps smaller and change levelData to use 2d arrays for traps with objects that maybe look like
{
trapType
position
}
*/

// Create the game area container
const gameArea = document.createElement('section');
gameArea.id = 'game-area';
gameArea.style.position = 'absolute';
gameArea.style.top = '0';
gameArea.style.left = '0';
gameArea.style.width = TILE_SIZE * 9 + 'px';
gameArea.style.height = TILE_SIZE * 6 + 'px';
gameArea.style.backgroundColor = 'transparent'; // Make it invisible
document.body.appendChild(gameArea);

// Append the render canvas to the game area container
gameArea.appendChild(render.canvas);

// Create the toggle button
const button = document.createElement('button');
button.innerText = 'Add Traps';
button.id = 'button';
button.style.position = 'absolute';
button.style.top = '0';
button.style.left = TILE_SIZE * 9 + 'px';
button.style.width = window.innerWidth - TILE_SIZE * 9 + 'px';
button.style.height = window.innerHeight / 8 + 'px';
// Center and enlarge text
button.style.display = 'flex';
button.style.alignItems = 'center';
button.style.justifyContent = 'center';
button.style.fontSize = '60px';
document.body.appendChild(button);

// Create the trap menu
const trapMenu = document.createElement('section');
trapMenu.id = 'trap-menu';
trapMenu.style.position = 'absolute';
trapMenu.style.top = window.innerHeight / 8 + 'px';
trapMenu.style.left = TILE_SIZE * 9 + 'px';
trapMenu.style.width = window.innerWidth - TILE_SIZE * 9 - 20 + 'px';
trapMenu.style.height = window.innerHeight * (7 / 8) - 20 + 'px';
document.body.appendChild(trapMenu);


const drawGrid = () => {
  const context = render.context;
  const width = render.options.width!;
  const height = render.options.height!;

  context.strokeStyle = '#ddd';
  context.lineWidth = 1;

  for (let x = 0; x <= width; x += TILE_SIZE) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let y = 0; y <= height; y += TILE_SIZE) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
};

const findEmptyTile = () => {
  for (let i = levelData.length - 1; i >= 0; i--) {
    for (let j = levelData[i].length - 1; j >= 0; j--) {
      if (levelData[i][j] === Tiles.Blank) {
        return Bodies.rectangle(
          j * TILE_SIZE + TILE_SIZE / 2,
          i * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE,
          TILE_SIZE,
          {
            label: 'new',
            restitution: 0,
            inertia: Infinity,
            //isStatic: true,
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0,
          }
        );
      }
    }
  }
  return Bodies.rectangle(0, 0, TILE_SIZE, TILE_SIZE, { label: 'new' });
};
const snapToCenter = (value: number) => {
  return Math.ceil(value / TILE_SIZE) * TILE_SIZE - TILE_SIZE / 2;
};
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: true },
  },
});
const idk = (body: Matter.Body) => {
  if (body.label === 'new') {
    body.isStatic = false;
    body.isSensor = true
    Matter.Body.setVelocity(body, {
      x: 0,
      y: 0,
    });
    Matter.Body.setPosition(body, {
      x: snapToCenter(body.position.x),
      y: snapToCenter(body.position.y),
    });
  }
};

let callback: () => void;
let timeoutId: NodeJS.Timeout | undefined;

Events.on(mouseConstraint, 'startdrag', (e) => {
  callback = () => idk(e.body);
  Events.on(engine, 'afterUpdate', callback);
});

Events.on(mouseConstraint, 'enddrag', () => {
  // Clear any existing timeout
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  // Set a new timeout
  timeoutId = setTimeout(() => {
    Events.off(engine, 'afterUpdate', callback);
    timeoutId = undefined; // Clear the timeout ID
  }, 100);
});
let trapState = false;



for (let i = 1; i <= 6; i++) {
  const item = document.createElement('div');
  item.textContent = 'Item ' + i;
  item.style.display = 'flex';
  item.style.alignItems = 'center';
  item.style.justifyContent = 'center';
  item.style.fontSize = '30px';
  trapMenu.appendChild(item);
  item.classList.add('item');
  item.addEventListener('click', () => {
    let newTile = findEmptyTile();
    World.add(engine.world, newTile);
  });
}


// Button click event handler
button.addEventListener('click', () => {
  trapState = !trapState;
  console.log(trapState);
  if (trapState) {
    Events.on(render, 'afterRender', drawGrid);
    World.add(engine.world, mouseConstraint);
    button.innerText = 'Close';
  } else {
    Events.off(render, 'afterRender', drawGrid);
    World.remove(engine.world, mouseConstraint);
    const bodies = Composite.allBodies(engine.world);
    for (const body of bodies) {
      if (body.label === 'new') {
        body.isStatic = true;
        const x = Math.floor(body.position.x / TILE_SIZE);
        const y = Math.floor(body.position.y / TILE_SIZE);
        levelData[y][x] = Tiles.Trap;
        console.log(levelData[y]);
      }
    }
    button.innerText = 'Add Traps';
  }
});
