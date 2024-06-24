import * as React from 'react'
import './Legend.css'

type LegendProps = {
    flows: {
        capacity: number,
        color: string,
    }[],
}

function Legend(props: LegendProps) {
    const {
        flows,
    } = props

    return (
        <div className='legend'>
            {flows.map((flow, index) => <div className="legend__item" key={index}>
                <div className="legend__label">Поток: {flow.capacity}</div>
                <div
                    className="legend__info"
                    style={{
                        backgroundColor: flow.color,
                    }}
                ></div>
            </div>)}
        </div>
    )
}

export {
    Legend,
}
