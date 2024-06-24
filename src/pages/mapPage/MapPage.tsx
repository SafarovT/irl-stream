import * as React from 'react'
import {useMap} from '../../map/hooks/useMap'
import {Controls} from './controls/Controls'
import './MapPage.css'
import {useMapObjectsVisualization} from './hooks/useMapObjectsVisualization'
import {Flow} from './flow/Flow'

const MAP_ID = 'mapContainerElement'

const MapPage = () => {
    const map = useMap(MAP_ID)
    useMapObjectsVisualization(map)

    return (
        <div className="map-page">
            <div
			    className="map"
			    id={MAP_ID}
		    ></div>
            <Controls
                map={map}
            />
            <Flow
                map={map}
            />
        </div>
    )
}

export {
    MapPage,
}