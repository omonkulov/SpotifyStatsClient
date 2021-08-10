import React from 'react'
import { PieChart } from 'react-minimal-pie-chart';

import { useState, useEffect } from 'react';

export default function DonutChart({ chartTitle, chartValue }) {

    //Default values
    let defaultValue = 0

    //percentage is how much of the donut pie is revealed
    const [percentage, setPercentage] = useState({ chartTitle, chartValue })

    //If no props provided, dont use title and value
    if (chartValue === undefined || isNaN(chartValue)) chartValue = defaultValue;

    useEffect(() => {
        setPercentage({ chartValue, chartTitle })
        return
    }, [chartValue, chartTitle])
    return (
        <div className="pie-chart-container p-2">
            <PieChart
                data={[
                    { title: '', value: 100, color: '#1DB954' },
                    { title: percentage.chartTitle, value: 0, color: 'white' },
                ]}

                lineWidth={22}
                startAngle={270}
                totalValue={100}
                rounded
                label={({ x, y, dx, dy, dataEntry }) => {
                    let title = percentage.chartValue + '%';
                    if (dataEntry.value === 0) {
                        y = y - 9
                        title = dataEntry.title
                    } else {
                        y = y + 11
                    }
                    return (<text
                        key={dataEntry.value}
                        x={x}
                        y={y}
                        dx={dx}
                        dy={dy}
                        dominantBaseline="central"
                        textAnchor="middle"
                        style={{
                            fontSize: 15,
                            fontFamily: 'Proxima',
                            fill: "white",
                        }}
                    >
                        {title}
                    </text>)
                }}
                background="#282828"
                labelPosition={0}
                animate={true}
                reveal={percentage.chartValue}
            />
        </div>
    )
}