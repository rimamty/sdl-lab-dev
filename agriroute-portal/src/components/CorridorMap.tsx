import React, { useState } from 'react';
import type { CorridorFilter, TruckNode } from '../types';

interface CorridorMapProps {
  trucks: TruckNode[];
  selectedTruckId: string | null;
  onSelectTruck: (truck: TruckNode) => void;
}

export const CorridorMap: React.FC<CorridorMapProps> = ({
  trucks,
  selectedTruckId,
  onSelectTruck,
}) => {
  const [corridorFilter, setCorridorFilter] = useState<CorridorFilter>('all');

  const visibleTrucks =
    corridorFilter === 'all'
      ? trucks
      : trucks.filter((t) => t.corridorGroup === corridorFilter);

  const northDimmed = corridorFilter === 'coastal';
  const coastalDimmed = corridorFilter === 'north-central';

  return (
    <div className="lg:col-span-8 bg-surface-container-lowest rounded-lg border border-agri-border shadow-layer-1 p-space-md flex flex-col">
      {/* Corridor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-space-xs">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping flex-shrink-0" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Agro-Corridor GPS Fleet Tracking
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Northern agricultural belt to Southern commercial hubs
          </p>
        </div>

        {/* Corridor Filter Tabs */}
        <div
          className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg overflow-x-auto thin-scrollbar"
          role="tablist"
          aria-label="Corridor filter"
        >
          {(
            [
              { id: 'all', label: 'All Hubs (18)' },
              { id: 'north-central', label: 'North-Central Express' },
              { id: 'coastal', label: 'Coastal Route' },
            ] as { id: CorridorFilter; label: string }[]
          ).map((tab) => {
            const active = corridorFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCorridorFilter(tab.id)}
                className={`px-space-xs py-1 rounded font-label-sm text-label-sm whitespace-nowrap transition-colors ${
                  active
                    ? 'font-semibold bg-surface-container-lowest text-primary shadow-layer-1'
                    : 'font-medium text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vector Transit Map Container */}
      <div className="relative w-full h-[320px] sm:h-[360px] bg-surface-container-low rounded-lg border border-agri-border overflow-hidden flex items-center justify-center p-space-md">
        <svg
          className="absolute inset-0 w-full h-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 800 360"
          aria-label="Nigerian agricultural transit corridors vector map"
        >
          <defs>
            <pattern id="agri-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="0.75"
              />
            </pattern>
            <linearGradient id="corridorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#15803D" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#22C55E" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#agri-grid)" />

          {/* Main North-South Agricultural Trunk Corridor: Kano -> Kaduna -> Abuja -> Ibadan -> Lagos */}
          <g opacity={northDimmed ? 0.25 : 1} className="transition-opacity duration-200">
            <path
              d="M 680 40 Q 560 60 480 90 T 360 170 T 250 250 T 140 310"
              stroke="#CBD5E1"
              strokeLinecap="round"
              strokeWidth="8"
            />
            <path
              className="animate-pulse"
              d="M 680 40 Q 560 60 480 90 T 360 170 T 250 250 T 140 310"
              stroke="url(#corridorGlow)"
              strokeDasharray="6 6"
              strokeWidth="4"
            />
          </g>

          {/* Eastern / Coastal Link: Jos -> Makurdi -> Enugu -> Port Harcourt */}
          <g opacity={coastalDimmed ? 0.25 : 1} className="transition-opacity duration-200">
            <path
              d="M 520 60 Q 540 140 500 210 T 430 320"
              stroke="#CBD5E1"
              strokeLinecap="round"
              strokeWidth="6"
            />
            <path
              d="M 520 60 Q 540 140 500 210 T 430 320"
              stroke={corridorFilter === 'coastal' ? '#15803D' : '#94A3B8'}
              strokeDasharray="4 4"
              strokeWidth={corridorFilter === 'coastal' ? '3.5' : '2'}
            />
          </g>

          {/* Hub Terminals */}
          <circle cx="680" cy="40" r="8" fill="#14532D" />
          <circle cx="680" cy="40" r="14" stroke="#14532D" strokeWidth="1.5" opacity="0.4" />
          <circle cx="520" cy="60" r="7" fill="#14532D" />
          <circle cx="480" cy="90" r="7" fill="#14532D" />
          <circle cx="360" cy="170" r="8" fill="#1E40AF" />
          <circle cx="250" cy="250" r="7" fill="#14532D" />
          <circle cx="140" cy="310" r="9" fill="#991B1B" />
          <circle cx="140" cy="310" r="18" stroke="#991B1B" strokeWidth="1.5" opacity="0.4" />
          <circle cx="430" cy="320" r="8" fill="#14532D" />
        </svg>

        {/* Hub Overlay Labels */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-16 bg-surface-container-lowest/90 border border-agri-border px-2 py-1 rounded shadow-layer-1 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-label-caps text-[10px] sm:text-[11px] text-on-surface">
            Kano Onion Cluster
          </span>
        </div>
        <div className="hidden sm:flex absolute top-14 left-[56%] bg-surface-container-lowest/90 border border-agri-border px-2 py-1 rounded shadow-layer-1 items-center gap-1 backdrop-blur-sm pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-label-caps text-[11px] text-on-surface">
            Jos Veg Valley
          </span>
        </div>
        <div className="absolute top-[42%] left-[42%] bg-surface-container-lowest/90 border border-agri-border px-2 py-1 rounded shadow-layer-1 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-blue-700" />
          <span className="font-label-caps text-[10px] sm:text-[11px] text-on-surface">
            Abuja Transit Cold-Depot
          </span>
        </div>
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 bg-surface-container-lowest/90 border border-agri-border px-2 py-1 rounded shadow-layer-1 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          <span className="font-label-caps text-[10px] sm:text-[11px] text-on-surface">
            Mile 12 Lagos Terminal
          </span>
        </div>

        {/* Dynamic Truck Nodes */}
        {visibleTrucks.map((truck) => {
          const isSelected = selectedTruckId === truck.id;
          const isCritical = truck.type === 'critical';
          const isMinor = truck.type === 'minor';

          return (
            <button
              key={truck.id}
              type="button"
              onClick={() => onSelectTruck(truck)}
              style={{ top: `${truck.topPct}%`, left: `${truck.leftPct}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 focus:outline-none"
              aria-label={`${truck.id}: ${truck.cargo}, ${truck.tempLabel}`}
            >
              <div className="relative flex items-center justify-center">
                {isCritical && (
                  <>
                    <span className="absolute w-10 h-10 rounded-full bg-tertiary/30 animate-ping" />
                    {truck.tempAlertTag && (
                      <div className="absolute -top-7 whitespace-nowrap bg-tertiary text-on-tertiary font-label-caps text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 font-bold animate-bounce">
                        <span className="material-symbols-outlined text-[12px]">
                          device_thermostat
                        </span>{' '}
                        {truck.tempAlertTag}
                      </div>
                    )}
                  </>
                )}

                {!isCritical && (
                  <span className="absolute w-8 h-8 rounded-full bg-primary/20 animate-ping" />
                )}

                <div
                  className={`flex items-center justify-center rounded-full transition-transform group-hover:scale-110 ${
                    isCritical
                      ? 'w-9 h-9 bg-tertiary text-on-tertiary shadow-lg ring-2 ring-tertiary'
                      : isMinor
                        ? 'w-8 h-8 bg-secondary text-on-secondary shadow-md'
                        : 'w-8 h-8 bg-primary text-on-primary shadow-md'
                  } ${isSelected ? 'ring-4 ring-agri-forest/40 scale-110' : ''}`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isCritical ? 'emergency' : 'local_shipping'}
                  </span>
                </div>

                {/* Hover / Selected Tooltip */}
                <div
                  className={`absolute bottom-full mb-2 flex-col bg-inverse-surface text-inverse-on-surface p-2.5 rounded-lg shadow-layer-2 w-52 text-left z-30 pointer-events-none ${
                    isSelected ? 'flex' : 'hidden group-hover:flex'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 gap-1">
                    <span
                      className={`font-bold font-label-caps text-[11px] ${
                        isCritical ? 'text-tertiary-fixed' : 'text-primary-fixed'
                      }`}
                    >
                      {truck.label}
                    </span>
                    <span className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded tabular-nums">
                      {truck.speedKmh} km/h
                    </span>
                  </div>
                  <span className="text-[11px] text-inverse-on-surface/90">
                    Cargo: {truck.cargo}
                  </span>
                  <div className="flex justify-between text-[10px] mt-1.5 pt-1.5 border-t border-white/20">
                    <span
                      className={
                        isCritical ? 'text-tertiary-fixed font-bold' : 'text-secondary-fixed'
                      }
                    >
                      {truck.tempLabel}
                    </span>
                    <span>ETA: {truck.eta}</span>
                  </div>
                </div>
              </div>

              <span
                className={`mt-1 font-label-caps text-[10px] px-1.5 py-0.5 rounded shadow block text-center ${
                  isCritical
                    ? 'bg-tertiary-fixed text-tertiary font-bold'
                    : 'bg-surface-container-lowest text-on-surface font-semibold border border-agri-border'
                }`}
              >
                {truck.id}
              </span>
            </button>
          );
        })}

        {/* Route Telemetry HUD Mini Overlay */}
        <div className="hidden sm:flex absolute bottom-space-sm right-space-sm bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-lg border border-agri-border shadow-layer-2 items-center gap-space-md z-10">
          <div className="flex flex-col">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
              Active Corridor Density
            </span>
            <span className="font-body-md-medium text-on-surface font-bold">
              A2 Trunk: Heavy Ag-Transit
            </span>
          </div>
          <div className="h-6 w-px bg-outline-variant" />
          <div className="flex flex-col">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
              Active Reefers
            </span>
            <span className="font-body-md-medium text-primary font-bold">
              14 Online / 2 Drifting
            </span>
          </div>
        </div>
      </div>

      {/* Fleet Route Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mt-space-md pt-space-xs">
        <div className="flex items-center gap-space-xs p-space-xs bg-surface-container-low rounded-lg border border-agri-border/70">
          <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
              Average Speed
            </span>
            <span className="font-label-md text-label-md text-on-surface font-bold truncate tabular-nums">
              62.4 km/h (Corridor Flow)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-xs p-space-xs bg-surface-container-low rounded-lg border border-agri-border/70">
          <span className="material-symbols-outlined text-secondary text-[20px]">
            near_me
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
              Total Km in Transit
            </span>
            <span className="font-label-md text-label-md text-on-surface font-bold truncate tabular-nums">
              4,120 km Logged Today
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-xs p-space-xs bg-surface-container-low rounded-lg border border-agri-border/70">
          <span className="material-symbols-outlined text-primary text-[20px]">
            cloud_done
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
              IoT Gateway Status
            </span>
            <span className="font-label-md text-label-md text-primary font-bold truncate">
              100% Cellular &amp; Satellite Lock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
