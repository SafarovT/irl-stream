import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import {transformExtent} from 'ol/proj'
import {Map, View} from 'ol'
import type {Coord} from '../model/types/map'
import {AbstractMap} from './AbstractMap'

class MapOSM extends AbstractMap {
	private map: Map

	constructor() {
		super()
		const osmLayer = new TileLayer({
			preload: Infinity,
			source: new OSM(),
		})

		this.map = new Map({
			target: undefined,
			layers: [osmLayer],
			view: new View({
				center: [5331435, 7683552],
        		zoom: 10,
			}),
		})
	}

	public SetTarget(target: string | HTMLElement | undefined) {
		this.map.setTarget(target)
	}

	public SetView(center: Coord, zoom: number) {
		this.map.getView().setCenter([center.lat, center.lon])
		this.map.getView().setZoom(zoom)
	}

	public GetBouds() {
		const bbox = transformExtent(this.map.getView().calculateExtent(this.map.getSize()), 'EPSG:3857', 'EPSG:4326')

		return {
			p1: {
				lat: bbox[1],
				lon: bbox[0],
			},
			p2: {
				lat: bbox[3],
				lon: bbox[2],
			},
		}
	}
}

export {
	MapOSM,
}
