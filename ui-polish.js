/* PlaySound UI polish: smooth backgrounds, compact cards, and real browser history for Home/Music. */
(function(){
  const css=document.createElement('style');
  css.textContent=`
    body:before,body:after{display:none!important}
    #ps-bg-a,#ps-bg-b{position:fixed;inset:0;z-index:-2;background:center/cover no-repeat;opacity:0;transition:opacity .45s ease;pointer-events:none}
    #ps-bg-a.visible,#ps-bg-b.visible{opacity:.48}
    #ps-bg-tint{position:fixed;inset:0;z-index:-1;background:rgba(255,248,239,.2);pointer-events:none}
    .category-card>span:not(.category-icon),.theme-card>span{display:none}
    .category-card,.theme-card{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease,background-color .18s ease}
    .view{animation:ps-fade .22s ease both}
    @keyframes ps-fade{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
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
      if(i>=urls.length){return;}
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
    document.querySelector('#homeButton')?.addEventListener('click',e=>{e.preventDefault();navigate('home',true)});
    document.querySelector('#musicButton')?.addEventListener('click',e=>{e.preventDefault();navigate('music',true)});
    document.querySelector('#brandHome')?.addEventListener('click',e=>{e.preventDefault();navigate('home',true)});
    window.addEventListener('popstate',()=>navigate(page(),false));
    navigate(page(),false);
  });
})();
