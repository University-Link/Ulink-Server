- # ULINK

  <img width="300" src="https://user-images.githubusercontent.com/50284754/86553933-26c29d00-bf87-11ea-8c88-174ef6d70073.png">

![node_badge](https://img.shields.io/badge/node-v12.18.1-green)![npm_bedge](https://img.shields.io/badge/npm-v6.14.5-blue)

* **S.O.P.T 26th Sever 파트 앱잼 프로젝트**

* **프로젝트 기간: 2020.06.29 ~ 2020.06.18**
* [API 문서]()

![image](https://user-images.githubusercontent.com/50284754/86920507-dbfe7c00-c164-11ea-84ef-c80b59616049.png)

## 📑 프로젝트 설명

* **Ulink** : 시간표 기반, 대학생 지식교류  플랫폼

  ## Workflow

  ![유링크_판넬_A1_홍예나](https://user-images.githubusercontent.com/50284754/86556988-d13ebe00-bf8f-11ea-9747-e2a6ae57960c.png)

  

  ## 📑 핵심 기능

  ### 시간표

  사용자가 해당하는 학교 시간표를 필터검색과 카테고리별로 수업시간표 데이터를 사용자에게 편리하게 알려줍니다.<br>	<br/>

  ### 캘린더

  수업 별 일정을 최신순으로 확인하고 대화방의 수업공지와 연동하여 수업별 시험, 과제, 수업, 실습 공지등을 사용자에게 알려줍니다.<br>	<br/>

  ### 	크롤링

  대학별 시간표 정보를 대학별 사이트에서 파이썬의 Selenium과 BeautifulSoup을 활용하여 크롤링합니다. <br><br/>해당 크롤링 코드는 의존성을 줄이기 위해 Google Cloud Function을 이용하여 Google Cron 서비스로 학기별 DB를 업데이트 합니다. <br><br/>

### 	채팅 서비스

  시간표 작성 후, 시간표 데이터를 기반으로 이번 학기 수업 별 소통방이 생성됩니다. 생성된 소통방에서는 클라이언트와의 원활한 소통을 위해 Firebase RealTime Database를 이용한 채팅 서비스를 합니다.<br><br/>

## 📑 기능명세서

​	[기능명세서 링크](https://drive.google.com/file/d/18SxrR4FJkI5svQJtcbWA37azbJc3Ymhl/view?usp=sharing)

  ## Architecture

  ![image](https://user-images.githubusercontent.com/50284754/86923872-95f7e700-c169-11ea-95d0-76cd7e1cd922.png)


  ## DB ERD

  ![image](https://user-images.githubusercontent.com/50284754/86920840-444d5d80-c165-11ea-9276-cc3c19961cda.png)

  ## 규칙 

  * **Coding Convention**
  * **Git Convention**

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
    "moment": "^2.27.0",
    "morgan": "~1.9.1",
    "multer": "^1.4.2",
    "multer-s3": "^2.9.0",
    "promise-mysql": "^4.1.3",
    "rand-token": "^1.0.1",
    "unique-names-generator": "^4.2.0"
  }
  ```

  

  ## 시작하기

  #### 설치하기

  * `nodejs`와 `npm`을 설치합니다. (설치 방법 :  [nodejs.org](https://nodejs.org/) 를 참고)
  * Node.js 12 LTS 버전을 설치합니다.
  * 실행에 필요한 의존성을 설치합니다.
  * 버전 정보 : 업데이트 예정

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

![image](https://user-images.githubusercontent.com/50284754/86920356-a48fcf80-c164-11ea-9a7a-edd3bfcc6e2b.png)

  * 👨‍💻[김보배](https://github.com/KimDoubleB) - 크롤링 + 채팅 + 시간표 + API
  * 👩‍💻[황지혜](https://github.com/jihye0420) - 소셜 + 시간표 + API 


  ## Ulink의 연관 프로젝트

  * [Ulink-Android](https://github.com/University-Link/Ulink-Android)
  * [Ulink-iOS](https://github.com/University-Link/Ulink-iOS)
