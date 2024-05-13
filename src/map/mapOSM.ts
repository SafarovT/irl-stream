import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import {Map, View} from 'ol'
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
				center: [0, 0],
				zoom: 0,
			}),
		})
	}

	public SetTarget(target: string | HTMLElement | undefined) {
		this.map.setTarget(target)
	}
}

export {
	MapOSM,
}
