export interface SadariStory {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  screen: {
    src: string;
    alt: string;
    caption: string;
    diagram?: boolean;
  };
}

export const sadariStories: SadariStory[] = [
  {
    index: "01",
    eyebrow: "Session",
    title: "세션 관리",
    description: "JWT에 sid를 부여하고 Redis에서 기기별 세션을 관리했습니다. 현재 기기와 전체 기기 로그아웃도 따로 처리했습니다.",
    points: [
      "다중 탭 재발급은 Redis Lua 기반 토큰 회전과 유예시간으로 처리",
      "계정 상태와 Access Token 블랙리스트까지 요청마다 함께 검증"
    ],
    screen: {
      src: "https://github.com/user-attachments/assets/1d1a304b-dd0f-48e6-8e08-a29776ba1b31",
      alt: "Sadari 기기별 로그인 세션 관리 화면",
      caption: "기기별 세션 관리"
    }
  },
  {
    index: "02",
    eyebrow: "Book Group",
    title: "독서 모임",
    description: "가입 신청과 초대, 승인 경로가 달라도 같은 정원 검증을 거치게 해 동시 요청에서도 정원을 넘지 않도록 했습니다.",
    points: [
      "모임 행 잠금 이후 확정 회원과 유효한 초대 좌석을 함께 계산",
      "모임장 권한·차단 관계·중복 가입을 모든 가입 경로에서 재검증"
    ],
    screen: {
      src: "/assets/screens/book-group-detail.png",
      alt: "Sadari 독서 모임 상세 화면",
      caption: "독서 모임 상세"
    }
  },
  {
    index: "03",
    eyebrow: "Notification",
    title: "알림·푸시",
    description: "업무 알림을 저장하고 FCM 웹 푸시는 커밋 이후에 발송해 DB 상태와 발송 시점이 어긋나지 않도록 했습니다.",
    points: [
      "언어별 템플릿 치환과 업무별 중복 방지 규칙 적용",
      "FCM 장애가 핵심 업무 트랜잭션을 실패시키지 않도록 발송 격리"
    ],
    screen: {
      src: "https://github.com/user-attachments/assets/0f9b2674-c65d-4a94-9f46-c9e30954cf71",
      alt: "Sadari 알림과 웹 푸시 화면",
      caption: "서비스 알림과 웹 푸시"
    }
  },
  {
    index: "04",
    eyebrow: "Book Search",
    title: "도서 검색",
    description: "계정 언어에 따라 Kakao와 Google Books를 전환하되 화면에는 같은 데이터 구조를 전달했습니다.",
    points: [
      "회원별 요청 제한과 앱 전체 호출 예산을 Redis Lua로 함께 관리",
      "10분 공용 캐시와 선조회로 Kakao 호출을 최대 5회에서 1회로 축소"
    ],
    screen: {
      src: "/assets/screens/book-search-results.png",
      alt: "Sadari 도서 검색 결과 화면",
      caption: "도서 검색 결과"
    }
  },
  {
    index: "05",
    eyebrow: "Reading Goal",
    title: "독서 목표",
    description: "주·월·연 단위로 목표를 세우고 읽은 책과 독서량을 한 화면에서 확인할 수 있게 만들었습니다.",
    points: [
      "목표 기간과 달성 기준을 같은 집계 규칙으로 계산",
      "반복 조회를 조건부 집계와 목록 조회로 통합해 SQL 최대 19회에서 2회로 축소"
    ],
    screen: {
      src: "/assets/screens/reading-goal-settings.png",
      alt: "Sadari 독서 목표 달성 현황 화면",
      caption: "독서 목표 달성 현황"
    }
  },
  {
    index: "06",
    eyebrow: "Translation",
    title: "독후감 번역",
    description: "필요한 순간에만 번역을 요청하고 같은 원문은 다시 호출하지 않도록 결과를 재사용했습니다.",
    points: [
      "원문 해시 기반 번역 캐시로 같은 내용의 중복 번역 방지",
      "회원별 월 사용량 제한으로 외부 번역 API 비용 통제"
    ],
    screen: {
      src: "/assets/screens/translation-result.png",
      alt: "Sadari 독후감 번역 결과 화면",
      caption: "독후감 번역 결과"
    }
  },
  {
    index: "07",
    eyebrow: "Content Safety",
    title: "콘텐츠 안전",
    description: "텍스트와 이미지 입력을 그대로 믿지 않고 서버의 신뢰 경계 안에서 다시 검사하고 저장했습니다.",
    points: [
      "Aho-Corasick과 예외 사전으로 기호·반복 문자 우회와 정상 표현을 함께 판정",
      "이미지 시그니처·디코더·해상도 검증 후 EXIF 보정과 재인코딩"
    ],
    screen: {
      src: "https://github.com/user-attachments/assets/054ffce7-3c5f-413e-bb60-e9e7e364d027",
      alt: "Sadari 이미지 선택과 콘텐츠 입력 화면",
      caption: "콘텐츠 입력과 이미지 처리"
    }
  },
  {
    index: "08",
    eyebrow: "Admin · Outbox",
    title: "운영 동기화",
    description: "관리자에서 바꾼 회원 상태와 운영 설정이 사용자 서비스에 안전하게 반영되고, 실행 결과를 다시 확인할 수 있게 구성했습니다.",
    points: [
      "회원 상태 변경과 이벤트를 같은 DB 트랜잭션에 저장한 뒤 실패 건 재처리",
      "공통코드·알림 템플릿·권한·스케줄러 실행 및 실패 로그를 별도 관리자에서 관리"
    ],
    screen: {
      src: "/assets/user-status-outbox.svg",
      alt: "Sadari 관리자 회원 상태 DB Outbox 동기화 흐름도",
      caption: "관리자 상태 변경과 Redis 동기화",
      diagram: true
    }
  }
];
