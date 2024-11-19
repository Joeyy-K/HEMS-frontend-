import React from 'react';
import { Camera, Sun, Thermometer } from 'lucide-react';
import { Device } from '@/src/types';
import { Card } from '@/src/components/ui/card';

interface DeviceListProps {
    devices: Device[];
    onDeviceControl: (deviceId: string, action: 'on' | 'off') => Promise<void>;
    isLoading?: boolean;
}

const DeviceIcon = ({ type, size = 24 }: { type: Device['type']; size?: number }) => {
    switch (type) {
        case 'thermostat':
        return <Thermometer size={size} />;
        case 'camera':
        return <Camera size={size} />;
        case 'light':
        return <Sun size={size} />;
        default:
        return null;
    }
};

export const DeviceList = ({ devices, onDeviceControl, isLoading = false }: DeviceListProps) => {
    return (
        <Card>
        <Card.Header>
            <Card.Title>Connected Devices</Card.Title>
        </Card.Header>
        <Card.Content>
            {isLoading ? (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
            ) : (
            <ul className="space-y-4">
                {devices.map((device) => (
                <li key={device.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                    <div className="text-gray-600">
                        <DeviceIcon type={device.type} />
                    </div>
                    <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-gray-500">
                        Status: <span className={device.currentState === 'on' ? 'text-green-500' : 'text-red-500'}>
                            {device.currentState.toUpperCase()}
                        </span>
                        </p>
                    </div>
                    </div>
                    <button
                    onClick={() => onDeviceControl(device.id, device.currentState === 'on' ? 'off' : 'on')}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                        ${device.currentState === 'on' 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                    {device.currentState === 'on' ? 'Turn Off' : 'Turn On'}
                    </button>
                </li>
                ))}
            </ul>
            )}
            {!isLoading && devices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                No devices connected
            </div>
            )}
        </Card.Content>
        </Card>
    );
};