
INSERT INTO contractors(name,contact_email,phone,address) VALUES ('Bharat Infra Projects','contracts@bharatinfra.example','+91 90000 10001','New Delhi'),('National Build Systems','projects@nbs.example','+91 90000 10002','Mumbai'),('Eastern Engineering Works','ops@eew.example','+91 90000 10003','Kolkata'),('Deccan Infrastructure Ltd','admin@deccaninfra.example','+91 90000 10004','Hyderabad'),('Northline Projects','office@northline.example','+91 90000 10005','Guwahati') ON CONFLICT DO NOTHING;
INSERT INTO officers(name,designation,email,department) VALUES ('Ananya Rao','Project Director','ananya.rao@gov.example','Infrastructure Monitoring'),('Vikram Singh','Regional Officer','vikram.singh@gov.example','Project Finance'),('Meera Nair','Chief Engineer','meera.nair@gov.example','Engineering Cell'),('Rahul Das','Monitoring Officer','rahul.das@gov.example','Works Monitoring') ON CONFLICT DO NOTHING;
INSERT INTO projects(project_code,name,place,state,ministry,sector,project_type,latitude,longitude,contractor_id,officer_id,implementing_agency,original_commissioning_month,original_commissioning_year,original_cost_crore,planned_duration_months,project_scale,project_complexity,land_acquisition_risk,clearance_complexity,procurement_complexity,manpower,progress_pct,expenditure_crore,risk_percentage,risk_level,status,start_date,end_date,description) VALUES
('PR-26001','Integrated Logistics Hub','Visakhapatnam','Andhra Pradesh','Ministry of Ports, Shipping and Waterways','Shipping And Ports','Logistics Hub',17.6868,83.2185,1,1,'MUMBAI PORT TRU',4,2019,820,36,'Large',7,'Medium','High','Medium',340,72,645,68,'High','Active','2019-04-01','2022-03-31','Multi-modal logistics and freight integration hub.'),
('PR-26002','Eastern Freight Corridor Package','Prayagraj','Uttar Pradesh','Ministry of Railways','Railways','Rail Corridor',25.4358,81.8463,2,2,'SER',8,2020,1450,48,'Mega',8,'High','High','High',520,61,890,74,'High','Active','2020-08-01','2024-07-31','Rail freight corridor civil works package.'),
('PR-26003','Solar Power Transmission Upgrade','Jaipur','Rajasthan','Ministry of Power','Power','Transmission',26.9124,75.7873,1,3,'PGCIL',2,2021,410,30,'Large',5,'Low','Medium','Medium',180,83,330,32,'Low','Active','2021-02-01','2023-07-31','Grid strengthening for renewable integration.'),
('PR-26004','Regional Airport Expansion','Guwahati','Assam','Ministry of Civil Aviation','Civil Aviation','Airport',26.1445,91.7362,5,4,'AAI',11,2018,980,42,'Mega',8,'High','High','High',460,54,700,81,'High','Active','2018-11-01','2022-04-30','Terminal and airside capacity expansion.'),
('PR-26005','National Highway Package 7','Nashik','Maharashtra','Ministry of Road Transport and Highways','Road Transport And Highways','Highway',19.9975,73.7898,4,1,'NHAI',6,2022,620,24,'Large',6,'Medium','Medium','Low',290,68,402,46,'Medium','Active','2022-06-01','2024-05-31','Four-lane highway package with bridges.'),
('PR-26006','Urban Water Resilience Project','Bengaluru','Karnataka','Ministry of Urban Development','Urban Development','Water Infrastructure',12.9716,77.5946,2,3,'CPWD',1,2023,360,30,'Medium',4,'Low','Medium','Medium',210,47,155,29,'Low','Active','2023-01-01','2025-06-30','Urban water network resilience works.'),
('PR-26007','Refinery Modernisation Package','Panipat','Haryana','Ministry of Petroleum and Natural Gas','Petroleum','Refinery',29.3909,76.9635,1,2,'IOCL',9,2019,760,36,'Large',7,'Medium','High','High',310,64,520,63,'Medium','Active','2019-09-01','2022-08-31','Refinery modernization and safety upgrades.'),
('PR-26008','Steel Plant Expansion','Bhilai','Chhattisgarh','Ministry of Steel','Steel','Plant Expansion',21.1938,81.3509,3,3,'RINL',3,2017,1200,54,'Mega',9,'High','High','Medium',680,49,760,78,'High','Active','2017-03-01','2021-08-31','Capacity expansion and supporting utilities.'),
('PR-26009','Telecom Rural Connectivity','Shillong','Meghalaya','Ministry of Communications','Telecommunications','Digital Connectivity',25.5788,91.8933,5,4,'NER',10,2021,280,30,'Medium',6,'High','Medium','High',160,58,190,57,'Medium','Active','2021-10-01','2024-03-31','Rural telecom backbone and last-mile connectivity.'),
('PR-26010','Coal Handling Upgrade','Dhanbad','Jharkhand','Ministry of Coal','Coal','Mining Infrastructure',23.7957,86.4304,3,2,'BCCL',5,2020,500,36,'Large',7,'Medium','Medium','Medium',250,77,390,43,'Medium','Active','2020-05-01','2023-04-30','Coal handling and dispatch infrastructure.'),
('PR-26011','Fertiliser Plant Rehabilitation','Barauni','Bihar','Ministry of Chemicals and Fertilizers','Fertilisers','Plant Rehabilitation',25.4697,85.9220,3,1,'RCF',7,2019,690,42,'Large',8,'High','High','Medium',400,52,475,69,'High','Active','2019-07-01','2022-12-31','Process plant rehabilitation.'),
('PR-26012','Nuclear Research Facility','Kalpakkam','Tamil Nadu','Department of Atomic Energy','Atomic Energy','Research Facility',12.5100,80.1500,2,3,'NPCIL',12,2022,1500,60,'Mega',10,'Medium','High','High',750,35,410,88,'High','Active','2022-12-01','2027-11-30','Specialized research and safety infrastructure.'),
('PR-26013','Port Connectivity Road','Kochi','Kerala','Ministry of Ports, Shipping and Waterways','Road Transport And Highways','Port Road',9.9312,76.2673,4,1,'PWD',4,2023,240,24,'Medium',4,'Low','Low','Low',190,66,145,25,'Low','Active','2023-04-01','2025-03-31','Road connectivity to port facilities.'),
('PR-26014','Rail Electrification Works','Lucknow','Uttar Pradesh','Ministry of Railways','Railways','Electrification',26.8467,80.9462,2,2,'NR',2,2018,330,24,'Medium',5,'Low','Medium','Medium',170,89,298,35,'Low','Active','2018-02-01','2020-01-31','Rail electrification package.'),
('PR-26015','Hydropower Transmission Link','Itanagar','Arunachal Pradesh','Ministry of Power','Power','Transmission',27.0844,93.6053,5,4,'NEEPCO',8,2020,540,48,'Large',9,'High','High','High',360,42,290,76,'High','Active','2020-08-01','2024-07-31','Mountain transmission link with difficult terrain.'),
('PR-26016','Coastal Health Facility','Bhubaneswar','Odisha','Ministry of Health and Family Welfare','Health And Family Welfare','Hospital',20.2961,85.8245,1,3,'HSCC',5,2022,310,30,'Medium',5,'Low','Medium','Medium',220,74,230,31,'Low','Active','2022-05-01','2024-10-31','Specialized coastal health facility.'),
('PR-26017','Airport Access Metro','Kolkata','West Bengal','Ministry of Urban Development','Urban Development','Metro',22.5726,88.3639,2,1,'MEGA',6,2019,890,48,'Large',8,'Medium','High','High',510,57,560,72,'High','Active','2019-06-01','2023-05-31','Airport metro access corridor.'),
('PR-26018','Offshore Gas Support Base','Kakinada','Andhra Pradesh','Ministry of Petroleum and Natural Gas','Petroleum','Industrial Base',16.9891,82.2475,4,2,'ONGC',1,2021,430,36,'Large',6,'Medium','High','Medium',260,69,310,49,'Medium','Active','2021-01-01','2023-12-31','Support base for offshore operations.'),
('PR-26019','Telecom Exchange Modernisation','Patna','Bihar','Ministry of Communications','Telecommunications','Telecom',25.5941,85.1376,5,4,'DOT',3,2024,160,18,'Small',3,'Low','Low','Low',90,38,54,21,'Low','Active','2024-03-01','2025-08-31','Modernization of regional telecom exchange.'),
('PR-26020','Freight Terminal Development','Nagpur','Maharashtra','Ministry of Railways','Railways','Freight Terminal',21.1458,79.0882,1,2,'NFR',9,2023,470,36,'Large',6,'Medium','Medium','Medium',280,46,180,51,'Medium','Active','2023-09-01','2026-08-31','Rail freight terminal development.'),
('PR-26021','Western Freight Logistics Park','Ahmedabad','Gujarat','Ministry of Railways','Railways','Logistics Park',23.0225,72.5714,2,2,'DFCCIL',5,2022,780,42,'Large',7,'Medium','High','Medium',420,63,510,61,'Medium','Active','2022-05-01','2025-10-31','Integrated rail-linked freight logistics park.'),

