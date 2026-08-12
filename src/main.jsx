import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const uid = () => Math.random().toString(36).slice(2, 9);
const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n || 0));
const money2 = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n || 0));
const fmtDate = (d) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);

const seed = {
  budget: { weeklyBudget: 500, startingBalance: 0, contingencyPct: 12 },
  projects: [
    {
      id: uid(), name: 'Craftsman Interior Doors', icon: '🚪', priority: 1, labor: 0,
      notes: '9 RELIABILT 3-panel Craftsman primed smooth hollow-core molded-composite interior slab doors: 6 × 32×80, 2 × 24×80, 1 × 30×80. Labor estimate pending. Pricing is seeded from the Lowe\'s products we identified; verify local-store pricing before ordering.',
      specs: [
        'Style: RELIABILT 3-panel Craftsman, smooth primed molded composite',
        'Construction: hollow-core interior slab doors',
        'Sizes: 6 × 32×80 in · 2 × 24×80 in · 1 × 30×80 in',
        'Door slabs are not a labor quote; installation remains $0 until contractor estimates arrive'
      ],
      parts: [
        { id: uid(), name: 'RELIABILT 32-in × 80-in Primed 3-panel Craftsman Hollow-Core Slab Door', qty: 6, unitPrice: 124.00, url: 'https://www.lowes.com/pd/RELIABILT-32-in-x-80-in-White-3-panel-Craftsman-Hollow-Core-Molded-Composite-Slab-Door/5014873041' },
        { id: uid(), name: 'RELIABILT 24-in × 80-in Primed 3-panel Craftsman Hollow-Core Slab Door', qty: 2, unitPrice: 109.00, url: 'https://www.lowes.com/pd/ReliaBilt-White-3-Panel-Craftsman-Hollow-Core-Molded-Composite-Slab-Door-Common-24-in-x-80-in-Actual-24-in-x-80-in/3550826' },
        { id: uid(), name: 'RELIABILT 30-in × 80-in Primed 3-panel Craftsman Hollow-Core Slab Door', qty: 1, unitPrice: 119.00, url: 'https://www.lowes.com/pd/ReliaBilt-White-3-Panel-Craftsman-Hollow-Core-Molded-Composite-Slab-Door-Common-30-in-x-80-in-Actual-30-in-x-80-in/3550820' }
      ]
    },
    {
      id: uid(), name: 'Upstairs Baseboards', icon: '🪚', priority: 2, labor: 0,
      notes: 'Replace about 600 linear ft of existing ~6-in-high × 1/2-in-thick baseboard. Planning with ~15% waste, so the material target is about 690 linear ft. Labor/removal/caulk/fill/paint estimate pending.',
      specs: [
        'Existing profile: about 6 in high × 1/2 in thick',
        'Measured scope: ~600 linear ft upstairs',
        'Purchase target: ~690 linear ft including ~15% waste',
        '58 × 12-ft boards = 696 linear ft total'
      ],
      parts: [
        { id: uid(), name: 'RELIABILT 1/2-in × 5-1/2-in × 12-ft Craftsman Primed MDF Baseboard', qty: 58, unitPrice: 12.98, url: 'https://www.lowes.com/pd/Craftsman-5-1-2-in-x-12-ft-Primed-MDF-Baseboard-Moulding-Actual-5-5-in-x-12-ft/1000460529' }
      ]
    },
    {
      id: uid(), name: 'Living Room BESTÅ Wall', icon: '📺', priority: 3, labor: 0,
      notes: 'Recovered design: asymmetrical built-in on a 175-in wall with a 95-in ceiling and an 85-in wall-mounted TV. Planned installation width is 165 3/8 in, leaving about 4 3/4 in reveal at each end. Exact door/front/shelf/rail finish selections still need to be locked before treating the IKEA material total as final.',
      specs: [
        'Wall: 175 in wide × 95 in high',
        'TV: 85 in, stays wall-mounted',
        'Overall cabinetry width: 165 3/8 in',
        'Approx. side reveals: 4 3/4 in each end',
        'TV zone: 94 1/2 in wide (four 23 5/8-in modules)',
        'Right-side tall tower: 23 5/8 in wide',
        'Side console: 47 1/4 in wide',
        'Vertical concept: ~8–10 in breathing room above, 15-in upper BESTÅ cabinets, TV niche, 15-in lower BESTÅ cabinets, ~4–6 in plinth/toe-kick'
      ],
      parts: [
        { id: uid(), name: 'BESTÅ frame, white, 23 5/8 × 15 3/4 × 15 in — candidate module', qty: 4, unitPrice: 45.00, url: 'https://www.ikea.com/us/en/p/besta-frame-white-70245848/' },
        { id: uid(), name: 'BESTÅ frame, white, 47 1/4 × 15 3/4 × 15 in — side-console candidate', qty: 1, unitPrice: 65.00, url: 'https://www.ikea.com/us/en/p/besta-frame-white-60245844/' },
        { id: uid(), name: 'BESTÅ tall-tower / additional upper-lower frames, fronts, shelves, hinges & suspension rails — finalize configuration', qty: 1, unitPrice: 0, url: 'https://www.ikea.com/us/en/cat/besta-storage-system-46053/' }
      ]
    }
  ]
};

function partTotal(project) { return project.parts.reduce((s, p) => s + Number(p.qty || 0) * Number(p.unitPrice || 0), 0); }

