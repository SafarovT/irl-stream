import * as React from 'react'
import './Indicator.css'

type IndicatorProps = {
    active: boolean,
    index: number,
}

function GetIndicatorColor(index: number): string {
    switch (index) {
    case 0:
        return '#00E600'
    case 1:
        return '#FF053F'
    default:
        return '#000000'
    }
}

const Indicator = (props: IndicatorProps) => {
    const {
        active,
        index,
    } = props

    const color = active ? GetIndicatorColor(index) : 'rgba(0, 0, 0, 0)'

    return (
        <div
            className="indicator"
            style={{
                backgroundColor: color
            }}    
        >
        </div>
    )
}

export {
    Indicator,
    GetIndicatorColor,
}