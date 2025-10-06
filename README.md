# IBSheet7 to IBSheet8 코드 변환기

이 프로젝트는 **IBSheet7**의 초기화 코드와 이벤트 코드를 **IBSheet8**용 코드로 변환해주는 웹 기반 도구입니다.

## 주요 기능
- IBSheet7 초기화 코드 → IBSheet8 코드 자동 변환
- IBSheet7 이벤트 코드 → IBSheet8 이벤트 코드 자동 변환
- 변환 결과를 복사하여 바로 사용할 수 있음

## 사용 방법
1. 이 저장소를 클론하거나 다운로드합니다.
2. 의존성 설치:
   ```bash
   npm install
   ```
3. 개발 서버 실행:
   ```bash
   npm run dev
   ```
4. 웹 브라우저에서 `http://localhost:3000`에 접속합니다.
5. IBSheet7 초기화 소스를 좌측에 입력하고 convert 버튼을 클릭하면 우측에 IBSheet8 코드로 변환된 결과를 확인할 수 있습니다.

## 폴더 구조
- `app/` : Next.js 앱 엔트리 및 글로벌 설정
- `components/` : 주요 React 컴포넌트 (예: CodeConverter)
- `utils/` : 코드 변환 로직 (예: ibsheet7to8Convert.js, convertEvent.js)


## 라이선스
MIT License
