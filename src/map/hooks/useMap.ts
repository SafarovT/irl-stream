import {AbstractMap} from '../AbstractMap'
import {useEffect, useRef} from 'react'
import {MapOSM} from '../mapOSM'

function initMap(map: AbstractMap, containerID: string) {
	map.SetTarget(containerID)
}

function useMap(containerID: string): AbstractMap {
	const mapRef = useRef(new MapOSM())
	useEffect(() => {
		initMap(mapRef.current, 'map')
	}, [])

	return mapRef.current
}

export {
	useMap,
}
