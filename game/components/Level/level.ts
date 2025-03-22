// injects the player and level

import { engine, render, Render, runner, Runner, World } from '../../main';
import { player, playerSensor } from '../Player/character';
import { genLevelEditor } from './levelEditor';
import { generateLevel } from './levelGen';

const level = generateLevel();
World.add(engine.world, [...level, player, playerSensor]);
// this is temporary
genLevelEditor();
Runner.run(runner, engine);
Render.run(render);
