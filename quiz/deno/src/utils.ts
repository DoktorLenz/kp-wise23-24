import dir from '@dir';

export const dataDir = `${dir('data')}/quiz`;

export function clearConsole() {
	console.log('\x1Bc');
}
