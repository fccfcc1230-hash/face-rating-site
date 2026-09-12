const people = [
  { name:'林晚', intro:'上海市 · 上海市', gender:'female', ratings:68, score:'8.6', badges:['小美','镜头感'], photo:'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=85', gallery:['https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=500&q=85','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85'] },
  { name:'陈屿', intro:'浙江省 · 杭州市', gender:'male', ratings:42, score:null, badges:['小帅'], photo:'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=900&q=85', gallery:['https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=500&q=85','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=85'] },
  { name:'夏枝', intro:'四川省 · 成都市', gender:'female', ratings:105, score:'8.4', badges:['小美','真人认证'], photo:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=85', gallery:['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=85','https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=85','https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=85'] }
];
const myRatingRecords = [
  {score:9, time:'今天 10:26', valid:true}, {score:8, time:'今天 09:14', valid:true},
  {score:10, time:'昨天 21:43', valid:false, reason:'疑似异常高分'}, {score:8, time:'昨天 18:30', valid:true},
  {score:1, time:'昨天 18:29', valid:false, reason:'疑似恶意低分'}, {score:9, time:'8 月 9 日', valid:true}
];
let current = 0, filter = 'all', rated = 2, myProfileApproved = true, ratingCooling = false, cooldownTimer, cardPhotoIndex = 0, rankScope = 'national';
const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
function toast(text){ const el=$('#toast'); el.textContent=text; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),1900); }
function currentPeople(){ return people.filter(p=>filter==='all'||p.gender===filter); }
function renderCard(){ const list=currentPeople(), p=list[current%list.length], photo=p.gallery[cardPhotoIndex%p.gallery.length]; $('#personPhoto').src=photo; $('#personName').textContent=p.name; $('#personIntro').textContent=p.intro; $('#personCard').dataset.person=people.indexOf(p); }
function switchCardPhoto(step){ const p=currentPeople()[current%currentPeople().length]; cardPhotoIndex=(cardPhotoIndex+step+p.gallery.length)%p.gallery.length; renderCard(); }
function renderProgress(){ $('#quotaValue').textContent=rated; $('#progressText').textContent=`今日已评价 ${rated} / 20`; $('#progressBar').style.width=`${rated*5}%`; $('#modalQuota').textContent=20-rated; }
function renderScores(){ $('#scoreRow').innerHTML=Array.from({length:10},(_,i)=>`<button class="score" data-score="${i+1}">${i+1}</button>`).join(''); $$('.score').forEach(b=>b.onclick=()=>rate(b.dataset.score)); }
function startCooldown(){
  clearInterval(cooldownTimer); ratingCooling=true; let remain=5;
  $$('.score').forEach(b=>b.disabled=true); $('#ratingHint').textContent=`${remain} 秒后可继续评价`;
  cooldownTimer=setInterval(()=>{ remain--; $('#ratingHint').textContent=remain>0?`${remain} 秒后可继续评价`:'匿名评价'; if(remain<=0){clearInterval(cooldownTimer);ratingCooling=false;$$('.score').forEach(b=>b.disabled=false);}},1000);
}
function rate(score){ if(!myProfileApproved){ toast('你的资料审核通过后才可以开始评价'); return; } if(ratingCooling){ toast('请稍后再进行下一次评价'); return; } if(rated>=20){ toast('今日 20 次评价已完成，明天再来吧'); return; } rated++; renderProgress(); toast(`已匿名给出 ${score} 分`); current++; cardPhotoIndex=0; renderCard(); startCooldown(); }
function openProfile(index){ const p=people[index]; $('#modalHero').src=p.photo; $('#modalName').textContent=p.name; $('#modalIntro').textContent=p.intro; $('#modalBadges').innerHTML=p.badges.map(x=>`<span class="badge">✦ ${x}</span>`).join(''); $('#modalRatings').textContent=`${p.ratings} 次`; $('#modalScore').textContent=p.ratings>=50?p.score:'--'; $('#scoreNote').textContent=p.ratings>=50?'平均分基于至少 50 次匿名评价生成。':'已收到 '+p.ratings+' 次评价，累计满 50 次后展示平均分。'; $('#modalGallery').innerHTML=p.gallery.map((x,i)=>`<img src="${x}" alt="${p.name}照片 ${i+1}">`).join(''); $('#profileModal').classList.add('show'); }
function renderRank(){
  const location={province:'上海市',city:'上海市'};
  const labels={national:'全国榜 · 仅展示有效、已审核资料',province:`${location.province}榜 · 仅展示本省已审核资料`,city:`${location.city}榜 · 仅展示本市已审核资料`};
  let ranked=people.filter(x=>x.ratings>=50);
  if(rankScope==='province') ranked=ranked.filter(x=>x.intro.split(' · ')[0]===location.province);
  if(rankScope==='city') ranked=ranked.filter(x=>x.intro.split(' · ')[1]===location.city);
  ranked.sort((a,b)=>Number(b.score)-Number(a.score)); $('#rankScopeText').textContent=labels[rankScope];
  $('#rankList').innerHTML=ranked.length?ranked.map((p,i)=>`<article class="rank-row" data-person="${people.indexOf(p)}"><span>${i+1}</span><img src="${p.photo}" alt="${p.name}"><div><b>${p.name}</b><small>${p.intro} · ${p.ratings} 人评价</small></div><em>${p.score}</em></article>`).join(''):'<div class="empty-rank">暂无符合条件的上榜用户</div>';
  $$('.rank-row').forEach(x=>x.onclick=()=>openProfile(x.dataset.person));
}
function renderMyRatings(){
  const valid=myRatingRecords.filter(x=>x.valid), excluded=myRatingRecords.filter(x=>!x.valid);
  const historicalValid=126, historicalTotal=130, historicalScore=8.6;
  $('#myAverageScore').textContent=historicalScore.toFixed(1); $('#myScoreStatus').textContent=`基于 ${historicalValid} 次有效匿名评价`;
  $('#validRatingCount').textContent=historicalValid; $('#excludedRatingCount').textContent=historicalTotal-historicalValid;
  $('#recentRatingList').innerHTML=myRatingRecords.map(x=>`<div class="recent-rating ${x.valid?'':'excluded'}"><span class="rating-number">${x.score} 分</span><div><b>${x.valid?'已计入综合评分':'未计入综合评分'}</b><small>${x.valid?'匿名用户评分 · '+x.time:(x.reason+' · '+x.time)}</small></div><span class="rating-state">${x.valid?'有效':'已排除'}</span></div>`).join('');
}
const myPhotos=['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=85','https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=85','https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=85'];
function renderUploads(){ $('#photoCount').textContent=`${myPhotos.length} / 3 张`; $('#uploadGrid').innerHTML=myPhotos.map((x,i)=>`<div class="upload-photo ${i===0?'front-photo':''}"><img src="${x}" alt="我的照片 ${i+1}">${i===0?'<span>正面五官照</span>':''}</div>`).join(''); }
$('#photoInput').onchange=e=>{ [...e.target.files].forEach(f=>myPhotos.push(URL.createObjectURL(f))); renderUploads(); toast('照片已添加，请提交人工审核'); };
$('#videoInput').onchange=e=>{ if(e.target.files[0]){ $('#videoLabel').textContent='视频已选择，待审核'; toast('视频已添加，请一并提交审核'); }};
$('#submitReviewBtn').onclick=()=>{ if(myPhotos.length<3){toast('请至少上传 3 张照片后再提交'); return;} myProfileApproved=false; $('#reviewCard').classList.add('pending'); $('#reviewTitle').textContent='资料正在人工审核'; $('#reviewText').textContent='审核通过前，你不能开始评价，也不会进入发现页。'; $('#submitReviewBtn').textContent='审核中'; $('#submitReviewBtn').disabled=true; toast('已提交人工审核'); };
$$('.chip').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;current=0;cardPhotoIndex=0;$$('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderCard();});
$$('[data-rank-scope]').forEach(b=>b.onclick=()=>{rankScope=b.dataset.rankScope;$$('[data-rank-scope]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderRank();});
$$('.nav-item').forEach(b=>b.onclick=()=>{$$('.nav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+b.dataset.screen).classList.add('active');});
$('#personCard').onclick=()=>openProfile($('#personCard').dataset.person); $('#personCard').onkeydown=e=>{if(e.target===e.currentTarget&&e.key==='Enter')openProfile($('#personCard').dataset.person)}; $('#quotaBtn').onclick=()=>$('#quotaModal').classList.add('show'); $$('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).classList.remove('show'));
$('#prevPhotoBtn').onclick=e=>{e.stopPropagation();switchCardPhoto(-1)}; $('#nextPhotoBtn').onclick=e=>{e.stopPropagation();switchCardPhoto(1)};
$('#agreeBtn').onclick=()=>$('#consentScreen').classList.add('hide');
$('#declineBtn').onclick=()=>{ $('#consentScreen').classList.add('hide'); $('#exitScreen').classList.add('show'); try{ window.close(); }catch(e){} };
renderCard(); renderScores(); renderProgress(); renderRank(); renderMyRatings(); renderUploads(); $('#myBadges').innerHTML=['✓ 真人审核','✦ 小美','◉ 连续评价 7 天'].map(x=>`<span class="badge">${x}</span>`).join('');
