import {useAtom} from "@reatom/npm-react"
import type {AbstractMap} from "../../../map/AbstractMap"
import {modelAtoms} from "../../../model/model"

function useMapObjectsVisualization(map: AbstractMap) {
    const [mapObjects] = useAtom(modelAtoms.mapDataAtom)

    if (mapObjects !== null) {
        map.DisplayMapObjects(mapObjects)
    }
}

export {
    useMapObjectsVisualization,
}