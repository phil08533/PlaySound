/* PlaySound UI polish: smooth backgrounds, compact cards, and gentle animations. */
(function(){
  const css=document.createElement('style');
  css.textContent=`
    body:before,body:after{display:none!important}
    #ps-bg-a,#ps-bg-b{position:fixed;inset:0;z-index:-2;background:center/cover no-repeat;opacity:0;transition:opacity .75s ease;pointer-events:none}
    #ps-bg-a.visible,#ps-bg-b.visible{opacity:.48}
    #ps-bg-tint{position:fixed;inset:0;z-index:-1;background:rgba(255,248,239,.2);pointer-events:none}
    .category-card>span:not(.category-icon),.theme-card>span{display:none}
    .category-card[data-category="quiet-time"],.category-card[data-category="outside"],.category-card[data-category="mealtime"],.category-card[data-category="party"],.category-card[data-category="calm-down"],.category-card[data-category="creative-time"]{display:none}
    .category-card,.theme-card{transition:transform .28s ease,box-shadow .28s ease,border-color .28s ease,background-color .28s ease}
    .view{animation:ps-fade .22s ease both}
    .category-card,.theme-card{animation:ps-card-in .65s ease both}
    .category-card:nth-child(2),.theme-card:nth-child(2){animation-delay:.06s}
    .category-card:nth-child(3),.theme-card:nth-child(3){animation-delay:.12s}
    .category-card:nth-child(4),.theme-card:nth-child(4){animation-delay:.18s}
    .category-card:nth-child(5),.theme-card:nth-child(5){animation-delay:.24s}
    .category-card:nth-child(6),.theme-card:nth-child(6){animation-delay:.30s}
    .category-card:nth-child(7),.theme-card:nth-child(7){animation-delay:.36s}
    .category-card:nth-child(8),.theme-card:nth-child(8){animation-delay:.42s}
    .category-card:nth-child(9),.theme-card:nth-child(9){animation-delay:.48s}
    .category-card:nth-child(10),.theme-card:nth-child(10){animation-delay:.54s}
    @keyframes ps-fade{from{opacity:.94;transform:translateY(2px)}to{opacity:1;transform:none}}
    @keyframes ps-card-in{from{opacity:.65;transform:translateY(5px)}to{opacity:1;transform:none}}
  `;
  document.head.appendChild(css);

  const a=document.createElement('div'),b=document.createElement('div'),tint=document.createElement('div');
  a.id='ps-bg-a';b.id='ps-bg-b';tint.id='ps-bg-tint';
  document.body.prepend(tint,b,a);
  let active=a;

  window.setBackgroundCandidates=function(candidates){
    const urls=[...new Set(candidates||[])];
    let i=0;
    const tryNext=()=>{
      if(i>=urls.length)return;
      const url=urls[i++],img=new Image();
      img.onload=()=>{
        const next=active===a?b:a;
        next.style.backgroundImage=`url("${url}")`;
        next.classList.add('visible');
        active.classList.remove('visible');
        active=next;
      };
      img.onerror=tryNext;
      img.src=url;
    };
    tryNext();
  };

  const params=()=>new URLSearchParams(location.search);
  function page(){return params().get('page')==='music'?'music':'home';}
  function navigate(target,push){
    if(push)history.pushState({page:target},'',target==='music'?'?page=music':'?page=home');
    if(target==='music'){
      if(typeof setPageBackground==='function')setPageBackground('music');
      if(typeof renderMusicPage==='function')renderMusicPage();
      showView('musicView');
    }else{
      if(typeof setPageBackground==='function')setPageBackground('home');
      showView('homeView');
    }
  }
  function showView(id){
    document.querySelectorAll('.view').forEach(v=>{v.hidden=v.id!==id;v.classList.toggle('active',v.id===id)});
    document.querySelectorAll('.nav-button').forEach(b=>b.classList.remove('active'));
    if(id==='homeView')document.querySelector('#homeButton')?.classList.add('active');
    if(id==='musicView')document.querySelector('#musicButton')?.classList.add('active');
    window.scrollTo({top:0,behavior:'auto'});
  }

  window.addEventListener('DOMContentLoaded',()=>{
    const home=document.querySelector('#homeButton'),music=document.querySelector('#musicButton'),brand=document.querySelector('#brandHome');
    if(home)home.onclick=e=>{e.preventDefault();navigate('home',true)};
    if(music)music.onclick=e=>{e.preventDefault();navigate('music',true)};
    if(brand)brand.onclick=e=>{e.preventDefault();navigate('home',true)};
    window.addEventListener('popstate',()=>navigate(page(),false));
    navigate(page(),false);
  });
})();
