const KEY='kv_chars_v1';
const S=(n,u,l)=>({label:n,url:u,level:l||'belum'});
const AL=n=>S('AniList – cari "'+n+'"','https://anilist.co/search/characters?search='+encodeURIComponent(n),'wiki');
const MAL=n=>S('MyAnimeList – cari "'+n+'"','https://myanimelist.net/character.php?q='+encodeURIComponent(n),'wiki');
const seed=[
['Naruto Uzumaki','Naruto','anime','Protagonis',1,'Karakter utama seri Naruto.',98],
['Sasuke Uchiha','Naruto','anime','Antagonis',1,'Karakter utama lain dalam seri Naruto, rival Naruto.',95],
['Monkey D. Luffy','One Piece','anime','Protagonis',1,'Karakter utama One Piece, kapten Bajak Laut Topi Jerami.',97],
['Light Yagami','Death Note','anime','Protagonis',1,'Karakter utama Death Note.',92],
['Eren Yeager','Shingeki no Kyojin','anime','Protagonis',1,'Karakter utama Shingeki no Kyojin (Attack on Titan).',93],
['Levi Ackerman','Shingeki no Kyojin','anime','Pendukung',0,'Karakter pendukung populer di Shingeki no Kyojin.',94],
['Tanjiro Kamado','Kimetsu no Yaiba','anime','Protagonis',1,'Karakter utama Kimetsu no Yaiba (Demon Slayer).',91],
['Satoru Gojo','Jujutsu Kaisen','anime','Pendukung',0,'Karakter pendukung populer di Jujutsu Kaisen.',96],
['Xiao Yan','Battle Through the Heavens (Doupo Cangqiong)','donghua','Protagonis',1,'Karakter utama Battle Through the Heavens.',90],
['Tang San','Soul Land (Douluo Dalu)','donghua','Protagonis',1,'Karakter utama Soul Land.',89],
['Wang Lin','Renegade Immortal (Xian Ni)','donghua','Protagonis',1,'Karakter utama Renegade Immortal.',86],
['Xie Lian','Heaven Official’s Blessing (Tian Guan Ci Fu)','donghua','Protagonis',1,'Karakter utama Heaven Official’s Blessing.',88],
['Hua Cheng','Heaven Official’s Blessing (Tian Guan Ci Fu)','donghua','Pendukung',0,'Karakter pendukung utama Heaven Official’s Blessing.',90]
].map((a,i)=>({id:'s'+i,name:a[0],alt:'',series:a[1],type:a[2],role:a[3],main:!!a[4],gender:'',age:'',bday:'',height:'',status:'',summary:a[5],personality:'',background:'',abilities:'',relations:'',img:'',pop:a[6],added:i,src:[AL(a[0]),MAL(a[0])],al:0}));
let D;try{D=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(!D||!D.length)D=seed;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}};
const $=s=>document.querySelector(s),app=$('#app'),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const go=h=>{location.hash=h};const na='<span class="na">Data belum tersedia</span>';
const val=v=>v?esc(v):na;
const img=c=>c.img?`<img src="${esc(c.img)}" alt="${esc(c.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.textContent='${esc(c.name[0])}'">`:esc(c.name[0]);
const card=c=>`<div class="card" onclick="go('karakter/${c.id}')"><div class="ph">${img(c)}</div><div class="t"><b>${esc(c.name)}</b><span class="tag">${c.type=='anime'?'Anime':'Donghua'}</span><div class="note">${esc(c.series)}</div></div></div>`;
const works=()=>{const m={};D.forEach(c=>{(m[c.series]=m[c.series]||{n:0,t:c.type}).n++});return Object.entries(m).sort((a,b)=>b[1].n-a[1].n)};
function find(t){t=t.toLowerCase().trim();if(!t)return[];return D.filter(c=>(c.name+' '+c.alt+' '+c.series).toLowerCase().includes(t)).sort((a,b)=>b.pop-a.pop)}
/* autocomplete */
const q=$('#q'),ac=$('#ac');
q.oninput=()=>{const r=find(q.value).slice(0,6);ac.style.display=r.length?'block':'none';ac.innerHTML=r.map(c=>`<div data-id="${c.id}">${esc(c.name)} <small>· ${esc(c.series)}</small></div>`).join('')};
ac.onclick=e=>{const d=e.target.closest('[data-id]');if(d){ac.style.display='none';q.value='';go('karakter/'+d.dataset.id)}};
q.onkeydown=e=>{if(e.key=='Enter'&&q.value.trim()){ac.style.display='none';go('cari/'+encodeURIComponent(q.value.trim()))}};
document.onclick=e=>{if(!e.target.closest('.sb'))ac.style.display='none'};
/* views */
function home(){const pop=[...D].sort((a,b)=>b.pop-a.pop).slice(0,6),neu=[...D].sort((a,b)=>b.added-a.added).slice(0,6);
app.innerHTML=`<h1>Ensiklopedia karakter <span style="color:var(--ac)">anime &amp; donghua</span></h1><p class="mu">Profil karakter dengan sumber referensi yang dapat diverifikasi. Informasi yang belum tersedia ditandai jelas, tidak dikarang.</p>
<div class="row"><button class="btn p" onclick="go('jelajah/anime')">Anime Jepang</button><button class="btn p" onclick="go('jelajah/donghua')">Donghua Tiongkok</button></div>
<h2>Karakter populer</h2><div class="grid">${pop.map(card).join('')}</div>
<h2>Terbaru ditambahkan</h2><div class="grid">${neu.map(card).join('')}</div>
<h2>Karya populer</h2><div class="row">${works().slice(0,12).map(([s,v])=>`<button class="chip" onclick="go('cari/'+encodeURIComponent(${JSON.stringify(s)}))">${esc(s)} (${v.n})</button>`).join('')}</div>`}
let F={type:'',role:'',sort:'pop',page:1};const PER=8;
function browse(t,term){if(t!==undefined)F.type=t;let list=term!==undefined?find(term):D.filter(c=>!F.type||c.type==F.type);
if(F.role=='utama')list=list.filter(c=>c.main);else if(F.role=='populer')list=list.filter(c=>c.pop>=90);else if(F.role)list=list.filter(c=>c.role==F.role);
list=[...list].sort((a,b)=>F.sort=='nama'?a.name.localeCompare(b.name):b.pop-a.pop);
const n=Math.min(list.length,F.page*PER);const roles=[['','Semua'],['utama','Karakter utama'],['Pendukung','Pendukung'],['Antagonis','Antagonis'],['Protagonis','Protagonis'],['populer','Populer']];
const title=term!==undefined?`Hasil untuk “${esc(term)}”`:F.type=='anime'?'Anime Jepang':F.type=='donghua'?'Donghua Tiongkok':'Semua karakter';
app.innerHTML=`<h1>${title}</h1><div class="row">${roles.map(r=>`<button class="chip ${F.role==r[0]?'on':''}" data-r="${r[0]}">${r[1]}</button>`).join('')}<select id="so" style="width:auto"><option value="pop">Urut: Popularitas</option><option value="nama" ${F.sort=='nama'?'selected':''}>Urut: Nama</option></select></div>
${list.length?`<div class="grid">${list.slice(0,n).map(card).join('')}</div>`:'<p class="mu">Tidak ada karakter yang cocok.</p>'}
${n<list.length?'<div class="row" style="justify-content:center"><button class="btn p" id="more">Muat lebih banyak</button></div>':''}<p class="note">${list.length} karakter</p>`;
app.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{F.role=b.dataset.r;F.page=1;browse(undefined,term)});
$('#so').onchange=e=>{F.sort=e.target.value;browse(undefined,term)};const m=$('#more');if(m)m.onclick=()=>{F.page++;browse(undefined,term)}}
const LV={resmi:'Resmi',wiki:'Wiki komunitas',belum:'Belum dikonfirmasi'};
function profile(id){const c=D.find(x=>x.id==id);if(!c){app.innerHTML='<h1>Karakter tidak ditemukan</h1>';return}
const sec=(h,v)=>`<div class="box"><h2 style="margin-top:0">${h}</h2><p style="white-space:pre-line;margin:0">${val(v)}</p></div>`;
app.innerHTML=`<p><a href="#" onclick="history.back();return false">← Kembali</a></p><h1 style="margin-top:8px">${esc(c.name)}</h1><div class="pf"><div><div class="box" style="padding:0;overflow:hidden"><div class="ph">${img(c)}</div></div>${c.img?'<p class="note">Gambar dari AniList; hak cipta milik pemilik karakter.</p>':'<p class="note">Gambar belum tersedia. Gunakan “Sinkronkan AniList” saat situs di-deploy.</p>'}
<div class="box"><table><tr><td>Nama alternatif</td><td>${val(c.alt)}</td></tr><tr><td>Jenis kelamin</td><td>${val(c.gender)}</td></tr><tr><td>Usia</td><td>${val(c.age)}</td></tr><tr><td>Tanggal lahir</td><td>${val(c.bday)}</td></tr><tr><td>Tinggi badan</td><td>${val(c.height)}</td></tr><tr><td>Asal</td><td>${esc(c.series)} (${c.type=='anime'?'Anime':'Donghua'})</td></tr><tr><td>Peran</td><td>${esc(c.role)}${c.main?' · utama':''}</td></tr><tr><td>Status</td><td>${val(c.status)}</td></tr></table></div></div>
<div>${sec('Deskripsi singkat',c.summary)}${sec('Kepribadian',c.personality)}${sec('Latar belakang &amp; sejarah',c.background)}${sec('Kemampuan &amp; kekuatan',c.abilities)}${sec('Hubungan dengan karakter lain',c.relations)}
<div class="box"><h2 style="margin-top:0">Referensi</h2>${c.src.length?'<ul>'+c.src.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a> <span class="tag">${LV[s.level]||LV.belum}</span></li>`).join('')+'</ul>':na}
<div class="row"><button class="btn p" id="sync">Sinkronkan dari AniList</button></div><p class="note" id="sm">Mengambil gambar, deskripsi, dan data lahir dari AniList API (hanya berjalan saat situs di-deploy, mis. GitHub Pages).</p></div></div></div>`;
$('#sync').onclick=()=>sync(c)}
async function sync(c){const m=$('#sm');m.textContent='Mengambil data…';
try{const r=await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:'query($s:String){Character(search:$s){name{full alternative}image{large}description(asHtml:false)gender age dateOfBirth{year month day}siteUrl favourites}}}',variables:{s:c.name}})});
const j=await r.json();const x=j.data&&j.data.Character;if(!x)throw 0;
c.img=x.image&&x.image.large||c.img;c.alt=(x.name.alternative||[]).join(', ')||c.alt;c.gender=x.gender||c.gender;c.age=x.age||c.age;
const d=x.dateOfBirth;if(d&&d.month)c.bday=d.day+'/'+d.month+(d.year?'/'+d.year:'');
if(x.description)c.background=x.description.replace(/<[^>]+>|~!|!~/g,'').slice(0,1500)+'\n(Sumber: AniList; dapat memuat spoiler.)';
c.src=c.src.filter(s=>!s.label.startsWith('AniList'));c.src.unshift(S('AniList – halaman karakter',x.siteUrl,'wiki'));save();profile(c.id)}
catch(e){m.textContent='Gagal mengambil data (kemungkinan diblokir di pratinjau ini, atau karakter tidak ditemukan). Coba saat sudah di-deploy.'}}
/* admin */
function admin(id){const c=id&&D.find(x=>x.id==id)||{id:'',name:'',alt:'',series:'',type:'anime',role:'Protagonis',main:false,gender:'',age:'',bday:'',height:'',status:'',summary:'',personality:'',background:'',abilities:'',relations:'',img:'',pop:50,src:[]};
const f=(k,l,ta)=>`<label>${l}</label>${ta?`<textarea id="f_${k}" rows="3">${esc(c[k])}</textarea>`:`<input id="f_${k}" value="${esc(c[k])}">`}`;
app.innerHTML=`<h1>Admin</h1><p class="note">Data disimpan di peramban ini (localStorage). Untuk produksi, hubungkan ke backend/database dan tambahkan autentikasi.</p>
<div class="box"><h2 style="margin-top:0">Daftar karakter</h2>${D.map(x=>`<div class="row" style="align-items:center;margin:4px 0"><span style="flex:1">${esc(x.name)} <small class="mu">· ${esc(x.series)}</small></span><button class="chip" data-e="${x.id}">Edit</button><button class="chip" data-d="${x.id}">Hapus</button></div>`).join('')}
<div class="row"><button class="btn p" id="bulk">Sinkronkan semua dari AniList</button><button class="btn" id="exp">Ekspor JSON</button><button class="btn" id="rst">Reset ke data awal</button></div><p class="note" id="bs">Mengambil gambar, deskripsi, dan tanggal lahir semua karakter dari AniList (butuh internet; berjalan saat situs di-deploy).</p></div>
<div class="box"><h2 style="margin-top:0">${c.id?'Edit':'Tambah'} karakter</h2>${f('name','Nama lengkap')}${f('alt','Nama alternatif')}${f('series','Asal anime/donghua')}
<label>Kategori</label><select id="f_type"><option value="anime" ${c.type=='anime'?'selected':''}>Anime Jepang</option><option value="donghua" ${c.type=='donghua'?'selected':''}>Donghua Tiongkok</option></select>
<label>Peran</label><select id="f_role">${['Protagonis','Antagonis','Pendukung'].map(r=>`<option ${c.role==r?'selected':''}>${r}</option>`).join('')}</select>
<label><input type="checkbox" id="f_main" style="width:auto" ${c.main?'checked':''}> Karakter utama</label>${f('gender','Jenis kelamin')}${f('age','Usia')}${f('bday','Tanggal lahir')}${f('height','Tinggi badan')}${f('status','Status')}
<label>Popularitas (0–100)</label><input id="f_pop" type="number" value="${c.pop}">
<label>Gambar (unggah atau tempel URL)</label><input type="file" id="f_file" accept="image/*"><input id="f_img" placeholder="https://…" value="${esc(c.img.startsWith('data:')?'':c.img)}" style="margin-top:6px">
${f('summary','Deskripsi singkat',1)}${f('personality','Kepribadian',1)}${f('background','Latar belakang &amp; sejarah',1)}${f('abilities','Kemampuan &amp; kekuatan',1)}${f('relations','Hubungan',1)}
<label>Sumber (satu per baris: Label | URL | resmi/wiki/belum)</label><textarea id="f_src" rows="4">${esc(c.src.map(s=>[s.label,s.url,s.level].join(' | ')).join('\n'))}</textarea>
<div class="row"><button class="btn p" id="sv">Simpan</button></div></div>`;
app.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{admin(b.dataset.e);scrollTo(0,document.body.scrollHeight)});
app.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{if(confirm('Hapus karakter ini?')){D=D.filter(x=>x.id!=b.dataset.d);save();admin()}});
$('#bulk').onclick=bulk;$('#exp').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(D,null,1)],{type:'application/json'}));a.download='karakterverse.json';a.click()};
$('#rst').onclick=()=>{if(confirm('Reset semua data?')){D=seed;save();admin()}};
let up='';$('#f_file').onchange=e=>{const fl=e.target.files[0];if(!fl)return;if(fl.size>400000){alert('Maks 400 KB');e.target.value='';return}const r=new FileReader();r.onload=()=>up=r.result;r.readAsDataURL(fl)};
$('#sv').onclick=()=>{const g=k=>$('#f_'+k).value.trim();if(!g('name')||!g('series')){alert('Nama dan asal wajib diisi');return}
const o=Object.assign(c,{id:c.id||'c'+Date.now(),added:c.id?c.added:Date.now(),main:$('#f_main').checked,type:g('type'),role:g('role'),pop:+g('pop')||0});
['name','alt','series','gender','age','bday','height','status','summary','personality','background','abilities','relations'].forEach(k=>o[k]=g(k));
o.img=up||g('img');o.src=g('src').split('\n').map(l=>l.split('|').map(x=>x.trim())).filter(p=>p[1]).map(p=>({label:p[0]||p[1],url:p[1],level:['resmi','wiki'].includes(p[2])?p[2]:'belum'}));
if(!D.includes(o))D.push(o);save();go('karakter/'+o.id)}}
/* router */
function route(keep){const[p,a]=decodeURIComponent(location.hash.slice(1)).split(/\/(.*)/s);if(keep&&p=='admin')return;if(!keep){F.page=1;if(p!='jelajah'&&p!='cari')F.role='';scrollTo(0,0)}
if(!p)home();else if(p=='karakter')profile(a);else if(p=='jelajah')browse(a,undefined);else if(p=='cari')browse('',a);else if(p=='admin')admin();else home()}
addEventListener('hashchange',()=>route());route();

/* sinkronisasi massal AniList */
async function fetchAL(c){
  const r=await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:'query($s:String){Character(search:$s){name{full alternative}image{large}description(asHtml:false)gender age dateOfBirth{year month day}siteUrl}}}',variables:{s:c.name}})});
  if(r.status==429)throw new Error('limit');
  const x=(await r.json()).data?.Character;if(!x)return false;
  c.img=x.image?.large||c.img;c.alt=(x.name.alternative||[]).join(', ')||c.alt;c.gender=x.gender||c.gender;c.age=x.age||c.age;
  const d=x.dateOfBirth;if(d&&d.month)c.bday=d.day+'/'+d.month+(d.year?'/'+d.year:'');
  if(x.description&&!c.background)c.background=x.description.replace(/<[^>]+>|~!|!~/g,'').slice(0,1500)+'\n(Sumber: AniList; dapat memuat spoiler.)';
  c.src=c.src.filter(s=>!s.label.startsWith('AniList'));c.src.unshift(S('AniList – halaman karakter',x.siteUrl,'wiki'));
  return true}
async function bulk(){
  const m=$('#bs');let ok=0,miss=0;
  for(let i=0;i<D.length;i++){
    m.textContent='Menyinkronkan '+(i+1)+'/'+D.length+': '+D[i].name+'…';
    try{(await fetchAL(D[i]))?ok++:miss++;save()}
    catch(e){m.textContent=e.message=='limit'?'Dibatasi AniList (rate limit). Coba lagi 1 menit lagi. Berhasil: '+ok:'Gagal terhubung ke AniList (cek internet, atau situs belum di-deploy). Berhasil: '+ok;return}
    await new Promise(r=>setTimeout(r,900))}
  m.textContent='Selesai: '+ok+' berhasil, '+miss+' tidak ditemukan.'}

/* sinkron otomatis: gambar & data diambil dari AniList saat situs dibuka */
(async function auto(){
  for(const c of D.filter(x=>!x.img&&!x.tried)){
    try{await fetchAL(c);c.tried=1;save();route(true)}catch(e){return}
    await new Promise(r=>setTimeout(r,900))}
})();