('PR-26022','Delhi Ring Road Improvement','New Delhi','Delhi','Ministry of Road Transport and Highways','Road Transport And Highways','Ring Road',28.6139,77.2090,3,3,'NHAI',2,2022,920,36,'Large',8,'High','High','High',530,71,650,58,'Medium','Active','2022-02-01','2025-01-31','Urban ring road capacity and junction improvement.'),

('PR-26023','Kutch Renewable Energy Corridor','Bhuj','Gujarat','Ministry of Power','Power','Green Energy Corridor',23.2420,69.6669,4,4,'PGCIL',9,2021,1550,54,'Mega',9,'High','High','High',680,52,780,73,'High','Active','2021-09-01','2026-02-28','Transmission corridor supporting renewable energy integration.'),

('PR-26024','Mumbai Coastal Mobility Corridor','Mumbai','Maharashtra','Ministry of Urban Development','Urban Development','Coastal Road',19.0760,72.8777,5,1,'MMRDA',6,2021,1320,48,'Mega',9,'High','High','High',850,62,910,76,'High','Active','2021-06-01','2025-05-31','High-capacity coastal urban mobility corridor.'),

('PR-26025','Chennai Metro Expansion','Chennai','Tamil Nadu','Ministry of Urban Development','Urban Development','Metro',13.0827,80.2707,1,2,'CMRL',4,2022,2100,60,'Mega',10,'Medium','High','High',900,48,720,82,'High','Active','2022-04-01','2027-03-31','Metro corridor expansion with underground and elevated sections.'),

('PR-26026','Bengaluru Suburban Rail Package','Bengaluru','Karnataka','Ministry of Railways','Railways','Suburban Rail',12.9716,77.5946,2,3,'K-RIDE',8,2021,1750,60,'Mega',9,'High','High','High',780,44,650,80,'High','Active','2021-08-01','2026-07-31','Suburban rail network and station modernization.'),

('PR-26027','Hyderabad Regional Water Grid','Hyderabad','Telangana','Ministry of Jal Shakti','Water Resources','Water Grid',17.3850,78.4867,3,4,'HMWSSB',3,2023,860,42,'Large',7,'Medium','Medium','Medium',480,57,410,47,'Medium','Active','2023-03-01','2026-08-31','Regional bulk water transmission and storage network.'),

('PR-26028','Amritsar Border Connectivity Highway','Amritsar','Punjab','Ministry of Road Transport and Highways','Road Transport And Highways','Highway',31.6340,74.8723,4,1,'NHAI',5,2022,690,30,'Large',6,'Medium','Medium','Low',330,73,470,39,'Low','Active','2022-05-01','2024-10-31','Strategic highway connectivity improvement.'),

('PR-26029','Kandla Port Modernisation','Kandla','Gujarat','Ministry of Ports, Shipping and Waterways','Shipping And Ports','Port Modernisation',23.0330,70.2167,5,2,'Deendayal Port Authority',9,2020,1180,48,'Mega',8,'High','High','Medium',610,59,770,67,'High','Active','2020-09-01','2024-08-31','Port berths, yards and cargo handling modernization.'),

