export interface Device {
    id: string;
    name: string;
    type: 'thermostat' | 'camera' | 'light';
    currentState: 'on' | 'off';
    location: string;
    lastReading: number | null;
    metadata?: Record<string, any>;
}

export interface EnergyData {
    timestamp: Date;
    energy: number;
    type: 'consumption' | 'generation';
    deviceName: string;
}

export interface Alert {
    id: string;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error' | 'danger';
    device?: Device;
    resolved: boolean;
    timestamp: string;
}
  
    
export interface AlertType {
    id: string;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'danger';
    timestamp: string;
}
    
export interface ApiResponse<T> {
    data: T;
    error?: string;
}