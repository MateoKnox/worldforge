"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { FACTIONS, RECENT_EVENTS } from "@/lib/mockData";
import { Map, Users, Sword, X, Flag } from "lucide-react";

// Hex grid constants
const HEX_SIZE = 22;
const COLS = 60;
const ROWS = 40;
const sqrt3 = Math.sqrt(3);

type Territory = {
  q: number;
  r: number;
  name: string;
  factionId: string;
  ownerId: string;
  lore: string;
};

// Generate mock territories
function generateTerritories(): Territory[] {
  const territories: Territory[] = [];
  const names = ["Ashford Plains", "Sunken Citadel", "Crystal Shores", "Frozen Keep", "Shattered Mesa",
    "Iron Peaks", "Shadow Vale", "Ember Crossing", "Storm Gate", "Void Hollow",
    "The Red Wastes", "Goldmere", "Whisper Wood", "Blackstone Fort", "Tide Harbor",
    "Dusk Cathedral", "Serpent Bay", "The Pale Reach", "Ironwall", "Crimson Fields"];
  const owners = ["GoldenKnight", "ShadowMage", "TideMaster", "IronHand", "VoidWalker",
    "StormRider", "AshBorn", "EmberId", "NightShade", "CrimsonBlade"];
  const lores = [
    "A vast plain swept by golden winds, contested for centuries.",
    "An ancient fortress swallowed by the earth, now risen again.",
    "Where the sea meets crystal caverns, treasure lies within.",
    "The northernmost stronghold — none have taken it twice.",
    "A fractured landscape of stone pillars and ancient ruins.",
  ];

  for (let i = 0; i < 120; i++) {
    const q = Math.floor(Math.random() * COLS);
    const r = Math.floor(Math.random() * ROWS);
    const faction = FACTIONS[Math.floor(Math.random() * FACTIONS.length)];
    territories.push({
      q, r,
      name: names[Math.floor(Math.random() * names.length)],
      factionId: faction.id,
      ownerId: owners[Math.floor(Math.random() * owners.length)],
      lore: lores[Math.floor(Math.random() * lores.length)],
    });
  }
  return territories;
}

function hexToPixel(q: number, r: number, size: number, offsetX: number, offsetY: number) {
  const x = size * sqrt3 * (q + r / 2) + offsetX;
  const y = size * 1.5 * r + offsetY;
  return { x, y };
}

function hexCorners(cx: number, cy: number, size: number) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    pts.push([cx + size * Math.cos(angle), cy + size * Math.sin(angle)]);
  }
  return pts;
}

