export type NavSection =
  | 'logistics-overview'
  | 'harvest-inventory'
  | 'active-shipments'
  | 'cold-chain-fleet'
  | 'market-buyers'
  | 'compliance-and-certs';

export type CorridorFilter = 'all' | 'north-central' | 'coastal';

export type ManifestStatus =
  | 'Temp Alert'
  | 'In Transit'
  | 'On Schedule'
  | 'Loading Bay 4'
  | 'Delivered';

export type ManifestTabFilter =
  | 'all'
  | 'loading'
  | 'in-transit'
  | 'alert'
  | 'delivered';

export interface Manifest {
  id: string;
  cooperative: string;
  produce: string;
  volumeMt: number;
  packaging: string;
  origin: string;
  destination: string;
  corridor: string;
  corridorGroup: 'north-central' | 'coastal';
  temperatureLabel: string;
  temperatureC: number | null;
  qaGrade: string;
  qaState: 'breach' | 'optimal' | 'verified' | 'pending';
  etaLabel: string;
  driver: string;
  driverPhone: string;
  truckId: string;
  status: ManifestStatus;
  escrowNgn: number;
  signedOff?: boolean;
}

export interface ReeferSensor {
  id: string;
  status: 'breach' | 'optimal' | 'drift';
  statusLabel: string;
  route: string;
  temperatureC: number;
  targetLabel: string;
  secondaryMetricLabel?: string;
  cargo: string;
  urgencyBadge?: string;
  shelfLife: string;
  driver?: string;
  driverPhone?: string;
  compressorStatus?: string;
  eta?: string;
  coolingAction?: string;
  reroutedTo?: string;
}

export interface TruckNode {
  id: string;
  label: string;
  type: 'healthy' | 'critical' | 'minor';
  corridorGroup: 'north-central' | 'coastal';
  topPct: number;
  leftPct: number;
  speedKmh: number;
  cargo: string;
  tempLabel: string;
  tempAlertTag?: string;
  eta: string;
  manifestId: string;
}

export interface TransitHub {
  id: string;
  name: string;
  region: string;
  activeReefers: number;
  coldStorageUtilization: number;
}
