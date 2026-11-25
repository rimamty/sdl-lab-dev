import React, { useState } from 'react';
import type { Manifest, ReeferSensor } from '../types';

interface DispatchModalProps {
  open: boolean;
  onClose: () => void;
  onCreateManifest: (manifest: Manifest) => void;
}

export const DispatchShipmentModal: React.FC<DispatchModalProps> = ({
  open,
  onClose,
  onCreateManifest,
}) => {
  const [cooperative, setCooperative] = useState('Kano Agro Producers Union');
  const [produce, setProduce] = useState('Roma Plum Tomatoes');
  const [volumeMt, setVolumeMt] = useState('11.5');
  const [origin, setOrigin] = useState('Kano Hub');
  const [destination, setDestination] = useState('Mile 12 Lagos');
  const [driver, setDriver] = useState('Aminu Mohammed');
  const [truckId, setTruckId] = useState('REEFER-091');
  const [targetTemp, setTargetTemp] = useState('4.0');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericId = Math.floor(9825 + Math.random() * 70);
    const parsedVol = Math.max(0.5, parseFloat(volumeMt) || 10);
    const parsedTemp = parseFloat(targetTemp);

    const newManifest: Manifest = {
      id: `#MNF-${numericId}`,
      cooperative: cooperative.trim() || 'AgriRoute Cooperative',
      produce: produce.trim() || 'Mixed Fresh Produce',
      volumeMt: parsedVol,
      packaging: 'Pre-Cooled Crates',
      origin,
      destination,
      corridor:
        destination.includes('Port Harcourt') ? 'Eastern Link' : 'Corridor A1 Express',
      corridorGroup: destination.includes('Port Harcourt')
        ? 'coastal'
        : 'north-central',
      temperatureLabel: `${Number.isFinite(parsedTemp) ? parsedTemp.toFixed(1) : '4.0'}°C`,
      temperatureC: Number.isFinite(parsedTemp) ? parsedTemp : 4.0,
      qaGrade: 'Grade A+ Cold Lock',
      qaState: 'optimal',
      etaLabel: 'Today, 22:45',
      driver: driver.trim() || 'Assigned Driver',
      driverPhone: '+234 803 550 2219',
      truckId: truckId.trim() || 'REEFER-091',
      status: 'On Schedule',
      escrowNgn: Math.round(parsedVol * 195000),
    };

    onCreateManifest(newManifest);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dispatch-modal-title"
    >
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-lg shadow-layer-3 overflow-hidden border border-agri-border-strong">
        <div className="h-1 bg-agri-forest" />
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 pb-4 border-b border-agri-border">
            <div>
              <h2
                id="dispatch-modal-title"
                className="font-headline-sm text-headline-sm text-on-surface"
              >
                Dispatch New Agro-Corridor Shipment
              </h2>
              <p className="text-[13px] text-on-surface-variant mt-0.5">
                Assign a telematics-enabled unit and lock digital escrow QA.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block font-label-sm text-on-surface-variant mb-1">
                  Origin Cooperative
                </span>
                <input
                  required
                  value={cooperative}
                  onChange={(e) => setCooperative(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-agri-border-strong rounded text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-agri-forest/20"
                />
              </label>

              <label className="block">
                <span className="block font-label-sm text-on-surface-variant mb-1">
                  Produce Commodity
                </span>
                <input
                  required
                  value={produce}
                  onChange={(e) => setProduce(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-agri-border-strong rounded text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-agri-forest/20"
                />
              </label>

              <label className="block">
                <span className="block font-label-sm text-on-surface-variant mb-1">
                  Origin Hub
                </span>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-agri-border-strong rounded text-body-md text-on-surface focus:outline-none focus:border-primary"
                >
                  <option>Kano Hub</option>
                  <option>Jos Hub</option>
                  <option>Kaduna</option>
                  <option>Makurdi</option>
                </select>
              </label>

              <label className="block">
                <span className="block font-label-sm text-on-surface-variant mb-1">
                  Destination Market
                </span>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-agri-border-strong rounded text-body-md text-on-surface focus:outline-none focus:border-primary"
                >
                  <option>Mile 12 Lagos</option>
                  <option>Garki Abuja</option>
                  <option>Bodija Ibadan</option>
                  <option>Port Harcourt</option>
                </select>
              </label>

              <label className="block">
                <span className="block font-label-sm text-on-surface-variant mb-1">
                  Payload Volume (MT)
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  required
                  value={volumeMt}
                  onChange={(e) => setVolumeMt(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-agri-border-strong rounded text-body-md text-on-surface tabular-nums focus:outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="block font-label-sm text-on-surface-variant mb-1">
                  Target Cold-Chain (°C)
                </span>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={targetTemp}
                  onChange={(e) => setTargetTemp(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-agri-border-strong rounded text-body-md text-on-surface tabular-nums focus:outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="block font-label-sm text-on-surface-variant mb-1">
                  Assigned Truck / Reefer ID
                </span>
                <input
                  required
                  value={truckId}
                  onChange={(e) => setTruckId(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-agri-border-strong rounded text-body-md text-on-surface focus:outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="block font-label-sm text-on-surface-variant mb-1">
                  Assigned Driver
                </span>
                <input
                  required
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-lowest border border-agri-border-strong rounded text-body-md text-on-surface focus:outline-none focus:border-primary"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-agri-border flex items-center justify-end gap-space-xs">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-space-md bg-surface-container-lowest hover:bg-surface-container-low border border-agri-border-strong text-on-surface font-label-md rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-space-md bg-primary hover:bg-primary-container text-on-primary font-label-md rounded-lg flex items-center gap-1.5 shadow-layer-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Confirm &amp; Dispatch</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface SosModalProps {
  open: boolean;
  reefer: ReeferSensor | null;
  onClose: () => void;
  onConfirmDivert: (reeferId: string, destinationHub: string) => void;
}

export const ReeferSosModal: React.FC<SosModalProps> = ({
  open,
  reefer,
  onClose,
  onConfirmDivert,
}) => {
  const [targetDepot, setTargetDepot] = useState('Abuja Transit Cold-Depot (38 km)');

  if (!open || !reefer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
    >
      <div className="w-full max-w-md bg-surface-container-lowest rounded-lg shadow-layer-3 overflow-hidden border border-tertiary/40">
        <div className="h-1 bg-tertiary" />
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">
                emergency_share
              </span>
            </div>
            <div className="flex-1">
              <h2
                id="sos-modal-title"
                className="font-headline-sm text-headline-sm text-on-surface"
              >
                Emergency Cold-Chain Divert — {reefer.id}
              </h2>
              <p className="text-[13px] text-on-surface-variant mt-1">
                Current probe temperature is{' '}
                <strong className="text-tertiary tabular-nums">
                  {reefer.temperatureC.toFixed(1)}°C
                </strong>{' '}
                ({reefer.targetLabel}). Diverting immediately preserves remaining{' '}
                <strong>{reefer.cargo}</strong> shelf-life.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block">
              <span className="block font-label-sm text-on-surface-variant mb-1">
                Emergency Cold-Storage Receiving Bay
              </span>
              <select
                value={targetDepot}
                onChange={(e) => setTargetDepot(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-lowest border border-agri-border-strong rounded text-body-md text-on-surface focus:outline-none focus:border-tertiary"
              >
                <option>Abuja Transit Cold-Depot (38 km)</option>
                <option>Lokoja Emergency Chiller Bay (72 km)</option>
                <option>Kaduna South Cold-Vault (94 km)</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-space-xs">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-space-md bg-surface-container-lowest hover:bg-surface-container-low border border-agri-border-strong text-on-surface font-label-md rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmDivert(reefer.id, targetDepot);
                onClose();
              }}
              className="h-10 px-space-md bg-tertiary hover:bg-tertiary-container text-on-tertiary font-label-md rounded-lg flex items-center gap-1.5 shadow-layer-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                turn_sharp_right
              </span>
              <span>Dispatch Divert Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ManifestDrawerProps {
  manifest: Manifest | null;
  onClose: () => void;
  onResolveManifestAlert: (manifestId: string) => void;
  onSignOff: (manifest: Manifest) => void;
}

export const ManifestInspectorDrawer: React.FC<ManifestDrawerProps> = ({
  manifest,
  onClose,
  onResolveManifestAlert,
  onSignOff,
}) => {
  if (!manifest) return null;

  const isBreach = manifest.status === 'Temp Alert';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/60"
      role="dialog"
      aria-modal="true"
      aria-label={`Manifest inspector for ${manifest.id}`}
    >
      <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-layer-3 flex flex-col border-l border-agri-border-strong">
        <div className={`h-1 ${isBreach ? 'bg-tertiary' : 'bg-agri-forest'}`} />
        <div className="p-6 border-b border-agri-border flex items-start justify-between gap-2">
          <div>
            <span className="font-label-caps text-[11px] uppercase text-secondary">
              Consignment Telemetry &amp; QA
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {manifest.id}
            </h2>
            <p className="text-[13px] text-on-surface-variant">{manifest.cooperative}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inspector"
            className="w-8 h-8 rounded hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Live Temp Summary */}
          <div
            className={`p-4 rounded-lg border ${
              isBreach
                ? 'bg-tertiary-fixed/30 border-tertiary/30'
                : 'bg-surface-container-low border-agri-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-[11px] uppercase text-on-surface-variant">
                Assigned Unit ({manifest.truckId})
              </span>
              <span
                className={`font-display-lg text-[24px] leading-none tabular-nums ${
                  isBreach ? 'text-tertiary' : 'text-primary'
                }`}
              >
                {manifest.temperatureLabel}
              </span>
            </div>
            <p className="text-[12px] text-on-surface-variant mt-2">
              QA Status:{' '}
              <strong className={isBreach ? 'text-tertiary' : 'text-primary'}>
                {manifest.qaGrade}
              </strong>
            </p>
          </div>

          {/* Structured Manifest Specs */}
          <dl className="divide-y divide-agri-border text-[13px]">
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-on-surface-variant">Commodity</dt>
              <dd className="font-semibold text-on-surface text-right">
                {manifest.produce}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-on-surface-variant">Payload &amp; Pack</dt>
              <dd className="font-semibold text-on-surface tabular-nums text-right">
                {manifest.volumeMt.toFixed(1)} MT ({manifest.packaging})
              </dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-on-surface-variant">Route Corridor</dt>
              <dd className="font-semibold text-on-surface text-right">
                {manifest.origin} → {manifest.destination}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-on-surface-variant">Driver &amp; Comms</dt>
              <dd className="font-semibold text-on-surface text-right">
                {manifest.driver}
                <span className="block text-[11px] text-on-surface-variant font-normal">
                  {manifest.driverPhone}
                </span>
              </dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-on-surface-variant">Escrow Value</dt>
              <dd className="font-bold text-on-surface tabular-nums text-right">
                ₦{new Intl.NumberFormat('en-NG').format(manifest.escrowNgn)}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-on-surface-variant">ETA</dt>
              <dd className="font-semibold text-on-surface text-right">
                {manifest.etaLabel}
              </dd>
            </div>
          </dl>
        </div>

        <div className="p-4 border-t border-agri-border bg-surface-container-low/60 flex items-center justify-end gap-space-xs">
          {isBreach && (
            <button
              type="button"
              onClick={() => {
                onResolveManifestAlert(manifest.id);
                onClose();
              }}
              className="h-10 px-space-md bg-tertiary hover:bg-tertiary-container text-on-tertiary font-label-md rounded-lg transition-colors"
            >
              Stabilize &amp; Resolve Alert
            </button>
          )}
          {!manifest.signedOff && (
            <button
              type="button"
              onClick={() => {
                onSignOff(manifest);
                onClose();
              }}
              className="h-10 px-space-md bg-primary hover:bg-primary-container text-on-primary font-label-md rounded-lg transition-colors"
            >
              Approve QA Sign-Off
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-space-md bg-surface-container-lowest border border-agri-border-strong text-on-surface font-label-md rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
