import Matter from "matter-js";
import { levelData, TILE_SIZE, Tiles } from "./levelGen";
import { player, playerRadius, playerSensor } from "../Player/character";



//game objects values
var game = {
  cycle: 0,
  width: levelData[0].length * TILE_SIZE,
  height: levelData.length * TILE_SIZE,
  }
  
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
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    background: 'rgba(16, 5, 28, 0.84)',
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
      console.log(xPos)
      console.log(yPos)

      // Check the tile type and add appropriate bodies to the world
      if (tileType !== Tiles.Blank) {
          const tile = Bodies.rectangle(xPos, yPos, TILE_SIZE, TILE_SIZE, { 
              isStatic: true, // Non-movable object
              label: tileType  // Tile name
          });
          World.add(engine.world, tile);
      } 
      // Optionally, handle other tile types (e.g., Blank) if needed
      else if (tileType === Tiles.Blank) {
          // No body is added for blank tiles (or handle them differently if needed)
      }
  }
}
  

  //adds some balls 🤌
  // for(var i = 0; i<35;i++){
  //   World.add(engine.world, Bodies.circle(400,200,Math.ceil(6+Math.random()*22),{
  //     density: 0.0005,
  //     friction: 0,//0.05,
  //     frictionStatic: 0.5,
  //     frictionAir: 0.001,
  //     restitution: 0.5,
  //     render:{
  //       strokeStyle:'darkgrey',
  //       fillStyle:'grey'
  //     },
  //   })
  // )}

  
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
  
  // function playerGroundCheck(event:Matter.ICollisionEvent, ground: boolean) { //runs on collisions events
  //   var pairs = event.pairs
  //   for (var i = 0, j = pairs.length; i != j; ++i) {
  //     var pair = pairs[i];
  //     if (pair.bodyA === playerSensor) {
  //       player.ground = ground;
  //     } else if (pair.bodyB === playerSensor) {
  //       player.ground = ground;
  //     }
  //   }
  // }
  
  
  
  // //at the start of a colision for player
  // Events.on(engine, "collisionStart", function(event) {
  //   playerGroundCheck(event, true)
  // });
  // //ongoing checks for collisions for player
  // Events.on(engine, "collisionActive", function(event) {
  //   playerGroundCheck(event, true)
  // });
  // //at the end of a colision for player set ground to false
  // Events.on(engine, 'collisionEnd', function(event) {
  //   playerGroundCheck(event, false);
  // })
  
  Events.on(engine, "afterTick", function() {
    // Check if player and playerSensor are defined
    if (player && playerSensor) {
        //set sensor velocity to zero so it collides properly
        Matter.Body.setVelocity(playerSensor, {
            x: 0,
            y: 0
        });
        //move sensor to below the player
        Body.setPosition(playerSensor, {
            x: player.position.x,
            y: player.position.y + playerRadius
        });
    };
});
  
Events.on(engine, "beforeUpdate", function() {
  if (player && playerSensor) {
    game.cycle++;
    console.log(`Player Grounded: ${player.ground}, JumpCD: ${player.jumpCD}`);
    // Jump
    if (keys["ArrowUp"] && player.ground && player.jumpCD < game.cycle) {
        console.log("Jumping!");
        player.jumpCD = game.cycle + 1; // Adds a cooldown to jump
        Body.applyForce(player, player.position, { x: 0, y: -0.02 });
    } else if (keys["ArrowUp"] && !player.ground) {
        console.log("Jump attempt failed, player is not grounded.");
    }
    // Horizontal movement
    const moveForce = 0.005; // Adjust for movement speed

    if (keys["ArrowLeft"]) {
        console.log("Moving left!");
        Body.applyForce(player, player.position, { x: -moveForce, y: 0 });
    } else if (keys["ArrowRight"]) {
        console.log("Moving right!");
        Body.applyForce(player, player.position, { x: moveForce, y: 0 });
    }
  }
 });
  
  // Add player and collision sensor to world
  World.add(engine.world, [player, playerSensor]);

  // run the engine
  var runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
  
  // run the renderer
  Render.run(render);
  