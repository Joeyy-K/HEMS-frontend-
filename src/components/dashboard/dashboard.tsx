"use client"

import React, { useState, useEffect } from 'react';
import { EnergyChart } from '../energy-chart/energy-chart';
import { Camera, Sun, Thermometer, Zap, AlertOctagon, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import { EnergyData, Device, Alert as AlertType } from '@/src/types';
import { fetchEnergyData, fetchDevices, fetchAlerts, controlDevice } from '@/src/lib/api';

export const Dashboard: React.FC = () => {
    const [energyData, setEnergyData] = useState<EnergyData[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [alerts, setAlerts] = useState<AlertType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [energy, deviceList, alertList] = await Promise.all([
                    fetchEnergyData(),
                    fetchDevices(),
                    fetchAlerts()
                ]);
                
                if (!Array.isArray(energy)) {
                    throw new Error('Energy data must be an array');
                }
                if (!Array.isArray(deviceList)) {
                    throw new Error('Device list must be an array');
                }
                if (!Array.isArray(alertList)) {
                    throw new Error('Alert list must be an array');
                }

                // Ensure each device has a currentState
                const sanitizedDevices = deviceList.map(device => ({
                    ...device,
                    currentState: device.currentState || 'off'
                }));

                setEnergyData(energy);
                setDevices(sanitizedDevices);
                setAlerts(alertList);
            } catch (err) {
                console.error('Dashboard data loading error:', err);
                setError(err instanceof Error ? err.message : 'An error occurred loading dashboard data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleDeviceControl = async (deviceId: string, currentState: string) => {
        try {
            const newState = currentState === 'on' ? 'off' : 'on';
            await controlDevice(deviceId, newState);
            
            setDevices(prevDevices => 
                prevDevices.map(device => 
                    device.id === deviceId 
                        ? { ...device, currentState: newState }
                        : device
                )
            );
        } catch (err) {
            console.error('Device control error:', err);
            setError(err instanceof Error ? err.message : 'Failed to control device');
        }
    };

    const getDeviceIcon = (type: Device['type']) => {
        switch (type) {
            case 'thermostat':
                return <Thermometer className="h-8 w-8 text-indigo-600" />;
            case 'camera':
                return <Camera className="h-8 w-8 text-teal-600" />;
            case 'light':
                return <Sun className="h-8 w-8 text-yellow-600" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-pulse w-16 h-16 bg-indigo-300 rounded-full flex items-center justify-center">
                        <Zap className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-xl text-indigo-800 animate-pulse">Loading smart home insights...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-gradient-to-br from-red-50 to-red-100 min-h-screen flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md shadow-lg">
                    <AlertOctagon className="h-6 w-6" />
                    <AlertTitle>System Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="px-6 py-8 sm:px-10 bg-gradient-to-r from-indigo-600 to-purple-600">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Smart Home Intelligence
                        </h1>
                        <p className="mt-2 text-indigo-100">Real-time insights and device management</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 p-6 sm:p-10">
                        {/* Energy Consumption Chart */}
                        <div className="md:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
                            {energyData.length > 0 ? (
                                <EnergyChart data={energyData} />
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    No energy data available
                                </div>
                            )}
                        </div>

                        {/* Devices Section */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-indigo-50 px-6 py-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-indigo-800">Connected Devices</h2>
                                    <ChevronRight className="h-5 w-5 text-indigo-600" />
                                </div>
                                {devices.length > 0 ? (
                                    <ul className="divide-y divide-gray-100">
                                        {devices.map((device) => (
                                            <li 
                                                key={device.id} 
                                                className="px-6 py-4 hover:bg-indigo-50 transition-colors flex items-center justify-between"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    {getDeviceIcon(device.type)}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{device.name}</p>
                                                        <p className={`text-sm ${
                                                            device.currentState === 'on' 
                                                                ? 'text-green-600' 
                                                                : 'text-red-600'
                                                        }`}>
                                                            {(device.currentState || 'off').toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => handleDeviceControl(device.id, device.currentState || 'off')}
                                                    variant={device.currentState === 'on' ? 'destructive' : 'default'}
                                                    className="px-3 py-1 text-xs"
                                                >
                                                    {device.currentState === 'on' ? 'Turn Off' : 'Turn On'}
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No devices connected
                                    </div>
                                )}
                            </div>

                            {/* Alerts Section */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-indigo-50 px-6 py-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-indigo-800">System Alerts</h2>
                                    <ChevronRight className="h-5 w-5 text-indigo-600" />
                                </div>
                                {alerts.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {alerts.map((alert) => (
                                            <div 
                                                key={alert.id} 
                                                className={`px-6 py-4 ${
                                                    alert.severity === 'danger' 
                                                        ? 'bg-red-50 text-red-900' 
                                                        : alert.severity === 'warning' 
                                                        ? 'bg-yellow-50 text-yellow-900' 
                                                        : 'bg-blue-50 text-blue-900'
                                                }`}
                                            >
                                                <h3 className="font-semibold">{alert.title}</h3>
                                                <p className="text-sm mt-1">{alert.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No active alerts
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;