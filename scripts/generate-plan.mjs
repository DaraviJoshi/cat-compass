import fs from 'node:fs';
const base='https://cracku.in';
const links={rc:base+'/cat/verbal-ability/reading-comprehension',approach:base+'/cat/lesson/22/approach-to-reading-comprehension',approachTest:base+'/cat/lesson/22/approach-to-reading-comprehension-test',summary:base+'/cat/verbal-ability/para-summary',jumble:base+'/cat/verbal-ability/para-jumbles',odd:base+'/cat/verbal-ability/odd-one-out-cat-va',completion:base+'/cat/verbal-ability/para-completion',basics:base+'/cat-pre-readings/48787/cat-lrdi-basics-arrangement',arr:base+'/cat/lr-di/lr-arrangement',table:base+'/cat/lr-di/table-based-di-sets',selection:base+'/cat/lr-di/lr-selection-with-condition',schedule:base+'/cat/lr-di/lr-scheduling',games:base+'/cat/lr-di/lr-games-and-tournaments',charts:base+'/cat/lr-di/di-charts',venn:base+'/cat/lr-di/di-venn-diagrams',qlr:base+'/cat/lr-di/quant-based-lr',max:base+'/cat/lr-di/di-maxima-minima',ratio:base+'/cat/quantitative-aptitude/avgs-ratio-proportion',profit:base+'/cat/quantitative-aptitude/profit-loss-interest',mixture:base+'/cat/quantitative-aptitude/mixtures-solution-cat',interest:base+'/cat/quantitative-aptitude/interest-cat',work:base+'/cat/quantitative-aptitude/time-work-cat',speed:base+'/cat/quantitative-aptitude/time-distance-work',linear:base+'/cat/quantitative-aptitude/linear-equations',quadratic:base+'/cat/quantitative-aptitude/quadratic-equations',inequality:base+'/cat/quantitative-aptitude/inequalities',logs:base+'/cat/quantitative-aptitude/logarithms-surds-indices',series:base+'/cat/quantitative-aptitude/progressions-and-series',geometry:base+'/cat/quantitative-aptitude/geometry',numbers:base+'/cat/quantitative-aptitude/number-systems',function:base+'/cat/quantitative-aptitude/functions-graphs-statistics',bookmarks:base+'/cat/history/bookmarks',daily:base+'/cat-daily-target/',mocks:base+'/cat-mock-test',pyq:base+'/cat-previous-papers',varcTest:base+'/cat/verbal-sectional-tests',dilrTest:base+'/cat/lrdi-sectional-tests',qaTest:base+'/cat/quant-sectional-tests',official:'https://iimcat.ac.in'};
const mockList=[['09-27','Free CAT Mock 1','free-cat-mock-1'],['10-04','DashCAT 2','dashcat-2'],['10-11','DashCAT 3','dashcat-3'],['10-15','DashCAT 8','dashcat-8',true],['10-18','CAT 2023 Slot 1','pyq'],['10-22','DashCAT 4','dashcat-4'],['10-25','CAT 2024 Slot 1','pyq'],['10-29','DashCAT 9','dashcat-9',true],['11-01','CAT 2024 Slot 2','pyq'],['11-05','DashCAT 5','dashcat-5'],['11-11','DashCAT 6','dashcat-6'],['11-15','CAT 2025 Slot 1','pyq'],['11-18','DashCAT 7','dashcat-7'],['11-21','CAT 2025 Slot 2','pyq']].map(([d,name,slug,optional=false])=>({id:'mock-'+d,date:'2026-'+d,name,optional,url:slug==='pyq'?links.pyq:(slug==='free-cat-mock-1'||slug==='dashcat-2'||slug==='dashcat-3'?base+'/cat-mock-test/'+slug:links.mocks),type:'full'}));
const sectionals=[['10-10','VARC'],['10-17','VARC'],['10-24','DILR'],['10-31','VARC'],['11-03','QA'],['11-10','VARC'],['11-14','DILR'],['11-17','VARC']].map(([d,s],i)=>({id:'sectional-'+d,date:'2026-'+d,name:s+' sectional '+(i+1),section:s,type:'sectional',url:links[{VARC:'varcTest',DILR:'dilrTest',QA:'qaTest'}[s]]}));
const rows=[
['09-28','Review baseline RC; finish Approach chapters','approach','Rebuild one accessible mock set','bookmarks','Retry five missed easy QA questions','bookmarks'],
['09-29','Finish RC Approach; explain one passage','approach','Arrangements: finish and reconstruct example','arr','Percentages and successive changes','ratio'],
['09-30','RC Approach test: 15 min, 5 questions + review','approachTest','Table DI: first example, then rebuild it','table','Ratio and proportion: 5-question diagnostic','ratio'],
['10-01','Central Idea module + one passage','rc','Table DI: one independent set','table','Averages: concept check and 5–8 questions','ratio'],
['10-02','One informative RC; main-point summary','rc','Reattempt arrangement and table errors','bookmarks','Reattempt percentages/ratio errors','ratio'],
['10-03','Central idea practice + two summaries','summary','Data Organisation in LRDI Basics; example','basics','Arithmetic repair: 10–15 mixed questions','ratio'],
['10-05','Mock RC review: evidence for wrong options','rc','Reconstruct missed mock set','bookmarks','Repair weakest arithmetic skill','ratio'],
['10-06','Tone of Passage module + one RC','rc','Selection with conditions: concept/example','selection','Profit and loss: diagnostic then practice','profit'],
['10-07','Scientific RC: label paragraph roles','rc','Selection: one independent set','selection','Mixtures: 5–8 questions with review','mixture'],
['10-08','One RC + two para summaries','summary','Scheduling basics + example','schedule','Simple and compound interest','interest'],
['10-09','One RC; review blocked vocabulary','rc','Reattempt selection/scheduling errors','bookmarks','Time and work: concept + 5 questions','work'],
['10-10','VARC sectional and evidence-based review','varcTest','Table/arrangement: two sets with review','table','Finish time/work; arithmetic mixed repair','work'],
['10-12','Repair mock comprehension errors','rc','Rebuild best skipped mock set','bookmarks','Review arithmetic selection errors','bookmarks'],
['10-13','Author Agree/Disagree module + one RC','rc','DI Charts basics + one chart set','charts','Speed, time, distance: basic relationships','speed'],
['10-14','One RC + two odd-sentence questions','odd','Games/tournaments introduction + example','games','Speed/distance: relative speed practice','speed'],
['10-15','Inference: one RC with text evidence','rc','Scheduling: one timed set + review','schedule','Linear equations: diagnostic and practice','linear'],
['10-16','Close options: explain why each fails','rc','Reattempt DI chart/game errors','bookmarks','Linear equations: mixed word problems','linear'],
['10-17','VARC sectional + review; short VA repair','varcTest','Games and charts: two reviewed sets','games','Quadratics: roots, equations and applications','quadratic'],
['10-19','Review hard-paper RC errors','rc','Reconstruct one skipped set before solutions','bookmarks','Quadratic repair + five arithmetic questions','quadratic'],
['10-20','One RC + two paragraph-completion questions','completion','Quant-based LR: concept and example','qlr','Inequalities: basic rules and applications','inequality'],
['10-21','Two RCs if the first is fully reviewed','rc','Venn DI: representation and one set','venn','Logs, indices and surds: diagnostic','logs'],
['10-23','Review mock arguments and answer scope','rc','Redo selected mock deductions','bookmarks','Repair easy questions left unseen','bookmarks'],
['10-24','One RC + mixed verbal ability practice','daily','DILR sectional + reconstruction review','dilrTest','Progressions: AP/GP basics; algebra revision','series'],
['10-26','RC review: reduce close-option mistakes','rc','Reattempt one useful missed set','bookmarks','Review mock QA; triangles diagnostic','geometry'],
['10-27','One RC + summaries; evidence check','summary','Mixed tables: one timed set then review','table','Triangles: similarity, area, key properties','geometry'],
['10-28','Two RCs or one deeply reviewed hard RC','rc','Maxima/minima basics; rebuild example','max','Circles: tangents, angles, chords','geometry'],
['10-29','One RC + parajumbles','jumble','Mixed selection set + review','selection','Geometry: circles and triangles mixed','geometry'],
['10-30','Reattempt VARC error bookmarks','bookmarks','Reattempt Venn/max-min deductions','bookmarks','Mensuration basics and geometry revision','geometry'],
['10-31','VARC sectional + option-error review','varcTest','Routes/networks in Basics; one example','basics','Mixed arithmetic/algebra; optional NMAT format 60 min replaces catch-up','ratio'],
['11-02','Review RC: comprehension versus selection','rc','Reconstruct mock set with clean notation','bookmarks','Retry missed geometry/arithmetic questions','bookmarks'],
['11-03','One RC + two VA questions','daily','Mixed charts set; focus calculation choice','charts','QA sectional + review, replacing QA and log blocks','qaTest'],
['11-04','One RC; shortlist preferred passage types','rc','Number/quant reasoning: one mixed set','qlr','Number properties: divisibility and remainders basics','numbers'],
['11-06','Finish mock analysis; no extra quotas','bookmarks','Repair the first useful deduction','bookmarks','Retry five accessible missed questions','bookmarks'],
['11-09','Return gently: one RC with summary','rc','Reattempt a familiar table set','table','Formula recall + five familiar questions','bookmarks'],
['11-10','VARC sectional + review','varcTest','One familiar DILR set, 30 min','bookmarks','Mixed arithmetic: 30-minute repair','ratio'],
['11-12','Review mock RC evidence and guesses','rc','Compare chosen set against missed easier set','bookmarks','Repair arithmetic/algebra selection','bookmarks'],
['11-13','One RC + weakest VA type','daily','One mixed timed set + closed-solution redo','daily','Functions basics only if core is stable; otherwise arithmetic repair','function'],
['11-14','Two RCs and option review','rc','DILR sectional + review','dilrTest','Mixed QA: 12–15 questions and full review','daily'],
['11-16','Review mock RC; reattempt wrong options','rc','Rebuild one missed set','bookmarks','Revise the three largest mock errors','bookmarks'],
['11-17','Final planned VARC sectional + review','varcTest','One familiar set; practise clean notation','bookmarks','Formula recall + 5–6 mixed questions','bookmarks'],
['11-19','Complete mock analysis, evidence first','rc','Set selection: why the first choice helped/hurt','bookmarks','Retry accessible skipped questions','bookmarks'],
['11-20','One familiar RC; review written strategy','bookmarks','One confidence-building set','bookmarks','Short arithmetic/algebra repair; no new chapters','bookmarks'],
['11-22','Final mock review; prepare one-page VARC rules','bookmarks','Final mock review; note selection and exit rules','bookmarks','Final mock review; revise error/formula sheet','bookmarks']
];
const syllabus=new Map(rows.map(([d,v,vl,l,ll,q,ql])=>['2026-'+d,{v,vl,l,ll,q,ql}]));
const shift=(date,n)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const days=[];
function task(date,key,section,title,minutes,detail,url,optional=false){return {id:date+'-'+key,section,title,minutes,detail,url,optional};}
for(let date='2026-09-26';date<='2026-11-29';date=shift(date,1)){
 const dow=new Date(date+'T12:00Z').getUTCDay(),weekend=dow===0||dow===6;
 const m=mockList.find(x=>x.date===date&&!x.optional), opt=mockList.find(x=>x.date===date&&x.optional), sec=sectionals.find(x=>x.date===date);
 let kind='study',title='Build, practise, review',note='',tasks=[];
 let phase=date<'2026-10-05'?'Start gently':date<'2026-10-19'?'Build the core':date<'2026-11-02'?'Apply under time':date<'2026-11-16'?'Select and refine':'Consolidate';
 if(date==='2026-09-26'){
  title='Start small. Start today.'; tasks=[task(date,'varc','VARC','RC Approach: first three chapters',40,'Watch Introduction, Active Reading and How to Read (about 16½ minutes). Pause, then write a passage’s main point.',links.approach),task(date,'dilr','DILR','Arrangements: your first example',30,'Try the example before the explanation. Rebuild its arrangement once.',links.basics),task(date,'log','Review','Write tomorrow’s starting point',10,'Prepare a notebook and a quiet two-hour test window. No score target yet.',links.mocks)];
 }else if(m){
  kind='mock';title=m.name;note='This test replaces all normal practice. Start the timer only when you can finish uninterrupted. Use an unseen substitute if already studied.';
  const review=weekend?(date==='2026-09-27'?120:150):60;
  tasks=[task(date,'test','Mock','Take '+m.name,120,m.url===links.pyq?'Open Previous Papers → choose the stated year and slot → Take Test. Use that paper’s original question count.':'Open the mock list, select the named test, and follow its instructions. Standard CAT preparation: 40 minutes per section.',m.url),task(date,'analysis','Analysis','Analyse the attempt, not only the score',review,'Retry accessible wrong/skipped questions first. Review lucky correct answers. Diagnose comprehension, concept, selection, calculation or time. Log three changes.',links.bookmarks)];
  if(weekend&&date!=='2026-09-27')tasks.push(task(date,'repair','Review','Repair and schedule reattempts',60,'Redo selected errors without solutions. Mark questions for +2-day and +7-day recall; use the daily review block for them.',links.bookmarks));
 }else if(date>='2026-11-23'&&date<='2026-11-27'){
  kind='break';title='Protected personal time';phase='Rest and retain';note='No required study. This break is already included in the plan.';
  tasks=[task(date,'optional','Review','Optional familiar reading or notes',15,'Only if convenient. Do not make up missed hours later.',links.bookmarks,true)];
 }else if(date>='2026-11-07'&&date<='2026-11-08'){
  kind='break';title='Diwali break';phase='Rest and retain';note='Keep family time free. The next full test is on 11 November.';
  tasks=[task(date,'optional','VARC','Optional light reading',20,'One short familiar passage; no test or compulsory backlog.',links.rc,true)];
 }else if(date==='2026-11-28'){
  kind='light';title='Settle in for exam day';tasks=[task(date,'notes','Review','Read your short revision notes',30,'Familiar formulas and test-selection rules only. Stop while fresh.',links.bookmarks),task(date,'logistics','Admin','Check admit card, ID, route and reporting time',15,'Use the official instructions. Settle travel, meals and sleep.',links.official)];
 }else if(date==='2026-11-29'){
  kind='exam';title='CAT day';phase='Your exam';note='Use the official reporting and test instructions. Adapt selection to the paper in front of you.';
  tasks=[task(date,'exam','Exam','Take CAT 2026',120,'Trust rehearsed reading, set selection and question selection. Do not chase a fixed attempt quota.',links.official)];
 }else{
  const r=syllabus.get(date);if(!r)throw Error('Missing '+date);
  const early=date<'2026-10-05';
  let minutes=weekend?[85,85,65]:early?[45,45,35]:[65,60,45];
  if(date==='2026-11-09')minutes=[45,45,35];
  tasks=[task(date,'varc','VARC',r.v,minutes[0],'Attempt before explanations. Summarise the argument; review text evidence for wrong and lucky-correct answers. Lesson segments fit inside this block.',links[r.vl]),task(date,'dilr','DILR',r.l,minutes[1],'Try independently for 15–20 minutes; use a hint if needed. Close the solution and reconstruct the deductions.',links[r.ll]),task(date,'qa','QA',r.q,minutes[2],'Use a five-question concept check before a long lecture. Practise independently and review mistakes; fewer questions are fine if review needs time.',links[r.ql])];
  if(weekend)tasks.push(task(date,'repair','Review','Finish the week’s useful unfinished work',early?35:70,'Prioritise review and foundation gaps. Do not open several new topics. Reattempt selected errors from two and seven days ago.',links.bookmarks));
  tasks.push(task(date,'log','Review','Error log and spaced recall',weekend?15:10,'One lesson, one next action. Reattempt a selected error from two or seven days ago; carry unfinished review into tomorrow’s repair block.',links.bookmarks));
  if(sec){
   kind='sectional';title=sec.section+' sectional + targeted practice';
   let t=tasks.find(t=>t.section===sec.section);t.minutes=90;t.title=sec.name+' + full review';t.detail='40-minute test, then 50-minute review. Select the next unused sectional. Log result and one change for the next test.';t.url=sec.url;
   if(!weekend){for(const t of tasks)if(t.section!==sec.section&&t.section!=='Review')t.minutes=35;}
  }
  // Completing weekday mock analysis takes priority over new material.
  const previous=mockList.find(x=>x.date===shift(date,-1)&&!x.optional);
  if(previous&&!weekend){
   title='Finish '+previous.name+' analysis';kind='analysis';
   tasks=[task(date,'analysis','Analysis','Finish '+previous.name+' analysis',early?60:90,'Retry before reading solutions. Identify easy marks lost and compare your chosen passages/sets with alternatives.',links.bookmarks),task(date,'varc','VARC',r.v,early?35:40,'Use the most important RC mistake. Explain the author’s point and evidence in simple English.',links.rc),task(date,'repair','Review','Repair one DILR or Quant gap',early?30:35,'Choose the largest recoverable error from the mock. Complete the learning step, not a new-topic quota.',links.bookmarks),task(date,'log','Review','Log three changes; schedule reattempts',10,'Put selected errors in the +2/+7-day review queue in your notebook.',links.bookmarks)];
  }
  if(date==='2026-11-22'){title='Final analysis and strategy';kind='analysis';tasks=tasks.map(t=>({...t,detail:'Complete the final test review, prepare short notes and freeze your strategy. No new chapter.'}));}
 }
 if(opt){note='Optional mock available: replace today’s blocks with 120 min test + 60 min analysis only if prior reviews are complete and core learning is on track. Replace tomorrow’s first 90 min with remaining analysis.';}
 const minutes=tasks.filter(t=>!t.optional).reduce((n,t)=>n+t.minutes,0);
 days.push({date,weekend,phase,kind,title,note,tasks,minutes,optionalMock:opt?.id||null});
}
const data={version:1,updated:'2026-09-26',examDate:'2026-11-29',startDate:'2026-09-26',links,days,mocks:mockList,sectionals};
fs.writeFileSync(new URL('../plan.js', import.meta.url),'export const PLAN = '+JSON.stringify(data,null,2)+';\n');
console.log(JSON.stringify({days:days.length,requiredMocks:mockList.filter(m=>!m.optional).length,optionalMocks:mockList.filter(m=>m.optional).length,sectionals:sectionals.length,plannedHours:days.reduce((s,d)=>s+d.minutes,0)/60,maxWeekday:Math.max(...days.filter(d=>!d.weekend).map(d=>d.minutes)),maxWeekend:Math.max(...days.filter(d=>d.weekend).map(d=>d.minutes))},null,2));
