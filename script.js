const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const PASSCODE = "4503";
let entered = "";
let currentApp = "";

const apps = [
  {id:"kakao",name:"KakaoTalk",icon:"💬",color:"linear-gradient(145deg,#ffe86b,#f4c938)"},
  {id:"photos",name:"Photos",icon:"🌸",color:"linear-gradient(145deg,#ffb9cf,#a6a5ff)"},
  {id:"notes",name:"Notes",icon:"📝",color:"linear-gradient(145deg,#fff0a6,#ffc95c)"},
  {id:"instagram",name:"Instagram",icon:"◎",color:"linear-gradient(135deg,#f9c36b,#ec6aa2,#8a66d8)"},
  {id:"calendar",name:"Calendar",icon:"📅",color:"linear-gradient(145deg,#fff,#e6e2ee)"},
  {id:"settings",name:"Settings",icon:"⚙️",color:"linear-gradient(145deg,#d4d6df,#777b8c)"},
  {id:"safari",name:"Safari",icon:"🧭",color:"linear-gradient(145deg,#b5e6ff,#3b8ce8)"},
  {id:"music",name:"Music",icon:"🎧",color:"linear-gradient(145deg,#ffb2c9,#e44b83)"},
  {id:"weather",name:"Weather",icon:"☁️",color:"linear-gradient(145deg,#a9e5ff,#6f9bf1)"},
  {id:"clock",name:"Clock",icon:"🕰️",color:"linear-gradient(145deg,#48475a,#191925)"},
  {id:"mail",name:"Mail",icon:"✉️",color:"linear-gradient(145deg,#a8d7ff,#558ce4)"},
  {id:"maps",name:"Maps",icon:"🗺️",color:"linear-gradient(145deg,#b8e2bb,#7fb9a2)"}
];
const dockApps = ["kakao","photos","safari","music"];

function updateTime(){
  const now = new Date();
  const time = now.toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit",hour12:false});
  $("#lock-time").textContent = time;
  $("#status-time").textContent = time;
  $("#lock-date").textContent = now.toLocaleDateString("th-TH",{weekday:"long",day:"numeric",month:"long"});
  $("#home-date").textContent = now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}).toUpperCase();
}
updateTime(); setInterval(updateTime,1000);

function showView(id){
  $$(".view").forEach(v=>v.classList.toggle("active",v.id===id));
  $("#home-indicator").style.display = id==="passcode-view" ? "none" : "block";
}
$("#unlock-button").addEventListener("click",()=>showView("passcode-view"));
$("#lock-view").addEventListener("click",e=>{if(e.target.id!=="flashlight"&&e.target.id!=="camera-shortcut")showView("passcode-view")});
$("#passcode-back").addEventListener("click",()=>{entered="";updateDots();showView("lock-view")});
$("#flashlight").addEventListener("click",e=>{e.currentTarget.classList.toggle("active");e.currentTarget.style.background=e.currentTarget.classList.contains("active")?"#fff7b5":"#ffffff2a"});
$("#camera-shortcut").addEventListener("click",()=>openApp("photos"));
$("#keypad").addEventListener("click",e=>{
  const digit=e.target.dataset.digit;
  if(digit!==undefined && entered.length<4){entered+=digit;updateDots();if(entered.length===4)setTimeout(checkPasscode,160)}
  if(e.target.id==="delete-digit"){entered=entered.slice(0,-1);updateDots();$("#passcode-message").textContent="ใส่รหัส 4 หลัก"}
});
function updateDots(){$$("#dots i").forEach((dot,i)=>dot.classList.toggle("filled",i<entered.length))}
function checkPasscode(){
  if(entered===PASSCODE){entered="";updateDots();$("#passcode-message").textContent="";showView("home-view")}
  else{const panel=$("#passcode-view");panel.classList.remove("shake");void panel.offsetWidth;panel.classList.add("shake");$("#passcode-message").textContent="รหัสไม่ถูกต้อง ลองอีกครั้ง";entered="";updateDots();setTimeout(()=>panel.classList.remove("shake"),400)}
}

