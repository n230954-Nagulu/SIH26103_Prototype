/**
 * ProjectRashak — Mock Data Layer
 * ---------------------------------------------------------------
 * All values on this page are illustrative mock data standing in
 * for a future FastAPI + PostgreSQL response. Every UI component
 * reads from the structures below rather than from hardcoded
 * markup, so swapping this file for a live API client is the only
 * change required to go from prototype to production.
 * ---------------------------------------------------------------
 */

// 1. National-level overview statistics ("Infrastructure Overview")
const dashboardData = {
  totalProjects: 1981,
  ongoingProjects: 1642,
  sectors: 22,
  ministries: 17,
  originalCost: "₹37.13 Lakh Cr",
  revisedCost: "₹42.78 Lakh Cr",
  expenditure: "₹20.36 Lakh Cr"
};

// 2. Sector explorer — one entry per sector card / detail panel
const sectorData = {
  roads: {
    name: "Roads & Highways",
    icon: "road",
    projects: 324,
    originalCost: "₹4.82 Lakh Cr",
    revisedCost: "₹5.67 Lakh Cr",
    expenditure: "₹2.91 Lakh Cr",
    completedProjects:287
  },
  railways: {
    name: "Railways",
    icon: "railway",
    projects: 268,
    originalCost: "₹6.10 Lakh Cr",
    revisedCost: "₹7.02 Lakh Cr",
    expenditure: "₹3.85 Lakh Cr",
    completedProjects:211
  },
  power: {
    name: "Power",
    icon: "power",
    projects: 241,
    originalCost: "₹7.85 Lakh Cr",
    revisedCost: "₹8.99 Lakh Cr",
    expenditure: "₹2.96 Lakh Cr",
    completedProjects: 198
  },
  mining: {
    name: "Mining",
    icon: "mining",
    projects: 86,
    originalCost: "₹1.72 Lakh Cr",
    revisedCost: "₹2.04 Lakh Cr",
    expenditure: "₹1.13 Lakh Cr",
    completedProjects: 57
  },
  petroleum: {
    name: "Petroleum & Natural Gas",
    icon: "petroleum",
    projects: 152,
    originalCost: "₹3.95 Lakh Cr",
    revisedCost: "₹4.48 Lakh Cr",
    expenditure: "₹2.30 Lakh Cr",
    completedProjects: 121
  },
  ports: {
    name: "Ports",
    icon: "port",
    projects: 64,
    originalCost: "₹1.28 Lakh Cr",
    revisedCost: "₹1.49 Lakh Cr",
    expenditure: "₹0.78 Lakh Cr",
    completedProjects: 42
  },
  airports: {
    name: "Airports",
    icon: "airport",
    projects: 38,
    originalCost: "₹0.86 Lakh Cr",
    revisedCost: "₹1.02 Lakh Cr",
    expenditure: "₹0.51 Lakh Cr",
    completedProjects: 29
  },
  urban: {
    name: "Urban Development",
    icon: "urban",
    projects: 187,
    originalCost: "₹3.42 Lakh Cr",
    revisedCost: "₹3.98 Lakh Cr",
    expenditure: "₹1.95 Lakh Cr",
    completedProjects: 156
  },
  water: {
    name: "Water Resources",
    icon: "water",
    projects: 213,
    originalCost: "₹2.65 Lakh Cr",
    revisedCost: "₹3.05 Lakh Cr",
    expenditure: "₹1.48 Lakh Cr",
    completedProjects: 142
  },
  industrial: {
    name: "Industrial Infrastructure",
    icon: "industrial",
    projects: 176,
    originalCost: "₹2.95 Lakh Cr",
    revisedCost: "₹3.31 Lakh Cr",
    expenditure: "₹1.62 Lakh Cr",
    completedProjects: 138
  },
  telecom: {
    name: "Telecommunications",
    icon: "telecom",
    projects: 94,
    originalCost: "₹1.05 Lakh Cr",
    revisedCost: "₹1.18 Lakh Cr",
    expenditure: "₹0.63 Lakh Cr",
    completedProjects: 76
  },
  other: {
    name: "Other Infrastructure",
    icon: "other",
    projects: 138,
    originalCost: "₹0.48 Lakh Cr",
    revisedCost: "₹0.55 Lakh Cr",
    expenditure: "₹0.24 Lakh Cr",
    completedProjects: 24
  }
};

