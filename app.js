const KEY="sirohiFarmDataV1";
let data=JSON.parse(localStorage.getItem(KEY)||'{"goats":[],"health":[],"breeding":[],"sales":[]}');
let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").classList.remove("hidden")});
document.getElementById("installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}};
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function showPage(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");render()}
function openModal(html){document.getElementById("modalContent").innerHTML=html;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function form(title,fields,onsave){openModal(`<h2>${title}</h2>${fields.map(f=>`<div class="formrow"><label>${f.label}</label>${f.html}</div>`).join("")}<div class="form-actions"><button onclick="${onsave}">Save</button><button class="secondary" style="background:#eee;color:#222" onclick="closeModal()">Cancel</button></div>`)}
function openGoatForm(){
 form("Add Goat",[
 {label:"Tag / ID",html:'<input id="fTag" placeholder="e.g. SG-001">'},
 {label:"Name",html:'<input id="fName" placeholder="Optional">'},
 {label:"Type",html:'<select id="fType"><option>Buck</option><option>Doe</option><option>Kid</option></select>'},
 {label:"Breed",html:'<input id="fBreed" value="Sirohi">'},
 {label:"Date of Birth",html:'<input id="fDob" type="date">'},
 {label:"Weight (kg)",html:'<input id="fWeight" type="number" step="0.1">'},
 {label:"Notes",html:'<textarea id="fNotes" rows="3"></textarea>'}
 ],"saveGoat()");
}
function saveGoat(){const tag=document.getElementById("fTag").value.trim();if(!tag)return alert("Please enter Goat Tag / ID");data.goats.push({id:Date.now(),tag,name:document.getElementById("fName").value,type:document.getElementById("fType").value,breed:document.getElementById("fBreed").value,dob:document.getElementById("fDob").value,weight:document.getElementById("fWeight").value,notes:document.getElementById("fNotes").value});closeModal();save()}
function del(type,id){if(confirm("Delete this record?")){data[type]=data[type].filter(x=>x.id!==id);save()}}
function openHealthForm(){form("Add Health Record",[
{label:"Goat Tag / ID",html:'<input id="hTag" placeholder="SG-001">'},
{label:"Date",html:'<input id="hDate" type="date" value="'+new Date().toISOString().slice(0,10)+'">'},
{label:"Record Type",html:'<select id="hType"><option>Vaccination</option><option>Deworming</option><option>Medicine</option><option>Illness</option><option>Check-up</option></select>'},
{label:"Details",html:'<textarea id="hDetails" rows="3" placeholder="Vaccine/medicine, dose, remarks"></textarea>'}
],"saveHealth()")}
function saveHealth(){data.health.push({id:Date.now(),tag:hTag.value,date:hDate.value,type:hType.value,details:hDetails.value});closeModal();save()}
function openBreedingForm(){form("Add Breeding Record",[
{label:"Doe Tag / ID",html:'<input id="bDoe" placeholder="Doe ID">'},
{label:"Buck Tag / ID",html:'<input id="bBuck" placeholder="Buck ID">'},
{label:"Mating Date",html:'<input id="bDate" type="date">'},
{label:"Expected Kidding Date",html:'<input id="bExpected" type="date">'},
{label:"Status",html:'<select id="bStatus"><option>Planned</option><option>Mated</option><option>Pregnant</option><option>Kidded</option></select>'},
{label:"Notes",html:'<textarea id="bNotes" rows="3"></textarea>'}
],"saveBreeding()")}
function saveBreeding(){data.breeding.push({id:Date.now(),doe:bDoe.value,buck:bBuck.value,date:bDate.value,expected:bExpected.value,status:bStatus.value,notes:bNotes.value});closeModal();save()}
function openSaleForm(){form("Add Sale",[
{label:"Goat Tag / ID",html:'<input id="sTag" placeholder="SG-001">'},
{label:"Date",html:'<input id="sDate" type="date" value="'+new Date().toISOString().slice(0,10)+'">'},
{label:"Customer",html:'<input id="sCustomer">'},
{label:"Amount (₹)",html:'<input id="sAmount" type="number">'},
{label:"Notes",html:'<textarea id="sNotes" rows="3"></textarea>'}
],"saveSale()")}
function saveSale(){data.sales.push({id:Date.now(),tag:sTag.value,date:sDate.value,customer:sCustomer.value,amount:sAmount.value,notes:sNotes.value});closeModal();save()}
function render(){
 totalGoats.textContent=data.goats.length;bucks.textContent=data.goats.filter(x=>x.type==="Buck").length;does.textContent=data.goats.filter(x=>x.type==="Doe").length;kids.textContent=data.goats.filter(x=>x.type==="Kid").length;
 goatList.innerHTML=data.goats.length?data.goats.map(x=>`<div class="item"><strong>${esc(x.tag)}</strong><span class="pill">${esc(x.type)}</span><div class="meta">${esc(x.name||"")} • ${esc(x.breed||"Sirohi")} • ${x.weight?esc(x.weight)+" kg":"Weight not entered"}<br>DOB: ${esc(x.dob||"-")}<br>${esc(x.notes||"")}</div><button class="danger" style="margin-top:9px" onclick="del('goats',${x.id})">Delete</button></div>`).join(""):'<div class="empty">No goats added yet.</div>';
 healthList.innerHTML=data.health.length?data.health.slice().reverse().map(x=>`<div class="item"><strong>${esc(x.tag)}</strong><span class="pill">${esc(x.type)}</span><div class="meta">${esc(x.date)}<br>${esc(x.details||"")}</div><button class="danger" style="margin-top:9px" onclick="del('health',${x.id})">Delete</button></div>`).join(""):'<div class="empty">No health records yet.</div>';
 breedingList.innerHTML=data.breeding.length?data.breeding.slice().reverse().map(x=>`<div class="item"><strong>${esc(x.doe)}</strong> × ${esc(x.buck)} <span class="pill">${esc(x.status)}</span><div class="meta">Mating: ${esc(x.date||"-")}<br>Expected kidding: ${esc(x.expected||"-")}<br>${esc(x.notes||"")}</div><button class="danger" style="margin-top:9px" onclick="del('breeding',${x.id})">Delete</button></div>`).join(""):'<div class="empty">No breeding records yet.</div>';
 salesList.innerHTML=data.sales.length?data.sales.slice().reverse().map(x=>`<div class="item"><strong>${esc(x.tag)}</strong><span class="pill">Sale</span><div class="meta">${esc(x.date)} • Customer: ${esc(x.customer||"-")}<br>Amount: ₹${esc(x.amount||"0")}<br>${esc(x.notes||"")}</div><button class="danger" style="margin-top:9px" onclick="del('sales',${x.id})">Delete</button></div>`).join(""):'<div class="empty">No sales yet.</div>';
}
function exportData(){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="sirohi-goat-farm-backup.json";a.click();URL.revokeObjectURL(a.href)}
function clearData(){if(confirm("Delete ALL farm data from this device?")){data={goats:[],health:[],breeding:[],sales:[]};save()}}
render();
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
