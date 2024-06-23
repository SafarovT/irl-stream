import {useAction, useAtom} from "@reatom/npm-react"
import {useEffect} from "react"
import {modelActions, modelAtoms} from "../../../model/model"
import type {AbstractMap} from "../../../map/AbstractMap"

function useControls(map: AbstractMap) {
    const [sourcePoint] = useAtom(modelAtoms.sourcePointIdAtom)
    const [sinkPoint] = useAtom(modelAtoms.sinkPointIdAtom)

    const initLeps = useAction(modelActions.initLEPs)
    const findFlow = useAction(modelActions.findFlow)
    const resetPoints = useAction(modelActions.clearKeyPoints)
    
    useEffect(() => {
        window.addEventListener('keydown', event => {
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
        })
    }, [])

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
