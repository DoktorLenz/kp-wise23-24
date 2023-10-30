import { Cli } from './cli.ts';
import { Environment } from '../src/environment.ts';
import * as log from 'https://deno.land/std@0.204.0/log/mod.ts';

await log.setup({
	handlers: {
		console: new log.handlers.ConsoleHandler('DEBUG'),
	},
	loggers: {
		'std': {
			level: 'DEBUG',
			handlers: ['console'],
		},
	},
});

const environment = new Environment(new Cli());

await environment.loadTsCommands();
environment.run();
