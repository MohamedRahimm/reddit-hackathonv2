import Matter from "matter-js";
import { levelData, TILE_SIZE, Tiles } from "./levelGen";
import { player, playerRadius, playerSensor } from "../Player/character";


//game objects values
var game = {
  cycle: 0,
  width: levelData[0].length * TILE_SIZE,
  height: levelData.length * TILE_SIZE,
  }

  // X Velocity to maintain
const fixedSpeed = 1.3;

// ensure player has no friction
player.friction = 0;
player.frictionAir = 0;
player.frictionStatic = 0;
  
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Events = Matter.Events;
const Body = Matter.Body;
const Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: levelData[0].length * TILE_SIZE,
    height: levelData.length * TILE_SIZE,
    pixelRatio: 1,
    background: 'rgba(59, 170, 59, 0.84)',
    wireframeBackground: '#222',
  //   enabled: true,
    wireframes: false,
    showVelocity: false,
    showAngleIndicator: true,
    showCollisions: true,
  }
});
Render.lookAt(render, {
  min: { x: -50, y: -50 },
  max: { x: levelData[0].length * TILE_SIZE, y: levelData.length * TILE_SIZE },
});

// Adds walls and objects to level
for (let row = 0; row < levelData.length; row++) {
  for (let col = 0; col < levelData[row].length; col++) {
      const tileType = levelData[row][col];

      // Calculate tile x, y from grid pos
      const xPos = col * TILE_SIZE;
      const yPos = row * TILE_SIZE;

      // Check the tile type and add appropriate bodies to the world
      if (tileType !== Tiles.Blank) {
          const tile = Bodies.rectangle(xPos, yPos, TILE_SIZE, TILE_SIZE, { 
              friction: 0, // No friction
              frictionAir: 0, // No air friction
              frictionStatic: 0, // no static friction
              isStatic: true, // Non-movable object
              label: JSON.stringify([`(${row}, ${col})`, tileType.toString()]),
          });
          World.add(engine.world, tile);
      } 
      // Optionally, handle other tile types (e.g., Blank) if needed
      else if (tileType === Tiles.Blank) {
          // No body is added for blank tiles (or handle them differently if needed)
      }
  }
}
  
  
  //looks for key presses and logs them
  var keys: { [key: string]: boolean } = {};
  document.body.addEventListener("keydown", function(e) {
    keys[e.code] = true;
    // console.log(`Key down: ${e.code}`);
  });
  document.body.addEventListener("keyup", function(e) {
    keys[e.code] = false;
    // console.log(`Key up: ${e.code}`);
  });
  

  Events.on(engine, "afterUpdate", function() {
    if (player && playerSensor) {
        //set sensor velocity to zero so it collides properly
        Matter.Body.setVelocity(playerSensor, {
            x: 0,
            y: 0
        });
        //move sensor to below the player
        console.log("Moving sensor to player")
        Body.setPosition(playerSensor, {
            x: player.position.x,
            y: player.position.y + playerRadius
        });
    };
});
  
Events.on(engine, 'collisionEnd', (event) => {
  const pairs = event.pairs;
  

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;

    // Check if the collision involves the player sensor (Body A) and a floor (Body B)
    if (bodyA === playerSensor && JSON.parse(bodyB.label)[1] === 'Floor') {
      console.log('Player sensor left floor (collisionEnd):');
      console.log('  Body A (sensor):', bodyA);
      console.log('  Body B (floor):', bodyB);
      player.ground = false
    }
    // Check if the collision involves the player sensor (Body B) and a floor (Body A)
    else if (bodyB === playerSensor && JSON.parse(bodyA.label)[1] === 'Floor'){
        console.log('Player sensor left floor (collisionEnd):');
        console.log('  Body A (floor):', bodyA);
        console.log('  Body B (sensor):', bodyB);
        player.ground = false
    }
  }
});

Events.on(engine, 'collisionStart', (event) => {
  
  const pairs = event.pairs;


  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;

    // Check if the collision involves the player sensor (Body A) and a floor (Body B)
    if (bodyA === playerSensor && JSON.parse(bodyB.label)[1] === 'Floor') {
      console.log('Player sensor left floor (collisionEnd):');
      console.log('  Body A (sensor):', bodyA);
      console.log('  Body B (floor):', bodyB);
      player.ground = true
    }
    // Check if the collision involves the player sensor (Body B) and a floor (Body A)
    else if (bodyB === playerSensor && JSON.parse(bodyA.label)[1] === 'Floor'){
        console.log('Player sensor left floor (collisionEnd):');
        console.log('  Body A (floor):', bodyA);
        console.log('  Body B (sensor):', bodyB);
        player.ground = true
    }
  }
});

Events.on(engine, "beforeUpdate", function() {
  if (player && playerSensor) {
    game.cycle++;
    // console.log(`Player Grounded: ${player.ground}, JumpCD: ${player.jumpCD}`);
    // Jump
    if (keys["ArrowUp"] && player.ground && player.jumpCD < game.cycle) {
        console.log("Jumping!");
        player.jumpCD = game.cycle + 1; // Adds a cooldown to jump
        Body.applyForce(player, player.position, { x: 0, y: -0.01 });
    } else if (keys["ArrowUp"] && !player.ground) {
        console.log("Jump attempt failed, player is not grounded.");
    }

    console.log(`Player Velocity: ${player.velocity.x}`);

    let moveDirection = 1;
    // moving player left or right, as long as they are not exceeding maximum x velocity (1.5)
    if (keys["ArrowLeft"]) {
        console.log("Moving left!");
        moveDirection = -1;
    } else if (keys["ArrowRight"]) {
        console.log("Moving right!");
        moveDirection = 1;
    } else {
      moveDirection = player.velocity.x > 0 ? 1 : -1;
    }
    console.log(`Player Velocity: ${player.velocity.x}`);
    console.log(`Move Direction: ${moveDirection}`);

        // Set velocity to fixed speed
    Body.setVelocity(player, { x: moveDirection * fixedSpeed, y: player.velocity.y });
    }
  }
 );
  
  // Add player and collision sensor to world
  World.add(engine.world, [player, playerSensor]);

  // run the engine
  var runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
  
  // run the renderer
  Render.run(render);
  