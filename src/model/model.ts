import {
	action,
	atom,
} from '@reatom/framework'

// TODO: перевести на настоящие данные

const initState = localStorage.getItem('irl-stream') ?? ''

const testDataAtom = atom(initState, 'testDataAtom')

const testDataSubAtom = atom((ctx) => {
	const data = ctx.spy(testDataAtom)
	return data ? `Test data = ${data}` : ''
}, 'testDataSubAtom')

const setTestData = action((ctx, data: string) => {
	testDataAtom(ctx, data)
}, 'setTestData')

const modelAtoms = {
	testDataAtom,
	testDataSubAtom,
}

const modelActions = {
	setTestData,
}

export {
	modelActions,
	modelAtoms,
}
