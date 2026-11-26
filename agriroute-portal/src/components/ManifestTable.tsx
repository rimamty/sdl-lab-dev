import React, { useMemo, useState } from 'react';
import type { Manifest, ManifestTabFilter } from '../types';

interface ManifestTableProps {
  manifests: Manifest[];
  globalSearch: string;
  activeTab: ManifestTabFilter;
  onTabChange: (tab: ManifestTabFilter) => void;
  onExportCsv: () => void;
  onBulkSignOff: (selectedIds: string[]) => void;
  onInspectManifest: (manifest: Manifest) => void;
  onInterveneManifest: (manifest: Manifest) => void;
  onSignOffSingle: (manifest: Manifest) => void;
}

const PAGE_SIZE = 4;

export const ManifestTable: React.FC<ManifestTableProps> = ({
  manifests,
  globalSearch,
  activeTab,
  onTabChange,
  onExportCsv,
  onBulkSignOff,
  onInspectManifest,
  onInterveneManifest,
  onSignOffSingle,
}) => {
  const [tableFilter, setTableFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const loading = manifests.filter((m) => m.status === 'Loading Bay 4').length;
    const inTransit = manifests.filter(
      (m) => m.status === 'In Transit' || m.status === 'On Schedule'
    ).length;
    const alert = manifests.filter((m) => m.status === 'Temp Alert').length;
    const delivered = manifests.filter((m) => m.status === 'Delivered').length;
    return {
      all: manifests.length,
      loading,
      inTransit,
      alert,
      delivered,
    };
  }, [manifests]);

  const filteredManifests = useMemo(() => {
    const q = (tableFilter || globalSearch).trim().toLowerCase();
    return manifests.filter((m) => {
      if (activeTab === 'loading' && m.status !== 'Loading Bay 4') return false;
      if (
        activeTab === 'in-transit' &&
        m.status !== 'In Transit' &&
        m.status !== 'On Schedule'
      ) {
        return false;
      }
      if (activeTab === 'alert' && m.status !== 'Temp Alert') return false;
      if (activeTab === 'delivered' && m.status !== 'Delivered') return false;

      if (!q) return true;
      return (
        m.id.toLowerCase().includes(q) ||
        m.cooperative.toLowerCase().includes(q) ||
        m.produce.toLowerCase().includes(q) ||
        m.origin.toLowerCase().includes(q) ||
        m.destination.toLowerCase().includes(q) ||
        m.driver.toLowerCase().includes(q) ||
        m.truckId.toLowerCase().includes(q)
      );
    });
  }, [manifests, activeTab, tableFilter, globalSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredManifests.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredManifests.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = pageItems.map((m) => m.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleTabClick = (tab: ManifestTabFilter) => {
    onTabChange(tab);
    setPage(1);
  };

  const renderStatusBadge = (status: Manifest['status']) => {
    switch (status) {
      case 'Temp Alert':
        return (
          <span className="bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5] font-label-caps text-[11px] px-2.5 py-0.5 rounded font-bold uppercase inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B]" /> Temp Alert
          </span>
        );
      case 'On Schedule':
        return (
          <span className="bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC] font-label-caps text-[11px] px-2.5 py-0.5 rounded font-bold uppercase inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> On Schedule
          </span>
        );
      case 'Delivered':
        return (
          <span className="bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC] font-label-caps text-[11px] px-2.5 py-0.5 rounded font-bold uppercase inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Delivered
          </span>
        );
      case 'Loading Bay 4':
        return (
          <span className="bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] font-label-caps text-[11px] px-2.5 py-0.5 rounded font-bold uppercase inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" /> Loading Bay 4
          </span>
        );
      default:
        return (
          <span className="bg-surface-container-highest text-on-surface border border-agri-border-strong font-label-caps text-[11px] px-2.5 py-0.5 rounded font-bold uppercase inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> In Transit
          </span>
        );
    }
  };

  return (
    <section
      id="manifest-schedule-section"
      className="bg-surface-container-lowest rounded-lg border border-agri-border shadow-layer-1 p-space-md mb-gutter"
    >
      {/* Table Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-space-md gap-space-md">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Active Manifests &amp; Dispatch Schedule
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Inspect consignments, verify digital QA certificates, and sign gate-passes.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-space-xs flex-wrap">
          <button
            type="button"
            onClick={onExportCsv}
            className="h-10 px-space-md bg-surface-container-lowest hover:bg-surface-container-low border border-agri-border-strong text-on-surface font-label-md text-label-md rounded-lg shadow-layer-1 flex items-center gap-space-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const targetIds =
                selectedIds.length > 0
                  ? selectedIds
                  : pageItems.map((item) => item.id);
              onBulkSignOff(targetIds);
              setSelectedIds([]);
            }}
            className="h-10 px-space-md bg-secondary hover:bg-agri-forest text-on-secondary font-label-md text-label-md rounded-lg shadow-layer-1 flex items-center gap-space-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>
              Bulk Inspection Sign-Off
              {selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Quick Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm mb-space-md pt-space-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 thin-scrollbar">
          {(
            [
              { id: 'all', label: `All (${counts.all})`, danger: false },
              { id: 'loading', label: `Loading (${counts.loading})`, danger: false },
              {
                id: 'in-transit',
                label: `In Transit (${counts.inTransit})`,
                danger: false,
              },
              {
                id: 'alert',
                label: `Delayed / Alert (${counts.alert})`,
                danger: true,
              },
              {
                id: 'delivered',
                label: `Delivered Today (${counts.delivered})`,
                danger: false,
              },
            ] as { id: ManifestTabFilter; label: string; danger: boolean }[]
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`h-9 px-space-md rounded font-label-md text-label-md whitespace-nowrap transition-colors ${
                  active
                    ? tab.danger
                      ? 'bg-tertiary text-on-tertiary font-semibold shadow-layer-1'
                      : 'bg-primary text-on-primary font-semibold shadow-layer-1'
                    : tab.danger
                      ? 'font-medium text-tertiary hover:bg-tertiary-fixed'
                      : 'font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Quick Table Filter Input */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            filter_list
          </span>
          <input
            value={tableFilter}
            onChange={(e) => {
              setTableFilter(e.target.value);
              setPage(1);
            }}
            className="w-full h-9 pl-9 pr-3 bg-surface-container-low rounded border border-agri-border font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
            placeholder="Filter manifest ID..."
            type="text"
            aria-label="Filter manifests by ID, produce, or driver"
          />
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto thin-scrollbar rounded border border-agri-border">
        <table className="w-full min-w-[820px] text-left border-collapse">
          <thead>
            <tr className="bg-agri-forest text-on-primary font-label-caps uppercase text-[11px] h-12">
              <th className="pl-space-md pr-2 w-10">
                <input
                  type="checkbox"
                  aria-label="Select all visible manifests"
                  checked={
                    pageItems.length > 0 &&
                    pageItems.every((m) => selectedIds.includes(m.id))
                  }
                  onChange={toggleAllVisible}
                  className="w-4 h-4 accent-[#15803D] cursor-pointer rounded"
                />
              </th>
              <th className="px-space-md">Manifest ID &amp; Batch</th>
              <th className="px-space-md">Produce &amp; Volume</th>
              <th className="px-space-md">Origin Hub → Destination</th>
              <th className="px-space-md">Cold-Chain / QA</th>
              <th className="px-space-md">ETA / Driver</th>
              <th className="px-space-md">Status</th>
              <th className="px-space-md text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-agri-border font-body-md text-body-md text-on-surface">
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-on-surface-variant font-body-md"
                >
                  No manifests match the current filter criteria.
                </td>
              </tr>
            ) : (
              pageItems.map((m) => {
                const isSelected = selectedIds.includes(m.id);
                const isAlert = m.status === 'Temp Alert';
                return (
                  <tr
                    key={m.id}
                    className={`transition-colors h-16 ${
                      isSelected
                        ? 'bg-[#DCFCE7] shadow-[inset_2px_0_0_#15803D]'
                        : isAlert
                          ? 'bg-tertiary-fixed/15 hover:bg-tertiary-fixed/25'
                          : 'hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <td className="pl-space-md pr-2">
                      <input
                        type="checkbox"
                        aria-label={`Select manifest ${m.id}`}
                        checked={isSelected}
                        onChange={() => toggleSelect(m.id)}
                        className="w-4 h-4 accent-[#15803D] cursor-pointer rounded"
                      />
                    </td>
                    <td className="px-space-md font-medium">
                      <div className="flex items-center gap-space-xs">
                        {isAlert && (
                          <span className="material-symbols-outlined text-tertiary text-[18px]">
                            priority_high
                          </span>
                        )}
                        <div>
                          <span className="font-bold text-on-surface">{m.id}</span>
                          <span className="block text-[11px] text-on-surface-variant">
                            {m.cooperative}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-space-md">
                      <span className="font-semibold">{m.produce}</span>
                      <span className="block text-[11px] text-on-surface-variant tabular-nums">
                        {m.volumeMt.toFixed(1)} MT ({m.packaging})
                      </span>
                    </td>
                    <td className="px-space-md">
                      <span>
                        {m.origin} → {m.destination}
                      </span>
                      <span className="block text-[11px] text-on-surface-variant">
                        {m.corridor}
                      </span>
                    </td>
                    <td className="px-space-md">
                      <span
                        className={`font-bold tabular-nums ${
                          m.qaState === 'breach'
                            ? 'text-tertiary'
                            : m.qaState === 'optimal'
                              ? 'text-primary'
                              : 'text-on-surface font-medium'
                        }`}
                      >
                        {m.temperatureLabel}
                      </span>
                      <span
                        className={`text-[11px] block font-semibold ${
                          m.qaState === 'breach'
                            ? 'text-tertiary'
                            : m.qaState === 'pending'
                              ? 'text-on-surface-variant font-normal'
                              : 'text-primary'
                        }`}
                      >
                        {m.qaGrade}
                      </span>
                    </td>
                    <td className="px-space-md">
                      <span className="font-medium">{m.etaLabel}</span>
                      <span className="block text-[11px] text-on-surface-variant">
                        {m.driver}
                      </span>
                    </td>
                    <td className="px-space-md">{renderStatusBadge(m.status)}</td>
                    <td className="px-space-md text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onInspectManifest(m)}
                          className="h-8 px-2.5 bg-surface-container-low hover:bg-surface-container-high border border-agri-border text-on-surface font-label-sm text-label-sm rounded transition-colors"
                        >
                          {m.status === 'Loading Bay 4' ? 'Manifest' : 'Telemetry'}
                        </button>
                        {isAlert ? (
                          <button
                            type="button"
                            onClick={() => onInterveneManifest(m)}
                            className="h-8 px-2.5 bg-tertiary hover:bg-tertiary-container text-on-tertiary font-label-sm text-label-sm rounded transition-colors"
                          >
                            Intervene
                          </button>
                        ) : m.status === 'On Schedule' && !m.signedOff ? (
                          <button
                            type="button"
                            onClick={() => onSignOffSingle(m)}
                            className="h-8 px-2.5 bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm rounded transition-colors"
                          >
                            Sign Off
                          </button>
                        ) : m.status === 'Loading Bay 4' ? (
                          <button
                            type="button"
                            onClick={() => onInspectManifest(m)}
                            className="h-8 px-2.5 bg-surface-container-low hover:bg-surface-container-high border border-agri-border text-on-surface font-label-sm text-label-sm rounded transition-colors"
                          >
                            Pre-Check
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onInspectManifest(m)}
                            className="h-8 px-2.5 bg-surface-container-low hover:bg-surface-container-high border border-agri-border text-on-surface font-label-sm text-label-sm rounded transition-colors"
                          >
                            Manifest
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination & Footer Meta */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-space-md mt-space-xs border-t border-agri-border gap-space-xs text-on-surface-variant font-body-md text-body-md">
        <span className="text-[13px] tabular-nums">
          Showing{' '}
          {filteredManifests.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} to{' '}
          {Math.min(safePage * PAGE_SIZE, filteredManifests.length)} of{' '}
          {filteredManifests.length} active consignments
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
            className="w-8 h-8 rounded flex items-center justify-center bg-surface-container-low text-on-surface hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setPage(pageNum)}
              className={`w-8 h-8 rounded flex items-center justify-center text-[13px] tabular-nums transition-colors ${
                pageNum === safePage
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high font-medium'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
            className="w-8 h-8 rounded flex items-center justify-center bg-surface-container-low text-on-surface hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
};
