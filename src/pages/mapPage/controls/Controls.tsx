import * as React from 'react'
import {Button} from '../../../components/button/Button'
import './Controls.css'

type ControlsProps = {
    onGetData: () => void,
    onCreateRoute: () => void,
}

const Controls = (props: ControlsProps) => {
    const {
        onGetData,
        onCreateRoute,
    } = props

    return (
        <div className="controls">
            <Button
                text="Получить электросети"
                onClick={onGetData}
            />
            <Button
                text="Найти наибольший поток"
                onClick={onCreateRoute}
            />
        </div>
    )
}

export {
    Controls
}