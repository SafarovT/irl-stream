import {
	action,
	atom,
} from '@reatom/framework'
import {reatomAsync} from '@reatom/async'
import type {BBox, MapObjects} from './types/map'
import {getOSMData} from './osmDataHandling/getOSMData'

const mapData = atom<MapObjects | null>(null)

const getLEPs = reatomAsync(async (ctx, bbox: BBox) => {
	// TODO: сделать атом загрузки, для отображения прелоудера
	return await getOSMData(bbox)
}, {
	name: 'getLEPs',
	onFulfill(ctx, result) {
		mapData(ctx, result)
	},
	onReject(ctx, err) {
		alert('Ошибка ')
	},
})

const modelAtoms = {
	mapData,
}

const modelActions = {
	getLEPs,
}

export {
	modelActions,
	modelAtoms,
}
