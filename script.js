// script.js — simple generator logic
document.addEventListener('DOMContentLoaded', function () {
  const courseTitle = document.getElementById('courseTitle');
  const shortDesc = document.getElementById('shortDesc');
  const syllabus = document.getElementById('syllabus');
  const lessonsCount = document.getElementById('lessonsCount');
  const generateBtn = document.getElementById('generateBtn');
  const previewArea = document.getElementById('previewArea');
  const downloadBtn = document.getElementById('downloadBtn');
  const langSelect = document.getElementById('lang');

  function sanitizeText(s){ return (s||'').toString().trim(); }

  function generateLessons(title, count, topicsArr){
    const arr = [];
    for(let i=1;i<=count;i++){
      const t = topicsArr[(i-1) % topicsArr.length] || `Lesson ${i}`;
      arr.push({title: `${i}. ${t}`, description: `इस पाठ में आप सीखेंगे — ${t}.`});
    }
    return arr;
  }

  function generateQuestions(topic, lang='hi'){
    // simple sample MCQs generator
    const q = [];
    if(lang === 'hi'){
      q.push({q:`${topic} क्या है?`, opts:['विकल्प A','विकल्प B','विकल्प C','विकल्प D'], ans:1});
      q.push({q:`${topic} में मुख्य चरण कौन-से हैं?`, opts:['चरण 1','चरण 2','चरण 3','सभी'], ans:4});
      q.push({q:`${topic} सीखने का सबसे अच्छा तरीका क्या है?`, opts:['पढ़ना','प्रैक्टिस','देखना','दोनों 1 और 2'], ans:4});
    } else {
      q.push({q:`What is ${topic}?`, opts:['Option A','Option B','Option C','Option D'], ans:1});
      q.push({q:`Which are main steps in ${topic}?`, opts:['Step 1','Step 2','Step 3','All of these'], ans:4});
      q.push({q:`Best way to learn ${topic}?`, opts:['Read','Practice','Watch','Read+Practice'], ans:4});
    }
    return q;
  }

  function buildHtml(data){
    const lessonsHtml = data.lessons.map(l => `<li>${l.title} — <small>${l.description}</small></li>`).join('');
    const questionsHtml = data.questions.map((qq, idx) => {
      const opts = qq.opts.map((o,i) => `<div>${String.fromCharCode(65+i)}. ${o}</div>`).join('');
      return `<div class="qitem"><strong>Q${idx+1}.</strong> ${qq.q} <div style="margin-left:14px">${opts}</div></div>`;
    }).join('<hr/>');

    return `
<div class="generated-wrap">
  <div class="gen-header">
    <div class="gen-title">${escapeHtml(data.title)}</div>
    <div class="gen-sub">${escapeHtml(data.shortDesc)}</div>
  </div>
  <div class="gen-body">
    <h3>Course Overview</h3>
    <p>${escapeHtml(data.shortDesc)}</p>

    <h4>Lessons (${data.lessons.length})</h4>
    <ol class="lesson-list">${lessonsHtml}</ol>

    <h4>Sample Video (Placeholder)</h4>
    <div style="background:#000;padding:18px;border-radius:8px;color:#fff;text-align:center;">Video player placeholder — put video link or embed here</div>

    <div class="qpaper">
      <h4>Sample Question Paper</h4>
      ${questionsHtml}
    </div>

    <div class="phone-banner">
      <div class="phone-call">Call / WhatsApp: 7489416325</div>
      <div style="flex:1;color:#666;">Want custom courses or admin panel? Contact Maya Education for full setup.</div>
    </div>
  </div>
</div>
`.trim();
  }

  function escapeHtml(text){
    return (text || '').replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }

  generateBtn.addEventListener('click', function () {
    const title = sanitizeText(courseTitle.value) || 'Untitled Course';
    const shortD = sanitizeText(shortDesc.value) || 'Course description not provided.';
    const topicsRaw = sanitizeText(syllabus.value) || 'Introduction, Basics, Practice';
    const topicsArr = topicsRaw.split(',').map(s=>s.trim()).filter(Boolean);
    const count = Math.max(1, parseInt(lessonsCount.value) || 5);
    const lang = langSelect.value || 'hi';

    const lessons = generateLessons(title, count, topicsArr);
    const questions = generateQuestions(title, lang);
    const generated = {title, shortDesc: shortD, lessons, questions};

    const html = buildHtml(generated);
    previewArea.innerHTML = html;
    downloadBtn.disabled = false;

    // store for download
    downloadBtn.dataset.html = wrapFullHtml(generated, html);
  });

  downloadBtn.addEventListener('click', function () {
    const content = downloadBtn.dataset.html || '';
    if(!content) return alert('Please generate first.');
    const blob = new Blob([content], {type: 'text/html;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (document.getElementById('courseTitle').value || 'course') + '.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  function wrapFullHtml(data, bodyHtml){
    const titleEsc = escapeHtml(data.title || 'Course');
    return `<!doctype html>
<html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titleEsc}</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
<style>
body{font-family:Montserrat,Arial;color:#222;margin:0;background:#fff;padding:20px;}
.gen-header{background:linear-gradient(90deg,#ff8a00,#ff6f00);color:#fff;padding:18px;border-radius:8px 8px 0 0;}
.gen-title{font-size:24px;margin:0;font-weight:800;}
.gen-sub{opacity:.95;margin-top:6px;}
.gen-body{padding:18px;}
.lesson-list{margin:10px 0;padding-left:18px;}
.qpaper{background:#f9f9fb;padding:12px;border-radius:8px;border:1px solid #eee;margin-top:12px;}
.phone-call{background:#0b2545;color:#fff;padding:10px 14px;border-radius:8px;font-weight:700;display:inline-block;margin-top:12px;}
</style>
</head><body>
${bodyHtml}
</body></html>`;
  }
});
