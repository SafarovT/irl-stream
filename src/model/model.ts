import {
	action,
	atom,
} from '@reatom/framework'
import {reatomAsync} from '@reatom/async'
import type {BBox, MapObjects, Coord} from './types/map'
import {getOSMData} from './osmDataHandling/getOSMData'
import {Graph} from './graph/Graph'

type Flows = {
	maxFlow: number,
	flows: Array<Flow>,
}

type Flow = {
	capacity: number,
	geometry: Array<Coord>,
}

const mapDataAtom = atom<MapObjects | null>(null)
const flowAtom = atom<Flows | null>(null)

const sourcePointIdAtom = atom<string | null>(null)
const sinkPointIdAtom = atom<string | null>(null)

const initLEPs = reatomAsync(async (ctx, bbox: BBox) => {
	// TODO: сделать атом загрузки, для отображения прелоудера
	return await getOSMData(bbox)
}, { 
	name: 'getLEPs',
	onFulfill(ctx, result) {
		flowAtom(ctx, null)
		sourcePointIdAtom(ctx, null)
		sinkPointIdAtom(ctx, null)
		mapDataAtom(ctx, result)
	},
	onReject(ctx, err) {
		alert('Ошибка')
	},
})

const findFlow = action((ctx) => {
	const mapData = ctx.get(mapDataAtom)
	const source = ctx.get(sourcePointIdAtom)
	const sink = ctx.get(sinkPointIdAtom)
	if (mapData && source && sink) {
		let sourceIndex = -1
		let sinkIndex = -1
		const graph = new Graph(mapData.nodes.length)
		mapData.nodes.forEach((node, index) => {
			graph.AddVertexData(index, node.id)
			if (node.id === source) {
				sourceIndex = index
			}
			else if (node.id === sink) {
				sinkIndex = index
			}
		})
		mapData.ways.forEach(way => {
			const fromIndex = mapData.nodes.findIndex(node => node.id === way.p1)
			const toIndex = mapData.nodes.findIndex(node => node.id === way.p2)
			if (fromIndex !== -1 && toIndex !== -1) {
				graph.AddEdge(fromIndex, toIndex, way.capacity)
				graph.AddEdge(toIndex, fromIndex, way.capacity)
			}
		})
		
		if (sourceIndex !== -1 && sinkIndex !== -1) {
			const result = graph.EdmondKarp(sourceIndex, sinkIndex)

			flowAtom(ctx, {
				maxFlow: result.maxFlow,
				flows: result.flows.map(flow => {
					let geometry: Array<Coord> = []
					let i = 1
					while (i < flow.path.length) {
						let g: Array<Coord> = []
						const wF = mapData.ways.find(way => (way.p1 === flow.path[i - 1]) && (way.p2 === flow.path[i]))
						if (wF) {
							g = wF.geometry
						}
						const wR = mapData.ways.find(way => (way.p2 === flow.path[i - 1]) && (way.p1 === flow.path[i]))
						if (wR) {
							g = wR.geometry.reverse()
						}
						if (g.length) {
							g.forEach(v => geometry.push(v))
						}
						i++
					}
					return {
						capacity: flow.capacity,
						geometry,
					}
				}),
			})
		}
	}
})

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
	flowAtom(ctx, null)
})

const modelAtoms = {
	mapDataAtom,
	sourcePointIdAtom,
	sinkPointIdAtom,
	flowAtom,
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

export type {
	Flows,
	Flow,
}
