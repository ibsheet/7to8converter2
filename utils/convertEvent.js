const EVENTS = ["OnAfterColumnMove","OnAfterEdit","OnAfterPaste","OnAfterExpand","OnBeforeCheck","OnBeforeCheckAll","OnBeforeColumnMove","OnBeforeDownload","OnBeforeEdit","OnBeforeExpand","OnBeforeMovePage","OnBeforePaste","OnBeforeSave","OnBeforeSearch","OnBeforeSort","OnBeforeTab","OnButtonClick","OnCellDropEnd","OnChange","OnChangeFilter","OnChangeSum","OnCheckAllEnd","OnClick","OnColumnSort","OnDblClick","OnDebugMsg","OnDecryption","OnDownFinish","OnDragStart","OnDropEnd","OnEditValidation","OnEncryption","OnExportEncryption","OnFilterEnd","OnGroupFinish","OnGroupStart","OnHScroll","OnKeyDown","OnKeyUp","OnLoad","OnLoadData","OnLoadExcel","OnLoadFileSelect","OnLoadText","OnMessage","OnMouseDown","OnMouseMove","OnMouseUp","OnMovePage","OnPageRequest","OnPopupClick","OnResize","OnRowDelete","OnRowSearchEnd","OnSaveEnd","OnSearchEnd","OnSelectMenu","OnSelectCell","OnSelectEnd","OnSmartResize","OnSort","OnTab","OnTreeCheckChange","OnTreeChild","OnUserResize","OnValidation","OnVScroll","OnWaitTimeOut"];

// 함수의 매개변수 문자열을 배열로 반환
function getParamStr(funcStr){
    var start_pos = funcStr.indexOf( "(" )+1;
    var end_pos = funcStr.indexOf(")",start_pos);
    return funcStr.substring(start_pos,end_pos).split(",").map(v=>v.trim());
}

function getFunctionContent(funcStr, start_pos, end_pos){
    return funcStr.substring(start_pos,end_pos).trim();
}


function eventSpliter(str) {
    const eventsList = [];
    str.split("function ").forEach(funcStr=>{
        var funcName = funcStr.substring(0, funcStr.indexOf("(")).trim();  
        if(funcName.indexOf("_")>-1) {
            funcName = funcName.substring(funcName.indexOf("_")+1);
            if(EVENTS.lastIndexOf(funcName)>-1){
                const eventObj = {};
                eventObj.name = funcName;
                var params = getParamStr(funcStr);
                eventObj.params = params;
                var start_pos = funcStr.indexOf( "{" )+1;
                var end_pos = funcStr.lastIndexOf("}");
                var content = getFunctionContent(funcStr, start_pos, end_pos);  
                eventObj.content = content;
                eventsList.push(eventObj);
            }
        }
    });
    return eventsList;
}

// 이벤트 파라미터 매핑
function paramMapper(param7, param8 ){
    let mapStr = "";
    for(var i=0; i<param7.length; i++){
        let caution = "";
        if(param8[i] && param8[i].endsWith("*")){
            caution = " // TODO: 값 확인 필요 (매핑값이 정확하지 않을 수 있음)";
            param8[i] = param8[i].substring(0,param8[i].length-1);
        }
        if(param8[i]){
            mapStr += `var ${param7[i]} = ${param8[i]}; ${caution}\n`;
        }
    }
    return mapStr;
}

