import Matter from 'matter-js';
import { levelData, TILE_SIZE } from './levelGen';
import { player, playerSensor } from '../Player/character';
import { engine, World } from '../../main'


const Render = Matter.Render;
export const Body = Matter.Body;

export var render = Render.create({
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


// run the engine
var runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

// run the renderer
Render.run(render);
/*
TODO:
Improve UI
Use reddit api to save levelData change
Make traps smaller and change levelData to use 2d arrays for traps with objects that maybe look like
they can spawn and overlap each other
{
trapType
position
}
*/

// Add player and collision sensor to world
World.add(engine.world, [player, playerSensor]);
World.add(engine.world, [player, playerSensor]);