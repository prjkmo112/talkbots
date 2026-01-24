# talkbots

메시징 플랫폼용 챗봇 라이브러리입니다.

## 설치

```bash
npm install talkbots
# or
pnpm add talkbots
```

## 지원 플랫폼

- Mattermost

## 사용법

### Mattermost

```typescript
import { MmChatbot } from 'talkbots';
// 또는
import { MmChatbot } from 'talkbots/mattermost';

const bot = new MmChatbot('https://your-mattermost-server.com');

// 인증 토큰 설정
bot.setAuthToken('your-bot-token');

// 메시지 전송
const response = await bot.send('Hello, World!', {
  channel_id: 'channel-id',
});

// 우선순위가 있는 메시지 전송
await bot.send('긴급 메시지입니다!', {
  channel_id: 'channel-id',
  priority: {
    priority: 'urgent',
    requested_ack: true,
  },
});

// 게시물 조회
const post = await bot.getPost('post-id');

// 게시물 수정
await bot.update({
  post_id: 'post-id',
  message: '수정된 메시지',
  is_pinned: true,
});

// 게시물 삭제
await bot.deletePost('post-id');

// 파일 업로드
const uploadResult = await bot.uploadFile(fileBuffer, {
  channel_id: 'channel-id',
  filename: 'image.png',
});

// 파일과 메시지 함께 전송
await bot.sendFile('파일을 첨부합니다.', fileBuffer, {
  channel_id: 'channel-id',
  filename: 'document.pdf',
});

// 파일과 메시지를 스레드에 전송
await bot.sendFile('스레드에 파일 첨부', fileBuffer, {
  channel_id: 'channel-id',
  root_id: 'parent-post-id',
  filename: 'attachment.png',
});
```

## API

### MmChatbot

#### 생성자

```typescript
new MmChatbot(baseURL: string, config?: MmChatbotConfig)
```

#### 메서드

| 메서드 | 설명 |
|--------|------|
| `setAuthToken(token: string)` | Bearer 토큰 설정 |
| `send(msg: string, cfg: RequestPostConfig)` | 메시지 전송 |
| `update(cfg: RequestUpdateConfig)` | 게시물 수정 |
| `getPost(postId: string)` | 게시물 조회 |
| `deletePost(postId: string)` | 게시물 삭제 |
| `uploadFile(file: File \| Buffer, cfg: FileUploadConfig)` | 파일 업로드 |
| `sendFile(msg: string, file: File \| Buffer, cfg: FileUploadConfig & RequestPostConfig)` | 파일과 메시지 함께 전송 |

## 라이선스

ISC
