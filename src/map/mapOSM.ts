import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import {fromLonLat, transformExtent} from 'ol/proj'
import {LineString, Point} from 'ol/geom'
import {Feature, Map, View} from 'ol'
import type {Coord, MapObjects} from '../model/types/map'
import {AbstractMap} from './AbstractMap'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'

const DEFAULT_WAY_COLOR = '#0047AB'
const DISABLED_WAY_COLOR = '#FF6161'
const DEFAULT_POINT_COLOR = '#FFFFFF'
const BORDER_COLOR = '#000000'

const NODE_NAME = 'Node'
const WAY_NAME = 'Way'
const SEARCH_RANGE = 2000

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

	public AddOnClick(callback: (id: string) => void): void {
        this.map.on('click', event => {
			const layers = this.map.getAllLayers()
			if (layers.length > 1) {
				console.log('clicked')
				const vectorSource = layers[1].getSource() as VectorSource
				const coordinate = this.map.getEventCoordinate(event.originalEvent)
				const d = SEARCH_RANGE / 2
				const closestFeatures = vectorSource.getFeaturesInExtent([coordinate[0] - d, coordinate[1] - d, coordinate[0] + d, coordinate[1] + d])
				console.log(closestFeatures.map(f => f.getProperties().name))
				const feature = closestFeatures.find(feature => feature.getProperties().name === NODE_NAME)
				if (feature) {
					callback(feature.getProperties().id)
				}
			}
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
				id: node.id,
				name: NODE_NAME,
			}))
			features[features.length - 1].setStyle(new Style({
				image: new Circle({
					radius: 3,
					fill: new Fill({
						color: DEFAULT_POINT_COLOR,
					}),
					stroke: new Stroke({
						width: 1,
						color: BORDER_COLOR,
					})
				})
			}))
		})

		objects.ways.forEach(way => {
			const line = new LineString(way.geometry.map(point => fromLonLat([point.lon, point.lat])))
			if (way.capacity === 0) {
				features.push(new Feature({
					geometry: line,
					name: WAY_NAME,
				}))
				features[features.length - 1].setStyle(new Style({
					stroke: new Stroke({
						width: 2,
						color: DISABLED_WAY_COLOR,
					})
				}))
			}
			else {
				features.push(new Feature({
					geometry: line,
					name: WAY_NAME,
				}))
				features[features.length - 1].setStyle(new Style({
					stroke: new Stroke({
						width: 2,
						color: DEFAULT_WAY_COLOR,
					})
				}))
			}
		})

		const vectorLayer = new VectorLayer({
			source: new VectorSource({
				features,
			}),
		})

		this.map.addLayer(vectorLayer)
		this.map.addLayer(new VectorLayer({
			source: new VectorSource(),
		}))
	}

	public AddPoints(coords: Coord[], colors: string[]): void {
		const layers = this.map.getAllLayers()
		if (layers.length >= 3) {
			const layer = layers[2] as VectorLayer<VectorSource>
			layer.setSource(new VectorSource({
				features: coords.map((coord, i) => {
					const feature = new Feature({
						geometry: new Point(fromLonLat([coord.lon, coord.lat]))
					})
					feature.setStyle(new Style({
						image: new Circle({
							radius: 7,
							fill: new Fill({
								color: colors[i],
							}),
							stroke: new Stroke({
								width: 1,
								color: BORDER_COLOR,
							})
						})
					}))
					return feature
				})
			}))
		}
	}
}

export {
	MapOSM,
}