// 3. Sector distribution — feeds the "Projects by Sector" bar chart
//    (derived from sectorData.projects, kept separate so the chart
//    can later be driven by its own aggregation endpoint)
const sectorDistribution = Object.keys(sectorData).map((key) => ({
  key,
  name: sectorData[key].name,
  projects: sectorData[key].projects
})).sort((a, b) => b.projects - a.projects);

// 4. Image slider — large infrastructure categories shown below the header
const sliderImages = [
  {
    category: "Roads & Highways",
    title: "National Highway Infrastructure",
    description: "Large-scale transportation infrastructure under implementation.",
    location: "Pan-India",
    sector: "Roads & Highways",
    status: "Ongoing",
    image: "/dashboard/assets/slider/NationalHighway.jpg"
  },
  {
    category: "Railways",
    title: "Dedicated Freight Corridor",
    description: "High-capacity rail infrastructure connecting industrial hubs.",
    location: "Multi-state",
    sector: "Railways",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1600&auto=format&fit=crop"
  },
  {
    category: "Bridges",
    title: "Major River Bridge Crossing",
    description: "Structural infrastructure improving regional connectivity.",
    location: "Multi-state",
    sector: "Roads & Highways",
    status: "Ongoing",
    image: "/dashboard/assets/slider/RiverCrossingBridge.jpg"
  },
  {
    category: "Power",
    title: "Thermal & Renewable Power Generation",
    description: "Generation and transmission infrastructure supporting the national grid.",
    location: "Multi-state",
    sector: "Power",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1600&auto=format&fit=crop"
  },
  {
    category: "Ports",
    title: "Major Port Capacity Expansion",
    description: "Maritime infrastructure supporting national trade throughput.",
    location: "Coastal states",
    sector: "Ports",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=1600&auto=format&fit=crop"
  },
  {
    category: "Mining",
    title: "Mineral Resource Development",
    description: "Extraction and processing infrastructure under national development plans.",
    location: "Chhattisgarh, Odisha, Jharkhand",
    sector: "Mining",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=1600&auto=format&fit=crop"
  },
  {
    category: "Large Building Construction",
    title: "Institutional & Public Infrastructure",
    description: "Large-format construction projects for public and institutional use.",
    location: "Multi-state",
    sector: "Urban Development",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop"
  },
  {
    category: "Industrial Plants",
    title: "Industrial Infrastructure Expansion",
    description: "Manufacturing and processing infrastructure across industrial corridors.",
    location: "Gujarat, Maharashtra, Tamil Nadu",
    sector: "Industrial Infrastructure",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1600&auto=format&fit=crop"
  }
];

// 5. Featured projects — basic discovery cards only (no risk/health data)
const featuredProjects = [
  {
    id: "PRJ-1024",
    name: "National Highway Development Project",
    sector: "Roads & Highways",
    location: "Tamil Nadu",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "PRJ-2048",
    name: "Integrated Industrial Plant",
    sector: "Industrial Infrastructure",
    location: "Gujarat",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1600&auto=format&fit=crop"
  },
  {
    id: "PRJ-3117",
    name: "Metropolitan Rail Corridor",
    sector: "Railways",
    location: "Maharashtra",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "PRJ-4029",
    name: "Coastal Port Modernisation",
    sector: "Ports",
    location: "Andhra Pradesh",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "PRJ-5183",
    name: "Regional Power Transmission Line",
    sector: "Power",
    location: "Rajasthan",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "PRJ-6205",
    name: "Urban Water Supply Augmentation",
    sector: "Water Resources",
    location: "Madhya Pradesh",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop"
  }
];
