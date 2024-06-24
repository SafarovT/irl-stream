import * as React from 'react'
import {useAtom} from '@reatom/npm-react'
import {modelAtoms} from '../../../model/model'
import {Legend} from './Legend'
import {AbstractMap} from '../../../map/AbstractMap'

const COLORS = [
    '#EA4086',
    '#eac540',
    '#42ea40',
    '#8240ea',
    '#40c9ea',
    '#ff8021',
    '#aef615',
    '#9483fc',
    '#4bdea3',
    '#f8c93f',
    '#a72e55',
    '#1a9532',
    '#e4c778',
    '#90d6ed',
    '#c16830',
    '#83ac00',    
]

type FlowProps = {
    map: AbstractMap,
}

function Flow(props: FlowProps) {
    const {
        map
    } = props
    const [maxFlow] = useAtom(modelAtoms.flowAtom)
    
    if (maxFlow) {
        map.AddWays(maxFlow.flows.map(flow => flow.geometry), COLORS)
    }
    else {
        map.AddWays([], [])
    }

    return maxFlow
        ? <Legend
            flows={maxFlow.flows.map((flow, index) => ({
                capacity: flow.capacity,
                color: index < COLORS.length
                    ? COLORS[index]
                    : '#000000'
            }))}
        />
        : null
}

export {
    Flow,
}