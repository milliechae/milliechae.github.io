/* 케이스스터디 하단 버튼: 클릭하면 이메일 주소 복사 + 잠깐 "Copied" 표시 (복사 실패 시 메일 앱으로).
   홈(index.html)의 이메일 아이콘과 같은 방식입니다. */
(function () {
  var btn = document.querySelector('[data-copy-email]');
  if (!btn) return;
  var addr = btn.getAttribute('data-copy-email');
  var label = btn.querySelector('[data-i18n]');
  var TEXT = { copy: { en: 'Let\u2019s work together', ko: '함께 일해요' }, copied: { en: 'Email copied \u2713', ko: '이메일이 복사됐어요 \u2713' } };
  var timer = null;

  function lang() { return document.documentElement.getAttribute('lang') === 'ko' ? 'ko' : 'en'; }
  function showCopied() {
    if (!btn.classList.contains('copied')) btn.style.minWidth = btn.offsetWidth + 'px'; // 글자가 짧아져도 버튼이 줄어들지 않게
    label.textContent = TEXT.copied[lang()];
    btn.classList.add('copied');
    btn.style.justifyContent = 'center';
    clearTimeout(timer);
    timer = setTimeout(function () {
      btn.classList.remove('copied');
      label.textContent = TEXT.copy[lang()];
      btn.style.minWidth = '';
    }, 1500);
  }
  function legacyCopy() {
    var ta = document.createElement('textarea');
    ta.value = addr;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(addr).then(showCopied, function () {
        if (legacyCopy()) showCopied(); else window.location.href = 'mailto:' + addr;
      });
    } else if (legacyCopy()) {
      showCopied();
    } else {
      window.location.href = 'mailto:' + addr;
    }
  });
})();
