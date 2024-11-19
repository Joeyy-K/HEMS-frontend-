import React from 'react';
import { 
    CircleAlertIcon, 
    InfoIcon, 
    AlertTriangleIcon, 
    ChevronRight, 
    Clock, 
    Zap, 
    HardDrive 
} from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

// Updated interface to match API response
interface Alert {
    id: number;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'danger';
    device: number;
    device_name: string;
    resolved: boolean;
    timestamp: string;
    created_at: string;
    updated_at: string;
}

interface AlertListProps {
    alerts: Alert[];
    isLoading?: boolean;
    onResolveAlert?: (alertId: number) => Promise<void>;
}

const AlertIcon = ({ severity = 'info' }: { severity?: Alert['severity'] }) => {
    switch (severity) {
        case 'danger':
            return <CircleAlertIcon className="h-6 w-6 text-red-500" />;
        case 'warning':
            return <AlertTriangleIcon className="h-6 w-6 text-yellow-500" />;
        default:
            return <InfoIcon className="h-6 w-6 text-blue-500" />;
    }
};

export const AlertList: React.FC<AlertListProps> = ({ 
    alerts, 
    isLoading = false,
    onResolveAlert 
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSeverityVariant = (severity: Alert['severity']) => {
        switch (severity) {
            case 'danger': return 'destructive';
            case 'warning': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <Card className="w-full">
            <Card.Header className="flex flex-row items-center justify-between">
                <Card.Title className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    <span>System Alerts</span>
                </Card.Title>
                {alerts.length > 0 && (
                    <Badge variant="outline" className="bg-gray-100">
                        {alerts.length} Active Alerts
                    </Badge>
                )}
            </Card.Header>
            <Card.Content>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <div 
                                key={alert.id} 
                                className={`
                                    relative border rounded-lg p-4 
                                    ${alert.severity === 'danger' 
                                        ? 'bg-red-50 border-red-200' 
                                        : alert.severity === 'warning' 
                                        ? 'bg-yellow-50 border-yellow-200' 
                                        : 'bg-blue-50 border-blue-200'}
                                    transition-all hover:shadow-md
                                `}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <AlertIcon severity={alert.severity} />
                                    </div>
                                    
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className={`
                                                text-base font-semibold 
                                                ${alert.severity === 'danger' 
                                                    ? 'text-red-800' 
                                                    : alert.severity === 'warning' 
                                                    ? 'text-yellow-800' 
                                                    : 'text-blue-800'}
                                            `}>
                                                {alert.title}
                                            </h3>
                                            <Badge 
                                                variant={getSeverityVariant(alert.severity)}
                                                className="uppercase"
                                            >
                                                {alert.severity}
                                            </Badge>
                                        </div>
                                        
                                        <p className={`
                                            text-sm mb-3
                                            ${alert.severity === 'danger' 
                                                ? 'text-red-700' 
                                                : alert.severity === 'warning' 
                                                ? 'text-yellow-700' 
                                                : 'text-blue-700'}
                                        `}>
                                            {alert.message}
                                        </p>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <HardDrive className="w-4 h-4 text-gray-500" />
                                                <span>{alert.device_name}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <span>{formatDate(alert.timestamp)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {onResolveAlert && (
                                        <div className="flex-shrink-0">
                                            <Button 
                                                variant="outline" 
                                          
                                                onClick={() => onResolveAlert(alert.id)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                Resolve
                                                <ChevronRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {!isLoading && alerts.length === 0 && (
                            <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                                <Zap className="w-12 h-12 text-gray-300 mb-4" />
                                <p>No active alerts</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Your smart home systems are running smoothly
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Card.Content>
        </Card>
    );
};

export default AlertList;