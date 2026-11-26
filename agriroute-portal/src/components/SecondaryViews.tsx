import React from 'react';
import {
  COMPLIANCE_CERTS,
  HARVEST_INVENTORY,
  MARKET_BUYERS,
} from '../data/mockData';
import type { Manifest, NavSection, ReeferSensor } from '../types';

interface SecondaryViewProps {
  section: Exclude<NavSection, 'logistics-overview'>;
  manifests: Manifest[];
  reefers: ReeferSensor[];
  onInspectManifest: (manifest: Manifest) => void;
  onRerouteReefer: (reefer: ReeferSensor) => void;
  onBackToOverview: () => void;
}

export const SecondaryViews: React.FC<SecondaryViewProps> = ({
  section,
  manifests,
  reefers,
  onInspectManifest,
  onRerouteReefer,
  onBackToOverview,
}) => {
  const sectionTitles: Record<
    Exclude<NavSection, 'logistics-overview'>,
    { title: string; subtitle: string; icon: string }
  > = {
    'harvest-inventory': {
      title: 'Harvest Inventory & Cold-Room Staging',
      subtitle: 'Live produce tonnage across northern collection depots and chill bays.',
      icon: 'warehouse',
    },
    'active-shipments': {
      title: 'Active Shipments & Waybill Ledger',
      subtitle: 'Full multi-corridor shipment tracking with QA sign-off statuses.',
      icon: 'local_shipping',
    },
    'cold-chain-fleet': {
      title: 'Cold-Chain Fleet & Compressor Diagnostics',
      subtitle: 'Real-time IoT probe readings, thermal drift mitigation, and compressor cycles.',
      icon: 'ac_unit',
    },
    'market-buyers': {
      title: 'Market Buyers & Escrow Counterparties',
      subtitle: 'Institutional terminal buyers, SLA compliance scores, and locked settlements.',
      icon: 'storefront',
    },
    'compliance-and-certs': {
      title: 'Compliance & Phytosanitary Certificates',
      subtitle: 'NAFDAC, NAQS, and ISO 23412 cold-chain thermal audit logs.',
      icon: 'verified',
    },
  };

  const meta = sectionTitles[section];

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-gutter">
        <div>
          <div className="flex items-center gap-space-xs text-secondary mb-1">
            <span className="material-symbols-outlined text-[18px]">{meta.icon}</span>
            <span className="font-label-caps uppercase tracking-wider text-secondary">
              AgriRoute Logistics Module
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile sm:text-display-lg text-on-surface tracking-tight">
            {meta.title}
          </h1>
          <p className="font-body-md text-on-surface-variant mt-0.5">{meta.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onBackToOverview}
          className="h-10 px-space-md bg-surface-container-lowest hover:bg-surface-container-low border border-agri-border-strong text-on-surface font-label-md rounded-lg shadow-layer-1 flex items-center gap-space-xs self-start sm:self-auto transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Overview</span>
        </button>
      </div>

      {section === 'harvest-inventory' && (
        <div className="bg-surface-container-lowest rounded-lg border border-agri-border shadow-layer-1 p-space-md overflow-x-auto">
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="bg-agri-forest text-on-primary font-label-caps uppercase text-[11px] h-12">
                <th className="px-space-md">Lot ID</th>
                <th className="px-space-md">Commodity</th>
                <th className="px-space-md">Staging Hub</th>
                <th className="px-space-md text-right">Stock (MT)</th>
                <th className="px-space-md">Thermal Storage</th>
                <th className="px-space-md">Shelf-Life</th>
                <th className="px-space-md">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-agri-border">
              {HARVEST_INVENTORY.map((lot) => (
                <tr key={lot.lotId} className="h-14 hover:bg-[#F1F5F9]">
                  <td className="px-space-md font-bold">{lot.lotId}</td>
                  <td className="px-space-md font-medium">{lot.commodity}</td>
                  <td className="px-space-md text-on-surface-variant">{lot.hub}</td>
                  <td className="px-space-md text-right font-bold tabular-nums">
                    {lot.stockMt.toFixed(1)} MT
                  </td>
                  <td className="px-space-md tabular-nums">{lot.tempC}</td>
                  <td className="px-space-md tabular-nums">{lot.shelfLifeDays} days</td>
                  <td className="px-space-md">
                    <span
                      className={`font-label-caps text-[11px] px-2 py-0.5 rounded uppercase ${
                        lot.status === 'Priority Dispatch'
                          ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]'
                          : 'bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC]'
                      }`}
                    >
                      {lot.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === 'active-shipments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {manifests.map((m) => (
            <div
              key={m.id}
              className={`bg-surface-container-lowest rounded-lg p-space-md border border-agri-border shadow-layer-1 border-l-4 flex flex-col justify-between gap-3 ${
                m.status === 'Temp Alert' ? 'border-l-tertiary' : 'border-l-primary'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-headline-sm text-on-surface font-bold">
                    {m.id} • {m.truckId}
                  </span>
                  <p className="text-[13px] text-on-surface-variant">
                    {m.produce} ({m.volumeMt.toFixed(1)} MT) — {m.cooperative}
                  </p>
                </div>
                <span className="font-label-caps text-[11px] px-2 py-0.5 rounded bg-surface-container-low text-on-surface tabular-nums">
                  {m.temperatureLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px] pt-2 border-t border-agri-border">
                <span className="text-on-surface-variant">
                  {m.origin} → {m.destination} ({m.etaLabel})
                </span>
                <button
                  type="button"
                  onClick={() => onInspectManifest(m)}
                  className="text-primary font-label-sm font-bold hover:underline"
                >
                  Inspect →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'cold-chain-fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {reefers.map((r) => (
            <div
              key={r.id}
              className={`bg-surface-container-lowest rounded-lg p-space-md border border-agri-border shadow-layer-1 border-l-4 flex flex-col justify-between gap-3 ${
                r.status === 'breach'
                  ? 'border-l-tertiary'
                  : r.status === 'optimal'
                    ? 'border-l-primary'
                    : 'border-l-secondary'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-on-surface">{r.id}</h3>
                  <span
                    className={`font-display-lg text-[26px] tabular-nums ${
                      r.status === 'breach' ? 'text-tertiary' : 'text-primary'
                    }`}
                  >
                    {r.temperatureC.toFixed(1)}°C
                  </span>
                </div>
                <p className="text-[13px] text-on-surface-variant mt-1">{r.route}</p>
                <p className="text-[12px] text-on-surface mt-2 font-medium">
                  Cargo: {r.cargo}
                </p>
                <p className="text-[12px] text-on-surface-variant mt-1">
                  {r.shelfLife}
                </p>
              </div>
              {r.status === 'breach' && (
                <button
                  type="button"
                  onClick={() => onRerouteReefer(r)}
                  className="h-10 w-full bg-tertiary hover:bg-tertiary-container text-on-tertiary font-label-md rounded-lg transition-colors"
                >
                  Trigger Emergency Divert
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {section === 'market-buyers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {MARKET_BUYERS.map((buyer) => (
            <div
              key={buyer.name}
              className="bg-surface-container-lowest rounded-lg p-space-md border border-agri-border shadow-layer-1 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-headline-sm text-on-surface">{buyer.name}</h3>
                  <span className="text-[12px] text-on-surface-variant">
                    {buyer.city} • {buyer.tier}
                  </span>
                </div>
                <span className="bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC] font-label-caps text-[11px] px-2 py-0.5 rounded tabular-nums">
                  SLA {buyer.slaCompliance}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-agri-border">
                <div>
                  <span className="block text-[11px] text-on-surface-variant uppercase font-label-sm">
                    Active Orders
                  </span>
                  <span className="font-headline-sm text-on-surface tabular-nums">
                    {buyer.activeOrders} Manifests
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-on-surface-variant uppercase font-label-sm">
                    Escrow Locked
                  </span>
                  <span className="font-headline-sm text-primary tabular-nums">
                    {buyer.escrowNgn}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'compliance-and-certs' && (
        <div className="bg-surface-container-lowest rounded-lg border border-agri-border shadow-layer-1 p-space-md overflow-x-auto">
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="bg-agri-forest text-on-primary font-label-caps uppercase text-[11px] h-12">
                <th className="px-space-md">Certificate ID</th>
                <th className="px-space-md">Entity / Fleet Unit</th>
                <th className="px-space-md">Compliance Standard</th>
                <th className="px-space-md">Issued</th>
                <th className="px-space-md">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-agri-border">
              {COMPLIANCE_CERTS.map((cert) => (
                <tr key={cert.certId} className="h-14 hover:bg-[#F1F5F9]">
                  <td className="px-space-md font-bold font-mono text-[13px]">
                    {cert.certId}
                  </td>
                  <td className="px-space-md font-medium">{cert.entity}</td>
                  <td className="px-space-md text-on-surface-variant">
                    {cert.standard}
                  </td>
                  <td className="px-space-md tabular-nums">{cert.issued}</td>
                  <td className="px-space-md">
                    <span
                      className={`font-label-caps text-[11px] px-2 py-0.5 rounded uppercase ${
                        cert.status === 'Verified'
                          ? 'bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC]'
                          : cert.status === 'Excursion Flagged'
                            ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]'
                            : 'bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
