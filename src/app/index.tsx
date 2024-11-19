"use client"

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Camera, Sun, Thermometer } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface EnergyData {
  timestamp: string;
  energy: number;
}

interface Device {
  id: string;
  name: string;
  type: 'thermostat' | 'camera' | 'light';
  currentState: 'on' | 'off';
}

interface Alert {
  id: string;
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'error' | 'danger';
}

const HomeEnergyManagementSystem = () => {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetchEnergyData();
    fetchDevices();
    fetchAlerts();
  }, []);

  const fetchEnergyData = async () => {
    const response = await fetch('/api/energy-data');
    const data = await response.json();
    setEnergyData(data);
  };

  const fetchDevices = async () => {
    const response = await fetch('/api/devices');
    const data = await response.json();
    setDevices(data);
  };

  const fetchAlerts = async () => {
    const response = await fetch('/api/alerts');
    const data = await response.json();
    setAlerts(data);
  };

  const controlDevice = async (deviceId: string, action: string) => {
    await fetch(`/api/devices/${deviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });
  };

  const chartData = {
    labels: energyData.map((d) => d.timestamp),
    datasets: [
      {
        label: 'Energy Usage (kWh)',
        data: energyData.map((d) => d.energy),
        borderColor: '#8884d8',
        backgroundColor: 'rgba(136, 132, 216, 0.2)',
      },
    ],
  };

  const chartOptions = {
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Home Energy Management System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Energy Consumption Card */}
        <Card>
          <Card.Header>
            <Card.Title>Energy Consumption</Card.Title>
          </Card.Header>
          <Card.Content>
            <Line data={chartData} options={chartOptions} />
          </Card.Content>
        </Card>

        {/* Connected Devices Card */}
        <Card>
          <Card.Header>
            <Card.Title>Connected Devices</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul>
              {devices.map((device) => (
                <li key={device.id} className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {device.type === 'thermostat' && <Thermometer size={24} />}
                    {device.type === 'camera' && <Camera size={24} />}
                    {device.type === 'light' && <Sun size={24} />}
                    <span className="ml-2">{device.name}</span>
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => controlDevice(device.id, device.currentState === 'on' ? 'off' : 'on')}
                  >
                    {device.currentState === 'on' ? 'Turn Off' : 'Turn On'}
                  </button>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>

        {/* Alerts Card */}
        <Card>
          <Card.Header>
            <Card.Title>Alerts</Card.Title>
          </Card.Header>
          <Card.Content>
            {alerts.map((alert) => (
              <Alert key={alert.id} variant="danger">
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default HomeEnergyManagementSystem;
