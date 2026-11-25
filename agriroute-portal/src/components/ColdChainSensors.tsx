import React from 'react';
import type { ReeferSensor } from '../types';

interface ColdChainSensorsProps {
  reefers: ReeferSensor[];
  selectedTruckId: string | null;
  onRerouteReefer: (reefer: ReeferSensor) => void;
  onContactDriver: (reefer: ReeferSensor) => void;
}

export const ColdChainSensors: React.FC<ColdChainSensorsProps> = ({
  reefers,
  selectedTruckId,
  onRerouteReefer,
  onContactDriver,
}) => {
  const flaggedCount = reefers.filter((r) => r.status !== 'optimal').length;

  return (
    <div className="lg:col-span-4 flex flex-col gap-space-md">
      {/* Panel Header Card */}
      <div className="bg-surface-container-lowest rounded-lg p-space-md border border-agri-border shadow-layer-1">
        <div className="flex items-center justify-between pb-space-xs gap-2">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-tertiary text-[22px]">
              sensors
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Cold-Chain Sensors
            </h2>
          </div>
          <span className="bg-tertiary-fixed text-tertiary border border-[#FCA5A5] font-label-caps text-[11px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap tabular-nums">
            {flaggedCount > 0 ? `${flaggedCount + 1} Reefers Flagged` : 'All Nominal'}
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Automated probe alerts &amp; shelf-life prediction algorithms.
        </p>
      </div>

      {/* Reefer Sensor Cards */}
      {reefers.map((reefer) => {
        const isBreach = reefer.status === 'breach';
        const isOptimal = reefer.status === 'optimal';
        const isHighlighted = selectedTruckId === reefer.id;

        return (
          <div
            key={reefer.id}
            className={`bg-surface-container-lowest rounded-lg p-space-md border border-agri-border shadow-layer-1 border-l-4 transition-all ${
              isBreach
                ? 'border-l-tertiary'
                : isOptimal
                  ? 'border-l-primary'
                  : 'border-l-secondary'
            } ${isHighlighted ? 'ring-2 ring-primary/40' : ''}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {reefer.id}
                  </span>
                  <span
                    className={`font-label-caps text-[11px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isBreach
                        ? 'bg-tertiary-fixed text-tertiary'
                        : isOptimal
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {reefer.statusLabel}
                  </span>
                </div>
                <span className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  {reefer.reroutedTo
                    ? `Diverted → ${reefer.reroutedTo}`
                    : reefer.route}
                </span>
              </div>

              <div className="text-right flex-shrink-0">
                <span
                  className={`font-display-lg text-[28px] leading-[34px] tabular-nums font-black ${
                    isBreach
                      ? 'text-tertiary'
                      : isOptimal
                        ? 'text-primary'
                        : 'text-on-surface'
                  }`}
                >
                  {reefer.temperatureC.toFixed(1)}°C
                </span>
                <span
                  className={`block text-[11px] font-label-caps font-semibold uppercase ${
                    isBreach
                      ? 'text-tertiary'
                      : isOptimal
                        ? 'text-primary'
                        : 'text-on-surface-variant'
                  }`}
                >
                  {reefer.targetLabel}
                </span>
              </div>
            </div>

            {isBreach ? (
              <>
                <div className="mt-space-sm flex flex-col gap-1.5 bg-tertiary-fixed/30 p-space-xs rounded border border-tertiary/15">
                  <div className="flex justify-between items-center text-[12px] gap-2">
                    <span className="text-on-surface font-medium">
                      Cargo: {reefer.cargo}
                    </span>
                    {reefer.urgencyBadge && (
                      <span className="text-tertiary font-bold flex-shrink-0">
                        {reefer.urgencyBadge}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[12px] gap-2">
                    <span className="text-on-surface-variant">Remaining Shelf-Life:</span>
                    <span className="font-bold text-tertiary text-right">
                      {reefer.shelfLife}
                    </span>
                  </div>
                  {reefer.driver && (
                    <div className="flex justify-between items-center text-[12px] gap-2">
                      <span className="text-on-surface-variant">Driver / Unit:</span>
                      <span className="text-on-surface font-medium text-right">
                        {reefer.driver} ({reefer.driverPhone})
                      </span>
                    </div>
                  )}
                </div>

                {/* Emergency Action Trigger */}
                <div className="mt-space-md flex gap-space-xs">
                  <button
                    type="button"
                    onClick={() => onRerouteReefer(reefer)}
                    className="flex-1 h-10 px-3 bg-tertiary hover:bg-tertiary-container text-on-tertiary font-label-md text-label-md rounded-lg flex items-center justify-center gap-1.5 shadow-layer-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      turn_sharp_right
                    </span>
                    <span className="truncate">Reroute to Abuja Cold Hub</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onContactDriver(reefer)}
                    className="h-10 w-10 flex-shrink-0 bg-surface-container-low hover:bg-surface-container-high border border-agri-border text-on-surface rounded-lg flex items-center justify-center transition-colors"
                    title="Contact Driver"
                    aria-label={`Contact driver ${reefer.driver}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">phone</span>
                  </button>
                </div>
              </>
            ) : isOptimal ? (
              <div className="mt-space-sm pt-space-xs flex flex-col gap-1 text-[12px] border-t border-agri-border/70">
                <div className="flex justify-between gap-2">
                  <span className="text-on-surface-variant">Cargo: {reefer.cargo}</span>
                  <span className="text-primary font-bold">{reefer.shelfLife}</span>
                </div>
                {reefer.compressorStatus && (
                  <div className="flex justify-between gap-2">
                    <span className="text-on-surface-variant">Compressor Status:</span>
                    <span className="text-on-surface font-medium">
                      {reefer.compressorStatus}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-space-sm pt-space-xs flex justify-between items-center text-[12px] border-t border-agri-border/70 gap-2">
                <span className="text-on-surface-variant">
                  {reefer.cargo} • {reefer.eta}
                </span>
                <span className="text-secondary font-bold text-right">
                  {reefer.coolingAction}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