const convertEvent = function(str) {
    // 이벤트 함수를 분리
    const eventsList = eventSpliter(str);
    const convertEvents = {};
    const unsupportParam = "' 지원하지 않는 파라미터 !!'";
    eventsList.forEach(eventObj=>{
        switch(eventObj.name){


            case "OnAfterColumnMove":
                convertEvents["onAfterColMove"] = `function(evt) {\n//OnAfterColumnMove\n${paramMapper(eventObj.params,[unsupportParam,'evt.col*'])} \n\n${eventObj.content}\n}`;
                break;
            case "OnAfterEdit":
                convertEvents["onAfterEdit"] = `function(evt) {\n//OnAfterEdit\n${paramMapper(eventObj.params,['evt.row','evt.col*'])} \n\n${eventObj.content}\n}`;
                break;
            case "OnAfterPaste":
                convertEvents["onAfterPaste"] = `function(evt) {\n//OnAfterPaste\n${paramMapper(eventObj.params,[])} \n\n${eventObj.content}\n}`;
                break;
            case "OnAfterExpand":
                convertEvents["onAfterExpand"] = `function(evt) {\n//OnAfterExpand\n${paramMapper(eventObj.params,['evt.row','evt.row.Expanded?7:2'])} \n\n${eventObj.content}\n}`;
                break;
             case "OnBeforeCheck":
                convertEvents["onBeforeChange"] = `function(evt) {\n//OnBeforeCheck\n${paramMapper(eventObj.params,['evt.row','evt.col'])} \n\n${eventObj.content}\n}`;
                break;
            case "OnBeforeCheckAll":
                convertEvents["onBeforeCheckAll"] = `function(evt) {\n//OnBeforeCheckAll\n${paramMapper(eventObj.params,['evt.sheet.getMouseRow()','evt.col'])} \n\n${eventObj.content}\n}`;
                break;
            case "OnBeforeColumnMove":
                convertEvents["onBeforeColMove"] = `function(evt) {\n//OnBeforeColumnMove\n${paramMapper(eventObj.params,['evt.col*','evt.toCol*'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnBeforeDownload":
                convertEvents["onBeforeExport"] = `function(evt) {\n//OnBeforeDownload\n${paramMapper(eventObj.params,['evt.type','evt.formElem*'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnBeforeEdit":
                convertEvents["onStartEdit"] = `function(evt) {\n//OnBeforeEdit\n${paramMapper(eventObj.params,['evt.row','evt.col'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnBeforeExpand":
                convertEvents["onBeforeExpand"] = `function(evt) {\n//OnBeforeExpand\n${paramMapper(eventObj.params,['evt.row','evt.row.Expanded?2:0'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnBeforeMovePage":
                convertEvents["onBeforeGoToPage"] = `function(evt) {\n//OnBeforeMovePage\n${paramMapper(eventObj.params,['evt.page','evt.pagepos'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnBeforePaste":
                convertEvents["onBeforePaste"] = `function(evt) {\n//OnBeforePaste\n${paramMapper(eventObj.params,['evt.pastedtext'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnBeforeSave":
                convertEvents["onSave"] = `function(evt) {\n//OnBeforeSave\n${paramMapper(eventObj.params,[])} \n\n${eventObj.content}\n}`;
                break;

            case "OnBeforeSearch":
                convertEvents["onSearchStart"] = `function(evt) {\n//OnBeforeSearch\n${paramMapper(eventObj.params,[])} \n\n${eventObj.content}\n}`;
                break;

            case "OnBeforeSort":
                convertEvents["onBeforeSort"] = `function(evt) {\n//OnBeforeSort\n${paramMapper(eventObj.params,['evt.col'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnBeforeTab":
                convertEvents["onBeforeFocus"] = `function(evt) {\n//OnBeforeTab\nif(event.key && event.key == "Tab"){${paramMapper(eventObj.params,['evt.row','evt.col','evt.orow','evt.ocol'])}\n\n${eventObj.content}\n}\n}`;
                break;

            case "OnButtonClick":
                convertEvents["onClick"] = `function(evt) {\n//OnButtonClick\n if(evt.sheet.getType(evt.row,evt.col)=="Button"){${paramMapper(eventObj.params,['evt.row','evt.col'])} \n\n${eventObj.content}\n}\n}`;
                break;

            case "OnCellDropEnd":
                convertEvents["onEndDragCell"] = `function(evt) {\n//OnCellDropEnd\n${paramMapper(eventObj.params,['evt.sheet','evt.row','evt.col','evt.tosheet','evt.torow','evt.tocol','evt.x','evt.y'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnChangeFilter":
                convertEvents["onAfterFilter"] = `function(evt) {\n//OnChangeFilter\n${paramMapper(eventObj.params,[])} \n\n${eventObj.content}\n}`;
                break;

            case "OnChangeSum":
                convertEvents["OnChangeSum"] = `function(evt) {\n//OnChangeSum\n//지원하지 않는 이벤트 입니다.\n}`;
                break;

            case "OnCheckAllEnd":
                convertEvents["onCheckAllFinish"] = `function(evt) {\n//OnCheckAllEnd\n${paramMapper(eventObj.params,['evt.col','evt.result'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnColumnSort":
                convertEvents["onAfterSort"] = `function(evt) {\n//OnColumnSort\n${paramMapper(eventObj.params,['evt.sheet.Sort*',''])} \n\n${eventObj.content}\n}`;
                break;

            case "OnDblClick":
                convertEvents["onDblClick"] = `function(evt) {\n//OnDblClick\n${paramMapper(eventObj.params,['evt.row','evt.col','evt.x','evt.y'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnDebugMsg":
                convertEvents["OnDebugMsg"] = `function(evt) {\n//OnDebugMsg\n//지원하지 않는 이벤트 입니다.\n}`;
                break;

            case "OnDecryption":
                convertEvents["OnDecryption"] = `function(evt) {\n//OnDecryption\n//지원하지 않는 이벤트 입니다.\n//onDataLoad,onBeforeDataLoad 이벤트를 참고하세요.\n}`;
                break;

            case "OnDownFinish":
                convertEvents["onExportFinish"] = `function(evt) {\n//OnDownFinish\n${paramMapper(eventObj.params,['evt.type','evt.result'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnDragStart":
                convertEvents["onStartDrag"] = `function(evt) {\n//OnDragStart\n${paramMapper(eventObj.params,['evt.row','evt.col'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnDropEnd":
                convertEvents["onEndDrag"] = `function(evt) {\n//OnDropEnd\n${paramMapper(eventObj.params,['evt.sheet','evt.row','evt.tosheet','evt.torow','evt.x','evt.y','evt.type'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnEditValidation":
                convertEvents["onEndEdit"] = `function(evt) {\n//OnEditValidation\n${paramMapper(eventObj.params,['evt.row','evt.col','evt.val'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnEncryption":
                convertEvents["OnEncryption"] = `function(evt) {\n//OnEncryption\n//지원하지 않는 이벤트 입니다.\n//onSave,onBeforeSave 이벤트를 참고하세요.\n}`;
                break;

            case "OnExportEncryption":
                convertEvents["OnExportEncryption"] = `function(evt) {\n//OnExportEncryption\n//지원하지 않는 이벤트 입니다.\n//ExportValue(Cell) 속성을 참고하세요.\n}`;
                break;
                
            case "OnFilterEnd":
                convertEvents["onAfterFilter"] = `function(evt) {\n//OnFilterEnd\n${paramMapper(eventObj.params,['evt.sheet.FilterCount','evt.sheet.getFirstVisibleRow()'])} \n\n${eventObj.content}\n}`;
                break;
                    
            case "OnGroupFinish":
                convertEvents[""] = `function(evt) {\n//OnGroupFinish\n${paramMapper(eventObj.params,['evt.sheet.Group*'])} \n\n${eventObj.content}\n}`;
                break;
                        
            case "OnGroupStart":
                convertEvents[""] = `function(evt) {\n//OnGroupStart\n${paramMapper(eventObj.params,['evt.sheet.Group*'])} \n\n${eventObj.content}\n}`;
                break;
                            
            case "OnHScroll":
                convertEvents["OnExportEncryption"] = `function(evt) {\n//OnHScroll\n//지원하지 않는 이벤트 입니다.\n//onScroll 이벤트를 참고하세요.\n}`;
                break;

            case "OnKeyDown":
                convertEvents["onKeyDown"] = `function(evt) {\n//OnKeyDown\n${paramMapper(eventObj.params,['evt.sheet.getFocusedRow()','evt.sheet.getFocusedCol()','evt.key', 'evt.prefix*'])} \n\n${eventObj.content}\n}`;
                break;
                
            case "OnKeyUp":
                convertEvents["onKeyDown"] = `function(evt) {\n//OnKeyUp\n${paramMapper(eventObj.params,['evt.sheet.getFocusedRow()','evt.sheet.getFocusedCol()','evt.key', 'evt.prefix*'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnLoad":
                convertEvents["onRenderFirstFinish"] = `function(evt) {\n//OnLoad\n${paramMapper(eventObj.params,[])} \n\n${eventObj.content}\n}`;
                break;

            case "OnLoadData":
                convertEvents["onBeforeDataLoad"] = `function(evt) {\n//OnLoadData\n${paramMapper(eventObj.params,['evt.data'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnLoadExcel":
                convertEvents["onImportFinish"] = `function(evt) {\n//OnLoadExcel\n${paramMapper(eventObj.params,['evt.result>-1','evt.result','evt.message'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnLoadFileSelect":
                convertEvents["onSelectFile"] = `function(evt) {\n//OnLoadFileSelect\n${paramMapper(eventObj.params,['evt.type','evt.filename'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnLoadText":
                convertEvents["onImportFinish"] = `function(evt) {\n//OnLoadText\n${paramMapper(eventObj.params,['evt.result*'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnMessage":
                convertEvents["onShowMessage"] = `function(evt) {\n//OnMessage\n${paramMapper(eventObj.params,['evt.message','null*','evt.isConfirm'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnMouseDown":
                convertEvents["onMouseDown"] = `function(evt) {\n//OnMouseDown\n${paramMapper(eventObj.params,['evt.event.button', 'evt.event.shiftKey?1:evt.event.ctrlKey?2:0','evt.x','evt.y'])} \n\n${eventObj.content}\n}`;
                break;
                
            case "OnMouseMove":
                convertEvents["onMouseMove"] = `function(evt) {\n//OnMouseMove\n${paramMapper(eventObj.params,['evt.event.button', 'evt.event.shiftKey?1:evt.event.ctrlKey?2:0','evt.x','evt.y'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnMouseUp":
                convertEvents["onMouseUp"] = `function(evt) {\n//OnMouseUp\n${paramMapper(eventObj.params,['evt.event.button', 'evt.event.shiftKey?1:evt.event.ctrlKey?2:0','evt.x','evt.y'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnMovePage":
                convertEvents["onBeforeGoToPage"] = `function(evt) {\n//OnMovePage\n${paramMapper(eventObj.params,['evt.sheet.getPageIndex(evt.sheet.getFocusedPage())*','evt.pagepos*'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnPageRequest":
                convertEvents["OnPageRequest"] = `function(evt) {\n//OnPageRequest\n//지원하지 않는 이벤트 입니다.\n}`;
                break;

            case "OnPopupClick":
                convertEvents["onButtonClick"] = `function(evt) {\n//OnPopupClick\n${paramMapper(eventObj.params,['evt.row','evt.col'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnResize":
                convertEvents["onResize"] = `function(evt) {\n//OnResize\n${paramMapper(eventObj.params,['evt.width','evt.height'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnRowDelete":
                convertEvents["OnRowDelete"] = `function(evt) {\n//OnRowDelete\n//지원하지 않는 이벤트 입니다.\n}`;
                break;

            case "OnRowSearchEnd":
                convertEvents["onRowLoad"] = `function(evt) {\n//OnRowSearchEnd\n${paramMapper(eventObj.params,['evt.row'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnSaveEnd":
                convertEvents["onAfterSave"] = `function(evt) {\n//OnSaveEnd\n${paramMapper(eventObj.params,['evt.result','evt.message','evt.response.status','evt.respone.responseText','evt.response'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnSearchEnd":
                convertEvents["onSearchFinish"] = `function(evt) {\n//OnSearchEnd\n//파라미터를 지원하지 못합니다.\n// \n\n${eventObj.content}\n}`;
                break;

            case "OnSelectMenu":
                convertEvents["onSelectMenu"] = `function(evt) {\n//OnSelectMenu\n${paramMapper(eventObj.params,['evt.result','evt.result','evt.col'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnSelectCell":
                convertEvents["onFocus"] = `function(evt) {\n//OnSelectCell\n${paramMapper(eventObj.params,['evt.orow','evt.ocol','evt.row','evt.col','null'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnSelectEnd":
                convertEvents["onSelectEnd"] = `function(evt) {\n//OnSelectEnd\n${paramMapper(eventObj.params,['evt.rows','evt.cols*'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnSmartResize":
                convertEvents["onResize"] = `function(evt) {\n//OnSmartResize\n${paramMapper(eventObj.params,['evt.Width','evt.Height'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnSort":
                convertEvents["onAfterSort"] = `function(evt) {\n//OnSort\n${paramMapper(eventObj.params,['evt.sheet.Sort*',''])} \n\n${eventObj.content}\n}`;
                break;

            case "OnTab":
                convertEvents["OnTab"] = `function(evt) {\n//OnTab\n//지원하지 않는 이벤트 입니다.\n}`;
                break;

            case "OnTreeCheckChange":
                convertEvents["OnTreeCheckChange"] = `function(evt) {\n//OnTreeCheckChange\n//OnClickSize() 이벤트를 확인해 주세요. \n\n${eventObj.content}\n}`;
                break;

            case "OnTreeChild":
                convertEvents["onBeforeExpand"] = `function(evt) {\n//OnTreeChild\n${paramMapper(eventObj.params,['evt.row'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnUserResize":
                convertEvents["onAfterColResize"] = `function(evt) {\n//OnUserResize\n${paramMapper(eventObj.params,['evt.col','evt.Cols[evt.col].Width'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnValidation":
                convertEvents["onValidation"] = `function(evt) {\n//OnValidation\n${paramMapper(eventObj.params,['evt.row','evt.col','evt.row[evt.col]'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnVScroll":
                convertEvents["onScroll"] = `function(evt) {\n//OnVScroll\n${paramMapper(eventObj.params,['evt.vpos','evt.oldvpos'])} \n\n${eventObj.content}\n}`;
                break;

            case "OnWaitTimeOut":
                convertEvents["OnWaitTimeOut"] = `function(evt) {\n//OnWaitTimeOut\n//지원하지 않는 이벤트 입니다.\n}`;
                break;

            case "OnChange":
                convertEvents["onAfterChange"] = `function(evt) {\n//OnChange\n${paramMapper(eventObj.params,['evt.row','evt.col','evt.val','evt.row[evt.col+\'BeforeVal\']',unsupportParam])} \n\n${eventObj.content}\n}`;
                break;
            case "OnClick":
                convertEvents["onAfterClick"] = `function(evt) {\n//OnClick\n${paramMapper(eventObj.params,['evt.row','evt.col','evt.val','evt.sheet.getColLeft[evt.col]*','evt.sheet.getRowTop[evt.row]*','evt.sheet.Cols[evt.col].Width','evt.sheet.getRowHeight(evt.row)','evt.row.Kind*'])} \n\n${eventObj.content}\n}`;
                break;
            
            
        }
    });
    let rtnCode = "";
    for(const key in convertEvents){
        rtnCode += `"${key}": ${convertEvents[key]},\n`;
    }
    console.log(convertEvents);
    return `var Options = {\n"Events": {\n${rtnCode}\n}\n}`;
};


export default convertEvent;