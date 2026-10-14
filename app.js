/* 阿奇音符 · 交互脚本 */
(function () {
  'use strict';
  var CONFIG = { cartKey:'music_cart_v1', orderKey:'music_orders_v1' };

  var STYLES = [
    { name:'生日歌', desc:'给爸妈、爱人、孩子的生日惊喜', price:30, img:'assets/img/style-birthday.png' },
    { name:'表白歌', desc:'把说不出口的话唱给他听', price:50, img:'assets/img/style-love.png' },
    { name:'道谢歌', desc:'谢谢那些帮过你的人', price:30, img:'assets/img/style-thanks.png' },
    { name:'道歉歌', desc:'一句对不起，用歌更真诚', price:30, img:'assets/img/style-love.png' },
    { name:'毕业歌', desc:'纪念一段同窗岁月', price:50, img:'assets/img/style-graduation.png' },
    { name:'婚礼歌', desc:'婚礼现场、纪念日的专属音乐', price:88, img:'assets/img/style-wedding.png' },
    { name:'祝寿歌', desc:'给长辈的寿宴祝福', price:50, img:'assets/img/style-family.png' },
    { name:'团队歌', desc:'公司年会、团队建设的队歌', price:88, img:'assets/img/style-family.png' },
    { name:'亲子歌', desc:'写给孩子的成长纪念', price:50, img:'assets/img/style-family.png' },
    { name:'缅怀歌', desc:'怀念逝去的亲人，寄托思念', price:50, img:'assets/img/style-thanks.png' },
    { name:'自定义', desc:'以上都不是？告诉我你的场景', price:50, img:'assets/img/style-love.png' }
  ];

  var PLANS = [
    { name:'基础版', price:20, hot:false, sub:'想先试试效果的，选这个',
      feat:['短版歌曲（1 分钟以内）','AI 写词 + 作曲','含 1 次修改','按顺序交付'] },
    { name:'标准版', price:50, hot:true, sub:'最受欢迎，性价比最高',
      feat:['完整版歌曲（2-3 分钟）','AI 写词 + 作曲 + 编曲','含 2 次修改','附赠歌词文档'] },
    { name:'精品版', price:100, hot:false, sub:'重要场合，值得做好一点',
      feat:['完整版歌曲（2-3 分钟）','定制歌词打磨 + 精致编曲','含 3 次修改','优先制作','附赠歌词文档 + 封面图'] },
    { name:'加急版', price:150, hot:false, sub:'急用？这个最快',
      feat:['完整版歌曲（2-3 分钟）','优先插队制作','含 3 次修改','15 分钟内加急交付','附赠歌词文档 + 封面图'] }
  ];

  var MUSIC_STYLES = ['流行','民谣','抒情','R&B','说唱','古风','电子','爵士','儿歌','摇滚','不限定（你来定）'];

  var FAQ = [
    { q:'多久能拿到歌？', a:'下单后按下单先后顺序制作，通常 30 分钟内交付。高峰期会排队，下单时我会告知预计时间。急用可以选「加急优先」。接单时间为工作日 9:00-22:00。' },
    { q:'我不懂音乐，也能定制吗？', a:'完全可以。你不需要懂任何音乐知识，只要把"想对谁说什么话、什么场合"告诉我，剩下的我来处理。写得越具体，歌越贴合你的心意。' },
    { q:'怎么付款？', a:'提交订单后，我会联系你确认细节。支持微信、支付宝，也支持 ARK 等加密资产。确认方案后再付款。' },
    { q:'不满意怎么办？', a:'每个版本都包含修改次数（基础版 1 次、标准版 2 次、精品版 3 次）。如果风格或情感方向不对，可以在修改次数内调整。' },
    { q:'歌曲是原创的吗？', a:'是的，根据你提供的故事和内容定制生成，不是套模板。歌词是为你写的，旋律也是专门生成的。' },
    { q:'能指定歌手的声音吗？', a:'可以指定音色风格（男声/女声、温柔/有力等）。如果需要模仿特定歌手音色，请提前说明，可能要另议价格。' },
    { q:'交付什么格式？', a:'交付 MP3 音频文件 + 歌词文字稿。精品版和加急版额外附赠封面图。' },
    { q:'能商用吗？', a:'个人使用（送礼、纪念、朋友圈分享）没问题。如果用于商业用途（广告、产品宣传），请提前说明，需要另议授权。' },
    { q:'歌词会泄露我的隐私吗？', a:'不会。你提供的故事和内容仅用于制作这首歌，不会对外公开。除非你本人同意，否则不会作为案例展示。' },
    { q:'能用 ARK 付款吗？', a:'可以。页面上有 ARK 收款区，支持 BSC 链上的 ARK / USDT。转账前请先联系确认金额，转账后请提供交易哈希（TxID）方便核对。' }
  ];

  var SAMPLES = [{ name:'生日歌 · 定制示例', style:'流行抒情', src:'assets/audio/sample1.mp3' }];
  var BGM = [{ name:'阿奇音符 · 背景音乐', src:'assets/audio/bgm1.mp3' }];

  function $(s,r){ return (r||document).querySelector(s); }
  function $$(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function money(n){ return '¥'+Number(n).toLocaleString('zh-CN'); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function toast(t){ var e=$('#toast'); if(!e) return; e.textContent=t; e.classList.add('on');
    clearTimeout(e._t); e._t=setTimeout(function(){ e.classList.remove('on'); },2200); }
  function load(k,d){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } }
  function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

  var nav=$('#nav');
  function onScroll(){ if(nav) nav.classList.toggle('solid', window.scrollY>60); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  function renderStyles(){
    var g=$('#styleGrid'); if(!g) return;
    g.innerHTML = STYLES.map(function(s){
      return '<div class="style-card" data-style="'+esc(s.name)+'">'+
        '<img src="'+s.img+'" alt="'+esc(s.name)+'" loading="lazy">'+
        '<div class="style-ov"></div><div class="style-price">'+money(s.price)+' 起</div>'+
        '<div class="style-info"><h3>'+esc(s.name)+'</h3><p>'+esc(s.desc)+'</p></div></div>';
    }).join('');
    if(!g._b){ g._b=true;
      g.addEventListener('click',function(e){
        var c=e.target.closest('.style-card'); if(!c) return;
        var n=c.getAttribute('data-style'); var sel=$('#fType'); if(sel) sel.value=n;
        updateSummary();
        var o=document.querySelector('#order'); if(o) o.scrollIntoView({behavior:'smooth'});
        toast('已选择：'+n);
      });
    }
  }

  function renderPrices(){
    var g=$('#priceGrid'); if(!g) return;
    g.innerHTML = PLANS.map(function(p){
      return '<div class="price-card'+(p.hot?' featured':'')+'">'+
        (p.hot?'<div class="pc-hot">最 受 欢 迎</div>':'')+
        '<div class="pc-name">'+esc(p.name)+'</div><div class="pc-sub">'+esc(p.sub)+'</div>'+
        '<div class="pc-price"><b>'+p.price+'</b><span>元</span></div>'+
        '<div class="pc-unit">一次买断 · 非订阅</div>'+
        '<ul class="pc-feat">'+p.feat.map(function(f){ return '<li>'+esc(f)+'</li>'; }).join('')+'</ul>'+
        '<button class="pc-btn" data-plan="'+esc(p.name)+'">选这个版本</button></div>';
    }).join('');
    if(!g._b){ g._b=true;
      g.addEventListener('click',function(e){
        var b=e.target.closest('[data-plan]'); if(!b) return;
        var n=b.getAttribute('data-plan'); var sel=$('#fPlan'); if(sel) sel.value=n;
        updateSummary();
        var o=document.querySelector('#order'); if(o) o.scrollIntoView({behavior:'smooth'});
        toast('已选择：'+n);
      });
    }
  }

  var curA=null, curB=null;
  function renderSamples(){
    var g=$('#listenGrid'); if(!g) return;
    g.innerHTML = SAMPLES.map(function(s,i){
      return '<div class="listen-card"><button class="lc-play" data-i="'+i+'" aria-label="播放">▶</button>'+
        '<div class="lc-info"><b>'+esc(s.name)+'</b><span>'+esc(s.style)+'</span></div>'+
        '<span class="lc-tag">示例</span></div>';
    }).join('');
    if(!g._b){ g._b=true;
      g.addEventListener('click',function(e){
        var b=e.target.closest('.lc-play'); if(!b) return;
        var s=SAMPLES[parseInt(b.getAttribute('data-i'),10)]; if(s) togglePlay(s,b);
      });
    }
  }
  function togglePlay(sample,btn){
    if(curA&&curB===btn){
      if(curA.paused){ curA.play(); btn.textContent='❚❚'; btn.classList.add('playing'); }
      else { curA.pause(); btn.textContent='▶'; btn.classList.remove('playing'); }
      return;
    }
    if(curA){ curA.pause(); if(curB){ curB.textContent='▶'; curB.classList.remove('playing'); } }
    curA=new Audio(sample.src); curB=btn;
    curA.play().then(function(){ btn.textContent='❚❚'; btn.classList.add('playing'); })
      .catch(function(){ toast('音频文件未就绪'); btn.textContent='▶'; btn.classList.remove('playing'); });
    curA.addEventListener('ended',function(){ btn.textContent='▶'; btn.classList.remove('playing'); curA=null; curB=null; });
  }

  function renderFaq(){
    var w=$('#faqList'); if(!w) return;
    w.innerHTML = FAQ.map(function(f,i){
      return '<div class="faq-item"><button class="faq-q" type="button">'+esc(f.q)+
        '<span>＋</span></button><div class="faq-a">'+esc(f.a)+'</div></div>';
    }).join('');
    if(!w._b){ w._b=true;
      w.addEventListener('click',function(e){
        var q=e.target.closest('.faq-q'); if(!q) return;
        var it=q.parentElement, open=it.classList.contains('open');
        $$('.faq-item').forEach(function(el){ el.classList.remove('open'); });
        if(!open) it.classList.add('open');
      });
    }
  }

  function fillSelects(){
    var t=$('#fType'); if(t) t.innerHTML='<option value="">请选择歌曲类型</option>'+STYLES.map(function(s){
      return '<option value="'+esc(s.name)+'">'+esc(s.name)+'（'+s.price+'元起）</option>'; }).join('');
    var p=$('#fPlan'); if(p) p.innerHTML='<option value="">请选择版本</option>'+PLANS.map(function(x){
      return '<option value="'+esc(x.name)+'">'+esc(x.name)+' — '+x.price+'元</option>'; }).join('');
    var st=$('#fStyle'); if(st) st.innerHTML='<option value="">不限（我来推荐）</option>'+MUSIC_STYLES.map(function(s){
      return '<option value="'+esc(s)+'">'+esc(s)+'</option>'; }).join('');
  }
  function calcPrice(){
    var pn=$('#fPlan')?$('#fPlan').value:'', rush=$('#fRush')?$('#fRush').value:'';
    var p=PLANS.filter(function(x){ return x.name===pn; })[0];
    var base=p?p.price:0;
    if(rush==='加急'&&base>0) base+=30;
    return base;
  }
  function updateSummary(){
    var t=$('#fType')?$('#fType').value:'', p=$('#fPlan')?$('#fPlan').value:'';
    var a=[]; if(t)a.push(t); if(p)a.push(p);
    var s=$('#sumText'); if(s) s.textContent=a.length?a.join(' · '):'—';
    var pr=$('#sumPrice'); if(pr) pr.textContent=money(calcPrice());
  }
  function genNo(){ var d=new Date(), p=function(n){ return n<10?'0'+n:''+n; };
    return 'AQ'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+p(d.getHours())+p(d.getMinutes())+p(d.getSeconds()); }
  function saveOrder(o){ var l=load(CONFIG.orderKey,[]); l.unshift(o); save(CONFIG.orderKey,l); }

  var mf=$('#orderForm');
  if(mf) mf.addEventListener('submit',function(e){
    e.preventDefault();
    var type=$('#fType').value, plan=$('#fPlan').value;
    var to=$('#fTo').value.trim(), from=$('#fFrom').value.trim();
    var scene=$('#fScene').value.trim(), words=$('#fWords').value.trim();
    var phone=$('#fPhone').value.trim();
    if(!type||!plan){ toast('请先选择歌曲类型和版本'); return; }
    if(!to||!from||!scene||!words){ toast('带 * 的项目都要填哦'); return; }
    if(!/^1[3-9]\d{9}$/.test(phone.replace(/\s|-/g,''))){ toast('手机号格式看起来不太对'); return; }
    var d=new Date(), p=function(n){ return n<10?'0'+n:''+n; }, no=genNo();
    saveOrder({ no:no, type:'歌曲定制', time:d.toISOString(),
      timeText:d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes()),
      songType:type, plan:plan, toWhom:to, fromWhom:from, scene:scene, words:words,
      story:$('#fStory')?$('#fStory').value.trim():'', style:$('#fStyle')?$('#fStyle').value:'',
      rush:$('#fRush')?$('#fRush').value:'', name:from, phone:phone,
      wx:$('#fWx')?$('#fWx').value.trim():'', total:calcPrice(), status:'待跟进' });
    $('#modalOrderNo').textContent=no;
    $('#modalMask').classList.add('on');
    mf.reset(); updateSummary();
  });
  ['#fType','#fPlan','#fRush'].forEach(function(s){ var el=$(s); if(el) el.addEventListener('change',updateSummary); });

  var cart=load(CONFIG.cartKey,[]);
  function cartTotal(){ return cart.reduce(function(s,i){ return s+i.qty*i.price; },0); }
  function cartCount(){ return cart.reduce(function(s,i){ return s+i.qty; },0); }
  function updateBadge(){ var el=$('#cartCount'); if(!el) return;
    var n=cartCount(); el.textContent=n; el.classList.toggle('on',n>0); }
  function renderCart(){
    var body=$('#cartBody'), foot=$('#cartFoot'); if(!body) return;
    if(!cart.length){
      body.innerHTML='<div class="cart-empty"><span>♪</span><p>还没有添加定制需求</p>'+
        '<a href="#price" class="btn btn-line" id="goPrice">去看看价格</a></div>';
      var gp=$('#goPrice'); if(gp) gp.addEventListener('click',closeDrawer);
      if(foot) foot.style.display='none'; return;
    }
    if(foot) foot.style.display='block';
    var ct=$('#cartTotal'); if(ct) ct.textContent=money(cartTotal());
  }
  function openDrawer(){ $('#cartDrawer').classList.add('on'); $('#drawerMask').classList.add('on'); document.body.style.overflow='hidden'; }
  function closeDrawer(){ $('#cartDrawer').classList.remove('on'); $('#drawerMask').classList.remove('on'); document.body.style.overflow=''; }
  if($('#cartBtn')) $('#cartBtn').addEventListener('click',openDrawer);
  if($('#drawerClose')) $('#drawerClose').addEventListener('click',closeDrawer);
  if($('#drawerMask')) $('#drawerMask').addEventListener('click',closeDrawer);
  if($('#modalClose')) $('#modalClose').addEventListener('click',function(){ $('#modalMask').classList.remove('on'); closeDrawer(); });
  if($('#modalMask')) $('#modalMask').addEventListener('click',function(e){ if(e.target===this){ this.classList.remove('on'); closeDrawer(); } });

  var bgmAudio=$('#bgmAudio'), bgmIdx=0, bgmPlaying=false, bgmInit=false;
  function fmt(s){ if(!isFinite(s)||s<0) s=0; var m=Math.floor(s/60), x=Math.floor(s%60); return m+':'+(x<10?'0'+x:x); }
  function renderBgm(){
    var l=$('#bgmList'); if(!l) return;
    l.innerHTML=BGM.map(function(b,i){
      return '<button class="bgm-track'+(i===bgmIdx?' active':'')+'" data-bgm="'+i+'">'+
        '<span class="bt-idx">'+(i+1)+'</span><span class="bt-name">'+esc(b.name)+'</span>'+
        '<span class="bt-eq"><i></i><i></i><i></i></span></button>';
    }).join('');
  }
  function loadBgm(i,play){
    if(!BGM.length) return;
    bgmIdx=(i+BGM.length)%BGM.length;
    bgmAudio.src=BGM[bgmIdx].src;
    $('#bgmTitle').textContent=BGM[bgmIdx].name;
    renderBgm(); if(play) playBgm();
  }
  function playBgm(){
    if(!BGM.length){ $('#bgmState').textContent='暂无音乐文件'; return; }
    bgmAudio.volume=($('#bgmVol').value||45)/100;
    var p=bgmAudio.play();
    if(p&&p.catch){ p.then(function(){ bgmPlaying=true; setBgm(); })
      .catch(function(){ bgmPlaying=false; setBgm(); $('#bgmState').textContent='音乐文件未就绪'; }); }
  }
  function setBgm(){
    var b=$('#bgm'); if(b) b.classList.toggle('playing',bgmPlaying);
    $('#bgmPlay').textContent=bgmPlaying?'❚❚':'▶';
    if(bgmPlaying) $('#bgmState').textContent='正在播放';
    else if(!bgmAudio.src){ $('#bgmState').textContent='请把 mp3 放入 assets/audio/'; $('#bgmTitle').textContent='暂无音乐'; }
    else $('#bgmState').textContent='已暂停';
    renderBgm();
  }
  function toggleBgm(){
    if(bgmPlaying){ bgmAudio.pause(); bgmPlaying=false; setBgm(); }
    else { if(!bgmAudio.src) loadBgm(bgmIdx,false); playBgm(); }
  }
  if($('#bgmToggle')) $('#bgmToggle').addEventListener('click',function(e){
    e.stopPropagation();
    var pnl=$('#bgmPanel'), opening=!pnl.classList.contains('on');
    pnl.classList.toggle('on'); $('#bgm').classList.toggle('opened',opening);
    if(!bgmInit){ bgmInit=true; loadBgm(0,false); }
    if(opening&&!bgmPlaying) playBgm();
  });
  if($('#bgmClose')) $('#bgmClose').addEventListener('click',function(e){ e.stopPropagation(); $('#bgmPanel').classList.remove('on'); });
  document.addEventListener('click',function(e){ if(!e.target.closest('#bgm')) $('#bgmPanel').classList.remove('on'); });
  if($('#bgmPlay')) $('#bgmPlay').addEventListener('click',toggleBgm);
  if($('#bgmPrev')) $('#bgmPrev').addEventListener('click',function(){ loadBgm(bgmIdx-1,true); });
  if($('#bgmNext')) $('#bgmNext').addEventListener('click',function(){ loadBgm(bgmIdx+1,true); });
  if($('#bgmVol')) $('#bgmVol').addEventListener('input',function(){ bgmAudio.volume=this.value/100; });
  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-bgm]'); if(!t) return;
    var i=parseInt(t.getAttribute('data-bgm'),10);
    if(i===bgmIdx&&bgmPlaying) return;
    loadBgm(i,true);
  });
  if(bgmAudio){
    bgmAudio.addEventListener('timeupdate',function(){
      var d=bgmAudio.duration||0, c=bgmAudio.currentTime||0;
      var f=$('#bgmFill'); if(f) f.style.width=(d?c/d*100:0)+'%';
      var cu=$('#bgmCur'); if(cu) cu.textContent=fmt(c);
      var du=$('#bgmDur'); if(du) du.textContent=fmt(d);
    });
    bgmAudio.addEventListener('loadedmetadata',function(){ var du=$('#bgmDur'); if(du) du.textContent=fmt(bgmAudio.duration); });
    bgmAudio.addEventListener('ended',function(){ loadBgm(bgmIdx+1,true); });
    bgmAudio.addEventListener('play',function(){ bgmPlaying=true; setBgm(); });
    bgmAudio.addEventListener('pause',function(){ bgmPlaying=false; setBgm(); });
  }
  if($('#bgmBar')) $('#bgmBar').addEventListener('click',function(e){
    if(!bgmAudio.duration) return;
    var r=this.getBoundingClientRect();
    bgmAudio.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*bgmAudio.duration;
  });
  if($('#bgmList')) $('#bgmList').classList.add('on');
  var firstTry=function(){
    if(bgmPlaying){ document.removeEventListener('click',firstTry); return; }
    if(!bgmAudio.src) loadBgm(0,false);
    if(BGM.length){ bgmAudio.volume=($('#bgmVol').value||45)/100;
      var p=bgmAudio.play(); if(p&&p.then) p.then(function(){ bgmPlaying=true; setBgm(); }).catch(function(){}); }
    document.removeEventListener('click',firstTry);
  };
  document.addEventListener('click',firstTry,{once:true});

  function applyConfig(){
    var C=window.AQI_CONFIG||{};
    if(C.contact){
      var ph=C.contact.phone, pd=C.contact.phoneDisplay||ph;
      if(ph) $$('a[href^="tel:"]').forEach(function(a){ a.setAttribute('href','tel:'+ph); });
      if(pd){ $$('.sc-main').forEach(function(el){ if(el.textContent.indexOf('187')>-1) el.textContent=pd; });
              $$('.os-row b').forEach(function(el){ if(el.textContent.indexOf('187')>-1) el.textContent=pd; }); }
    }
    if(C.ark){
      var box=$('#arkPayCard');
      if(box&&C.ark.enabled===false) box.style.display='none';
      else if(box){
        if(C.ark.chain){ var e1=$('#arkChain'); if(e1) e1.textContent=C.ark.chain; }
        if(C.ark.coin){ var e2=$('#arkCoin'); if(e2) e2.textContent=C.ark.coin; }
        var ae=$('#arkAddr'), cb=$('#arkCopy');
        if(ae){
          if(C.ark.address&&C.ark.address.length>6){ ae.textContent=C.ark.address; ae.classList.add('has-addr'); if(cb) cb.style.display='inline-flex'; }
          else { ae.textContent='待填写 · 请在 config.js 中设置 ark.address'; ae.classList.remove('has-addr'); if(cb) cb.style.display='none'; }
        }
        var q=$('#arkQrImg'), qp=$('#arkQrPh');
        if(C.ark.qrImage&&q){ q.src=C.ark.qrImage; q.onload=function(){ if(qp) qp.style.display='none'; }; }
        if(C.ark.rateText){ var rb=$('#arkRate'), rt=$('#arkRateText'); if(rb) rb.style.display='flex'; if(rt) rt.textContent=C.ark.rateText; }
      }
    }
    if(C.pay){
      var wq=document.querySelector('img[alt="微信收款码"]'); if(wq&&C.pay.wechatQr) wq.src=C.pay.wechatQr;
      var aq=document.querySelector('img[alt="支付宝收款码"]'); if(aq&&C.pay.alipayQr) aq.src=C.pay.alipayQr;
    }
    if(C.bgm&&C.bgm.length){ BGM.length=0; C.bgm.forEach(function(b){ BGM.push(b); }); renderBgm(); }
    if(C.samples&&C.samples.length){ SAMPLES.length=0; C.samples.forEach(function(s){ SAMPLES.push(s); }); renderSamples(); }
  }

  if($('#arkCopy')) $('#arkCopy').addEventListener('click',function(){
    var el=$('#arkAddr'), txt=el?el.textContent.trim():'';
    if(!txt||txt.indexOf('待填写')>-1){ toast('请先在 config.js 里填写 ARK 收款地址'); return; }
    var done=function(){ var b=$('#arkCopy'); b.textContent='已复制 ✓'; b.classList.add('copied');
      setTimeout(function(){ b.textContent='复制'; b.classList.remove('copied'); },1800); };
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(done).catch(function(){
        var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select();
        try{ document.execCommand('copy'); done(); }catch(e){ toast('复制失败，请长按手动复制'); } ta.remove();
      });
    } else {
      var t2=document.createElement('textarea'); t2.value=txt; document.body.appendChild(t2); t2.select();
      try{ document.execCommand('copy'); done(); }catch(e){ toast('复制失败，请长按手动复制'); } t2.remove();
    }
  });

  $$('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=this.getAttribute('href'); if(id==='#'||id.length<2) return;
      var t=document.querySelector(id); if(!t) return;
      e.preventDefault(); window.scrollTo({top:t.offsetTop-72,behavior:'smooth'});
    });
  });

  renderStyles(); renderPrices(); renderSamples(); renderFaq(); fillSelects();
  updateSummary(); updateBadge(); renderCart(); applyConfig(); renderBgm(); setBgm();

  window.MUSICSHOP = { getOrders:function(){ return load(CONFIG.orderKey,[]); },
    clearOrders:function(){ save(CONFIG.orderKey,[]); }, styles:STYLES, plans:PLANS };
})();


