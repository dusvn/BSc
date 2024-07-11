import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ChartComponent = ({ kWhValues, title }) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    const data = {
        labels: hours,
        datasets: [{
            label: title,
            data: kWhValues,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    };

    const options = {
        plugins: {
            tooltip: {
                enabled: false // Disable tooltips
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'black' // Change x-axis labels to black
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'black' // Change y-axis labels to black
                }
            }
        }
    };

    return (
        <div style={{width: '80%', margin: '0 auto'}}>
            <h2>{title}</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default ChartComponent;
