export const FACTIONS = [
  { id: "1", name: "Iron Veil", color: "#dc2626", description: "Warriors of the Northern Wastes", territories: 847, members: 234 },
  { id: "2", name: "Arcane Accord", color: "#7c3aed", description: "Scholars of the Hidden Arts", territories: 612, members: 189 },
  { id: "3", name: "Golden Tide", color: "#d4a017", description: "Merchants of the Endless Sea", territories: 531, members: 311 },
  { id: "4", name: "Verdant Oath", color: "#16a34a", description: "Guardians of the Ancient Groves", territories: 423, members: 156 },
  { id: "5", name: "Void Covenant", color: "#0891b2", description: "Seekers of the Between", territories: 298, members: 97 },
];

export const RECENT_EVENTS = [
  { id: "1", type: "war", text: "Iron Veil declared war on Arcane Accord", time: "2m ago", faction: FACTIONS[0] },
  { id: "2", type: "claim", text: "GoldenKnight claimed the Ashford Plains", time: "5m ago", faction: FACTIONS[2] },
  { id: "3", type: "peace", text: "Verdant Oath signed a peace treaty with Void Covenant", time: "12m ago", faction: FACTIONS[3] },
  { id: "4", type: "claim", text: "ShadowMage claimed the Sunken Citadel", time: "18m ago", faction: FACTIONS[1] },
  { id: "5", type: "faction", text: "New faction formed: The Ember Crown", time: "24m ago", faction: null },
  { id: "6", type: "war", text: "Void Covenant razed the Forest of Whispers", time: "31m ago", faction: FACTIONS[4] },
  { id: "7", type: "claim", text: "IronHand claimed the Frozen Keep", time: "45m ago", faction: FACTIONS[0] },
  { id: "8", type: "claim", text: "TideMaster claimed the Crystal Shores", time: "1h ago", faction: FACTIONS[2] },
  { id: "9", type: "peace", text: "Iron Veil and Golden Tide formed an alliance", time: "1h ago", faction: null },
  { id: "10", type: "claim", text: "VoidWalker claimed the Shattered Mesa", time: "2h ago", faction: FACTIONS[4] },
];

export const STATS = {
  playersOnline: 1247,
  territoriesClaimed: 2711,
  factionsActive: 47,
  eventsToday: 892,
};