function iconButton(app){
  return `<button class="app-icon" data-app="${app.id}" aria-label="เปิด ${app.name}"><span class="glyph" style="background:${app.color}">${app.icon}</span><span>${app.name}</span></button>`;
}
$("#app-grid").innerHTML=apps.filter(a=>!dockApps.includes(a.id)).map(iconButton).join("") + apps.filter(a=>dockApps.includes(a.id)).slice(0,0).map(iconButton).join("");
// Put all apps in the grid, with four favourites duplicated in the dock.
$("#app-grid").innerHTML=apps.map(iconButton).join("");
$("#dock").innerHTML=dockApps.map(id=>iconButton(apps.find(a=>a.id===id))).join("");
$("#home-view").addEventListener("click",e=>{const btn=e.target.closest("[data-app]");if(btn)openApp(btn.dataset.app)});
$("#dock").addEventListener("click",e=>{const btn=e.target.closest("[data-app]");if(btn)openApp(btn.dataset.app)});
$("#home-button").addEventListener("click",()=>showView("home-view"));
$("#home-indicator").addEventListener("click",()=>{if(currentApp)showView("home-view");else showView("lock-view")});
$("#app-more").addEventListener("click",()=>{const c=$("#app-content");c.scrollTo({top:0,behavior:"smooth"})});

