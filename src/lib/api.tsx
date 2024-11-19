import { EnergyData, Device, Alert } from '@/src/types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const fetchEnergyData = async (): Promise<EnergyData[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/energy-data/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PaginatedResponse<any> = await response.json();
        return data.results.map((item: any) => ({
            timestamp: new Date(item.timestamp),
            energy: item.energy,
            type: item.type,
            deviceName: item.device_name
        }));
    } catch (error) {
        console.error('Error fetching energy data:', error);
        throw error;
    }
};

export const fetchDevices = async (): Promise<Device[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PaginatedResponse<Device> = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching devices:', error);
        throw error;
    }
};

export const fetchAlerts = async (): Promise<Alert[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PaginatedResponse<Alert> = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching alerts:', error);
        throw error;
    }
};

export const controlDevice = async (deviceId: string, action: 'on' | 'off'): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/control/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error controlling device:', error);
        throw error;
    }
};