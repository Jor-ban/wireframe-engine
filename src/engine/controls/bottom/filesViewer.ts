//requiring path and fs modules
const readdirGlob = require('readdir-glob');
//joining path of directory

export class FilesViewer {
	constructor() {
		const globber = readdirGlob('.', {pattern: '**/*.js'});
		globber.on('match', (match: any) => {
			console.log(match)
		});
		globber.on('error', (err: any) => {
			console.error('fatal error', err);
		});
		globber.on('end', (m: any) => {
			console.log('done');
		});
	}
}