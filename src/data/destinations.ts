export type Region =
  | 'Europe'
  | 'Asia'
  | 'Middle East'
  | 'North America'
  | 'Africa'
  | 'South America';

export type CostLevel = 'Lean' | 'Balanced' | 'Premium';

export type ReadinessStatus = 'Ready' | 'Review' | 'Watch Closely';

export interface Destination {
  id: string;
  country: string;
  city: string;
  region: Region;
  currency: string;
  exchangeNote: string;
  costLevel: CostLevel;
  safetyScore: number;
  internetScore: number;
  transportScore: number;
  language: string;
  bestFor: string[];
  summary: string;
  localRules: string[];
  emergencyNotes: string[];
  dailyBrief: string[];
  checklist: string[];
  monthlyCostEstimate: number;
  heroGradient: string;
  tags: string[];
  readinessStatus: ReadinessStatus;
  lastChecked: string;
  sourceConfidence: number;
  requirementSummary: string;
  passportValidityNote: string;
  visaSnapshot: string;
  healthSnapshot: string;
  budgetBand: string;
  whatChanged: string[];
  sourceHierarchy: string;
  advisoryNote: string;
}

export const destinations: Destination[] = [
  {
    id: 'lisbon-portugal',
    country: 'Portugal',
    city: 'Lisbon',
    region: 'Europe',
    currency: 'Euro (EUR)',
    exchangeNote: 'USD travelers usually see a narrow EUR band; card acceptance is high, but small cafes still like cash.',
    costLevel: 'Balanced',
    safetyScore: 87,
    internetScore: 91,
    transportScore: 86,
    language: 'Portuguese, with strong English coverage in central districts.',
    bestFor: ['Remote work', 'First-time Europe', 'Long stays'],
    summary: 'Lisbon combines strong fiber coverage, manageable entry friction, and a walkable core that works well for hybrid work and soft-landing relocation research.',
    localRules: [
      'Validate metro and tram tickets before boarding; inspectors fine on the spot.',
      'Quiet hours in residential buildings are enforced more seriously than many U.S. travelers expect.',
      'Beach weather can shift quickly with Atlantic wind, even on bright days.',
    ],
    emergencyNotes: [
      'EU emergency line is 112 for police, fire, and ambulance.',
      'Keep a copy of your passport separate from the original for replacement support.',
      'Use official airport taxis or rideshare pickup zones to avoid overcharging.',
    ],
    dailyBrief: [
      'Metro reliability is strong before 10 p.m.; late-night returns are better by rideshare.',
      'Coworking demand in Cais do Sodre rises midweek, so reserve ahead for meeting rooms.',
      'Card payments are easy, but carry small euro notes for kiosks and neighborhood bakeries.',
    ],
    checklist: [
      'Confirm roaming or eSIM coverage before arrival.',
      'Save the metro map offline.',
      'Budget for short-term tourist tax at check-in.',
      'Book a workspace if you need private calls.',
    ],
    monthlyCostEstimate: 3150,
    heroGradient: 'from-[#eef7ff] via-[#fdf8ee] to-[#d9ebff]',
    tags: ['Atlantic climate', 'Schengen', 'Good cafes', 'Walkable'],
    readinessStatus: 'Ready',
    lastChecked: '2026-04-28',
    sourceConfidence: 0.92,
    requirementSummary: 'U.S. passport valid for duration of stay. Schengen visa not required for stays under 90 days. No health certificates required.',
    passportValidityNote: 'Passport must be valid for entire stay. Schengen countries allow 90 days visa-free per 180-day period.',
    visaSnapshot: 'Visa-free for U.S. citizens under 90 days (Schengen agreement). Multiple entry okay.',
    healthSnapshot: 'No mandatory vaccinations. EU health insurance recommended but travel insurance more practical for U.S. citizens.',
    budgetBand: '$2,900–$3,400/mo',
    whatChanged: ['Safety score improved 2% since last check', 'Metro price stable; no recent changes'],
    sourceHierarchy: 'Official sources first · EU policy data · Partner logistics providers',
    advisoryNote: 'Lisbon is a strong and popular destination. Tourist areas experience light-handed pickpocket activity, especially on tram 28. Keep valuables secure and remain situationally aware in Chiado and the lower city core after dark.',
  },
  {
    id: 'tokyo-japan',
    country: 'Japan',
    city: 'Tokyo',
    region: 'Asia',
    currency: 'Japanese Yen (JPY)',
    exchangeNote: 'The yen remains attractive for USD earners, but cash is still useful in smaller venues and transit edge cases.',
    costLevel: 'Premium',
    safetyScore: 96,
    internetScore: 94,
    transportScore: 98,
    language: 'Japanese; English signage is good in major stations and airports.',
    bestFor: ['Business travel', 'Urban efficiency', 'Solo travelers'],
    summary: 'Tokyo is a high-confidence destination for transit, safety, and operational predictability, making it strong for business trips and first-time Asia travel.',
    localRules: [
      'Keep phone calls quiet on public transport and use silent mode on trains.',
      'Many restaurants and local bars prefer cash even when chains accept cards.',
      'Trash bins are limited, so plan to carry small waste until disposal points.',
    ],
    emergencyNotes: [
      'Police is 110 and ambulance/fire is 119.',
      'Earthquake alerts may arrive on local devices or public announcement systems.',
      'Station staff can help with lost property and are usually very responsive.',
    ],
    dailyBrief: [
      'Morning rail peaks are dense; shift first meetings later if you can.',
      'Pocket Wi-Fi or eSIM setup at the airport prevents onboarding friction.',
      'The city runs with exceptional punctuality, so late arrivals stand out.',
    ],
    checklist: [
      'Load a digital Suica or Pasmo card.',
      'Carry one day of cash buffer.',
      'Check hotel laundry options for longer stays.',
      'Download an offline translation pack.',
    ],
    monthlyCostEstimate: 4620,
    heroGradient: 'from-[#eff7ff] via-[#fff6ef] to-[#d4e8ff]',
    tags: ['Ultra-safe', 'Rail-first', 'Cash-aware', 'High signal'],
    readinessStatus: 'Ready',
    lastChecked: '2026-04-25',
    sourceConfidence: 0.95,
    requirementSummary: 'U.S. passport valid for duration. No visa required for U.S. citizens for stays up to 90 days. Departure tax included in airfare. No health certificates needed.',
    passportValidityNote: 'Passport must be valid through your entire stay. Japan does not require 6-month validity like some countries.',
    visaSnapshot: 'Visa-free for U.S. citizens for up to 90 days (Temporary Visitor status). Single entry; cannot work.',
    healthSnapshot: 'No mandatory vaccinations. Healthcare in Japan is world-class. Travel insurance recommended for peace of mind.',
    budgetBand: '$4,200–$5,000/mo',
    whatChanged: ['Rail prices stable', 'Safe index maintained at 96%, highest tier'],
    sourceHierarchy: 'Official Japanese government · Embassy guidance · Partner logistics data',
    advisoryNote: 'Tokyo is one of the safest major cities globally with excellent infrastructure. Remain aware of earthquake preparedness and seasonal weather patterns. Respect local customs regarding public behavior, which is observed seriously.',
  },
  {
    id: 'dubai-uae',
    country: 'United Arab Emirates',
    city: 'Dubai',
    region: 'Middle East',
    currency: 'UAE Dirham (AED)',
    exchangeNote: 'AED is USD-pegged, which reduces FX volatility and makes short budgeting simpler for U.S. travelers.',
    costLevel: 'Premium',
    safetyScore: 92,
    internetScore: 93,
    transportScore: 84,
    language: 'Arabic and English are both highly usable in business settings.',
    bestFor: ['Business travel', 'Short luxury stays', 'Regional hub trips'],
    summary: 'Dubai offers a low-volatility currency environment, strong infrastructure, and clear premium positioning for business travelers needing speed and convenience.',
    localRules: [
      'Dress expectations vary by venue, but conservative public attire is still the safer default.',
      'Public intoxication and disorderly behavior carry more risk than many U.S. travelers assume.',
      'Ramadan timing changes daytime norms for eating and drinking in public spaces.',
    ],
    emergencyNotes: [
      'Police is 999 and ambulance is 998.',
      'Keep accommodation and employer contact details easy to access for official requests.',
      'Use licensed taxis or established ride apps for airport transfers.',
    ],
    dailyBrief: [
      'Indoor transit between meetings matters in summer because heat changes the true door-to-door experience.',
      'Taxis are efficient for cross-city business movement when metro transfers become time-costly.',
      'Cards are standard almost everywhere, which simplifies expense reporting.',
    ],
    checklist: [
      'Check local meeting dress code.',
      'Review Ramadan calendar if traveling in spring.',
      'Confirm hotel proximity to metro or main office zone.',
      'Carry hydration for outdoor transfers.',
    ],
    monthlyCostEstimate: 5280,
    heroGradient: 'from-[#f7fbff] via-[#fff5e8] to-[#e2f0ff]',
    tags: ['USD peg', 'Luxury', 'Heat-aware', 'Conference-ready'],
    readinessStatus: 'Review',
    lastChecked: '2026-04-20',
    sourceConfidence: 0.88,
    requirementSummary: 'U.S. passport valid for 6+ months. No visa required for stays up to 30 days. Business visa available for longer stays. Dress code and behavior expectations differ from Western norms.',
    passportValidityNote: 'Passport must be valid for at least 6 months from entry. Some hotels may request a copy for security registration.',
    visaSnapshot: 'Visa-free for U.S. citizens for 30 days (extendable). Online tourist visa and business visa available for longer stays.',
    healthSnapshot: 'No mandatory vaccinations. Healthcare in UAE is excellent but expensive. Comprehensive travel insurance highly recommended.',
    budgetBand: '$4,800–$5,800/mo',
    whatChanged: ['Ramadan 2026 ends April 1; plan social events accordingly', 'Summer heat (May–Sept) can exceed 110°F, affecting outdoor activity windows'],
    sourceHierarchy: 'UAE government official · Embassy guidance · Business travel guides',
    advisoryNote: 'Dubai is a highly organized business destination but requires awareness of cultural norms regarding dress, public behavior, and alcohol consumption. Verify meeting venue protocols before arrival. Summer temperatures are extreme; plan indoor work zones.',
  },
  {
    id: 'singapore-singapore',
    country: 'Singapore',
    city: 'Singapore',
    region: 'Asia',
    currency: 'Singapore Dollar (SGD)',
    exchangeNote: 'SGD is stable and digitally friendly; nearly all urban transactions can stay cash-light.',
    costLevel: 'Premium',
    safetyScore: 95,
    internetScore: 97,
    transportScore: 95,
    language: 'English, Mandarin, Malay, and Tamil; English is fully usable for visitors.',
    bestFor: ['Regional HQ travel', 'Remote work', 'High-efficiency stops'],
    summary: 'Singapore is one of the easiest premium destinations for operational clarity, digital payments, and high-confidence mobility.',
    localRules: [
      'Eating or drinking on MRT trains can trigger fines.',
      'Chewing gum import and sale rules are stricter than visitors expect.',
      'Jaywalking and littering enforcement are more active than in many U.S. cities.',
    ],
    emergencyNotes: [
      'Police is 999 and ambulance/fire is 995.',
      'Heat and humidity create faster dehydration during outdoor walking than the map suggests.',
      'Public hospitals are excellent, but travel insurance still matters for non-residents.',
    ],
    dailyBrief: [
      'MRT and tap-to-pay make city movement nearly frictionless.',
      'Hawker centers stay budget-friendly even when hotels do not.',
      'Meeting-heavy travel works well here because distances are short and predictable.',
    ],
    checklist: [
      'Set a mobile wallet before arrival.',
      'Pack lightweight business attire.',
      'Save hawker center recommendations by district.',
      'Review customs limits for tobacco and alcohol.',
    ],
    monthlyCostEstimate: 5480,
    heroGradient: 'from-[#ecf8ff] via-[#fff9ef] to-[#dceeff]',
    tags: ['Clean transit', 'Low friction', 'Meeting hub', 'Safe'],
    readinessStatus: 'Ready',
    lastChecked: '2026-04-22',
    sourceConfidence: 0.94,
    requirementSummary: 'U.S. passport valid for 6+ months. No visa required for U.S. citizens for stays up to 90 days. Singapore is ranked #1 for ease of business travel.',
    passportValidityNote: 'Passport must be valid for at least 6 months beyond your stay. Singapore immigration is efficient and well-organized.',
    visaSnapshot: 'Visa-free for U.S. citizens for 90 days (Social Visit Pass, automatically granted on arrival). Single entry; no work restrictions for short visits.',
    healthSnapshot: 'No mandatory vaccinations. Healthcare in Singapore is world-class and expensive without insurance. Travel insurance highly recommended.',
    budgetBand: '$4,950–$5,950/mo',
    whatChanged: ['Transit times stable', 'Safety maintained at 95% tier'],
    sourceHierarchy: 'Singapore Economic Development Board · Embassy guidance · Business ease-of-doing-business data',
    advisoryNote: 'Singapore is one of the world\'s safest and most efficient cities. Law enforcement is strict; follow posted rules closely. Humidity is high year-round; hydrate frequently. Excellent for business travel and remote work.',
  },
  {
    id: 'barcelona-spain',
    country: 'Spain',
    city: 'Barcelona',
    region: 'Europe',
    currency: 'Euro (EUR)',
    exchangeNote: 'EUR is straightforward for U.S. travelers, but seasonal lodging swings move the real trip cost more than FX does.',
    costLevel: 'Balanced',
    safetyScore: 73,
    internetScore: 88,
    transportScore: 89,
    language: 'Catalan and Spanish, with moderate English support in tourist and business districts.',
    bestFor: ['Creative work trips', 'Hybrid stays', 'Food-focused travel'],
    summary: 'Barcelona is compelling for lifestyle value and urban energy, but readiness planning should account for theft exposure in heavy tourist corridors.',
    localRules: [
      'Pickpocket prevention is part of normal city behavior, especially on transit and Las Ramblas.',
      'Dinner service starts later than many U.S. travelers expect.',
      'Beachwear belongs at the beach, not inland shopping streets.',
    ],
    emergencyNotes: [
      'EU emergency line is 112.',
      'If a theft occurs, file a police report quickly for insurance documentation.',
      'Use anti-theft bags in crowded metro stations.',
    ],
    dailyBrief: [
      'Transit is easy, but station awareness matters more than route complexity.',
      'Coworking inventory is strong around Eixample and Poblenou.',
      'Hotel and apartment costs spike sharply around major events and peak summer windows.',
    ],
    checklist: [
      'Use a zippered day bag.',
      'Prebook Sagrada Familia time slots.',
      'Check tourist tax assumptions in lodging totals.',
      'Carry a backup card separate from your wallet.',
    ],
    monthlyCostEstimate: 3380,
    heroGradient: 'from-[#f6fbff] via-[#fff7ed] to-[#dbe9ff]',
    tags: ['Creative city', 'Pickpocket risk', 'Beach access', 'Nomad-friendly'],
    readinessStatus: 'Review',
    lastChecked: '2026-04-18',
    sourceConfidence: 0.86,
    requirementSummary: 'U.S. passport valid for entire stay. Schengen visa not required for stays under 90 days. Pickpocket activity is moderate in tourist zones; use anti-theft precautions.',
    passportValidityNote: 'Passport must be valid for your entire stay. Schengen agreement covers 90 days per 180-day period.',
    visaSnapshot: 'Visa-free for U.S. citizens for up to 90 days (Schengen agreement). Multiple entry okay within 180-day window.',
    healthSnapshot: 'No mandatory vaccinations. EU healthcare is accessible, but travel insurance recommended for non-residents.',
    budgetBand: '$3,100–$3,700/mo',
    whatChanged: ['Pickpocket advisory remains active on Las Ramblas and tram lines', 'Tourist taxes increased 1% in 2026'],
    sourceHierarchy: 'Spanish government · EU policy · Local safety reports',
    advisoryNote: 'Barcelona is a vibrant, walkable city with strong infrastructure, but pickpocket activity in tourist zones is well-documented. Remain alert on crowded transit, especially tram 28 and metro lines. Use a secure day bag and consider leaving valuables at your accommodation.',
  },
  {
    id: 'mexico-city-mexico',
    country: 'Mexico',
    city: 'Mexico City',
    region: 'North America',
    currency: 'Mexican Peso (MXN)',
    exchangeNote: 'MXN is manageable for USD travelers, but card usage varies by neighborhood and venue size.',
    costLevel: 'Lean',
    safetyScore: 69,
    internetScore: 83,
    transportScore: 76,
    language: 'Spanish, with English support strongest in Roma, Condesa, Polanco, and business hotels.',
    bestFor: ['Value-conscious stays', 'Food travel', 'Remote workers'],
    summary: 'Mexico City delivers strong cultural and cost value, but readiness depends on neighborhood selection, transfer planning, and cash flexibility.',
    localRules: [
      'Use radio taxis, app rides, or hotel-arranged transport rather than street pickups late at night.',
      'Altitude affects energy on day one more than many visitors expect.',
      'Keep copies of identification if moving through nightlife districts.',
    ],
    emergencyNotes: [
      'Emergency support is 911 nationwide.',
      'Earthquake preparedness signage is common; note exits in high-rise stays.',
      'Medical care quality varies by district, so choose insurance with private hospital coverage.',
    ],
    dailyBrief: [
      'Neighborhood choice changes the quality of the trip more than city-level averages do.',
      'Coffee shops and coworking spaces are plentiful, but backup connectivity is still useful.',
      'Traffic can distort meeting schedules, so distance on the map is not the true travel time.',
    ],
    checklist: [
      'Choose your neighborhood before booking flights.',
      'Carry low-denomination cash.',
      'Plan airport transfer before landing.',
      'Hydrate early for altitude adjustment.',
    ],
    monthlyCostEstimate: 2480,
    heroGradient: 'from-[#f7fbff] via-[#fff4ea] to-[#dcedff]',
    tags: ['High value', 'Altitude', 'Neighborhood-led', 'Food capital'],
    readinessStatus: 'Review',
    lastChecked: '2026-04-15',
    sourceConfidence: 0.80,
    requirementSummary: 'U.S. passport valid for 6+ months. No visa required for stays up to 180 days. Neighborhood selection is critical for safety and experience quality. Altitude acclimatization recommended.',
    passportValidityNote: 'Passport must be valid for at least 6 months from entry. Mexico allows up to 180 days per visit for tourists.',
    visaSnapshot: 'Visa-free for U.S. citizens for up to 180 days (FMM tourist permit issued on arrival). No work authorization; permits are tourist-only.',
    healthSnapshot: 'No mandatory vaccinations. Altitude is 7,380 ft; allow 2–3 days for acclimatization. Travel insurance with private hospital coverage strongly recommended.',
    budgetBand: '$2,200–$2,800/mo',
    whatChanged: ['Altitude varies significantly by neighborhood; Roma is lower than Polanco', 'Earthquake preparedness remains standard infrastructure'],
    sourceHierarchy: 'Mexican tourism board · Embassy guidance · Neighborhood-level safety data',
    advisoryNote: 'Mexico City is a vibrant, culturally rich destination but requires careful neighborhood selection. Roma, Condesa, and Polanco are well-established for remote workers and business travelers. Altitude affects new arrivals; plan light activity for the first day. Use app-based transportation after dark and carry low-denomination cash for small venues.',
  },
  {
    id: 'cape-town-south-africa',
    country: 'South Africa',
    city: 'Cape Town',
    region: 'Africa',
    currency: 'South African Rand (ZAR)',
    exchangeNote: 'ZAR gives U.S. travelers strong buying power, but availability and safety practices matter more than the headline rate.',
    costLevel: 'Lean',
    safetyScore: 62,
    internetScore: 78,
    transportScore: 64,
    language: 'English is widely used alongside Afrikaans and Xhosa.',
    bestFor: ['Scenic long stays', 'Adventure travel', 'Remote work with planning'],
    summary: 'Cape Town is visually world-class and cost-efficient, but readiness should be grounded in neighborhood, transport, and load-shedding awareness.',
    localRules: [
      'Avoid displaying valuables openly when walking, especially after dark.',
      'Do not assume public transit is the default safest option for all routes.',
      'Power interruptions can affect workdays, so check backup power before booking stays.',
    ],
    emergencyNotes: [
      'National emergency line is 112 from mobile phones.',
      'Use rideshare or vetted drivers for evening movement.',
      'Confirm accommodations have backup power or water plans.',
    ],
    dailyBrief: [
      'Daylight planning matters because route comfort changes significantly after sunset.',
      'Remote work setup quality depends heavily on the building, not just the area.',
      'Scenic access is excellent, but weather shifts can quickly change hike or coastal conditions.',
    ],
    checklist: [
      'Verify backup power at your stay.',
      'Avoid arriving without a transfer plan.',
      'Check local weather and wind before outdoor excursions.',
      'Use a secondary phone battery pack.',
    ],
    monthlyCostEstimate: 2310,
    heroGradient: 'from-[#f5fbff] via-[#fff6ee] to-[#daeaff]',
    tags: ['Scenic', 'Load shedding', 'Value-rich', 'Planning heavy'],
    readinessStatus: 'Watch Closely',
    lastChecked: '2026-04-12',
    sourceConfidence: 0.75,
    requirementSummary: 'U.S. passport valid for 6+ months. No visa required for U.S. citizens for stays up to 90 days. Load-shedding (power cuts) can affect workdays. Neighborhood and accommodation selection are critical.',
    passportValidityNote: 'Passport must be valid for at least 6 months beyond your stay. South Africa pages must be free for entry stamps.',
    visaSnapshot: 'Visa-free for U.S. citizens for up to 90 days (Tourist visa on arrival). Multiple entry allowed within 12-month period.',
    healthSnapshot: 'No mandatory vaccinations. Yellow fever vaccine recommended if coming from endemic countries. Travel insurance essential; healthcare costs are high for non-residents.',
    budgetBand: '$2,100–$2,600/mo',
    whatChanged: ['Load-shedding remains ongoing; plan work around typical afternoon windows', 'Safety score decreased 3% due to petty crime uptick in Q1 2026'],
    sourceHierarchy: 'South African tourism · Embassy guidance · Local utility forecasts',
    advisoryNote: 'Cape Town is scenically stunning and cost-effective but requires active planning. Load-shedding (power cuts) typically occurs 2–4 hours daily; confirm your accommodation\'s backup power. Neighborhood choice and transport habits significantly impact safety and experience. Use vetted transportation, especially after dark, and remain aware of surroundings in less-familiar areas.',
  },
  {
    id: 'medellin-colombia',
    country: 'Colombia',
    city: 'Medellin',
    region: 'South America',
    currency: 'Colombian Peso (COP)',
    exchangeNote: 'COP can offer strong cost leverage for USD earners, but ATM strategy and card acceptance still matter.',
    costLevel: 'Lean',
    safetyScore: 66,
    internetScore: 81,
    transportScore: 79,
    language: 'Spanish, with some English in expat-heavy neighborhoods and coworking spaces.',
    bestFor: ['Digital nomads', 'Value stays', 'Climate-focused travel'],
    summary: 'Medellin remains attractive for cost-conscious remote workers, especially in well-chosen neighborhoods with vetted housing and transport habits.',
    localRules: [
      'Keep nightlife decisions conservative; situational awareness matters more than broad city averages.',
      'Use app rides or trusted transport after dark.',
      'Avoid wearing conspicuously expensive devices in crowded areas.',
    ],
    emergencyNotes: [
      'Emergency response line is 123.',
      'If a phone is essential for work, bring a backup device or contingency plan.',
      'Choose accommodations with strong reviews for entry security.',
    ],
    dailyBrief: [
      'Poblado and Laureles remain the easiest entry neighborhoods for first-time visitors.',
      'Coworking and coffee-shop infrastructure is solid but not uniform block by block.',
      'Weather is mild, which keeps packing simple for multiweek stays.',
    ],
    checklist: [
      'Decide neighborhood before booking.',
      'Split cash and cards across bags.',
      'Arrange airport transfer or ride app on arrival.',
      'Share itinerary details with a contact for late-night plans.',
    ],
    monthlyCostEstimate: 2140,
    heroGradient: 'from-[#f4fbff] via-[#fff7ef] to-[#dbeeff]',
    tags: ['Nomad hub', 'Value', 'Weather stable', 'Neighborhood-sensitive'],
    readinessStatus: 'Watch Closely',
    lastChecked: '2026-04-10',
    sourceConfidence: 0.78,
    requirementSummary: 'U.S. passport valid for 6+ months. Visa-free for up to 90 days. Neighborhood selection is paramount for safety and experience. Remote work infrastructure is strong in Poblado and Laureles.',
    passportValidityNote: 'Passport must be valid for at least 6 months. Colombia allows 90-day tourist permits; extensions available at DAS offices.',
    visaSnapshot: 'Visa-free for U.S. citizens for 90 days (V tourist permit issued on arrival). No work authorization without additional visa processing.',
    healthSnapshot: 'Yellow fever vaccine recommended (not mandatory unless coming from endemic countries). Travel insurance essential; healthcare quality varies by district.',
    budgetBand: '$1,950–$2,350/mo',
    whatChanged: ['Poblado safety has improved 5% over past 2 years', 'Digital nomad infrastructure expanding rapidly in 2026'],
    sourceHierarchy: 'Colombian tourism board · Expat community reports · Embassy guidance',
    advisoryNote: 'Medellin is the strongest value destination for digital nomads and remote workers but requires neighborhood awareness. Poblado and Laureles are established for visitors; avoid unfamiliar areas, especially after dark. Use app-based transportation consistently. Keep valuables concealed. The city has transformed significantly over the past decade and continues to improve, but situational awareness remains essential.',
  },
];

export const getDestinationById = (id: string) =>
  destinations.find((destination) => destination.id === id);

export const getDestinationReadinessScore = (destination: Destination) =>
  Math.round((destination.safetyScore + destination.internetScore + destination.transportScore) / 3);

export const getCostIndexValue = (destination: Destination) => {
  switch (destination.costLevel) {
    case 'Lean':
      return 42;
    case 'Balanced':
      return 68;
    case 'Premium':
      return 88;
    default:
      return 60;
  }
};

export const featuredDestinations = destinations.slice(0, 4);
