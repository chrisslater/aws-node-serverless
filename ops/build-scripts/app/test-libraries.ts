import * as sh from 'shelljs'
import * as util from 'util'
import * as fs from 'fs'
import * as path from 'path'

const testResultsFilename = '__test-results.json'

interface TestResults {
	name: string
	success: boolean
	totalTests: number
	passedTests: number
}

const printResults = ({
	name,
	success,
	totalTests,
	passedTests
}: TestResults): void => {
	if (success) {
		console.log(`${name}: Tests ran successfully`)
		sh.echo(`${name}: Tests ran successfully`)
	} else if (passedTests === totalTests) {
		console.log(`${name}: Coverage failed to meet minimum threshold`)
		sh.echo(`${name}: Coverage failed to meet minimum threshold`)
	} else {
		// else Tests failed
		console.log(`${name}: Tests Failed`)
		sh.echo(`${name}: Tests Failed`)
	}
}

interface Package {
	name: string
}


const retrieveUpdatedPackagesInNamespace = (namespace: string): Array<Package> => {
	const {
		stdout,
		stderr,
		code,
	} = sh.exec(`yarn --silent lerna updated --scope @snapperfish/${namespace}-* --json`)

	if (code !== 0) {
		sh.echo('No packages need updating...')
		sh.echo('or failed =/')
		sh.exit(0)
	}

	return JSON.parse(stdout as string) as Array<Package>
}

const getPackageDirectory = (name: string): string => {
	if (!name) {
		throw new Error('No name given')
	}

	let { stdout }: { stdout: string } =
		sh.exec(`yarn --silent lerna exec --scope ${name} "pwd"`)

	return stdout.trim()
}

const runTest = async (pkg: Package): Promise<TestResults> => {
	sh.echo(`START: ${pkg.name} tests`)

	const packageDir = getPackageDirectory(pkg.name)

	sh.cd(packageDir)

	// run tests and output result as object
	await sh.exec(`yarn test --json --outputFile=\"${testResultsFilename}\"`)

	const fileRequirePath = path.join(packageDir, testResultsFilename)
	const {
		success,
		numPassedTests,
		numTotalTests,
	} = require(fileRequirePath)

	await sh.exec(`rm ${testResultsFilename}`)

	return {
		name: pkg.name,
		success,
		totalTests: numTotalTests,
		passedTests: numPassedTests,
	}
}

export const run = async () => {
	const packages: Array<Package> = retrieveUpdatedPackagesInNamespace('library')
	const results = await Promise.all(packages.map(runTest))

	results.forEach(printResults)
}
