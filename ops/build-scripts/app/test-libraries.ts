import * as sh from 'shelljs'
import * as util from 'util'
import * as fs from 'fs'
import * as path from 'path'

const testResultsFilename = '__test-results.json'

const cwd = process.cwd()

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
		sh.echo(`${name}: Tests ran successfully`)
	} else if (passedTests === totalTests) {
		sh.echo(`${name}: Coverage failed to meet minimum threshold`)
	} else {
		sh.echo(`${name}: Tests Failed`)
	}
}

interface Package {
	name: string
}


const retrieveUpdatedPackagesInNamespace = (namespace: string): Array<Package> | false => {
	const {
		stdout,
		stderr,
		code,
	} = sh.exec(`yarn --silent lerna updated --scope ${namespace} --json`)

	if (code !== 0) {
		sh.echo('No packages need updating...')
		sh.echo('or failed =/')
		return false
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
	sh.cd(cwd)

	// If empty string, exit early.
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

	await sh.exec(`rm ${packageDir}/${testResultsFilename}`)

	return {
		name: pkg.name,
		success,
		totalTests: numTotalTests,
		passedTests: numPassedTests,
	}
}

export const test = (namespace: string): void => {
	const packages = retrieveUpdatedPackagesInNamespace(namespace)

	if (!packages) {
		sh.echo(`No Results for ${namespace}`)
		return
	}

	Promise.all(packages.map(runTest))
		.then((results) => {
			sh.echo('/* =======  <Test Results>  =========== */')
			sh.echo('')
			results.forEach(printResults)
			sh.echo('')
			sh.echo('/* =======  </ Test Results>  =========== */')
		})
}
