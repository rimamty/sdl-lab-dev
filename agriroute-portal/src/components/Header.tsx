import React, { useEffect, useRef, useState } from 'react';
import type { Manifest, TransitHub } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  hubs: TransitHub[];
  selectedHub: TransitHub;
  onSelectHub: (hub: TransitHub) => void;
  alertManifests: Manifest[];
  onInspectManifest: (manifest: Manifest) => void;
  onOpenDispatchModal: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  hubs,
  selectedHub,
  onSelectHub,
  alertManifests,
  onInspectManifest,
  onOpenDispatchModal,
  onOpenMobileMenu,
}) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [hubMenuOpen, setHubMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setHubMenuOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-[240px] right-0 h-16 bg-surface/90 backdrop-blur-xl border-b border-agri-border z-40 px-margin-sm md:px-margin flex items-center justify-between gap-space-sm md:gap-space-md">
      {/* Left: Mobile menu toggle + Search */}
      <div className="flex items-center flex-1 gap-space-xs max-w-lg min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div className="relative w-full min-w-0">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-8 bg-surface-container-low rounded-lg border border-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Search shipments, truck IDs, farm hubs... (Press /)"
            type="text"
            aria-label="Global shipment and hub search"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Hub selector, IoT Live Pill, Notifications, Dispatch CTA */}
      <div className="flex items-center gap-space-xs md:gap-space-md flex-shrink-0">
        {/* Hub Switcher Dropdown */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => {
              setHubMenuOpen((o) => !o);
              setNotifOpen(false);
            }}
            className="flex items-center gap-space-xs px-space-md h-10 bg-surface-container-low rounded-lg border border-agri-border text-on-surface font-body-md hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
            <span className="font-body-md-medium text-body-md-medium max-w-[180px] truncate">
              {selectedHub.name}
            </span>
            <span className="material-symbols-outlined text-outline text-[18px]">
              arrow_drop_down
            </span>
          </button>

          {hubMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest border border-agri-border-strong rounded-lg shadow-layer-2 py-1 z-50">
              <div className="px-3 py-2 border-b border-agri-border">
                <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                  Switch Operational Hub
                </span>
              </div>
              {hubs.map((hub) => {
                const isSelected = hub.id === selectedHub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => {
                      onSelectHub(hub);
                      setHubMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-start justify-between gap-2 hover:bg-surface-container-low transition-colors ${
                      isSelected ? 'bg-secondary-container/40' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-body-md-medium text-on-surface flex items-center gap-1.5">
                        <span className="truncate">{hub.name}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-primary text-[16px]">
                            check_circle
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-on-surface-variant truncate">
                        {hub.region}
                      </span>
                    </div>
                    <span className="text-[11px] font-label-caps text-primary bg-primary/10 px-1.5 py-0.5 rounded tabular-nums flex-shrink-0">
                      {hub.activeReefers} live
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* IoT Telemetry Live Badge */}
        <div className="hidden xl:flex items-center gap-space-xs px-3 h-8 bg-secondary-container border border-[#86EFAC] rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-label-caps text-[11px] text-on-secondary-container">
            IoT Telemetry Live
          </span>
        </div>

        {/* Notifications Bell + Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((o) => !o);
              setHubMenuOpen(false);
            }}
            aria-label={`Notifications (${alertManifests.length} active alerts)`}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low border border-agri-border text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {alertManifests.length > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-tertiary text-on-tertiary font-label-caps rounded-full flex items-center justify-center text-[10px] tabular-nums">
                {alertManifests.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-agri-border-strong rounded-lg shadow-layer-2 z-50 overflow-hidden">
              <div className="px-4 py-3 bg-primary text-on-primary flex items-center justify-between">
                <span className="font-label-caps text-[11px] uppercase">
                  Cold-Chain Alert Feed
                </span>
                <span className="text-[11px] bg-tertiary text-on-tertiary px-2 py-0.5 rounded-full font-bold tabular-nums">
                  {alertManifests.length} Active
                </span>
              </div>
              <div className="divide-y divide-agri-border max-h-72 overflow-y-auto">
                {alertManifests.length === 0 ? (
                  <div className="p-4 text-center text-on-surface-variant text-[13px]">
                    All active reefers are within nominal thermal thresholds.
                  </div>
                ) : (
                  alertManifests.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onInspectManifest(m);
                        setNotifOpen(false);
                      }}
                      className="w-full text-left p-3 hover:bg-tertiary-fixed/20 transition-colors border-l-4 border-l-tertiary"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-on-surface">
                          {m.truckId} • {m.id}
                        </span>
                        <span className="font-label-caps text-tertiary tabular-nums">
                          {m.temperatureLabel}
                        </span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant mt-0.5">
                        {m.produce} ({m.origin} → {m.destination})
                      </p>
                      <span className="text-[11px] font-semibold text-tertiary mt-1 inline-block">
                        Inspect & intervene →
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action CTA */}
        <button
          type="button"
          onClick={onOpenDispatchModal}
          className="h-10 px-3 md:px-space-md bg-primary hover:bg-primary-container active:bg-on-primary-fixed text-on-primary font-label-md text-label-md rounded-lg flex items-center gap-1.5 transition-colors shadow-layer-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agri-forest"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="hidden sm:inline">+ Dispatch Shipment</span>
          <span className="sm:hidden">Dispatch</span>
        </button>
      </div>
    </header>
  );
};