('PR-26030','Paradip Bulk Cargo Terminal','Paradip','Odisha','Ministry of Ports, Shipping and Waterways','Shipping And Ports','Cargo Terminal',20.2644,86.6754,1,3,'Paradip Port Authority',1,2022,740,36,'Large',7,'Medium','High','Medium',380,68,490,54,'Medium','Active','2022-01-01','2024-12-31','Bulk cargo handling and storage terminal.'),

('PR-26031','Kolkata River Transport Terminal','Kolkata','West Bengal','Ministry of Ports, Shipping and Waterways','Inland Waterways','River Terminal',22.5726,88.3639,2,4,'IWAI',11,2021,390,30,'Medium',5,'Low','Medium','Low',220,76,285,28,'Low','Active','2021-11-01','2024-04-30','Inland waterway passenger and cargo terminal.'),

('PR-26032','Varanasi Multimodal Terminal Upgrade','Varanasi','Uttar Pradesh','Ministry of Ports, Shipping and Waterways','Inland Waterways','Multimodal Terminal',25.3176,82.9739,3,1,'IWAI',6,2022,510,30,'Large',6,'Medium','Medium','Medium',270,64,320,44,'Medium','Active','2022-06-01','2024-11-30','Multimodal cargo handling and river logistics improvement.'),

('PR-26033','Lucknow Integrated Transport Hub','Lucknow','Uttar Pradesh','Ministry of Urban Development','Urban Development','Transport Hub',26.8467,80.9462,4,2,'LDA',3,2024,450,30,'Large',6,'Medium','Medium','Medium',300,39,150,36,'Medium','Active','2024-03-01','2026-08-31','Integrated public transport interchange facility.'),

('PR-26034','Patna Metro Corridor Package','Patna','Bihar','Ministry of Urban Development','Urban Development','Metro',25.5941,85.1376,5,3,'PMRCL',7,2023,1250,54,'Mega',9,'High','High','High',620,51,460,69,'High','Active','2023-07-01','2027-12-31','Metro corridor development with stations and depots.'),

('PR-26035','Ranchi Urban Mobility Upgrade','Ranchi','Jharkhand','Ministry of Urban Development','Urban Development','Transit',23.3441,85.3096,1,4,'RMC',2,2024,330,24,'Medium',5,'Low','Medium','Low',180,58,175,31,'Low','Active','2024-02-01','2026-01-31','Urban public transport and junction improvement.'),

('PR-26036','Bhubaneswar Smart Drainage Network','Bhubaneswar','Odisha','Ministry of Urban Development','Urban Development','Drainage',20.2961,85.8245,2,1,'BMC',8,2023,290,24,'Medium',5,'Low','Medium','Medium',170,69,195,27,'Low','Active','2023-08-01','2025-07-31','Urban stormwater drainage resilience project.'),

('PR-26037','Cuttack Flood Resilience Works','Cuttack','Odisha','Ministry of Jal Shakti','Water Resources','Flood Protection',20.4625,85.8828,3,2,'OWRD',4,2022,410,30,'Large',7,'Medium','High','Medium',260,56,250,52,'Medium','Active','2022-04-01','2024-09-30','Flood protection embankment and drainage works.'),

('PR-26038','Ganga Basin Water Monitoring','Kanpur','Uttar Pradesh','Ministry of Jal Shakti','Water Resources','Water Monitoring',26.4499,80.3319,4,3,'CWC',10,2024,210,24,'Small',4,'Low','Medium','Low',120,42,78,24,'Low','Active','2024-10-01','2026-09-30','River basin monitoring and water quality infrastructure.'),

('PR-26039','Jaipur Solar Storage Park','Jaipur','Rajasthan','Ministry of New and Renewable Energy','Renewable Energy','Solar Storage',26.9124,75.7873,5,4,'SECI',5,2023,980,42,'Large',7,'Medium','Medium','Medium',410,67,570,45,'Medium','Active','2023-05-01','2026-10-31','Utility-scale solar generation and battery storage facility.'),

('PR-26040','Jaisalmer Wind Power Evacuation','Jaisalmer','Rajasthan','Ministry of Power','Power','Transmission',26.9157,70.9083,1,1,'PGCIL',1,2022,620,36,'Large',7,'Medium','High','Medium',260,72,430,38,'Low','Active','2022-01-01','2024-12-31','Transmission infrastructure for wind power evacuation.'),

('PR-26041','Madhya Pradesh Grid Strengthening','Bhopal','Madhya Pradesh','Ministry of Power','Power','Grid Strengthening',23.2599,77.4126,2,2,'MPPTCL',6,2023,560,36,'Large',6,'Medium','Medium','Medium',290,61,330,42,'Medium','Active','2023-06-01','2026-05-31','Substation and transmission network strengthening.'),

('PR-26042','Nagpur Solar Manufacturing Cluster','Nagpur','Maharashtra','Ministry of New and Renewable Energy','Renewable Energy','Manufacturing Cluster',21.1458,79.0882,3,3,'IREDA',2,2024,740,36,'Large',7,'Medium','High','Medium',350,47,260,51,'Medium','Active','2024-02-01','2027-01-31','Solar equipment manufacturing and industrial infrastructure.'),

('PR-26043','Bhilai Steel Capacity Upgrade','Bhilai','Chhattisgarh','Ministry of Steel','Steel','Plant Expansion',21.1938,81.3509,4,4,'SAIL',7,2022,1420,48,'Mega',9,'High','High','High',690,58,870,71,'High','Active','2022-07-01','2026-06-30','Steel production capacity and supporting utility expansion.'),

('PR-26044','Bokaro Coke Oven Modernisation','Bokaro','Jharkhand','Ministry of Steel','Steel','Modernisation',23.6693,86.1511,5,1,'SAIL',11,2021,830,42,'Large',8,'Medium','High','High',430,63,540,64,'High','Active','2021-11-01','2025-04-30','Coke oven modernization and environmental improvement.'),

('PR-26045','Rourkela Material Handling Upgrade','Rourkela','Odisha','Ministry of Steel','Steel','Material Handling',22.2604,84.8536,1,2,'SAIL',5,2023,520,30,'Large',6,'Medium','Medium','Medium',300,74,360,35,'Low','Active','2023-05-01','2025-10-31','Raw material handling and dispatch infrastructure.'),

