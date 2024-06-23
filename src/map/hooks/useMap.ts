import type {AbstractMap} from '../AbstractMap'
import {useEffect, useRef} from 'react'
import {MapOSM} from '../MapOSM'

function initMap(map: AbstractMap, containerID: string) {
	map.SetTarget(containerID)
}

function useMap(containerID: string): AbstractMap {
	const mapRef = useRef(new MapOSM())
	useEffect(() => {
		initMap(mapRef.current, containerID)
	}, [containerID])

	return mapRef.current
}

export {
	useMap,
}
