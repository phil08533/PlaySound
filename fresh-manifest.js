/* Always give generated manifests a fresh URL so GitHub Pages/browser caches cannot serve an old track list. */
(function(){
  const nativeFetch=window.fetch.bind(window);
  window.fetch=function(input,init){
    try{
      const raw=typeof input==='string'?input:input.url;
      const url=new URL(raw,location.href);
      if(url.pathname.endsWith('/tracks.json')||url.pathname.endsWith('/featured.json')){
        url.searchParams.set('_v',Date.now().toString());
        const nextInit=Object.assign({},init||{},{cache:'no-store'});
        if(input instanceof Request)return nativeFetch(new Request(url.toString(),input),nextInit);
        return nativeFetch(url.toString(),nextInit);
      }
    }catch(e){}
    return nativeFetch(input,init);
  };
})();
