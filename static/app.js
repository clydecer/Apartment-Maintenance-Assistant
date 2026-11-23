const $ = id => document.getElementById(id);
const categories = ['Plumbing','Electrical','HVAC','Appliance','Doors/Locks','Pest Control','Structural','General Maintenance','Undetermined'];
const priorities = ['Low','Normal','High','Urgent','Undetermined'];
for (const [id, list] of [['category',categories],['priority',priorities]]) for (const x of list) $(id).add(new Option(x,x));
let seq = 0, current = null;
const riskPattern = /\b(sparks?|smell(?:s|ing)? (?:of )?gas|gas smell|flooding)\b/i;
function status(s) { $('status').textContent = s; }
function clearReview() { current = null; $('review').hidden = true; $('candidate').replaceChildren(); $('confirmation').textContent = ''; }
function updateRisk() { $('risk').hidden = !riskPattern.test($('description').value); }
$('description').addEventListener('input', () => { seq++; clearReview(); $('error').textContent=''; status('Draft'); $('count').textContent = `${$('description').value.length.toLocaleString()} / 2,000 characters`; updateRisk(); $('analyze').disabled=false; });
$('reset').onclick = () => { $('description').value=''; $('description').dispatchEvent(new Event('input')); $('description').focus(); };
function addText(parent, tag, text) { const el=document.createElement(tag); el.textContent=text; parent.appendChild(el); return el; }
function showReview(candidate) {
  current = candidate;
  const box=$('candidate'); box.replaceChildren();
  if (candidate) {
    addText(box,'h3','AI suggestion');
    addText(box,'p',`Category: ${candidate.category} — ${candidate.category_reason}`);
    addText(box,'p',`Source: “${candidate.category_excerpt}”`);
    addText(box,'p',`Priority: ${candidate.priority} — ${candidate.priority_reason}`);
    addText(box,'p',`Source: “${candidate.priority_excerpt}”`);
    addText(box,'p',`Missing information: ${candidate.missing_information.join('; ') || 'None identified'}`);
    addText(box,'p',`Follow-up questions: ${candidate.follow_up_questions.join(' ') || 'None suggested'}`);
    if (candidate.uncertainty_note) addText(box,'p',`Uncertainty: ${candidate.uncertainty_note}`);
  } else addText(box,'p','Manual review: no AI suggestion is available.');
  $('category').value=candidate?.category || 'Undetermined'; $('priority').value=candidate?.priority || 'Undetermined';
  $('reason').value=candidate ? `${candidate.category_reason} ${candidate.priority_reason}` : ''; $('next').value=''; $('confirmation').textContent=''; $('review').hidden=false;
}
$('analyze').onclick = async () => {
  const description=$('description').value.trim(); if (!description || description.length>2000) { $('error').textContent='Enter a request of 1–2,000 characters.'; return; }
  const id=++seq; clearReview(); $('error').textContent=''; status('Analyzing'); $('analyze').disabled=true;
  try {
    const response=await fetch('/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({description})});
    const data=await response.json(); if(id!==seq) return;
    if(!response.ok) throw new Error(data.error || 'Analysis failed.');
    if(data.error) { status('Analysis failed'); $('error').textContent=data.error; showReview(null); }
    else { status('Needs review'); showReview(data.candidate); }
  } catch(e) { if(id!==seq) return; status('Analysis failed'); $('error').textContent='Unable to reach the local application. Continue with manual review.'; showReview(null); }
  finally { if(id===seq) $('analyze').disabled=false; }
};
$('confirm').onclick=()=>{status('Reviewed'); $('confirmation').textContent=`Review confirmed: ${$('category').value} / ${$('priority').value}. No assignment or notification was sent.`;};
for (const id of ['category','priority','reason','next']) $(id).addEventListener('input',()=>{if($('status').textContent==='Reviewed'){status('Needs review'); $('confirmation').textContent='Changes require confirmation again.';}});
