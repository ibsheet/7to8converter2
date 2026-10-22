// 초기 화면에 표시되는 샘플 코드
window.SAMPLE_INIT_CODE = `// IBSheet7 초기화 데이터
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
IBS_InitSheet(mySheet, initData);`;

window.SAMPLE_EVENT_CODE = `function mySheet_OnSearchEnd(code,msg,StCode,StMsg){
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
	}`;
