# ULINK : 시간표 기반, 대학생 지식교류 플랫폼

----

# 유의사항
릴리즈 하기 전 프로토타입 서버입니다. 배포판(Private repository)에서는 대부분의 코드 리팩토링과 더 많은 기능 추가가 이루어졌습니다. 또한 URL 및 데이터베이스에서도 많은 변화가 이루어졌습니다. 참고 바랍니다.

----

<img width="300" src="https://user-images.githubusercontent.com/50284754/87790338-6177df80-c87b-11ea-87f7-5dc401ca6598.png">

![node_badge](https://img.shields.io/badge/node-v12.18.1-green) ![npm_bedge](https://img.shields.io/badge/npm-v6.14.5-blue)

* **S.O.P.T 26th Sever 파트 앱잼 프로젝트**

* **프로젝트 기간: 2020.06.29 ~ 2020.07.18**
* [API 문서](http://52.78.27.117:3000/docs/)

<img width="800" src="https://user-images.githubusercontent.com/50284754/86920507-dbfe7c00-c164-11ea-84ef-c80b59616049.png">

## 💁 프로젝트 설명

* **Ulink** : 시간표 기반, 대학생 지식교류  플랫폼
* 노션링크

## :bookmark_tabs: Work flow

<img width="800" height ="800" src="https://user-images.githubusercontent.com/50284754/87793432-3a6fdc80-c880-11ea-8e99-f0411b3a31e2.png">

## 📑 핵심 기능

### 시간표

사용자가 해당하는 학교 시간표를 필터검색과 카테고리별로 수업시간표 데이터를 사용자에게 편리하게 알려줍니다.

### 캘린더

수업 별 일정을 최신순으로 확인하고 대화방의 수업공지와 연동하여 수업별 시험, 과제, 수업, 실습 공지등을 사용자에게 알려줍니다.

  ### 크롤링

대학별 시간표 정보를 대학별 사이트에서 파이썬의 Selenium과 BeautifulSoup을 활용하여 크롤링합니다. 해당 크롤링 코드는 의존성을 줄이기 위해 Google Cloud Function을 이용하여 Google Cron 서비스로 학기별 DB를 업데이트 합니다.

### 채팅 서비스

시간표 작성 후, 시간표 데이터를 기반으로 이번 학기 수업 별 소통방이 생성됩니다. 생성된 소통방에서는 클라이언트와의 원활한 소통을 위해 Firebase RealTime Database를 이용한 채팅 서비스를 합니다.

## 🧾 기능명세서

* [기능명세서](https://drive.google.com/file/d/1u7du9skX05OcvschoJgtZPMauRzk6MZG/view?usp=sharing)

## 📗 Architecture

  ![image](https://user-images.githubusercontent.com/50284754/86923872-95f7e700-c169-11ea-95d0-76cd7e1cd922.png)

## 📕 DB ERD

![image](https://user-images.githubusercontent.com/50284754/87791517-5c1b9480-c87d-11ea-8e15-95b2455a774b.png)



## 🥦 Directory Tree

```json
├───api/
│   ├───docs/
│   │   ├───cart/
│   │   │   ├───cart.yaml
│   │   │   └───cartIdx.yaml
│   │   ├───chat/
│   │   │   └───chat.yaml
│   │   ├───notice/
│   │   │   ├───notice.yaml
│   │   │   ├───noticeIdx.yaml
│   │   │   └───noticeSubject.yaml
│   │   ├───schedule/
│   │   │   ├───schedule.yaml
│   │   │   ├───scheduleIdx.yaml
│   │   │   ├───scheduleList.yaml
│   │   │   ├───scheduleMain.yaml
│   │   │   ├───scheduleMainIdx.yaml
│   │   │   ├───scheduleName.yaml
│   │   │   ├───schedulePersonal.yaml
│   │   │   ├───schedulePersonalIdx.yaml
│   │   │   ├───scheduleSchool.yaml
│   │   │   ├───scheduleSchoolIdx.yaml
│   │   │   └───scheduleSpecificIdx.yaml
│   │   ├───schema/
│   │   │   └───fail.yaml
│   │   ├───subject/
│   │   │   ├───subject.yaml
│   │   │   ├───subjectCourse.yaml
│   │   │   ├───subjectRecommend.yaml
│   │   │   └───subjectSearch.yaml
│   │   └───user/
│   │       ├───profile.yaml
│   │       ├───profileId.yaml
│   │       ├───signIn.yaml
│   │       └───signUp.yaml
│   └───swagger.yaml
├───controllers/
│   ├───cart.js
│   ├───chat.js
│   ├───notice.js
│   ├───schedule.js
│   ├───social.js
│   ├───subject.js
│   └───user.js
├───middlewares/
│   └───auth.js
├───models/
│   ├───cart.js
│   ├───notice.js
│   ├───schedule.js
│   ├───social.js
│   ├───subject.js
│   └───user.js
└───routes/
    ├───cart.js
    ├───chat.js
    ├───index.js
    ├───notice.js
    ├───schedule.js
    ├───social.js
    ├───subject.js
    └───user.js
```



## 📘 규칙 

  * **Coding Convention**
  * **Git Convention**

  # 🗂 Code Convention

  > 👅 네이밍 규칙

    1. **변수명** : 카멜케이스  (`inputBox`)
    2. **폴더명, 파일명** : 소문자 (`inputbox`)
    3. **클래스명** : 첫글자 대문자 (`InputBox`)

  > ➕ more...

  - `var` 지양 / `let, const` 지향
  - 비동기는 promise의 `then`보다 `async/await` 사용

  ## Git Convention

  >  branch


  * <kbd>master</kbd>

    * <kbd>develop</kbd>

    * <kbd>feature</kbd>

      * <kbd>debugging</kbd>

      <br>

  > commit message

  ```
  CREATE - 기능 구현(한글)
  UPDATE - 코드 수정(한글)
  MERGE - 코드 병합(한글)
  FIX - 버그 수정(한글)
  RELEASE - 버전 배포(한글)
  DELETE - 기능 삭제(한글)
  DOCS - 문서 편집(한글)
  ```

  ex) `[UPDATE] 구현내용`

  <br>

  ## ⚙️ Depenedncy Module

  사용 패키지(모듈)은 다음과 같습니다.

<img width="300" src="https://user-images.githubusercontent.com/50284754/87794735-085f7a00-c882-11ea-90e3-1e7776c5362b.png">



  ```json
  "dependencies": {
    "aws-sdk": "^2.708.0",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "hangul-js": "^0.2.6",
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

  ## 📢 시작하기

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

## 💡 배포

  * [AWS EC2](https://aws.amazon.com/ko/ec2/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_ec2_b&sc_content=ec2_e&sc_detail=awsec2&sc_category=ec2&sc_segment=177228231544&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177228231544!e!!g!!awsec2&ef_id=WkRozwAAAnO-lPWy:20180412120123:s) - 클라우드 환경 컴퓨팅 시스템
  * [AWS RDS](https://aws.amazon.com/ko/rds/) - 클라우드 환경 데이터베이스 관리 시스템
  * [AWS S3](https://aws.amazon.com/ko/s3/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_s3_b&sc_content=s3_e&sc_detail=awss3&sc_category=s3&sc_segment=177211245240&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177211245240!e!!g!!awss3&ef_id=WkRozwAAAnO-lPWy:20180412120059:s) - 클라우드 환경 데이터 저장소

## 📚 사용된 도구 

  * [Node.js](https://nodejs.org/ko/) - Chrome V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임
  * [Express.js](http://expressjs.com/ko/) - Node.js 웹 애플리케이션 프레임워크
  * [NPM](https://rometools.github.io/rome/) - 자바 스크립트 패키지 관리자
  * [PM2](http://pm2.keymetrics.io/) - Express 앱용 프로세스 관리자
  * [vscode](https://code.visualstudio.com/) - 편집기
  * [Mysql](https://www.mysql.com/) - DataBase

  

  ## 🔥 Test 🔥

### Postman

![image](https://user-images.githubusercontent.com/50284754/87798723-5165fd00-c887-11ea-800d-d0dd5bcc857b.png)

### Swagger

![image](https://user-images.githubusercontent.com/50284754/87799058-bc173880-c887-11ea-90eb-d8347c2f86f7.png)

  ## 🔥 개발자: Server 🔥

![image](https://user-images.githubusercontent.com/50284754/86920356-a48fcf80-c164-11ea-9a7a-edd3bfcc6e2b.png)

#### 👨‍💻[김보배](https://github.com/KimDoubleB)

- 시간표 조회, 생성 기능
- 메인 시간표 설정, 수정 기능
- 수업일정 등록, 수정, 삭제 기능
- 공지 등록, 수정, 삭제 기능
- 공지 조회 (달력, 리스트) 기능
- 학교 수업 데이터 크롤링
- DB 설계

#### 👩‍💻[황지혜](https://github.com/jihye0420)

- 유저 로그인, 회원가입 기능
- 시간표 수정, 삭제 기능
- 소셜(팔로우, 팔로잉) 기능
- 개인일정 등록, 수정, 삭제 기능
- 개인프로필 조회, 업데이트 기능
- 채팅 (Firebase) 기능
- DB 설계

### 🔎 Ulink의 연관 프로젝트

  * [Ulink-Android](https://github.com/University-Link/Ulink-Android)
  * [Ulink-iOS](https://github.com/University-Link/Ulink-iOS)
