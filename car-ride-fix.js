/* Car Ride asset compatibility fix. Keeps the main app untouched while matching the files actually in GitHub. */
(function(){
  const car='car-ride';
  const aliases={upbeat:['upbeat'], 'sing along':['sing along'], family:['family-favorites'], calm:['calm-ride']};
  const exts=['png','jpg','jpeg','webp'];
  const paths=(names,folders)=>folders.flatMap(folder=>names.flatMap(name=>exts.map(ext=>`music/${car}/genre background/${folder}/${name}.${ext}`)));
  const names=t=>aliases[t]||[t];
  const carThemeButtons=(theme)=>paths(names(theme),['genre button backgrounds']);
  const carThemePages=(theme)=>paths(names(theme),['genre button backgrounds/website background','genre button backgrounds/website backgrounds','website background','website backgrounds','genre button backgrounds']);
  const oldButtonStyle=buttonStyle;
  buttonStyle=function(category,theme){if(category!==car)return oldButtonStyle(category,theme);const c=carThemeButtons(theme);return `style="--card-bg:url('${c[0]}')" data-bg-candidates="${encodeURIComponent(JSON.stringify(c))}"`;};
  const oldSetBackground=setBackground;
  setBackground=function(category,theme){if(category!==car)return oldSetBackground(category,theme);setBackgroundCandidates(carThemePages(theme));};
  const oldSetCategoryBackground=setCategoryBackground;
  setCategoryBackground=function(category){if(category!==car)return oldSetCategoryBackground(category);setBackgroundCandidates(paths(['car-ride'],['genre button backgrounds','genre background']));};
})();
