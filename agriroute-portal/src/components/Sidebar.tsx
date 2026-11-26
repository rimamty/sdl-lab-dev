import React, { useState } from 'react';
import type { NavSection } from '../types';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  activeShipmentsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: {
  id: NavSection;
  label: string;
  icon: string;
  showCount?: boolean;
}[] = [
  { id: 'logistics-overview', label: 'Logistics Overview', icon: 'grid_view' },
  { id: 'harvest-inventory', label: 'Harvest Inventory', icon: 'warehouse' },
  {
    id: 'active-shipments',
    label: 'Active Shipments',
    icon: 'local_shipping',
    showCount: true,
  },
  { id: 'cold-chain-fleet', label: 'Cold-Chain Fleet', icon: 'ac_unit' },
  { id: 'market-buyers', label: 'Market Buyers', icon: 'storefront' },
  { id: 'compliance-and-certs', label: 'Compliance & Certs', icon: 'verified' },
];

const PROFILE_IMG_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCPwCvN8mhRqTu6t870GFd85Lkq5fxNtqQwfuzSn6NlrfIR6V0s7kVbjlH0LBI3B_EdO4FD4-O9uHM80gtq2CEJbOGfgzFybuIR1caHFXoMjrLv4l5X5qPZYT4m3Qwj9irt-zaYf8Xlkl_yUjPksESF6hJGJ8NMfLdiXYA6HWpw3zYdjZO9fMHTA0FP5LQwS2jYJ8xOiAF0mt5D8kpTO3lQ1H9Dv3D49I3LzQva5uw';

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  activeShipmentsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const [avatarFailed, setAvatarFailed] = useState(false);

  const sidebarBody = (
    <div className="h-full w-[240px] bg-primary flex flex-col justify-between select-none shadow-[0_1px_8px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-margin flex items-center justify-between bg-primary border-b border-white/10">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded bg-primary-container border border-primary-fixed/30 flex items-center justify-center flex-shrink-0">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path
                  d="M7 23C7 14.5 13.5 8 24 7C23 17.5 16.5 24 8 24"
                  stroke="#95F8A7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 24L18 13"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="21" cy="10" r="2.2" fill="#FFFFFF" />
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-headline-sm text-headline-sm text-on-primary tracking-tight leading-none">
                AgriRoute
              </span>
              <span className="font-label-caps text-secondary-fixed uppercase tracking-wider text-[10px] leading-3 mt-1">
                Logistics OS
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="lg:hidden w-8 h-8 rounded flex items-center justify-center text-secondary-fixed hover:bg-primary-container hover:text-on-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="px-margin pt-space-md pb-space-xs">
          <span className="font-label-caps text-[11px] text-secondary-fixed/80 uppercase tracking-wider">
            Fleet Telematics
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col px-space-sm gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  onSelectSection(item.id);
                  onCloseMobile();
                }}
                className={`group w-full text-left flex items-center justify-between px-space-md py-space-sm rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-medium shadow-layer-1'
                    : 'text-secondary-fixed hover:bg-primary-container/70 hover:text-on-primary'
                }`}
              >
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span className="font-body-md text-body-md">{item.label}</span>
                </div>
                {item.showCount && (
                  <span className="bg-secondary text-on-primary font-label-caps px-2 py-0.5 rounded-full text-[11px] tabular-nums">
                    {activeShipmentsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Controller Profile Footer */}
      <div className="p-space-md bg-secondary/30 m-space-sm rounded-lg border border-white/10">
        <div className="flex items-center gap-space-xs">
          <div className="relative flex-shrink-0">
            {!avatarFailed ? (
              <img
                alt="Tunde Adebayo"
                className="w-9 h-9 rounded-full object-cover border border-primary-fixed/40"
                src={PROFILE_IMG_URL}
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-label-md flex items-center justify-center border border-primary-fixed/40">
                TA
              </div>
            )}
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary-fixed rounded-full ring-2 ring-primary"
              title="Controller Online"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-body-md-medium text-body-md-medium text-on-primary truncate">
              Tunde Adebayo
            </span>
            <span className="font-label-sm text-label-sm text-secondary-fixed truncate">
              Lead Logistics Controller
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-[240px] z-50">
        {sidebarBody}
      </aside>

      {/* Mobile / Tablet Slide-over Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full w-[240px]">{sidebarBody}</aside>
        </div>
      )}
    </>
  );
};
