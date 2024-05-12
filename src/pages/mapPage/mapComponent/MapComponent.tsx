import * as React from 'react'
import {useEffect} from 'react'
import {
	Map,
	View,
} from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import './MapComponent.css'
import 'ol/ol.css'

const MapComponent = () => {
	useEffect(() => {
		const osmLayer = new TileLayer({
			preload: Infinity,
			source: new OSM(),
		})

		const map = new Map({
			target: "map",
			layers: [osmLayer],
			view: new View({
				center: [0, 0],
				zoom: 0,
			}),
		});

		return () => map.setTarget(undefined)
	}, []);


	return (
		<div
			className="map"
			id="map"
		></div>
	)
}

export {
	MapComponent,
}