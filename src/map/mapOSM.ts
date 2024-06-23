import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import {fromLonLat, transformExtent} from 'ol/proj'
import {LineString, Point} from 'ol/geom'
import {Feature, Map, View} from 'ol'
import type {Coord, MapObjects} from '../model/types/map'
import {AbstractMap} from './AbstractMap'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

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

	public Clear(): void {
		const layers = this.map.getAllLayers()
		for (let i = 1; i < layers.length; i++) {
			this.map.removeLayer(layers[i])
		}
	}

	public DisplayMapObjects(objects: MapObjects): void {
		this.Clear()
		const features: Array<Feature> = []
		objects.nodes.forEach(node => {
			const point = new Point(fromLonLat([node.coord.lon, node.coord.lat]))
			features.push(new Feature({
				geometry: point,
			}))
		})

		objects.ways.forEach(way => {
			const line = new LineString(way.geometry.map(point => fromLonLat([point.lon, point.lat])))
			features.push(new Feature({
				geometry: line,
			}))
		})

		const vectorLayer = new VectorLayer({
			source: new VectorSource({
				features,
			}),
		})

		this.map.addLayer(vectorLayer)
	}
}

export {
	MapOSM,
}
