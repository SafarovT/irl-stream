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

    const isAbleToFindFlow =  isSourcePointSelected && isSinkPointSelected
    const isAbleToReset = isSourcePointSelected || isSinkPointSelected

    return (
        <div className="controls">
            <div className="controls__main-buttons-container">
                <Button
                    text="Получить данные"
                    onClick={initLeps}
                />
                {isAbleToFindFlow && <Button
                    text="Поиск потока"
                    onClick={findFlow}
                    style='secondary'
                />}
            </div>
            <div className="points-block">
                <div className="points-block__points-container">
                    <div className="points-container__point">
                        <Indicator
                            active={isSourcePointSelected}
                            index={0}
                        />
                    </div>
                    <div className="points-container__point">
                        <Indicator
                            active={isSinkPointSelected}
                            index={1}
                        />
                    </div>
                </div>
                {isAbleToReset && <Button
                    text="Сбросить точки"
                    onClick={resetPoints}
                />}
            </div>
        </div>
    )
}

// <div className="points-container__text">Сток: </div>

export {
    Controls
}