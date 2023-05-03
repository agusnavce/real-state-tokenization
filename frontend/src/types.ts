export interface Property {
    id: number;
    name: string;
    description: string;
    location: string;
    totalValue: number;
    shares: number;
}

export interface UserProperty extends Property {
    shareholders: string[];
}

export interface EthereumWindow extends Window {
    ethereum?: any;
}

export interface UserRequestedProperty {
    propertyId: number;
    name: string;
    description: string;
    location: string;
    totalValue: number;
    shares: number;
    requestorAddress: string;
    status: number;
}

export interface PropertyDetails {
    name: string;
    description: string;
    location: string;
    totalValue: number;
    shares: number;
}