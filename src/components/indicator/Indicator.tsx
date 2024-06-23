import * as React from 'react'
import './Indicator.css'

type IndicatorProps = {
    active: boolean,
    index: number,
}

const Indicator = (props: IndicatorProps) => {
    const {
        active,
        index,
    } = props

    return (
        <div className={`indicator ${active && 'indicator_active-' + index.toString()}`}></div>
    )
}

export {
    Indicator,
}