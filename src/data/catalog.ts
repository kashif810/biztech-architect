import { Laptop, Server, Router, Camera, Printer, Keyboard, Video, Network, Wrench, Building2, AppWindow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import laptopsImg from "@/assets/products/laptops-desktops.jpg";
import serversImg from "@/assets/products/servers.jpg";
import networkingImg from "@/assets/products/networking.jpg";
import camerasImg from "@/assets/products/cameras.jpg";
import printersImg from "@/assets/products/printers.jpg";
import accessoriesImg from "@/assets/products/accessories.jpg";
import softwareImg from "@/assets/products/software.jpg";

import cctvSvc from "@/assets/services/cctv.jpg";
import netSvc from "@/assets/services/networking.jpg";
import supportSvc from "@/assets/services/it-support.jpg";
import supplySvc from "@/assets/services/corporate-supply.jpg";

export type FeaturedItem = {
  name: string;
  brand: string;
  highlight: string;
  specs: string[];
  price?: string;
  priceNote?: string;
};

export type ProductCategory = {
  slug: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  image: string;
  tagline: string;
  intro: string;
  brands: string[];
  useCases: string[];
  featured: FeaturedItem[];
};

export const productCategories: ProductCategory[] = [
  {
    slug: "laptops-desktops",
    name: "Laptops & Desktops",
    shortName: "Laptops & Desktops",
    icon: Laptop,
    image: laptopsImg,
    tagline: "Business-grade endpoints, configured for your workforce.",
    intro:
      "From mobile field teams to engineering workstations — we supply, image and deploy laptops and desktops from Dell, Lenovo and HP with the warranty and lifecycle support enterprise IT requires.",
    brands: ["Dell", "Lenovo", "HP", "HPE"],
    useCases: [
      "Corporate workforce rollouts",
      "Engineering & CAD workstations",
      "Branch office standardization",
      "Government tender supply",
    ],
    featured: [
      { name: "Latitude 5550", brand: "Dell", highlight: "Business mobility", specs: ["Intel Core i7 (14th Gen)", "16 GB DDR5 RAM", "512 GB NVMe SSD", "15.6\" FHD display"] },
      { name: "ThinkPad T14 Gen 5", brand: "Lenovo", highlight: "Durable productivity", specs: ["Intel Core i7 vPro", "32 GB RAM (max 64 GB)", "1 TB NVMe SSD", "MIL-SPEC tested chassis"] },
      { name: "EliteBook 840 G11", brand: "HP", highlight: "Executive-class", specs: ["Intel Core Ultra 7", "16 GB LPDDR5", "1 TB SSD", "Wolf Security firmware"] },
      { name: "OptiPlex 7020 Tower", brand: "Dell", highlight: "Office desktop", specs: ["Intel Core i5 (14th Gen)", "16 GB RAM", "512 GB SSD", "3-year ProSupport"] },
      { name: "ThinkCentre M90s Gen 5", brand: "Lenovo", highlight: "Compact SFF", specs: ["Intel Core i7", "32 GB DDR5", "1 TB SSD", "Small form factor"] },
      { name: "Precision 3680 Tower", brand: "Dell", highlight: "Workstation", specs: ["Intel Xeon W", "64 GB ECC RAM", "NVIDIA RTX A4000", "ISV certified"] },
      { name: "ProBook 460 G11", brand: "HP", highlight: "Volume deployment", specs: ["Intel Core 5 120U", "16 GB DDR5", "512 GB SSD", "16\" display"] },
      { name: "ThinkPad X1 Carbon Gen 12", brand: "Lenovo", highlight: "Executive ultralight", specs: ["Intel Core Ultra 7", "32 GB LPDDR5x", "1 TB SSD", "Carbon fiber chassis"] },
    ],
  },
  {
    slug: "servers",
    name: "Servers",
    shortName: "Servers",
    icon: Server,
    image: serversImg,
    tagline: "Tower, rack and edge servers — scoped to your workload.",
    intro:
      "Dell PowerEdge and HPE ProLiant servers configured for virtualization, databases, file services and edge deployments. We size, supply, rack and commission to your environment.",
    brands: ["Dell PowerEdge", "HPE ProLiant", "Lenovo ThinkSystem"],
    useCases: [
      "Virtualization & hypervisor hosts",
      "Database & ERP back-ends",
      "File, print & directory services",
      "Branch / edge compute",
    ],
    featured: [
      { name: "PowerEdge R760", brand: "Dell", highlight: "2U rack workhorse", specs: ["Dual Intel Xeon Scalable Gen 5", "Up to 8 TB DDR5", "iDRAC 9 with Lifecycle Controller", "Redundant PSU"] },
      { name: "PowerEdge R660xs", brand: "Dell", highlight: "Dense compute", specs: ["1U dual-socket", "Up to 32 cores per socket", "10x 2.5\" NVMe bays", "Smart cooling"] },
      { name: "ProLiant DL380 Gen11", brand: "HPE", highlight: "Enterprise standard", specs: ["Dual Xeon Scalable", "Up to 8 TB DDR5", "iLO 6 management", "OneView integration"] },
      { name: "ProLiant DL360 Gen11", brand: "HPE", highlight: "1U flexibility", specs: ["Compact 1U form", "Dual-socket Xeon", "GPU-ready", "Silicon Root of Trust"] },
      { name: "PowerEdge T560", brand: "Dell", highlight: "Tower / branch office", specs: ["Quiet tower form", "Dual Xeon Scalable", "32 DIMM slots", "GPU expansion"] },
      { name: "ThinkSystem SR650 V3", brand: "Lenovo", highlight: "Hybrid cloud", specs: ["2U dual-socket", "Up to 8 GPUs", "XClarity management", "Liquid cooling option"] },
    ],
  },
  {
    slug: "networking",
    name: "Networking",
    shortName: "Networking",
    icon: Router,
    image: networkingImg,
    tagline: "Switches, routers, firewalls and Wi-Fi — designed and deployed.",
    intro:
      "Cisco, Fortinet, TP-Link and Ubiquiti networking gear sized to your topology, then configured, deployed and documented with a clear handover.",
    brands: ["Cisco", "Fortinet", "TP-Link", "Ubiquiti", "MikroTik"],
    useCases: [
      "Office LAN & structured cabling",
      "Multi-site WAN & VPN",
      "Firewall & UTM perimeter",
      "Wi-Fi for offices and warehouses",
    ],
    featured: [
      { name: "Catalyst 9300 Series", brand: "Cisco", highlight: "Enterprise access switch", specs: ["24 / 48 port options", "PoE+ / UPOE", "Cisco DNA ready", "StackWise-480"] },
      { name: "Meraki MS125", brand: "Cisco", highlight: "Cloud-managed", specs: ["Layer 2 access", "Full PoE+ models", "Single-pane management", "Zero-touch provisioning"] },
      { name: "FortiGate 100F", brand: "Fortinet", highlight: "NGFW for mid-office", specs: ["Threat Prevention 1 Gbps+", "SD-WAN built-in", "FortiGuard subscriptions", "10 / 1 GbE ports"] },
      { name: "FortiGate 60F", brand: "Fortinet", highlight: "Branch firewall", specs: ["Compact desktop NGFW", "Integrated SD-WAN", "Wi-Fi 6 model option", "Cloud security fabric"] },
      { name: "UniFi Dream Machine Pro", brand: "Ubiquiti", highlight: "All-in-one gateway", specs: ["Routing, switching & UI mgmt", "10G SFP+ WAN", "Threat detection", "Rack mount"] },
      { name: "Omada ER7206", brand: "TP-Link", highlight: "SMB SD-WAN router", specs: ["Multi-WAN load balance", "VPN concentrator", "Cloud management", "Gigabit ports"] },
    ],
  },
  {
    slug: "cameras",
    name: "IP Cameras & NVR",
    shortName: "Cameras & NVR",
    icon: Camera,
    image: camerasImg,
    tagline: "IP video surveillance from camera to control room.",
    intro:
      "Site-surveyed surveillance design using UNV, Dahua and Hikvision IP cameras and NVR systems — installed, configured and integrated with remote viewing.",
    brands: ["UNV", "Dahua", "Hikvision", "Axis"],
    useCases: [
      "Corporate office surveillance",
      "Warehouse & perimeter security",
      "Multi-branch centralized monitoring",
      "Retail & ATM coverage",
    ],
    featured: [
      { name: "IPC2124SR3-ADPF28M", brand: "UNV", highlight: "4MP bullet", specs: ["4 MP resolution", "30 m IR range", "IP67 weather rated", "PoE powered"] },
      { name: "IPC-HDW2849T-S-IL", brand: "Dahua", highlight: "8MP full-color dome", specs: ["WizSense AI", "Smart Dual Light", "Built-in mic", "PoE"] },
      { name: "DS-2CD2143G2-I", brand: "Hikvision", highlight: "4MP AcuSense dome", specs: ["AcuSense human / vehicle filter", "30 m IR", "Audio & alarm I/O", "IP67"] },
      { name: "NVR302-16E2-P16", brand: "UNV", highlight: "16-channel PoE NVR", specs: ["16 PoE ports", "Up to 8 MP per channel", "Dual HDD bays", "Mobile / web access"] },
      { name: "NVR4216-16P-4KS3", brand: "Dahua", highlight: "16-channel 4K NVR", specs: ["16 PoE channels", "4K HDMI / VGA", "AI-by-Recorder", "Dual HDD"] },
      { name: "DS-7616NXI-I2/16P/S", brand: "Hikvision", highlight: "AcuSense NVR", specs: ["16 PoE channels", "AcuSense analytics", "RAID 0/1/5/10", "4K output"] },
    ],
  },
  {
    slug: "printers",
    name: "Printers & Scanners",
    shortName: "Printers & Scanners",
    icon: Printer,
    image: printersImg,
    tagline: "Office productivity hardware — supplied and serviced.",
    intro:
      "Mono and color laser printers, multifunction devices and document scanners from HP, Epson and Brother. We supply, deploy and offer service contracts.",
    brands: ["HP", "Epson", "Brother", "Canon"],
    useCases: [
      "Office printing fleets",
      "High-volume document scanning",
      "Corporate label & ID printing",
      "Branch MFP rollouts",
    ],
    featured: [
      { name: "LaserJet Pro MFP 4103fdw", brand: "HP", highlight: "Mono MFP", specs: ["Print, scan, copy, fax", "Up to 42 ppm", "Duplex + ADF", "Wi-Fi / Ethernet"] },
      { name: "Color LaserJet Pro 4303dw", brand: "HP", highlight: "Color workgroup", specs: ["Up to 35 ppm color", "Duplex print", "Auto on / off", "Smart app support"] },
      { name: "EcoTank L15180", brand: "Epson", highlight: "A3 ink tank MFP", specs: ["A3 print & scan", "Ultra-low CPP", "Duplex ADF", "PrecisionCore head"] },
      { name: "MFC-L8900CDW", brand: "Brother", highlight: "Color office MFP", specs: ["Up to 33 ppm", "Duplex print / scan", "NFC tap-to-print", "Secure Print+"] },
      { name: "WorkForce DS-770II", brand: "Epson", highlight: "Document scanner", specs: ["45 ppm / 90 ipm", "100-sheet ADF", "Daily duty 7,000 pages", "TWAIN / ISIS"] },
      { name: "imageFORMULA DR-C240", brand: "Canon", highlight: "Compact scanner", specs: ["45 ppm color duplex", "60-sheet ADF", "Front + rear feed", "CaptureOnTouch"] },
    ],
  },
  {
    slug: "accessories",
    name: "Accessories & Power",
    shortName: "Accessories",
    icon: Keyboard,
    image: accessoriesImg,
    tagline: "Peripherals, storage and UPS — to complete every deployment.",
    intro:
      "Logitech, Plantronics, Transcend and APC accessories that pair with every laptop, desktop, server or network rollout.",
    brands: ["Logitech", "Plantronics", "Transcend", "APC", "Kingston"],
    useCases: [
      "End-user peripherals",
      "UPS & power protection",
      "Storage & memory upgrades",
      "Conference room audio",
    ],
    featured: [
      { name: "MX Keys S + MX Master 3S", brand: "Logitech", highlight: "Executive desk set", specs: ["Bluetooth + USB receiver", "Multi-device pairing", "Backlit keys", "Quiet click mouse"] },
      { name: "Voyager Focus 2 UC", brand: "Plantronics / Poly", highlight: "Active noise cancelling headset", specs: ["Hybrid ANC", "Teams / Zoom certified", "Acoustic Fence mic", "USB-A / BT"] },
      { name: "JetDrive 855 1 TB", brand: "Transcend", highlight: "NVMe SSD", specs: ["PCIe Gen 3 x4", "Up to 1,600 MB/s read", "5-year warranty", "M.2 2280"] },
      { name: "Smart-UPS SRT 3000VA", brand: "APC", highlight: "Online double-conversion UPS", specs: ["3000 VA / 2700 W", "Pure sine wave", "LCD + network mgmt", "Rack / tower"] },
      { name: "Back-UPS Pro BR1500MS", brand: "APC", highlight: "Workstation UPS", specs: ["1500 VA / 900 W", "AVR voltage regulation", "USB charging", "LCD status"] },
      { name: "DataTraveler Max 256 GB", brand: "Kingston", highlight: "USB-C flash drive", specs: ["USB 3.2 Gen 2", "1,000 MB/s read", "Cap-less design", "5-year warranty"] },
    ],
  },
  {
    slug: "software",
    name: "Software & Licensing",
    shortName: "Software",
    icon: AppWindow,
    image: softwareImg,
    tagline: "Genuine Microsoft & Adobe licenses — single seats or volume.",
    intro:
      "Authorized supply of Microsoft 365, Windows, Windows Server and Adobe Creative Cloud / Acrobat licenses. Buy a single license at list price, or request a volume quotation for 2 or more seats with tiered discounts.",
    brands: ["Microsoft", "Adobe"],
    useCases: [
      "Single-user license purchase",
      "Volume licensing for teams (2+ seats)",
      "Corporate Microsoft 365 rollouts",
      "Creative team Adobe Creative Cloud plans",
    ],
    featured: [
      { name: "Microsoft 365 Business Standard", brand: "Microsoft", highlight: "Office apps + Teams + 1 TB OneDrive", specs: ["Word, Excel, PowerPoint, Outlook", "Microsoft Teams & SharePoint", "1 TB OneDrive per user", "Web + desktop + mobile apps"], price: "$150 / user / year", priceNote: "Single seat. 2+ seats: request quotation." },
      { name: "Microsoft 365 Business Premium", brand: "Microsoft", highlight: "Business Standard + advanced security", specs: ["Everything in Business Standard", "Intune device management", "Defender for Business", "Information protection"], price: "$264 / user / year", priceNote: "Single seat. 2+ seats: request quotation." },
      { name: "Microsoft 365 Apps for Business", brand: "Microsoft", highlight: "Desktop Office apps only", specs: ["Word, Excel, PowerPoint, Outlook", "1 TB OneDrive per user", "Install on 5 PCs / Macs", "No Teams / Exchange"], price: "$99 / user / year", priceNote: "Single seat. 2+ seats: request quotation." },
      { name: "Windows 11 Pro", brand: "Microsoft", highlight: "Perpetual OEM / retail license", specs: ["Domain join & Group Policy", "BitLocker encryption", "Hyper-V virtualization", "Windows Update for Business"], price: "$199 one-time", priceNote: "Single license. Bulk: request quotation." },
      { name: "Windows Server 2022 Standard", brand: "Microsoft", highlight: "Server OS — 16 core license", specs: ["16 core base license", "2 OSEs / Hyper-V containers", "CALs sold separately", "Perpetual license"], price: "$1,069 one-time", priceNote: "Excl. CALs. Bulk / with CALs: request quotation." },
      { name: "Microsoft 365 E3", brand: "Microsoft", highlight: "Enterprise plan with EMS", specs: ["Full Office desktop apps", "Enterprise Mobility + Security", "Azure AD Premium P1", "Advanced compliance"], price: "$432 / user / year", priceNote: "Single seat. Enterprise volume: request quotation." },
      { name: "Adobe Creative Cloud All Apps — Teams", brand: "Adobe", highlight: "20+ creative apps for teams", specs: ["Photoshop, Illustrator, Premiere Pro", "InDesign, After Effects, Lightroom", "100 GB cloud storage", "Admin console + license reassign"], price: "$1,080 / license / year", priceNote: "Single license. 2+ licenses: request quotation." },
      { name: "Adobe Creative Cloud Pro — Teams", brand: "Adobe", highlight: "All Apps + Firefly Pro + Substance", specs: ["Everything in All Apps", "Firefly generative AI (Pro credits)", "Substance 3D collection", "Priority support"], price: "$1,200 / license / year", priceNote: "Single license. 2+ licenses: request quotation." },
      { name: "Adobe Acrobat Pro — Teams", brand: "Adobe", highlight: "PDF editing, e-sign & collaboration", specs: ["Edit, convert, export PDFs", "E-signatures (Adobe Sign)", "Redaction & protection", "Admin console management"], price: "$288 / license / year", priceNote: "Single license. 2+ licenses: request quotation." },
      { name: "Adobe Photoshop — Teams (Single App)", brand: "Adobe", highlight: "Photoshop only for teams", specs: ["Photoshop desktop + iPad", "100 GB cloud storage", "Adobe Fonts included", "Admin console"], price: "$456 / license / year", priceNote: "Single license. 2+ licenses: request quotation." },
      { name: "Adobe Illustrator — Teams (Single App)", brand: "Adobe", highlight: "Vector design for teams", specs: ["Illustrator desktop + iPad", "100 GB cloud storage", "Adobe Fonts included", "Admin console"], price: "$456 / license / year", priceNote: "Single license. 2+ licenses: request quotation." },
      { name: "Adobe Substance 3D Collection — Teams", brand: "Adobe", highlight: "3D texturing, modelling & rendering", specs: ["Painter, Designer, Sampler, Stager", "Modeler & 3D Assets", "100 GB cloud storage", "Admin console"], price: "$1,200 / license / year", priceNote: "Single license. 2+ licenses: request quotation." },
    ],
  },
];

export type ServiceDetail = {
  slug: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  image: string;
  tagline: string;
  intro: string;
  included: string[];
  process: { step: string; title: string; desc: string }[];
  industries: string[];
};

export const services: ServiceDetail[] = [
  {
    slug: "cctv",
    name: "CCTV & IP Surveillance",
    shortName: "CCTV & Surveillance",
    icon: Video,
    image: cctvSvc,
    tagline: "End-to-end IP video surveillance — designed, installed, monitored.",
    intro:
      "From a single-camera retail point to a multi-site corporate estate, we design surveillance to your coverage requirements, install on schedule and hand over a managed system with remote viewing.",
    included: [
      "On-site survey and coverage planning",
      "Camera, NVR and storage sizing",
      "Cabling, mounting and power",
      "NVR / VMS configuration and user roles",
      "Remote viewing via web and mobile apps",
      "Health monitoring and preventive maintenance",
    ],
    process: [
      { step: "01", title: "Site Survey", desc: "We walk the site, map coverage zones, identify blind spots and document cabling routes." },
      { step: "02", title: "Design & Quote", desc: "Camera mix, NVR capacity, storage retention and licensing — proposed with a clear bill of materials." },
      { step: "03", title: "Install & Configure", desc: "Cabling, mounting, NVR setup, user accounts and mobile access — delivered on agreed dates." },
      { step: "04", title: "Handover & Support", desc: "Operator training, documentation pack and an optional AMC for ongoing maintenance." },
    ],
    industries: ["Corporate offices", "Warehousing & logistics", "Retail chains", "Banking & ATMs", "Education campuses"],
  },
  {
    slug: "networking",
    name: "Networking Solutions",
    shortName: "Networking",
    icon: Network,
    image: netSvc,
    tagline: "Office LAN, structured cabling, firewalls and Wi-Fi — engineered.",
    intro:
      "Whether you are wiring a new floor, segmenting a growing office, or rolling out SD-WAN across branches, we plan and deploy with documented configurations and a clean handover.",
    included: [
      "Office LAN and structured cabling",
      "Switching, routing and VLAN design",
      "Firewall / UTM deployment and policy",
      "Site-to-site and remote-access VPN",
      "Wi-Fi planning and coverage validation",
      "Network documentation and labelling",
    ],
    process: [
      { step: "01", title: "Discovery", desc: "Existing topology, growth plans, security posture and business-critical applications are mapped." },
      { step: "02", title: "Design", desc: "VLAN scheme, IP plan, firewall rule set and Wi-Fi cell plan documented before any equipment ships." },
      { step: "03", title: "Deploy", desc: "Staged cutover with rollback plan, configurations versioned, change windows agreed." },
      { step: "04", title: "Document & Support", desc: "As-built diagrams, configs and runbooks delivered. Optional managed support." },
    ],
    industries: ["Multi-branch enterprises", "Government offices", "Hospitals & clinics", "Manufacturing plants", "Hospitality"],
  },
  {
    slug: "it-support",
    name: "IT Support & Maintenance",
    shortName: "IT Support",
    icon: Wrench,
    image: supportSvc,
    tagline: "Annual maintenance contracts with measurable response SLAs.",
    intro:
      "Predictable IT support for organizations that need uptime without staffing a full internal team — endpoint, server and network coverage with documented response times.",
    included: [
      "Annual maintenance contracts (AMC)",
      "Remote and on-site troubleshooting",
      "Endpoint and server optimization",
      "Patch management and updates",
      "IT security audit and hardening",
      "Quarterly health reporting",
    ],
    process: [
      { step: "01", title: "Scope & Baseline", desc: "Asset inventory, ticket categories and SLA tiers agreed in writing." },
      { step: "02", title: "Onboarding", desc: "Remote monitoring, patching agents and ticketing access deployed across in-scope devices." },
      { step: "03", title: "Operate", desc: "Defined response times, monthly status reporting and a named account engineer." },
      { step: "04", title: "Improve", desc: "Quarterly reviews highlight recurring issues and recommend upgrades or process changes." },
    ],
    industries: ["SME corporates", "Professional services firms", "Healthcare practices", "Educational institutes", "NGOs"],
  },
  {
    slug: "corporate-supply",
    name: "Corporate IT Supply",
    shortName: "Corporate Supply",
    icon: Building2,
    image: supplySvc,
    tagline: "Bulk procurement, custom configuration and staged delivery.",
    intro:
      "Enterprise and government procurement at scale — laptops, desktops, servers and accessories sourced, imaged, asset-tagged and delivered on your rollout schedule.",
    included: [
      "Bulk laptop, desktop and server supply",
      "Government and enterprise tender response",
      "Custom OS imaging and software loadout",
      "Asset tagging and serial logging",
      "Staged delivery aligned to floor / site rollout",
      "Warranty registration and after-sales handling",
    ],
    process: [
      { step: "01", title: "Requirement", desc: "Quantity, configuration, delivery schedule and budget agreed in a written quotation." },
      { step: "02", title: "Sourcing", desc: "Stock confirmed with authorized distributors and lead times locked." },
      { step: "03", title: "Configure & Tag", desc: "Imaging, software loadout, asset tags and serial register prepared before dispatch." },
      { step: "04", title: "Deliver & Support", desc: "Staged delivery, sign-off per batch and warranty register handed over." },
    ],
    industries: ["Government departments", "Banking & financial services", "Telecom operators", "Large corporates", "Educational institutes"],
  },
];

export const findProduct = (slug: string) => productCategories.find((c) => c.slug === slug);
export const findService = (slug: string) => services.find((s) => s.slug === slug);