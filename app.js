
const C=window.SURVEY_LOGIC;
const companions={
 coti:{name:"Coti",icon:"🦝"},kunu:{name:"Kunu",icon:"🐒"},
 arami:{name:"Arami",icon:"🦜"},yma:{name:"Yma",icon:"🦉"},yampi:{name:"Yampi",icon:"🦊"}
};
const evo={
 coti:[["Coti joven","🎒"],["Coti exploradora","🧭"],["Coti guardiana","🛡️"]],
 kunu:[["Kunu joven","🎒"],["Kunu explorador","🧤"],["Kunu guardián","🏅"]],
 arami:[["Arami joven","🍃"],["Arami exploradora","🔭"],["Arami guardiana","✨"]],
 yma:[["Yma joven","📖"],["Yma exploradora","🔎"],["Yma guardiana","🌙"]],
 yampi:[["Yampi joven","🍂"],["Yampi explorador","🧭"],["Yampi guardián","👑"]]
};
let save=JSON.parse(localStorage.getItem("mc_vertical")||"null")||{
 ready:false,player:"",adult:"",school:"",role:"",phone:"",terms:false,
 companion:"coti",xp:0,seeds:0,badges:[],items:[],records:[]
};
let flow={page:"intro",mission:null,module:0,data:{},earned:0};
const app=document.getElementById("app"),toast=document.getElementById("toast"),reward=document.getElementById("reward"),particles=document.getElementById("particles");
let sound=true,ctx=null;
function persist(){localStorage.setItem("mc_vertical",JSON.stringify(save))}
function c(){return companions[save.companion]}
function stage(){return save.xp>=500?2:save.xp>=200?1:0}
function next(){return [200,500].find(x=>x>save.xp)||null}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function tone(f,d=.08,v=.04,type="triangle"){if(!sound)return;if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g).connect(ctx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+d);o.stop(ctx.currentTime+d)}
function click(){tone(510,.05,.025)}
function win(){tone(523,.12,.05);setTimeout(()=>tone(659,.12,.05),120);setTimeout(()=>tone(784,.2,.06),240)}
document.addEventListener("click",e=>{if(e.target.closest("button"))click()});
soundBtn.onclick=()=>{sound=!sound;soundBtn.textContent=sound?"🔊":"🔇"};
function pop(text){reward.textContent=text;reward.classList.remove("show");void reward.offsetWidth;reward.classList.add("show");particles.classList.remove("show");void particles.offsetWidth;particles.classList.add("show");win()}
function msg(text){toast.textContent=text;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1400)}
function topbarHtml(){return `<header class="topbar"><div class="brand">🍃 Misión Colosos</div><div class="stats"><span class="pill">⭐ ${save.xp}</span><span class="pill">🌰 ${save.seeds}</span></div></header>`}
function shell(body,foot=""){app.innerHTML=`<section class="screen">${topbarHtml()}<div class="content">${body}</div>${foot}</section>`}
function footer(a,b,cls="primary"){return `<footer class="footer"><button id="back" class="btn secondary">${a}</button><button id="nextBtn" class="btn ${cls}">${b}</button></footer>`}
function bind(b,n){back?.addEventListener("click",b);nextBtn?.addEventListener("click",n)}
function companion(text){return `<div class="companion-strip"><div class="companion-face">${c().icon}</div><div class="companion-text"><strong>${c().name}:</strong> ${text}</div></div>`}
function render(){({intro,register,choose,camp,map,mission,finish,journal}[flow.page]||intro)()}
function intro(){
 shell(`<h1 class="title">Misión<br>Colosos</h1><p class="subtitle">Explorá. Descubrí. Protegé.</p><div class="hero"><img src="assets/coti.png" alt="Coti"><div class="quest-tag">NUEVA AVENTURA</div></div><div class="dialogue"><strong>Coti:</strong> Hay Colosos esperando ser encontrados. ¿Venís?</div>`,footer("Borrar partida","¡Acepto la misión!","gold"));
 bind(reset,()=>{flow.page=save.ready?"camp":"register";render()});
}
function reset(){if(confirm("¿Borrar tu partida?")){localStorage.removeItem("mc_vertical");location.reload()}}
function register(){
 shell(`<span class="kicker">SOLO LA PRIMERA VEZ</span><h2 class="section-title">Creá tu explorador</h2><div class="field"><label>Tu nombre</label><input id="player" value="${esc(save.player)}"></div><div class="field"><label>Adulto responsable</label><input id="adult" value="${esc(save.adult)}"></div><div class="field"><label>Teléfono</label><input id="phone" inputmode="tel" value="${esc(save.phone)}"></div><div class="field"><label>Escuela o institución</label><input id="school" value="${esc(save.school)}"></div><div class="field"><label>Cargo</label><input id="role" value="${esc(save.role)}"></div><label class="challenge"><input id="terms" type="checkbox" ${save.terms?"checked":""}><span>Acepto las reglas del Club de Exploradores.</span></label>${companion("Esto queda guardado. Después vamos directo al campamento.")}`,footer("Volver","Elegir compañero"));
 bind(()=>{flow.page="intro";render()},saveProfile);
}
function saveProfile(){
 const p=player.value.trim(),a=adult.value.trim(),ph=phone.value.trim();
 if(!p||!a||!ph||!terms.checked)return msg("Completá los datos y aceptá las reglas");
 Object.assign(save,{player:p,adult:a,phone:ph,school:school.value.trim(),role:role.value.trim(),terms:true});persist();flow.page="choose";render();
}
function choose(){
 shell(`<span class="kicker">FORMÁ TU EQUIPO</span><h2 class="section-title">Elegí tu compañero</h2><div class="choice-grid">${Object.entries(companions).map(([id,x])=>`<button class="choice ${save.companion===id?"selected":""}" data-c="${id}"><div style="font-size:3rem">${x.icon}</div>${x.name}</button>`).join("")}</div>${companion("Voy a acompañarte en cada desafío.")}`,footer("Volver","Ir al campamento","gold"));
 document.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{save.companion=b.dataset.c;render()});
 bind(()=>{flow.page="register";render()},()=>{save.ready=true;persist();flow.page="camp";render()});
}
function profile(){
 const s=stage(),n=next(),pct=n?((save.xp-(s===0?0:s===1?200:500))/(n-(s===0?0:200)))*100:100;
 return `<div class="profile"><div class="profile-avatar">${c().icon}<span class="gear">${evo[save.companion][s][1]}</span></div><div><div class="profile-name">Explorador ${esc(save.player)}</div><div class="level">${evo[save.companion][s][0]}</div><div class="track"><div class="bar" style="width:${Math.max(6,pct)}%"></div></div><div class="small">${n?`${save.xp}/${n} XP para evolucionar`:"Evolución máxima · seguí desbloqueando objetos"}</div></div></div>`
}
function camp(){
 shell(`${profile()}<div class="camp-scene"><div class="camp-companion">${c().icon}</div><div class="camp-bubble">¡Hola, ${esc(save.player)}! ¿Salimos a buscar otro Coloso?</div></div><div class="hub-actions"><button id="explore" class="btn gold">🗺️ Explorar</button><button id="bag" class="btn secondary">🎒 Mochila</button><button id="book" class="btn secondary">📖 Diario</button></div>`);
 explore.onclick=()=>{flow.page="map";render()};bag.onclick=book.onclick=()=>{flow.page="journal";render()};
}
function map(){
 shell(`<span class="kicker">MAPA DE AVENTURAS</span><h2 class="section-title">¿A dónde vamos?</h2><div class="map">${Object.entries(C.categories).map(([id,m])=>`<button class="map-node" data-m="${id}"><span>${m.icon}</span>${m.title}<small>${m.subtitle}</small></button>`).join("")}</div>${companion("Elegí un lugar. Cada expedición tiene desafíos distintos.")}`,footer("Campamento",""));
 nextBtn.style.visibility="hidden";
 document.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{flow={page:"mission",mission:b.dataset.m,module:0,data:{photos:{}},earned:0};render()});
 bind(()=>{flow.page="camp";render()},()=>{});
}
function current(){return C.categories[flow.mission]}
function mission(){
 const m=current(),mods=m.modules,mod=mods[flow.module];let body="",nextLabel="Continuar";
 if(mod==="gps")body=`<span class="kicker">${m.title}</span><h2 class="section-title">Encontraste un posible Coloso</h2><div class="visual"><div><div class="big">📍</div><h3>${flow.data.coords?"Ubicación registrada":"Guardá este lugar"}</h3><button id="gpsBtn" class="btn blue">${flow.data.coords?"✓ Punto guardado":"Usar mi ubicación"}</button></div></div>${companion(flow.data.coords?"¡Perfecto! Ya sé dónde está.":"Acercate al árbol antes de guardar el punto.")}`;
 if(mod==="photos")body=`<span class="kicker">MISIÓN FOTOGRÁFICA</span><h2 class="section-title">Conseguí las tres pruebas</h2><div class="challenge-grid">${photo("full","Árbol completo","🌳",10)}${photo("trunk","Tronco y medida","📏",10)}${photo("leaves","Hojas o flores","🍃",10)}</div>${companion("Cada prueba suma XP. ¡Buscá un buen ángulo!")}`;
 if(mod==="mainPhoto")body=`<span class="kicker">SAFARI FOTOGRÁFICO</span><h2 class="section-title">Conseguí una foto legendaria</h2><div class="challenge-grid">${photo("main","Fotografía principal","📸",25)}</div>${companion("Esperá el mejor momento. Luz, encuadre... ¡ahora!")}`;
 if(mod==="species")body=`<span class="kicker">DESAFÍO DE IDENTIFICACIÓN</span><h2 class="section-title">¿Reconocés este árbol?</h2><div class="choice-grid">${["Lapacho","Samu'u","Timbó","Yvyra pytã","Cedro","No estoy seguro","Creo que es otra especie"].map(v=>`<button class="choice ${flow.data.species===v?"selected":""}" data-species="${v}">${v}</button>`).join("")}</div>${flow.data.species==="Creo que es otra especie"?`<div class="field"><label>¿Cuál podría ser?</label><input id="speciesOther" value="${esc(flow.data.speciesOther||"")}"></div>`:""}${companion("No pasa nada si dudás. También se aprende intentando.")}`;
 if(mod==="measure")body=`<span class="kicker">DESAFÍO DE TAMAÑO</span><h2 class="section-title">¿Qué tan gigante es?</h2>${counter("height","Altura aproximada","m",1,flow.data.height||10)}${counter("circ","Circunferencia","m",0.1,flow.data.circ||1)}${companion("Usá una cinta para el tronco. La altura puede ser aproximada.")}`;
 if(mod==="story")body=`<span class="kicker">SECRETO DEL ÁRBOL</span><h2 class="section-title">¿Qué historia guarda?</h2><div class="field"><textarea id="story" placeholder="¿Quién te habló de este árbol? ¿Qué pasó bajo su sombra?">${esc(flow.data.story||"")}</textarea></div>${companion("Las mejores historias convierten un árbol en leyenda.")}`;
 if(mod==="protectedArea")body=`<span class="kicker">RESERVA NATURAL</span><h2 class="section-title">¿Cómo se llama este lugar?</h2><div class="field"><input id="protectedArea" value="${esc(flow.data.protectedArea||"")}"></div>${companion("Anotá el nombre de la reserva para completar el mapa.")}`;
 if(mod==="school")body=`<span class="kicker">MISIÓN ESCUELA</span><h2 class="section-title">Confirmá tu institución</h2><div class="field"><input id="institution" value="${esc(save.school)}"></div>${companion("Ya lo recordamos por vos.")}`;
 if(mod==="photoDate")body=`<span class="kicker">FECHA DE CAPTURA</span><h2 class="section-title">¿Cuándo tomaste la foto?</h2><div class="field"><input id="photoDate" type="date" value="${esc(flow.data.photoDate||"")}"></div>${companion("Una última pista y la foto entra al diario.")}`;
 shell(body,footer("Salir",nextLabel));
 bind(()=>{flow.page="map";render()},advanceModule);
 bindMission(mod);
}
function photo(key,label,icon,xp){const done=flow.data.photos[key];return `<button class="challenge ${done?"done":""}" data-photo="${key}" data-xp="${xp}"><span class="challenge-icon">${icon}</span><span><strong>${label}</strong><br><small>${done?"Prueba conseguida":"Tocá para completar"}</small></span><span class="challenge-xp">${done?"✅":"+"+xp}</span></button>`}
function counter(id,label,unit,step,value){return `<div class="counter-card"><div><strong>${label}</strong><div class="small">Unidad: ${unit}</div></div><div class="counter-controls"><button data-counter="${id}" data-dir="-1" data-step="${step}">−</button><div id="${id}Value" class="counter-value">${value}</div><button data-counter="${id}" data-dir="1" data-step="${step}">+</button></div></div>`}
function bindMission(mod){
 if(mod==="gps")gpsBtn.onclick=()=>navigator.geolocation.getCurrentPosition(
   p=>{flow.data.coords={x:p.coords.longitude,y:p.coords.latitude,accuracy:p.coords.accuracy};pop("📍 +15 XP");flow.earned+=15;render()},
   ()=>msg("No pudimos obtener la ubicación. Revisá el permiso del navegador."),
   {enableHighAccuracy:true,timeout:12000,maximumAge:0}
 );
 document.querySelectorAll("[data-photo]").forEach(b=>b.onclick=()=>{if(!flow.data.photos[b.dataset.photo]){flow.data.photos[b.dataset.photo]=true;flow.earned+=Number(b.dataset.xp);pop(`⭐ +${b.dataset.xp} XP`)}render()});
 document.querySelectorAll("[data-species]").forEach(b=>b.onclick=()=>{if(!flow.data.species){flow.earned+=10;pop("🌿 +10 XP")}flow.data.species=b.dataset.species;render()});
 document.querySelectorAll("[data-counter]").forEach(b=>b.onclick=()=>{const id=b.dataset.counter,step=Number(b.dataset.step),dir=Number(b.dataset.dir);let v=Number(flow.data[id]??(id==="height"?10:1));v=Math.max(step,Math.round((v+step*dir)*10)/10);flow.data[id]=v;document.getElementById(id+"Value").textContent=v});
}
function saveCurrent(mod){
 const ids=["speciesOther","story","protectedArea","institution","photoDate"];
 ids.forEach(id=>{const el=document.getElementById(id);if(el)flow.data[id]=el.value.trim()});
}
function advanceModule(){
 const m=current(),mod=m.modules[flow.module];saveCurrent(mod);
 if(mod==="gps"&&!flow.data.coords)return msg("Guardá la ubicación");
 if(mod==="photos"&&["full","trunk","leaves"].some(k=>!flow.data.photos[k]))return msg("Faltan pruebas");
 if(mod==="mainPhoto"&&!flow.data.photos.main)return msg("Conseguí la fotografía");
 if(mod==="species"&&!flow.data.species)return msg("Elegí una opción");
 if(mod==="species"&&flow.data.species==="Creo que es otra especie"&&!flow.data.speciesOther)return msg("Escribí la especie");
 if(mod==="story"&&!flow.data.story)return msg("Contanos la historia");
 if(mod==="protectedArea"&&!flow.data.protectedArea)return msg("Indicá la reserva");
 if(mod==="school"&&!flow.data.institution)return msg("Indicá la institución");
 if(mod==="photoDate"&&!flow.data.photoDate)return msg("Indicá la fecha");
 if(flow.module===m.modules.length-1)return completeMission();
 flow.module++;render();
}
function payload(){
 const m=current(),f=C.fieldMap,d=flow.data,a={};
 a[f.category]=m.officialValue;a[f.name]=save.adult;a[f.phone]=Number(String(save.phone).replace(/\D/g,""))||null;a[f.terms]="Sí";
 if(flow.mission==="school"){a[f.institution]=d.institution||save.school;a[f.institutionRole]=save.role}
 if(d.species){a[f.species]=d.species==="Creo que es otra especie"?"other":d.species;if(d.speciesOther)a[f.speciesOther]=d.speciesOther}
 if(d.height)a[f.height]=String(d.height);if(d.circ)a[f.circumference]=String(d.circ);if(d.story)a[f.story]=d.story;if(d.photoDate)a[f.photoDate]=d.photoDate;if(d.protectedArea)a[f.protectedArea]=d.protectedArea;
 return {attributes:a,geometry:d.coords?{x:d.coords.x,y:d.coords.y,spatialReference:{wkid:4326}}:null,attachments:d.photos,meta:{origin:"JUEGO",player:save.player,companion:save.companion,accuracy:d.coords?.accuracy||null}};
}
function completeMission(){
 const m=current(),oldStage=stage();save.xp+=m.xp+flow.earned;save.seeds+=m.seeds;
 const badge=m.title;if(!save.badges.includes(badge))save.badges.push(badge);
 if(save.seeds>=10&&!save.items.includes("Sombrero del Guardián"))save.items.push("Sombrero del Guardián");
 save.records.unshift({title:m.title,date:new Date().toLocaleDateString("es-PY"),xp:m.xp+flow.earned,seeds:m.seeds,payload:payload()});
 persist();flow.evolved=stage()>oldStage;flow.page="finish";pop(`⭐ +${m.xp+flow.earned} XP · 🌰 +${m.seeds}`);render();
}
function finish(){
 const m=current();
 shell(`<div class="finish"><div style="font-size:5rem">🏆</div><h2 class="finish-title">¡Misión completada!</h2>${companion("¡Lo logramos! El Coloso ya forma parte de tu diario.")}<div class="loot"><div class="loot-card">⭐<br>+${m.xp+flow.earned} XP</div><div class="loot-card">🌰<br>+${m.seeds}</div><div class="loot-card">🏅<br>${m.title}</div></div>${flow.evolved?`<div class="dialogue"><strong>¡EVOLUCIÓN!</strong><br>${c().name} ahora es ${evo[save.companion][stage()][0]} ${evo[save.companion][stage()][1]}</div>`:""}${profile()}</div>`,footer("Campamento","Otra aventura","gold"));
 bind(()=>{flow.page="camp";render()},()=>{flow.page="map";render()});
}
function journal(){
 shell(`${profile()}<h2 class="section-title">🎒 Mochila</h2><div class="inventory">${(save.items.length?save.items:["Próximo objeto"]).map(x=>`<div class="item">🎒<br><small>${x}</small></div>`).join("")}${save.badges.slice(-2).map(x=>`<div class="item">🏅<br><small>${x}</small></div>`).join("")}</div><h2 class="section-title">📖 Diario del Explorador</h2><div class="challenge-grid">${save.records.length?save.records.map(r=>`<div class="challenge done"><span class="challenge-icon">🌳</span><span><strong>${r.title}</strong><br><small>${r.date}</small></span><span class="challenge-xp">+${r.xp}</span></div>`).join(""):'<div class="dialogue">Todavía no hay Colosos en tu diario.</div>'}</div>`,footer("Editar perfil","Campamento"));
 bind(()=>{save.ready=false;persist();flow.page="register";render()},()=>{flow.page="camp";render()});
}
render();
