let siteData;
const $=(s,p=document)=>p.querySelector(s);const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const paragraphs=(items)=>items.map(x=>`<p>${x}</p>`).join('');

fetch('site-data.json').then(r=>r.json()).then(data=>{siteData=data;render(data)}).catch(()=>alert('No se pudo cargar el contenido del sitio.'));

function render(d){
  document.title=d.brand;
  $('#hero-quote').textContent=`“${d.heroQuote}”`;
  $('#about-title').textContent=d.aboutTitle;$('#about-copy').innerHTML=paragraphs(d.about);
  $('#person-name').textContent=d.person.name;$('#short-bio').textContent=d.person.shortBio;$('#bio-copy').innerHTML=paragraphs(d.person.bio);
  $('#services-list').innerHTML=d.services.map((s,i)=>`<article class="service"><div class="service-icon">${s.icon}</div><h3>${s.title}</h3><div class="service-summary"><strong>${s.lead}</strong>${s.format}</div><button class="service-toggle" aria-label="Ver detalles" aria-expanded="false">＋</button><div class="service-detail" hidden><p>${s.description}</p><div><small>${s.format}</small><ul class="prices">${s.prices.map(p=>`<li>${p}</li>`).join('')}</ul></div></div></article>`).join('');
  $('#service-select').insertAdjacentHTML('beforeend',d.services.map(s=>`<option>${s.title}</option>`).join(''));
  $('#schedule-days').textContent=d.schedule.days;$('#schedule-times').textContent=d.schedule.times.join(' · ');
  $('#time-select').innerHTML='<option value="">Hora</option>'+d.schedule.times.map(t=>`<option>${t}</option>`).join('');
  $('#whatsapp-link').href=wa(d.contact.defaultMessage);makeDays();bindServices();
}
function bindServices(){$$('.service-toggle').forEach(btn=>btn.onclick=()=>{const detail=btn.parentElement.querySelector('.service-detail');const open=detail.hidden;detail.hidden=!open;btn.textContent=open?'−':'＋';btn.setAttribute('aria-expanded',open)})}
function makeDays(){const select=$('#day-select');select.innerHTML='<option value="">Día</option>';let date=new Date(),added=0;while(added<15){date.setDate(date.getDate()+1);if(date.getDay()>0&&date.getDay()<6){const label=new Intl.DateTimeFormat('es-ES',{weekday:'long',day:'numeric',month:'long'}).format(date);select.add(new Option(label.charAt(0).toUpperCase()+label.slice(1),label));added++}}}
function wa(message){return `https://wa.me/${siteData.contact.whatsapp}?text=${encodeURIComponent(message)}`}
$('#bio-toggle').onclick=()=>{const b=$('#bio-copy');b.hidden=!b.hidden;$('#bio-toggle span').textContent=b.hidden?'＋':'−'};
$('#testimonial-toggle').onclick=()=>{const f=$('#testimonial-form');f.hidden=!f.hidden;$('#testimonial-toggle span').textContent=f.hidden?'＋':'−'};
$('#booking-form').onsubmit=e=>{e.preventDefault();const x=Object.fromEntries(new FormData(e.target));window.open(wa(`Hola Rebeca, soy ${x.name}. Me gustaría reservar una sesión de ${x.service}. Mi horario preferido es el ${x.day} a las ${x.time}.`),'_blank')};
$('#testimonial-form').onsubmit=e=>{e.preventDefault();const x=Object.fromEntries(new FormData(e.target));window.open(wa(`Hola Rebeca, soy ${x.name} de ${x.country}. Quiero compartir mi experiencia (${x.rating}): ${x.message}`),'_blank')};
$('.menu-button').onclick=()=>{const n=$('.nav nav');n.classList.toggle('open');$('.menu-button').setAttribute('aria-expanded',n.classList.contains('open'))};
$('#year').textContent=new Date().getFullYear();
