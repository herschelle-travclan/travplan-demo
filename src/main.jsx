import { useState, useEffect, useRef } from "react";

const BOOKING = {
  id: "TXTIF-2026-DXB",
  destination: "Dubai, UAE",
  agent: "Rajesh Kumar",
  agency: "Skyline Travels",
  pax: "2 Adults, 1 Child",
  dates: "15 May – 20 May 2026",
  nights: "5N/6D",
  package: "Dubai Deluxe Explorer",
  totalValue: "₹2,45,000",
  hotel: "JW Marriott Marquis",
  flights: "AI-995 DEL→DXB / AI-996 DXB→DEL",
};

const STATUSES = [
  { key: "confirmed", label: "Booking Confirmed", date: "22 Apr 2026", done: true, icon: "✓" },
  { key: "customization", label: "Customization Phase", date: "24 Apr 2026", done: true, icon: "⚙" },
  { key: "voucher", label: "Voucher Shared", date: "27 Apr 2026", done: true, icon: "📄", active: true },
  { key: "docs_pending", label: "Docs Pending", date: "—", done: false, icon: "📋" },
  { key: "docs_complete", label: "Docs Complete", date: "—", done: false, icon: "✅" },
  { key: "travel_started", label: "Travel Started", date: "15 May 2026", done: false, icon: "✈" },
];

const ADDONS = [
  { id: 1, name: "Desert Safari with BBQ Dinner", price: "₹4,500", pp: "/person", img: "🏜️", tag: "Bestseller", desc: "Evening desert drive, camel ride, live entertainment & BBQ buffet" },
  { id: 2, name: "Dhow Cruise – Marina", price: "₹3,200", pp: "/person", img: "🚢", tag: "Popular", desc: "2-hour cruise with buffet dinner, live music & stunning skyline views" },
  { id: 3, name: "Candlelight Dinner at Burj Al Arab", price: "₹8,900", pp: "/couple", img: "🕯️", tag: "Premium", desc: "Exclusive 7-course meal at the world's most iconic hotel" },
  { id: 4, name: "IMG Worlds of Adventure", price: "₹3,800", pp: "/person", img: "🎢", tag: "Family", desc: "World's largest indoor theme park – Marvel, Cartoon Network & more" },
  { id: 5, name: "Abu Dhabi Day Tour", price: "₹5,200", pp: "/person", img: "🕌", tag: "Day Trip", desc: "Sheikh Zayed Mosque, Louvre Abu Dhabi, Corniche & lunch included" },
  { id: 6, name: "Helicopter Sightseeing (12 min)", price: "₹12,500", pp: "/person", img: "🚁", tag: "Luxury", desc: "Aerial views of Palm Jumeirah, Burj Khalifa & The World Islands" },
];

const PROMOS = [
  { id: 1, partner: "Star Cruises", offer: "3N Singapore–Penang Cruise", price: "From ₹18,999/pax", commission: "1.5% commission", color: "#0a4d8c", accent: "#38bdf8" },
  { id: 2, partner: "Atlantis Aquaventure", offer: "Waterpark + Lost Chambers Combo", price: "₹4,200/pax", commission: "2% commission", color: "#155e4a", accent: "#34d399" },
  { id: 3, partner: "Emirates Holidays", offer: "Maldives 4N Beach Villa", price: "From ₹62,000/pax", commission: "1% commission", color: "#7c2d12", accent: "#fb923c" },
];

const EMAILS = [
  { from: "agent", subject: "Booking Request – Dubai 5N/6D", date: "20 Apr", snippet: "Need a Dubai package for 2A+1C, 15-20 May. Prefer JW Marriott..." },
  { from: "team", subject: "Re: Booking Request – TXTIF Confirmed", date: "22 Apr", snippet: "Booking confirmed! ID: TXTIF-2026-DXB. JW Marriott Marquis secured..." },
  { from: "agent", subject: "Re: Customization – Add Marina Cruise", date: "23 Apr", snippet: "Can we add a Dhow Cruise on Day 3 evening? Also need vegetarian meals..." },
  { from: "team", subject: "Re: Customization Approved", date: "24 Apr", snippet: "Dhow Cruise added for Day 3. Veg meals confirmed with hotel. Updated itinerary..." },
  { from: "team", subject: "Voucher – TXTIF-2026-DXB", date: "27 Apr", snippet: "Please find attached the booking voucher. Kindly share docs at earliest..." },
];

