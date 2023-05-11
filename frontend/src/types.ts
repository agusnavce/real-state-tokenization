export interface Property {
  id: { toNumber(): number };
  name: string;
  description: string;
  location: string;
  totalValue: { toNumber(): number };
  shares: number;
}

export interface UserProperty extends Property {
  shareholders: Shareholder[];
}

export interface EthereumWindow extends Window {
  ethereum?: any;
}

export interface UserRequestedProperty {
  id: number;
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
export interface Shareholder {
  shareholder: string;
  shareAmount: number;
  propertyId?: number;
}

export interface SaleOrder {
  index: number;
  shareAmount: number;
}

export type ShareWithOrder = Shareholder & { order?: SaleOrder };
