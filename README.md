- # ULINK
  S.O.P.T 26기 Sever 파트 앱잼 프로젝트
  
  <img width="300" src="https://user-images.githubusercontent.com/50284754/86553933-26c29d00-bf87-11ea-8c88-174ef6d70073.png">
  
![node_badge](https://img.shields.io/badge/node-v12.18.1-green)![npm_bedge](https://img.shields.io/badge/npm-v6.14.5-blue)
  
* 프로젝트 기간: 2020.06.29 ~ 2020.06.18
  * [📚 API 문서](http://127.0.0.1:3000/Docs/)
  



  ## 프로젝트 설명

*  '**Ulink**' : 시간표 기반, 대학생 지식교류  플랫폼

  ## Workflow

  ![유링크_판넬_A1_홍예나](https://user-images.githubusercontent.com/50284754/86556988-d13ebe00-bf8f-11ea-9747-e2a6ae57960c.png)

  

  ## 핵심 기능

  ### 크롤링

​	대학별 시간표 정보를 대학별 사이트에서 파이썬의 Requests와 BeautifulSoup을 활용하여 크롤링합니다. <br>	<br/>	해당 크롤링 코드는 의존성을 줄이기 위해 Google Cloud Function을 이용하여 Google Cron 서비스로 학기별 DB를 업데이트 합니다. 	<br>	<br/>


  ### 채팅 서비스

​	클라이언트와의 원활한 소통을 위해 Firebase RealTime Database를 이용한 채팅 서비스를 합니다<br>	<br/>

  ## Architecture

  아키텍쳐 구조-업로드 예정


  ## DB ERD

  ![image](https://user-images.githubusercontent.com/50284754/86557010-e3b8f780-bf8f-11ea-9120-6efd1b50f2f3.png)

  ## 규칙 
  * Coding Convention
  * Git Convention
  # Code Convention

  > 👅 네이밍 규칙

  1. **변수명** : 카멜케이스  (`inputBox`)
  2. **폴더명, 파일명** : 소문자 (`inputbox`)
  3. **클래스명** : 첫글자 대문자 (`InputBox`)

  > ➕ more...

  - `var` 지양 / `let, const` 지향
  - 비동기는 promise의 `then`보다 `async/await` 사용

  ## Git Convention

  >  브랜치


  * <kbd>master</kbd>
    
    * <kbd>feature</kbd>
    
      <br>

  > 커밋메시지

  ```
  CREATE - 기능 구현(한글)
  UPDATE - 기능 수정(한글)
  FIX - 버그 발견(한글)
  RELEASE - 버전 배포(한글)
  DELETE - 기능 삭제(한글)
  DOCS - 문서 편집(한글)
  ```

  ex) `[UPDATE] 구현내용`

  <br>

  ## ⚙️ Depenedncy Module
  사용 패키지(모듈)은 다음과 같습니다.

  ```json
    "dependencies": {
      "aws-sdk": "^2.708.0",
      "cookie-parser": "~1.4.4",
      "debug": "~2.6.9",
      "express": "~4.16.1",
      "http-errors": "~1.6.3",
      "jade": "~1.11.0",
      "jsonwebtoken": "^8.5.1",
      "morgan": "~1.9.1",
      "multer": "^1.4.2",
      "multer-s3": "^2.9.0",
      "promise-mysql": "^4.1.3",
      "rand-token": "^1.0.1",
      "unique-names-generator": "^4.2.0"
    }
  ```

  

  ## 시작하기

  소스 코드는 Windows10 64bit + Visiau Studio Code + Node v10.16.0 + NPM v6.13.4 + Express 4.16.1 환경에서 제작되었습니다.

  * Node.js의 Async/Await 도구를 사용해 (Promise) 비동기 제어를 하고 있습니다.

  

  #### 설치하기

  * `nodejs`와 `npm`을 을치합니다. (설치 방법 :  [nodejs.org](https://nodejs.org/) 를 참고)
  * Node.js 12 LTS 버전을 설치합니다.
  * 실행에 필요한 의존성을 설치합니다.

  ```
  npm install -g express express-generator
  ```

  

  #### 실행하기

  ```
  npm start
  ```


  ## 배포

  * [AWS EC2](https://aws.amazon.com/ko/ec2/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_ec2_b&sc_content=ec2_e&sc_detail=awsec2&sc_category=ec2&sc_segment=177228231544&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177228231544!e!!g!!awsec2&ef_id=WkRozwAAAnO-lPWy:20180412120123:s) - 클라우드 환경 컴퓨팅 시스템
  * [AWS RDS](https://aws.amazon.com/ko/rds/) - 클라우드 환경 데이터베이스 관리 시스템
  * [AWS S3](https://aws.amazon.com/ko/s3/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_s3_b&sc_content=s3_e&sc_detail=awss3&sc_category=s3&sc_segment=177211245240&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177211245240!e!!g!!awss3&ef_id=WkRozwAAAnO-lPWy:20180412120059:s) - 클라우드 환경 데이터 저장소


  ## 사용된 도구 

  * [Node.js](https://nodejs.org/ko/) - Chrome V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임
  * [Express.js](http://expressjs.com/ko/) - Node.js 웹 애플리케이션 프레임워크
  * [NPM](https://rometools.github.io/rome/) - 자바 스크립트 패키지 관리자
  * [PM2](http://pm2.keymetrics.io/) - Express 앱용 프로세스 관리자
  * [vscode](https://code.visualstudio.com/) - 편집기
  * [Mysql](https://www.mysql.com/) - DataBase

  

  ## 🔥개발자: Server🔥

  * 👨‍💻[김보배](https://github.com/KimDoubleB) - 크롤링 + 채팅 + 시간표 + APIh
  * 👩‍💻[황지혜](https://github.com/jihye0420) - 소셜 + 시간표 + API


  ## Ulink의 연관 프로젝트

  * [Ulink-Android](https://github.com/University-Link/Ulink-Android)
  * [Ulink-iOS](https://github.com/University-Link/Ulink-iOS)