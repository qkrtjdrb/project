// server.js
const express = require('express');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid'); // 고유 queueId 발급용
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Redis 연결 (로컬 환경 예시)
const redis = new Redis({
  host: 'redis',
  port: 6379,
});

const QUEUE_KEY = 'waitingQueue';
const MAX_CONCURRENT = 5; // 동시에 처리 가능한 최대 인원 수
let currentProcessing = 0; // 현재 처리 중인 사용자 수

/**
 * 실제 “처리” 로직을 흉내내기 위한 예시 함수
 * - 예: 결제, DB 작업, 외부 API 호출 등
 */
async function processUser(queueId) {
  // 여기에 실제 처리 로직을 작성
  // 여기서는 그냥 3초 후 완료되는 작업으로 예시
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Processed user with queueId=${queueId}`);
    }, 3000);
  });
}

/**
 * 큐에서 사용자 하나를 꺼내어 처리하는 함수
 */
async function checkQueue() {
  // 현재 처리 중인 요청 수가 MAX_CONCURRENT 미만이라면 처리 가능
  while (currentProcessing < MAX_CONCURRENT) {
    // Redis List에서 맨 앞 사용자 꺼내오기
    const queueId = await redis.lpop(QUEUE_KEY);
    if (!queueId) {
      break; // 대기열이 비었으면 종료
    }

    currentProcessing++;

    // “처리 중” 상태를 표시하기 위해, Redis에 상태 저장
    // 예) key = `queueStatus:{queueId}`, value = "PROCESSING"
    await redis.set(`queueStatus:${queueId}`, 'PROCESSING');

    // 비동기로 작업 처리
    processUser(queueId)
      .then(async (result) => {
        console.log(result);
        // 처리 완료 후 상태 업데이트
        await redis.set(`queueStatus:${queueId}`, 'READY');
      })
      .catch(async (err) => {
        console.error(err);
        // 실패 시 상태를 FAILED로
        await redis.set(`queueStatus:${queueId}`, 'FAILED');
      })
      .finally(async () => {
        currentProcessing--;
        // 한 사람이 처리 완료되었으니, 대기열에 남은 사용자 확인
        checkQueue();
      });
  }
}

// 1) 대기열에 들어가는 API
app.post('/api/enter-queue', async (req, res) => {
  // 사용자 식별에 필요한 정보 (예: userId), 또는 좌석/결제 등 context가 필요하다면 함께 넘겨받을 수도 있음
  // 여기서는 단순히 queueId만 발급
  const queueId = uuidv4();

  // 대기열에 삽입
  await redis.rpush(QUEUE_KEY, queueId);
  // 상태도 Redis에 기록 (기본값: WAITING)
  await redis.set(`queueStatus:${queueId}`, 'WAITING');

  // 방금 들어온 사용자도 혹시 즉시 처리 가능할 수 있으니 확인
  checkQueue();

  // 클라이언트에게 queueId 전달
  res.json({
    queueId,
    message: '대기열에 등록되었습니다.',
  });
});

// 2) 대기열 상태 확인 API
app.get('/api/queue-status', async (req, res) => {
  const { queueId } = req.query;
  if (!queueId) {
    return res.status(400).json({ error: 'queueId is required' });
  }

  // Redis에서 상태 조회
  const status = await redis.get(`queueStatus:${queueId}`);

  // 대기열에 아직 없거나, 만료된 사용자일 수도 있으니 체크
  if (!status) {
    return res.status(404).json({ error: 'Invalid or expired queueId' });
  }

  // 상태에 따라 응답
  // WAITING → 아직 줄 서 있음
  // PROCESSING → 현재 서버가 작업 중
  // READY → 이미 처리(입장 가능)
  // FAILED → 처리 실패
  res.json({ status });
});

// (테스트용) 서버 실행
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
