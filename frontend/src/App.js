import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const login = (u, t) => { setUser(u); setToken(t); };
  const logout = () => { setUser(null); setToken(null); };
  return <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>;
}

const G = {
  bg:'#050c1a', bg2:'#0a1628', card:'#0d1e35', border:'#1a3050',
  blue:'#00d4ff', green:'#00ff9d', orange:'#ff6b35', purple:'#a855f7',
  yellow:'#ffd700', red:'#ff4444', text:'#e8f4ff', muted:'#7aa3cc', dim:'#3d6080',
  mono:"'JetBrains Mono',monospace", sans:"'Sora',sans-serif",
};

const C = { padding:18, background:G.card, border:`1px solid ${G.border}`, borderRadius:12 };

function Dot({ color }) {
  return <span style={{ width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 5px ${color}`, display:'inline-block', flexShrink:0 }} />;
}

function Badge({ color, children }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:20, fontSize:11, fontFamily:G.mono, fontWeight:600, textTransform:'uppercase', background:`${color}18`, border:`1px solid ${color}40`, color }}>{children}</span>;
}

function genData(base, variance, n=20) {
  return Array.from({length:n},(_,i) => ({t:`${i}m`, v:Math.max(0, base+(Math.random()-0.5)*variance)}));
}

// LOGIN
function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lines] = useState([
    '> Initializing AutoOps Platform...', '> CI/CD Engine loaded ✓',
    '> Container orchestration ready ✓', '> Self-healing module active ✓',
    '> Prometheus scraping metrics ✓', '> All systems operational ✓',
  ]);

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}) });
      const data = await res.json();
      if (res.ok) { login(data.user, data.token); navigate('/'); return; }
    } catch(_) {}
    const demos = {'admin@autoops.dev':['Admin','admin','admin123'],'dev@autoops.dev':['Developer','developer','dev123'],'viewer@autoops.dev':['Viewer','viewer','view123']};
    if (demos[email] && demos[email][2]===password) {
      login({id:'1',name:demos[email][0],email,role:demos[email][1]},'demo-token');
      navigate('/');
    } else {
      setError('Try: admin@autoops.dev / admin123');
    }
    setLoading(false);
  };

  const inp = { width:'100%', padding:'10px 12px', background:G.bg, border:`1px solid ${G.border}`, borderRadius:8, color:G.text, fontSize:13, fontFamily:G.sans, outline:'none', boxSizing:'border-box' };

  return (
    <div style={{minHeight:'100vh',background:G.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:G.sans,padding:20}}>
      <div style={{display:'flex',gap:48,width:'100%',maxWidth:980,alignItems:'center'}}>
        {/* Left */}
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:24}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:50,height:50,background:`${G.blue}12`,border:`1px solid ${G.blue}30`,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>⚙️</div>
            <div>
              <div style={{fontSize:28,fontWeight:800,color:G.text}}>AutoOps</div>
              <div style={{fontSize:12,color:G.blue,fontFamily:G.mono}}>Self-Healing DevOps Platform</div>
            </div>
          </div>
          <div style={{background:'#010a14',border:'1px solid #0d2033',borderRadius:12,overflow:'hidden'}}>
            <div style={{padding:'9px 14px',background:'#020e1c',borderBottom:'1px solid #0d2033',display:'flex',alignItems:'center',gap:6}}>
              {['#ff5f57','#ffbd2e','#28c840'].map(c=><span key={c} style={{width:10,height:10,borderRadius:'50%',background:c,display:'inline-block'}}/>)}
              <span style={{marginLeft:8,fontSize:11,color:G.dim,fontFamily:G.mono}}>autoops-system-init</span>
            </div>
            <div style={{padding:16,fontFamily:G.mono,fontSize:12,minHeight:170}}>
              {lines.map((line,i)=>(
                <div key={i} style={{marginBottom:6,color:line.includes('✓')?G.green:line.includes('operational')?G.blue:G.muted}}>{line}</div>
              ))}
              <span style={{color:G.blue}}>█</span>
            </div>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {['CI/CD Pipeline','Self-Healing','Docker/K8s','Prometheus','Grafana','Terraform IaC'].map(f=>(
              <span key={f} style={{padding:'4px 12px',background:`${G.blue}0a`,border:`1px solid ${G.blue}25`,borderRadius:20,fontSize:11,color:G.blue,fontFamily:G.mono}}>{f}</span>
            ))}
          </div>
        </div>
        {/* Right */}
        <div style={{flex:'0 0 370px'}}>
          <div style={{...C,padding:34}}>
            <h1 style={{fontSize:24,fontWeight:800,color:G.text,marginBottom:6}}>Welcome back</h1>
            <p style={{color:G.muted,fontSize:13,marginBottom:24}}>Sign in to your DevOps dashboard</p>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div>
                <label style={{fontSize:11,color:G.muted,display:'block',marginBottom:5,fontFamily:G.mono}}>Email Address</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@company.com" required style={inp}/>
              </div>
              <div>
                <label style={{fontSize:11,color:G.muted,display:'block',marginBottom:5,fontFamily:G.mono}}>Password</label>
                <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" required style={inp}/>
              </div>
              {error && <div style={{padding:'9px 12px',background:`${G.red}12`,border:`1px solid ${G.red}30`,borderRadius:8,color:G.red,fontSize:13}}>⚠️ {error}</div>}
              <button type="submit" disabled={loading} style={{padding:12,background:'linear-gradient(135deg,#0052a3,#00d4ff)',border:'none',borderRadius:8,color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',marginTop:4}}>
                {loading ? '⟳ Authenticating...' : '🚀 Launch Dashboard'}
              </button>
            </form>
            <div style={{marginTop:20}}>
              <div style={{fontSize:11,color:G.dim,textAlign:'center',marginBottom:10,fontFamily:G.mono}}>⚡ Quick Demo Access</div>
              <div style={{display:'flex',gap:8}}>
                {[['👑','Admin','admin@autoops.dev','admin123'],['💻','Dev','dev@autoops.dev','dev123'],['👁','View','viewer@autoops.dev','view123']].map(([icon,label,e,p])=>(
                  <button key={label} onClick={()=>{setEmail(e);setPassword(p);}} style={{flex:1,padding:'8px 4px',background:G.bg,border:`1px solid ${G.border}`,borderRadius:8,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                    <span style={{fontSize:16}}>{icon}</span>
                    <span style={{fontSize:11,color:G.muted,fontFamily:G.sans}}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginTop:16,textAlign:'center',fontSize:11,color:G.dim,fontFamily:G.mono}}>🔒 JWT • AES-256 • SOC 2 compliant</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// LAYOUT
const NAV=[{to:'/',icon:'🏠',label:'Dashboard'},{to:'/pipelines',icon:'⚙️',label:'Pipelines',b:'CI/CD'},{to:'/deployments',icon:'🚀',label:'Deployments'},{to:'/containers',icon:'🐳',label:'Containers',b:'Live'},{to:'/infrastructure',icon:'🏗️',label:'Infrastructure',b:'IaC'},{to:'/monitoring',icon:'📊',label:'Monitoring'},{to:'/alerts',icon:'🔔',label:'Alerts',b:'2'},{to:'/team',icon:'👥',label:'Team'},{to:'/settings',icon:'⚙️',label:'Settings'}];

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);
  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:G.bg,fontFamily:G.sans}}>
      <aside style={{width:220,background:G.bg2,borderRight:`1px solid ${G.border}`,display:'flex',flexDirection:'column',flexShrink:0}}>
        <div style={{padding:'16px 14px',borderBottom:`1px solid ${G.border}`,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:22}}>⚙️</span>
          <div><div style={{fontWeight:800,fontSize:16,color:G.text}}>AutoOps</div><div style={{fontSize:10,color:G.blue,fontFamily:G.mono}}>v2.4.1 • LIVE</div></div>
        </div>
        <div style={{margin:'8px 10px',padding:'7px 12px',background:`${G.green}08`,border:`1px solid ${G.green}18`,borderRadius:8,display:'flex',alignItems:'center',gap:7}}>
          <Dot color={G.green}/><span style={{fontSize:11,color:G.green,fontFamily:G.mono}}>All Systems OK</span>
        </div>
        <nav style={{flex:1,padding:'6px 8px',overflowY:'auto',display:'flex',flexDirection:'column',gap:2}}>
          {NAV.map(item=>(
            <NavLink key={item.to} to={item.to} end={item.to==='/'}
              style={({isActive})=>({display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:8,textDecoration:'none',fontSize:13,fontWeight:500,color:isActive?G.blue:G.muted,background:isActive?`${G.blue}12`:'transparent',borderLeft:isActive?`2px solid ${G.blue}`:'2px solid transparent'})}>
              <span style={{fontSize:15}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              {item.b&&<span style={{fontSize:9,padding:'2px 6px',borderRadius:10,fontFamily:G.mono,fontWeight:700,background:item.b==='2'?`${G.red}20`:`${G.blue}12`,color:item.b==='2'?G.red:G.blue,border:`1px solid ${item.b==='2'?G.red:G.blue}30`}}>{item.b}</span>}
            </NavLink>
          ))}
        </nav>
        <div style={{padding:'12px 10px',borderTop:`1px solid ${G.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:8,borderRadius:8,background:'rgba(255,255,255,0.03)'}}>
            <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#0066cc,#00d4ff)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#fff',fontSize:14,flexShrink:0}}>{user?.name?.charAt(0)||'A'}</div>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:G.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name||'User'}</div><div style={{fontSize:10,color:G.dim,fontFamily:G.mono,textTransform:'uppercase'}}>{user?.role||'dev'}</div></div>
            <button onClick={()=>{logout();navigate('/login');}} style={{background:'none',border:'none',cursor:'pointer',fontSize:16,opacity:0.5}} title="Logout">🚪</button>
          </div>
        </div>
      </aside>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <header style={{height:52,background:G.bg2,borderBottom:`1px solid ${G.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 22px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <span style={{fontFamily:G.mono,fontSize:13,color:G.blue}}>🕐 {time.toLocaleTimeString()}</span>
            <span style={{fontSize:12,color:G.dim}}>{time.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {[[G.blue,'CI/CD Active'],[G.green,'6 Containers']].map(([color,label])=>(
              <span key={label} style={{display:'flex',alignItems:'center',gap:5,padding:'3px 12px',background:`${color}10`,border:`1px solid ${color}25`,borderRadius:20,fontSize:11,color,fontFamily:G.mono}}><Dot color={color}/>{label}</span>
            ))}
            <span style={{display:'flex',alignItems:'center',gap:5,padding:'3px 12px',background:`${G.red}10`,border:`1px solid ${G.red}25`,borderRadius:20,fontSize:11,color:G.red,fontFamily:G.mono}}>🔔 2 Alerts</span>
          </div>
        </header>
        <main style={{flex:1,overflowY:'auto',padding:22}}>
          <Routes>
            <Route index element={<Dashboard/>}/>
            <Route path="pipelines" element={<Pipelines/>}/>
            <Route path="deployments" element={<Deployments/>}/>
            <Route path="containers" element={<Containers/>}/>
            <Route path="infrastructure" element={<Infrastructure/>}/>
            <Route path="monitoring" element={<Monitoring/>}/>
            <Route path="alerts" element={<Alerts/>}/>
            <Route path="team" element={<Team/>}/>
            <Route path="settings" element={<Settings/>}/>
          </Routes>
        </main>
      </div>
    </div>
  );
}

// DASHBOARD
function Dashboard() {
  const [stats,setStats]=useState({deployments:{total:142,success:138,failed:4},successRate:97.2,pipelines:{total:89},uptime:182400});
  useEffect(()=>{fetch('http://localhost:5000/api/stats').then(r=>r.json()).then(setStats).catch(()=>{});},[]);
  const cpu=genData(35,30),mem=genData(62,15),req=genData(450,200);
  const pie=[{name:'Success',value:138,color:G.green},{name:'Failed',value:4,color:G.red}];
  const acts=[{icon:'✅',msg:'Deployment v2.4.1 → Production succeeded',time:'2m ago',color:G.green},{icon:'🔄',msg:'Self-healing: autoops-backend restarted',time:'8m ago',color:G.blue},{icon:'⚙️',msg:'CI/CD Pipeline #142 completed in 3m 22s',time:'15m ago',color:G.purple},{icon:'🐳',msg:'Docker image pushed: autoops/frontend:2.4.1',time:'18m ago',color:G.yellow},{icon:'🏗️',msg:'Terraform plan applied — 2 resources updated',time:'1h ago',color:G.blue}];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:G.text}}>🏠 Mission Control</h1><p style={{color:G.muted,fontSize:13,marginTop:4}}>Real-time AutoOps infrastructure overview</p></div>
        <span style={{display:'flex',alignItems:'center',gap:6,padding:'6px 14px',background:`${G.green}10`,border:`1px solid ${G.green}25`,borderRadius:20,fontSize:12,color:G.green}}><Dot color={G.green}/>All Systems Operational</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
        {[[`🚀`,'Total Deployments',stats.deployments?.total||142,G.blue],[`✅`,'Success Rate',`${stats.successRate||97.2}%`,G.green],[`⚙️`,'Pipelines',stats.pipelines?.total||89,G.purple],[`⏱️`,'Uptime (hrs)',Math.floor((stats.uptime||182400)/3600),G.yellow]].map(([icon,label,val,color])=>(
          <div key={label} style={{...C,padding:16,background:`${color}08`,borderColor:`${color}22`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div><div style={{fontSize:11,color:G.muted,fontFamily:G.mono,textTransform:'uppercase',marginBottom:6,letterSpacing:'0.4px'}}>{label}</div><div style={{fontSize:30,fontWeight:800,color}}>{val}</div></div>
              <span style={{fontSize:24}}>{icon}</span>
            </div>
            <div style={{height:34,marginTop:8}}><ResponsiveContainer width="100%" height="100%"><LineChart data={genData(50,30)}><Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false}/></LineChart></ResponsiveContainer></div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
        {[{label:'💻 CPU',val:'35.2%',color:G.blue,data:cpu,id:'cpu'},{label:'🧠 Memory',val:'62.4%',color:G.purple,data:mem,id:'mem'}].map(c=>(
          <div key={c.id} style={{...C,padding:16}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}><span style={{fontSize:13,fontWeight:600,color:G.text}}>{c.label}</span><span style={{fontSize:12,color:c.color,fontFamily:G.mono}}>{c.val}</span></div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={c.data}><defs><linearGradient id={c.id} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c.color} stopOpacity={0.3}/><stop offset="95%" stopColor={c.color} stopOpacity={0}/></linearGradient></defs><XAxis dataKey="t" hide/><YAxis hide domain={[0,100]}/><Tooltip contentStyle={{background:G.card,border:`1px solid ${G.border}`,borderRadius:8,fontSize:11}}/><Area type="monotone" dataKey="v" stroke={c.color} fill={`url(#${c.id})`} strokeWidth={2}/></AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
        <div style={{...C,padding:16}}>
          <div style={{fontSize:13,fontWeight:600,color:G.text,marginBottom:10}}>🎯 Deployment Health</div>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <PieChart width={90} height={90}><Pie data={pie} cx={45} cy={45} innerRadius={24} outerRadius={40} dataKey="value" strokeWidth={0}>{pie.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie></PieChart>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>{pie.map(e=><div key={e.name} style={{display:'flex',alignItems:'center',gap:7,fontSize:12}}><Dot color={e.color}/><span style={{color:G.muted}}>{e.name}: <strong style={{color:e.color}}>{e.value}</strong></span></div>)}</div>
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div style={{...C,padding:16}}>
          <div style={{fontSize:14,fontWeight:700,color:G.text,marginBottom:12,display:'flex',alignItems:'center',gap:8}}>⚡ Recent Activity <Dot color={G.blue}/></div>
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {acts.map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 10px',background:'rgba(255,255,255,0.02)',borderRadius:8,borderLeft:`3px solid ${a.color}`}}>
                <span style={{fontSize:16}}>{a.icon}</span><span style={{flex:1,fontSize:12,color:G.text}}>{a.msg}</span><span style={{fontSize:10,color:G.dim,fontFamily:G.mono,whiteSpace:'nowrap'}}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{...C,padding:16}}>
          <div style={{fontSize:14,fontWeight:700,color:G.text,marginBottom:12}}>🎮 Quick Actions</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
            {[['▶️','Trigger Pipeline',G.blue],['🚀','New Deployment',G.green],['🔄','Restart Service',G.purple],['📋','View Logs',G.yellow],['🏗️','Terraform Apply',G.orange],['📊','Open Grafana',G.blue]].map(([icon,label,color])=>(
              <button key={label} style={{padding:10,background:'rgba(255,255,255,0.03)',border:`1px solid ${G.border}`,borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',gap:8,color:G.text,fontSize:12,fontWeight:600,fontFamily:G.sans}} onMouseEnter={e=>{e.currentTarget.style.background=`${color}10`;e.currentTarget.style.borderColor=color;}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor=G.border;}}>
                <span style={{fontSize:16}}>{icon}</span>{label}
              </button>
            ))}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:12}}><span style={{color:G.muted}}>🌐 API Requests/min</span><span style={{color:G.yellow,fontFamily:G.mono}}>452 req/min</span></div>
          <ResponsiveContainer width="100%" height={50}><AreaChart data={req}><defs><linearGradient id="req" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={G.yellow} stopOpacity={0.25}/><stop offset="95%" stopColor={G.yellow} stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="v" stroke={G.yellow} fill="url(#req)" strokeWidth={1.5}/></AreaChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// PIPELINES
function Pipelines() {
  const [pls,setPls]=useState([{id:'1',name:'AutoOps Main Pipeline',branch:'main',status:'success',run:142,dur:187,stages:[{n:'Checkout',s:'success',d:3},{n:'Install Deps',s:'success',d:45},{n:'Lint',s:'success',d:12},{n:'Unit Tests',s:'success',d:38},{n:'Build Docker',s:'success',d:62},{n:'Push Registry',s:'success',d:18},{n:'Deploy Staging',s:'success',d:24},{n:'Integration Tests',s:'success',d:31},{n:'Deploy Production',s:'success',d:22}]},{id:'2',name:'Feature Branch CI',branch:'feature/monitoring',status:'running',run:143,dur:60,stages:[{n:'Checkout',s:'success',d:3},{n:'Install Deps',s:'success',d:45},{n:'Lint',s:'success',d:12},{n:'Unit Tests',s:'running',d:null},{n:'Build Docker',s:'pending'},{n:'Push Registry',s:'pending'},{n:'Deploy Staging',s:'pending'},{n:'Integration Tests',s:'pending'},{n:'Deploy Production',s:'skipped'}]},{id:'3',name:'Hotfix Pipeline',branch:'hotfix/auth-bug',status:'failed',run:141,dur:95,stages:[{n:'Checkout',s:'success',d:3},{n:'Install Deps',s:'success',d:45},{n:'Lint',s:'success',d:12},{n:'Unit Tests',s:'failed',d:35},{n:'Build Docker',s:'skipped'},{n:'Push Registry',s:'skipped'},{n:'Deploy Staging',s:'skipped'},{n:'Integration Tests',s:'skipped'},{n:'Deploy Production',s:'skipped'}]}]);
  const [sel,setSel]=useState(null);
  const sc={success:G.green,failed:G.red,running:G.blue,pending:G.yellow,skipped:G.border};
  const si={success:'✅',failed:'❌',running:'⟳',pending:'○',skipped:'—'};
  const trigger=()=>{setPls(p=>[{id:Date.now()+'',name:'Manual Pipeline #'+Math.floor(Math.random()*100),branch:'main',status:'running',run:144,dur:0,stages:[{n:'Checkout',s:'pending'},{n:'Install Deps',s:'pending'},{n:'Lint',s:'pending'},{n:'Unit Tests',s:'pending'},{n:'Build Docker',s:'pending'},{n:'Push Registry',s:'pending'},{n:'Deploy Staging',s:'pending'},{n:'Integration Tests',s:'pending'},{n:'Deploy Production',s:'pending'}]},...p]);};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:G.text}}>⚙️ CI/CD Pipelines</h1><p style={{color:G.muted,fontSize:13,marginTop:4}}>End-to-end: Build → Test → Deploy</p></div>
        <button onClick={trigger} style={{padding:'10px 20px',background:'linear-gradient(135deg,#0066cc,#00d4ff)',border:'none',borderRadius:8,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'}}>▶ Trigger Pipeline</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
        {[['✅','Successful','138',G.green],['❌','Failed','4',G.red],['⚡','Avg Duration','3m 12s',G.yellow],['📊','Success Rate','97.2%',G.purple]].map(([icon,label,val,color])=>(
          <div key={label} style={{...C,padding:14,textAlign:'center'}}><div style={{fontSize:22}}>{icon}</div><div style={{fontSize:22,fontWeight:800,color,marginTop:4}}>{val}</div><div style={{fontSize:11,color:G.muted,fontFamily:G.mono}}>{label}</div></div>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {pls.map(p=>(
          <div key={p.id} style={{...C,cursor:'pointer'}} onClick={()=>setSel(sel===p.id?null:p.id)}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:24}}>{p.status==='success'?'✅':p.status==='failed'?'❌':'⚙️'}</span>
                <div><div style={{fontWeight:700,fontSize:14,color:G.text}}>{p.name}</div><div style={{fontSize:11,color:G.dim,fontFamily:G.mono}}>#{p.run} • {p.branch}</div></div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:12,color:G.muted,fontFamily:G.mono}}>⏱ {Math.floor(p.dur/60)}m {p.dur%60}s</span>
                <Badge color={sc[p.status]||G.muted}>{p.status}</Badge>
                <span style={{color:G.dim}}>{sel===p.id?'▲':'▼'}</span>
              </div>
            </div>
            <div style={{display:'flex',gap:3,marginTop:12}}>{p.stages.map((s,i)=><div key={i} title={s.n} style={{flex:1,height:4,borderRadius:2,background:sc[s.s]||G.dim}}/>)}</div>
            {sel===p.id&&(
              <div style={{marginTop:14}}>
                <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:12}}>
                  {p.stages.map((s,i)=>(
                    <div key={i} style={{flex:'1 1 80px',padding:'8px 6px',textAlign:'center',background:`${sc[s.s]||G.dim}10`,border:`1px solid ${sc[s.s]||G.dim}25`,borderRadius:8}}>
                      <div style={{fontSize:15}}>{si[s.s]||'○'}</div>
                      <div style={{fontSize:9,color:G.muted,marginTop:3,fontFamily:G.mono,lineHeight:1.2}}>{s.n}</div>
                      {s.d&&<div style={{fontSize:9,color:G.dim,fontFamily:G.mono}}>{s.d}s</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// DEPLOYMENTS
function Deployments() {
  const [deps,setDeps]=useState([{id:'1',name:'AutoOps Frontend',ver:'v2.4.1',env:'production',status:'success',commit:'a3f9b2c',author:'Arjun Kumar',dur:127},{id:'2',name:'AutoOps Backend',ver:'v2.4.1',env:'production',status:'success',commit:'b7e1c4d',author:'Priya Sharma',dur:89},{id:'3',name:'AutoOps Frontend',ver:'v2.4.0',env:'staging',status:'success',commit:'c2a8f5e',author:'Rahul Dev',dur:64},{id:'4',name:'AutoOps Backend',ver:'v2.3.9',env:'production',status:'failed',commit:'d9c3b1a',author:'Arjun Kumar',dur:42},{id:'5',name:'AutoOps Backend',ver:'v2.3.8',env:'development',status:'rolled_back',commit:'e4f7d2c',author:'Priya Sharma',dur:95}]);
  const [deploying,setDeploying]=useState(false);
  const ec={production:G.orange,staging:G.yellow,development:G.blue};
  const sc={success:G.green,failed:G.red,running:G.blue,rolled_back:G.purple};
  const deploy=()=>{setDeploying(true);const nd={id:Date.now()+'',name:'AutoOps Frontend',ver:'v2.4.2',env:'production',status:'running',commit:'f1a2b3c',author:'You',dur:0};setDeps(p=>[nd,...p]);setTimeout(()=>{setDeps(p=>p.map(d=>d.id===nd.id?{...d,status:'success',dur:134}:d));setDeploying(false);},5000);};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:G.text}}>🚀 Deployments</h1><p style={{color:G.muted,fontSize:13,marginTop:4}}>Track all deployments across environments</p></div>
        <button onClick={deploy} disabled={deploying} style={{padding:'10px 20px',background:'linear-gradient(135deg,#006633,#00ff9d)',border:'none',borderRadius:8,color:'#000',fontSize:13,fontWeight:700,cursor:'pointer'}}>{deploying?'⟳ Deploying...':'🚀 Deploy Now'}</button>
      </div>
      <div style={{...C,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{borderBottom:`1px solid ${G.border}`}}>{['Service','Version','Env','Commit','Author','Duration','Status',''].map(h=><th key={h} style={{padding:'12px 14px',textAlign:'left',fontSize:11,color:G.dim,fontFamily:G.mono,textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
          <tbody>{deps.map((d,i)=>(
            <tr key={d.id} style={{borderBottom:i<deps.length-1?`1px solid #0d2033`:'none'}} onMouseEnter={e=>e.currentTarget.style.background=G.card} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <td style={{padding:'12px 14px',fontSize:13,fontWeight:600,color:G.text}}>{d.name}</td>
              <td style={{padding:'12px 14px',fontFamily:G.mono,fontSize:12,color:G.blue}}>{d.ver}</td>
              <td style={{padding:'12px 14px'}}><Badge color={ec[d.env]||G.muted}>{d.env}</Badge></td>
              <td style={{padding:'12px 14px',fontFamily:G.mono,fontSize:11,color:G.dim}}>{d.commit}</td>
              <td style={{padding:'12px 14px',fontSize:12,color:G.muted}}>{d.author}</td>
              <td style={{padding:'12px 14px',fontFamily:G.mono,fontSize:12,color:G.muted}}>{d.dur}s</td>
              <td style={{padding:'12px 14px'}}><Badge color={sc[d.status]||G.muted}>{d.status}</Badge></td>
              <td style={{padding:'12px 14px'}}><button style={{padding:'4px 10px',background:`${G.purple}15`,border:`1px solid ${G.purple}30`,borderRadius:6,color:G.purple,fontSize:11,cursor:'pointer'}}>↩ Rollback</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// CONTAINERS
function Containers() {
  const [cs,setCs]=useState([{id:'1',name:'autoops-frontend',image:'autoops/frontend:2.4.1',status:'running',cpu:'4.2',mem:'128',port:'3000:3000',restarts:0},{id:'2',name:'autoops-backend',image:'autoops/backend:2.4.1',status:'running',cpu:'12.7',mem:'256',port:'5000:5000',restarts:1},{id:'3',name:'autoops-mongo',image:'mongo:6',status:'running',cpu:'3.1',mem:'380',port:'27018:27017',restarts:0},{id:'4',name:'autoops-prometheus',image:'prom/prometheus:v2.45.0',status:'running',cpu:'1.8',mem:'95',port:'9090:9090',restarts:0},{id:'5',name:'autoops-grafana',image:'grafana/grafana:10.2.0',status:'running',cpu:'3.4',mem:'110',port:'3001:3000',restarts:0},{id:'6',name:'autoops-node-exporter',image:'prom/node-exporter:v1.6.1',status:'running',cpu:'0.8',mem:'22',port:'9100:9100',restarts:0}]);
  const [log,setLog]=useState([]);
  const [healing,setHealing]=useState({});
  const sc={running:G.green,restarting:G.blue,stopped:G.red};
  const stop=(name)=>{
    setCs(p=>p.map(c=>c.name===name?{...c,status:'stopped'}:c));
    setLog(p=>[`[${new Date().toLocaleTimeString()}] ⛔ ${name} stopped`,...p]);
    setTimeout(()=>{
      setHealing(p=>({...p,[name]:true}));
      setCs(p=>p.map(c=>c.name===name?{...c,status:'restarting'}:c));
      setLog(p=>[`[${new Date().toLocaleTimeString()}] 🔄 Self-healing triggered for ${name}`,...p]);
      setTimeout(()=>{
        setCs(p=>p.map(c=>c.name===name?{...c,status:'running',restarts:(c.restarts||0)+1}:c));
        setLog(p=>[`[${new Date().toLocaleTimeString()}] ✅ ${name} auto-recovered!`,...p]);
        setHealing(p=>({...p,[name]:false}));
      },3000);
    },1000);
  };
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:G.text}}>🐳 Container Orchestration</h1><p style={{color:G.muted,fontSize:13,marginTop:4}}>Live Docker management with self-healing</p></div>
        <span style={{display:'flex',alignItems:'center',gap:6,padding:'6px 16px',background:`${G.green}10`,border:`1px solid ${G.green}25`,borderRadius:20,fontSize:12,color:G.green}}><Dot color={G.green}/>{cs.filter(c=>c.status==='running').length}/{cs.length} Running</span>
      </div>
      <div style={{padding:'14px 18px',background:`${G.blue}08`,border:`1px solid ${G.blue}20`,borderRadius:12,display:'flex',alignItems:'center',gap:14}}>
        <span style={{fontSize:26}}>🛡️</span>
        <div><div style={{fontSize:13,fontWeight:700,color:G.blue}}>Self-Healing Active — Click "Stop (Demo)" to watch auto-restart!</div><div style={{fontSize:12,color:G.muted,marginTop:2}}>Uses Docker <code style={{fontFamily:G.mono,color:G.yellow}}>restart: unless-stopped</code> policy</div></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
        {cs.map(c=>(
          <div key={c.id} style={{...C,borderColor:c.status!=='running'?(sc[c.status]+'40'):G.border}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:24}}>{c.name.includes('frontend')?'🌐':c.name.includes('backend')?'⚙️':c.name.includes('mongo')?'🗄️':c.name.includes('prometheus')?'🔥':c.name.includes('grafana')?'📊':'🖥️'}</span>
                <div><div style={{fontFamily:G.mono,fontWeight:700,fontSize:13,color:G.text}}>{c.name}</div><div style={{fontSize:11,color:G.dim,fontFamily:G.mono,marginTop:1}}>{c.image}</div></div>
              </div>
              <Badge color={sc[c.status]||G.muted}>{c.status}</Badge>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:12}}>
              {[['💻','CPU',`${c.cpu}%`,G.blue],['🧠','MEM',`${c.mem}MB`,G.purple],['🔌','PORT',c.port,G.yellow],['🔄','RESTART',c.restarts,c.restarts>0?G.orange:G.green]].map(([icon,label,val,color])=>(
                <div key={label} style={{textAlign:'center',padding:6,background:'rgba(255,255,255,0.02)',borderRadius:7}}>
                  <div style={{fontSize:10,color:G.dim,fontFamily:G.mono}}>{icon} {label}</div>
                  <div style={{fontSize:12,fontWeight:700,color,fontFamily:G.mono,marginTop:2}}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:7}}>
              <button onClick={()=>stop(c.name)} disabled={!!healing[c.name]||c.status!=='running'} style={{flex:1,padding:7,borderRadius:7,background:`${G.red}10`,border:`1px solid ${G.red}22`,color:G.red,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:G.sans}}>⛔ Stop (Demo Heal)</button>
              <button style={{flex:1,padding:7,borderRadius:7,background:`${G.blue}10`,border:`1px solid ${G.blue}22`,color:G.blue,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:G.sans}}>🔄 Restart</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{...C,padding:16}}>
        <div style={{fontSize:14,fontWeight:700,color:G.text,marginBottom:10,display:'flex',alignItems:'center',gap:8}}>🛡️ Self-Healing Log {log.length>0&&<Badge color={G.green}>LIVE</Badge>}</div>
        <div style={{background:'#010a14',borderRadius:8,padding:12,fontFamily:G.mono,fontSize:12,minHeight:70,maxHeight:160,overflowY:'auto'}}>
          {log.length===0?<span style={{color:G.dim}}>No events yet. Click "Stop (Demo Heal)" above...</span>:log.map((line,i)=><div key={i} style={{color:line.includes('✅')?G.green:line.includes('🔄')?G.blue:G.red,marginBottom:4}}>{line}</div>)}
        </div>
      </div>
    </div>
  );
}

// INFRASTRUCTURE
function Infrastructure() {
  const [planOut,setPlanOut]=useState('');
  const [planning,setPlanning]=useState(false);
  const resources=[{icon:'🖥️',name:'autoops-prod-server',type:'EC2 t3.medium',status:'running',cost:'$0.042/hr'},{icon:'🗄️',name:'autoops-db',type:'RDS db.t3.micro',status:'available',cost:'$0.018/hr'},{icon:'🪣',name:'autoops-artifacts',type:'S3 Bucket 2.3GB',status:'active',cost:'$0.023/GB'},{icon:'⚖️',name:'autoops-alb',type:'Load Balancer',status:'active',cost:'$0.008/hr'},{icon:'🔒',name:'autoops-vpc',type:'VPC 10.0.0.0/16',status:'available',cost:'Free'},{icon:'🐳',name:'autoops-cluster',type:'ECS 6 tasks',status:'active',cost:'Free'}];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:G.text}}>🏗️ Infrastructure as Code</h1><p style={{color:G.muted,fontSize:13,marginTop:4}}>Terraform-managed AWS — fully reproducible</p></div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={()=>{setPlanning(true);setTimeout(()=>{setPlanOut('Plan: 1 to add, 1 to change, 0 to destroy.\n+ aws_security_group.autoops_sg\n~ aws_instance.autoops_prod (t3.medium → t3.large)');setPlanning(false);},2000);}} disabled={planning} style={{padding:'9px 16px',background:`${G.yellow}15`,border:`1px solid ${G.yellow}30`,borderRadius:8,color:G.yellow,fontSize:13,fontWeight:600,cursor:'pointer'}}>{planning?'⟳ Planning...':'📋 terraform plan'}</button>
          <button style={{padding:'9px 16px',background:'linear-gradient(135deg,#004d00,#00ff9d)',border:'none',borderRadius:8,color:'#000',fontSize:13,fontWeight:700,cursor:'pointer'}}>⚡ terraform apply</button>
        </div>
      </div>
      <div style={{display:'flex',gap:10}}>{[['✅','State: Clean',G.green],['📦','24 Resources',G.blue],['🌍','ap-south-1',G.purple],['💰','$2.84/day',G.yellow]].map(([icon,label,color])=><div key={label} style={{...C,flex:1,padding:12,textAlign:'center'}}><div style={{fontSize:18}}>{icon}</div><div style={{fontSize:12,color,fontWeight:700,marginTop:5}}>{label}</div></div>)}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
        {resources.map(r=>(
          <div key={r.name} style={{...C,padding:14,display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:28}}>{r.icon}</span>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:G.text}}>{r.name}</div><div style={{fontSize:11,color:G.dim,fontFamily:G.mono}}>{r.type}</div></div>
            <div style={{textAlign:'right'}}><Badge color={G.green}>{r.status}</Badge><div style={{fontSize:11,color:G.yellow,marginTop:4,fontFamily:G.mono}}>{r.cost}</div></div>
          </div>
        ))}
      </div>
      {planOut&&<div style={{...C,padding:16}}><div style={{fontSize:13,fontWeight:700,color:G.text,marginBottom:8}}>📋 Terraform Plan Output</div><pre style={{fontFamily:G.mono,fontSize:12,color:G.muted,background:'#010a14',padding:12,borderRadius:8,whiteSpace:'pre-wrap'}}>{planOut}</pre></div>}
    </div>
  );
}

// MONITORING
function Monitoring() {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:G.text}}>📊 Monitoring & Observability</h1><p style={{color:G.muted,fontSize:13,marginTop:4}}>Prometheus + Grafana stack</p></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
        {[{icon:'📈',title:'Grafana Dashboard',url:'http://localhost:3001',desc:'CPU, memory, container dashboards',color:G.orange},{icon:'🔥',title:'Prometheus Metrics',url:'http://localhost:9090',desc:'PromQL query engine & metrics',color:G.blue},{icon:'🖥️',title:'Node Exporter',url:'http://localhost:9100',desc:'Host system metrics',color:G.purple},{icon:'❤️',title:'Backend Health',url:'http://localhost:5000/health',desc:'Live health check endpoint',color:G.green}].map(t=>(
          <div key={t.title} style={{...C,padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}><span style={{fontSize:32}}>{t.icon}</span><Badge color={G.green}><Dot color={G.green}/>Live</Badge></div>
            <div style={{fontSize:15,fontWeight:700,color:t.color,marginBottom:6}}>{t.title}</div>
            <div style={{fontSize:12,color:G.muted,marginBottom:12}}>{t.desc}</div>
            <div style={{fontFamily:G.mono,fontSize:11,color:G.dim,padding:'5px 10px',background:'#010a14',borderRadius:6,marginBottom:10}}>{t.url}</div>
            <a href={t.url} target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',background:`${t.color}15`,border:`1px solid ${t.color}30`,borderRadius:7,color:t.color,fontSize:12,fontWeight:600,textDecoration:'none'}}>🔗 Open</a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ALERTS
function Alerts() {
  const [alerts,setAlerts]=useState([{id:1,sev:'critical',title:'High CPU Usage',msg:'Backend CPU above 90%',svc:'autoops-backend',time:'5m ago',resolved:false},{id:2,sev:'warning',title:'Memory Usage High',msg:'MongoDB at 80% capacity',svc:'autoops-mongo',time:'10m ago',resolved:false},{id:3,sev:'info',title:'Deployment Complete',msg:'v2.4.1 deployed to production',svc:'autoops-frontend',time:'15m ago',resolved:true},{id:4,sev:'warning',title:'Slow API Response',msg:'API latency > 500ms',svc:'autoops-backend',time:'32m ago',resolved:true},{id:5,sev:'critical',title:'Container Restarted',msg:'Self-healing triggered: restart #3',svc:'autoops-backend',time:'1h ago',resolved:true}]);
  const sc={critical:G.red,warning:G.orange,info:G.purple};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:G.text}}>🔔 Alerts</h1><p style={{color:G.muted,fontSize:13,marginTop:4}}>Prometheus Alertmanager</p></div>
        <div style={{display:'flex',gap:8}}><Badge color={G.red}>🔴 {alerts.filter(a=>!a.resolved).length} Active</Badge><Badge color={G.green}>✅ {alerts.filter(a=>a.resolved).length} Resolved</Badge></div>
      </div>
      {alerts.map(a=>(
        <div key={a.id} style={{...C,padding:14,display:'flex',alignItems:'center',gap:14,borderLeft:`3px solid ${sc[a.sev]}`,opacity:a.resolved?0.6:1}}>
          <span style={{fontSize:24}}>{a.sev==='critical'?'🚨':a.sev==='warning'?'⚠️':'ℹ️'}</span>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}><span style={{fontWeight:700,fontSize:14,color:G.text}}>{a.title}</span><Badge color={sc[a.sev]}>{a.sev}</Badge>{a.resolved&&<Badge color={G.green}>resolved</Badge>}</div>
            <div style={{fontSize:13,color:G.muted}}>{a.msg}</div>
            <div style={{fontSize:11,color:G.dim,marginTop:3,fontFamily:G.mono}}>📦 {a.svc} • ⏱ {a.time}</div>
          </div>
          {!a.resolved&&<button onClick={()=>setAlerts(p=>p.map(al=>al.id===a.id?{...al,resolved:true}:al))} style={{padding:'7px 14px',background:`${G.green}10`,border:`1px solid ${G.green}25`,borderRadius:7,color:G.green,fontSize:12,cursor:'pointer'}}>✅ Resolve</button>}
        </div>
      ))}
    </div>
  );
}

// TEAM
function Team() {
  const members=[{name:'Arjun Kumar',email:'arjun@autoops.dev',role:'admin',status:'online',deploys:48},{name:'Priya Sharma',email:'priya@autoops.dev',role:'developer',status:'online',deploys:32},{name:'Rahul Dev',email:'rahul@autoops.dev',role:'developer',status:'offline',deploys:19},{name:'Sneha Patel',email:'sneha@autoops.dev',role:'viewer',status:'online',deploys:0}];
  const rc={admin:G.orange,developer:G.blue,viewer:G.purple};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:G.text}}>👥 Team</h1><p style={{color:G.muted,fontSize:13,marginTop:4}}>Members and access control</p></div>
        <button style={{padding:'9px 18px',background:'linear-gradient(135deg,#0066cc,#00d4ff)',border:'none',borderRadius:8,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'}}>➕ Invite Member</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
        {members.map(m=>(
          <div key={m.email} style={{...C,padding:16,display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:'50%',background:`linear-gradient(135deg,${rc[m.role]},#0066cc)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,color:'#fff',flexShrink:0,position:'relative'}}>
              {m.name.charAt(0)}
              <div style={{position:'absolute',bottom:0,right:0,width:12,height:12,borderRadius:'50%',background:m.status==='online'?G.green:G.dim,border:`2px solid ${G.card}`}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:G.text}}>{m.name}</div>
              <div style={{fontSize:11,color:G.dim,fontFamily:G.mono,marginBottom:5}}>{m.email}</div>
              <div style={{display:'flex',gap:8}}><Badge color={rc[m.role]}>{m.role}</Badge><span style={{fontSize:11,color:G.dim}}>🚀 {m.deploys}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SETTINGS
function Settings() {
  const [saved,setSaved]=useState(false);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18,maxWidth:680}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:G.text}}>⚙️ Settings</h1><p style={{color:G.muted,fontSize:13,marginTop:4}}>Platform configuration</p></div>
      {[{title:'🐙 GitHub',fields:[['Repository','https://github.com/autoops/app'],['Branch','main'],['Webhook Secret','••••••••']]},{title:'🐳 Docker',fields:[['Registry','registry.hub.docker.com'],['Username','autoops'],['Prefix','autoops/']]},{title:'📊 Monitoring',fields:[['Prometheus','http://localhost:9090'],['Grafana','http://localhost:3001'],['Alert Email','ops@autoops.dev']]}].map(s=>(
        <div key={s.title} style={{...C,padding:20}}>
          <div style={{fontSize:14,fontWeight:700,color:G.text,marginBottom:14}}>{s.title}</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {s.fields.map(([label,val])=>(
              <div key={label}>
                <label style={{fontSize:11,color:G.muted,display:'block',marginBottom:4,fontFamily:G.mono}}>{label}</label>
                <input defaultValue={val} style={{width:'100%',padding:'9px 12px',background:G.bg,border:`1px solid ${G.border}`,borderRadius:8,color:G.text,fontSize:13,fontFamily:G.mono,outline:'none',boxSizing:'border-box'}}/>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}} style={{padding:12,background:saved?'linear-gradient(135deg,#006633,#00ff9d)':'linear-gradient(135deg,#0052a3,#00d4ff)',border:'none',borderRadius:8,color:saved?'#000':'#fff',fontSize:14,fontWeight:700,cursor:'pointer'}}>
        {saved?'✅ Saved!':'💾 Save Settings'}
      </button>
    </div>
  );
}

// ROOT
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout/> : <Navigate to="/login" replace/>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/*" element={<ProtectedLayout/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
