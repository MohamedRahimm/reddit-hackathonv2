import Matter from "matter-js";
import { Tiles, levelData, TILE_SIZE } from "../Level/levelGen";

const doorPos = findDoorPosition(levelData);
const playerX: number = doorPos.x * TILE_SIZE + TILE_SIZE / 2;
const playerY: number = doorPos.y * TILE_SIZE + TILE_SIZE / 2;

const Body = Matter.Body;
const Bodies = Matter.Bodies;

//Extends the Matter.Body class to add custom properties
interface PlayerBody extends Matter.Body {
    ground: boolean;
    jumpCD: number;
  }

export const playerRadius: number = 25;
export const player = Bodies.rectangle(playerX, playerY, playerRadius, playerRadius, {
    label: "character",
    density: 0.001,
    friction: 0,
    frictionStatic: 0,
    frictionAir: 0,
    restitution: 0,
    inertia: Infinity,
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

player.ground = false;
player.jumpCD = 0;

  // onGround sensor for jumping
  export var playerSensor = Bodies.rectangle(0, 0, playerRadius, 5, {
    label: "sensor",
    isSensor: true,
    render:{
      visible: false
    },
  })
  playerSensor.collisionFilter.group = -1

function findDoorPosition(levelData: Tiles[][]): { x: number, y: number } {
    for (let row = 0; row < levelData.length; row++) {
        for (let col = 0; col < levelData[row].length; col++) {
            if (levelData[row][col] === Tiles.Door) {
                // Return the position of the door (row, col)
                return { x: col, y: row };
            }
        }
    }
    // If no door is found, return a default position
    return { x: 0, y: 0 };
}