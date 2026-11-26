import { useEffect, useMemo, useState } from 'react';
import { ColdChainSensors } from './components/ColdChainSensors';
import { CorridorMap } from './components/CorridorMap';
import { DesignSystemSpec } from './components/DesignSystemSpec';
import { Header } from './components/Header';
import { KpiMetricsRow } from './components/KpiMetricsRow';
import { ManifestTable } from './components/ManifestTable';
import {
  DispatchShipmentModal,
  ManifestInspectorDrawer,
  ReeferSosModal,
} from './components/Modals';
import { SecondaryViews } from './components/SecondaryViews';
import { Sidebar } from './components/Sidebar';
import {
  INITIAL_MANIFESTS,
  INITIAL_REEFERS,
  INITIAL_TRUCKS,
  TRANSIT_HUBS,
} from './data/mockData';
import type {
  Manifest,
  ManifestTabFilter,
  NavSection,
  ReeferSensor,
  TransitHub,
  TruckNode,
} from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('logistics-overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState<TransitHub>(TRANSIT_HUBS[0]);

  const [manifests, setManifests] = useState<Manifest[]>(INITIAL_MANIFESTS);
  const [reefers, setReefers] = useState<ReeferSensor[]>(INITIAL_REEFERS);
  const [trucks, setTrucks] = useState<TruckNode[]>(INITIAL_TRUCKS);

  const [manifestTab, setManifestTab] = useState<ManifestTabFilter>('all');
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [syncSeconds, setSyncSeconds] = useState(14);

  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [sosTargetReefer, setSosTargetReefer] = useState<ReeferSensor | null>(null);
  const [inspectedManifest, setInspectedManifest] = useState<Manifest | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'alert' } | null>(
    null
  );

  // Live telemetry sync counter matching Stitch dashboard behavior
  useEffect(() => {
    const timer = window.setInterval(() => {
      setSyncSeconds((prev) => (prev >= 60 ? 1 : prev + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const showToast = (message: string, tone: 'success' | 'alert' = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  const alertManifests = useMemo(
    () => manifests.filter((m) => m.status === 'Temp Alert'),
    [manifests]
  );

  const totalProduceMt = useMemo(
    () =>
      manifests
        .filter((m) => m.status !== 'Delivered')
        .reduce((acc, m) => acc + m.volumeMt, 0) + 19.6,
    [manifests]
  );

  const pendingEscrowNgn = useMemo(
    () =>
      manifests
        .filter((m) => !m.signedOff)
        .reduce((acc, m) => acc + m.escrowNgn, 0) + 1390000,
    [manifests]
  );

  const pendingQaCount = useMemo(
    () => manifests.filter((m) => !m.signedOff).length + 6,
    [manifests]
  );

  const coldChainRatePct = useMemo(() => {
    const penalty = alertManifests.length * 1.2;
    return Math.min(99.8, Math.max(91.0, 100.0 - penalty));
  }, [alertManifests.length]);

  const activeShipmentsCount = useMemo(
    () => manifests.filter((m) => m.status !== 'Delivered').length + 6,
    [manifests]
  );

  const handleExportCsv = () => {
    const headers = [
      'Manifest ID',
      'Cooperative',
      'Produce',
      'Volume (MT)',
      'Origin',
      'Destination',
      'Temperature',
      'QA Grade',
      'Driver',
      'Status',
      'Escrow (NGN)',
    ];
    const rows = manifests.map((m) => [
      m.id,
      m.cooperative,
      m.produce,
      m.volumeMt.toFixed(1),
      m.origin,
      m.destination,
      m.temperatureLabel,
      m.qaGrade,
      m.driver,
      m.status,
      String(m.escrowNgn),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agriroute-manifest-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${manifests.length} consignments to CSV.`);
  };

  const handleCreateManifest = (newManifest: Manifest) => {
    setManifests((prev) => [newManifest, ...prev]);
    setSyncSeconds(1);
    showToast(`Dispatched ${newManifest.id} (${newManifest.produce}) on ${newManifest.truckId}.`);
  };

  const handleConfirmDivert = (reeferId: string, destinationHub: string) => {
    setReefers((prev) =>
      prev.map((r) =>
        r.id === reeferId
          ? {
              ...r,
              status: 'optimal',
              statusLabel: 'Divert Active',
              temperatureC: 3.9,
              reroutedTo: destinationHub,
              shelfLife: 'Stabilized (72h Projected)',
            }
          : r
      )
    );
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === reeferId
          ? {
              ...t,
              type: 'healthy',
              tempLabel: 'Temp: 3.9°C (Divert Stabilizing)',
              tempAlertTag: undefined,
            }
          : t
      )
    );
    setManifests((prev) =>
      prev.map((m) =>
        m.truckId === reeferId
          ? {
              ...m,
              status: 'On Schedule',
              temperatureLabel: '3.9°C',
              temperatureC: 3.9,
              qaGrade: 'Divert Cooling Stabilized',
              qaState: 'optimal',
            }
          : m
      )
    );
    showToast(`${reeferId} diverted to ${destinationHub}. Cooling stabilized.`);
  };

  const handleResolveManifestAlert = (manifestId: string) => {
    const target = manifests.find((m) => m.id === manifestId);
    setManifests((prev) =>
      prev.map((m) =>
        m.id === manifestId
          ? {
              ...m,
              status: 'On Schedule',
              temperatureLabel: '3.9°C',
              temperatureC: 3.9,
              qaGrade: 'Grade A Cold Lock Restored',
              qaState: 'optimal',
            }
          : m
      )
    );
    if (target) {
      setReefers((prev) =>
        prev.map((r) =>
          r.id === target.truckId
            ? {
                ...r,
                status: 'optimal',
                statusLabel: 'Optimal Cold',
                temperatureC: 3.9,
                shelfLife: 'Stabilized Nominal',
              }
            : r
        )
      );
      setTrucks((prev) =>
        prev.map((t) =>
          t.id === target.truckId
            ? {
                ...t,
                type: 'healthy',
                tempLabel: 'Temp: 3.9°C (Optimal)',
                tempAlertTag: undefined,
              }
            : t
        )
      );
    }
    showToast(`Thermal excursion resolved for ${manifestId}.`);
  };

  const handleSignOffSingle = (manifest: Manifest) => {
    setManifests((prev) =>
      prev.map((m) =>
        m.id === manifest.id
          ? { ...m, signedOff: true, status: 'Delivered', etaLabel: 'QA Signed Off' }
          : m
      )
    );
    showToast(`QA gate-pass signed off for ${manifest.id}. Escrow released.`);
  };

  const handleBulkSignOff = (ids: string[]) => {
    setManifests((prev) =>
      prev.map((m) =>
        ids.includes(m.id) && m.status !== 'Temp Alert'
          ? { ...m, signedOff: true, status: 'Delivered', etaLabel: 'QA Signed Off' }
          : m
      )
    );
    showToast(`Completed bulk QA sign-off for ${ids.length} eligible manifest(s).`);
  };

  const handleResolveAlertsJump = () => {
    setActiveSection('logistics-overview');
    setManifestTab('alert');
    window.setTimeout(() => {
      document
        .getElementById('manifest-schedule-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSelectTruck = (truck: TruckNode) => {
    setSelectedTruckId((prev) => (prev === truck.id ? null : truck.id));
  };

  const flaggedReefer =
    reefers.find((r) => r.status === 'breach') || reefers[0] || null;

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Navigation Sidebar (Fixed on Desktop, Slide-Over Drawer on Mobile/Tablet) */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        activeShipmentsCount={activeShipmentsCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Shell */}
      <div className="lg:pl-[240px] min-h-screen flex flex-col">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hubs={TRANSIT_HUBS}
          selectedHub={selectedHub}
          onSelectHub={(hub) => {
            setSelectedHub(hub);
            showToast(`Switched operational telemetry to ${hub.name}.`);
          }}
          alertManifests={alertManifests}
          onInspectManifest={(m) => setInspectedManifest(m)}
          onOpenDispatchModal={() => setDispatchModalOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="w-full flex-1 pt-16 bg-surface">
          <div className="p-margin-sm md:p-margin max-w-[1600px] mx-auto">
            {activeSection === 'logistics-overview' ? (
              <div className="flex flex-col w-full">
                {/* Top Level Command Bar & Hub Meta */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-gutter-sm mb-gutter">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs text-secondary mb-1 flex-wrap">
                      <span className="material-symbols-outlined text-[18px]">
                        agriculture
                      </span>
                      <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">
                        Farm-to-Market Operational Grid
                      </span>
                      <span className="text-outline">/</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                        {selectedHub.region}
                      </span>
                    </div>
                    <h1 className="font-display-lg text-display-lg-mobile sm:text-display-lg text-on-surface tracking-tight">
                      Logistics Overview &amp; Telematics
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                      Real-time cold-chain tracking, perishable shelf-life estimation, and
                      fleet routing.
                    </p>
                  </div>

                  {/* Quick Operations Toolbar */}
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setSyncSeconds(1);
                        showToast('IoT satellite & cellular telemetry synchronized.');
                      }}
                      className="flex items-center bg-surface-container-lowest hover:bg-surface-container-low border border-agri-border px-space-md h-10 rounded-lg shadow-layer-1 gap-space-xs text-on-surface transition-colors"
                      title="Force telemetry sync"
                    >
                      <span className="material-symbols-outlined text-[20px] text-primary">
                        sync
                      </span>
                      <span className="font-body-md-medium text-body-md-medium tabular-nums">
                        Sync: <span className="font-bold">{syncSeconds}s ago</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="h-10 px-space-md bg-surface-container-lowest hover:bg-surface-container-low border border-agri-border text-on-surface font-label-md text-label-md rounded-lg shadow-layer-1 flex items-center gap-space-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        download
                      </span>
                      <span>Daily Manifest</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSosTargetReefer(flaggedReefer)}
                      className="h-10 px-space-md bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-layer-1 flex items-center gap-space-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        emergency_share
                      </span>
                      <span>Reefer Divert SOS</span>
                    </button>
                  </div>
                </div>

                {/* A. Top KPI Metrics Row */}
                <KpiMetricsRow
                  totalProduceMt={totalProduceMt}
                  coldChainRatePct={coldChainRatePct}
                  activeAlertsCount={alertManifests.length}
                  pendingEscrowNgn={pendingEscrowNgn}
                  pendingQaCount={pendingQaCount}
                  onResolveAlertsClick={handleResolveAlertsJump}
                />

                {/* B. Middle Row (8-col Map / 4-col Sensors) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-sm lg:gap-gutter mb-gutter">
                  <CorridorMap
                    trucks={trucks}
                    selectedTruckId={selectedTruckId}
                    onSelectTruck={handleSelectTruck}
                  />
                  <ColdChainSensors
                    reefers={reefers}
                    selectedTruckId={selectedTruckId}
                    onRerouteReefer={(reefer) => setSosTargetReefer(reefer)}
                    onContactDriver={(reefer) =>
                      showToast(
                        `Connecting dispatch voice relay to ${reefer.driver ?? reefer.id} (${reefer.driverPhone ?? 'Radio Ch. 4'})...`
                      )
                    }
                  />
                </div>

                {/* C. Bottom Row: Active Manifests & Dispatch Schedule */}
                <ManifestTable
                  manifests={manifests}
                  globalSearch={searchQuery}
                  activeTab={manifestTab}
                  onTabChange={setManifestTab}
                  onExportCsv={handleExportCsv}
                  onBulkSignOff={handleBulkSignOff}
                  onInspectManifest={(m) => setInspectedManifest(m)}
                  onInterveneManifest={(m) => {
                    const matchedReefer = reefers.find((r) => r.id === m.truckId);
                    if (matchedReefer) {
                      setSosTargetReefer(matchedReefer);
                    } else {
                      setInspectedManifest(m);
                    }
                  }}
                  onSignOffSingle={handleSignOffSingle}
                />

                {/* D. Design System Spec: Interactive Component States */}
                <DesignSystemSpec />
              </div>
            ) : (
              <SecondaryViews
                section={activeSection}
                manifests={manifests}
                reefers={reefers}
                onInspectManifest={(m) => setInspectedManifest(m)}
                onRerouteReefer={(reefer) => setSosTargetReefer(reefer)}
                onBackToOverview={() => setActiveSection('logistics-overview')}
              />
            )}
          </div>
        </main>
      </div>

      {/* Layer-3 Modals & Inspector Drawer */}
      <DispatchShipmentModal
        open={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        onCreateManifest={handleCreateManifest}
      />

      <ReeferSosModal
        open={Boolean(sosTargetReefer)}
        reefer={sosTargetReefer}
        onClose={() => setSosTargetReefer(null)}
        onConfirmDivert={handleConfirmDivert}
      />

      <ManifestInspectorDrawer
        manifest={inspectedManifest}
        onClose={() => setInspectedManifest(null)}
        onResolveManifestAlert={handleResolveManifestAlert}
        onSignOff={handleSignOffSingle}
      />

      {/* Operational Toast Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 max-w-md px-4 py-3 rounded-lg shadow-layer-3 border flex items-center gap-2.5 text-[13px] font-medium ${
            toast.tone === 'alert'
              ? 'bg-tertiary text-on-tertiary border-tertiary-container'
              : 'bg-agri-forest text-on-primary border-primary-fixed/30'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toast.tone === 'alert' ? 'warning' : 'check_circle'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
