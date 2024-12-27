concerts-main 과 web-server를 도커화 하였고 aws ec2 네트워크와 맞춰서 설정하고 구현 테스트 해야함
adminserver 작업 완료 concerts-main 서버 db에 연결해서 명령어로 DB수정 작업 및 예약현황 조회 가능 

docker.file
# 베이스 이미지 설정
FROM node:18

# 작업 디렉토리 설정(도커 내부에서 작업이 이루어질 디렉토리)
WORKDIR /usr/src/app

# 의존성 복사 및 설치 (로컬 루트디렉토리에 위치한 package*.json이란 이름의 파일을 복사해서 도커 이동)
COPY package*.json ./
RUN npm install

# 애플리케이션 코드 복사(현재 로컬 작업 위치에 있는 모든 파일을 복사)
COPY . .

# 서버 실행(도커 내부에서 이 명령어로 실행 npm start로 명령이 입력됨)
CMD ["npm", "start"]
