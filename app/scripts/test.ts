#!/usr/bin/env node

import * as sh from 'shelljs'
import * as scripts from '@snapperfish/build-scripts'

sh.echo('starting...')

let failed = false

const libraryResults = scripts.test('@snapperfish/library-*')

const serviceResults = scripts.test('@snapperfish/service-*')

const processResults = (result) => {

	if (!result) {
		sh.echo('')
		sh.echo(`No Results for`)
		sh.echo('')
		return
	}

	printResults(result)

	if (!result.success) {
		failed = true
	}
}

const printResults = (result) => {
	sh.echo('')
	sh.echo(`* ====== Test Results ====== *`)
	sh.echo('')
	result.forEach(printResult)
	sh.echo('')
	sh.echo(`* ====== /Test Results ====== *`)
	sh.echo('')
}

const printResult = ({
	name,
	success,
	totalTests,
	passedTests
}: scripts.TestResults): void => {
	if (success) {
		sh.echo(`${name}: Tests ran successfully`)
	} else if (passedTests === totalTests) {
		sh.echo(`${name}: Coverage failed to meet minimum threshold`)
	} else {
		sh.echo(`${name}: Tests Failed`)
	}
}

Promise.all([libraryResults, serviceResults]).then((results) => {

	results.forEach(processResults)

	if (failed) {
		sh.echo('Some or all tests failed, please check report')
		return sh.exit(1)
	}

}).catch((err) => {
	console.log(err)
})