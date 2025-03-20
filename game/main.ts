import Matter from 'matter-js';

const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Events } = Matter;

// Create engine and world
const engine = Engine.create();
engine.gravity.y = 0;
engine.gravity.x = 0;
const world = engine.world;
// Create renderer
// const TILE_SIZE = Math.round(window.innerHeight / 6);
const TILE_SIZE = 50;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false,
  },
});

Render.run(render);

// Create and run the runner
const runner = Runner.create();
Runner.run(runner, engine);

// Grid size for snapping
// const TILE_SIZE = 50;

// Function to snap a value to the center of the nearest grid tile
// const snapToCenter = (value, TILE_SIZE) => {
//     return Math.round((value + TILE_SIZE / 2) / TILE_SIZE) * TILE_SIZE;
// };
// const snapToCenter = (value, TILE_SIZE) => {
//   const snappedValue = Math.round(value / TILE_SIZE) * TILE_SIZE;
//   return snappedValue;
// };
const snapToCenter = (value) => {
  const offset = 0.000000001; // A very small offset
  return Math.round((value + offset) / TILE_SIZE) * TILE_SIZE - TILE_SIZE / 2;
};
// Create static floor

// Create some draggable bodies
const boxA = Bodies.rectangle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, {
  restitution: 0,
  inertia: Infinity,
  frictionAir: 0,
  friction: 0,
  frictionStatic: 0,
});
// const boxB = Bodies.rectangle(300, 300, 50, 50, { restitution: 0 });
World.add(world, [boxA]);

// Mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: true },
  },
});
World.add(world, mouseConstraint);
const idk = () => {
  Matter.Body.setVelocity(boxA, {
    x: 0,
    y: 0,
  });
  Matter.Body.setPosition(boxA, {
    x: snapToCenter(boxA.position.x),
    y: snapToCenter(boxA.position.y),
  });
};
Events.on(mouseConstraint, 'startdrag', () => {
  Events.on(engine, 'afterUpdate', idk);
});
Events.on(mouseConstraint, 'enddrag', () => {
  const debounce = setTimeout(() => Events.off(engine, 'afterUpdate', idk), 100);
  clearTimeout(debounce);
});
// Draw a visual grid on the canvas
const drawGrid = () => {
  const context = render.context;
  const width = render.options.width;
  const height = render.options.height;

  context.strokeStyle = '#ddd';
  context.lineWidth = 1;

  for (let x = 0; x <= width; x += TILE_SIZE) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    // console.log(x, height);
    context.stroke();
  }

  for (let y = 0; y <= height; y += TILE_SIZE) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
};
// Run grid drawing every frame
Events.on(render, 'afterRender', drawGrid);
