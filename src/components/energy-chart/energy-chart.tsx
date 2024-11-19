import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from '@/src/components/ui/card';
import { EnergyData } from '@/src/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface EnergyChartProps {
    data: EnergyData[];
}

export const EnergyChart: React.FC<EnergyChartProps> = ({ data }) => {
    const chartData = {
        labels: data.map((d) => d.timestamp),
        datasets: [
        {
            label: 'Energy Usage (kWh)',
            data: data.map((d) => d.energy),
            borderColor: '#8884d8',
            backgroundColor: 'rgba(136, 132, 216, 0.2)',
        },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
        legend: { display: true, position: 'top' as const },
        tooltip: { mode: 'index' as const, intersect: false },
        },
        scales: {
        x: { display: true, title: { display: true, text: 'Timestamp' } },
        y: { display: true, title: { display: true, text: 'Energy (kWh)' } },
        },
    };

    return (
        <Card>
        <Card.Header>
            <Card.Title>Energy Consumption</Card.Title>
        </Card.Header>
        <Card.Content>
            <Line data={chartData} options={options} />
        </Card.Content>
        </Card>
    );
};
