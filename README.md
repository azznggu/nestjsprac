# NestJS User API Example

NestJS를 사용한 간단한 사용자 관리 API 예제 프로젝트입니다.

## 기능

- 사용자 CRUD 작업
- Swagger API 문서화
- 단위 테스트 및 E2E 테스트

## API 엔드포인트

- `POST /users` - 새로운 사용자 생성
- `GET /users` - 모든 사용자 조회
- `GET /users/:id` - 특정 사용자 조회
- `DELETE /users/:id` - 사용자 삭제

## 기술 스택

- NestJS
- TypeScript
- Jest (테스팅)
- Swagger (API 문서화)

## 시작하기

### 설치

```bash
$ yarn install
```

### 개발 서버 실행

```bash
$ yarn start:dev
```

### 테스트 실행

```bash
# 단위 테스트
$ yarn test

# e2e 테스트
$ yarn test:e2e

# 테스트 커버리지
$ yarn test:cov
```

## API 문서

서버 실행 후 다음 URL에서 Swagger API 문서를 확인할 수 있습니다:
```
http://localhost:3000/api-docs
```

## 프로젝트 구조

```
src/
├── main.ts                # 애플리케이션 시작점
├── app.module.ts          # 루트 모듈
└── users/                 # 사용자 모듈
    ├── dto/              # Data Transfer Objects
    ├── entities/         # 엔티티 클래스
    ├── interfaces/       # 타입 정의
    ├── decorators/       # 커스텀 데코레이터
    ├── users.module.ts   # 사용자 모듈 정의
    ├── users.controller.ts # 컨트롤러
    └── users.service.ts  # 서비스

test/                     # 테스트 파일
```

## API 예시

### 사용자 생성
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "email": "hong@example.com",
    "age": 30
  }'
```

### 모든 사용자 조회
```bash
curl http://localhost:3000/users
```

### 특정 사용자 조회
```bash
curl http://localhost:3000/users/1
```

### 사용자 삭제
```bash
curl -X DELETE http://localhost:3000/users/1
```

## 라이선스

MIT License
