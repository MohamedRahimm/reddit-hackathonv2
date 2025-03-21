import { levelData, TILE_SIZE, Tiles } from './levelGen';
import Matter, { Composite, Mouse, MouseConstraint } from 'matter-js';
import { render } from './level';
import { engine, Events, World, Bodies } from '../../main'


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
        levelData[i][j] = Tiles.Trap;
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
  // this math.random in label is not needed this is me messing with stuff
  return Bodies.rectangle(0, 0, TILE_SIZE, TILE_SIZE, { label: 'new' + ' ' + Math.random() });
};
const snapToCenter = (value: number) => {
  return Math.floor(value / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
};
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: true },
  },
});
//bugs:
// when mousedown cant drag trap back to original Position
// when initalizing an object with is isStatic some bug occurs so access thru object and update it instead
const idk = (
  body: Matter.Body,
  currPos: { x: number; y: number },
  initPos: { x: number; y: number }
) => {
  //   if (body.label.includes('new')) {
  const newX = Math.floor(mouse.position.x / TILE_SIZE);
  const newY = Math.floor(mouse.position.y / TILE_SIZE);
  if (levelData[newY][newX] !== Tiles.Blank) {
    if (newX === initPos.x && newY === initPos.y) {
      Matter.Body.setPosition(body, {
        x: snapToCenter(mouse.position.x),
        y: snapToCenter(mouse.position.y),
      });
    } else {
      Matter.Body.setPosition(body, {
        x: currPos.x,
        y: currPos.y,
      });
     }
  } else {
    Matter.Body.setVelocity(body, {
      x: 0,
      y: 0,
    });
    Matter.Body.setPosition(body, {
      x: snapToCenter(mouse.position.x),
      y: snapToCenter(mouse.position.y),
    });
    currX = snapToCenter(mouse.position.x);
    currY = snapToCenter(mouse.position.y);
  }
};

let callback: () => void;
let currX: number;
let currY: number;
let initPosX: number | boolean;
let initPosY: number | boolean;
let currGridX: number;
let currGridY: number;

console.log(TILE_SIZE);
let trapState = false;


const newPlacedTraps: Matter.Body[] = [];
const spriteSheet = new Image();
spriteSheet.src = '/assets/sprite_sheet.png'; // Replace with your sprite sheet URL


spriteSheet.onload = () => {
  // Define sprite regions
  const spriteRegions = [
    { x: 0, y: 128, width: 64, height: 64 }, // Spikes
    { x: 0, y: 192, width: 64, height: 64 }, // Barrel
    { x: 192, y: 128, width: 64, height: 64 }, // Lever
    { x: 320, y: 128, width: 64, height: 64 }, // Chest
    { x: 64, y: 128, width: 64, height: 64 }, // Closed Door
    { x: 128, y: 128, width: 64, height: 64 }, // Open Door
  ];

  // Populate the trap menu
  for (let i = 1; i <= 6; i++) {
    const item = document.createElement('button');
    // item.textContent = 'Item ' + i; // Remove text
    trapMenu.appendChild(item);
    item.classList.add('item');

    // Apply sprite sheet background and position
    item.style.backgroundImage = `url(${spriteSheet.src})`;
    item.style.backgroundPosition = `-${spriteRegions[i - 1].x}px -${spriteRegions[i - 1].y}px`;
    item.style.width = `64px`;
    item.style.height = `64px`;
    item.style.backgroundColor = 'transparent';
    item.style.backgroundSize = `${spriteSheet.width}px ${spriteSheet.height}px`;
    item.style.backgroundRepeat = 'no-repeat';
    item.style.outlineWidth = '2px';
    item.style.outlineStyle = 'dashed';
    item.style.outlineColor = 'yellow';
    item.style.flexGrow = '0';
    item.style.alignSelf = 'flex-start';
    item.style.flexBasis = '64px';
    item.style.flexShrink = '0';
    

    item.addEventListener('click', () => {
      // Only add trap if trapState is true
      if (trapState) {
        let newTile = findEmptyTile();
        World.add(engine.world, newTile);
        newPlacedTraps.push(newTile);
        console.log("Before isStatic:", newTile);
        newTile.isStatic = true;
        console.log("After isStatic:", newTile);
        console.log("isStatic:", newTile.isStatic);
        console.log(newPlacedTraps);
      }
    });
  }
};


// Button click event handler
button.addEventListener('click', () => {
  trapState = !trapState;
  console.log(trapState);
  if (trapState) {
    button.innerText = 'Close';
    Events.on(render, 'afterRender', drawGrid);
    World.add(engine.world, mouseConstraint);
    Events.on(mouseConstraint, 'startdrag', (e) => {
      if (e.body.label.includes('new') || e.body.label === 'door') {
        console.log(e.body);
        currX = e.body.position.x;
        currY = e.body.position.y;
        if (!initPosX && !initPosY) {
          initPosX = Math.floor(currX / TILE_SIZE);
          initPosY = Math.floor(currY / TILE_SIZE);
        }
        currGridX = Math.floor(e.body.position.x / TILE_SIZE);
        currGridY = Math.floor(e.body.position.y / TILE_SIZE);
        e.body.isStatic = false;
        callback = () => idk(e.body, { x: currX, y: currY }, { x: initPosX, y: initPosY });
        Events.on(engine, 'afterUpdate', callback);
      }
    });

    Events.on(mouseConstraint, 'enddrag', (e) => {
      if (e.body.label.includes('new') || e.body.label == 'door') {
        Events.off(engine, 'afterUpdate', callback);
        e.body.isStatic = true;
        e.body.positionImpulse = { x: 0, y: 0 };
        e.body.constraintImpulse = { x: 0, y: 0, angle: 0 };
        const x = Math.floor(e.body.position.x / TILE_SIZE);
        const y = Math.floor(e.body.position.y / TILE_SIZE);
        initPosX = false;
        initPosY = false;
        levelData[currGridY][currGridX] = e.body.label === 'door' ? Tiles.Door : Tiles.Blank;
        levelData[y][x] = Tiles.Trap;
      }
    });

  } else {
    Events.off(render, 'afterRender', drawGrid);
    World.remove(engine.world, mouseConstraint);
    Events.off(mouseConstraint, 'startdrag');
    Events.off(mouseConstraint, 'enddrag');
    // button.remove();
    // document.body.appendChild(button);
    button.innerText = 'Add Traps';
  }
});
// console.log(Composite.allBodies(engine.world));
