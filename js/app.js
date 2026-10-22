(function () {
  'use strict';

  var MONACO_BASE = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min';
  var FONT_SIZES = { S: 12, M: 14, L: 16 };
  var PLACEHOLDER = '// Converted code will appear here';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var editors = {};
  var activeTab = 'page1';
  var fontSize = 'M';

  var inputSheetId = $('#input-sheet-id');
  var inputInitVar = $('#input-init-var');
  var inputEl = $('#input-el');

  // ---------- Monaco ----------
  // CDN 에서 불러온 monaco 의 worker 가 cross-origin 으로 막히지 않도록 blob 프록시 사용
  window.MonacoEnvironment = {
    getWorkerUrl: function () {
      return 'data:text/javascript;charset=utf-8,' + encodeURIComponent(
        'self.MonacoEnvironment = { baseUrl: "' + MONACO_BASE + '/" };' +
        'importScripts("' + MONACO_BASE + '/vs/base/worker/workerMain.js");'
      );
    }
  };

  require.config({ paths: { vs: MONACO_BASE + '/vs' } });
  require(['vs/editor/editor.main'], function () {
    var options = function () {
      return {
        language: 'javascript',
        theme: 'vs',
        minimap: { enabled: false },
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: FONT_SIZES[fontSize],
        tabSize: 2,
        fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
        fontLigatures: true,
        padding: { top: 16, bottom: 16 },
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 }
      };
    };
    var create = function (id, value) {
      var o = options();
      o.value = value;
      return monaco.editor.create(document.getElementById(id), o);
    };

    editors.initLegacy = create('editor-init-legacy', window.SAMPLE_INIT_CODE);
    editors.initConverted = create('editor-init-converted', PLACEHOLDER);
    editors.evtLegacy = create('editor-evt-legacy', window.SAMPLE_EVENT_CODE);
    editors.evtConverted = create('editor-evt-converted', PLACEHOLDER);

    editors.initLegacy.onDidChangeModelContent(function () {
      updateSheetInfo(editors.initLegacy.getValue());
    });
    updateSheetInfo(editors.initLegacy.getValue());
  });

  // ---------- Sheet ID / 초기화 변수 / EL 자동 추출 ----------
  function updateSheetInfo(code) {
    var info;
    try {
      info = findSheetId(code);
    } catch (e) {
      // 시트 ID 를 못 찾은 경우 (알림은 findSheetId 에서 표시)
      info = {};
    }
    inputSheetId.value = info.sheetID || '';
    inputInitVar.value = info.initObj || '';
    inputEl.value = info.el || '';
  }

  // ---------- Convert ----------
  $('#btn-convert').addEventListener('click', function () {
    if (!editors.initLegacy) return;

    if (activeTab === 'page1') {
      var code = convert7to8(editors.initLegacy.getValue(), inputSheetId.value, inputInitVar.value, inputEl.value);
      editors.initConverted.setValue(code);
    } else {
      editors.evtConverted.setValue(convertEvent(editors.evtLegacy.getValue()));
      // 자동 포멧 맞춤
      editors.evtConverted.getAction('editor.action.formatDocument').run();
    }
  });

  // ---------- 탭 ----------
  $$('.tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeTab = btn.dataset.tab;
      $$('.tab').forEach(function (t) { t.classList.toggle('active', t === btn); });
      $$('.panels').forEach(function (p) {
        p.hidden = p.dataset.page !== activeTab;
        // 탭 전환 시 최대화 상태 해제
        p.classList.remove('maximize-legacy', 'maximize-converted');
      });
    });
  });

  // ---------- 폰트 크기 ----------
  $$('#font-size button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      fontSize = btn.dataset.size;
      $$('#font-size button').forEach(function (b) { b.classList.toggle('active', b === btn); });
      Object.keys(editors).forEach(function (k) {
        editors[k].updateOptions({ fontSize: FONT_SIZES[fontSize] });
      });
    });
  });

  // ---------- 최대화 / 복사 ----------
  $$('.btn-maximize').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panels = btn.closest('.panels');
      var cls = 'maximize-' + btn.dataset.panel;
      var on = !panels.classList.contains(cls);
      panels.classList.remove('maximize-legacy', 'maximize-converted');
      if (on) panels.classList.add(cls);
    });
  });

  $$('.btn-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var editor = btn.closest('.panels').dataset.page === 'page1' ? editors.initConverted : editors.evtConverted;
      navigator.clipboard.writeText(editor.getValue());
    });
  });

  // ---------- 스플리터 (좌우 패널 너비 조절) ----------
  $$('.panels').forEach(function (panels) {
    var splitter = $('.splitter', panels);
    var left = $('.panel-legacy', panels);
    var right = $('.panel-converted', panels);
    var dragging = false;

    var setSplit = function (pct) {
      left.style.width = pct + '%';
      right.style.width = (100 - pct) + '%';
    };
    setSplit(50);

    splitter.addEventListener('mousedown', function (e) {
      dragging = true;
      splitter.classList.add('dragging');
      document.body.classList.add('dragging');
      e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var rect = panels.getBoundingClientRect();
      var pct = ((e.clientX - rect.left) / rect.width) * 100;
      if (pct > 20 && pct < 80) setSplit(pct);
    });
    document.addEventListener('mouseup', function () {
      if (!dragging) return;
      dragging = false;
      splitter.classList.remove('dragging');
      document.body.classList.remove('dragging');
    });
  });
})();