export default function WorldPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [territories] = useState<Territory[]>(generateTerritories);
  const [hoveredHex, setHoveredHex] = useState<{ q: number; r: number } | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [offset, setOffset] = useState({ x: 40, y: 30 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetRef = useRef(offset);
  offsetRef.current = offset;

  const territoriesMap = new Map(territories.map(t => [`${t.q},${t.r}`, t]));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#08080f";
    ctx.fillRect(0, 0, W, H);

    const ox = offsetRef.current.x;
    const oy = offsetRef.current.y;

    for (let r = 0; r < ROWS; r++) {
      for (let q = 0; q < COLS; q++) {
        const { x, y } = hexToPixel(q, r, HEX_SIZE, ox, oy);
        if (x < -HEX_SIZE * 2 || x > W + HEX_SIZE * 2 || y < -HEX_SIZE * 2 || y > H + HEX_SIZE * 2) continue;

        const corners = hexCorners(x, y, HEX_SIZE - 1.5);
        const territory = territoriesMap.get(`${q},${r}`);
        const isHovered = hoveredHex?.q === q && hoveredHex?.r === r;

        ctx.beginPath();
        corners.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py));
        ctx.closePath();

        if (territory) {
          const faction = FACTIONS.find(f => f.id === territory.factionId);
          const color = faction?.color || "#888";
          ctx.fillStyle = isHovered ? color + "dd" : color + "55";
          ctx.fill();
          ctx.strokeStyle = isHovered ? color : color + "99";
          ctx.lineWidth = isHovered ? 2 : 1;
          ctx.stroke();

          // Glow
          if (isHovered) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 14;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.fillStyle = isHovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)";
          ctx.fill();
          ctx.strokeStyle = isHovered ? "rgba(212,160,23,0.4)" : "rgba(255,255,255,0.04)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }, [hoveredHex, territoriesMap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw();
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw, offset, hoveredHex]);

  function pixelToHex(px: number, py: number) {
    const ox = offsetRef.current.x;
    const oy = offsetRef.current.y;
    // Approximate — find nearest hex
    let bestQ = 0, bestR = 0, bestDist = Infinity;
    const approxR = Math.round((py - oy) / (HEX_SIZE * 1.5));
    const approxQ = Math.round((px - ox - approxR * HEX_SIZE * sqrt3 / 2) / (HEX_SIZE * sqrt3));
    for (let dr = -2; dr <= 2; dr++) {
      for (let dq = -2; dq <= 2; dq++) {
        const r = approxR + dr;
        const q = approxQ + dq;
        if (q < 0 || q >= COLS || r < 0 || r >= ROWS) continue;
        const { x, y } = hexToPixel(q, r, HEX_SIZE, ox, oy);
        const dist = Math.hypot(px - x, py - y);
        if (dist < bestDist) { bestDist = dist; bestQ = q; bestR = r; }
      }
    }
    return bestDist < HEX_SIZE ? { q: bestQ, r: bestR } : null;
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (dragging) {
      setOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
      return;
    }

    const hex = pixelToHex(px, py);
    setHoveredHex(hex);
  }

  function onClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const hex = pixelToHex(e.clientX - rect.left, e.clientY - rect.top);
    if (!hex) return;
    const t = territoriesMap.get(`${hex.q},${hex.r}`);
    setSelectedTerritory(t || null);
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="flex flex-1 pt-16" style={{ height: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 glass border-r border-[rgba(212,160,23,0.1)] overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-[rgba(212,160,23,0.1)]">
            <h2 className="font-display text-sm font-bold text-[#d4a017] tracking-widest flex items-center gap-2">
              <Map size={14} /> WORLD MAP
            </h2>
          </div>

          {/* Factions */}
          <div className="p-4 border-b border-[rgba(212,160,23,0.1)]">
            <h3 className="font-display text-xs text-[#6b6880] tracking-widest mb-3 flex items-center gap-2">
              <Users size={11} /> FACTIONS
            </h3>
            {FACTIONS.map(f => (
              <div key={f.id} className="flex items-center gap-3 py-1.5">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: f.color, boxShadow: `0 0 6px ${f.color}` }} />
                <span className="text-xs text-[#a09880] truncate">{f.name}</span>
                <span className="ml-auto text-xs font-display" style={{ color: f.color }}>{f.territories}</span>
              </div>
            ))}
          </div>

          {/* Selected territory */}
          {selectedTerritory && (
            <div className="p-4 border-b border-[rgba(212,160,23,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xs text-[#6b6880] tracking-widest flex items-center gap-2">
                  <Flag size={11} /> TERRITORY
                </h3>
                <button onClick={() => setSelectedTerritory(null)} className="text-[#6b6880] hover:text-white">
                  <X size={14} />
                </button>
              </div>
              <div className="font-display font-bold text-white mb-1">{selectedTerritory.name}</div>
              <div className="text-xs text-[#6b6880] mb-2">Owner: <span className="text-[#a09880]">{selectedTerritory.ownerId}</span></div>
              {(() => {
                const f = FACTIONS.find(f => f.id === selectedTerritory.factionId);
                return f ? <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-sm" style={{ background: f.color }} />
                  <span className="text-xs" style={{ color: f.color }}>{f.name}</span>
                </div> : null;
              })()}
              <p className="text-xs text-[#6b6880] italic leading-relaxed">{selectedTerritory.lore}</p>
              <div className="mt-3 text-xs text-[#3a3830]">Hex: {selectedTerritory.q},{selectedTerritory.r}</div>
            </div>
          )}

          {/* Recent events */}
          <div className="p-4 flex-1">
            <h3 className="font-display text-xs text-[#6b6880] tracking-widest mb-3 flex items-center gap-2">
              <Sword size={11} /> RECENT EVENTS
            </h3>
            <div className="space-y-2">
              {RECENT_EVENTS.slice(0, 8).map(ev => (
                <div key={ev.id} className="text-xs text-[#6b6880] leading-relaxed py-1 border-b border-[rgba(255,255,255,0.03)]">
                  {ev.text}
                  <span className="block text-[#3a3830] mt-0.5">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            style={{ display: "block" }}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setHoveredHex(null)}
            onClick={onClick}
            onMouseDown={(e) => { setDragging(true); dragStart.current = { x: e.clientX, y: e.clientY }; }}
            onMouseUp={() => setDragging(false)}
          />

          {/* Hover tooltip */}
          {hoveredHex && (() => {
            const t = territoriesMap.get(`${hoveredHex.q},${hoveredHex.r}`);
            if (!t) return null;
            const f = FACTIONS.find(f => f.id === t.factionId);
            return (
              <div className="absolute top-4 right-4 glass rounded-xl p-4 max-w-xs pointer-events-none">
                <div className="font-display font-bold text-white text-sm mb-1">{t.name}</div>
                {f && <div className="text-xs mb-1" style={{ color: f.color }}>{f.name}</div>}
                <div className="text-xs text-[#6b6880]">Owner: {t.ownerId}</div>
                <div className="text-xs text-[#3a3830] mt-1">Click to inspect</div>
              </div>
            );
          })()}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass rounded-xl p-3 text-xs text-[#6b6880]">
            <div className="font-display text-[#d4a017] mb-2 text-xs tracking-widest">LEGEND</div>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-[rgba(255,255,255,0.06)]" /> Unclaimed</div>
            {FACTIONS.slice(0, 3).map(f => (
              <div key={f.id} className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-sm" style={{ background: f.color + "88" }} />
                {f.name}
              </div>
            ))}
            <div className="mt-2 text-[#3a3830]">Drag to pan · Click hex to inspect</div>
          </div>
        </div>
      </div>
    </main>
  );
}