const tagColors = {
  Bestseller: { bg: "#fef3c7", text: "#92400e" },
  Popular: { bg: "#dbeafe", text: "#1e40af" },
  Premium: { bg: "#fce7f3", text: "#9d174d" },
  Family: { bg: "#d1fae5", text: "#065f46" },
  "Day Trip": { bg: "#ede9fe", text: "#5b21b6" },
  Luxury: { bg: "#fff1f2", text: "#9f1239" },
};

export default function TravPlanPortal() {
  const [tab, setTab] = useState("status");
  const [customText, setCustomText] = useState("");
  const [customStatus, setCustomStatus] = useState(null);
  const [addedAddons, setAddedAddons] = useState(new Set());
  const [showEmailDetail, setShowEmailDetail] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const portalRef = useRef(null);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const handleCustomize = () => {
    if (!customText.trim()) return;
    setAiThinking(true);
    setCustomStatus(null);
    setTimeout(() => {
      setAiThinking(false);
      const canDo = customText.toLowerCase().includes("cancel") || customText.toLowerCase().includes("refund")
        ? false : true;
      setCustomStatus(canDo ? "approved" : "manual");
    }, 2200);
  };

  const toggleAddon = (id) => {
    setAddedAddons(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const activeIdx = STATUSES.findIndex(s => s.active);
  const progressPct = ((activeIdx + 0.5) / STATUSES.length) * 100;

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#f8f7f4",
      minHeight: "100vh",
      color: "#1a1a1a",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)",
        padding: "20px 24px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(251,191,36,0.08)",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -20, width: 160, height: 160,
          borderRadius: "50%", background: "rgba(56,189,248,0.06)",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "#fbbf24", textTransform: "uppercase", marginBottom: 4 }}>
              TravPlan Portal
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
              {BOOKING.destination}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
              {BOOKING.package} · {BOOKING.nights}
            </div>
          </div>
          <div style={{
            background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: 8, padding: "6px 12px",
          }}>
            <div style={{ fontSize: 10, color: "#fbbf24", fontWeight: 600, letterSpacing: 1 }}>BOOKING ID</div>
            <div style={{ fontSize: 15, color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>{BOOKING.id}</div>
          </div>
        </div>

        {/* Booking Quick Info */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16,
          position: "relative", zIndex: 1,
        }}>
          {[
            { label: "Agent", value: BOOKING.agent },
            { label: "Guests", value: BOOKING.pax },
            { label: "Travel Dates", value: BOOKING.dates },
            { label: "Hotel", value: BOOKING.hotel },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 10px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 500, marginTop: 2 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: "flex", gap: 0, background: "#fff",
        borderBottom: "1px solid #e5e5e0", position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        {[
          { key: "status", label: "Live Status", emoji: "📍" },
          { key: "customize", label: "Customize", emoji: "⚙️" },
          { key: "addons", label: "Add-Ons", emoji: "🛍️" },
          { key: "promos", label: "Deals", emoji: "🎯" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "12px 4px", border: "none", cursor: "pointer",
            background: tab === t.key ? "#fff" : "transparent",
            borderBottom: tab === t.key ? "2px solid #0f172a" : "2px solid transparent",
            fontSize: 12, fontWeight: tab === t.key ? 700 : 500,
            color: tab === t.key ? "#0f172a" : "#94a3b8",
            transition: "all 0.2s", fontFamily: "inherit",
          }}>
            <span style={{ fontSize: 14 }}>{t.emoji}</span>
            <br />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>

        {/* === STATUS TAB === */}
        {tab === "status" && (
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)", transition: "all 0.4s ease" }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Booking Progress</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Real-time status extracted from email conversations</div>

            {/* Progress Bar */}
            <div style={{ background: "#e5e5e0", borderRadius: 99, height: 6, marginBottom: 24, overflow: "hidden" }}>
              <div style={{
                width: `${progressPct}%`, height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg, #10b981, #fbbf24)",
                transition: "width 1s ease",
              }} />
            </div>

            {/* Status Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {STATUSES.map((s, i) => (
                <div key={s.key} style={{ display: "flex", gap: 12, position: "relative" }}>
                  {/* Vertical Line */}
                  {i < STATUSES.length - 1 && (
                    <div style={{
                      position: "absolute", left: 17, top: 36, bottom: -4, width: 2,
                      background: s.done ? "#10b981" : "#e5e5e0",
                    }} />
                  )}
                  {/* Circle */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16,
                    background: s.active ? "#fbbf24" : s.done ? "#10b981" : "#e5e5e0",
                    color: s.done || s.active ? "#fff" : "#94a3b8",
                    boxShadow: s.active ? "0 0 0 4px rgba(251,191,36,0.2)" : "none",
                    transition: "all 0.3s",
                  }}>
                    {s.icon}
                  </div>
                  {/* Text */}
                  <div style={{ paddingBottom: 20, flex: 1 }}>
                    <div style={{
                      fontSize: 14, fontWeight: s.active ? 700 : s.done ? 600 : 400,
                      color: s.active ? "#0f172a" : s.done ? "#1a1a1a" : "#94a3b8",
                    }}>
                      {s.label}
                      {s.active && (
                        <span style={{
                          marginLeft: 8, fontSize: 10, fontWeight: 700, color: "#92400e",
                          background: "#fef3c7", padding: "2px 8px", borderRadius: 99,
                        }}>CURRENT</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{s.date}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Email Thread Summary */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>📧 Email Thread (AI-Parsed)</div>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>Our AI reads your booking emails and extracts status updates automatically</div>
              {EMAILS.map((e, i) => (
                <div key={i} onClick={() => setShowEmailDetail(showEmailDetail === i ? null : i)} style={{
                  background: "#fff", borderRadius: 10, padding: "10px 12px", marginBottom: 6,
                  border: "1px solid #e5e5e0", cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: showEmailDetail === i ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                        background: e.from === "agent" ? "#dbeafe" : "#d1fae5",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700,
                        color: e.from === "agent" ? "#1e40af" : "#065f46",
                      }}>
                        {e.from === "agent" ? "A" : "T"}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {e.subject}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0, marginLeft: 8 }}>{e.date}</div>
                  </div>
                  {showEmailDetail === i && (
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, paddingLeft: 36, lineHeight: 1.5 }}>
                      {e.snippet}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === CUSTOMIZE TAB === */}
        {tab === "customize" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Request Customization</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
              Our AI agent checks your request against our SOPs and processes it automatically
            </div>

            {/* How it works */}
            <div style={{
              background: "#fff", borderRadius: 12, padding: 14, marginBottom: 16,
              border: "1px solid #e5e5e0",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: "#0f172a" }}>⚡ How AI Customization Works</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { step: "1", text: "You describe what you want to change", color: "#dbeafe" },
                  { step: "2", text: "AI Agent checks against SOPs", color: "#fef3c7" },
                  { step: "3a", text: "Auto-approved → Email sent to supplier", color: "#d1fae5" },
                  { step: "3b", text: "Needs review → Routed to our team", color: "#fce7f3" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, background: s.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, flexShrink: 0,
                    }}>{s.step}</div>
                    <div style={{ fontSize: 12, color: "#334155" }}>{s.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <textarea
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="Describe your customization request... e.g., 'Add an extra night at JW Marriott' or 'Change Day 3 sightseeing to Global Village'"
              style={{
                width: "100%", minHeight: 100, borderRadius: 12, border: "1px solid #e5e5e0",
                padding: 14, fontSize: 13, fontFamily: "inherit", resize: "vertical",
                background: "#fff", outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#fbbf24"}
              onBlur={e => e.target.style.borderColor = "#e5e5e0"}
            />
            <button onClick={handleCustomize} disabled={aiThinking || !customText.trim()} style={{
              width: "100%", marginTop: 10, padding: "12px 0", borderRadius: 10,
              background: aiThinking ? "#94a3b8" : "#0f172a", color: "#fff",
              fontSize: 14, fontWeight: 700, border: "none", cursor: aiThinking ? "default" : "pointer",
              transition: "all 0.2s", fontFamily: "inherit",
            }}>
              {aiThinking ? "🤖 AI Agent Analyzing..." : "Submit Request"}
            </button>

            {/* AI Thinking Animation */}
            {aiThinking && (
              <div style={{
                marginTop: 16, background: "#fff", borderRadius: 12, padding: 16,
                border: "1px solid #e5e5e0", textAlign: "center",
              }}>
                <div style={{ fontSize: 24, marginBottom: 8, animation: "pulse 1.5s infinite" }}>🤖</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>AI Agent Processing</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Checking SOPs & supplier availability...</div>
                <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }`}</style>
              </div>
            )}

            {/* Result */}
            {customStatus === "approved" && (
              <div style={{
                marginTop: 16, background: "#d1fae5", borderRadius: 12, padding: 16,
                border: "1px solid #a7f3d0",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#065f46" }}>✅ Request Auto-Approved</div>
                <div style={{ fontSize: 12, color: "#047857", marginTop: 4, lineHeight: 1.5 }}>
                  Our AI agent has verified this against SOPs. An email has been automatically sent to the supplier for confirmation. You'll receive an update within 2 hours.
                </div>
              </div>
            )}
            {customStatus === "manual" && (
              <div style={{
                marginTop: 16, background: "#fef3c7", borderRadius: 12, padding: 16,
                border: "1px solid #fde68a",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e" }}>🔄 Routed to Manual Review</div>
                <div style={{ fontSize: 12, color: "#a16207", marginTop: 4, lineHeight: 1.5 }}>
                  This request requires human review per our SOPs. A team member will evaluate and respond within 4 hours. Cancellation & refund requests need manual processing.
                </div>
              </div>
            )}
          </div>
        )}

        {/* === ADD-ONS TAB === */}
        {tab === "addons" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Enhance Your Trip</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
              Curated experiences for Dubai · Add directly to your booking
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ADDONS.map(a => {
                const added = addedAddons.has(a.id);
                const tc = tagColors[a.tag] || { bg: "#f1f5f9", text: "#475569" };
                return (
                  <div key={a.id} style={{
                    background: "#fff", borderRadius: 14, overflow: "hidden",
                    border: added ? "2px solid #10b981" : "1px solid #e5e5e0",
                    transition: "all 0.2s",
                    boxShadow: added ? "0 0 0 2px rgba(16,185,129,0.1)" : "none",
                  }}>
                    <div style={{ padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 22 }}>{a.img}</span>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700 }}>{a.name}</div>
                              <span style={{
                                fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                                background: tc.bg, color: tc.text,
                              }}>{a.tag}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 6, lineHeight: 1.4 }}>{a.desc}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <div>
                          <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{a.price}</span>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}> {a.pp}</span>
                        </div>
                        <button onClick={() => toggleAddon(a.id)} style={{
                          padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                          border: "none", cursor: "pointer", fontFamily: "inherit",
                          background: added ? "#d1fae5" : "#0f172a",
                          color: added ? "#065f46" : "#fff",
                          transition: "all 0.2s",
                        }}>
                          {added ? "✓ Added" : "Add to Trip"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {addedAddons.size > 0 && (
              <div style={{
                marginTop: 16, background: "#0f172a", borderRadius: 12, padding: 14,
                color: "#fff", textAlign: "center",
              }}>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{addedAddons.size} add-on(s) selected</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
                  Confirm & Add to Booking →
                </div>
              </div>
            )}
          </div>
        )}

        {/* === PROMOS TAB === */}
        {tab === "promos" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Exclusive Partner Deals</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
              Special offers from our partners · Book and earn additional commissions
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PROMOS.map(p => (
                <div key={p.id} style={{
                  borderRadius: 14, overflow: "hidden",
                  background: `linear-gradient(135deg, ${p.color} 0%, ${p.color}dd 100%)`,
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute", top: -20, right: -20, width: 100, height: 100,
                    borderRadius: "50%", background: `${p.accent}15`,
                  }} />
                  <div style={{ padding: 16, position: "relative", zIndex: 1 }}>
                    <div style={{
                      display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: 1,
                      color: p.accent, background: `${p.accent}20`, padding: "3px 8px",
                      borderRadius: 4, textTransform: "uppercase", marginBottom: 8,
                    }}>
                      {p.partner}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{p.offer}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{p.price}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                      <div style={{
                        fontSize: 11, fontWeight: 700, color: p.accent,
                        background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: 6,
                      }}>
                        💰 Earn {p.commission}
                      </div>
                      <button style={{
                        padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                        border: `1px solid ${p.accent}`, background: "transparent",
                        color: "#fff", cursor: "pointer", fontFamily: "inherit",
                      }}>
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue Summary */}
            <div style={{
              marginTop: 20, background: "#fff", borderRadius: 12, padding: 14,
              border: "1px solid #e5e5e0",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📊 Revenue Potential (This Booking)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Base Package Margin", value: "₹18,500", color: "#0f172a" },
                  { label: "Add-On Revenue (est.)", value: "₹3,200", color: "#10b981" },
                  { label: "Promo Commission (est.)", value: "₹1,800", color: "#f59e0b" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", borderTop: "2px solid #0f172a" }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Total Potential</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#10b981" }}>₹23,500</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating WhatsApp CTA */}
      <div style={{
        position: "fixed", bottom: 20, right: 20,
        background: "#25D366", width: 48, height: 48, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(37,211,102,0.3)", cursor: "pointer",
        fontSize: 22,
      }}>
        💬
      </div>
    </div>
  );
}
