import Swal from 'sweetalert2';


var convertSheet = {};
var notice = "";


// jquery 대비
var $ = (param) => {return {}};

//ibsheet 객체명과 초기화 객체 명 찾기
export function findSheetId(legacyCode){
  const rtnObj = {};
    if(legacyCode.indexOf("IBS_InitSheet")>-1) {
        var start_pos = legacyCode.indexOf( "(" , legacyCode.indexOf("IBS_InitSheet")+13)+1;
        var mid_pos = legacyCode.indexOf(",",start_pos);
        var end_pos = legacyCode.indexOf(")",mid_pos+1);
        rtnObj.sheetID = legacyCode.substring(start_pos,mid_pos).trim(); // sheet id
        rtnObj.initObj = legacyCode.substring(mid_pos+1,end_pos).trim(); // sheet 초기화 객체
    }else{
        if(legacyCode.indexOf("with(")>-1) {
            var start_pos = legacyCode.indexOf("with(")+5;
            var end_pos = legacyCode.indexOf(")",start_pos);
             rtnObj.sheetID = legacyCode.substring(start_pos,end_pos).trim();
        }
    }
    // // 임의의 시트 객체
    // if(typeof rtnObj.initObj == "string" && rtnObj.initObj != ""){
    //   window[rtnObj.initObj] = {};
    // }

    // 시트가 생성되는 el 찾기
    var pos = legacyCode.search(/createIBSheet.\(/g)
    if(pos>-1){
        var pos2 = legacyCode.indexOf(",",pos);
        rtnObj.el = legacyCode.substring(pos+15 , pos2);
    }else{
        rtnObj.el = "";
    }
    if(typeof rtnObj.sheetID == "string" && rtnObj.sheetID != ""){
      createIBSheetObject(rtnObj);
    }else{
      Swal.fire({
        title: 'error',
        text: '시트 ID를 찾을 수 없습니다. createIBSheet, IBS_InitSheet 함수가 있는지 확인하세요.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      throw new Error("No Sheet ID");
    }

    return rtnObj;
}

//시트 이름으로 객체를 만들고 함수도 몇개 넣어주자.
function createIBSheetObject(rtnObj){
    
    convertSheet = {
        "Cfg":{},
        "Def":{
            "Row":{},
            "Col":{},
            "Header":{},
        },
        "LeftCols":[],
        "Cols":[],
        "Events":{}
    };

    var sheetid = rtnObj.sheetID;
    //해당하는 이름으로 객체를 생성
    window[sheetid] = {};
    

    //자주 사용하는 함수 생성
    window[sheetid]["SetEditable"] = function(v){
        convertSheet["Cfg"]["CanEdit"] = v;
    }
    window[sheetid]["SetVisible"] = function(v){

          if(!v){
            if(convertSheet["Events"]["onRenderFirstFinish"]){
                var org_onRenderFirstFinish = convertSheet["Events"]["onRenderFirstFinish"];
                var idx = org_onRenderFirstFinish.indexOf("}@@");
                org_onRenderFirstFinish = org_onRenderFirstFinish.substring(0,idx)+"evt.sheet.MainTag.style.display = 'none'; }@@";
                convertSheet["Events"]["onRenderFirstFinish"] = org_onRenderFirstFinish;
                
            }else{
                convertSheet["Events"]["onRenderFirstFinish"] = "@@function(evt){ evt.sheet.MainTag.style.display = 'none'; }@@";
            }
          }
    }

    window[sheetid]["SetComboOpenMode"] = function(v){
        notice += "//SetComboOpenMode사용  주의\r\n";
        // if(!v){
        //     window[sheetid].MainTag.style.display = "none";
        // }
    }
    window[sheetid]["SetImageList"] = function(v){
        notice += "//SetImageList사용 주의\r\n";
        // if(!v){
        //     window[sheetid].MainTag.style.display = "none";
        // }
    }
    window[sheetid]["SetCountPosition"] = function(v){
        if(v==0){
            convertSheet["Cfg"]["InfoRowConfig"] = {};
        }else{
            convertSheet["Cfg"]["InfoRowConfig"] = {
                Visible: 1,
            }
            switch(v){
                case 1:
                    convertSheet["Cfg"]["InfoRowConfig"]["Layout"] = ["Count",""];
                    convertSheet["Cfg"]["InfoRowConfig"]["Space"] = "Top";
                    break;
                case 2:
                    convertSheet["Cfg"]["InfoRowConfig"]["Layout"] = ["","Count"];
                    convertSheet["Cfg"]["InfoRowConfig"]["Space"] = "Top";
                    break;
                case 3:
                    convertSheet["Cfg"]["InfoRowConfig"]["Layout"] = ["Count",""];
                    convertSheet["Cfg"]["InfoRowConfig"]["Space"] = "Bottom";
                    break;
                case 4:
                    convertSheet["Cfg"]["InfoRowConfig"]["Layout"] = ["","Count"];
                    convertSheet["Cfg"]["InfoRowConfig"]["Space"] = "Bottom";
                    break;
            }
        } 
        
        
    }
    window[sheetid]["ShowToolTip"] = function(v){
        convertSheet["Def"] = convertSheet["Def"]||{};
        convertSheet["Def"]["Row"] = convertSheet["Def"]["Row"] || {};
        convertSheet["Def"]["Row"]["Tip"] = 1;
        
    }
    window[sheetid]["FitColWidth"] = function(v){
        convertSheet["Def"] = convertSheet["Def"]||{};
        convertSheet["Def"]["Col"] = convertSheet["Def"]["Col"] || {};
        convertSheet["Def"]["Col"]["RelWidth"] = 1;
    }
    window[sheetid]["SetAutoSumPosition"] = function(v){
        if(!v){
            if(convertSheet["Events"]["onRenderFirstFinish"]){
                var org_onRenderFirstFinish = convertSheet["Events"]["onRenderFirstFinish"];
                var idx = org_onRenderFirstFinish.indexOf("}@@");
                org_onRenderFirstFinish = org_onRenderFirstFinish.substring(0,idx)+"evt.sheet.setFormulaRowPosition(0); }@@";
                convertSheet["Events"]["onRenderFirstFinish"] = org_onRenderFirstFinish;
                
            }else{
                convertSheet["Events"]["onRenderFirstFinish"] = "@@function(evt){ evt.sheet.setFormulaRowPosition(0); }@@";
            }
        }
    }
    window[sheetid]["ShowFilterRow"] = function(v){
        convertSheet["Cfg"]["ShowFilter"] = 1;
    }


    
    var _initCfg, _initHeader, _initHeaderInfo;
    window[sheetid]["SetConfig"] = function(cfg) {
        _initCfg = cfg;
    }
    window[sheetid]["InitHeaders"] = function(header, info) {
        _initHeader = header;
        _initHeaderInfo = info;
    }
    window[sheetid]["InitColumns"] = function(cols){
        var opt = {
            Cfg: _initCfg,
            HeaderMode: _initHeaderInfo
        };
        var colHeaders = [];
        _initHeader.forEach((v,i)=>{
            const cols = v.Text.split("|");
            cols.forEach((x,ii)=>{
                if(i==0){
                    colHeaders[ii] = x;
                }else{
                    colHeaders[ii] += "|"+x;
                }
            });
        })
        cols = cols.map((v,i)=>{
            if(typeof colHeaders[i] != "undefined") {
                v.Header = colHeaders[i] ;
            }else {
                v.Header = new Array(colHeaders[0].split("|").length).fill("").join("|");
            }
            return v});
        opt.Cols = cols;
        IBS_InitSheet("", opt);
    }
    window[sheetid]["SetColProperty"] = function(colName, opt) {
        var colNames = ["LeftCols","Cols","RightCols"];
        colNames.forEach( (ca,idx) => {
            if(convertSheet[ca]){
                var colIdx = convertSheet[ca].findIndex( col => col.Name == colName);
                if(colIdx>-1) {
                    var keys = Object.keys(opt);
                    keys.forEach(key=>{
                        switch(key){
                            case 'ComboCode':
                                convertSheet[ca][colIdx]["EnumKeys"] = "|" + opt[key];
                                break;
                            case 'ComboText':
                                convertSheet[ca][colIdx]["Enum"] = "|" + opt[key];
                                break;
                        }
                        
                    });
                }
            }
        });
    }
    window[sheetid]["SetEditableColorDiff"] = function(v) {
        if(v === 0) {
            convertSheet.Cfg.ColorState = convertSheet.Cfg.ColorState?convertSheet.Cfg.ColorState-24:39;
        }
    }
    window[sheetid]["SetFocusAfterProcess"] = function(v) {
        if(v === 0) {
            convertSheet.Cfg.IgnoreFocused = 1;
        }
    }
    window[sheetid]["SetActionMenu"] = function(v) {
        if(v) {
            convertSheet.Def.Row.Menu = "|" + v;
        }
    }
    window[sheetid]["SetDataLinkMouse"] = function(colName, v) {
        if(isNaN(colName)&&v) {
            var colNames = ["LeftCols","Cols","RightCols"];
            colNames.forEach( (ca,idx) => {
                if(convertSheet[ca]){
                    var colIdx = convertSheet[ca].findIndex( col => col.Name == colName);
                    if(colIdx && colIdx>-1) {
                        convertSheet[ca][colIdx]["Cursor"] = "pointer";
                        convertSheet[ca][colIdx]["TextStyle"] = 4;
                    }
                }
            });
        }
    }

    window[sheetid]["SetExtendLastCol"] = function(v) {
        if(v) {
            convertSheet.Cols[convertSheet.Cols.length - 1].RelWidth = 1;
        }
    }
    

}// end createIBSheetObject

// 의미 없는 시트 생성 함수 (오류만 나지않게 만들어 둠)
function createIBSheet2() {}
function createIBSheet4() {}

function revertString(str){
    str = str.split("\"@@").join("").split("@@\"").join("");
    str = str.split("⁖{").join("${");
    str = str.replace(/`⁛{/g,"${").replace(/`!⁛{/g,"!${").split("⁛\`").join("");
    str = str.split("@@\\\"").join("\"");
    //c:if 문 원복
    if( str.indexOf("{\"cif\":\"<c")>-1) {
        var pos = str.indexOf("{\"cif\":\"<");
        while(pos > -1) {
            var pos2 = str.indexOf(">\"},",pos);
            str = str.substr(0,pos) + str.substring(pos+8, pos2+1) + str.substr(pos2+4);
            pos = str.indexOf("{\"cif\":\"<");
        }
    }
    return str;
}
function myEval(str) {
    try{
        eval(str);
        return true;
    }catch(e){
        if(e.name == "ReferenceError"){
            var newVal = e.message.substring(0, e.message.indexOf(" is not defined"));
            
            window[newVal] = "@@"+newVal+"@@";
            return false;
        }else if(e.name == "TypeError" && e.message.indexOf(" is not a function")>-1){
            var newVal = e.message.substring(0, e.message.indexOf(" is not a function"));
            window[newVal] = function(){};
            return false;
        }else{
            console.log(e);
        }

        return true;
    }
}

//최종 변환!!
export function convert7to8(legacyCode, sheetid, initObj, elObj){
    
    // jsp <% %> 대응
    legacyCode = legacyCode.replace(/<%\s(.*?)%>/gs, (match, p1) => {
        
        Swal.fire({
            title: 'warning',
            text: '소스 안에 <% %> jsp 코드가 있습니다. 주의하세요.',
            icon: 'warning',
            timer: 1300,
            confirmButtonText: 'OK'
          })
        return "";
    });

    // jsp <%= %> 대응
    legacyCode = legacyCode.replace(/<%=(.*?)%>/gs, (match, p1) => {
        return `<%=${p1.replace(/\"/g, "⁂")}%>`;
    });

    // jsp <%-- --%> 대응
    legacyCode = legacyCode.replace(/<%\-\-(.*?)\-\-%>/gs, "");


    //라인 주석 제거
    legacyCode = legacyCode.split("\n").map(line=>{
        var pos = line.indexOf("//");
        if(pos>-1){
            // 주석 뒷 라인을 제거하자
            return line.substring(0, pos);
        }
        return line;
    }).join("\n");

    
    //java spring:message에 대한 부분 수정
    if( legacyCode.indexOf("spring:message") > -1 ) {
        while(legacyCode.indexOf('"<spring:message') > 0) {
            var pos = legacyCode.indexOf('"<spring:message');
            // legacyCode = legacyCode.substr(0,pos) + "`" + legacyCode.substr(pos+1);
            var pos2 = legacyCode.indexOf('/>', pos);
            var pos3 = legacyCode.indexOf('\"', pos2);
            // legacyCode = legacyCode.substr(0, pos+2) + "`" + legacyCode.substr(pos+3); 
            legacyCode = legacyCode.substr(0, pos-1) + "`" + legacyCode.substring(pos+1, pos3).split("\"").join("'") + "`" + legacyCode.substr(pos3+1);
        }
    }
    // ${} 에 대한 오류 대응
    legacyCode = legacyCode.split("\"${").join("\"⁖{");
    
    var pos = legacyCode.indexOf("${"),pos2;
    while(legacyCode.indexOf("${") > -1) {
        pos2 = legacyCode.indexOf("}", pos);
        legacyCode = legacyCode.substr(0, pos) + "\`⁛{" + legacyCode.substring(pos+2, pos2+1) + "⁛\`" + legacyCode.substr(pos2+1);
        pos = legacyCode.indexOf("${");
    }

    //java <c:if.. 에 대한 부분 코드 (라인 단위로 강제로 값을 넣자)
    if( legacyCode.indexOf("<c:if") > -1 ) {

        legacyCode = legacyCode.split("\n").map(line=>{
            var pos = line.indexOf("<c:if"),
                pos2 = line.indexOf("</c:if>");
            // 열고 닫는 테그가 같은 라인안에 있는 경우    
            if(pos>-1 && pos2>-1) { return line;}
            if(pos>-1){
                var pos3 = line.indexOf(">",pos) + 1;
                return "{'cif':\"" + line.substring(pos,pos3).split('"').join("@@\\\"") + "\"},";
            }
            if(pos2>-1){
                return "{'cif':\"" + "</c:if>".split('"').join("@@\\\"") + "\"},";
            }
            return line;
        }).join("\n");
    }

    console.log(legacyCode);
    
    while(1){
        if(myEval(legacyCode)){
            break;
        }
    }
    
    initObj = initObj!=""?initObj:"OPT";

    var cols = JSON.stringify( customSort(convertSheet.Cols) );
    var leftCols = convertSheet.LeftCols.length?JSON.stringify( customSort(convertSheet.LeftCols) ):"";
    delete convertSheet.Cols;
    delete convertSheet.LeftCols;

    cols = "'Cols':\n\t\t"+cols.split("},{").join("},\n\t\t{")+",\n\t";
    cols = cols.split("],[").join("],\n\n\t\t[");
    if(leftCols){
        leftCols = "\"LeftCols\":\n\t\t"+leftCols.split("},{").join("},\n\t\t{")+",\n\t";
    }
    if(Object.keys(convertSheet.Def.Row).length === 0) {
        delete convertSheet.Def.Row;
    }
    if(Object.keys(convertSheet.Def.Col).length === 0) {
        delete convertSheet.Def.Col;
    }
    if(Object.keys(convertSheet.Def.Header).length === 0) {
        delete convertSheet.Def.Header;
    }



    var beautified = JSON.stringify(convertSheet,null, "\t");

    var pos = beautified.indexOf("\"Events\"");
    beautified = beautified.substring(0,pos)+ leftCols + cols +  beautified.substring(pos);
    var resultCode = "";
      resultCode = "var "+initObj+" = " + revertString(beautified) + ";\r\n";

      resultCode +=  
`IBSheet.create({
  "sync": 1,
  "id":"${sheetid}",
  "el":${elObj ? elObj : "\""+sheetid+'Div'+"\"" },
  "options":${initObj}
});\r\n`;
    resultCode += notice;


    // jsp <%= %> 대응
    resultCode = resultCode.replace(/⁂/g,"\"");

    return resultCode;
}
//컬럼에서 Header, Type, Name, Format 순으로 정렬하려고 넣음
function customSort(cols){
    const colSort = (cols) => {
        var order = {"Header":9, "Type": 8, "Name": 7, "Format": 6, "Width": 5, "Align": 4, "CanEdit": 3, "EnumKeys": 1, "Enum": 2};
        cols = cols.map(col=>{
            const ordered = {};
            Object.keys(col).sort((a,b)=>{
                if(typeof order[a] == "undefined" && typeof order[b] == "undefined") return 0;
                if(typeof order[a] == "undefined" && order[b]) return 1;
                if(typeof order[b] == "undefined" && order[a]) return -1;
                if(order[a] > order[b]) {
                    return -1;
                }
            }).forEach(function(key) {
                ordered[key] = col[key];
            })
            return ordered;
        });
        return cols;
    }

    // 멀티레코드인 경우
    if(Array.isArray(cols[0])){
        for(var i = 0 ; i < cols.length ; i++) {
            cols[i] = colSort(cols[i]);
        }
    }else{
        cols = colSort(cols);
    }
    return cols;
}


function IBS_InitSheet(sheetId, createOption){
    function addCalcOrder(calcOrder){
        convertSheet["Def"]["Row"]["CanFormula"] = 1;
        if(convertSheet["Def"]["Row"]["CalcOrder"]){
            convertSheet["Def"]["Row"]["CalcOrder"] = convertSheet["Def"]["Row"]["CalcOrder"] + "," +  calcOrder;
        }else{
            convertSheet["Def"]["Row"]["CalcOrder"] = calcOrder;
        }
    }
    function convertCols(Cols, colIdx, ArrCols) {
        const newCols = [];
        for(var c=0;c<Cols.length;c++){
            var tempcol = {};
            tempcol["Desc"] = [];
            for(var item in Cols[c]){
                
                if(typeof Cols[c]["InsertEdit"] != "undefined"){
                    tempcol["AddEdit"] = Cols[c]["InsertEdit"];
                    delete Cols[c]["InsertEdit"];
                }
                if(typeof Cols[c]["UpdateEdit"] != "undefined"){
                    tempcol["ChangeEdit"] = Cols[c]["UpdateEdit"];
                    delete Cols[c]["UpdateEdit"];
                }

                // 둘다 true 인 경우에는 없애자
                if(tempcol["AddEdit"] && tempcol["ChangeEdit"]){
                    delete tempcol["AddEdit"];
                    delete tempcol["ChangeEdit"];
                }
                // 둘다 false 인 경우에는 CanEdit:0을 넣자
                if(!tempcol["AddEdit"] && !tempcol["ChangeEdit"]){
                    delete tempcol["AddEdit"];
                    delete tempcol["ChangeEdit"];
                    tempcol["CanEdit"] = 0;
                }


                // if(typeof Cols[c]["InsertEdit"] != "undefined" && !Cols[c]["InsertEdit"] && typeof Cols[c]["UpdateEdit"] != "undefined" && !Cols[c]["UpdateEdit"]){
                //     tempcol["CanEdit"] = 0;
                // }
                // if(Cols[c]["InsertEdit"] && !Cols[c]["UpdateEdit"]){
                //     // tempcol["CanEditFormula"] = "Row.Added==1?1:0";
                //     // addCalcOrder(Cols[c]["SaveName"]+"CanEdit");
                //     tempcol["AddEdit"] = 1;
                //     tempcol["CanEdit"] = 0;
                // }
                // delete Cols[c]["InsertEdit"];
                // delete Cols[c]["UpdateEdit"];
    
                if( Cols[c].hasOwnProperty(item)){
                    var itemValue =  Cols[c][item];
                    
                    switch(item){
                        case "Header":
                            tempcol["Header"] = itemValue.split("|");
                            break;
                        case "Type":
                            switch(itemValue){
                                case "CheckBox":
                                    tempcol["Type"] = "Bool";
                                    break;
                                case "DummyCheck":
                                    tempcol["Type"] = "Bool";
                                    tempcol["NoChanged"] = 1;
                                    break;
                                case "AutoSum":
                                    tempcol["Type"] = "Int";
                                    // tempcol["Format"] = "#,###";
                                    if(Cols[c]["Format"] ) {
                                        if(Cols[c]["Format"] == "Float" ||  Cols[c]["Format"] == "NullFloat" ) {
                                            tempcol["Type"] = "Float";
                                            // tempcol["Format"] = "#,##0.0";
                                        }
                                        if(Cols[c]["Format"].indexOf("#.") > -1 || Cols[c]["Format"].indexOf("0.") > -1 ) {
                                            tempcol["Type"] = "Float";
                                        }
                                    }
                                    tempcol["FormulaRow"] = "Sum";
                                    break;
                                case "Image":
                                    tempcol["Type"] = "Img";
                                    break;
                                case "Popup":
                                case "PopupEdit":
                                    tempcol["Type"] = "Text";
                                    tempcol["Extend"] = "@@IB_Preset.Popup@@";
                                    break;
                                case "Seq":
                                    tempcol["Type"] = "Int";
                                    tempcol["Name"] = "SEQ";
                                    tempcol["Desc"].push("컬럼 Name 변경 주의!!");
                                    break;
                                case "Button":
                                    tempcol["Type"] = "Button";
                                    tempcol["Button"] = "Button";
                                    break;
                                case "Combo":
                                    tempcol["Type"] = "Enum";
                                    if(Cols[c]["ComboCode"])  {
                                        tempcol["EnumKeys"] = Cols[c]["ComboCode"];
                                        delete Cols[c]["ComboCode"];
                                    }
                                    if(Cols[c]["ComboText"]) {
                                        tempcol["Enum"] = Cols[c]["ComboText"];
                                        delete Cols[c]["ComboText"];
                                    }  
                                    break;
                                case "Status":
                                    tempcol["Extend"] = "@@IB_Preset.STATUS@@";
                                    break;
                                case "DelCheck":
                                    tempcol["Extend"] = "@@IB_Preset.DelCheck@@";
                                    break;
                                default:
                                    tempcol["Type"] = itemValue;
                                    break;
                            
                            }
                            break;
                        
                        case "BackColor":
                            tempcol["Color"] = itemValue;
                            break;
                        case "EditLen":
                            tempcol["Size"] = itemValue;
                            break;
                        case "FontColor":
                            tempcol["TextColor"] = itemValue;
                            break;
                        case "Format":
                            if(itemValue){
                                switch(itemValue){
                                    case "Ymd":
                                        tempcol["Extend"] = "@@IB_Preset.YMD@@";
                                        break;
                                    case "Ym":
                                        tempcol["Extend"] = "@@IB_Preset.YM@@";
                                        break;
                                    case "Md":
                                        tempcol["Extend"] = "@@IB_Preset.MD@@";
                                        break;
                                    case "Hms":
                                        tempcol["Extend"] = "@@IB_Preset.HMS@@";
                                        break;
                                    case "Hm":
                                        tempcol["Extend"] = "@@IB_Preset.HM@@";
                                        break;
                                    case "YmdHms":
                                        tempcol["Extend"] = "@@IB_Preset.YMDHMS@@";
                                        break;
                                    case "YmdHm":
                                        tempcol["Extend"] = "@@IB_Preset.YMDHM@@";
                                        break;
                                    case "Integer":
                                        tempcol["Extend"] = "@@IB_Preset.Integer@@";
                                        break;
                                    case "NullInteger":
                                        tempcol["Extend"] = "@@IB_Preset.NullInteger@@";
                                        break;
                                    case "Float":
                                        tempcol["Extend"] = "@@IB_Preset.Float@@";
                                        break;
                                    case "NullFloat":
                                        tempcol["Extend"] = "@@IB_Preset.NullFloat@@";
                                        break;
                                    case "IdNo":
                                        tempcol["Extend"] = "@@IB_Preset.IdNo@@";
                                        break;
                                    case "SaupNo":
                                        tempcol["Extend"] = "@@IB_Preset.SaupNo@@";
                                        break;
                                    case "PostNo":
                                        tempcol["Extend"] = "@@IB_Preset.PostNo@@";
                                        break;
                                    case "CardNo":
                                        tempcol["Extend"] = "@@IB_Preset.CardNo@@";
                                        break;
                                    case "PhoneNo":
                                        tempcol["Extend"] = "@@IB_Preset.PhoneNo@@";
                                        break;
                                    case "Number":
                                        tempcol["Extend"] = "@@IB_Preset.Number@@";
                                        break;
                                    default:
                                        tempcol["Format"] = itemValue;
                                        break;
                                }
                            }
                            break;
                        case "HeaderCheck":
                            if(itemValue)
                                var headerStr = tempcol["Header"][tempcol["Header"].length-1];
                                tempcol["Header"][tempcol["Header"].length-1] = {Value:headerStr,HeaderCheck:1};
                            break;   
                        case "Hidden":
                            if(typeof itemValue == "string" && itemValue.startsWith("@@")){
                                tempcol["Visible"] =  "@@!"+itemValue.substr(2);
                            }else{
                                tempcol["Visible"] =  eval(itemValue)?0:1;
                            }
                            break;
                        case "SaveName":
                            if(Cols[c]["Type"]!="Seq")
                                tempcol["Name"] = itemValue;
                            break;
                        case "KeyField":
                            if(itemValue) {
                                tempcol["Required"] = itemValue;
                            }
                            break;
                        case "AcceptKeys":
                            _IBSheet.v7.convertAcceptKeys(tempcol,itemValue);
                            break;
                        case "ActionMenu":
                              tempcol["Menu"] = "|"+itemValue;
                            break;
                        case "ApproximateType":
                              tempcol["Desc"].push("ApproximateType 지원 안함.");
                                break;
                        case "ButtonUrl":
                            tempcol["Button"] = itemValue;
                            break;
                        case "CalcLogic":
                            if(itemValue){
                                if(typeof itemValue == "string"){
                                    tempcol["Formula"] = itemValue.split("|").join("");
                                    addCalcOrder(Cols[c]["SaveName"]);
                                }else{
                                    tempcol["Desc"].push("함수형 CalcLogic 변경 불가");
                                }
                            }
                            break;
                        case "CheckSaveName":
                            tempcol["Desc"].push("CheckSaveName 지원 안함.저장함수의 saveAttr:'"+Cols[c]["SaveName"]+"Checked' 설정할 것.");
                            break;
                        case "ClassName":
                            tempcol["ButtonClass"] = itemValue;
                            tempcol["Desc"].push("ClassName사용. 버튼 클레스의 이름이 'GMButton설정명'에서 'IBTool설정명'으로 변경됨");
                            break;
                        case "CopyFormat":
                            tempcol["Desc"].push("CopyFormat지원 안함. (cfg)CopyEdit를 사용할 것");
                            break;
                        case "CopyPaste":
                            tempcol["CanCopyPaste"] = !(itemValue);
                            break;
                        case "ComboFilter":
                            if(itemValue==0){
                                tempcol["Suggest"] = "";
                            }else if(itemValue==1){
                                tempcol["SuggestType"] = "Empty,Start,Arrows,Search";
                            }else{
                                tempcol["SuggestType"] = "Empty,Start,Arrows,Begin";
                            }
                            break;
                        case "Cursor":
                            tempcol["Cursor"] = itemValue.toLowerCase();
                            break;
                        case "Edit":
                            tempcol["CanEdit"] = itemValue;
                            break;
                        case "EditPointCount":
                            if(itemValue){
                                tempcol["EditFormat"] = "#,###.".padEnd(6+itemValue,"#");
                            }
                            break;
                        case "EmptyToReplaceChar":
                                tempcol["EmptyValue"] = itemValue;
                            break;
                        case "ZeroToReplaceChar":
                            var f = Cols[c]["Format"];
                            if(typeof f == "string"){
                                tempcol["Format"] = f+";"+f+";"+itemValue;
                            }
                            break;
                        case "EnterMode":
                            tempcol["AcceptEnters"] = itemValue;
                            break;
                        case "ExceptKeys":
                            var setV = itemValue;
                            var acceptKeyArr = setV.split("|");
                            var mask = "";
    
                            for (var i = 0; i < acceptKeyArr.length; i++) {
                                switch (acceptKeyArr[i]) {
                                case "E":
                                    mask += "|^a-zA-Z";
                                    break;
                                case "N":
                                    mask += "|^\\d";
                                    break;
                                case "K":
                                    mask += "|^\\u3131-\\u314e\\u314f-\\u3163\\uac00-\\ud7a3";
                                    break;
                                default:
                                    if (acceptKeyArr[i].substring(0, 1) == "[" && acceptKeyArr[i].substring(acceptKeyArr[i].length-1) == "]") {
                                        var otherKeys = acceptKeyArr[i].substring(1, acceptKeyArr[i].length-1);
                                        for (var x = 0; x<otherKeys.length; x++) {
                                            if ([".","-","$","^","*","+","|","(",")"].indexOf(otherKeys[x]) > -1) {
                                                mask += "|^\\" + otherKeys[x];
                                            } else {
                                                mask += "|^" + otherKeys[x];
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                            tempcol["EditMask"] = "^[" + mask.substring(1) + "]*$";
                            break;
                        case "FitColWidth":
                            if(!itemValue) tempcol["RelWidth"] = 0;
                            break;
                        case "Focus":
                            tempcol["CanFocus"] = itemValue;
                            break;
                        case "FontBold":
                            if(!tempcol["TextStyle"])  tempcol["TextStyle"] = 0;
                            if(itemValue) tempcol["TextStyle"] = tempcol["TextStyle"]+1;
                            break;
                        case "FontColor":
                            tempcol["TextColor"] = itemValue
                            break;
                        case "FontUnderline":
                            if(!tempcol["TextStyle"])  tempcol["TextStyle"] = 0;
                            if(itemValue) tempcol["TextStyle"] = tempcol["TextStyle"]+4;
                            break;
                        case "FullInput":
                            tempcol["Desc"].push("FullInput 기능 지원 안함.");
                            break;
                        case "GroupSumType":
                            convertSheet.Def["Group"] = convertSheet.Def["Group"]||{};
                            convertSheet.Def["Group"]["Expanded"] = 1;
                            convertSheet.Def["Group"][Cols[c]["SaveName"]] = {"Formula":"sum()"};
                            break;
                        case "HoverUnderline":
                            tempcol["Class"] = itemValue?"SheetHoverUnderline":"";
                            break;
                        case "Image":
                            tempcol["Desc"].push("Image 기능 지원 안함. Icon이나 Button을 사용할 것.");
                            break;
                        case "ImgAlign":
                            tempcol["Desc"].push("ImgAlign 기능 지원 안함.");
                            break;
                        case "ImgHeight":
                            tempcol["Desc"].push("ImgHeight 기능 지원 안함.");
                            break;
                        case "ImgWidth":
                            tempcol["Desc"].push("ImgWidth 기능 지원 안함.");
                            break;
                        case "Width":
                            tempcol["RelWidth"] = itemValue;
                            tempcol["Width"] = itemValue;
                            break;
                        case "ItemText":
                            if(tempcol["Type"] == "Bool"){
                                tempcol["Type"] == "Radio";
                                tempcol["HRadio"] == 0;
                            }
                            tempcol["Enum"] == "|"+itemValue;
                            break;
                        case "ItemCode":
                            if(tempcol["Type"] == "Bool"){
                                tempcol["Type"] == "Radio";
                                tempcol["HRadio"] == 0;
                            }
                            tempcol["EnumKeys"] == "|"+itemValue;
                            break;
                        // case "MaxCheck":
                        //     break;
                        // case "MaximumValue":
                        //     break;
                        // case "MinimumValue":
                        //     break;
                        case "MenuFilter":
                            convertSheet.Def["Filter"] = convertSheet.Def["Filter"]||{};
                            convertSheet.Def["Filter"][Cols[c]["SaveName"]+"Filter"] = itemValue;
                            break;
                        case "MultiLineText":
                            tempcol["Type"] = "Lines";
                            break;
                        case "PointCount":
                            if(itemValue) {
                                if(typeof itemValue == "number") {

                                    if((tempcol["Type"]=="Int" || tempcol["Type"] == "Float") &&   itemValue > 0){
                                        tempcol["Format"] = "#,###.".padEnd(6+itemValue,"#");
                                    }else{
                                        tempcol["PointCount"] = itemValue;
                                    }
                                }else{
                                    if(typeof itemValue == "string" && itemValue.startsWith("@@")) itemValue = itemValue.substring(2, itemValue.length -2);
                                    tempcol["Format"] = "@@getPointCount("+itemValue+")@@"
                                }
                            }
                            break;
                        case "PopupButton":
                            tempcol["Button"] = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiB2aWV3Qm94PSIwIDAgNjQwIDY0MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1Ij48ZGVmcz48cGF0aCBkPSJNMjc5LjczIDM0LjdMMjg5LjAxIDM1LjY0TDI5OC4xNyAzNi45NUwzMDcuMjIgMzguNjFMMzE2LjEzIDQwLjYyTDMyNC45MiA0Mi45OEwzMzMuNTYgNDUuNjZMMzQyLjA1IDQ4LjY4TDM1MC4zOCA1Mi4wMUwzNTguNTUgNTUuNjZMMzY2LjU1IDU5LjYxTDM3NC4zNyA2My44NkwzODIuMDEgNjguMzlMMzg5LjQ1IDczLjIxTDM5Ni42OCA3OC4zMUw0MDMuNzEgODMuNjdMNDEwLjUzIDg5LjNMNDE3LjEyIDk1LjE3TDQyMy40OCAxMDEuMjlMNDI5LjYgMTA3LjY1TDQzNS40OCAxMTQuMjRMNDQxLjEgMTIxLjA2TDQ0Ni40NiAxMjguMDlMNDUxLjU2IDEzNS4zM0w0NTYuMzggMTQyLjc3TDQ2MC45MiAxNTAuNEw0NjUuMTcgMTU4LjIyTDQ2OS4xMiAxNjYuMjJMNDcyLjc2IDE3NC4zOUw0NzYuMSAxODIuNzJMNDc5LjExIDE5MS4yMkw0ODEuOCAxOTkuODZMNDg0LjE1IDIwOC42NEw0ODYuMTYgMjE3LjU2TDQ4Ny44MiAyMjYuNkw0ODkuMTMgMjM1Ljc2TDQ5MC4wNyAyNDUuMDRMNDkwLjY0IDI1NC40Mkw0OTAuODMgMjYzLjlMNDkwLjY0IDI3My4zOEw0OTAuMDcgMjgyLjc2TDQ4OS4xMyAyOTIuMDRMNDg3LjgyIDMwMS4yTDQ4Ni4xNiAzMTAuMjVMNDg0LjE1IDMxOS4xNkw0ODEuOCAzMjcuOTVMNDc5LjExIDMzNi41OUw0NzYuMSAzNDUuMDhMNDcyLjc2IDM1My40MUw0NjkuMTIgMzYxLjU4TDQ2NS4xNyAzNjkuNThMNDYwLjkyIDM3Ny40TDQ1Ni4zOCAzODUuMDRMNDUxLjczIDM5Mi4yMkw1OTYuOTcgNTM3LjQ2TDUzNC40MyA2MDBMMzg5LjE5IDQ1NC43NkwzODIuMDEgNDU5LjQxTDM3NC4zNyA0NjMuOTVMMzY2LjU1IDQ2OC4yTDM1OC41NSA0NzIuMTVMMzUwLjM4IDQ3NS43OUwzNDIuMDUgNDc5LjEzTDMzMy41NiA0ODIuMTRMMzI0LjkyIDQ4NC44M0wzMTYuMTMgNDg3LjE4TDMwNy4yMiA0ODkuMTlMMjk4LjE3IDQ5MC44NUwyODkuMDEgNDkyLjE2TDI3OS43MyA0OTMuMUwyNzAuMzUgNDkzLjY3TDI2MC44NyA0OTMuODZMMjUxLjM5IDQ5My42N0wyNDIuMDEgNDkzLjFMMjMyLjczIDQ5Mi4xNkwyMjMuNTcgNDkwLjg1TDIxNC41MyA0ODkuMTlMMjA1LjYxIDQ4Ny4xOEwxOTYuODMgNDg0LjgzTDE4OC4xOSA0ODIuMTRMMTc5LjY5IDQ3OS4xM0wxNzEuMzYgNDc1Ljc5TDE2My4xOSA0NzIuMTVMMTU1LjE5IDQ2OC4yTDE0Ny4zNyA0NjMuOTVMMTM5Ljc0IDQ1OS40MUwxMzIuMyA0NTQuNTlMMTI1LjA2IDQ0OS40OUwxMTguMDMgNDQ0LjEzTDExMS4yMSA0MzguNTFMMTA0LjYyIDQzMi42M0w5OC4yNiA0MjYuNTFMOTIuMTQgNDIwLjE1TDg2LjI3IDQxMy41Nkw4MC42NCA0MDYuNzRMNzUuMjggMzk5LjcxTDcwLjE4IDM5Mi40OEw2NS4zNiAzODUuMDRMNjAuODIgMzc3LjRMNTYuNTggMzY5LjU4TDUyLjYzIDM2MS41OEw0OC45OCAzNTMuNDFMNDUuNjUgMzQ1LjA4TDQyLjYzIDMzNi41OUwzOS45NSAzMjcuOTVMMzcuNTkgMzE5LjE2TDM1LjU4IDMxMC4yNUwzMy45MiAzMDEuMkwzMi42MSAyOTIuMDRMMzEuNjcgMjgyLjc2TDMxLjEgMjczLjM4TDMwLjkxIDI2My45TDMxLjEgMjU0LjQyTDMxLjY3IDI0NS4wNEwzMi42MSAyMzUuNzZMMzMuOTIgMjI2LjZMMzUuNTggMjE3LjU2TDM3LjU5IDIwOC42NEwzOS45NSAxOTkuODZMNDIuNjMgMTkxLjIyTDQ1LjY1IDE4Mi43Mkw0OC45OCAxNzQuMzlMNTIuNjMgMTY2LjIyTDU2LjU4IDE1OC4yMkw2MC44MiAxNTAuNEw2NS4zNiAxNDIuNzdMNzAuMTggMTM1LjMzTDc1LjI4IDEyOC4wOUw4MC42NCAxMjEuMDZMODYuMjcgMTE0LjI0TDkyLjE0IDEwNy42NUw5OC4yNiAxMDEuMjlMMTA0LjYyIDk1LjE3TDExMS4yMSA4OS4zTDExOC4wMyA4My42N0wxMjUuMDYgNzguMzFMMTMyLjMgNzMuMjFMMTM5Ljc0IDY4LjM5TDE0Ny4zNyA2My44NkwxNTUuMTkgNTkuNjFMMTYzLjE5IDU1LjY2TDE3MS4zNiA1Mi4wMUwxNzkuNjkgNDguNjhMMTg4LjE5IDQ1LjY2TDE5Ni44MyA0Mi45OEwyMDUuNjEgNDAuNjJMMjE0LjUzIDM4LjYxTDIyMy41NyAzNi45NUwyMzIuNzMgMzUuNjRMMjQyLjAxIDM0LjdMMjUxLjM5IDM0LjEzTDI2MC44NyAzMy45NEwyNzAuMzUgMzQuMTNMMjc5LjczIDM0LjdaTTI0OS4yMyAxMjIuNDhMMjQzLjUxIDEyMy4wNkwyMzcuODYgMTIzLjg3TDIzMi4yOCAxMjQuODlMMjI2Ljc3IDEyNi4xM0wyMjEuMzUgMTI3LjU5TDIxNi4wMiAxMjkuMjRMMjEwLjc4IDEzMS4xTDIwNS42NCAxMzMuMTZMMjAwLjYgMTM1LjQxTDE5NS42NiAxMzcuODVMMTkwLjg0IDE0MC40N0wxODYuMTMgMTQzLjI3TDE4MS41NCAxNDYuMjRMMTc3LjA3IDE0OS4zOUwxNzIuNzMgMTUyLjdMMTY4LjUzIDE1Ni4xN0wxNjQuNDYgMTU5Ljc5TDE2MC41NCAxNjMuNTdMMTU2Ljc2IDE2Ny40OUwxNTMuMTQgMTcxLjU2TDE0OS42NyAxNzUuNzZMMTQ2LjM2IDE4MC4xTDE0My4yMSAxODQuNTdMMTQwLjI0IDE4OS4xNkwxMzcuNDQgMTkzLjg3TDEzNC44MiAxOTguNjlMMTMyLjM4IDIwMy42M0wxMzAuMTMgMjA4LjY3TDEyOC4wNyAyMTMuODFMMTI2LjIxIDIxOS4wNUwxMjQuNTYgMjI0LjM4TDEyMy4xIDIyOS44TDEyMS44NiAyMzUuMzFMMTIwLjg0IDI0MC44OUwxMjAuMDMgMjQ2LjU0TDExOS40NSAyNTIuMjZMMTE5LjEgMjU4LjA1TDExOC45OCAyNjMuOUwxMTkuMSAyNjkuNzVMMTE5LjQ1IDI3NS41NEwxMjAuMDMgMjgxLjI2TDEyMC44NCAyODYuOTJMMTIxLjg2IDI5Mi41TDEyMy4xIDI5OEwxMjQuNTYgMzAzLjQyTDEyNi4yMSAzMDguNzVMMTI4LjA3IDMxMy45OUwxMzAuMTMgMzE5LjEzTDEzMi4zOCAzMjQuMTdMMTM0LjgyIDMyOS4xMUwxMzcuNDQgMzMzLjkzTDE0MC4yNCAzMzguNjRMMTQzLjIxIDM0My4yM0wxNDYuMzYgMzQ3LjdMMTQ5LjY3IDM1Mi4wNEwxNTMuMTQgMzU2LjI0TDE1Ni43NiAzNjAuMzFMMTYwLjU0IDM2NC4yM0wxNjQuNDYgMzY4LjAxTDE2OC41MyAzNzEuNjRMMTcyLjczIDM3NS4xMUwxNzcuMDcgMzc4LjQyTDE4MS41NCAzODEuNTZMMTg2LjEzIDM4NC41M0wxOTAuODQgMzg3LjMzTDE5NS42NiAzODkuOTZMMjAwLjYgMzkyLjM5TDIwNS42NCAzOTQuNjRMMjEwLjc4IDM5Ni43TDIxNi4wMiAzOTguNTZMMjIxLjM1IDQwMC4yMkwyMjYuNzcgNDAxLjY3TDIzMi4yOCA0MDIuOTFMMjM3Ljg2IDQwMy45NEwyNDMuNTEgNDA0Ljc0TDI0OS4yMyA0MDUuMzJMMjU1LjAyIDQwNS42N0wyNjAuODcgNDA1Ljc5TDI2Ni43MiA0MDUuNjdMMjcyLjUxIDQwNS4zMkwyNzguMjMgNDA0Ljc0TDI4My44OSA0MDMuOTRMMjg5LjQ3IDQwMi45MUwyOTQuOTcgNDAxLjY3TDMwMC4zOSA0MDAuMjJMMzA1LjcyIDM5OC41NkwzMTAuOTYgMzk2LjdMMzE2LjEgMzk0LjY0TDMyMS4xNCAzOTIuMzlMMzI2LjA4IDM4OS45NkwzMzAuOSAzODcuMzNMMzM1LjYxIDM4NC41M0wzNDAuMiAzODEuNTZMMzQ0LjY3IDM3OC40MkwzNDkuMDEgMzc1LjExTDM1My4yMSAzNzEuNjRMMzU3LjI4IDM2OC4wMUwzNjEuMiAzNjQuMjNMMzY0Ljk4IDM2MC4zMUwzNjguNjEgMzU2LjI0TDM3Mi4wOCAzNTIuMDRMMzc1LjM5IDM0Ny43TDM3OC41MyAzNDMuMjNMMzgxLjUgMzM4LjY0TDM4NC4zIDMzMy45M0wzODYuOTMgMzI5LjExTDM4OS4zNiAzMjQuMTdMMzkxLjYxIDMxOS4xM0wzOTMuNjcgMzEzLjk5TDM5NS41MyAzMDguNzVMMzk3LjE5IDMwMy40MkwzOTguNjQgMjk4TDM5OS44OCAyOTIuNUw0MDAuOTEgMjg2LjkyTDQwMS43MSAyODEuMjZMNDAyLjI5IDI3NS41NEw0MDIuNjQgMjY5Ljc1TDQwMi43NiAyNjMuOUw0MDIuNjQgMjU4LjA1TDQwMi4yOSAyNTIuMjZMNDAxLjcxIDI0Ni41NEw0MDAuOTEgMjQwLjg5TDM5OS44OCAyMzUuMzFMMzk4LjY0IDIyOS44TDM5Ny4xOSAyMjQuMzhMMzk1LjUzIDIxOS4wNUwzOTMuNjcgMjEzLjgxTDM5MS42MSAyMDguNjdMMzg5LjM2IDIwMy42M0wzODYuOTMgMTk4LjY5TDM4NC4zIDE5My44N0wzODEuNSAxODkuMTZMMzc4LjUzIDE4NC41N0wzNzUuMzkgMTgwLjFMMzcyLjA4IDE3NS43NkwzNjguNjEgMTcxLjU2TDM2NC45OCAxNjcuNDlMMzYxLjIgMTYzLjU3TDM1Ny4yOCAxNTkuNzlMMzUzLjIxIDE1Ni4xN0wzNDkuMDEgMTUyLjdMMzQ0LjY3IDE0OS4zOUwzNDAuMiAxNDYuMjRMMzM1LjYxIDE0My4yN0wzMzAuOSAxNDAuNDdMMzI2LjA4IDEzNy44NUwzMjEuMTQgMTM1LjQxTDMxNi4xIDEzMy4xNkwzMTAuOTYgMTMxLjFMMzA1LjcyIDEyOS4yNEwzMDAuMzkgMTI3LjU5TDI5NC45NyAxMjYuMTNMMjg5LjQ3IDEyNC44OUwyODMuODkgMTIzLjg3TDI3OC4yMyAxMjMuMDZMMjcyLjUxIDEyMi40OEwyNjYuNzIgMTIyLjEzTDI2MC44NyAxMjIuMDFMMjU1LjAyIDEyMi4xM0wyNDkuMjMgMTIyLjQ4WiIgaWQ9ImJpVVlobFRwNiI+PC9wYXRoPjwvZGVmcz48Zz48Zz48Zz48dXNlIHhsaW5rOmhyZWY9IiNiaVVZaGxUcDYiIG9wYWNpdHk9IjEiIGZpbGw9IiM1OTU5NTkiIGZpbGwtb3BhY2l0eT0iMSI+PC91c2U+PC9nPjwvZz48L2c+PC9zdmc+";
                            break;
                        case "PopupText":
                            let pcode;
                            if(typeof Cols[c]["PopupCode"] != "undefined") {
                                pcode = Cols[c]["PopupCode"];
                            }
                            // 나중에 로직을 구성해보자.
                            // tempcol["Menu"] = "|" + itemValue;
                            // tempcol["OnSave"] = 
                            break;
                        case "RadioIcon":
                            if(itemValue === 0){
                                tempcol["RadioIcon"] = 3;
                            }
                            break;
                        case "Save":
                            tempcol["NoUpload"] = !itemValue;
                            break;
                        case "Sort":
                            tempcol["CanSort"] = itemValue;
                            break;
                        case "SumType":
                            tempcol["FormulaRow"] = itemValue;
                            break;
                        case "ToolTip":
                            tempcol["Tip"] = typeof Cols[c]["ToolTipText"]!="undefined" ? Cols[c]["ToolTipText"] : itemValue;
                            break;
                        case "TreeCol":
                            convertSheet["Cfg"] = convertSheet["Cfg"] || {};
                            convertSheet["Cfg"]["MainCol"] = Cols[c]["SaveName"]; 
                            delete Cols[c]["TreeCol"];
                            break;
                        case "TreeCheck":
                            tempcol["Icon"] = "Check"; 
                            break;
                        case "Transaction":
                            tempcol["NoChanged"] = itemValue; 
                            break;
                        case "RowSpan":
                            tempcol["RecordRowSpan"] = itemValue;
                            // RowSpan 개수 만큼 뒤에 아래쪽 행의 Name을 제거하자.
                            for(var x = 1 ; x < itemValue ; x++ ) {
                                delete ArrCols[colIdx + x][c]["SaveName"];
                                delete ArrCols[colIdx + x][c]["Hidden"];
                            }
                            break;
                        case "ColSpan":
                            tempcol["RecordColSpan"] = itemValue;
                            // ColSpan 개수 만큼 뒤에 컬럼의 설정을 제거하자
                            for(var x = 1 ; x < itemValue ; x++ ) {
                                delete Cols[c + x]["SaveName"];
                                delete Cols[c + x]["Hidden"];
                            }
                            break;
                        default:
                            tempcol[item] = itemValue;
                    }
                }
            }
            if(tempcol["Desc"].length === 0) delete tempcol["Desc"];
            newCols.push(tempcol);
        }
        return newCols;
    }

    var Cols = createOption.Cols;
    // 멀티레코드 지원
    if(Array.isArray(Cols[0])){
        for(var drows = 0 ; drows < Cols.length ; drows++ ){
            //단위 데이터행
            convertSheet["Cols"].push(convertCols(Cols[drows],drows, Cols));
        }
        convertSheet["Cfg"]["MultiRecord"] = 1;
    }else{
        convertSheet["Cols"] = convertCols(Cols);
    }
    
    for(var item in createOption.Cfg){
        if(createOption.Cfg.hasOwnProperty(item)){
            var itemValue = createOption.Cfg[item];
            switch(item){
                case "FrozenCol":
                    if(!convertSheet["Cfg"]["MultiRecord"]) {
                        convertSheet["LeftCols"] = convertSheet["Cols"].splice(0,itemValue);
                    }
                    break;
                case "FrozenColRight":
                    if(!convertSheet["Cfg"]["MultiRecord"]) {
                        var aaa = Cols.length - itemValue;
                        convertSheet["RightCols"] = convertSheet["Cols"].splice(aaa);
                    }
                    break;
                case "SearchMode":
                    if(itemValue==2){
                        convertSheet["Cfg"]["SearchMode"] = 0;
                    }else{
                        if(typeof itemValue == "string"){
                            convertSheet["Cfg"]["SearchMode"] = 0;
                        }else{
                            convertSheet["Cfg"]["SearchMode"] = itemValue;
                        }
                    }
                    break;
                case "MergeSheet":
                    switch(itemValue){
                        case 1: //all
                                convertSheet["Cfg"]["DataMerge"] = 3;
                                convertSheet["Cfg"]["HeaderMerge"] = 3;
                                convertSheet["Cfg"]["PrevColumnMerge"] = 0;
                            break;
                            case 2: //preColumnMerge
                                convertSheet["Cfg"]["DataMerge"] = 3;
                                convertSheet["Cfg"]["HeaderMerge"] = 0;
                                convertSheet["Cfg"]["PrevColumnMerge"] = 1;
                            break;
                        case 5: //headeronly
                                convertSheet["Cfg"]["DataMerge"] = 0;
                                convertSheet["Cfg"]["HeaderMerge"] = 3;
                                convertSheet["Cfg"]["PrevColumnMerge"] = 0;
                            break;
                        case 7: //header + dataPrev
                                convertSheet["Cfg"]["DataMerge"] = 3;
                                convertSheet["Cfg"]["HeaderMerge"] = 3;
                                convertSheet["Cfg"]["PrevColumnMerge"] = 1;
                            break;
                    }
                    break;
                case "Alternate":
                    convertSheet["Cfg"]["Alternate"] = itemValue?2:0;
                  break;
                case "AutoSumCalcMode":
                    convertSheet["Cfg"]["CalcMergeMode"] = itemValue;
                  break;
                case "ClickHeaderMapping":
                    convertSheet["Cfg"]["SelFocusColor"] = itemValue;
                  break;
                case "FilterRow":
                    convertSheet["Cfg"]["ShowFilter"] = itemValue;
                  break;
                // case "GroupRow":
                //     convertSheet["Cfg"][""] = itemValue;
                //   break;
                default:
                  convertSheet["Cfg"][item] = itemValue;
                  break;
            }
        }
    }

    for(var item in createOption.HeaderMode){
        var itemValue = createOption.HeaderMode[item];
        switch(item){
            case "Sort":
                if(!itemValue) convertSheet.Cfg["CanSort"] = 0;
                break;
            case "ColMove":
                if(!itemValue) convertSheet.Cfg["CanColMove"] = 0;
                break;
            case "ColResize":
                if(!itemValue) convertSheet.Cfg["CanColResize"] = 0;
                break;
            case "HeaderCheck":
                if(!itemValue) convertSheet.Cfg["HeaderCheck"] = 0;
                break;
        }
    }
}