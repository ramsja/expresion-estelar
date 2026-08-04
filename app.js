// CONFIGURACIÓN DE SUPABASE
// Reemplaza estas credenciales con las de tu proyecto de Supabase
const SUPABASE_URL = 'https://dxjzcgqkehdhasofbmgy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4anpjZ3FrZWhkaGFzb2ZibWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NTU2NzUsImV4cCI6MjEwMTQzMTY3NX0.12R9TNy04U5ihFZp5B5cYVrPKIfqt3duCvjwfzJrE44';

let supabaseClient = null;
if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'https://your-project-id.supabase.co') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Helper de LocalStorage para pruebas locales si Supabase no está configurado
const getLocalTestimonials = () => {
  try {
    return JSON.parse(localStorage.getItem('expresion_estelar_testimonials')) || [];
  } catch (e) {
    return [];
  }
};

const saveLocalTestimonial = (item) => {
  const list = getLocalTestimonials();
  list.unshift(item);
  localStorage.setItem('expresion_estelar_testimonials', JSON.stringify(list));
};

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
  $('#whatsapp-link').href=wa(d.contact.defaultMessage);makeDays();bindServices();fetchTestimonials();
}
function bindServices(){$$('.service-toggle').forEach(btn=>btn.onclick=()=>{const detail=btn.parentElement.querySelector('.service-detail');const open=detail.hidden;detail.hidden=!open;btn.textContent=open?'−':'＋';btn.setAttribute('aria-expanded',open)})}
function makeDays(){const select=$('#day-select');select.innerHTML='<option value="">Día</option>';let date=new Date(),added=0;while(added<15){date.setDate(date.getDate()+1);if(date.getDay()>0&&date.getDay()<6){const label=new Intl.DateTimeFormat('es-ES',{weekday:'long',day:'numeric',month:'long'}).format(date);select.add(new Option(label.charAt(0).toUpperCase()+label.slice(1),label));added++}}}
function wa(message){return `https://wa.me/${siteData.contact.whatsapp}?text=${encodeURIComponent(message)}`}
$('#bio-toggle').onclick=()=>{const b=$('#bio-copy');b.hidden=!b.hidden;$('#bio-toggle span').textContent=b.hidden?'＋':'−'};
$('#testimonial-toggle').onclick=()=>{const f=$('#testimonial-form');f.hidden=!f.hidden;$('#testimonial-toggle span').textContent=f.hidden?'＋':'−'};
$('#booking-form').onsubmit=e=>{e.preventDefault();const x=Object.fromEntries(new FormData(e.target));window.open(wa(`Hola Rebeca, soy ${x.name}. Me gustaría reservar una sesión de ${x.service}. Mi horario preferido es el ${x.day} a las ${x.time}.`),'_blank')};
$('#testimonial-form').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  
  const x = Object.fromEntries(new FormData(form));
  const ratingValue = parseInt(x.rating) || 5;
  const testimonial = {
    name: x.name,
    country: x.country || '',
    message: x.message,
    rating: ratingValue,
    created_at: new Date().toISOString()
  };
  
  try {
    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('testimonials')
        .insert([testimonial]);
      
      if (error) throw error;
    } else {
      saveLocalTestimonial(testimonial);
    }
    
    form.reset();
    form.hidden = true;
    $('#testimonial-toggle span').textContent = '＋';
    
    const successMsg = $('#testimonial-success');
    successMsg.textContent = supabaseClient 
      ? '¡Gracias! Tu testimonio ha sido guardado y publicado en la página.' 
      : '¡Gracias! Tu testimonio ha sido guardado localmente (configura Supabase para compartirlo).';
    successMsg.style.display = 'block';
    
    setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
    fetchTestimonials();
  } catch (err) {
    console.error("Error al guardar el testimonio:", err);
    alert("Hubo un error al guardar tu testimonio. Por favor, intenta de nuevo.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
};
$('.menu-button').onclick=()=>{const n=$('.nav nav');n.classList.toggle('open');$('.menu-button').setAttribute('aria-expanded',n.classList.contains('open'))};
$('#year').textContent=new Date().getFullYear();

async function fetchTestimonials() {
  const grid = $('#testimonials-grid');
  const status = $('#testimonials-status');
  if (!grid) return;
  try {
    let list = [];
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      list = data || [];
    } else {
      list = getLocalTestimonials();
      console.warn("Usando almacenamiento local (localStorage) para testimonios. Configura SUPABASE_URL y SUPABASE_ANON_KEY en app.js para conectar con la base de datos.");
    }
    renderTestimonials(list);
  } catch (err) {
    console.error("Error al cargar testimonios:", err);
    status.textContent = "No se pudieron cargar los testimonios. Mostrando testimonios locales.";
    renderTestimonials(getLocalTestimonials());
  }
}

function renderTestimonials(list) {
  const grid = $('#testimonials-grid');
  const status = $('#testimonials-status');
  if (list.length === 0) {
    status.textContent = "Sé el primero en compartir tu experiencia.";
    grid.innerHTML = '';
    return;
  }
  status.style.display = 'none';
  grid.innerHTML = list.map(item => {
    const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
    const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : 'Reciente';
    return `
      <div class="testimonial-card">
        <div>
          <div class="testimonial-rating">${stars}</div>
          <p class="testimonial-text">"${escapeHtml(item.message)}"</p>
        </div>
        <div class="testimonial-meta">
          <div>
            <span class="testimonial-author">${escapeHtml(item.name)}</span>
            ${item.country ? `<span class="testimonial-country">· ${escapeHtml(item.country)}</span>` : ''}
          </div>
          <span class="testimonial-date">${dateStr}</span>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
