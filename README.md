# IBSheet7 to IBSheet8 코드 변환기

이 프로젝트는 **IBSheet7**의 초기화 코드와 이벤트 코드를 **IBSheet8**용 코드로 변환해주는 웹 기반 도구입니다.
빌드 과정 없이 순수 HTML/JavaScript로 동작합니다.

## 주요 기능
- IBSheet7 초기화 코드 → IBSheet8 코드 자동 변환
- IBSheet7 이벤트 코드 → IBSheet8 이벤트 코드 자동 변환
- 변환 결과를 복사하여 바로 사용할 수 있음

## 사용 방법
1. 이 저장소를 클론하거나 다운로드합니다.
2. `index.html`을 웹 브라우저에서 열거나, 간단한 정적 서버로 실행합니다. (예: `npx serve .`, `python -m http.server`)
   - Monaco Editor, SweetAlert2는 CDN(jsDelivr)에서 불러오므로 인터넷 연결이 필요합니다.
3. IBSheet7 초기화 소스를 좌측에 입력하고 Convert 버튼을 클릭하면 우측에 IBSheet8 코드로 변환된 결과를 확인할 수 있습니다.

## 폴더 구조
- `index.html` : 화면 구성
- `css/style.css` : 스타일
- `js/app.js` : 화면 동작 (에디터 생성, 탭, Convert 버튼, 패널 크기 조절 등)
- `js/ibsheet7to8Convert.js` : 초기화 코드 변환 로직
- `js/convertEvent.js` : 이벤트 코드 변환 로직
- `js/sample.js` : 초기 화면 샘플 코드

## 배포
`main` 브랜치에 push 하면 GitHub Actions 가 저장소 루트를 그대로 GitHub Pages 에 배포합니다.

## 라이선스
MIT License
