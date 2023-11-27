import { StateMaschine } from '@src/statemaschine/statemaschine.ts';
import { clearConsole } from '@src/utils.ts';

clearConsole();

const statemaschine = new StateMaschine();

statemaschine.start();
