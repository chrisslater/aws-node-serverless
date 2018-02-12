const sh = require('shelljs')

const fs = require('fs')
const path = require('path')

const {
	stdout,
	stderr,
	code,
} = sh.exec('yarn --silent lerna updated --json', {
	silent: true
})

if (code !== 0) {
	console.log('No packages need updating...')
	console.log('or failed =/')
	return false;
}

const updated = JSON.parse(stdout)

console.log(updated)

const names = updated.map((package) => package.name)

const package = require('../lerna.json')

function packageServices(names) {
	const isDirectory = source => fs.lstatSync(source).isDirectory()
	const getDirectories = source =>
		fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)
	const servicesPath = path.join(__dirname, '../services')
	return getDirectories(servicesPath)
}

const dirs = packageServices(names)

const packages = dirs.map((dir) => require(path.join(dir, 'package.json')));

//