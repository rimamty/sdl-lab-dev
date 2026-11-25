import React from 'react';

interface KpiMetricsRowProps {
  totalProduceMt: number;
  coldChainRatePct: number;
  activeAlertsCount: number;
  pendingEscrowNgn: number;
  pendingQaCount: number;
  onResolveAlertsClick: () => void;
}

export const KpiMetricsRow: React.FC<KpiMetricsRowProps> = ({
  totalProduceMt,
  coldChainRatePct,
  activeAlertsCount,
  pendingEscrowNgn,
  pendingQaCount,
  onResolveAlertsClick,
}) => {
  const formattedEscrow = new Intl.NumberFormat('en-NG').format(pendingEscrowNgn);

  return (
    <section
      aria-label="Key logistics metrics"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter-sm lg:gap-gutter mb-gutter"
    >
      {/* Card 1: Produce in Transit */}
      <div className="bg-surface-container-lowest p-space-md rounded-lg border border-agri-border shadow-layer-1 flex flex-col justify-between relative overflow-hidden hover:border-agri-border-strong transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">
              Produce in Transit
            </span>
            <span className="font-display-lg text-display-lg-mobile sm:text-display-lg text-on-surface mt-1 tabular-nums">
              {totalProduceMt.toFixed(1)}{' '}
              <span className="text-headline-sm font-normal text-on-surface-variant">
                MT
              </span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">
              local_shipping
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-space-md mt-space-xs gap-2">
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-primary flex-wrap">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-semibold">+18.2 MT</span>
            <span className="text-on-surface-variant font-normal">vs last week</span>
          </div>
          <span className="bg-primary/10 text-primary px-space-xs py-0.5 rounded text-[11px] font-bold tabular-nums flex-shrink-0">
            +12.4%
          </span>
        </div>
      </div>

      {/* Card 2: On-Time Cold-Chain Rate */}
      <div className="bg-surface-container-lowest p-space-md rounded-lg border border-agri-border shadow-layer-1 flex flex-col justify-between relative overflow-hidden hover:border-agri-border-strong transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-container" />
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">
              On-Time Cold-Chain
            </span>
            <span className="font-display-lg text-display-lg-mobile sm:text-display-lg text-on-surface mt-1 tabular-nums">
              {coldChainRatePct.toFixed(1)}
              <span className="text-headline-sm font-normal text-on-surface-variant">
                %
              </span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">ac_unit</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 pt-space-md mt-space-xs">
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-on-surface-variant">Fleet Target: 95.0%</span>
            <span className="text-secondary font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" /> Nominal
            </span>
          </div>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, coldChainRatePct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card 3: Spoilage Risk Alerts */}
      <div className="bg-surface-container-lowest p-space-md rounded-lg border border-agri-border shadow-layer-1 flex flex-col justify-between relative overflow-hidden hover:border-tertiary/50 transition-colors">
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-tertiary" />
        <div className="flex items-start justify-between pl-space-xs gap-2">
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-tertiary">
              Spoilage Risk Alerts
            </span>
            <span className="font-display-lg text-display-lg-mobile sm:text-display-lg text-tertiary mt-1 tabular-nums">
              {activeAlertsCount}{' '}
              <span className="text-headline-sm font-semibold text-tertiary">
                {activeAlertsCount === 0 ? 'Clear' : 'Active'}
              </span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </div>
        </div>
        <div className="flex items-center justify-between pl-space-xs pt-space-md mt-space-xs gap-2">
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
            <span className="font-medium text-tertiary">
              {Math.max(0, activeAlertsCount - 1)} Reefers
            </span>
            <span>Temp Drift</span>
          </div>
          <button
            type="button"
            onClick={onResolveAlertsClick}
            className="font-label-sm text-label-sm font-bold text-tertiary hover:underline flex items-center gap-0.5 flex-shrink-0"
          >
            Resolve alerts →
          </button>
        </div>
      </div>

      {/* Card 4: Pending Escrow Settlements */}
      <div className="bg-surface-container-lowest p-space-md rounded-lg border border-agri-border shadow-layer-1 flex flex-col justify-between relative overflow-hidden hover:border-agri-border-strong transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container" />
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">
              Pending Settlements
            </span>
            <span className="font-display-lg text-[24px] xl:text-[26px] leading-[36px] tracking-[-0.02em] font-bold text-on-surface mt-1 tabular-nums truncate">
              ₦{formattedEscrow}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">
              account_balance_wallet
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-space-md mt-space-xs gap-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
            {pendingQaCount} manifests awaiting QA
          </span>
          <span className="bg-surface-container-high text-on-surface px-space-xs py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 flex-shrink-0">
            <span className="material-symbols-outlined text-[13px] text-primary">
              lock
            </span>{' '}
            Escrow Locked
          </span>
        </div>
      </div>
    </section>
  );
};
