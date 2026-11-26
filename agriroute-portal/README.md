# AgriRoute Logistics Portal UI

Responsive React + TypeScript + Tailwind CSS implementation of the **AgriRoute Logistics Portal UI** Stitch project (`projects/1692751732998499140`).

## Features

- **Responsive Shell**: Fixed 240px navigation sidebar on desktop (`>= 1024px`) with slide-over drawer navigation on mobile and tablet viewports.
- **AgriRoute Design System**: Strict 8pt spatial rhythm (`8px`, `16px`, `24px`, `40px`, `48px`), Inter typography with `tabular-nums`, and exact color tokens from the Stitch design system (`AgriRoute Logistics System`).
- **Live Command Bar & Telemetry**: Auto-incrementing telemetry sync counter, transit hub switcher (`Kano-Kaduna Transit Hub`, `Jos Plateau Cold-Depot`, `Abuja Transit Cold-Depot`, `Mile 12 Lagos Terminal`), global `/` keyboard search shortcut, cold-chain alert notifications feed, and `+ Dispatch Shipment` modal.
- **Agro-Corridor GPS Fleet Tracking**: Interactive corridor filter tabs (`All Hubs`, `North-Central Express`, `Coastal Route`) and clickable truck/reefer markers (`TRK-409`, `REEFER-082`, `REEFER-044`, `REEFER-019`).
- **Cold-Chain Sensors & Divert SOS**: Real-time reefer cards with emergency `Reroute to Abuja Cold Hub` divert workflow and driver contact actions.
- **Active Manifests & Dispatch Schedule**: Filter tabs, search, multi-select `Bulk Inspection Sign-Off`, CSV export, pagination, and a slide-over Manifest & Telemetry Inspector drawer.
- **Design System Spec**: Collapsible 5-state interactive component showcase (Primary Action Button, Manifest/Hub Search Input, Table Filter Tabs).

## Getting Started

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```
