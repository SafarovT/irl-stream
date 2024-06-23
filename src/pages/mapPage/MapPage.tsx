import * as React from 'react'
import {useAction} from '@reatom/npm-react'
import {useMap} from '../../map/hooks/useMap'
import {modelActions} from '../../model/model'
import {Controls} from './controls/Controls'
import './MapPage.css'

const MAP_ID = 'mapContainerElement'

const MapPage = () => {
    const getLEPs = useAction((ctx, data) => modelActions.getLEPs(ctx, data))
    const map = useMap(MAP_ID)

    return (
        <div className="map-page">
            <div
			    className="map"
			    id={MAP_ID}
		    ></div>
            <Controls
                onGetData={() => {
                    getLEPs(map.GetBouds())
                }}
                onCreateRoute={() => {}}
            />
        </div>
    )
}

export {
    MapPage,
}