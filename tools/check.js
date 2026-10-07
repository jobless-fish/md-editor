// 배포 전 점검.  실행:  node tools/check.js
// 깨진 파일이 사이트에 올라가지 않도록 GitHub Actions 가 배포 직전에 돌립니다.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const PAGES = ['index.html', '404.html'];
const FILES = [...PAGES, 'logo/md-editor-logo.svg', 'logo/md-editor-mark.svg'];

let bad = 0;
const ok = m => console.log('  ✓ ' + m);
const fail = m => { console.error('  ✗ ' + m); bad++; };

console.log('1) 필요한 파일');
for (const f of FILES) {
  const p = path.join(root, f);
  if (fs.existsSync(p) && fs.statSync(p).size > 0) ok(f);
  else fail(f + ' 이(가) 없거나 비어 있습니다');
}

for (const f of PAGES) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, 'utf8');
  console.log('2) ' + f);

  if (/<title>[^<]+<\/title>/.test(html)) ok('제목 있음'); else fail('<title> 이 없습니다');
  if (/<meta charset="utf-8">/i.test(html)) ok('문자 인코딩 utf-8'); else fail('<meta charset="utf-8"> 이 없습니다');

  // 페이지 안에 직접 적은 스크립트가 문법 오류 없이 읽히는지
  let n = 0;
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    n++;
    try { new Function(m[1]); }
    catch (e) { fail(n + '번째 스크립트 문법 오류: ' + e.message); }
  }
  ok('스크립트 ' + n + '개 문법 확인');

  // 주소가 https://이름.github.io/저장소/ 꼴이라 "/파일" 처럼 맨 앞이 / 인 경로는 깨집니다
  const abs = html.match(/<(?:link|script|img|a|use|source)\b[^>]*\s(?:src|href)=["']\/(?!\/)[^"']*["']/g);
  if (abs) fail('/ 로 시작하는 경로가 있습니다: ' + abs.slice(0, 3).join(' , '));
  else ok('/ 로 시작하는 경로 없음');

  // 보안 연결이 아닌 주소에서 파일을 불러오면 브라우저가 막습니다
  const insecure = html.match(/<(?:link|script|img|iframe|source)\b[^>]*\s(?:src|href)=["']http:\/\/[^"']*["']/g);
  if (insecure) fail('http:// 로 불러오는 파일이 있습니다: ' + insecure.slice(0, 3).join(' , '));
  else ok('http:// 로 불러오는 파일 없음');

  ok('크기 ' + (fs.statSync(p).size / 1024).toFixed(0) + ' KB');
}

// 영어 번역이 빠진 글자가 없는지: 스크립트에서 __('한국어') 로 쓴 원문이 모두 EN 표에 있어야 합니다
{
  console.log('3) 영어 번역');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const table = html.match(/\nconst EN = \{\n([\s\S]*?)\n\};/);
  if (!table) fail('index.html 에서 EN 표를 찾지 못했습니다');
  else {
    const STR = "'(?:[^'\\\\]|\\\\.)*'";
    const keys = new Set([...table[1].matchAll(new RegExp('^  (' + STR + '): ', 'gm'))].map(m => m[1]));
    const used = new Set([...html.matchAll(new RegExp('__\\((' + STR + ')', 'g'))].map(m => m[1]));
    const missing = [...used].filter(k => !keys.has(k));
    if (missing.length) fail('EN 표에 없는 원문 ' + missing.length + '개: ' + missing.slice(0, 5).join(' , '));
    else ok('원문 ' + used.size + '개 모두 영어 있음');
    const bare = [...html.matchAll(/\b(?:toast|prompt)\(\s*'[^']*[가-힣]/g)].length;
    if (bare) fail('__() 로 감싸지 않은 한국어 알림이 ' + bare + '곳 있습니다');
    else ok('감싸지 않은 한국어 알림 없음');
  }
}

if (bad) { console.error('\n점검 실패: ' + bad + '건. 배포하지 않습니다.'); process.exit(1); }
console.log('\n점검 통과');
