
CREATE TABLE public.product_categories (
  slug text PRIMARY KEY,
  name text NOT NULL,
  short_name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  intro text NOT NULL DEFAULT '',
  image_url text,
  icon text NOT NULL DEFAULT 'Box',
  brands jsonb NOT NULL DEFAULT '[]'::jsonb,
  use_cases jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug text NOT NULL REFERENCES public.product_categories(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  name text NOT NULL,
  brand text NOT NULL DEFAULT '',
  highlight text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  price text,
  price_note text,
  billing_period text,
  min_months int,
  max_months int,
  in_stock boolean NOT NULL DEFAULT true,
  stock int NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_category ON public.products(category_slug, sort_order);

CREATE TABLE public.services (
  slug text PRIMARY KEY,
  name text NOT NULL,
  short_name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  intro text NOT NULL DEFAULT '',
  image_url text,
  icon text NOT NULL DEFAULT 'Wrench',
  included jsonb NOT NULL DEFAULT '[]'::jsonb,
  process jsonb NOT NULL DEFAULT '[]'::jsonb,
  industries jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_categories TO anon, authenticated;
GRANT ALL ON public.product_categories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "open write categories" ON public.product_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "open write products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "open write services" ON public.services FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_pc_touch BEFORE UPDATE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_p_touch  BEFORE UPDATE ON public.products           FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_s_touch  BEFORE UPDATE ON public.services           FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.product_categories (slug, name, short_name, tagline, intro, icon, brands, use_cases, sort_order) VALUES
('laptops-desktops','Laptops & Desktops','Laptops & Desktops','Business-grade endpoints, configured for your workforce.','From mobile field teams to engineering workstations — we supply, image and deploy laptops and desktops from Dell, Lenovo and HP with the warranty and lifecycle support enterprise IT requires.','Laptop','["Dell","Lenovo","HP","HPE"]','["Corporate workforce rollouts","Engineering & CAD workstations","Branch office standardization","Government tender supply"]',1),
('servers','Servers','Servers','Tower, rack and edge servers — scoped to your workload.','Dell PowerEdge and HPE ProLiant servers configured for virtualization, databases, file services and edge deployments. We size, supply, rack and commission to your environment.','Server','["Dell PowerEdge","HPE ProLiant","Lenovo ThinkSystem"]','["Virtualization & hypervisor hosts","Database & ERP back-ends","File, print & directory services","Branch / edge compute"]',2),
('networking','Networking','Networking','Switches, routers, firewalls and Wi-Fi — designed and deployed.','Cisco, Fortinet, TP-Link and Ubiquiti networking gear sized to your topology, then configured, deployed and documented with a clear handover.','Router','["Cisco","Fortinet","TP-Link","Ubiquiti","MikroTik"]','["Office LAN & structured cabling","Multi-site WAN & VPN","Firewall & UTM perimeter","Wi-Fi for offices and warehouses"]',3),
('cameras','IP Cameras & NVR','Cameras & NVR','IP video surveillance from camera to control room.','Site-surveyed surveillance design using UNV, Dahua and Hikvision IP cameras and NVR systems — installed, configured and integrated with remote viewing.','Camera','["UNV","Dahua","Hikvision","Axis"]','["Corporate office surveillance","Warehouse & perimeter security","Multi-branch centralized monitoring","Retail & ATM coverage"]',4),
('printers','Printers & Scanners','Printers & Scanners','Office productivity hardware — supplied and serviced.','Mono and color laser printers, multifunction devices and document scanners from HP, Epson and Brother. We supply, deploy and offer service contracts.','Printer','["HP","Epson","Brother","Canon"]','["Office printing fleets","High-volume document scanning","Corporate label & ID printing","Branch MFP rollouts"]',5),
('accessories','Accessories & Power','Accessories','Peripherals, storage and UPS — to complete every deployment.','Logitech, Plantronics, Transcend and APC accessories that pair with every laptop, desktop, server or network rollout.','Keyboard','["Logitech","Plantronics","Transcend","APC","Kingston"]','["End-user peripherals","UPS & power protection","Storage & memory upgrades","Conference room audio"]',6),
('software','Software & Licensing','Software','Genuine Microsoft & Adobe licenses — single seats or volume.','Authorized supply of Microsoft 365, Windows, Windows Server and Adobe Creative Cloud / Acrobat licenses. Buy a single license at list price, or request a volume quotation for 2 or more seats with tiered discounts.','AppWindow','["Microsoft","Adobe"]','["Single-user license purchase","Volume licensing for teams (2+ seats)","Corporate Microsoft 365 rollouts","Creative team Adobe Creative Cloud plans"]',7);

INSERT INTO public.products (category_slug, name, brand, highlight, specs, sort_order, in_stock, stock) VALUES
('laptops-desktops','Latitude 5550','Dell','Business mobility','["Intel Core i7 (14th Gen)","16 GB DDR5 RAM","512 GB NVMe SSD","15.6\" FHD display"]',1,true,10),
('laptops-desktops','ThinkPad T14 Gen 5','Lenovo','Durable productivity','["Intel Core i7 vPro","32 GB RAM (max 64 GB)","1 TB NVMe SSD","MIL-SPEC tested chassis"]',2,true,10),
('laptops-desktops','EliteBook 840 G11','HP','Executive-class','["Intel Core Ultra 7","16 GB LPDDR5","1 TB SSD","Wolf Security firmware"]',3,true,10),
('laptops-desktops','OptiPlex 7020 Tower','Dell','Office desktop','["Intel Core i5 (14th Gen)","16 GB RAM","512 GB SSD","3-year ProSupport"]',4,true,10),
('laptops-desktops','ThinkCentre M90s Gen 5','Lenovo','Compact SFF','["Intel Core i7","32 GB DDR5","1 TB SSD","Small form factor"]',5,true,10),
('laptops-desktops','Precision 3680 Tower','Dell','Workstation','["Intel Xeon W","64 GB ECC RAM","NVIDIA RTX A4000","ISV certified"]',6,true,10),
('laptops-desktops','ProBook 460 G11','HP','Volume deployment','["Intel Core 5 120U","16 GB DDR5","512 GB SSD","16\" display"]',7,true,10),
('laptops-desktops','ThinkPad X1 Carbon Gen 12','Lenovo','Executive ultralight','["Intel Core Ultra 7","32 GB LPDDR5x","1 TB SSD","Carbon fiber chassis"]',8,true,10),
('servers','PowerEdge R760','Dell','2U rack workhorse','["Dual Intel Xeon Scalable Gen 5","Up to 8 TB DDR5","iDRAC 9 with Lifecycle Controller","Redundant PSU"]',1,true,5),
('servers','PowerEdge R660xs','Dell','Dense compute','["1U dual-socket","Up to 32 cores per socket","10x 2.5\" NVMe bays","Smart cooling"]',2,true,5),
('servers','ProLiant DL380 Gen11','HPE','Enterprise standard','["Dual Xeon Scalable","Up to 8 TB DDR5","iLO 6 management","OneView integration"]',3,true,5),
('servers','ProLiant DL360 Gen11','HPE','1U flexibility','["Compact 1U form","Dual-socket Xeon","GPU-ready","Silicon Root of Trust"]',4,true,5),
('servers','PowerEdge T560','Dell','Tower / branch office','["Quiet tower form","Dual Xeon Scalable","32 DIMM slots","GPU expansion"]',5,true,5),
('servers','ThinkSystem SR650 V3','Lenovo','Hybrid cloud','["2U dual-socket","Up to 8 GPUs","XClarity management","Liquid cooling option"]',6,true,5),
('networking','Catalyst 9300 Series','Cisco','Enterprise access switch','["24 / 48 port options","PoE+ / UPOE","Cisco DNA ready","StackWise-480"]',1,true,10),
('networking','Meraki MS125','Cisco','Cloud-managed','["Layer 2 access","Full PoE+ models","Single-pane management","Zero-touch provisioning"]',2,true,10),
('networking','FortiGate 100F','Fortinet','NGFW for mid-office','["Threat Prevention 1 Gbps+","SD-WAN built-in","FortiGuard subscriptions","10 / 1 GbE ports"]',3,true,10),
('networking','FortiGate 60F','Fortinet','Branch firewall','["Compact desktop NGFW","Integrated SD-WAN","Wi-Fi 6 model option","Cloud security fabric"]',4,true,10),
('networking','UniFi Dream Machine Pro','Ubiquiti','All-in-one gateway','["Routing, switching & UI mgmt","10G SFP+ WAN","Threat detection","Rack mount"]',5,true,10),
('networking','Omada ER7206','TP-Link','SMB SD-WAN router','["Multi-WAN load balance","VPN concentrator","Cloud management","Gigabit ports"]',6,true,10),
('cameras','IPC2124SR3-ADPF28M','UNV','4MP bullet','["4 MP resolution","30 m IR range","IP67 weather rated","PoE powered"]',1,true,20),
('cameras','IPC-HDW2849T-S-IL','Dahua','8MP full-color dome','["WizSense AI","Smart Dual Light","Built-in mic","PoE"]',2,true,20),
('cameras','DS-2CD2143G2-I','Hikvision','4MP AcuSense dome','["AcuSense human / vehicle filter","30 m IR","Audio & alarm I/O","IP67"]',3,true,20),
('cameras','NVR302-16E2-P16','UNV','16-channel PoE NVR','["16 PoE ports","Up to 8 MP per channel","Dual HDD bays","Mobile / web access"]',4,true,10),
('cameras','NVR4216-16P-4KS3','Dahua','16-channel 4K NVR','["16 PoE channels","4K HDMI / VGA","AI-by-Recorder","Dual HDD"]',5,true,10),
('cameras','DS-7616NXI-I2/16P/S','Hikvision','AcuSense NVR','["16 PoE channels","AcuSense analytics","RAID 0/1/5/10","4K output"]',6,true,10),
('printers','LaserJet Pro MFP 4103fdw','HP','Mono MFP','["Print, scan, copy, fax","Up to 42 ppm","Duplex + ADF","Wi-Fi / Ethernet"]',1,true,10),
('printers','Color LaserJet Pro 4303dw','HP','Color workgroup','["Up to 35 ppm color","Duplex print","Auto on / off","Smart app support"]',2,true,10),
('printers','EcoTank L15180','Epson','A3 ink tank MFP','["A3 print & scan","Ultra-low CPP","Duplex ADF","PrecisionCore head"]',3,true,10),
('printers','MFC-L8900CDW','Brother','Color office MFP','["Up to 33 ppm","Duplex print / scan","NFC tap-to-print","Secure Print+"]',4,true,10),
('printers','WorkForce DS-770II','Epson','Document scanner','["45 ppm / 90 ipm","100-sheet ADF","Daily duty 7,000 pages","TWAIN / ISIS"]',5,true,10),
('printers','imageFORMULA DR-C240','Canon','Compact scanner','["45 ppm color duplex","60-sheet ADF","Front + rear feed","CaptureOnTouch"]',6,true,10),
('accessories','MX Keys S + MX Master 3S','Logitech','Executive desk set','["Bluetooth + USB receiver","Multi-device pairing","Backlit keys","Quiet click mouse"]',1,true,20),
('accessories','Voyager Focus 2 UC','Plantronics / Poly','Active noise cancelling headset','["Hybrid ANC","Teams / Zoom certified","Acoustic Fence mic","USB-A / BT"]',2,true,20),
('accessories','JetDrive 855 1 TB','Transcend','NVMe SSD','["PCIe Gen 3 x4","Up to 1,600 MB/s read","5-year warranty","M.2 2280"]',3,true,20),
('accessories','Smart-UPS SRT 3000VA','APC','Online double-conversion UPS','["3000 VA / 2700 W","Pure sine wave","LCD + network mgmt","Rack / tower"]',4,true,10),
('accessories','Back-UPS Pro BR1500MS','APC','Workstation UPS','["1500 VA / 900 W","AVR voltage regulation","USB charging","LCD status"]',5,true,10),
('accessories','DataTraveler Max 256 GB','Kingston','USB-C flash drive','["USB 3.2 Gen 2","1,000 MB/s read","Cap-less design","5-year warranty"]',6,true,20);

INSERT INTO public.products (category_slug, name, brand, highlight, specs, price, price_note, billing_period, min_months, max_months, sort_order, in_stock, stock) VALUES
('software','Microsoft 365 Business Standard','Microsoft','Office apps + Teams + 1 TB OneDrive','["Word, Excel, PowerPoint, Outlook","Microsoft Teams & SharePoint","1 TB OneDrive per user","Web + desktop + mobile apps"]','$150 / user / year','Single seat. 2+ seats: request quotation.','per-user-per-year',1,12,1,true,999),
('software','Microsoft 365 Business Premium','Microsoft','Business Standard + advanced security','["Everything in Business Standard","Intune device management","Defender for Business","Information protection"]','$264 / user / year','Single seat. 2+ seats: request quotation.','per-user-per-year',1,12,2,true,999),
('software','Microsoft 365 Apps for Business','Microsoft','Desktop Office apps only','["Word, Excel, PowerPoint, Outlook","1 TB OneDrive per user","Install on 5 PCs / Macs","No Teams / Exchange"]','$99 / user / year','Single seat. 2+ seats: request quotation.','per-user-per-year',1,12,3,true,999),
('software','Windows 11 Pro','Microsoft','Perpetual OEM / retail license','["Domain join & Group Policy","BitLocker encryption","Hyper-V virtualization","Windows Update for Business"]','$199 one-time','Single license. Bulk: request quotation.','one-time',null,null,4,true,999),
('software','Windows Server 2022 Standard','Microsoft','Server OS — 16 core license','["16 core base license","2 OSEs / Hyper-V containers","CALs sold separately","Perpetual license"]','$1,069 one-time','Excl. CALs. Bulk / with CALs: request quotation.','one-time',null,null,5,true,999),
('software','Microsoft 365 E3','Microsoft','Enterprise plan with EMS','["Full Office desktop apps","Enterprise Mobility + Security","Azure AD Premium P1","Advanced compliance"]','$432 / user / year','Single seat. Enterprise volume: request quotation.','per-user-per-year',1,12,6,true,999),
('software','Adobe Creative Cloud All Apps — Teams','Adobe','20+ creative apps for teams','["Photoshop, Illustrator, Premiere Pro","InDesign, After Effects, Lightroom","100 GB cloud storage","Admin console + license reassign"]','$1,080 / license / year','Single license. 2+ licenses: request quotation.','per-user-per-year',1,12,7,true,999),
('software','Adobe Creative Cloud Pro — Teams','Adobe','All Apps + Firefly Pro + Substance','["Everything in All Apps","Firefly generative AI (Pro credits)","Substance 3D collection","Priority support"]','$1,200 / license / year','Single license. 2+ licenses: request quotation.','per-user-per-year',1,12,8,true,999),
('software','Adobe Acrobat Pro — Teams','Adobe','PDF editing, e-sign & collaboration','["Edit, convert, export PDFs","E-signatures (Adobe Sign)","Redaction & protection","Admin console management"]','$288 / license / year','Single license. 2+ licenses: request quotation.','per-user-per-year',1,12,9,true,999),
('software','Adobe Photoshop — Teams (Single App)','Adobe','Photoshop only for teams','["Photoshop desktop + iPad","100 GB cloud storage","Adobe Fonts included","Admin console"]','$456 / license / year','Single license. 2+ licenses: request quotation.','per-user-per-year',1,12,10,true,999),
('software','Adobe Illustrator — Teams (Single App)','Adobe','Vector design for teams','["Illustrator desktop + iPad","100 GB cloud storage","Adobe Fonts included","Admin console"]','$456 / license / year','Single license. 2+ licenses: request quotation.','per-user-per-year',1,12,11,true,999),
('software','Adobe Substance 3D Collection — Teams','Adobe','3D texturing, modelling & rendering','["Painter, Designer, Sampler, Stager","Modeler & 3D Assets","100 GB cloud storage","Admin console"]','$1,200 / license / year','Single license. 2+ licenses: request quotation.','per-user-per-year',1,12,12,true,999);

INSERT INTO public.services (slug, name, short_name, tagline, intro, icon, included, process, industries, sort_order) VALUES
('cctv','CCTV & IP Surveillance','CCTV & Surveillance','End-to-end IP video surveillance — designed, installed, monitored.','From a single-camera retail point to a multi-site corporate estate, we design surveillance to your coverage requirements, install on schedule and hand over a managed system with remote viewing.','Video',
 '["On-site survey and coverage planning","Camera, NVR and storage sizing","Cabling, mounting and power","NVR / VMS configuration and user roles","Remote viewing via web and mobile apps","Health monitoring and preventive maintenance"]',
 '[{"step":"01","title":"Site Survey","desc":"We walk the site, map coverage zones, identify blind spots and document cabling routes."},{"step":"02","title":"Design & Quote","desc":"Camera mix, NVR capacity, storage retention and licensing — proposed with a clear bill of materials."},{"step":"03","title":"Install & Configure","desc":"Cabling, mounting, NVR setup, user accounts and mobile access — delivered on agreed dates."},{"step":"04","title":"Handover & Support","desc":"Operator training, documentation pack and an optional AMC for ongoing maintenance."}]',
 '["Corporate offices","Warehousing & logistics","Retail chains","Banking & ATMs","Education campuses"]', 1),
('networking','Networking Solutions','Networking','Office LAN, structured cabling, firewalls and Wi-Fi — engineered.','Whether you are wiring a new floor, segmenting a growing office, or rolling out SD-WAN across branches, we plan and deploy with documented configurations and a clean handover.','Network',
 '["Office LAN and structured cabling","Switching, routing and VLAN design","Firewall / UTM deployment and policy","Site-to-site and remote-access VPN","Wi-Fi planning and coverage validation","Network documentation and labelling"]',
 '[{"step":"01","title":"Discovery","desc":"Existing topology, growth plans, security posture and business-critical applications are mapped."},{"step":"02","title":"Design","desc":"VLAN scheme, IP plan, firewall rule set and Wi-Fi cell plan documented before any equipment ships."},{"step":"03","title":"Deploy","desc":"Staged cutover with rollback plan, configurations versioned, change windows agreed."},{"step":"04","title":"Document & Support","desc":"As-built diagrams, configs and runbooks delivered. Optional managed support."}]',
 '["Multi-branch enterprises","Government offices","Hospitals & clinics","Manufacturing plants","Hospitality"]', 2),
('it-support','IT Support & Maintenance','IT Support','Annual maintenance contracts with measurable response SLAs.','Predictable IT support for organizations that need uptime without staffing a full internal team — endpoint, server and network coverage with documented response times.','Wrench',
 '["Annual maintenance contracts (AMC)","Remote and on-site troubleshooting","Endpoint and server optimization","Patch management and updates","IT security audit and hardening","Quarterly health reporting"]',
 '[{"step":"01","title":"Scope & Baseline","desc":"Asset inventory, ticket categories and SLA tiers agreed in writing."},{"step":"02","title":"Onboarding","desc":"Remote monitoring, patching agents and ticketing access deployed across in-scope devices."},{"step":"03","title":"Operate","desc":"Defined response times, monthly status reporting and a named account engineer."},{"step":"04","title":"Improve","desc":"Quarterly reviews highlight recurring issues and recommend upgrades or process changes."}]',
 '["SME corporates","Professional services firms","Healthcare practices","Educational institutes","NGOs"]', 3),
('corporate-supply','Corporate IT Supply','Corporate Supply','Bulk procurement, custom configuration and staged delivery.','Enterprise and government procurement at scale — laptops, desktops, servers and accessories sourced, imaged, asset-tagged and delivered on your rollout schedule.','Building2',
 '["Bulk laptop, desktop and server supply","Government and enterprise tender response","Custom OS imaging and software loadout","Asset tagging and serial logging","Staged delivery aligned to floor / site rollout","Warranty registration and after-sales handling"]',
 '[{"step":"01","title":"Requirement","desc":"Quantity, configuration, delivery schedule and budget agreed in a written quotation."},{"step":"02","title":"Sourcing","desc":"Stock confirmed with authorized distributors and lead times locked."},{"step":"03","title":"Configure & Tag","desc":"Imaging, software loadout, asset tags and serial register prepared before dispatch."},{"step":"04","title":"Deliver & Support","desc":"Staged delivery, sign-off per batch and warranty register handed over."}]',
 '["Government departments","Banking & financial services","Telecom operators","Large corporates","Educational institutes"]', 4);
