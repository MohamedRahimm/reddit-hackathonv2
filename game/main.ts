import Matter from 'matter-js';

export const TILE_SIZE = Math.round(window.innerHeight / 6);
export const { Engine, Render, Runner, World, Body, Bodies, Mouse, MouseConstraint, Events } =
  Matter;
export const engine = Engine.create();
export const render = Render.create({
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
export const runner = Matter.Runner.create();
