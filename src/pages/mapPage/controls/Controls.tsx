import * as React from 'react'
import {Button} from '../../../components/button/Button'
import {Indicator} from '../../../components/indicator/Indicator'
import type {AbstractMap} from '../../../map/AbstractMap'
import './Controls.css'
import {useControls} from './useControls'

type ControlsProps = {
    map: AbstractMap,
}

const Controls = (props: ControlsProps) => {
    const {
        initLeps,
        findFlow,
        resetPoints,
        isSourcePointSelected,
        isSinkPointSelected,
    } = useControls(props.map)

    return (
        <div className="controls">
            <Button
                text="Получить электросети"
                onClick={initLeps}
            />
            <PointsBlock
                onResetPoints={resetPoints}
                onFindFlow={findFlow}
                isSourcePointSelected={isSourcePointSelected}
                isSinkPointSelected={isSinkPointSelected}
            />
            
        </div>
    )
}

type PointsBlockProps = {
    onFindFlow: () => void,
    onResetPoints: () => void,
    isSourcePointSelected: boolean,
    isSinkPointSelected: boolean,
}

const PointsBlock = (props: PointsBlockProps) => {
    const {
        onFindFlow,
        onResetPoints,
        isSourcePointSelected,
        isSinkPointSelected,
    } = props
    const isAbleToFindFlow =  isSourcePointSelected && isSinkPointSelected
    const isAbleToReset = isSourcePointSelected || isSinkPointSelected

    return (
        <div className="points-block">
            <div className="points-block__points-container">
                <Indicator
                    active={isSourcePointSelected}
                    index={0}
                />
                <Indicator
                    active={isSinkPointSelected}
                    index={1}
                />
            </div>
            {isAbleToReset && <Button
                text="Сбросить точки"
                onClick={onResetPoints}
            />}
            {isAbleToFindFlow && <Button
                text="Найти наибольший поток"
                onClick={onFindFlow}
            />}
        </div>
    )
}

export {
    Controls
}