('PR-26046','Durgapur Industrial Utility Upgrade','Durgapur','West Bengal','Ministry of Steel','Steel','Industrial Utilities',23.5204,87.3119,2,3,'SAIL',3,2024,390,30,'Medium',5,'Low','Medium','Low',220,46,180,29,'Low','Active','2024-03-01','2026-08-31','Industrial utility and support infrastructure upgrade.'),

('PR-26047','Haldia Refinery Expansion','Haldia','West Bengal','Ministry of Petroleum and Natural Gas','Petroleum','Refinery Expansion',22.0667,88.0698,3,4,'IOCL',8,2021,1350,48,'Mega',9,'High','High','High',720,56,820,74,'High','Active','2021-08-01','2025-07-31','Refinery processing capacity expansion.'),

('PR-26048','Jamnagar Petrochemical Integration','Jamnagar','Gujarat','Ministry of Petroleum and Natural Gas','Petroleum','Petrochemical',22.4707,70.0577,4,1,'IOCL',4,2022,1800,54,'Mega',10,'High','High','High',850,49,690,83,'High','Active','2022-04-01','2026-09-30','Petrochemical processing and integration infrastructure.'),

('PR-26049','Mathura Refinery Safety Upgrade','Mathura','Uttar Pradesh','Ministry of Petroleum and Natural Gas','Petroleum','Safety Upgrade',27.4924,77.6737,5,2,'IOCL',12,2023,470,30,'Large',6,'Low','High','Medium',260,71,330,41,'Medium','Active','2023-12-01','2026-05-31','Refinery safety systems and emergency infrastructure.'),

('PR-26050','Kochi Petrochemical Storage Facility','Kochi','Kerala','Ministry of Petroleum and Natural Gas','Petroleum','Storage Facility',9.9312,76.2673,1,3,'BPCL',6,2024,360,24,'Medium',5,'Low','Medium','Low',190,52,180,34,'Low','Active','2024-06-01','2026-05-31','Petrochemical storage and distribution facility.'),

('PR-26051','Barauni Fertiliser Capacity Upgrade','Barauni','Bihar','Ministry of Chemicals and Fertilizers','Fertilisers','Capacity Upgrade',25.4697,85.9220,2,4,'NFL',2,2022,980,42,'Large',8,'Medium','High','High',470,55,610,68,'High','Active','2022-02-01','2025-07-31','Fertiliser production capacity expansion.'),

('PR-26052','Sindri Fertiliser Plant Modernisation','Dhanbad','Jharkhand','Ministry of Chemicals and Fertilizers','Fertilisers','Plant Modernisation',23.6353,86.4418,3,1,'FCIL',9,2020,760,48,'Large',8,'High','High','Medium',390,60,520,62,'Medium','Active','2020-09-01','2024-08-31','Fertiliser plant modernization and process improvement.'),

('PR-26053','Kakinada Fertiliser Logistics Terminal','Kakinada','Andhra Pradesh','Ministry of Chemicals and Fertilizers','Fertilisers','Logistics Terminal',16.9891,82.2475,4,2,'KRIBHCO',1,2024,290,24,'Medium',5,'Low','Medium','Low',170,44,120,32,'Low','Active','2024-01-01','2025-12-31','Fertiliser storage and logistics terminal.'),

('PR-26054','Visakhapatnam Shipyard Modernisation','Visakhapatnam','Andhra Pradesh','Ministry of Defence','Defence Production','Shipyard',17.6868,83.2185,5,3,'HSL',10,2021,1050,42,'Large',8,'Medium','High','High',520,67,690,59,'Medium','Active','2021-10-01','2025-03-31','Shipyard modernization and heavy engineering infrastructure.'),

('PR-26055','Kochi Naval Infrastructure Upgrade','Kochi','Kerala','Ministry of Defence','Defence Production','Naval Infrastructure',9.9312,76.2673,1,4,'Cochin Shipyard',4,2023,880,36,'Large',8,'Low','High','High',460,59,510,57,'Medium','Active','2023-04-01','2026-03-31','Naval infrastructure and marine support facilities.'),

('PR-26056','Chennai Defence Electronics Park','Chennai','Tamil Nadu','Ministry of Defence','Defence Production','Industrial Park',13.0827,80.2707,2,1,'DRDO',7,2024,540,30,'Large',7,'Medium','High','Medium',310,38,165,49,'Medium','Active','2024-07-01','2027-01-31','Defence electronics manufacturing and testing park.'),

('PR-26057','Bengaluru Aerospace Manufacturing Hub','Bengaluru','Karnataka','Ministry of Defence','Defence Production','Aerospace Hub',12.9716,77.5946,3,2,'HAL',1,2022,1120,48,'Mega',9,'Medium','High','High',580,63,700,66,'High','Active','2022-01-01','2025-12-31','Aerospace manufacturing and research infrastructure.'),

('PR-26058','Hyderabad Semiconductor Facility','Hyderabad','Telangana','Ministry of Electronics and IT','Electronics','Semiconductor',17.3850,78.4867,4,3,'MeitY',5,2024,1600,60,'Mega',10,'Medium','High','High',760,32,420,86,'High','Active','2024-05-01','2029-04-30','Advanced semiconductor manufacturing facility.'),

('PR-26059','Noida Electronics Manufacturing Park','Noida','Uttar Pradesh','Ministry of Electronics and IT','Electronics','Manufacturing Park',28.5355,77.3910,5,4,'NICDC',8,2023,720,42,'Large',7,'Medium','Medium','Medium',430,57,390,53,'Medium','Active','2023-08-01','2026-12-31','Electronics manufacturing cluster and common facilities.'),

('PR-26060','Bengaluru Digital Infrastructure Centre','Bengaluru','Karnataka','Ministry of Electronics and IT','Electronics','Data Centre',12.9716,77.5946,1,1,'STPI',3,2024,610,30,'Large',6,'Low','Medium','Medium',280,49,260,39,'Low','Active','2024-03-01','2026-08-31','Digital infrastructure and secure data processing centre.'),

