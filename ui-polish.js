/* PlaySound UI polish: stronger backgrounds, less faded button surfaces. */
(function(){
  const css=document.createElement('style');
  css.textContent=`
    :root{--button-text:#75659f!important}
    body:before,body:after,#ps-bg-tint{display:none!important;opacity:1!important}
    #ps-bg-a,#ps-bg-b{position:fixed;inset:0;z-index:-2;background:center/cover no-repeat;opacity:1!important;transition:none!important;pointer-events:none}
    #ps-bg-a.visible,#ps-bg-b.visible{opacity:1!important}
    .view,.category-card,.theme-card{animation:none!important;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease!important;opacity:1!important}
    .category-card,.theme-card{background:rgba(255,255,255,.9)!important}
    .category-card:before,.theme-card:before{opacity:.3!important}
    .category-card strong,.theme-card strong,.nav-button,.back-button,.secondary-button,.small-button{color:#75659f!important;opacity:1!important;text-shadow:0 1px 0 rgba(255,255,255,.7)}
    .nav-button:hover,.nav-button.active,.back-button:hover,.small-button:hover{color:#66548f!important}
    .brand-mark span,.brand-mark b{background:linear-gradient(135deg,#ff8fa3 0 20%,#ffd166 20% 40%,#8bd3dd 40% 60%,#a8d88b 60% 80%,#c5a7e8 80% 100%);-webkit-background-clip:text;background-clip:text;color:transparent!important;opacity:1!important}
    .brand-mark b{font-weight:800}
    .category-card>span:not(.category-icon),.theme-card>span{display:none}
    .category-card[data-category="quiet-time"],.category-card[data-category="outside"],.category-card[data-category="mealtime"],.category-card[data-category="party"],.category-card[data-category="calm-down"],.category-card[data-category="creative-time"]{display:none}
  `;
  document.head.appendChild(css);
  const a=document.createElement('div'),b=document.createElement('div');
  a.id='ps-bg-a';b.id='ps-bg-b';document.body.prepend(b,a);
  let active=a;
  window.setBackgroundCandidates=function(candidates){
    const urls=[...new Set(candidates||[])];let i=0;
    const tryNext=()=>{if(i>=urls.length)return;const url=urls[i++],img=new Image();img.onload=()=>{const next=active===a?b:a;next.style.backgroundImage=`url("${url}")`;next.classList.add('visible');active.classList.remove('visible');active=next};img.onerror=tryNext;img.src=url};
    tryNext();
  };
  const params=()=>new URLSearchParams(location.search);
  function page(){return params().get('page')==='music'?'music':'home';}
  function navigate(target,push){
    if(push)history.pushState({page:target},'',target==='music'?'?page=music':'?page=home');
    if(target==='music'){if(typeof setPageBackground==='function')setPageBackground('music');if(typeof renderMusicPage==='function')renderMusicPage();showView('musicView')}
    else{if(typeof setPageBackground==='function')setPageBackground('home');showView('homeView')}
  }
  function showView(id){document.querySelectorAll('.view').forEach(v=>{v.hidden=v.id!==id;v.classList.toggle('active',v.id===id)});document.querySelectorAll('.nav-button').forEach(b=>b.classList.remove('active'));if(id==='homeView')document.querySelector('#homeButton')?.classList.add('active');if(id==='musicView')document.querySelector('#musicButton')?.classList.add('active');window.scrollTo({top:0,behavior:'auto'});}
  window.addEventListener('DOMContentLoaded',()=>{const home=document.querySelector('#homeButton'),music=document.querySelector('#musicButton'),brand=document.querySelector('#brandHome');if(home)home.onclick=e=>{e.preventDefault();navigate('home',true)};if(music)music.onclick=e=>{e.preventDefault();navigate('music',true)};if(brand)brand.onclick=e=>{e.preventDefault();navigate('home',true)};window.addEventListener('popstate',()=>navigate(page(),false));navigate(page(),false)});
})();
