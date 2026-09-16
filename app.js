const KEY="connectUser";

function getUser(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
function saveUser(user){localStorage.setItem(KEY,JSON.stringify(user))}
function initials(name="John Doe"){return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase()}
function toast(message){const el=document.getElementById("toast");if(!el)return;el.textContent=message;el.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove("show"),2600)}

document.addEventListener("DOMContentLoaded",()=>{
  const user=getUser();
  const isAuthPage=document.body.classList.contains("auth-page");
  if(isAuthPage && user){ location.href="home.html"; return; }
  if(!isAuthPage && !user){ location.href="index.html"; return; }

  if(user){
    document.querySelectorAll(".user-name").forEach(x=>x.textContent=user.name);
    document.querySelectorAll(".user-email").forEach(x=>x.textContent=user.email);
    document.querySelectorAll(".user-first-name").forEach(x=>x.textContent=(user.name||"John").split(" ")[0]);
    document.querySelectorAll(".user-avatar").forEach(x=>x.textContent=initials(user.name));
  }

  const page=document.body.dataset.page;
  document.querySelectorAll("nav a[data-page]").forEach(a=>{if(a.dataset.page===page)a.classList.add("active")});

  document.querySelectorAll("[data-auth-tab]").forEach(tab=>{
    tab.addEventListener("click",()=>{
      document.querySelectorAll("[data-auth-tab]").forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      const login=tab.dataset.authTab==="login";
      document.getElementById("loginForm").classList.toggle("hidden",!login);
      document.getElementById("registerForm").classList.toggle("hidden",login);
    });
  });

  document.querySelectorAll("[data-toggle-password]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const input=document.getElementById(btn.dataset.togglePassword);
      input.type=input.type==="password"?"text":"password";
    });
  });

  const login=document.getElementById("loginForm");
  if(login) login.addEventListener("submit",e=>{
    e.preventDefault();
    const email=document.getElementById("loginEmail").value.trim();
    const password=document.getElementById("loginPassword").value;
    if(!email||password.length<6){toast("Enter a valid email and a password with at least 6 characters.");return}
    const old=getUser();
    saveUser({name:old?.name||email.split("@")[0]||"John Doe",email});
    toast("Login successful. Welcome back!");
    setTimeout(()=>location.href="home.html",450);
  });

  const register=document.getElementById("registerForm");
  if(register) register.addEventListener("submit",e=>{
    e.preventDefault();
    const name=document.getElementById("registerName").value.trim();
    const email=document.getElementById("registerEmail").value.trim();
    const p=document.getElementById("registerPassword").value;
    const c=document.getElementById("registerConfirm").value;
    if(p!==c){toast("Passwords do not match.");return}
    saveUser({name:name||"John Doe",email});
    toast("Account created successfully!");
    setTimeout(()=>location.href="home.html",450);
  });

  const forgot=document.getElementById("forgotBtn");
  if(forgot) forgot.addEventListener("click",()=>toast("Demo: password reset would be handled by the backend in Phase 3."));

  const logout=document.getElementById("logoutBtn");
  if(logout) logout.addEventListener("click",()=>{localStorage.removeItem(KEY);location.href="index.html"});

  const menu=document.getElementById("menuBtn");
  if(menu) menu.addEventListener("click",()=>document.querySelector(".sidebar").classList.toggle("open"));

  document.querySelectorAll(".like-btn").forEach(btn=>btn.addEventListener("click",()=>{btn.classList.toggle("liked");btn.textContent=btn.classList.contains("liked")?"♥ Liked":"♡ Like";}));
  document.querySelectorAll(".follow-btn").forEach(btn=>btn.addEventListener("click",()=>{btn.textContent=btn.textContent==="Follow"?"Following":"Follow";toast(btn.textContent==="Following"?"Following user":"Unfollowed user")}));

  const mark=document.getElementById("markRead");
  if(mark) mark.addEventListener("click",()=>{document.querySelectorAll(".notification").forEach(n=>n.classList.remove("unread"));toast("All notifications marked as read.")});

  const media=document.getElementById("mediaInput"), preview=document.getElementById("filePreview");
  if(media&&preview) media.addEventListener("change",()=>{preview.innerHTML="";[...media.files].forEach(f=>{const s=document.createElement("span");s.textContent="📎 "+f.name;preview.appendChild(s)})});

  const create=document.getElementById("createPostForm");
  if(create) create.addEventListener("submit",e=>{e.preventDefault();const text=document.getElementById("postText").value.trim();if(!text&&!media?.files.length){toast("Write something or add media first.");return}toast("Post published!");setTimeout(()=>location.href="home.html",600)});
});