('PR-26061','Shillong Broadband Backbone','Shillong','Meghalaya','Ministry of Communications','Telecommunications','Digital Connectivity',25.5788,91.8933,2,2,'BSNL',6,2023,310,36,'Medium',7,'High','High','High',210,54,170,61,'High','Active','2023-06-01','2026-05-31','Regional broadband backbone connectivity.'),

('PR-26062','Aizawl Rural Telecom Upgrade','Aizawl','Mizoram','Ministry of Communications','Telecommunications','Rural Connectivity',23.7271,92.7176,3,3,'BSNL',10,2022,270,30,'Medium',7,'High','High','Medium',170,62,185,58,'Medium','Active','2022-10-01','2025-03-31','Rural telecom network and last-mile connectivity.'),

('PR-26063','Kohima Connectivity Network','Kohima','Nagaland','Ministry of Communications','Telecommunications','Digital Connectivity',25.6751,94.1086,4,4,'BSNL',2,2024,230,30,'Small',6,'High','Medium','High',130,41,92,54,'Medium','Active','2024-02-01','2026-07-31','Digital connectivity network for remote communities.'),

('PR-26064','Imphal Telecom Resilience Project','Imphal','Manipur','Ministry of Communications','Telecommunications','Network Resilience',24.8170,93.9368,5,1,'BSNL',9,2023,340,36,'Medium',7,'High','High','High',190,48,155,66,'High','Active','2023-09-01','2026-08-31','Telecom network resilience and redundancy project.'),

('PR-26065','Agartala Border Digital Link','Agartala','Tripura','Ministry of Communications','Telecommunications','Digital Connectivity',23.8315,91.2868,1,2,'BSNL',4,2024,250,24,'Medium',5,'Medium','Medium','Medium',150,66,170,37,'Low','Active','2024-04-01','2026-03-31','Border-region digital connectivity improvement.'),

('PR-26066','Gangtok Hill Road Stabilisation','Gangtok','Sikkim','Ministry of Road Transport and Highways','Road Transport And Highways','Hill Road',27.3389,88.6065,2,3,'BRO',6,2022,430,36,'Large',8,'High','High','High',240,53,235,72,'High','Active','2022-06-01','2025-05-31','Slope stabilization and hill road improvement.'),

('PR-26067','Tawang Strategic Road Package','Tawang','Arunachal Pradesh','Ministry of Road Transport and Highways','Road Transport And Highways','Strategic Road',27.5861,91.8650,3,4,'BRO',9,2021,680,48,'Large',9,'High','High','High',350,46,300,81,'High','Active','2021-09-01','2025-08-31','Strategic road connectivity through difficult terrain.'),

('PR-26068','Siliguri Corridor Highway Upgrade','Siliguri','West Bengal','Ministry of Road Transport and Highways','Road Transport And Highways','Highway',26.7271,88.3953,4,1,'NHAI',1,2023,850,42,'Large',8,'Medium','High','High',460,64,520,63,'High','Active','2023-01-01','2026-06-30','Highway capacity improvement through strategic corridor.'),

('PR-26069','Dehradun Tunnel Connectivity','Dehradun','Uttarakhand','Ministry of Road Transport and Highways','Road Transport And Highways','Tunnel',30.3165,78.0322,5,2,'NHIDCL',5,2022,760,48,'Large',9,'High','High','High',420,51,340,78,'High','Active','2022-05-01','2026-04-30','Mountain tunnel and road connectivity project.'),

('PR-26070','Shimla Bypass Improvement','Shimla','Himachal Pradesh','Ministry of Road Transport and Highways','Road Transport And Highways','Bypass',31.1048,77.1734,1,3,'NHAI',11,2023,520,36,'Large',8,'High','High','Medium',300,59,295,62,'Medium','Active','2023-11-01','2026-10-31','Bypass road and traffic decongestion infrastructure.'),

('PR-26071','Srinagar Flood Protection Network','Srinagar','Jammu and Kashmir','Ministry of Jal Shakti','Water Resources','Flood Protection',34.0837,74.7973,2,4,'Jal Shakti J&K',3,2022,490,36,'Large',8,'High','High','Medium',270,57,300,69,'High','Active','2022-03-01','2025-02-28','Flood protection and river embankment network.'),

('PR-26072','Jammu Ring Road Package','Jammu','Jammu and Kashmir','Ministry of Road Transport and Highways','Road Transport And Highways','Ring Road',32.7266,74.8570,3,1,'NHAI',8,2021,610,42,'Large',7,'Medium','High','Medium',330,70,410,48,'Medium','Active','2021-08-01','2025-01-31','Regional ring road and urban connectivity package.'),

('PR-26073','Leh Solar Microgrid Network','Leh','Ladakh','Ministry of Power','Power','Solar Microgrid',34.1526,77.5771,4,2,'NTPC',4,2024,280,30,'Medium',8,'High','High','Medium',140,36,85,71,'High','Active','2024-04-01','2026-09-30','Distributed solar microgrid network for remote settlements.'),

('PR-26074','Varanasi Heritage Sewer Upgrade','Varanasi','Uttar Pradesh','Ministry of Urban Development','Urban Development','Sewerage',25.3176,82.9739,5,3,'UP Jal Nigam',6,2023,340,30,'Medium',6,'Medium','High','Medium',210,65,220,43,'Medium','Active','2023-06-01','2025-11-30','Sewerage improvement in heritage urban zones.'),

('PR-26075','Agra Urban Water Supply','Agra','Uttar Pradesh','Ministry of Jal Shakti','Water Resources','Water Supply',27.1767,78.0081,1,4,'UP Jal Nigam',2,2024,460,36,'Large',6,'Medium','Medium','Medium',280,48,205,39,'Low','Active','2024-02-01','2027-01-31','Urban drinking water supply and distribution network.'),

('PR-26076','Indore Waste Processing Facility','Indore','Madhya Pradesh','Ministry of Urban Development','Urban Development','Waste Management',22.7196,75.8577,2,1,'IMC',9,2023,310,24,'Medium',5,'Low','Medium','Low',180,78,245,22,'Low','Active','2023-09-01','2025-08-31','Municipal waste processing and resource recovery facility.'),

