// server.js
const express = require('express');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Redis 연결 (docker-compose 등에서 redis 컨테이너 이름이 "redis-server"라 가정)
const redis = new Redis({
  host: 'redis-server',
  port: 6379,
});

const QUEUE_KEY = 'waitingQueue';
const MAX_CONCURRENT = 5;
let currentProcessing = 0;

async function processUser(queueId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Processed user with queueId=${queueId}`);
    }, 3000);
  });
}

async function checkQueue() {
  while (currentProcessing < MAX_CONCURRENT) {
    const queueId = await redis.lpop(QUEUE_KEY);
    if (!queueId) {
      break;
    }
    currentProcessing++;

    await redis.set(`queueStatus:${queueId}`, 'PROCESSING');

    processUser(queueId)
      .then(async (result) => {
        console.log(result);
        await redis.set(`queueStatus:${queueId}`, 'READY');
      })
      .catch(async (err) => {
        console.error(err);
        await redis.set(`queueStatus:${queueId}`, 'FAILED');
      })
      .finally(async () => {
        currentProcessing--;
        checkQueue();
      });
  }
}

// 1) 대기열에 들어가는 API
app.post('/api/enter-queue', async (req, res) => {
  const queueId = uuidv4();

  await redis.rpush(QUEUE_KEY, queueId);
  await redis.set(`queueStatus:${queueId}`, 'WAITING');

  checkQueue();

  res.json({
    queueId,
    message: '대기열에 등록되었습니다.',
  });
});

/**
 * [NEW] queueId가 대기열에서 몇 번째인지 구하는 헬퍼 함수
 * - Redis 6.0.6 이상 + ioredis 4.19.0 이상에서 `redis.lpos` 사용 가능
 * - 지원 안될 경우 lrange로 index를 찾는 방법도 가능
 */
async function getQueuePosition(queueId) {
  // lpos를 사용할 수 있는지 확인 (ioredis 버전에 따라 다를 수 있음)
  if (typeof redis.lpos === 'function') {
    const pos = await redis.lpos(QUEUE_KEY, queueId);
    return (pos !== null) ? pos : -1; 
  } else {
    // lpos가 없으면 lrange로 대체
    const list = await redis.lrange(QUEUE_KEY, 0, -1);
    return list.indexOf(queueId); // 존재하지 않으면 -1
  }
}

// 2) 대기열 상태 확인 API (대기 인원 수 추가)
app.get('/api/queue-status', async (req, res) => {
  const { queueId } = req.query;
  if (!queueId) {
    return res.status(400).json({ error: 'queueId is required' });
  }

  const status = await redis.get(`queueStatus:${queueId}`);
  if (!status) {
    return res.status(404).json({ error: 'Invalid or expired queueId' });
  }

  // 기본 응답 객체
  const response = { status };

  // 만약 대기열(=WAITING) 상태라면, 내 현재 위치(앞에 몇 명?)를 구해 응답에 추가
  if (status === 'WAITING') {
    const position = await getQueuePosition(queueId);
    // position은 '0'이면 최전방(내 앞에 0명), 1이면 내 앞에 1명, ... 
    // 즉, 내 앞에 몇 명이 있는지는 position 그 자체
    // 존재하지 않으면 -1
    if (position >= 0) {
      response.position = position; // 0-based index
      response.peopleAhead = position; // 직관적으로 "내 앞에 n명"이라는 의미
    } else {
      // 대기열에 없는데 status는 WAITING인 특이 케이스일 수 있음
      // 혹은 Redis 버전 호환 문제
      response.position = -1;
    }
  }

  // status === 'PROCESSING' 일 땐 대기열에서 빠져 있으므로 position 계산 불가
  // status === 'READY' / 'FAILED' 도 마찬가지

  res.json(response);
});

// (테스트용) 서버 실행
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});