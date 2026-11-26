import React, { useState } from 'react';

export const DesignSystemSpec: React.FC = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <section
      aria-label="Design System Specification"
      className="bg-surface-container-lowest rounded-lg border border-agri-border shadow-layer-1 p-space-md mb-gutter"
    >
      {/* Spec Header & Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-md border-b border-agri-border gap-space-xs">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">
              design_services
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Design System Spec: Interactive Component States
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Strict 8pt spatial rhythm token mapping (8px, 16px, 24px, 40px, 48px) with
            full WCAG AA contrast compliance.
          </p>
        </div>

        <div className="flex items-center gap-space-xs flex-wrap">
          <span className="bg-primary/10 text-primary font-label-caps text-[11px] px-space-xs py-1 rounded font-bold">
            WCAG AA Contrast &gt; 4.5:1
          </span>
          <span className="bg-surface-container-high text-on-surface font-label-caps text-[11px] px-space-xs py-1 rounded font-bold">
            8pt Grid Compliant
          </span>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="h-8 px-2.5 bg-surface-container-low hover:bg-surface-container-high border border-agri-border rounded text-on-surface font-label-sm flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
            <span>{expanded ? 'Hide Spec' : 'Show Spec'}</span>
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {/* 1. Primary Action Button 5-States */}
          <div className="py-space-md border-b border-agri-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-space-sm">
              <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider font-bold">
                1. Primary Action Button (+ Dispatch Shipment) — 40px Standard Height
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                Token: primary / primary-container / 40px
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 1: Default
                </span>
                <button
                  type="button"
                  className="h-10 px-space-md bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-space-xs shadow-layer-1"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ Dispatch</span>
                </button>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  bg-primary, text-on-primary
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 2: Hover
                </span>
                <button
                  type="button"
                  className="h-10 px-space-md bg-primary-container text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-space-xs shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ Dispatch</span>
                </button>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  bg-primary-container, elevated
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 3: Focus
                </span>
                <button
                  type="button"
                  className="h-10 px-space-md bg-primary text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-space-xs outline outline-2 outline-offset-2 outline-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ Dispatch</span>
                </button>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  outline-2 outline-offset-2
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 4: Active / Pressed
                </span>
                <button
                  type="button"
                  className="h-10 px-space-md bg-on-primary-fixed text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-space-xs scale-95 shadow-inner"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ Dispatch</span>
                </button>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  scale-95, bg-on-primary-fixed
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 5: Disabled
                </span>
                <button
                  type="button"
                  disabled
                  className="h-10 px-space-md bg-surface-container-high text-outline font-label-md text-label-md rounded flex items-center justify-center gap-space-xs cursor-not-allowed opacity-75"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ Dispatch</span>
                </button>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  cursor-not-allowed, opacity-75
                </span>
              </div>
            </div>
          </div>

          {/* 2. Manifest / Hub Search Input 5-States */}
          <div className="py-space-md border-b border-agri-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-space-sm">
              <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider font-bold">
                2. Manifest / Hub Search Input — 40px Height
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                Token: surface-container-low / 40px
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 1: Default
                </span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                    search
                  </span>
                  <input
                    readOnly
                    className="w-full h-10 pl-9 pr-3 bg-surface-container-lowest rounded border border-agri-border font-body-md text-body-md text-on-surface placeholder:text-outline shadow-layer-1 focus:outline-none"
                    placeholder="Search manifest..."
                    type="text"
                  />
                </div>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  bg-surface-container-lowest
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 2: Hover
                </span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface text-[18px]">
                    search
                  </span>
                  <input
                    readOnly
                    className="w-full h-10 pl-9 pr-3 bg-surface-container-lowest rounded border border-agri-border-strong font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant shadow-md focus:outline-none"
                    placeholder="Search manifest..."
                    type="text"
                  />
                </div>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  hover:shadow-md
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 3: Focus
                </span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-primary text-[18px]">
                    search
                  </span>
                  <input
                    readOnly
                    defaultValue="Kaduna #98"
                    className="w-full h-10 pl-9 pr-3 bg-surface-container-lowest rounded font-body-md text-body-md text-on-surface ring-2 ring-primary focus:outline-none"
                    type="text"
                  />
                </div>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  ring-2 ring-primary
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-tertiary font-semibold">
                  State 4: Error / Breach
                </span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-tertiary text-[18px]">
                    error
                  </span>
                  <input
                    readOnly
                    defaultValue="TEMP_DRIFT_082"
                    className="w-full h-10 pl-9 pr-3 bg-tertiary-fixed/30 rounded font-body-md text-body-md text-tertiary ring-2 ring-tertiary focus:outline-none"
                    type="text"
                  />
                </div>
                <span className="text-[10px] text-tertiary font-mono">
                  ring-2 ring-tertiary
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 5: Disabled
                </span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">
                    lock
                  </span>
                  <input
                    disabled
                    defaultValue="Manifest Locked"
                    className="w-full h-10 pl-9 pr-3 bg-surface-container-high rounded font-body-md text-body-md text-outline cursor-not-allowed"
                    type="text"
                  />
                </div>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  cursor-not-allowed
                </span>
              </div>
            </div>
          </div>

          {/* 3. Table Filter Tabs 5-States */}
          <div className="pt-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-space-sm">
              <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider font-bold">
                3. Table Filter Tabs — 36px Height
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                Token: primary / surface-container-low
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 1: Default Inactive
                </span>
                <button
                  type="button"
                  className="h-9 px-space-md rounded font-label-md text-label-md font-medium text-on-surface-variant bg-surface-container-lowest shadow-layer-1 flex items-center justify-center"
                >
                  Loading (4)
                </button>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  text-on-surface-variant
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 2: Hover
                </span>
                <button
                  type="button"
                  className="h-9 px-space-md rounded font-label-md text-label-md font-medium text-on-surface bg-surface-container-high flex items-center justify-center"
                >
                  Loading (4)
                </button>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  bg-surface-container-high
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 3: Focus
                </span>
                <button
                  type="button"
                  className="h-9 px-space-md rounded font-label-md text-label-md font-medium text-on-surface bg-surface-container-lowest outline outline-2 outline-primary flex items-center justify-center"
                >
                  Loading (4)
                </button>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  outline-2 outline-primary
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-primary font-semibold">
                  State 4: Active Selected
                </span>
                <button
                  type="button"
                  className="h-9 px-space-md rounded font-label-md text-label-md font-bold text-on-primary bg-primary shadow-layer-1 flex items-center justify-center"
                >
                  Loading (4)
                </button>
                <span className="text-[10px] text-primary font-mono">
                  bg-primary text-on-primary
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-space-xs bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
                  State 5: Disabled
                </span>
                <button
                  type="button"
                  disabled
                  className="h-9 px-space-md rounded font-label-md text-label-md font-normal text-outline-variant bg-surface-container-low cursor-not-allowed flex items-center justify-center"
                >
                  Loading (0)
                </button>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  cursor-not-allowed opacity-50
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