('PR-26077','Bhopal Integrated Sewer Network','Bhopal','Madhya Pradesh','Ministry of Urban Development','Urban Development','Sewerage',23.2599,77.4126,3,2,'BMC',5,2022,520,42,'Large',7,'Medium','High','Medium',320,60,310,46,'Medium','Active','2022-05-01','2025-10-31','Integrated urban sewer network expansion.'),

('PR-26078','Pune Metro Extension','Pune','Maharashtra','Ministry of Urban Development','Urban Development','Metro',18.5204,73.8567,4,3,'Maha Metro',10,2022,1180,48,'Mega',9,'Medium','High','High',650,68,790,55,'Medium','Active','2022-10-01','2026-09-30','Metro extension with elevated stations and depots.'),

('PR-26079','Nashik Riverfront Development','Nashik','Maharashtra','Ministry of Urban Development','Urban Development','Riverfront',20.0059,73.7910,5,4,'NMC',3,2024,360,30,'Medium',6,'Medium','High','Medium',220,43,140,48,'Medium','Active','2024-03-01','2026-08-31','Riverfront development and flood resilience works.'),

('PR-26080','Ahmedabad Metro Depot Expansion','Ahmedabad','Gujarat','Ministry of Urban Development','Urban Development','Metro Depot',23.0225,72.5714,1,1,'GMRC',7,2023,430,30,'Large',6,'Low','Medium','Medium',240,72,310,31,'Low','Active','2023-07-01','2025-12-31','Metro maintenance depot and operational support infrastructure.'),

('PR-26081','Surat Flood Resilience Corridor','Surat','Gujarat','Ministry of Jal Shakti','Water Resources','Flood Protection',21.1702,72.8311,2,2,'SUDA',12,2022,570,36,'Large',7,'Medium','High','Medium',300,58,350,51,'Medium','Active','2022-12-01','2025-11-30','Urban flood management and drainage resilience corridor.'),

('PR-26082','Rajkot Water Reuse Plant','Rajkot','Gujarat','Ministry of Jal Shakti','Water Resources','Water Treatment',22.3039,70.8022,3,3,'GWSSB',4,2024,260,24,'Medium',5,'Low','Medium','Low',160,63,175,29,'Low','Active','2024-04-01','2026-03-31','Treated wastewater reuse and recycling facility.'),

('PR-26083','Vijayawada Flood Control Works','Vijayawada','Andhra Pradesh','Ministry of Jal Shakti','Water Resources','Flood Protection',16.5062,80.6480,4,4,'APWRD',8,2023,420,30,'Large',7,'Medium','High','Medium',250,71,300,36,'Low','Active','2023-08-01','2026-01-31','Flood control structures and riverbank protection.'),

('PR-26084','Tirupati Airport Expansion','Tirupati','Andhra Pradesh','Ministry of Civil Aviation','Civil Aviation','Airport',13.6288,79.4192,5,1,'AAI',5,2022,520,36,'Large',7,'Medium','High','High',280,67,340,48,'Medium','Active','2022-05-01','2025-04-30','Terminal expansion and airside infrastructure upgrade.'),

('PR-26085','Rajahmundry Airport Upgrade','Rajahmundry','Andhra Pradesh','Ministry of Civil Aviation','Civil Aviation','Airport',16.9891,81.7840,1,2,'AAI',10,2023,380,30,'Medium',6,'Low','Medium','Medium',210,55,210,42,'Medium','Active','2023-10-01','2026-03-31','Passenger terminal and runway support improvements.'),

('PR-26086','Coimbatore Airport Expansion','Coimbatore','Tamil Nadu','Ministry of Civil Aviation','Civil Aviation','Airport',11.0168,76.9558,2,3,'AAI',2,2021,890,42,'Large',8,'Medium','High','High',460,73,650,54,'Medium','Active','2021-02-01','2024-07-31','Airport terminal and runway expansion.'),

('PR-26087','Madurai Airport Terminal Upgrade','Madurai','Tamil Nadu','Ministry of Civil Aviation','Civil Aviation','Airport',9.9252,78.1198,3,4,'AAI',6,2024,340,24,'Medium',5,'Low','Medium','Medium',190,46,150,37,'Low','Active','2024-06-01','2026-05-31','Terminal modernization and passenger facility improvement.'),

('PR-26088','Bhubaneswar Airport Cargo Complex','Bhubaneswar','Odisha','Ministry of Civil Aviation','Civil Aviation','Cargo Terminal',20.2961,85.8245,4,1,'AAI',9,2023,290,24,'Medium',5,'Low','Medium','Low',160,79,230,24,'Low','Active','2023-09-01','2025-08-31','Air cargo handling and storage complex.'),

('PR-26089','Guwahati Airport Terminal Expansion','Guwahati','Assam','Ministry of Civil Aviation','Civil Aviation','Airport',26.1445,91.7362,5,2,'AAI',3,2022,1120,48,'Mega',8,'High','High','High',580,52,720,77,'High','Active','2022-03-01','2026-02-28','Airport terminal and passenger processing expansion.'),

('PR-26090','Dibrugarh Airport Runway Upgrade','Dibrugarh','Assam','Ministry of Civil Aviation','Civil Aviation','Runway',27.4728,94.9120,1,3,'AAI',7,2024,240,18,'Small',4,'Low','Medium','Low',130,69,165,30,'Low','Active','2024-07-01','2025-12-31','Runway strengthening and airport safety improvements.'),

('PR-26091','Bengaluru Cancer Care Centre','Bengaluru','Karnataka','Ministry of Health and Family Welfare','Health And Family Welfare','Hospital',12.9716,77.5946,2,4,'HSCC',11,2023,580,36,'Large',6,'Low','Medium','Medium',340,62,370,34,'Low','Active','2023-11-01','2026-10-31','Specialized cancer treatment and research hospital.'),

('PR-26092','Chennai Medical Research Campus','Chennai','Tamil Nadu','Ministry of Health and Family Welfare','Health And Family Welfare','Research Facility',13.0827,80.2707,3,1,'HSCC',4,2022,760,48,'Large',8,'Medium','High','High',430,50,360,61,'High','Active','2022-04-01','2026-03-31','Medical research and advanced healthcare campus.'),