const pinterest = [
 "https://www.pinterest.com/pin/915215955543581355/",
 "https://www.pinterest.com/pin/925982373408037894/",
 "https://www.pinterest.com/pin/871798440392316801/",
 "https://www.pinterest.com/pin/1047579563330849770/",
 "https://www.pinterest.com/pin/484207397455390819/",
 "https://www.pinterest.com/pin/925982373412389062/",
 "https://www.pinterest.com/pin/1049479519429640723/"
];
const appTitles = Object.fromEntries(apps.map(a=>[a.id,a.name]));
function openApp(id){
  currentApp=id;$("#app-title").textContent=appTitles[id]||id;
  $("#app-content").innerHTML=(appTemplates[id]||genericApp(id));
  showView("app-view");
  $("#app-content").scrollTop=0;
  if(id==="settings")bindSettings();
  if(id==="notes")bindNotes();
}
const appTemplates = {
kakao:()=>`<div class="chat-top"><div class="chat-avatar">R</div><div><div class="chat-name">Riku ♡</div><div class="online">● ออนไลน์ล่าสุดเมื่อไม่นานนี้</div></div></div>
  <p class="eyebrow">วันนี้ · แชตส่วนตัว</p>
  <div class="bubble-row"><div class="bubble">วันนี้เป็นยังไงบ้าง?</div><span class="time-small">19:41</span></div>
  <div class="bubble-row me"><span class="time-small">19:43</span><div class="bubble">ก็เรื่อย ๆ เลย แล้วริคล่ะ</div></div>
  <div class="bubble-row"><div class="bubble">เห็นอะไรน่ารัก ๆ แล้วนึกถึงนายเลย</div><span class="time-small">19:44</span></div>
  <div class="bubble-row me"><span class="time-small">19:45</span><div class="bubble">ริคุ คิดถึงนะ ♡</div></div>
  <div class="bubble-row"><div class="bubble">คิดถึงเหมือนกัน ไว้ไปเที่ยวด้วยกันอีกนะ</div><span class="time-small">19:46</span></div>
  <div class="chat-input">ข้อความ · · · <span style="float:right">＋　➤</span></div>`,
photos:()=>`<p class="eyebrow">คลังภาพส่วนตัว · 7 รายการ</p><div class="photo-grid">${pinterest.map((url,i)=>`<div class="photo-tile"><small>MEMORY 0${i+1}</small><strong>${["little moments","weekend mood","somewhere cozy","soft afternoon","favorite view","just us","for later"][i]}</strong><a href="${url}" target="_blank" rel="noopener" aria-label="เปิดภาพอ้างอิง Pinterest"></a></div>`).join("")}</div><p class="tiny-label" style="margin-top:12px">แตะการ์ดเพื่อเปิดภาพอ้างอิงบน Pinterest · เปลี่ยนเป็นไฟล์รูปใน images/ ได้</p>`,
notes:()=>`<div class="card"><p class="eyebrow">PINNED NOTE</p><h3>✈️ Plan ไปเที่ยวกับริคุ</h3><div class="note-body">□ หาคาเฟ่น่ารัก ๆ ไว้นั่งพัก\n□ เดินเล่นถ่ายรูปด้วยกัน\n□ ลองร้านขนมที่ริคุอยากไป\n□ เตรียม playlist ระหว่างทาง\n□ เช็กพยากรณ์อากาศก่อนออกเดินทาง</div></div><div class="card"><p class="eyebrow">PERSONAL</p><h3>🎁 ของขวัญวันเกิดที่จะซื้อให้</h3><div class="note-body">□ น้ำหอมกลิ่นที่ริคุชอบ\n□ พวงกุญแจคู่\n□ อัลบั้มรูป/โฟโต้การ์ด\n□ เขียนการ์ดด้วยมือ\n□ ห่อของขวัญโทนสีฟ้า</div><p class="muted">ติ๊กช่องเพื่อทำเครื่องหมายรายการที่เสร็จแล้ว</p></div><div class="card"><h3>💭 อย่าลืม</h3><textarea id="personal-note" placeholder="เขียนโน้ตของตัวเอง..." style="width:100%;min-height:85px;border:1px solid #eee;border-radius:12px;padding:10px;font:inherit"></textarea><p id="save-note-status" class="muted">บันทึกไว้ในเครื่องนี้เมื่อกดบันทึก</p><button id="save-note" style="background:#aaa3f3;color:white;padding:9px 14px;border-radius:12px">บันทึกโน้ต</button></div>`,
instagram:()=>`<div class="insta-head"><span>Instagram</span><span>♡　✉</span></div><div class="story-row">${["Your story","riku","friends","cafe","yushi"].map((n,i)=>`<div class="story"><div class="story-ring"><span>${["＋","R","✿","☕","悠"][i]}</span></div>${n}</div>`).join("")}</div><div class="card"><div class="tiny-label">yushi.days · 2 ชม.</div><div class="post-image">☁︎</div><div class="post-actions">♡ ♧ ➤</div><p><strong>yushi.days</strong> a quiet day, a warm drink, and you in my mind. ☁️</p><p class="muted">ดูความคิดเห็นทั้งหมด 12 รายการ</p></div>`,
calendar:()=>{const d=new Date(),year=d.getFullYear(),month=d.getMonth(),first=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate();let cells=Array(first).fill("<span></span>");for(let n=1;n<=days;n++)cells.push(`<span class="${n===d.getDate()?'today':''}">${n}</span>`);return `<div class="card"><p class="eyebrow">YOUR MONTH</p><div class="calendar-month">${d.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</div><div class="calendar-grid">${["S","M","T","W","T","F","S"].map(x=>`<span class="muted">${x}</span>`).join("")}${cells.join("")}</div></div><div class="card"><p class="eyebrow">UP NEXT</p><div class="event-row"><div class="note-icon">♡</div><div><h3>Plan a day with Riku</h3><p>เลือกวันว่างแล้วค่อยเติมรายละเอียด</p></div></div><div class="event-row"><div class="note-icon" style="background:#d9e8ff">🎂</div><div><h3>Birthday gift checklist</h3><p>อย่าลืมเตรียมของขวัญล่วงหน้า</p></div></div></div>`},
settings:()=>`<div class="card" style="text-align:center"><div class="avatar">悠</div><h3>Tokuno Yushi</h3><p>Apple ID · yushi@example.com</p></div><div class="card"><div class="setting-row"><div class="row-icon" style="background:#b9d9ff">✈</div><div><h3>Airplane Mode</h3><p>ปิดอยู่</p></div><span style="margin-left:auto">○</span></div><div class="setting-row"><div class="row-icon" style="background:#b9e8cf">◉</div><div><h3>Wi-Fi</h3><p>Connected</p></div><span style="margin-left:auto;color:#8b83c8">Yushi's Wi-Fi</span></div><div class="setting-row"><div class="row-icon" style="background:#e7d5ff">☾</div><div><h3>Focus</h3><p>Personal</p></div><span style="margin-left:auto">›</span></div><div class="setting-row"><div class="row-icon" style="background:#e8e8ed">🔒</div><div><h3>Passcode</h3><p>ตั้งรหัสผ่านจำลองแล้ว</p></div><span style="margin-left:auto">••••</span></div></div><div class="card"><h3>About this phone</h3><p>Yushi Phone · Virtual iPhone UI</p><p>เวอร์ชัน 1.0 · Made with ♡</p><button id="wallpaper-tip" style="background:#aaa3f3;color:white;padding:9px 12px;border-radius:12px">วิธีเปลี่ยน Wallpaper</button><p id="wallpaper-help" hidden>ใส่ไฟล์ภาพชื่อ wallpaper.jpg ในโฟลเดอร์ images/ แล้วรีเฟรชหน้าเว็บ</p></div>`,
safari:()=>`<p class="eyebrow">SEARCH</p><div class="search-bar">⌕　Search or enter website name</div><div class="card"><h3>รายการค้นหาล่าสุด</h3>${["คาเฟ่น่านั่งกับริคุ","คาเฟ่โทนมินิมอล","ของขวัญวันเกิดผู้ชาย","สถานที่เที่ยววันหยุด","playlist for a long drive"].map((x,i)=>`<div class="search-row"><span>⌕</span><p style="margin:0;font-size:12px">${x}</p></div>`).join("")}</div><div class="card"><h3>Favorites</h3><p>♡ Pinterest　　Instagram　　Maps</p></div>`,
music:()=>`<div class="card" style="text-align:center;padding:22px"><div class="post-image" style="height:220px;font-size:55px">♫</div><p class="eyebrow" style="margin-top:18px">NOW PLAYING</p><h3>songs for the way home</h3><p>Yushi's soft playlist</p><div style="font-size:25px;margin:20px">↶　Ⅱ　↷</div><div style="height:4px;background:#eee;border-radius:4px"><div style="width:35%;height:4px;background:#aaa3f3;border-radius:4px"></div></div><p class="muted">01:24　　　　　　　　　03:52</p></div>`,
weather:()=>`<div class="card" style="text-align:center;padding:28px 10px;background:linear-gradient(150deg,#b8d8ff,#eee6fa)"><p class="eyebrow">CURRENT WEATHER · DEMO</p><div style="font-size:55px">⛅</div><div style="font-size:48px;font-weight:300">27°</div><h3>Partly cloudy</h3><p>ข้อมูลตัวอย่างสำหรับหน้าจอจำลอง</p></div><div class="card"><h3>Today</h3><p>☀ Morning　26°　　☁ Evening　24°</p></div>`,
clock:()=>`<div class="card" style="text-align:center;padding:28px 10px"><div style="font-size:50px">◷</div><h2 id="clock-live" style="font-size:42px;font-weight:300">--:--:--</h2><p>เวลาปัจจุบันของอุปกรณ์</p></div><div class="card"><h3>World Clock</h3><p>Bangkok · Tokyo · Seoul</p></div>`,
mail:()=>`<div class="card"><p class="eyebrow">INBOX</p><h3>Welcome to Yushi Mail</h3><p>นี่คือกล่องอีเมลจำลองสำหรับโปรเจกต์แฟนเมด</p></div><div class="card"><h3>Drafts</h3><p>ยังไม่มีอีเมลฉบับร่าง</p></div>`,
maps:()=>`<div class="card" style="text-align:center;padding:30px 12px;background:linear-gradient(145deg,#c4e8d0,#e8e8d9)"><div style="font-size:50px">📍</div><h3>Our little trip</h3><p>คาเฟ่ · ร้านขนม · จุดถ่ายรูป</p></div><div class="card"><h3>Saved places</h3><p>☕ คาเฟ่ที่อยากไปกับริคุ</p><p>🌳 สวนสำหรับเดินเล่น</p><p>🍰 ร้านเค้กวันเกิด</p></div>`
};
function genericApp(id){return `<div class="card"><h3>${appTitles[id]||id}</h3><p>หน้าจอแอปจำลอง</p></div>`}
function bindSettings(){const b=$("#wallpaper-tip"),h=$("#wallpaper-help");if(b)b.addEventListener("click",()=>h.hidden=!h.hidden)}
function bindNotes(){
 const area=$("#personal-note"),status=$("#save-note-status");
 area.value=localStorage.getItem("yushi-personal-note")||"";
 $("#save-note").addEventListener("click",()=>{localStorage.setItem("yushi-personal-note",area.value);status.textContent="บันทึกแล้ว ♡"});
}
$("#app-content").addEventListener("click",e=>{
 if(e.target.matches(".photo-tile")){const a=e.target.querySelector("a");if(a)window.open(a.href,"_blank","noopener")}
});
$("#app-content").addEventListener("click",e=>{if(e.target.id==="wallpaper-tip")bindSettings()});
$("#app-content").addEventListener("click",e=>{if(e.target.id==="save-note")bindNotes()});
$("#app-content").addEventListener("change",e=>{if(e.target.matches(".note-body input")){}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")showView("home-view");if($("#passcode-view").classList.contains("active")&&/^\d$/.test(e.key)&&entered.length<4){entered+=e.key;updateDots();if(entered.length===4)setTimeout(checkPasscode,160)}});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) { window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(()=>{})); }