function App() {
  const [data, setData] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('home-project-plan'));
      const hasCurrentSeed = stored?.projects?.some(p => p.name === 'Craftsman Interior Doors' && p.parts?.some(x => Number(x.unitPrice) === 124));
      return hasCurrentSeed ? stored : seed;
    } catch { return seed; }
  });
  const [aiText, setAiText] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [showEditor, setShowEditor] = useState(true);

  useEffect(() => localStorage.setItem('home-project-plan', JSON.stringify(data)), [data]);

  const schedule = useMemo(() => {
    const ordered = [...data.projects].sort((a,b) => Number(a.priority)-Number(b.priority));
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
      return { id: p.id, name: p.name, materials, labor: Number(p.labor||0), contingency, total, weeks, cumulativeWeeks: elapsedWeeks, fundedDate: fmtDate(funded) };
    });
  }, [data]);

  const totals = useMemo(() => schedule.reduce((a,s) => ({materials:a.materials+s.materials, labor:a.labor+s.labor, total:a.total+s.total}), {materials:0,labor:0,total:0}), [schedule]);

  const updateBudget = (key, value) => setData(d => ({...d, budget:{...d.budget,[key]:Number(value)}}));
  const updateProject = (id, patch) => setData(d => ({...d, projects:d.projects.map(p=>p.id===id?{...p,...patch}:p)}));
  const updatePart = (pid, partId, patch) => setData(d => ({...d, projects:d.projects.map(p=>p.id===pid?{...p,parts:p.parts.map(x=>x.id===partId?{...x,...patch}:x)}:p)}));
  const addPart = (pid) => setData(d => ({...d, projects:d.projects.map(p=>p.id===pid?{...p,parts:[...p.parts,{id:uid(),name:'New item',qty:1,unitPrice:0,url:''}]}:p)}));
  const removePart = (pid, partId) => setData(d => ({...d, projects:d.projects.map(p=>p.id===pid?{...p,parts:p.parts.filter(x=>x.id!==partId)}:p)}));
  const addProject = () => setData(d => ({...d, projects:[...d.projects,{id:uid(),name:'New Project',icon:'🏠',priority:d.projects.length+1,labor:0,notes:'',specs:[],parts:[]}]}));
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

      <section className="sectionHead"><div><div className="eyebrow">THE PLAN</div><h2>Funding timeline</h2></div><p>Projects are funded in priority order. Dates automatically recalculate when costs change.</p></section>
      <section className="timeline">
        {schedule.map((s,i)=> <div className="timelineItem" key={s.id}>
          <div className="dot">{i+1}</div>
          <div className="timelineCard">
            <div><small>PROJECT {i+1}</small><h3>{s.name}</h3></div>
            <div className="timelineNumbers"><div><span>Target</span><strong>{s.fundedDate}</strong></div><div><span>Project total</span><strong>{money(s.total)}</strong></div><div><span>Funding time</span><strong>{s.weeks} wk</strong></div></div>
          </div>
        </div>)}
      </section>

      <section className="sectionHead"><div><div className="eyebrow">DETAILS</div><h2>Project breakdown</h2></div><p>Every part can have a shopping link, quantity and current price.</p></section>
      <section className="projects">
        {[...data.projects].sort((a,b)=>a.priority-b.priority).map(p=>{
          const s=schedule.find(x=>x.id===p.id); return <article className="project card" key={p.id}>
            <div className="projectTitle"><div className="icon">{p.icon}</div><div><div className="eyebrow">PRIORITY {p.priority}</div><h3>{p.name}</h3></div><div className="projectTotal">{money(s?.total)}</div></div>
            <p className="notes">{p.notes}</p>
            {p.specs?.length > 0 && <div className="specs"><div className="specTitle">Known project details</div>{p.specs.map((spec,i)=><div className="spec" key={i}><span>✓</span><span>{spec}</span></div>)}</div>}
            <div className="parts">
              <div className="part header"><span>Part</span><span>Qty</span><span>Each</span><span>Total</span><span></span></div>
              {p.parts.map(part=><div className="part" key={part.id}>
                <span>{part.url?<a href={part.url} target="_blank" rel="noreferrer">{part.name} ↗</a>:part.name}</span><span>{part.qty}</span><span>{money2(part.unitPrice)}</span><strong>{money2(Number(part.qty)*Number(part.unitPrice))}</strong><span></span>
              </div>)}
            </div>
            <div className="costline"><span>Materials <strong>{money2(s?.materials)}</strong></span><span>Labor <strong>{money2(s?.labor)}</strong></span><span>Contingency <strong>{money2(s?.contingency)}</strong></span></div>

            {showEditor && <div className="editor">
              <div className="editGrid"><label>Project name<input value={p.name} onChange={e=>updateProject(p.id,{name:e.target.value})}/></label><label>Priority<input type="number" value={p.priority} onChange={e=>updateProject(p.id,{priority:Number(e.target.value)})}/></label><label>Labor estimate<input type="number" value={p.labor} onChange={e=>updateProject(p.id,{labor:Number(e.target.value)})}/></label></div>
              <label>Notes<textarea value={p.notes} onChange={e=>updateProject(p.id,{notes:e.target.value})}/></label>
              {p.parts.map(part=><div className="partEdit" key={part.id}>
                <input value={part.name} onChange={e=>updatePart(p.id,part.id,{name:e.target.value})}/><input type="number" value={part.qty} onChange={e=>updatePart(p.id,part.id,{qty:Number(e.target.value)})}/><input type="number" step="0.01" value={part.unitPrice} onChange={e=>updatePart(p.id,part.id,{unitPrice:Number(e.target.value)})}/><input value={part.url} placeholder="Product link" onChange={e=>updatePart(p.id,part.id,{url:e.target.value})}/><button className="danger" onClick={()=>removePart(p.id,part.id)}>×</button>
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
