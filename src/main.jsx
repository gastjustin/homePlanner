import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const uid = () => Math.random().toString(36).slice(2, 9);
const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n || 0));
const money2 = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n || 0));
const fmtDate = (d) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);

const seed = {
  schemaVersion: 8,
  budget: { weeklyBudget: 500, startingBalance: 0, contingencyPct: 12 },
  projects: [
    {
      id: uid(), name: 'Craftsman Interior Doors', icon: '🚪', priority: 1, labor: 0, laborKnown: false,
      notes: '9 RELIABILT 3-panel Craftsman primed smooth hollow-core molded-composite interior slab doors: 6 × 32×80, 2 × 24×80, 1 × 30×80. Labor estimate pending. Pricing is seeded from the Lowe\'s products we identified; verify local-store pricing before ordering.',
      specs: [
        'Style: RELIABILT 3-panel Craftsman, smooth primed molded composite',
        'Construction: hollow-core interior slab doors',
        'Sizes: 6 × 32×80 in · 2 × 24×80 in · 1 × 30×80 in',
        'Door slabs are not a labor quote; installation remains $0 until contractor estimates arrive'
      ],
      parts: [
        { id: uid(), name: 'RELIABILT 32-in × 80-in Primed 3-panel Craftsman Hollow-Core Slab Door', qty: 6, unitPrice: 124.00, priceKnown: true, url: 'https://www.lowes.com/pd/RELIABILT-32-in-x-80-in-White-3-panel-Craftsman-Hollow-Core-Molded-Composite-Slab-Door/5014873041' },
        { id: uid(), name: 'RELIABILT 24-in × 80-in Primed 3-panel Craftsman Hollow-Core Slab Door', qty: 2, unitPrice: 109.00, priceKnown: true, url: 'https://www.lowes.com/pd/ReliaBilt-White-3-Panel-Craftsman-Hollow-Core-Molded-Composite-Slab-Door-Common-24-in-x-80-in-Actual-24-in-x-80-in/3550826' },
        { id: uid(), name: 'RELIABILT 30-in × 80-in Primed 3-panel Craftsman Hollow-Core Slab Door', qty: 1, unitPrice: 119.00, priceKnown: true, url: 'https://www.lowes.com/pd/ReliaBilt-White-3-Panel-Craftsman-Hollow-Core-Molded-Composite-Slab-Door-Common-30-in-x-80-in-Actual-30-in-x-80-in/3550820' }
      ]
    },
    {
      id: uid(), name: 'Upstairs Baseboards', icon: '🪚', priority: 2, labor: 0, laborKnown: false,
      notes: 'Replace about 600 linear ft of existing ~6-in-high × 1/2-in-thick baseboard. Planning with ~15% waste, so the material target is about 690 linear ft. Labor/removal/caulk/fill/paint estimate pending.',
      specs: [
        'Existing profile: about 6 in high × 1/2 in thick',
        'Measured scope: ~600 linear ft upstairs',
        'Purchase target: ~690 linear ft including ~15% waste',
        '58 × 12-ft boards = 696 linear ft total'
      ],
      parts: [
        { id: uid(), name: 'RELIABILT 1/2-in × 5-1/2-in × 12-ft Craftsman Primed MDF Baseboard', qty: 58, unitPrice: 12.98, priceKnown: true, url: 'https://www.lowes.com/pd/Craftsman-5-1-2-in-x-12-ft-Primed-MDF-Baseboard-Moulding-Actual-5-5-in-x-12-ft/1000460529' }
      ]
    },
    {
      id: uid(), name: 'Living Room BESTÅ Wall', icon: '📺', priority: 3, labor: 0, laborKnown: false,
      notes: 'Near-complete IKEA estimate based on the recovered design from our Modular Setup Design conversation: 11 BESTÅ frames total, brown/walnut-effect LAPPVIKEN fronts, push-open/soft-close hinges, tower shelves, top panels and a conservative suspension-rail allowance. Current seeded IKEA materials total about $1,125 before tax/delivery. Labor remains $0 until contractor quotes arrive.',
      specs: [
        'Wall: 175 in wide × 95 in high',
        'TV: 85 in, stays wall-mounted',
        'Overall cabinetry width: 165 3/8 in with ~4 3/4 in reveal at each end',
        'TV zone: 94 1/2 in wide = four 23 5/8-in lower modules',
        'Right tower: one 23 5/8-in-wide × 75 5/8-in-high BESTÅ frame',
        'Right-side console: 47 1/4 in wide = two 23 5/8-in lower modules',
        'Upper bridge: four shallow 23 5/8 × 7 7/8 × 15 in BESTÅ frames',
        'Fronts: 10 × LAPPVIKEN brown/walnut-effect 23 5/8 × 15 in + 3 × 23 5/8 × 25 1/4 in tower doors',
        'Push-open hinges mean handles are not required',
        'Rail count is intentionally conservative at 10: 4 are needed for the upper bridge; up to 6 more are used if the lower cabinets are wall-hung rather than set on a plinth',
        'Estimate excludes sales tax, delivery, custom filler/plinth/trim, wall fasteners selected for your wall type, electrical/cable work and contractor labor'
      ],
      parts: [
        { id: uid(), name: 'BESTÅ frame, white, 23 5/8 × 15 3/4 × 15 in — TV base + side console', qty: 6, unitPrice: 45.00, priceKnown: true, url: 'https://www.ikea.com/us/en/p/besta-frame-white-70245848/' },
        { id: uid(), name: 'BESTÅ frame, white, 23 5/8 × 7 7/8 × 15 in — shallow upper bridge', qty: 4, unitPrice: 35.00, priceKnown: true, url: 'https://www.ikea.com/us/en/p/besta-frame-white-00245917/' },
        { id: uid(), name: 'BESTÅ frame, white, 23 5/8 × 15 3/4 × 75 5/8 in — tall tower', qty: 1, unitPrice: 90.00, priceKnown: true, url: 'https://www.ikea.com/us/en/p/besta-frame-white-00245842/' },
        { id: uid(), name: 'LAPPVIKEN door/drawer front, brown/walnut effect, 23 5/8 × 15 in', qty: 10, unitPrice: 15.00, priceKnown: true, url: 'https://www.ikea.com/us/en/p/lappviken-door-drawer-front-brown-walnut-effect-80628733/' },
        { id: uid(), name: 'LAPPVIKEN door, brown/walnut effect, 23 5/8 × 25 1/4 in — tower', qty: 3, unitPrice: 20.00, priceKnown: true, url: 'https://www.ikea.com/us/en/p/lappviken-door-brown-walnut-effect-00628732/' },
        { id: uid(), name: 'BESTÅ soft closing / push-open hinge, 2-pack — one pack per door/front', qty: 13, unitPrice: 15.00, priceKnown: true, url: 'https://www.ikea.com/us/en/p/besta-soft-closing-push-open-hinge-80261258/' },
        { id: uid(), name: 'BESTÅ suspension rail, 23 5/8 in — conservative wall-mount allowance', qty: 10, unitPrice: 10.00, priceKnown: true, url: 'https://www.ikea.com/us/en/p/besta-suspension-rail-silver-color-70488318/' },
        { id: uid(), name: 'BESTÅ shelf, white, 22 × 14 1/8 in — tower interior', qty: 3, unitPrice: 15.00, priceKnown: true, url: 'https://www.ikea.com/us/en/p/besta-shelf-white-00295554/' },
        { id: uid(), name: 'BESTÅ top panel, brown/walnut, 47 1/4 × 16 1/2 in — TV base + side console', qty: 3, unitPrice: 25.00, priceKnown: true, url: 'https://www.ikea.com/us/en/cat/besta-all-parts-accessories-700278/' }
      ]
    },
    {
      id: uid(), name: 'Front Entry Door', icon: '🚪', priority: 4, labor: 0, laborKnown: false,
      notes: 'Krosswood 70 × 80 in Knotty Alder prehung front-entry door. Exact product price/link still needs to be matched from the original saved item; labor estimate pending.',
      specs: ['70 × 80 in prehung exterior door','Knotty Alder','Provincial stain','Clear glass','Left-hand inswing','Status: needs exact product pricing + labor quote'],
      parts: [{ id: uid(), name: 'Krosswood 70 × 80 Knotty Alder prehung entry door — exact configuration', qty: 1, unitPrice: 0, priceKnown: false, url: '' }]
    },
    {
      id: uid(), name: 'Patio Sliding Door', icon: '🌤️', priority: 5, labor: 0, laborKnown: false,
      notes: 'Pella 150 Series 72 × 80 in sliding patio door with integrated blinds. Seeded planning price is $1,398; verify current/local pricing before ordering. Labor estimate pending.',
      specs: ['72 × 80 in','Pella 150 Series','White vinyl','Low-E glass','Integrated between-glass blinds','Left-hand sliding operation','Status: materials priced; needs labor quote'],
      parts: [{ id: uid(), name: 'Pella 150 Series 72 × 80 Sliding Patio Door with Blinds, left-hand', qty: 1, unitPrice: 1398, priceKnown: true, url: 'https://www.lowes.com/pd/Pella-150-SPD-LH-72X80-IN-SNDF-BBG-HP/5015113651' }]
    },
    {
      id: uid(), name: 'Back Entry Door', icon: '🚪', priority: 6, labor: 0, laborKnown: false,
      notes: 'MMI DOOR 36 × 80 in fiberglass prehung back-entry door. Price is intentionally left at $0 until the exact saved configuration is positively matched. Labor estimate pending.',
      specs: ['36 × 80 in prehung exterior door','Fiberglass','3/4-lite','Internal blinds','Left-hand inswing','Status: needs exact product pricing + labor quote'],
      parts: [{ id: uid(), name: 'MMI DOOR 36 × 80 Fiberglass Prehung Door with Internal Blinds — exact configuration', qty: 1, unitPrice: 0, priceKnown: false, url: '' }]
    },
    {
      id: uid(), name: 'Closet Shelving & Organization', icon: '👚', priority: 7, labor: 0, laborKnown: false,
      notes: 'Closet organization project centered on IKEA BOAXEL with wood shelving, black woven baskets and rechargeable warm-white motion lighting. Some exact quantities, measurements and product URLs still need to be finalized.',
      specs: ['Primary system: IKEA BOAXEL modular closet system','Wood options noted: 1 × 12 × 6 ft common pine and/or 3/4-in walnut plywood','Also noted: Rubbermaid Twin Track uprights + 11 1/2-in brackets','Rechargeable warm-white motion lights','Black woven Target baskets','Status: needs closet measurements, final quantities/pricing + labor quote'],
      parts: [
        { id: uid(), name: 'IKEA BOAXEL wardrobe combination — planning allowance', qty: 1, unitPrice: 438, priceKnown: true, url: 'https://www.ikea.com/us/en/p/boaxel-wardrobe-combination-white-s09465641/' },
        { id: uid(), name: '1 × 12 × 6 ft Common Pine Board — quantity TBD', qty: 0, unitPrice: 0, priceKnown: false, url: 'https://www.homedepot.com/p/100322336' },
        { id: uid(), name: 'Rubbermaid Twin Track uprights — quantity/product TBD', qty: 0, unitPrice: 0, priceKnown: false, url: '' },
        { id: uid(), name: 'Rubbermaid 11 1/2-in brackets — quantity/product TBD', qty: 0, unitPrice: 0, priceKnown: false, url: '' },
        { id: uid(), name: '3/4-in walnut plywood — quantity/product TBD', qty: 0, unitPrice: 0, priceKnown: false, url: '' },
        { id: uid(), name: 'Rechargeable warm-white motion lights — quantity/product TBD', qty: 0, unitPrice: 0, priceKnown: false, url: '' },
        { id: uid(), name: 'Black woven Target baskets — quantity/product TBD', qty: 0, unitPrice: 0, priceKnown: false, url: '' }
      ]
    },
    {
      id: uid(), name: 'Hallway Light', icon: '💡', priority: 8, labor: 0, laborKnown: false,
      notes: 'Replace the hallway ceiling fixture with the Anthropologie Simone Scalloped Globe Flush Mount. Current product price checked Aug. 13, 2026: $298 before tax. The fixture is hardwired and Anthropologie specifies professional installation, so labor remains TBD until a handyman/electrician quote is entered.',
      specs: ['Anthropologie Simone Scalloped Globe Flush Mount','Selected finish: Brass','Iron fixture with glass shade','Dimmable and LED-dimmable compatible','E26 Type A bulb: 40W or LED 5W','UL listed; dry rated','Hardware and mounting plate included','Hardwired; professional installation recommended','Status: fixture priced; needs installation quote'],
      parts: [
        { id: uid(), name: 'Simone Scalloped Globe Flush Mount — Brass', qty: 1, unitPrice: 298, priceKnown: true, url: 'https://www.anthropologie.com/anthrohome/shop/simone-scalloped-globe-flush-mount' },
        { id: uid(), name: 'E26 LED bulb — optional / exact bulb TBD', qty: 0, unitPrice: 0, priceKnown: false, url: '' }
      ]
    },
    {
      id: uid(), name: 'Entryway Light', icon: '✨', priority: 9, labor: 0, laborKnown: false,
      notes: 'Replace the entryway ceiling fixture with the VAXLAMP French Vintage Brass Glass Flower Chandelier. The product page currently defaults to the Type A 5-light, 19.69-in diameter version at $462.24 before tax. Other 6-light and 8-light configurations are available and may change the final fixture price, so update this item if a different size is selected. Labor remains TBD until an installation quote is entered.',
      specs: ['VAXLAMP French Vintage Brass Glass Flower Chandelier — SKU BCL01301 / BCL013','Planning variant: Type A, 5 lights, 19.69-in diameter','Materials: brass + glass; gold finish','E14 bulbs included','Adjustable color temperature: warm / neutral / white','110V–240V','Standard product is non-dimmable; VAXLAMP says dimming customization can be requested','Free shipping listed for U.S. orders','1-year manufacturer limited warranty','Status: 5-light fixture priced; needs final variant confirmation + installation quote'],
      parts: [
        { id: uid(), name: 'VAXLAMP French Vintage Brass Glass Flower Chandelier — Type A 5-Light', qty: 1, unitPrice: 462.24, priceKnown: true, url: 'https://www.vaxlamp.com/products/chandelier-french-vintage-brass-glass-flower' }
      ]
    },
    {
      id: uid(), name: 'Bathroom Remodel', icon: '🛁', priority: 10, labor: 0, laborKnown: false,
      notes: 'Full bathroom remodel coordinated in white, marble-look surfaces, matte black fixtures, clear shower glass and light wood-look porcelain flooring. Major selected components total about $4,764; use $5,000–$5,500 as the working materials budget. Labor is TBD. Keep the basic plumbing layout unchanged where practical. Do not order the shower base until its drain rough-in is verified against DreamLine technical drawings.',
      specs: [
        'Room: 142 in wide × 59 in deep × 95 in high; 30-in door about 4 in from adjacent wall',
        'Entering room: vanity directly ahead; toilet to the left; shower at far left',
        'Existing vanity: 64 W × 22 D × 31 H; new vanity: 60 W × 19 D × 34.5 H',
        'Existing shower: ~48 × 59 in; proposed shower: ~60 W × 34 D in',
        'Existing shower drain: ~28 in from back wall and ~20.5 in from left wall — VERIFY before ordering base',
        'Design: white cabinetry + white/gray marble + matte black hardware + clear glass + light oak/greige flooring',
        'Verify finished shower opening after demolition before ordering glass',
        'Confirm vanity plumbing locations work with Doveton rear framing',
        'Select exact flooring and exact Delta shower valve/trim package before ordering',
        'Confirm final material quantities after demolition reveals wall/subfloor condition'
      ],
      parts: [
        { id: uid(), name: 'Home Decorators Collection Doveton 60-in Double Vanity — White (Internet #321491137)', qty: 1, unitPrice: 899, priceKnown: true, url: 'https://www.homedepot.com/p/321491137' },
        { id: uid(), name: 'Delta Foundations Design Series Modern 8-in Widespread Faucet — Matte Black (35904LF-BL)', qty: 2, unitPrice: 129, priceKnown: true, url: 'https://www.homedepot.com/p/338040364' },
        { id: uid(), name: 'niveal 60 × 36 Rectangular Vanity Mirror — Matte Black', qty: 1, unitPrice: 259.99, priceKnown: true, url: 'https://www.homedepot.com/p/323440633' },
        { id: uid(), name: 'Home Decorators Collection Insdale 4-Light Vanity Fixture — Matte Black', qty: 1, unitPrice: 72, priceKnown: true, url: 'https://www.homedepot.com/p/316723426' },
        { id: uid(), name: 'DreamLine SlimLine 60 × 34 Single-Threshold Shower Base — White, left drain (DLT-1134601) — VERIFY DRAIN FIRST', qty: 1, unitPrice: 387, priceKnown: true, url: 'https://www.homedepot.com/p/204047513' },
        { id: uid(), name: 'FlexStone Royale 60 × 36 × 80 Shower Surround — Calacatta White', qty: 1, unitPrice: 1115, priceKnown: true, url: 'https://www.homedepot.com/p/304669705' },
        { id: uid(), name: 'ANZZI Kahn Series Frameless Sliding Shower Door — Matte Black / Clear Glass', qty: 1, unitPrice: 448, priceKnown: true, url: 'https://www.homedepot.com/p/315094607' },
        { id: uid(), name: 'Delta matte-black shower system — shower head + hand shower + valve/trim allowance; exact package TBD', qty: 1, unitPrice: 250, priceKnown: false, url: '' },
        { id: uid(), name: 'Light oak / greige wood-look porcelain flooring — 55–60 sq ft allowance; exact SKU TBD', qty: 1, unitPrice: 275, priceKnown: false, url: '' },
        { id: uid(), name: 'Matte-black bathroom accessories — towel ring/bar/hooks, TP holder, door/shower accessories allowance', qty: 1, unitPrice: 150, priceKnown: false, url: '' },
        { id: uid(), name: 'Misc. installation materials — drains, P-traps, supplies, silicone, repair, trim, paint, electrical, mortar/grout, transition', qty: 1, unitPrice: 650, priceKnown: false, url: '' }
      ]
    },
  ]
};

