class Component extends DCLogic{
  state={dark:(this.props.theme??"light")==="dark",sec:0,prev:0,risen:false,rot:0,cat:"All",shownCat:"All",skIn:true,active:0,tick:0,taStep:0,taChars:0,sent:false,sending:false,jm:[["Python",86],["SQL",72],["AWS",63],["React",55],["Docker",47],["PyTorch",41]],week:41};
  rootRef=React.createRef();auroraRef=React.createRef();starsRef=React.createRef();orbRef=React.createRef();rippleRef=React.createRef();phoneWrap=React.createRef();phoneScale=React.createRef();hintRef=React.createRef();orbitRef=React.createRef();nameRef=React.createRef();counterRef=React.createRef();cursorRef=React.createRef();tabsRef=React.createRef();tabPill=React.createRef();heroRef=React.createRef();rotBox=React.createRef();revealRef=React.createRef();segRef=React.createRef();segPill=React.createRef();phoneRef=React.createRef();folioImg=React.createRef();sheenRef=React.createRef();nhlRef=React.createRef();nhlNum=React.createRef();nhlPer=React.createRef();
  mx=-9999;my=-9999;cur={x:0,y:0};orb={x:600,y:400};stir={x:.3,y:.3};surge=0;pSm=0;
  componentDidMount(){
    this.onMove=e=>{this.mx=e.clientX;this.my=e.clientY;};window.addEventListener("mousemove",this.onMove);
    this.onKey=e=>{if(/INPUT|TEXTAREA/.test(document.activeElement?.tagName||""))return;if(e.key==="ArrowRight"||e.key==="ArrowDown")this.go(Math.min(4,this.state.sec+1));if(e.key==="ArrowLeft"||e.key==="ArrowUp")this.go(Math.max(0,this.state.sec-1));};window.addEventListener("keydown",this.onKey);
    this.onWheel=e=>{const sc=e.target.closest&&e.target.closest("[data-sec]");if(sc&&sc.scrollHeight>sc.clientHeight+4){const atTop=sc.scrollTop<=0,atBot=sc.scrollTop+sc.clientHeight>=sc.scrollHeight-2;if(!((e.deltaY>0&&atBot)||(e.deltaY<0&&atTop)))return;}const n=performance.now();if(Math.abs(e.deltaY)<14||n-(this.lastWheel||0)<1100)return;this.lastWheel=n;this.go(Math.max(0,Math.min(4,this.state.sec+(e.deltaY>0?1:-1))));};window.addEventListener("wheel",this.onWheel,{passive:true});
    this.onResize=()=>{this._lc=null;this._lr=null;this._ls=null;};window.addEventListener("resize",this.onResize);
    this.stars=Array.from({length:200},()=>({x:Math.random(),y:Math.random(),z:Math.random(),tw:Math.random()*6.28}));
    this.blobs=[[.22,.3],[.72,.25],[.55,.72],[.18,.78],[.88,.62]].map(([x,y],i)=>({x,y,ph:i*1.7}));
    this.t0=performance.now();this.actStart=performance.now();this.secStart=performance.now();this.raf=requestAnimationFrame(this.loop);
    setTimeout(()=>this.setState({risen:true}),250);
    this.rotT=setInterval(()=>this.setState(s=>({rot:(s.rot+1)%ROT.length})),2600);
    this.tickT=setInterval(()=>this.setState(s=>({tick:s.tick+1})),1500);
    this.jmT=setInterval(()=>this.setState(s=>({week:s.week+1,jm:s.jm.map(([n,v])=>[n,Math.max(18,Math.min(95,Math.round(v+(Math.random()-.5)*26)))])})),2400);
    this.resetNhl();
    document.fonts&&document.fonts.ready.then(()=>{this._lc=null;this._lr=null;this._ls=null;});
  }
  componentWillUnmount(){cancelAnimationFrame(this.raf);clearInterval(this.rotT);clearInterval(this.tickT);clearInterval(this.jmT);this.clearTa();window.removeEventListener("mousemove",this.onMove);window.removeEventListener("keydown",this.onKey);window.removeEventListener("wheel",this.onWheel);window.removeEventListener("resize",this.onResize);}
  go(i,fromEl){
    if(i===this.state.sec)return;
    const r=this.rootRef.current;if(!r)return;
    const btn=fromEl||r.querySelector(`[data-tab="${i}"]`);const rp=this.rippleRef.current;
    if(btn&&rp){const b=btn.getBoundingClientRect();rp.style.left=(b.left+b.width/2)+"px";rp.style.top=(b.top+b.height/2)+"px";rp.style.transition="none";rp.style.opacity="0.7";rp.style.transform="scale(0.2)";void rp.offsetWidth;rp.style.transition="transform 1.3s cubic-bezier(.2,.8,.2,1),opacity 1.3s ease-out";rp.style.transform=`scale(${Math.max(innerWidth,innerHeight)/26})`;rp.style.opacity="0";}
    this.surge=1;this.secStart=performance.now();
    this.setState(s=>({prev:s.sec,sec:i}));
    const sec=r.querySelector(`[data-sec="${i}"]`);
    if(sec){sec.scrollTop=0;const els=sec.querySelectorAll("[data-st]");els.forEach(el=>{el.style.transition="none";el.style.opacity="0";el.style.transform="translateY(34px)";el.style.filter="blur(10px)";});void sec.offsetWidth;els.forEach((el,k)=>{const d=180+k*70;el.style.transition=`opacity .8s ${d}ms,transform 1s ${d}ms cubic-bezier(.2,.8,.2,1),filter .8s ${d}ms`;el.style.opacity="1";el.style.transform="none";el.style.filter="none";});}
    if(i===0){this.setState({risen:false});setTimeout(()=>this.setState({risen:true}),80);}if(i===3){this.actStart=performance.now();if(this.state.active===2)this.runTa();}
    if(i===2)this.pickCat(this.state.cat,true);
  }
  homeFx(now,t,M){const hero=this.heroRef.current,nm=this.nameRef.current,ob=this.orbitRef.current;if(!hero||!nm||!ob)return;const hr=hero.getBoundingClientRect(),nr=nm.getBoundingClientRect();const cx=nr.left+nr.width/2-hr.left,cy=nr.top+nr.height/2-hr.top;
    const mi=this.mx>-9000;const mxn=mi?this.mx/innerWidth-0.5:0,myn=mi?this.my/innerHeight-0.5:0;this.tiltS=this.tiltS||{a:0,b:0};const ta=mi?mxn*2*0.16:-0.06,tb=mi?0.55+myn*0.3:0.55;this.tiltS.a+=(ta-this.tiltS.a)*0.03;this.tiltS.b+=(tb-this.tiltS.b)*0.03;
    this.orbA=(this.orbA||0)+0.0035*M*(1+this.surge*4);const ent=Math.max(0,Math.min(1,(now-this.secStart-500)/1400));
    const rx=Math.min(nr.width/2+230,innerWidth*0.48),ry=nr.height*0.55*this.tiltS.b;const ux=e=>{const ks=e.children.length?[...e.children]:[e];let l=1e9,r=-1e9,t=1e9,bb=-1e9;ks.forEach(k=>{const q=k.getBoundingClientRect();if(!q.width)return;l=Math.min(l,q.left);r=Math.max(r,q.right);t=Math.min(t,q.top);bb=Math.max(bb,q.bottom);});return{l:l-hr.left-24,r:r-hr.left+24,t:t-hr.top-12,b:bb-hr.top+12};};if(!this._bk||now-this._bkT>500){this._bkT=now;this._bk=[...hero.querySelectorAll("[data-st]")].map(ux).concat([ux(nm)]);}const blocks=this._bk,rot=this.tiltS.a;const items=ob.querySelectorAll("[data-orbit]"),n=items.length;
    items.forEach((el,i)=>{const th=this.orbA+i*6.2832/n;const ex=Math.cos(th)*rx,ey=Math.sin(th)*ry;const X=ex*Math.cos(rot)-ey*Math.sin(rot),Y=ex*Math.sin(rot)+ey*Math.cos(rot);const z=(Math.sin(th)+1)/2;const sc=0.72+z*0.38;const px=cx+X,py=cy+Y;const hit=blocks.some(q=>px>q.l&&px<q.r&&py>q.t&&py<q.b);el._f=(el._f??1)+((hit?0.12:1)-(el._f??1))*0.12;el.style.opacity=((0.28+z*0.72)*ent*el._f).toFixed(3);el.style.zIndex=z>0.5?"2":"0";el.style.transform=`translate(${(cx+X-el.offsetWidth/2).toFixed(1)}px,${(cy+Y-el.offsetHeight/2).toFixed(1)}px) scale(${(sc*(0.8+0.2*ent)).toFixed(3)})`;});
    nm.querySelectorAll("[data-mag]").forEach(el=>{const r=el.getBoundingClientRect();const st=el._m||(el._m={y:0,s:1});const ccx=r.left+r.width/2,ccy=r.top+r.height/2-st.y;const d=mi?Math.hypot(this.mx-ccx,this.my-ccy):999;const f=Math.max(0,1-d/180);const ty=-f*f*18,ts=1+f*0.05;st.y+=(ty-st.y)*0.15;st.s+=(ts-st.s)*0.15;el.style.transform=`translateY(${st.y.toFixed(2)}px) scale(${st.s.toFixed(3)})`;});}
  applyTheme(){const r=this.rootRef.current;if(!r)return;const k=this.state.dark?"dark":"light",T=THEMES[k];for(const v in T)r.style.setProperty(v,T[v]);document.body.style.background=T["--bg"];this.c={...T,blobs:BLOBS[k],dark:this.state.dark};if(this.orbRef.current)this.orbRef.current.style.opacity="0";}
  place(container,btn,pill,pad){if(!container||!btn||!pill)return;pill.style.width=btn.offsetWidth+"px";pill.style.height=btn.offsetHeight+"px";pill.style.top=btn.offsetTop+"px";pill.style.transform=`translateX(${btn.offsetLeft}px)`;}
  sizeRot(){const b=this.rotBox.current;if(!b)return;const el=b.querySelector(`[data-rot="${this.state.rot}"]`);if(el)b.style.width=el.offsetWidth+"px";}
  pickCat(c,force){if(c===this.state.cat&&!force)return;this.setState({cat:c,skIn:false});clearTimeout(this.skT);this.skT=setTimeout(()=>{this.setState({shownCat:c});requestAnimationFrame(()=>requestAnimationFrame(()=>this.setState({skIn:true})));},force?300:380);}
  pick(i){this.actStart=performance.now();this.setState({active:i});if(i===2)this.runTa();}
  clearTa(){(this.taTimers||[]).forEach(clearTimeout);clearInterval(this.streamT);this.taTimers=[];}
  runTa(){this.clearTa();const T=(ms,f)=>this.taTimers.push(setTimeout(f,ms));this.setState({taStep:0,taChars:0});T(500,()=>this.setState({taStep:1}));T(1300,()=>this.setState({taStep:2}));T(2300,()=>{this.setState({taStep:3});this.streamT=setInterval(()=>this.setState(s=>s.taChars>=ANSWER.length?(clearInterval(this.streamT),{taStep:4}):{taChars:s.taChars+2}),24);});}
  resetNhl(){const p=[.5];for(let i=1;i<120;i++){let v=p[i-1]+(Math.random()-.47)*.06;if(i%23===0)v+=Math.random()>.4?.14:-.12;p.push(Math.max(.06,Math.min(.94,v)));}this.nhl={p,start:performance.now()};}
  sz(cv,res){const d=res||Math.min(2,devicePixelRatio||1),w=cv.offsetWidth,h=cv.offsetHeight,W=Math.max(1,Math.round(w*d)),H=Math.max(1,Math.round(h*d));if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}const x=cv.getContext("2d");x.setTransform(d,0,0,d,0,0);return[x,w,h];}
  loop=()=>{
    this.raf=requestAnimationFrame(this.loop);const root=this.rootRef.current;if(!root)return;
    const S=this.state;
    if(S.dark!==this._ld){this._ld=S.dark;this.applyTheme();}
    if(S.cat!==this._lc){const b=this.segRef.current?.querySelector(`[data-seg="${CATS.indexOf(S.cat)}"]`);if(b&&b.offsetWidth){this._lc=S.cat;this.place(this.segRef.current,b,this.segPill.current);}}
    if(S.sec!==this._ls){const b=this.tabsRef.current?.querySelector(`[data-tab="${S.sec}"]`);if(b&&b.offsetWidth){this._ls=S.sec;this.place(this.tabsRef.current,b,this.tabPill.current);}}
    {const sm=innerHeight<720;if(this.hintRef.current)this.hintRef.current.style.display=sm?"none":"block";if(this.counterRef.current)this.counterRef.current.style.display=sm?"none":"flex";}if(S.rot!==this._lr){this._lr=S.rot;this.sizeRot();}
    const c=this.c;if(!c)return;const now=performance.now(),t=(now-this.t0)/1000,M=this.props.motion??1;
    this.surge*=0.965;const sp=1+this.surge*5;this.tt=(this.tt||0)+(1/60)*M*sp;const T2=this.tt;
    root.querySelectorAll("[data-shimmer]").forEach(el=>{el.style.backgroundPosition=`${(t*14)%300}% 0`;});
    this.pSm+=(S.sec/4-this.pSm)*0.04;const p=this.pSm;
    const av=this.auroraRef.current;
    if(av){const [x,W,H]=this.sz(av,0.12);x.globalCompositeOperation="source-over";x.fillStyle=c["--bg"];x.fillRect(0,0,W,H);x.globalCompositeOperation=c.dark?"lighter":"source-over";
      const mi=this.mx>-9000;if(mi){this.stir.x+=(this.mx/innerWidth-this.stir.x)*0.025;this.stir.y+=(this.my/innerHeight-this.stir.y)*0.025;}
      this.blobs.forEach((b,i)=>{let bx=b.x+Math.sin(T2*0.21+b.ph+p*5)*0.16,by=b.y+Math.cos(T2*0.17+b.ph*1.3+p*6)*0.16;if(i===0&&mi){bx=this.stir.x;by=this.stir.y;}
        const R=Math.max(W,H)*(0.36+0.06*Math.sin(t*0.5+i)+this.surge*0.08);const X=bx*W,Y=by*H;const col=c.blobs[(i+S.sec)%c.blobs.length];const g=x.createRadialGradient(X,Y,0,X,Y,R);g.addColorStop(0,col+(c.dark?"aa":"d0"));g.addColorStop(1,col+"00");x.fillStyle=g;x.beginPath();x.arc(X,Y,R,0,6.28);x.fill();});
      av.style.opacity=c.dark?"0.75":"1";}
    const sv=this.starsRef.current;
    if(sv){const [x,W,H]=this.sz(sv);x.clearRect(0,0,W,H);
      const fx=this.props.darkFx??"stars";if(c.dark&&fx!=="trail"){const m={x:this.mx,y:this.my};const pts=this.stars.map(s=>[((s.x-p*s.z*0.25)%1+1)%1*W-(this.mx>-9000?(this.mx-W/2)*s.z*0.02:0),s.y*H,s]);
        const near=pts.map(q=>[q,Math.hypot(q[0]-m.x,q[1]-m.y)]).filter(a=>a[1]<170).sort((a,b)=>a[1]-b[1]).slice(0,6);
        near.forEach(([q,d],i)=>{x.strokeStyle=`rgba(200,215,255,${(0.45*(1-d/170)).toFixed(3)})`;x.lineWidth=1;x.beginPath();x.moveTo(m.x,m.y);x.lineTo(q[0],q[1]);x.stroke();if(i){const r=near[i-1][0];x.strokeStyle=`rgba(200,215,255,${(0.18*(1-d/170)).toFixed(3)})`;x.beginPath();x.moveTo(r[0],r[1]);x.lineTo(q[0],q[1]);x.stroke();}});
        pts.forEach(([px,py,s])=>{const tw=0.45+0.55*Math.sin(t*(1+s.z*2)+s.tw);const n=Math.max(0,1-Math.hypot(px-m.x,py-m.y)/170);x.fillStyle=`rgba(235,240,255,${(0.12+s.z*0.5*tw+n*0.5).toFixed(3)})`;x.beginPath();x.arc(px,py,0.5+s.z*1.2+n,0,6.28);x.fill();});
        }if(c.dark&&fx!=="stars"){const tr=this.trail||(this.trail=[]);const sp=this.sparks||(this.sparks=[]);if(this.mx>-9000){const l=tr[tr.length-1];const dd=l?Math.hypot(l.x-this.mx,l.y-this.my):99;if(dd>1.5){tr.push({x:this.mx,y:this.my,t:now});if(Math.random()<Math.min(0.9,dd/30))sp.push({x:this.mx,y:this.my,vx:(Math.random()-.5)*1.4,vy:(Math.random()-.5)*1.4-0.3,b:now,h:(t*90)%360});}}while(tr.length&&now-tr[0].t>700)tr.shift();if(tr.length>70)tr.splice(0,tr.length-70);while(sp.length&&now-sp[0].b>1100)sp.shift();if(sp.length>120)sp.splice(0,sp.length-120);x.globalCompositeOperation="lighter";x.lineCap="round";x.lineJoin="round";for(let i=1;i<tr.length;i++){const a=tr[i-1],b=tr[i];const k=i/tr.length;const age=Math.max(0,1-(now-b.t)/700);const hue=(t*90+i*8)%360;x.strokeStyle=`hsla(${hue.toFixed(0)},100%,66%,${(age*0.9).toFixed(3)})`;x.shadowColor=`hsla(${hue.toFixed(0)},100%,60%,${age.toFixed(3)})`;x.shadowBlur=16;x.lineWidth=1+k*7*age;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}x.shadowBlur=0;sp.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=0.02;const a=1-(now-q.b)/1100;x.fillStyle=`hsla(${q.h.toFixed(0)},100%,72%,${(a*0.9).toFixed(3)})`;x.beginPath();x.arc(q.x,q.y,0.6+a*1.8,0,6.28);x.fill();});x.globalCompositeOperation="source-over";}}
    const cr=this.cursorRef.current;
    if(cr){if(this.mx>-9000&&(this.props.cursor??false)){this.cur.x+=(this.mx-this.cur.x)*0.2;this.cur.y+=(this.my-this.cur.y)*0.2;if(!this.hc||now-this.hc>80){this.hc=now;const el=document.elementFromPoint(this.mx,this.my);const big=!!(el&&el.closest&&el.closest("a,button,input,textarea,[data-tilt]"));if(big!==this.big){this.big=big;cr.style.width=cr.style.height=big?"58px":"34px";cr.style.margin=big?"-29px 0 0 -29px":"-17px 0 0 -17px";}}cr.style.opacity="1";cr.style.transform=`translate(${this.cur.x.toFixed(1)}px,${this.cur.y.toFixed(1)}px)`;}else cr.style.opacity="0";}
    if(S.sec===0)this.homeFx(now,t,M);if(S.sec===0){const hero=this.heroRef.current;if(hero)hero.querySelectorAll("[data-orb]").forEach((o,i)=>{const d=+o.dataset.orb;const px=this.mx>-9000?(this.mx-innerWidth/2)*d*0.04:0,py=this.mx>-9000?(this.my-innerHeight/2)*d*0.04:0;o._x=(o._x||0)+(px-(o._x||0))*0.05;o._y=(o._y||0)+(py-(o._y||0))*0.05;o.style.transform=`translate(${o._x.toFixed(1)}px,${(o._y+Math.sin(t*0.8+i*1.9)*14).toFixed(1)}px)`;});}
    if(S.sec===1){const rv=this.revealRef.current;if(rv){const prog=Math.min(1,Math.max(0,(now-this.secStart-350)/2600));const ws=rv.querySelectorAll("[data-w]");const n=ws.length;ws.forEach((w,i)=>{const a=Math.max(0,Math.min(1,prog*n*1.15-i));w.style.opacity=(0.18+0.82*a).toFixed(3);w.style.transform=`translateY(${((1-a)*6).toFixed(1)}px)`;});}
      root.querySelectorAll("[data-tilt]").forEach(el=>{const r=el.getBoundingClientRect();const inside=this.mx>=r.left&&this.mx<=r.right&&this.my>=r.top&&this.my<=r.bottom;const rx=inside?((this.my-r.top)/r.height-0.5)*-8:0,ry=inside?((this.mx-r.left)/r.width-0.5)*10:0;el._rx=(el._rx||0)+(rx-(el._rx||0))*0.1;el._ry=(el._ry||0)+(ry-(el._ry||0))*0.1;el.style.transform=`perspective(900px) rotateX(${el._rx.toFixed(2)}deg) rotateY(${el._ry.toFixed(2)}deg)`;});}
    if(S.sec!==1&&this._lastSec===1){const rv=this.revealRef.current;rv&&rv.querySelectorAll("[data-w]").forEach(w=>{w.style.opacity="0.18";});}
    this._lastSec=S.sec;
    if(S.sec===3){const el=now-this.actStart;root.querySelectorAll("[data-prog]").forEach(b=>{b.style.width=(+b.dataset.prog===S.active?Math.min(100,el/DUR*100):0).toFixed(2)+"%";});if(el>DUR)this.pick((S.active+1)%PROJ.length);
      const pw=this.phoneWrap.current,psc=this.phoneScale.current;if(pw&&psc){const z=Math.min(1,(pw.offsetHeight-50)/534);psc.style.transform=`scale(${z.toFixed(3)})`;}const ph=this.phoneRef.current;if(ph){const r=ph.getBoundingClientRect();const ry=Math.max(-1,Math.min(1,(this.mx-(r.left+r.width/2))/innerWidth*2))*16,rx=Math.max(-1,Math.min(1,(this.my-(r.top+r.height/2))/innerHeight*2))*-10;ph._x=(ph._x||0)+(rx-(ph._x||0))*0.06;ph._y=(ph._y||0)+(ry-(ph._y||0))*0.06;ph.style.transform=`rotateX(${ph._x.toFixed(2)}deg) rotateY(${ph._y.toFixed(2)}deg) translateY(${(Math.sin(t*1.1)*7).toFixed(1)}px)`;}
      const fi=this.folioImg.current;if(fi&&fi.naturalHeight){const over=Math.max(0,fi.offsetHeight-fi.parentElement.offsetHeight);fi.style.transform=`translateY(${(-(0.5-0.5*Math.cos(t*0.4))*over).toFixed(1)}px)`;}
      if(this.sheenRef.current)this.sheenRef.current.style.transform=`translateX(${(((t*0.35)%1.6)*1100-260).toFixed(0)}px)`;
      const nc=this.nhlRef.current;
      if(nc&&S.active===4){const [x,W,H]=this.sz(nc);x.clearRect(0,0,W,H);const P=this.nhl.p,e=(now-this.nhl.start)/1000,pr=Math.min(1,e/8);if(e>11)this.resetNhl();
        x.strokeStyle=c["--line"];x.lineWidth=1;[.25,.5,.75].forEach(g=>{x.beginPath();x.moveTo(0,H*g);x.lineTo(W,H*g);x.stroke();});
        const n=Math.max(2,Math.floor(pr*(P.length-1))+1);const path=()=>{x.beginPath();for(let i=0;i<n;i++){const px=i/(P.length-1)*W,py=H*(1-P[i]);i?x.lineTo(px,py):x.moveTo(px,py);}};
        const gr=x.createLinearGradient(0,0,W,0);gr.addColorStop(0,"#7c3aed");gr.addColorStop(.5,"#2563eb");gr.addColorStop(1,"#0d9488");
        const lx=(n-1)/(P.length-1)*W,ly=H*(1-P[n-1]);path();x.lineTo(lx,H);x.lineTo(0,H);x.closePath();const fg=x.createLinearGradient(0,0,0,H);fg.addColorStop(0,"rgba(37,99,235,.22)");fg.addColorStop(1,"rgba(37,99,235,0)");x.fillStyle=fg;x.fill();
        path();x.strokeStyle=gr;x.lineWidth=3;x.lineJoin="round";x.stroke();x.fillStyle="#2563eb";x.beginPath();x.arc(lx,ly,5,0,6.28);x.fill();x.globalAlpha=.25;x.beginPath();x.arc(lx,ly,12+Math.sin(t*4)*3,0,6.28);x.fill();x.globalAlpha=1;
        if(this.nhlNum.current)this.nhlNum.current.textContent="VAN "+Math.round(P[n-1]*100)+"%";if(this.nhlPer.current)this.nhlPer.current.textContent=pr>=1?"Final":"Period "+Math.min(3,Math.floor(pr*3)+1);}}
  };
  renderVals(){
    const s=this.state,A=s.active;
    const vs=i=>{if(i===s.sec)return{o:1,tf:"none",b:0,pe:"auto"};const dir=i<s.sec?-1:1;const wasPrev=i===s.prev;return{o:0,tf:`translateX(${dir*(wasPrev?60:30)}px) scale(${wasPrev?0.94:0.97})`,b:wasPrev?16:10,pe:"none"};};
    const list=s.shownCat==="All"?Object.values(SK).flat():SK[s.shownCat];
    const st=i=>i===A?{o:1,y:0,s:1,b:0,pe:"auto"}:{o:0,y:i<A?-40:40,s:.94,b:12,pe:"none"};
    const phase=s.tick%5,done=Math.min(3,phase),pct=.18+done*.273;
    const sorted=[...s.jm].sort((a,b)=>b[1]-a[1]);
    const go=i=>e=>this.go(i,e&&e.currentTarget);
    return{rootRef:this.rootRef,auroraRef:this.auroraRef,starsRef:this.starsRef,orbRef:this.orbRef,rippleRef:this.rippleRef,cursorRef:this.cursorRef,tabsRef:this.tabsRef,tabPill:this.tabPill,heroRef:this.heroRef,rotBox:this.rotBox,revealRef:this.revealRef,segRef:this.segRef,segPill:this.segPill,phoneRef:this.phoneRef,phoneWrap:this.phoneWrap,phoneScale:this.phoneScale,hintRef:this.hintRef,orbitRef:this.orbitRef,nameRef:this.nameRef,counterRef:this.counterRef,folioImg:this.folioImg,sheenRef:this.sheenRef,nhlRef:this.nhlRef,nhlNum:this.nhlNum,nhlPer:this.nhlPer,
      themeIcon:s.dark?"☀":"☾",toggleTheme:()=>this.setState(x=>({dark:!x.dark})),
      tabs:TABS.map((name,i)=>({name,i,go:go(i),color:s.sec===i?"var(--bg)":"var(--mut2)"})),
      goHome:go(0),goWork:go(3),goContact:go(4),
      secNum:"0"+(s.sec+1),secPct:(s.sec+1)*20,
      v0:vs(0),v1:vs(1),v2:vs(2),v3:vs(3),v4:vs(4),
      orbs:[{x:9,y:18,s:110,d:1.4},{x:85,y:60,s:140,d:0.9},{x:14,y:72,s:60,d:2.6}],orbOp:s.dark?0.35:1,
      nameChars:"Viktor Blais.".split("").map((c,i)=>({c,y:s.risen?0:90,o:s.risen?1:0,b:s.risen?0:14,tr:s.risen?`transform 1.2s cubic-bezier(.2,.8,.2,1) ${i*55}ms,opacity 1.2s ${i*55}ms,filter 1.2s ${i*55}ms`:"none"})),orbit:["Python","PyTorch","React","TypeScript","AWS","C++","Supabase","Next.js","PostgreSQL","TensorFlow"],
      rot:ROT.map((t,i)=>({t,y:i===s.rot?0:(i===(s.rot+ROT.length-1)%ROT.length?-1:1),o:i===s.rot?1:0,b:i===s.rot?0:8})),
      chips:PROJ.map((p,i)=>({t:p.t,s:p.s,go:e=>{this.setState({active:i});this.go(3,e&&e.currentTarget);this.actStart=performance.now();if(i===2)this.runTa();}})),
      aboutWords:ABOUT,
      focus:[{n:"01",t:"AI & Machine Learning",d:"From data pipelines to deployed models. I study the architectures, then wire them into real products."},{n:"02",t:"Mobile apps",d:"Responsive, intuitive apps with clean UX that hold up on every device. One is live on the App Store."},{n:"03",t:"Cybersecurity",d:"Hands-on labs, web vulnerabilities, and writing code that's harder to break."}],
      cats:CATS.map((name,i)=>({name,i,pick:()=>this.pickCat(name),color:s.cat===name?"var(--bg)":"var(--fg)"})),
      skills:list.map((n,i)=>({n,y:s.skIn?0:24,sc:s.skIn?1:.9,o:s.skIn?1:0,b:s.skIn?0:8,d:s.skIn?i*35:i*12})),
      skillCount:list.length+(s.shownCat==="All"?" tools across 4 categories":" in "+s.shownCat),
      projects:PROJ.map((p,i)=>({...p,i,pick:()=>this.pick(i),tc:i===A?"var(--fg)":"var(--mut)",rows:i===A?"1fr":"0fr",o:i===A?1:0,y:i===A?0:-10,barOp:i===A?1:0})),
      s0:st(0),s1:st(1),s2:st(2),s3:st(3),s4:st(4),phoneZoom:1,
      ring:(421*(1-pct)).toFixed(1),ringPct:Math.round(pct*100)+"%",notifTop:phase===4?44:-90,
      habits:HAB.map((t,i)=>{const on=i<done;return{t,c:on?"#86868b":"#f5f5f7",bg:on?"#5eead4":"transparent",b:on?"#5eead4":"#48484a",s:on?1:.85};}),
      showQ:s.taStep>=1,showTyping:s.taStep===2,showA:s.taStep>=3,aText:ANSWER.slice(0,s.taChars),
      jm:s.jm.map(([n,v])=>{const r=sorted.findIndex(q=>q[0]===n);return{n,v,top:r*52,c:r===0?"linear-gradient(90deg,#7c3aed,#2563eb)":"var(--mut)"};}),jmH:s.jm.length*52,jmWeek:"Week "+s.week,
      notSent:!s.sent,sent:s.sent,btnLabel:s.sending?"Sending…":"Send message",btnOp:s.sending?.6:1,
      submit:e=>{e.preventDefault();this.setState({sending:true});setTimeout(()=>this.setState({sending:false,sent:true}),1300);},
      reset:()=>this.setState({sent:false})};
  }
}