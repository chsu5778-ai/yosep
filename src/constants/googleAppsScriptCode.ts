/**
 * Google Apps Script (Code.gs) for Rolling Paper
 * 이 코드는 구글 스프레드시트의 [확장 프로그램] > [Apps Script]에 붙여넣어 배포하는 스크립트입니다.
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ========================================================
 * [교생선생님 롤링페이퍼 백엔드 - Google Apps Script Code.gs]
 * ========================================================
 * 
 * 📌 설치 및 배포 방법:
 * 1. 새 구글 스프레드시트 생성 (제목: '교생선생님 롤링페이퍼')
 * 2. 상단 메뉴 [확장 프로그램] > [Apps Script] 클릭
 * 3. 기존 코드를 모두 지우고 이 스크립트 전체를 붙여넣기
 * 4. 상단 [저장 (Ctrl+S)] 아이콘 클릭
 * 5. 우측 상단 [배포] > [새 배포] 클릭
 * 6. 유형 선택: [웹 앱 (Web App)] 선택
 *    - 설명: 교생선생님 롤링페이퍼 API
 *    - 다음 사용자 권한으로 실행: 나 (내 계정)
 *    - 액세스 권한이 있는 사용자: [모든 사용자 (Anyone)] ⭐ 중요!
 * 7. [배포] 클릭 후 승인 절차 진행 (고급 > 안전하지 않음으로 이동 클릭)
 * 8. 생성된 '웹 앱 URL (https://script.google.com/macros/s/.../exec)'을 복사하여
 *    웹앱의 '구글 시트 연동' 메뉴에 붙여넣으면 끝!
 */

// 시트 시트명 설정 (기본값: '롤링페이퍼')
var SHEET_NAME = "롤링페이퍼";

// 시트 초기 헤더 컬럼 정의
var HEADERS = [
  "ID", 
  "작성일시", 
  "작성자", 
  "학번/번호", 
  "내용", 
  "카드색상", 
  "스티커", 
  "글꼴", 
  "좋아요", 
  "사진URL", 
  "선생님답글", 
  "고정여부"
];

/**
 * 시트 가져오기 및 초기화
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    // 첫 행 서식 꾸미기
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#FFF3CD");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * GET 요청 핸들러: 롤링페이퍼 쪽지 목록 조회
 */
function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    
    // 데이터가 헤더만 있는 경우
    if (data.length <= 1) {
      return jsonResponse({ success: true, notes: [], count: 0 });
    }
    
    var notes = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue; // 빈 ID 건너뛰기
      
      notes.push({
        id: String(row[0]),
        timestamp: row[1] ? String(row[1]) : new Date().toISOString(),
        authorName: String(row[2] || "익명의 학생"),
        studentNo: String(row[3] || ""),
        content: String(row[4] || ""),
        cardColor: String(row[5] || "yellow"),
        emoji: String(row[6] || "💖"),
        fontStyle: String(row[7] || "nanum"),
        likes: Number(row[8] || 0),
        photoUrl: String(row[9] || ""),
        teacherReply: String(row[10] || ""),
        isPinned: Boolean(row[11])
      });
    }
    
    return jsonResponse({
      success: true,
      notes: notes,
      count: notes.length,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * POST 요청 핸들러: 새 쪽지 작성, 좋아요 증가, 선생님 답장 등
 */
function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    var payload = {};
    
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter;
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }
    
    var action = payload.action || "addNote";
    
    // 1. 새 쪽지 등록
    if (action === "addNote" || !action) {
      var note = payload.note || payload;
      var newId = note.id || "note_" + new Date().getTime();
      var nowStr = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
      
      var newRow = [
        newId,
        nowStr,
        note.authorName || "익명의 학생",
        note.studentNo || "",
        note.content || "",
        note.cardColor || "yellow",
        note.emoji || "💖",
        note.fontStyle || "nanum",
        Number(note.likes || 0),
        note.photoUrl || "",
        note.teacherReply || "",
        note.isPinned ? true : false
      ];
      
      sheet.appendRow(newRow);
      return jsonResponse({ success: true, message: "쪽지가 성공적으로 저장되었습니다!", id: newId });
    }
    
    // 2. 좋아요(하트) 토글/증가
    if (action === "likeNote") {
      var targetId = payload.id;
      var data = sheet.getDataRange().getValues();
      for (var r = 1; r < data.length; r++) {
        if (String(data[r][0]) === String(targetId)) {
          var currentLikes = Number(data[r][8] || 0);
          var nextLikes = currentLikes + 1;
          sheet.getRange(r + 1, 9).setValue(nextLikes);
          return jsonResponse({ success: true, id: targetId, likes: nextLikes });
        }
      }
      return jsonResponse({ success: false, error: "해당 쪽지를 찾을 수 없습니다." });
    }

    // 3. 선생님 답장 등록
    if (action === "replyNote") {
      var replyId = payload.id;
      var replyText = payload.reply || "";
      var allData = sheet.getDataRange().getValues();
      for (var j = 1; j < allData.length; j++) {
        if (String(allData[j][0]) === String(replyId)) {
          sheet.getRange(j + 1, 11).setValue(replyText);
          return jsonResponse({ success: true, id: replyId, reply: replyText });
        }
      }
      return jsonResponse({ success: false, error: "해당 쪽지를 찾을 수 없습니다." });
    }
    
    return jsonResponse({ success: false, error: "지원하지 않는 action 입니다: " + action });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * JSON 응답 생성 헬퍼
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
