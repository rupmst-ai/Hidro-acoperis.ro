(function(){
var w=window,d=document,s=null;
w.dataLayer=w.dataLayer||[];
function g(){dataLayer.push(arguments)}
w.gtag=g;
try{s=localStorage.getItem('ck')}catch(e){}
var off='denied',on='granted';
g('consent','default',{ad_storage:off,analytics_storage:off,ad_user_data:off,ad_personalization:off,wait_for_update:500});
if(s===on)g('consent','update',{ad_storage:on,analytics_storage:on,ad_user_data:on,ad_personalization:on});
g('set','ads_data_redaction',true);
g('set','url_passthrough',true);
g('js',new Date());
g('config','AW-17044870869',{allow_enhanced_conversions:true});
var q=new URLSearchParams(location.search),J={mures:1,cluj:1,sibiu:1};
var j=(q.get('judet')||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
try{
if(J[j])sessionStorage.setItem('judet',j);else j=sessionStorage.getItem('judet')||'';
['gclid','gbraid','wbraid'].forEach(function(k){var v=q.get(k);if(v)sessionStorage.setItem(k,v)});
}catch(e){if(!J[j])j=''}
if(J[j])d.documentElement.setAttribute('data-j',j);
})();
