'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Code2, Maximize2, Copy, Github} from 'lucide-react';
import Editor from '@monaco-editor/react';
import {findSheetId, convert7to8} from '../utils/ibsheet7to8Convert';
import convertEvent from '../utils/convertEvent';

const CodeConverter = () => {
  const [activeTab, setActiveTab] = useState('page1');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [fontSize, setFontSize] = useState('M');
  // IBSheet7 초기화 코드
  const [legacyCode, setLegacyCode] = useState(
  `// IBSheet7 초기화 데이터
  var initData = {
    "Cfg": {
      "SearchMode": 2,
      "Page": 10,
      "FrozenCol": 0,
      "UseHeaderActionMenu": false,
      "MouseHoverMode": 0,
      "SelectionRowsMode": 1,
      "AutoFitColWidth": "resize",
      "DeferredVScroll": 1
    },
    "HeaderMode": {
      "Sort": 0,
      "ColMove": 0,
      "ColResize": 0,
      "HeaderCheck": 0
    },
    "Cols": [
      {"Header": "순위", "Type": "Seq", "Width": 50, "SaveName": "sSeq", "Align": "Right"}, 
      {"Header": "상태", "Type": "Status", "Width": 60, "SaveName": "sStatus", "Align": "Center", "ShowMobile": 0}, 
      {"Header": "삭제", "Type": "DelCheck", "Width": 60, "SaveName": "sDelCheck", "ShowMobile": 0}, 
      {"Header": "국가", "Type": "Combo", "Width": 70, "SaveName": "sNation", "ComboText": "한국|미국|일본|영국|캐나다|이탈리아|스웨덴|중국|프랑스", "Align": "Center", "ShowMobile": 0}, 
      {"Header": "영화명", "Type": "Text", "Width": 200, "SaveName": "sTitle", "Ellipsis": 1}, 
      {"Header": "점유율", "Type": "Float", "Width": 50, "SaveName": "sShare", "Format": "#,##0.0\\%", "ShowMobile": 0}, 
      {"Header": "상영횟수", "Type": "AutoSum", "Width": 100, "SaveName": "sCount", "Format": "#,##0"}, 
      {"Header": "개봉일", "Type": "Date", "Width": 100, "SaveName": "sDate", "Align": "Center"}, 
      {"Header": "추천","Type": "CheckBox","Width": 60,"SaveName": "sCheck"}
    ]
};

// IBSheet 객체 생성
var container = $('#ib-container')[0];
createIBSheet2(container, 'mySheet', '100%', '284px');

// IBSheet 초기화
IBS_InitSheet(mySheet, initData);`);

  const [convertedCode, setConvertedCode] = useState('// Converted code will appear here');

  // IBSheet7 이벤트 코드
  const [legacyCode2, setLegacyCode2] = useState(
 `function mySheet_OnSearchEnd(code,msg,StCode,StMsg){
		var msg = "";

		msg += "[OnSearchEnd] => ";
		msg += "[Code:" + code + ", Message:" + msg + ",ServerCode:"+StCode+"] ";
		fnAppendLog(msg);
	}

	function mySheet_OnSaveEnd(code,msg){
		var msg = "";

		msg += "[OnSaveEnd] => ";
		msg += "[Code:" + code + ", Message:" + msg + "] ";
		fnAppendLog(msg);
	}
	// 마우스 이벤트
	function mySheet_OnClick(row, col, cellx, celly, cellw, cellh) {
		var msg = "";
		if (row == null || row < 0) return;

		msg += "[OnClick] => ";
		msg += "[" + row + ", " + col + "] ";

		if (document.getElementById('chkMouse').checked == true)
			fnAppendLog(msg);
	}
	
	function mySheet_OnFilterEnd(RowCnt, FirstRow) {
		var msg = "";
		msg += "[OnFilterEnd] => ";
		msg += "[" + RowCnt + ", " + FirstRow + "] ";
		fnAppendLog(msg);
	}

	
	function mySheet_OnDblClick(row, col, cellx, celly, cellw, cellh) {
		var msg = "";

		if (row == null || row < 0) return;

		msg += "[OnDblClick] => ";
		msg += "[" + row + ", " + col + "] ";

		if (document.getElementById('chkMouse').checked == true)
			fnAppendLog(msg);
	}

	function mySheet_OnMouseDown(button, shift, x, y) {
		var msg = "";

		msg += "[OnMouseDown] => ";
		msg += "[Button:" + button + ", Shift:" + shift + "] ";


		if (document.getElementById('chkMouse').checked == true)
			fnAppendLog(msg);
	}

	function mySheet_OnMouseUp(button, shift, x, y) {
		var msg = "";

		msg += "[OnMouseUp] => ";
		msg += "[Button:" + button + ", Shift:" + shift + "] ";

		if (document.getElementById('chkMouse').checked == true)
			fnAppendLog(msg);
	}

	function mySheet_OnMouseMove(button, shift, x, y) {
		var msg = "";

		msg += "[OnMouseMove] => ";
		msg += "[X:" + x + ", Y:" + y + "] ";

		if (document.getElementById('chkMouse').checked == true)
			fnAppendLog(msg);
	}

	// 키보드 이벤트
	function mySheet_OnKeyDown(row, col, key, shift) {
		var msg = "";

		if (row == null || row < 0) return;

		msg += "[OnKeyDown] => ";
		msg += "[" + row + ", " + col + "] : ";
		msg += "[Key:" + key + ", Shift:" + shift + "] ";

		if (document.getElementById('chkKeyboard').checked == true)
			fnAppendLog(msg);
	}

	function mySheet_OnKeyUp(row, col, key, shift) {
		var msg = "";

		if (row == null || row < 0) return;

		msg += "[OnKeyUp] => ";
		msg += "[" + row + ", " + col + "] : ";
		msg += "[Key:" + key + ", Shift:" + shift + "] ";

		if (document.getElementById('chkKeyboard').checked == true)
			fnAppendLog(msg);
	}

	// 기타 이벤트
	function mySheet_OnSelectCell(oldrow, oldcol, row, col,isDelete) {
		var msg = "";

		msg += "[OnSelectCell] => ";
		msg += "[" + oldrow + ", " + oldcol + "] -> ";
		msg += "[" + row + ", " + col + ", "+isDelete+   "] ";

		if (document.getElementById('chkEtc').checked == true)
			fnAppendLog(msg);
	}

	// 기타 이벤트
	function mySheet_OnSort(col, arrow) {
		var msg = "";

		msg += "[OnSort] => ";
		msg += "[" + col + ", " + arrow + "] ";

		if (document.getElementById('chkEtc').checked == true)
			fnAppendLog(msg);
	}

	function mySheet_OnBeforeExpand(row, expand) {
		var msg = "";

		if (row == null || row < 0) return;

		msg += "[OnBeforeExpand] => ";
		msg += "[" + row + " : " + expand + "] ";

		if (document.getElementById('chkEtc').checked == true)
			fnAppendLog(msg);
	}

	function mySheet_OnAfterEdit(row, col) {
		var msg = "";

		if (row == null || row < 0) return;

		msg += "[OnAfterEdit] => ";
		msg += "[" + row + " : " + col + "] ="+ mySheet.GetCellValue(row,col);

		if (document.getElementById('chkEtc').checked == true)
			fnAppendLog(msg);
	}


	function mySheet_OnAfterExpand(row, expand) {
		var msg = "";

		if (row == null || row < 0) return;

		msg += "[OnAfterExpand] => ";
		msg += "[" + row + " : " + expand + "] ";

		if (document.getElementById('chkEtc').checked == true)
			fnAppendLog(msg);
	}

	function mySheet_OnUserResize(col, width) {
		var msg = "";

		msg += "[OnUserResize] => ";
		msg += "[" + col + " : " + width + "] ";

		if (document.getElementById('chkEtc').checked == true)
			fnAppendLog(msg);
	}

	function mySheet_OnAfterColumnMove(Col, NewPos) {
		var msg = "";


		msg += "[OnAfterColumnMove] => ";
		msg += "[" + Col + "==>" + NewPos + "] " ;

		if (document.getElementById('chkEtc').checked == true)
			fnAppendLog(msg);
	}
	function mySheet_OnBeforeColumnMove(Col, NewPos) {
		var msg = "";


		msg += "[OnBeforeColumnMove] => ";
		msg += "[" + Col + "==>" + NewPos + "] " ;

		if (document.getElementById('chkEtc').checked == true)
			fnAppendLog(msg);
	}
	
	function mySheet_OnChange(row, col, value , oldvalue) {
		var msg = "";

		if (row == null || row < 0) return;

		msg += "[OnChange] => ";
		msg += "[" + row + ", " + col + "] => " + value + "oldvalue="+oldvalue;

		if (document.getElementById('chkEtc').checked == true)
			fnAppendLog(msg);
	}`);
  const [convertedCode2, setConvertedCode2] = useState('// Converted code will appear here');

  const [splitPos, setSplitPos] = useState(50);
  const [splitPos2, setSplitPos2] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [maximizedPanel, setMaximizedPanel] = useState(null);

  const eventConvertEditorRef = useRef(null);


  // Convert 버튼 클릭
  const handleConvert = () => {
    if (activeTab === 'page1') {
      const convertedCode = convert7to8(legacyCode, input1, input2, input3);
      setConvertedCode(convertedCode);
    } else {
      const convertedCode = convertEvent(legacyCode2);
      setConvertedCode2(convertedCode);
      
      // 자동 포멧 맞춤
      eventConvertEditorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    if (percentage > 20 && percentage < 80) {
      if (activeTab === 'page1') {
        setSplitPos(percentage);
      } else {
        setSplitPos2(percentage);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleConvertedEditorMounted = (editor) => {
    console.log('Converted Editor Mounted:', editor);
    eventConvertEditorRef.current = editor; 
  }    

  const toggleMaximize = (panel) => {
    setMaximizedPanel(maximizedPanel === panel ? null : panel);
  };

  const changeInputValues = (rtnInfo) => {
    setInput1(rtnInfo.sheetID ? rtnInfo.sheetID : '');
    setInput2(rtnInfo.initObj ? rtnInfo.initObj : '');
    setInput3(rtnInfo.el ? rtnInfo.el : '');
  };
  const handleLegacyCodeChange = (value) => {
    setLegacyCode(value || '');
    
    const rtnInfo = findSheetId(value || '');
    changeInputValues(rtnInfo);
  }

  useEffect(() => {
    const rtnInfo = findSheetId(legacyCode);
    changeInputValues(rtnInfo);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      return () => document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  useEffect(() => {
    if (activeTab) {
      setMaximizedPanel(null);
    }
  }, [activeTab]);



  const getFontSize = () => {
    const sizeMap = { S: 12, M: 14, L: 16 };
    return sizeMap[fontSize];
  };

  const editorOptions = {
    minimap: { enabled: false },
    lineNumbers: 'on',
    roundedSelection: true,
    scrollBeyondLastLine: false,
    fontSize: getFontSize(),
    tabSize: 2,
    fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
    fontLigatures: true,
    padding: { top: 16, bottom: 16 },
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
  };

  const renderContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 min-w-[60px] text-right">
                SHEET ID
              </label>
              <input
                type="text"
                placeholder="Enter value..."
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-slate-400 w-48"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 min-w-[60px] text-right">
                Initialize variable
              </label>
              <input
                type="text"
                placeholder="Enter value..."
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-slate-400 w-48"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 min-w-[60px] text-right">
                EL
              </label>
              <input
                type="text"
                placeholder="Enter value..."
                value={input3}
                onChange={(e) => setInput3(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-slate-400 w-48"
              />
            </div>
            
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm font-medium text-slate-700">Font Size</span>
              <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                {['S', 'M', 'L'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      fontSize === size
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConvert}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 ml-2"
              >
                <Code2 size={18} />
                Convert
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'page1' ? (
        <div 
          className="flex-1 flex relative overflow-hidden"
          onMouseMove={isDragging ? handleMouseMove : undefined}
        >
          <div 
            className={`p-6 overflow-hidden flex flex-col transition-all duration-300 ${
              maximizedPanel === 'converted' ? 'w-0 p-0' : maximizedPanel === 'legacy' ? 'w-full' : ''
            }`}
            style={{ width: maximizedPanel ? undefined : `${splitPos}%` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                Initialize - Legacy Code
              </h2>
              <button 
                onClick={() => toggleMaximize('legacy')}
                className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                title={maximizedPanel === 'legacy' ? 'Restore' : 'Maximize'}
              >
                <Maximize2 size={16} className={`text-slate-500 transition-transform ${maximizedPanel === 'legacy' ? 'rotate-45' : ''}`} />
              </button>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <Editor
                key="init-legacy-editor"
                height="100%"
                defaultLanguage="javascript"
                value={legacyCode}
                onChange={handleLegacyCodeChange}
                theme="light"
                options={editorOptions}
              />
            </div>
          </div>

          {!maximizedPanel && (
            <div
              className="w-1 bg-slate-300 cursor-col-resize hover:bg-blue-500 transition-all relative flex items-center justify-center group"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute w-1 h-16 bg-slate-400 rounded-full group-hover:bg-blue-600 group-hover:h-20 transition-all"></div>
            </div>
          )}

          <div 
            className={`p-6 overflow-hidden flex flex-col transition-all duration-300 ${
              maximizedPanel === 'legacy' ? 'w-0 p-0' : maximizedPanel === 'converted' ? 'w-full' : ''
            }`}
            style={{ width: maximizedPanel ? undefined : `${100 - splitPos}%` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Converted Code
              </h2>
              <div>
                <button 
                  onClick={() => navigator.clipboard.writeText(convertedCode)}
                  className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                  title="Copy to Clipboard"
                >
                  <Copy size={16} className={`text-slate-500`} />
                </button>
                <button 
                  onClick={() => toggleMaximize('converted')}
                  className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                  title={maximizedPanel === 'converted' ? 'Restore' : 'Maximize'}
                >
                  <Maximize2 size={16} className={`text-slate-500 transition-transform ${maximizedPanel === 'converted' ? 'rotate-45' : ''}`} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <Editor
                key="init-converted-editor"
                height="100%"
                defaultLanguage="javascript"
                value={convertedCode}
                onChange={(value) => setConvertedCode(value || '')}
                theme="light"
                options={editorOptions}
              />
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="flex-1 flex relative overflow-hidden"
          onMouseMove={isDragging ? handleMouseMove : undefined}
        >
          <div 
            className={`p-6 overflow-hidden flex flex-col transition-all duration-300 ${
              maximizedPanel === 'converted' ? 'w-0 p-0' : maximizedPanel === 'legacy' ? 'w-full' : ''
            }`}
            style={{ width: maximizedPanel ? undefined : `${splitPos2}%` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Events - Legacy Code
              </h2>
              <button 
                onClick={() => toggleMaximize('legacy')}
                className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                title={maximizedPanel === 'legacy' ? 'Restore' : 'Maximize'}
              >
                <Maximize2 size={16} className={`text-slate-500 transition-transform ${maximizedPanel === 'legacy' ? 'rotate-45' : ''}`} />
              </button>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <Editor
                key="evt-legacy-editor"
                height="100%"
                defaultLanguage="javascript"
                value={legacyCode2}
                onChange={(value) => setLegacyCode2(value || '')}
                theme="light"
                options={editorOptions}
              />
            </div>
          </div>

          {!maximizedPanel && (
            <div
              className="w-1 bg-slate-300 cursor-col-resize hover:bg-purple-500 transition-all relative flex items-center justify-center group"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute w-1 h-16 bg-slate-400 rounded-full group-hover:bg-purple-600 group-hover:h-20 transition-all"></div>
            </div>
          )}

          <div 
            className={`p-6 overflow-hidden flex flex-col transition-all duration-300 ${
              maximizedPanel === 'legacy' ? 'w-0 p-0' : maximizedPanel === 'converted' ? 'w-full' : ''
            }`}
            style={{ width: maximizedPanel ? undefined : `${100 - splitPos2}%` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                Converted Code
              </h2>
              <div>
                <button 
                  onClick={() => navigator.clipboard.writeText(convertedCode2)}
                  className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                  title="Copy to Clipboard"
                >
                  <Copy size={16} className={`text-slate-500`} />
                </button>
                <button 
                  onClick={() => toggleMaximize('converted')}
                  className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                  title={maximizedPanel === 'converted' ? 'Restore' : 'Maximize'}
                >
                  <Maximize2 size={16} className={`text-slate-500 transition-transform ${maximizedPanel === 'converted' ? 'rotate-45' : ''}`} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <Editor
                key="evt-converted-editor"
                height="100%"
                defaultLanguage="javascript"
                value={convertedCode2}
                onChange={(value) => setConvertedCode2(value || '')}
                onMount={handleConvertedEditorMounted}            
                theme="light"
                options={editorOptions}
              />
              
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">IBSheet Code Converter</h1>
            <span className="text-sm text-slate-500 font-medium">v7 → v8</span>
          </div>
          <a
            href="https://github.com/ibsheet/7to8converter2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Github className="w-5 h-5" />
            <span className="font-medium">GitHub</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 bg-white border-b border-slate-200">
        <button
          onClick={() => setActiveTab('page1')}
          className={`px-6 py-3 rounded-t-lg font-medium text-sm transition-all relative ${
            activeTab === 'page1'
              ? 'text-blue-600 bg-gradient-to-br from-slate-50 to-slate-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {activeTab === 'page1' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
          Initialize
        </button>
        <button
          onClick={() => setActiveTab('page2')}
          className={`px-6 py-3 rounded-t-lg font-medium text-sm transition-all relative ${
            activeTab === 'page2'
              ? 'text-blue-600 bg-gradient-to-br from-slate-50 to-slate-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {activeTab === 'page2' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
          Events
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default CodeConverter;