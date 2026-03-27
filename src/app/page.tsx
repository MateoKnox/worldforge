"use client";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FACTIONS, RECENT_EVENTS, STATS } from "@/lib/mockData";
import { Map, Users, BookOpen, Sword, Shield, Star, Github, ArrowRight, Zap } from "lucide-react";

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars: { x: number; y: number; r: number; o: number; speed: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.5 + 0.3, o: Math.random(), speed: Math.random() * 0.3 + 0.05 });
    }
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.o = 0.3 + 0.7 * Math.abs(Math.sin(frame * s.speed * 0.02));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,160,23,${s.o * 0.6})`;
        ctx.fill();
      });
      frame++;
      requestAnimationFrame(draw);
    };
    draw();
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-70" />;
}

function LiveCounter({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 60);
    const t = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  return (
    <div className="text-center">
      <div className="font-display text-2xl md:text-3xl font-bold text-[#d4a017]">{display.toLocaleString()}</div>
      <div className="text-xs text-[#6b6880] mt-1 tracking-widest uppercase">{label}</div>
    </div>
  );
}

const EVENT_ICONS: Record<string, string> = { war: "⚔", claim: "🏴", peace: "🕊", faction: "⚜" };

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        <StarField />

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--bg-primary), transparent)" }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(212,160,23,0.3)] text-[#d4a017] text-xs tracking-widest mb-8 glass">
            <Zap size={12} className="animate-pulse-gold" />
            LIVE · {STATS.playersOnline.toLocaleString()} PLAYERS ONLINE
          </div>

          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black tracking-wider text-white mb-6"
            style={{ textShadow: "0 0 60px rgba(212,160,23,0.4), 0 0 120px rgba(212,160,23,0.15)" }}>
            WORLD<span style={{ color: "#d4a017" }}>FORGE</span>
          </h1>

          <p className="text-lg md:text-xl text-[#a09880] max-w-2xl mx-auto mb-10 leading-relaxed">
            A persistent fantasy world shaped entirely by its community.
            Claim territories, forge factions, wage wars, and write your name into history.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/world" variant="primary">
              <Map size={16} /> Enter the World
            </Button>
            <Button href="https://github.com/MateoKnox/worldforge" variant="ghost">
              <Github size={16} /> Open Source
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6b6880] text-xs tracking-widest animate-float">
          <span>SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#d4a017] to-transparent" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 px-6 -mt-4">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-6 glow-gold">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-[rgba(212,160,23,0.15)]">
            <LiveCounter value={STATS.playersOnline} label="Players Online" />
            <LiveCounter value={STATS.territoriesClaimed} label="Territories Claimed" />
            <LiveCounter value={STATS.factionsActive} label="Factions Active" />
            <LiveCounter value={STATS.eventsToday} label="Events Today" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">How the World Works</h2>
          <p className="text-[#6b6880] max-w-xl mx-auto">Every action shapes the world. Every player leaves a mark.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Map, title: "Claim Territory", color: "#d4a017", desc: "Explore the hex-grid world map and plant your flag. Name your land, write its lore, and defend it from rivals." },
            { icon: Users, title: "Form Factions", color: "#7c3aed", desc: "Band together with other players. Build a faction, choose your colors, declare your purpose — and dominate the board." },
            { icon: BookOpen, title: "Shape History", color: "#16a34a", desc: "Every war, every treaty, every conquest is recorded. The world has memory. So does it remember your name?" },
          ].map(({ icon: Icon, title, color, desc }) => (
            <Card key={title} className="group hover:scale-[1.02] transition-transform duration-300 cursor-default">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-[#6b6880] leading-relaxed text-sm">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Live Events Feed */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Events */}
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#d4a017] animate-pulse-gold" />
              Live World Events
            </h2>
            <p className="text-[#6b6880] text-sm mb-6">What&apos;s happening right now across the realm</p>

            <div className="space-y-2">
              {RECENT_EVENTS.map((ev) => (
                <div key={ev.id} className="glass rounded-lg px-4 py-3 flex items-center gap-4 hover:border-[rgba(212,160,23,0.3)] transition-colors group">
                  <span className="text-lg">{EVENT_ICONS[ev.type] || "📜"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#e8e0d0] truncate">{ev.text}</p>
                  </div>
                  <span className="text-xs text-[#6b6880] whitespace-nowrap">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Factions Leaderboard */}
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Star size={16} className="text-[#d4a017]" />
              Top Factions
            </h2>
            <p className="text-[#6b6880] text-sm mb-6">Dominating the realm by territory count</p>

            <div className="space-y-3">
              {FACTIONS.map((f, i) => (
                <div key={f.id} className="glass rounded-xl px-5 py-4 flex items-center gap-4 hover:border-[rgba(212,160,23,0.3)] transition-colors">
                  <span className="font-display text-2xl font-black text-[#3a3830] w-6">#{i + 1}</span>
                  <div className="w-3 h-8 rounded-sm" style={{ background: f.color, boxShadow: `0 0 8px ${f.color}80` }} />
                  <div className="flex-1">
                    <div className="font-display font-bold text-white text-sm">{f.name}</div>
                    <div className="text-xs text-[#6b6880]">{f.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm font-bold" style={{ color: f.color }}>{f.territories.toLocaleString()}</div>
                    <div className="text-xs text-[#6b6880]">territories</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto glass rounded-2xl p-12 text-center glow-gold relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(212,160,23,0.08), transparent 70%)" }} />
          <Sword className="mx-auto text-[#d4a017] mb-6 animate-float" size={40} />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Your name belongs in the history books.</h2>
          <p className="text-[#a09880] mb-8">The world is waiting. Thousands of territories unclaimed. Alliances unformed. Battles unfought.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/world">
              <Map size={16} /> Enter the World <ArrowRight size={14} />
            </Button>
            <Button href="https://github.com/MateoKnox/worldforge" variant="ghost">
              <Shield size={16} /> Contribute on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(212,160,23,0.1)] px-6 py-8 text-center text-[#6b6880] text-sm">
        <p className="font-display tracking-widest text-[#d4a017] mb-2">⚔ WORLDFORGE</p>
        <p>Open source · Community driven · Always evolving</p>
        <a href="https://github.com/MateoKnox/worldforge" className="hover:text-[#d4a017] transition-colors mt-2 inline-block">
          <Github size={16} className="inline mr-1" /> github.com/MateoKnox/worldforge
        </a>
      </footer>
    </main>
  );
}
