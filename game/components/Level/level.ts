import Matter from "matter-js";
  
function rotateVector(vector, angle) {
    return {
      x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
      y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
    }
  }
  
  
  //game objects values
  var game = {
    cycle: 0,
    width: 1200,
    height: 800,
  }
  
  var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Events = Matter.Events,
    Body = Matter.Body,
    //Composites = Matter.Composites,
    Bodies = Matter.Bodies;
  
  // create an engine
  var engine = Engine.create();
  
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: 1,
      background: 'rgba(255, 0, 0, 0.0)',
      wireframeBackground: '#222',
    //   enabled: true,
      wireframes: false,
      showVelocity: false,
      showAngleIndicator: true,
      showCollisions: false,
    }
  });
  
  //add the walls
  var offset = 5;
  World.add(engine.world, [
    Bodies.rectangle(400, -offset, game.width * 2 + 2 * offset, 50, {
      isStatic: true
    }),
    Bodies.rectangle(400, game.height + offset, game.width * 2 + 2 * offset, 50, {
      isStatic: true
    }),
    Bodies.rectangle(game.width + offset, 300, 50, game.height * 2 + 2 * offset, {
      isStatic: true
    }),
    Bodies.rectangle(-offset, 300, 50, game.height * 2 + 2 * offset, {
      isStatic: true
    })
  ]);
  
  // add some ramps to the world for the bodies to roll down
  World.add(engine.world, [
    //Bodies.rectangle(200, 150, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }),
    Bodies.rectangle(620, 270, 1000, 50, {
      isStatic: true,
      angle: -Math.PI * 0.1
    }),
    Bodies.rectangle(260, 780, 700, 300, {
      isStatic: true,
      angle: Math.PI * 0.15
    }),
    Bodies.rectangle(1050, 750, 600, 100, {
      isStatic: true,
      //angle: -Math.PI * 0.1
    }),
  ]);
  
  //adds some balls
  for(var i = 0; i<35;i++){
    World.add(engine.world, Bodies.circle(400,200,Math.ceil(6+Math.random()*22),{
      density: 0.0005,
      friction: 0,//0.05,
      frictionStatic: 0.5,
      frictionAir: 0.001,
      restitution: 0.5,
      render:{
        strokeStyle:'darkgrey',
        fillStyle:'grey'
      },
    })
  )}
  
  //add the player
  //Extends the Matter.Body class to add custom properties
  interface PlayerBody extends Matter.Body {
    ground: boolean;
    jumpCD: number;
  }

  const playerRadius = 25;
  var player = Bodies.circle(800, game.height - 200, playerRadius, {
    density: 0.001,
    friction: 0.7,
    frictionStatic: 0,
    frictionAir: 0.005,
    restitution: 0.3,
    collisionFilter: {
        category: 1,
        group: 1,
        mask: 1,
    },
    render: {
        strokeStyle: 'black',
        fillStyle: 'lightgrey',
    },
}) as PlayerBody;
// Sets custom PlayerBody class properties
player.ground = false;
player.jumpCD = 0;

  
  
  //this sensor check if the player is on the ground to enable jumping
  var playerSensor = Bodies.rectangle(0, 0, playerRadius, 5, {
    isSensor: true,
    render:{
      visible: false
    },
    //isStatic: true,
  })
  playerSensor.collisionFilter.group = -1
  
  //populate world
  World.add(engine.world, [player, playerSensor]);
  
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
  
  function playerGroundCheck(event, ground) { //runs on collisions events
    var pairs = event.pairs
    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];
      if (pair.bodyA === playerSensor) {
        player.ground = ground;
      } else if (pair.bodyB === playerSensor) {
        player.ground = ground;
      }
    }
  }
  
  
  
  //at the start of a colision for player
  Events.on(engine, "collisionStart", function(event) {
    playerGroundCheck(event, true)
  });
  //ongoing checks for collisions for player
  Events.on(engine, "collisionActive", function(event) {
    playerGroundCheck(event, true)
  });
  //at the end of a colision for player set ground to false
  Events.on(engine, 'collisionEnd', function(event) {
    playerGroundCheck(event, false);
  })
  
  Events.on(engine, "afterTick", function(event) {
    //set sensor velocity to zero so it collides properly
    Matter.Body.setVelocity(playerSensor, {
        x: 0,
        y: 0
      })
      //move sensor to below the player
    Body.setPosition(playerSensor, {
      x: player.position.x,
      y: player.position.y + playerRadius
    });
  });
  
Events.on(engine, "beforeUpdate", function(event) {
    game.cycle++;
    console.log(`Player Grounded: ${player.ground}, JumpCD: ${player.jumpCD}`);
    // Jump
    if (keys["ArrowUp"] && player.ground && player.jumpCD < game.cycle) {
        console.log("Jumping!");
        player.jumpCD = game.cycle + 10; // Adds a cooldown to jump
        Body.applyForce(player, player.position, { x: 0, y: -0.07 });
        console.log("Applied jump force: {x: 0, y: -0.07}");
    } else if (keys["ArrowUp"] && !player.ground) {
        console.log("Jump attempt failed, player is not grounded.");
    }
    // Spin left and right
    const moveForce = 0.005; // Adjust for speed control

    if (keys["ArrowLeft"]) {
        console.log("Moving left!");
        Body.applyForce(player, player.position, { x: -moveForce, y: 0 });
        console.log("Applied leftward force: {x: -moveForce, y: 0}");
    } else if (keys["ArrowRight"]) {
        console.log("Moving right!");
        Body.applyForce(player, player.position, { x: moveForce, y: 0 });
        console.log("Applied rightward force: {x: moveForce, y: 0}");
    }
  });
  
  // run the engine
  var runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
  
  // run the renderer
  Render.run(render);
  