function partTotal(project) { return project.parts.reduce((s, p) => s + Number(p.qty || 0) * Number(p.unitPrice || 0), 0); }
function partIsKnown(part) { return part.priceKnown === true; }
function projectHasUnknowns(project) { return project.laborKnown !== true || project.parts.some(p => !partIsKnown(p) || Number(p.qty || 0) <= 0); }
const priceDisplay = (value, known=true) => known ? money2(value) : 'TBD';

function App() {
  const [data, setData] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('home-project-plan'));
      const hasCurrentSeed = stored?.schemaVersion === seed.schemaVersion;
      return hasCurrentSeed ? stored : seed;
    } catch { return seed; }
  });
  const [aiText, setAiText] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [showEditor, setShowEditor] = useState(true);

  useEffect(() => localStorage.setItem('home-project-plan', JSON.stringify(data)), [data]);

  const projectEstimate = (p) => {
    const materials = partTotal(p);
    const subtotal = materials + Number(p.labor || 0);
    return subtotal * (1 + Number(data.budget.contingencyPct || 0) / 100);
  };

  const orderedProjects = useMemo(() =>
    [...data.projects].sort((a,b) => projectEstimate(a) - projectEstimate(b) || a.name.localeCompare(b.name)),
    [data.projects, data.budget.contingencyPct]
  );

  const schedule = useMemo(() => {
    const ordered = orderedProjects;
    const weekly = Math.max(1, Number(data.budget.weeklyBudget || 0));
    let available = Number(data.budget.startingBalance || 0);
    let elapsedWeeks = 0;
    const today = new Date();
    return ordered.map(p => {
      const materials = partTotal(p);
      const subtotal = materials + Number(p.labor || 0);
      const contingency = subtotal * Number(data.budget.contingencyPct || 0) / 100;
      const total = subtotal + contingency;
      const need = Math.max(0, total - available);
      const weeks = Math.ceil(need / weekly);
      elapsedWeeks += weeks;
      available = Math.max(0, available + weeks * weekly - total);
      const funded = new Date(today); funded.setDate(today.getDate() + elapsedWeeks * 7);
      return { id: p.id, name: p.name, materials, labor: Number(p.labor||0), contingency, total, weeks, cumulativeWeeks: elapsedWeeks, fundedDate: fmtDate(funded), hasUnknowns: projectHasUnknowns(p) };
    });
  }, [data, orderedProjects]);

  const totals = useMemo(() => schedule.reduce((a,s) => ({materials:a.materials+s.materials, labor:a.labor+s.labor, total:a.total+s.total}), {materials:0,labor:0,total:0}), [schedule]);

  const updateBudget = (key, value) => setData(d => ({...d, budget:{...d.budget,[key]:Number(value)}}));
  const updateProject = (id, patch) => setData(d => ({...d, projects:d.projects.map(p=>p.id===id?{...p,...patch}:p)}));
  const updatePart = (pid, partId, patch) => setData(d => ({...d, projects:d.projects.map(p=>p.id===pid?{...p,parts:p.parts.map(x=>x.id===partId?{...x,...patch}:x)}:p)}));
  const addPart = (pid) => setData(d => ({...d, projects:d.projects.map(p=>p.id===pid?{...p,parts:[...p.parts,{id:uid(),name:'New item',qty:1,unitPrice:0,priceKnown:false,url:''}]}:p)}));
  const removePart = (pid, partId) => setData(d => ({...d, projects:d.projects.map(p=>p.id===pid?{...p,parts:p.parts.filter(x=>x.id!==partId)}:p)}));
  const addProject = () => setData(d => ({...d, projects:[...d.projects,{id:uid(),name:'New Project',icon:'🏠',priority:d.projects.length+1,labor:0,laborKnown:false,notes:'',specs:[],parts:[]}]}));
  const removeProject = (id) => setData(d => ({...d,projects:d.projects.filter(p=>p.id!==id)}));

  const runAI = async () => {
    setAiBusy(true); setAiText('');
    try {
      const res = await fetch('/api/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({budget:data.budget,projects:data.projects,schedule})});
      const json = await res.json();
      if(!res.ok) throw new Error(json.error || 'AI request failed');
      setAiText(json.text);
    } catch(e) { setAiText(`AI summary unavailable: ${e.message}`); }
    finally { setAiBusy(false); }
  };

  const exportPlan = () => {
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='home-project-plan.json'; a.click(); URL.revokeObjectURL(a.href);
  };

  return <div className="app">
    <header className="hero">
      <div>
        <div className="eyebrow">OUR HOME · PROJECT ROADMAP</div>
        <h1>Make the house better,<br/><span>one $500 week at a time.</span></h1>
        <p>A simple shared plan for what we're buying, what it costs, and when each project becomes affordable.</p>
      </div>
      <div className="hero-card">
        <div className="big">{money(data.budget.weeklyBudget)}</div><div>weekly project budget</div>
        <div className="divider"/>
        <div className="mini"><span>Plan total</span><strong>{money(totals.total)}</strong></div>
        <div className="mini"><span>Projected runway</span><strong>{schedule.at(-1)?.cumulativeWeeks || 0} weeks</strong></div>
      </div>
    </header>

    <main>
      <section className="budgetbar card">
        <label>Weekly budget<input type="number" value={data.budget.weeklyBudget} onChange={e=>updateBudget('weeklyBudget',e.target.value)}/></label>
        <label>Already saved<input type="number" value={data.budget.startingBalance} onChange={e=>updateBudget('startingBalance',e.target.value)}/></label>
        <label>Contingency %<input type="number" value={data.budget.contingencyPct} onChange={e=>updateBudget('contingencyPct',e.target.value)}/></label>
        <button className="secondary" onClick={()=>setShowEditor(v=>!v)}>{showEditor?'Hide editing':'Edit projects'}</button>
      </section>

      <section className="kpis">
        <div className="kpi"><span>Materials</span><strong>{money(totals.materials)}</strong></div>
        <div className="kpi"><span>Estimated labor</span><strong>{money(totals.labor)}</strong></div>
        <div className="kpi"><span>With contingency</span><strong>{money(totals.total)}</strong></div>
        <div className="kpi"><span>Projects</span><strong>{data.projects.length}</strong></div>
      </section>

      <section className="sectionHead"><div><div className="eyebrow">THE PLAN</div><h2>Funding timeline</h2></div><p>Projects are automatically funded cheapest first. The order and dates recalculate whenever costs change.</p></section>
      <section className="timeline">
        {schedule.map((s,i)=> <div className="timelineItem" key={s.id}>
          <div className="dot">{i+1}</div>
          <div className="timelineCard">
            <div><small>PROJECT {i+1}</small><h3>{s.name}</h3></div>
            <div className="timelineNumbers"><div><span>Target</span><strong>{s.hasUnknowns?'Pending costs':s.fundedDate}</strong></div><div><span>Project total</span><strong>{s.hasUnknowns?`${money(s.total)}+`:money(s.total)}</strong></div><div><span>Funding time</span><strong>{s.hasUnknowns?`${s.weeks}+ wk`:`${s.weeks} wk`}</strong></div></div>
          </div>
        </div>)}
      </section>

      <section className="sectionHead"><div><div className="eyebrow">DETAILS</div><h2>Project breakdown</h2></div><p>Every part can have a shopping link, quantity and current price.</p></section>
      <section className="projects">
        {orderedProjects.map((p,projectIndex)=>{
          const s=schedule.find(x=>x.id===p.id); return <article className="project card" key={p.id}>
            <div className="projectTitle"><div className="icon">{p.icon}</div><div><div className="eyebrow">CHEAPEST-FIRST #{projectIndex+1}</div><h3>{p.name}</h3></div><div className="projectTotal">{s?.hasUnknowns?`${money(s?.total)}+`:money(s?.total)}{s?.hasUnknowns&&<small className="tbdNote"> partial estimate</small>}</div></div>
            <p className="notes">{p.notes}</p>
            {p.specs?.length > 0 && <div className="specs"><div className="specTitle">Known project details</div>{p.specs.map((spec,i)=><div className="spec" key={i}><span>✓</span><span>{spec}</span></div>)}</div>}
            <div className="parts">
              <div className="part header"><span>Part</span><span>Qty</span><span>Each</span><span>Total</span><span></span></div>
              {p.parts.map(part=><div className="part" key={part.id}>
                <span>{part.url?<a href={part.url} target="_blank" rel="noreferrer">{part.name} ↗</a>:part.name}</span><span>{Number(part.qty)>0?part.qty:'TBD'}</span><span className={!partIsKnown(part)?'tbd':''}>{priceDisplay(part.unitPrice,partIsKnown(part))}</span><strong className={!partIsKnown(part)||Number(part.qty)<=0?'tbd':''}>{partIsKnown(part)&&Number(part.qty)>0?money2(Number(part.qty)*Number(part.unitPrice)):'TBD'}</strong><span></span>
              </div>)}
            </div>
            <div className="costline"><span>Materials <strong>{money2(s?.materials)}</strong></span><span>Labor <strong className={p.laborKnown?'':'tbd'}>{p.laborKnown?money2(s?.labor):'TBD'}</strong></span><span>Contingency <strong>{money2(s?.contingency)}</strong></span></div>

            {showEditor && <div className="editor">
              <div className="editGrid"><label>Project name<input value={p.name} onChange={e=>updateProject(p.id,{name:e.target.value})}/></label><label>Funding order<input value={`Automatic: #${projectIndex+1}`} disabled title="Calculated automatically from the current project estimate"/></label><label>Labor estimate<input type="number" value={p.labor} onChange={e=>updateProject(p.id,{labor:Number(e.target.value)})}/><span className="knownToggle"><input type="checkbox" checked={p.laborKnown===true} onChange={e=>updateProject(p.id,{laborKnown:e.target.checked})}/> Quote/price confirmed</span></label></div>
              <label>Notes<textarea value={p.notes} onChange={e=>updateProject(p.id,{notes:e.target.value})}/></label>
              {p.parts.map(part=><div className="partEdit" key={part.id}>
                <input value={part.name} onChange={e=>updatePart(p.id,part.id,{name:e.target.value})}/><input type="number" value={part.qty} onChange={e=>updatePart(p.id,part.id,{qty:Number(e.target.value)})}/><label className="priceEdit"><input type="number" step="0.01" value={part.unitPrice} onChange={e=>updatePart(p.id,part.id,{unitPrice:Number(e.target.value)})}/><span className="knownToggle"><input type="checkbox" checked={part.priceKnown===true} onChange={e=>updatePart(p.id,part.id,{priceKnown:e.target.checked})}/> Price known</span></label><input value={part.url} placeholder="Product link" onChange={e=>updatePart(p.id,part.id,{url:e.target.value})}/><button className="danger" onClick={()=>removePart(p.id,part.id)}>×</button>
              </div>)}
              <div className="editActions"><button className="secondary" onClick={()=>addPart(p.id)}>+ Add part</button><button className="textDanger" onClick={()=>removeProject(p.id)}>Remove project</button></div>
            </div>}
          </article>
        })}
      </section>

      {showEditor && <button className="addProject" onClick={addProject}>+ Add another home project</button>}

      <section className="ai card">
        <div><div className="eyebrow">AI PLANNING ASSISTANT</div><h2>Explain the plan to us</h2><p>The app already does the budget math itself. Connect an OpenAI API key and this button turns the numbers into a short, practical planning summary.</p></div>
        <button className="primary" onClick={runAI} disabled={aiBusy}>{aiBusy?'Thinking…':'✨ Generate AI summary'}</button>
        {aiText && <div className="aiOutput">{aiText}</div>}
      </section>

      <footer><span>Built for our home.</span><div><button className="secondary" onClick={exportPlan}>Export plan JSON</button><button className="secondary" onClick={()=>{localStorage.removeItem('home-project-plan');location.reload()}}>Reset demo</button></div></footer>
    </main>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>);
