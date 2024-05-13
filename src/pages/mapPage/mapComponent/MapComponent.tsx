import * as React from 'react'
import './MapComponent.css'
import 'ol/ol.css'
import {useMap} from '../../../map/hooks/useMap'

const MAP_ID = 'map'

const MapComponent = () => {
	const map = useMap(MAP_ID)

	return (
		<div
			className="map"
			id={MAP_ID}
		></div>
	)
}

export {
	MapComponent,
}