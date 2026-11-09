const TIERS=[[600,999,1.60],[1000,1999,1.45],[2000,3499,1.32],[3500,4999,1.24],[5000,7000,1.18]];
const CAP=19200, BAGS=320, MAIL='lorenz@sortengold.de';
const eur=n=>n.toLocaleString('de-DE',{style:'currency',currency:'EUR',minimumFractionDigits:2});
const eur0=n=>n.toLocaleString('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const rateFor=kg=>{for(const[a,b,r]of TIERS){if(kg>=a&&kg<=b)return r;}return null;};

// ladder table
document.getElementById('ladder').innerHTML=TIERS.map(([a,b,r])=>
  `<tr data-lo="${a}" data-hi="${b}"><td>${a.toLocaleString('de-DE')} – ${b.toLocaleString('de-DE')} kg</td>
   <td class="r">${r.toFixed(2).replace('.',',')}</td>
   <td class="r">${(r-0.08).toFixed(2).replace('.',',')}</td>
   <td class="r">${(r-0.15).toFixed(2).replace('.',',')}</td></tr>`).join('');

// tally
const tally=document.getElementById('tally');
tally.innerHTML=Array.from({length:BAGS},()=>'<i></i>').join('');
const ticks=[...tally.children];

const vol=document.getElementById('vol');
function render(){
  const kg=Math.max(0,Math.min(CAP,Number(vol.value)||0));
  const bags=Math.round(kg/60);
  ticks.forEach((t,i)=>{t.className=i<bags?(i===bags-1?'on edge':'on'):'';});
  document.getElementById('bagcount').textContent=`${bags} von ${BAGS} Sack`;

  const r=rateFor(kg), ro=document.getElementById('ro-rate');
  if(!r){
    document.getElementById('rate').textContent='–';
    document.getElementById('tier').textContent=kg<600?'Minimum 600 kg':'über 7.000 kg — auf Anfrage';
    ro.classList.add('alert');
    document.getElementById('total').textContent='–';
    document.getElementById('dep').textContent='–';
    return;
  }
  ro.classList.remove('alert');
  document.getElementById('rate').textContent=r.toFixed(2).replace('.',',')+' €/kg';
  document.getElementById('tier').textContent=`${(r-0.15).toFixed(2).replace('.',',')} bei vollem Container`;
  document.getElementById('total').textContent=eur0(kg*r);
  document.getElementById('dep').textContent=eur0(kg*r*0.3);

  [...document.querySelectorAll('#ladder tr')].forEach(tr=>{
    tr.classList.toggle('hl',kg>=+tr.dataset.lo&&kg<=+tr.dataset.hi);
  });
}
vol.addEventListener('input',render);
render();

// form → Netlify, mailto als Fallback
const form=document.getElementById('booking');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const g=id=>document.getElementById(id).value.trim();
  const msg=document.getElementById('msg');
  msg.classList.remove('ok');
  const kg=Number(g('menge'));
  if(!g('firma')||!g('name')||!g('mail')||!kg||!document.getElementById('ack').checked){
    msg.textContent='Bitte Firma, Ansprechpartner, E-Mail, Menge und die Bestätigung ausfüllen.';
    msg.classList.add('show');return;
  }
  if(kg<600||kg>7000){
    msg.textContent='Menge zwischen 600 und 7.000 kg. Größere Mengen bitte über eine kurze Mail.';
    msg.classList.add('show');return;
  }
  const r=rateFor(kg);
  document.getElementById('h-rate').value=r.toFixed(2).replace('.',',')+' €/kg (vorläufig)';
  document.getElementById('h-total').value=eur(kg*r);
  document.getElementById('h-dep').value=eur(kg*r*0.3);
  document.getElementById('h-sack').value=Math.round(kg/60);

  const btn=form.querySelector('button[type=submit]');
  btn.disabled=true;
  fetch('/',{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams(new FormData(form)).toString()
  }).then(res=>{
    if(!res.ok)throw new Error('submit failed');
    msg.classList.add('ok');
    msg.textContent='Anmeldung eingegangen. Du bekommst innerhalb von zwei Werktagen eine Bestätigung mit deiner Rate.';
    msg.classList.add('show');
    form.reset();
    btn.disabled=false;
  }).catch(()=>{
    btn.disabled=false;
    const body=[
      'Anmeldung Sammelcontainer — Run UG-GER-2026-09','',
      'Rösterei: '+g('firma'),'Ansprechpartner: '+g('name'),
      'E-Mail: '+g('mail'),'Telefon: '+(g('tel')||'—'),'',
      'Menge: '+kg.toLocaleString('de-DE')+' kg ('+Math.round(kg/60)+' Sack)',
      'Rate laut Staffel (vorläufig): '+r.toFixed(2).replace('.',',')+' €/kg',
      'Logistik gesamt: '+eur(kg*r),
      'Anzahlung 30%: '+eur(kg*r*0.3),'',
      'Anlieferung: '+g('pack'),'Eigene Jutesäcke: '+g('jute'),
      'Lieferant: '+(g('lief')||'—'),'Lot: '+(g('lot')||'—'),'',
      'Anmerkungen: '+(g('notes')||'—'),'',
      'Bedingungen bestätigt: ja (Mindestvolumen 10.000 kg, Raten vorläufig, Zoll/EUSt/Cess/Versicherung nicht enthalten)'
    ].join('\n');
    window.location.href='mailto:'+MAIL+'?subject='+encodeURIComponent('Anmeldung Sammelcontainer — '+g('firma')+' — '+kg+' kg')+'&body='+encodeURIComponent(body);
    msg.textContent='Direktversand fehlgeschlagen — dein Mailprogramm öffnet sich mit der fertigen Anmeldung. Falls nicht: schick die Angaben an '+MAIL+'.';
    msg.classList.add('show');
  });
});
