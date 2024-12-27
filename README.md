concerts-main 과 web-server를 도커화 하였고 aws ec2 네트워크와 맞춰서 설정하고 구현 테스트 해야함
adminserver 작업 완료 concerts-main 서버 db에 연결해서 명령어로 DB수정 작업 및 예약현황 조회 가능 

# docker.file (Docker Image를 만들기 위한 레시피 파일)
#베이스 이미지 설정

FROM node:18 (베이스 이미지로 node18버전 사용)

#작업 디렉토리 설정(도커 내부에서 작업이 이루어질 디렉토리)

WORKDIR /usr/src/app

#의존성 복사 및 설치 (로컬 루트디렉토리에 위치한 package*.json이란 이름의 파일을 복사해서 도커 이동)

COPY package*.json ./
RUN npm install

#애플리케이션 코드 복사(현재 로컬 작업 위치에 있는 모든 파일을 복사)

COPY . .

#서버 실행(도커 내부에서 이 명령어로 실행 npm start로 명령이 입력됨)

CMD ["npm", "start"]


# docker-compose (여러 컨테이너(서비스)를 간편하게 정의하고 실행하는 도구)
각각 파일 내부에 docker-compose 파일이 들어가 있는 상황인데 궃이 그럴 필요는 없음 오직 테스트를 위해 작성을 해놓은 상태임
다완성 하면 로컬 환경에서 단 1개의 docker-compose를 이용해 각각에 docker.file를 가져와서 한번에 실행이 가능 클라우드 환경에서는 테스트 X

version: "3.8" #(docker-compose 버전 설)

services: #(어떤 컨테이너를 실행 시킬지 시작 )

  backend: 
  
    build: #(현재 위치에 있는 도커파일을 이용해 이미지를 빌드)
    
      context: ./
      
      dockerfile: Dockerfile
      
    ports: #(로컬 포트 5000을 도커 내부 포트 5000이랑 매칭 도커 내부에서 서비스가 몇번 포트에서 실행 되고 있는지 체크 web-server 같은 경우 3000번 실행에서 실행이니 도커로 실행시키고 로컬에서 5000포트로 확인 하고 싶을땐 5000:3000이렇게 커스텀 가능)
    
      - "5000:5000"
      
    environment: #(backend서비스가 사용할 환경 변수 process.env.DB_*이란 코드를 이용해 이 환경변수에 저장되어있는 값을 사용 할 수 있음 depends_on은 backend 서비스 db의존성을 설정)
    
      - DB_HOST=db
      
      - DB_PORT=3306
      
      - DB_USER=root
      
      - DB_PASSWORD=root
      
      - DB_NAME=concerts
    
    depends_on:
    
      - db



  db:
  
    image: mysql:8.0 #(도커 허브에있는 공식 mysql8버전을 사용)
    
    container_name: mysql_container #(서비스 이름 설정)
    
    ports:
    
      - "3306:3306"
    
    environment: #(mysql 생성 할때 설정할 환경 변수들)
    
      MYSQL_ROOT_PASSWORD: root #(root 비번 root로 설정)
      
      MYSQL_DATABASE: concerts #(DB생성)

    volumes: #(DB안에 테이블을 어떻게 구성 할 것인지에 관한 설정파일(Concerts.sql)을 docker시작설정(docker-entrypoint-initdb.d) 부분에 추가)
    
      - ./db/Concerts.sql:/docker-entrypoint-initdb.d/Concerts.sql


volumes:

  db_data:
