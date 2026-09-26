export const STORAGE_KEY='cat-compass-progress-v1';
export const blankState=()=>({schemaVersion:1,tasks:{},notes:{},mocks:[],optionalMocks:{},selectedDate:null});
export const isoToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function shiftDate(date,n){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export const formatDate=(date,short=false)=>new Date(date+'T12:00:00Z').toLocaleDateString('en-IN',{day:'numeric',month:'short',...(short?{}:{weekday:'long'})});
export const hours=m=>m>=60?`${Math.floor(m/60)}h${m%60?' '+m%60+'m':''}`:`${m}m`;
export const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function sectionScore(s){return 3*s.correct-s.wrongMCQ;}
export function attempts(s){return s.correct+s.wrongMCQ+s.wrongTITA;}
export function accuracy(s){const a=attempts(s);return a?Math.round(s.correct/a*100):null;}
export function totalScore(m){return Object.values(m.sections).reduce((a,s)=>a+sectionScore(s),0);}
export function effectiveDay(day,state,plan){
 const optional=plan.mocks.find(m=>m.id===day.optionalMock);
 if(optional&&state.optionalMocks[optional.id])return {...day,title:optional.name+' · optional',kind:'mock',minutes:180,tasks:[{id:day.date+'-optional-test',section:'Mock',title:'Take '+optional.name,minutes:120,detail:'Replace normal practice. Use an unseen test, uninterrupted.',url:optional.url},{id:day.date+'-optional-analysis',section:'Analysis',title:'Begin analysis',minutes:60,detail:'Retry accessible errors before explanations. Finish the remaining review tomorrow.',url:plan.links.bookmarks}]};
 const prev=plan.mocks.find(m=>m.optional&&m.date===shiftDate(day.date,-1)&&state.optionalMocks[m.id]);
 if(prev)return {...day,title:'Finish '+prev.name+' analysis',kind:'analysis',minutes:175,tasks:[{id:day.date+'-optional-followup',section:'Analysis',title:'Complete '+prev.name+' review',minutes:90,detail:'Finish analysis before another test. Recover easy marks and log three changes.',url:plan.links.bookmarks},...day.tasks.filter(t=>['VARC','QA','Review'].includes(t.section)).slice(0,3).map((t,i)=>({...t,minutes:[40,35,10][i]}))]};
 return day;
}
export function progress(plan,state){let done=0,total=0,minutes=0;for(const d of plan.days){for(const t of effectiveDay(d,state,plan).tasks){if(t.optional)continue;total++;if(state.tasks[t.id]){done++;minutes+=t.minutes;}}}return{done,total,minutes,percent:total?Math.round(done/total*1000)/10:0};}
export function validateMock(m){
 if(!m||typeof m!=='object'||typeof m.id!=='string'||m.id.length>100)throw Error('Invalid mock ID.');
 if(typeof m.name!=='string'||!m.name.trim()||m.name.length>120)throw Error('Add a test name (up to 120 characters).');
 if(!validDate(m.date))throw Error('Choose a valid test date.');
 if(!['full','sectional'].includes(m.type))throw Error('Invalid test type.');
 if(!m.sections||typeof m.sections!=='object')throw Error('Section scores are missing.');
 const keys=Object.keys(m.sections);
 if(keys.some(k=>!['VARC','DILR','QA'].includes(k))||keys.length!==(m.type==='full'?3:1))throw Error('Check the sections for this test type.');
 const sections={};
 for(const k of keys){const s=m.sections[k];if(!s||['correct','wrongMCQ','wrongTITA'].some(x=>!Number.isInteger(s[x])||s[x]<0))throw Error(k+': enter whole, non-negative answer counts.');if(attempts(s)>(k==='VARC'?24:22))throw Error(k+': attempted count exceeds the recent CAT section size.');sections[k]={correct:s.correct,wrongMCQ:s.wrongMCQ,wrongTITA:s.wrongTITA};}
 if(!Number.isFinite(m.analysisMinutes)||m.analysisMinutes<0||m.analysisMinutes>1440)throw Error('Analysis minutes must be between 0 and 1440.');
 const notes=typeof m.notes==='string'?m.notes:'';if(notes.length>6000)throw Error('Please keep analysis notes under 6,000 characters.');
 return {id:m.id,name:m.name.trim(),date:m.date,type:m.type,sections,analysisMinutes:m.analysisMinutes,reviewed:!!m.reviewed,unseen:m.unseen!==false,notes,updatedAt:typeof m.updatedAt==='string'?m.updatedAt:new Date().toISOString()};
}
export function validDate(d){return typeof d==='string'&&/^20\d{2}-\d{2}-\d{2}$/.test(d)&&!isNaN(new Date(d+'T12:00Z'))&&new Date(d+'T12:00Z').toISOString().slice(0,10)===d;}
export function validateState(raw){
 if(!raw||typeof raw!=='object'||raw.schemaVersion!==1)throw Error('This is not a compatible CAT Compass backup.');
 const s=blankState();
 for(const key of ['tasks','optionalMocks']){if(!raw[key]||Array.isArray(raw[key])||typeof raw[key]!=='object')throw Error('Invalid '+key+' data.');const pairs=Object.entries(raw[key]);if(pairs.length>5000)throw Error('Backup contains too many records.');for(const[k,v]of pairs){if(!/^[a-zA-Z0-9-]{1,100}$/.test(k)||typeof v!=='boolean')throw Error('Invalid progress record.');s[key][k]=v;}}
 if(!raw.notes||Array.isArray(raw.notes)||typeof raw.notes!=='object')throw Error('Invalid notes data.');
 for(const[k,v]of Object.entries(raw.notes)){if(!validDate(k)||typeof v!=='string'||v.length>6000)throw Error('Invalid daily note.');s.notes[k]=v;}
 if(!Array.isArray(raw.mocks)||raw.mocks.length>500)throw Error('Invalid mock list.');s.mocks=raw.mocks.map(validateMock);if(new Set(s.mocks.map(m=>m.id)).size!==s.mocks.length)throw Error('Duplicate mock IDs in backup.');
 s.selectedDate=validDate(raw.selectedDate)?raw.selectedDate:null;return s;
}
export function mergeState(current,incoming){
 const byId=new Map(current.mocks.map(m=>[m.id,m]));for(const m of incoming.mocks){const old=byId.get(m.id);if(!old||m.updatedAt>=old.updatedAt)byId.set(m.id,m);}
 return {...current,tasks:{...current.tasks,...incoming.tasks},notes:{...current.notes,...incoming.notes},optionalMocks:{...current.optionalMocks,...incoming.optionalMocks},mocks:[...byId.values()]};
}
export function report(state,plan){const p=progress(plan,state);return ['CAT Compass · plan v'+plan.version,'Exported '+isoToday(),'Completed: '+p.done+'/'+p.total+' required tasks; '+hours(p.minutes)+' planned work checked off.','',...state.mocks.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(m=>[`${m.date} — ${m.name} (${m.type}, ${m.unseen?'unseen':'previously seen'})`,...Object.entries(m.sections).map(([k,s])=>`${k}: ${sectionScore(s)} raw | ${attempts(s)} attempted | ${s.correct} correct | ${s.wrongMCQ} wrong MCQ | ${s.wrongTITA} wrong TITA | accuracy ${accuracy(s)??'—'}%`),`Total raw: ${totalScore(m)} | Analysis: ${m.analysisMinutes} min | Reviewed: ${m.reviewed?'yes':'no'}`,m.notes,''].join('\n')),...Object.entries(state.notes).filter(([,v])=>v.trim()).map(([d,v])=>`${d} note: ${v}`)].join('\n');}