('PR-26093','Guwahati Regional Hospital','Guwahati','Assam','Ministry of Health and Family Welfare','Health And Family Welfare','Hospital',26.1445,91.7362,4,2,'HSCC',8,2023,410,30,'Large',6,'Medium','High','Medium',260,66,290,44,'Medium','Active','2023-08-01','2026-01-31','Regional hospital and emergency care infrastructure.'),

('PR-26094','Shillong Medical College','Shillong','Meghalaya','Ministry of Health and Family Welfare','Health And Family Welfare','Medical College',25.5788,91.8933,5,3,'HSCC',1,2024,620,42,'Large',8,'High','High','High',380,39,190,68,'High','Active','2024-01-01','2027-06-30','Medical education and tertiary healthcare campus.'),

('PR-26095','Patna Trauma Centre','Patna','Bihar','Ministry of Health and Family Welfare','Health And Family Welfare','Trauma Centre',25.5941,85.1376,1,4,'HSCC',12,2022,330,30,'Medium',6,'Low','Medium','Medium',220,75,250,27,'Low','Active','2022-12-01','2025-05-31','Emergency trauma care and critical care facility.'),

('PR-26096','Delhi Public Hospital Expansion','New Delhi','Delhi','Ministry of Health and Family Welfare','Health And Family Welfare','Hospital',28.6139,77.2090,2,1,'CPWD',5,2023,710,36,'Large',7,'Medium','High','High',410,58,430,52,'Medium','Active','2023-05-01','2026-04-30','Expansion of public hospital capacity and services.'),

('PR-26097','Kolkata River Bridge','Kolkata','West Bengal','Ministry of Road Transport and Highways','Road Transport And Highways','Bridge',22.5726,88.3639,3,2,'NHAI',9,2022,640,36,'Large',8,'High','High','High',360,47,330,74,'High','Active','2022-09-01','2025-08-31','Major river bridge and approach road construction.'),

('PR-26098','Howrah Freight Bridge Upgrade','Howrah','West Bengal','Ministry of Road Transport and Highways','Road Transport And Highways','Bridge',22.5958,88.2636,4,3,'NHAI',2,2024,470,30,'Large',7,'Medium','High','Medium',270,64,310,45,'Medium','Active','2024-02-01','2026-07-31','Bridge strengthening for freight and urban traffic.'),

('PR-26099','Gaya Railway Station Redevelopment','Gaya','Bihar','Ministry of Railways','Railways','Station Redevelopment',24.7914,85.0002,5,4,'Rail Land Development Authority',6,2023,360,30,'Medium',6,'Low','Medium','Medium',210,71,260,32,'Low','Active','2023-06-01','2025-11-30','Railway station redevelopment and passenger amenities.'),

('PR-26100','Ranchi Railway Yard Modernisation','Ranchi','Jharkhand','Ministry of Railways','Railways','Rail Yard',23.3441,85.3096,1,1,'SER',10,2024,420,30,'Large',6,'Medium','Medium','Medium',250,45,180,47,'Medium','Active','2024-10-01','2027-03-31','Rail yard modernization and operational capacity improvement.'),

('PR-26101','Bikaner Rail Freight Terminal','Bikaner','Rajasthan','Ministry of Railways','Railways','Freight Terminal',28.0229,73.3119,2,2,'NWR',3,2022,390,30,'Medium',6,'Low','Medium','Medium',220,82,330,26,'Low','Active','2022-03-01','2024-08-31','Dedicated rail freight terminal and loading facilities.'),

('PR-26102','Kharagpur Rail Workshop Upgrade','Kharagpur','West Bengal','Ministry of Railways','Railways','Workshop',22.3460,87.2320,3,3,'SER',8,2023,450,36,'Large',7,'Medium','High','Medium',260,53,245,50,'Medium','Active','2023-08-01','2026-07-31','Rail workshop modernization and maintenance facilities.'),

('PR-26103','Ramagundam Power Plant Upgrade','Ramagundam','Telangana','Ministry of Power','Power','Power Plant',18.7557,79.4748,4,4,'NTPC',1,2022,860,42,'Large',8,'Low','High','High',420,69,610,57,'Medium','Active','2022-01-01','2025-06-30','Thermal power plant efficiency and equipment upgrade.'),

('PR-26104','Korba Thermal Efficiency Upgrade','Korba','Chhattisgarh','Ministry of Power','Power','Power Plant',22.3595,82.7501,5,1,'NTPC',5,2023,690,36,'Large',7,'Medium','High','Medium',330,61,390,48,'Medium','Active','2023-05-01','2026-04-30','Thermal plant efficiency and emission control upgrade.'),

('PR-26105','Talcher Power Expansion','Talcher','Odisha','Ministry of Power','Power','Power Plant',20.9490,85.2167,1,2,'NTPC',11,2021,1260,48,'Mega',9,'High','High','High',610,50,720,75,'High','Active','2021-11-01','2025-10-31','Power generation capacity expansion.'),

('PR-26106','Kudgi Solar Hybrid Project','Vijayapura','Karnataka','Ministry of New and Renewable Energy','Renewable Energy','Hybrid Energy',16.8302,75.7100,2,3,'NTPC',7,2024,730,42,'Large',8,'Medium','Medium','Medium',350,37,190,56,'Medium','Active','2024-07-01','2027-12-31','Hybrid solar and renewable energy generation facility.'),

('PR-26107','Mangalore LNG Support Infrastructure','Mangaluru','Karnataka','Ministry of Petroleum and Natural Gas','Petroleum','LNG Infrastructure',12.9141,74.8560,3,4,'GAIL',12,2022,940,42,'Large',8,'Medium','High','High',470,65,590,63,'High','Active','2022-12-01','2026-05-31','LNG handling and supporting pipeline infrastructure.'),

('PR-26108','Kandla LPG Storage Expansion','Kandla','Gujarat','Ministry of Petroleum and Natural Gas','Petroleum','Storage Expansion',23.0330,70.2167,4,1,'HPCL',4,2024,310,24,'Medium',5,'Low','Medium','Low',180,72,230,29,'Low','Active','2024-04-01','2026-03-31','LPG storage capacity expansion.'),

