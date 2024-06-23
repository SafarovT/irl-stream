import {
	action,
	atom,
} from '@reatom/framework'
import {reatomAsync} from '@reatom/async'
import type {BBox, MapObjects} from './types/map'
import {getOSMData} from './osmDataHandling/getOSMData'

const mapDataAtom = atom<MapObjects | null>(null)

const initLEPs = reatomAsync(async (ctx, bbox: BBox) => {
	// TODO: сделать атом загрузки, для отображения прелоудера
	return await getOSMData(bbox)
}, { 
	name: 'getLEPs',
	onFulfill(ctx, result) {
		mapDataAtom(ctx, result)
	},
	onReject(ctx, err) {
		alert('Ошибка')
	},
})

const findFlow = action((ctx) => {
	console.log('findFlow')
})

const sourcePointIdAtom = atom<string | null>(null)
const sinkPointIdAtom = atom<string | null>(null)

const setKeyPoint = action((ctx, id: string) => {
	if (ctx.get(sourcePointIdAtom) === null) {
		sourcePointIdAtom(ctx, id)
	}
	else if (ctx.get(sinkPointIdAtom) === null) {
		sinkPointIdAtom(ctx, id)
	}
})

const clearKeyPoints = action((ctx) => {
	sourcePointIdAtom(ctx, null)
	sinkPointIdAtom(ctx, null)
})

const modelAtoms = {
	mapDataAtom,
	sourcePointIdAtom,
	sinkPointIdAtom,
}

const modelActions = {
	initLEPs,
	findFlow,
	setKeyPoint,
	clearKeyPoints,
}

export {
	modelActions,
	modelAtoms,
}
