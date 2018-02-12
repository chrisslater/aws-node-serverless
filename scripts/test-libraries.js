#!/usr/bin/env node

const {
	test
} = require('@snapperfish/build-scripts')

const libraryResults = test('@snapperfish/library-*')

const serviceResults = test('@snapperfish/service-*')