('PR-26109','Jodhpur Defence Water Supply','Jodhpur','Rajasthan','Ministry of Defence','Defence Production','Water Infrastructure',26.2389,73.0243,5,2,'MES',9,2023,280,24,'Medium',5,'Low','Medium','Low',160,68,195,25,'Low','Active','2023-09-01','2025-08-31','Dedicated water supply infrastructure for defence facilities.'),

('PR-26110','Visakhapatnam Industrial Corridor','Visakhapatnam','Andhra Pradesh','Ministry of Commerce and Industry','Industrial Corridors','Industrial Corridor',17.6868,83.2185,1,3,'NICDC',2,2021,1480,54,'Mega',9,'High','High','High',720,54,810,70,'High','Active','2021-02-01','2025-07-31','Industrial corridor infrastructure and logistics integration.'),

('PR-26111','Dholera Industrial Corridor Package','Ahmedabad','Gujarat','Ministry of Commerce and Industry','Industrial Corridors','Industrial Corridor',22.2442,72.1934,2,4,'NICDC',6,2022,1720,60,'Mega',10,'High','High','High',820,49,760,78,'High','Active','2022-06-01','2027-05-31','Industrial township and corridor infrastructure.'),

('PR-26112','Amritsar Integrated Food Park','Amritsar','Punjab','Ministry of Food Processing Industries','Food Processing','Food Park',31.6340,74.8723,3,1,'MoFPI',10,2024,320,30,'Medium',5,'Medium','Medium','Low',180,43,130,35,'Low','Active','2024-10-01','2027-03-31','Integrated food processing and cold-chain facility.'),

('PR-26113','Mysuru Heritage Tourism Circuit','Mysuru','Karnataka','Ministry of Tourism','Tourism','Tourism Infrastructure',12.2958,76.6394,4,2,'KSTDC',4,2023,260,24,'Medium',4,'Low','Medium','Low',140,81,200,19,'Low','Active','2023-04-01','2025-03-31','Tourism infrastructure connecting heritage destinations.'),

('PR-26114','Nagpur Integrated Logistics Terminal','Nagpur','Maharashtra','Ministry of Railways','Railways','Logistics Terminal',21.1458,79.0882,5,3,'NFR',7,2024,510,36,'Large',7,'Medium','Medium','Medium',310,42,195,49,'Medium','Active','2024-07-01','2027-06-30','Integrated freight handling and logistics terminal.'),

('PR-26115','Coimbatore Industrial Freight Hub','Coimbatore','Tamil Nadu','Ministry of Commerce and Industry','Industrial Corridors','Freight Hub',11.0168,76.9558,1,4,'NICDC',3,2023,680,42,'Large',7,'Medium','High','Medium',360,64,410,46,'Medium','Active','2023-03-01','2026-08-31','Industrial freight consolidation and distribution hub.'),

('PR-26116','Kochi Coastal Logistics Park','Kochi','Kerala','Ministry of Ports, Shipping and Waterways','Shipping And Ports','Logistics Park',9.9312,76.2673,2,1,'Cochin Port Authority',9,2024,570,36,'Large',6,'Low','High','Medium',280,45,220,43,'Medium','Active','2024-09-01','2027-08-31','Coastal logistics and cargo distribution facility.'),

('PR-26117','Bhopal Solar Transmission Link','Bhopal','Madhya Pradesh','Ministry of Power','Power','Transmission',23.2599,77.4126,3,2,'PGCIL',5,2024,480,30,'Large',6,'Medium','Medium','Medium',240,51,210,38,'Low','Active','2024-05-01','2026-10-31','Transmission link for renewable power integration.'),

('PR-26118','Rajasthan Highway Safety Upgrade','Ajmer','Rajasthan','Ministry of Road Transport and Highways','Road Transport And Highways','Highway Safety',26.4499,74.6399,4,3,'NHAI',8,2023,390,24,'Medium',5,'Low','Medium','Low',190,77,290,23,'Low','Active','2023-08-01','2025-07-31','Road safety improvements, barriers and junction upgrades.'),

('PR-26119','Bihar Rural Bridge Network','Muzaffarpur','Bihar','Ministry of Road Transport and Highways','Road Transport And Highways','Bridge Network',26.1209,85.3647,5,4,'Bihar Road Construction Department',2,2024,620,42,'Large',8,'High','High','Medium',350,46,245,67,'High','Active','2024-02-01','2027-07-31','Multiple bridge structures improving rural connectivity.'),

('PR-26120','Assam River Logistics Terminal','Dibrugarh','Assam','Ministry of Ports, Shipping and Waterways','Inland Waterways','River Logistics Terminal',27.4728,94.9120,1,1,'IWAI',11,2023,430,30,'Large',7,'High','High','Medium',240,59,270,55,'Medium','Active','2023-11-01','2026-04-30','River-based logistics terminal for regional cargo movement.')

ON CONFLICT(project_code) DO NOTHING;
INSERT INTO site_photos(project_id,photo_url,caption,captured_at) SELECT id,'/assets/photos/site-01.svg','Site progress evidence','2026-01-15' FROM projects WHERE project_code IN ('PR-26001','PR-26004','PR-26012');
INSERT INTO site_photos(project_id,photo_url,caption,captured_at) SELECT id,'/assets/photos/site-02.svg','Construction milestone','2026-03-12' FROM projects WHERE project_code IN ('PR-26002','PR-26008','PR-26015');
INSERT INTO site_photos(project_id,photo_url,caption,captured_at) SELECT id,'/assets/photos/site-03.svg','Field inspection evidence','2026-05-20' FROM projects WHERE project_code IN ('PR-26005','PR-26009','PR-26020');
INSERT INTO progress_history(project_id,month_date,progress_pct,expenditure_crore) SELECT id,'2026-01-01',progress_pct-12,expenditure_crore-80 FROM projects;
INSERT INTO progress_history(project_id,month_date,progress_pct,expenditure_crore) SELECT id,'2026-03-01',progress_pct-7,expenditure_crore-45 FROM projects;
INSERT INTO progress_history(project_id,month_date,progress_pct,expenditure_crore) SELECT id,'2026-06-01',progress_pct,expenditure_crore FROM projects;