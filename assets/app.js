(function(){
  var toast=document.createElement('div');toast.className='toast';toast.textContent='Copiado ✓';document.body.appendChild(toast);
  function copy(text,btn){
    function ok(){btn.classList.add('done');btn.textContent='Copiado';toast.classList.add('show');
      setTimeout(function(){btn.classList.remove('done');btn.textContent='Copiar';toast.classList.remove('show')},1600)}
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(ok,fallback)}else fallback();
    function fallback(){var t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');ok()}catch(e){}document.body.removeChild(t)}
  }
  document.querySelectorAll('.code,.ask').forEach(function(box){
    var src=box.querySelector('pre,p');var b=document.createElement('button');b.className='cp';b.type='button';b.textContent='Copiar';
    b.addEventListener('click',function(){copy(box.dataset.copy||src.innerText.trim(),b)});box.appendChild(b);
  });
  // chip ativo no índice conforme rola
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  if(links.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
      links.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('on',on);if(on)a.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'})})}})},{rootMargin:'-40% 0px -55% 0px'});
    links.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io.observe(t)});
  }
})();
