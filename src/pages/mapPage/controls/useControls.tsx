import {useAction, useAtom} from "@reatom/npm-react"
import {useLayoutEffect, useEffect} from "react"
import {modelActions, modelAtoms} from "../../../model/model"
import type {AbstractMap} from "../../../map/AbstractMap"
import {GetIndicatorColor} from "../../../components/indicator/Indicator"
import type {Coord} from "../../../model/types/map"

function useControls(map: AbstractMap) {
    const [mapDataAtom] = useAtom(modelAtoms.mapDataAtom)
    const [sourcePoint] = useAtom(modelAtoms.sourcePointIdAtom)
    const [sinkPoint] = useAtom(modelAtoms.sinkPointIdAtom)

    const initLeps = useAction(modelActions.initLEPs)
    const findFlow = useAction(modelActions.findFlow)
    const resetPoints = useAction(modelActions.clearKeyPoints)
    const setKeyPoint = useAction(modelActions.setKeyPoint)

    useEffect(() => {
        if (mapDataAtom) {
            const points: Array<Coord> = []
            const colors = []
            if (sourcePoint) {
                colors.push(GetIndicatorColor(0))
                const node = mapDataAtom.nodes.find(node => node.id === sourcePoint)
                if (node) {
                    points.push(node.coord)
                }
            }
            if (sinkPoint) {
                colors.push(GetIndicatorColor(1))
                const node = mapDataAtom.nodes.find(node => node.id === sinkPoint)
                if (node) {
                    points.push(node.coord)
                }
            }
            map.AddPoints(points, colors)
        }
    }, [sourcePoint, sinkPoint, map, mapDataAtom])
    
    useLayoutEffect(() => {
        const callback = (event: KeyboardEvent) => {
            if (!event.defaultPrevented) {
                if (event.code === 'Escape') {
                    event.preventDefault()
                    resetPoints()
                }
                else if (event.code === 'Enter') {
                    event.preventDefault()
                    findFlow()
                }
            }
        }
        window.addEventListener('keydown', callback)
        map.AddOnClick(setKeyPoint)

        return () => {
            window.removeEventListener('keydown', callback)
        }
    }, [findFlow, map, resetPoints, setKeyPoint])

    return {
        initLeps: () => {
            initLeps(map.GetBouds())
        },
        findFlow,
        resetPoints,
        isSourcePointSelected: sourcePoint !== null,
        isSinkPointSelected: sinkPoint !== null,
    }
}

export {
    useControls,
}
