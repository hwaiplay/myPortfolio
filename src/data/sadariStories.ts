export interface SadariStory {
  eyebrow: string;
  title: string;
  description: string;
  points?: string[];
  details?: Array<{
    label: string;
    text: string;
  }>;
  screens: Array<{
    src: string;
    alt: string;
    caption: string;
    diagram?: boolean;
    crop?: "left" | "center" | "right";
  }>;
}

export const sadariStories: SadariStory[] = [
  {
    eyebrow: "Session",
    title: "세션 관리",
    description: "기기별 세션과 여러 탭의 동시 재발급 요청을 Redis에서 제어했습니다.",
    details: [
      {
        label: "문제",
        text: "JWT만으로는 로그인한 기기 하나만 선택해 끊기 어렵고, 여러 탭에서 동시에 들어온 재발급 요청의 토큰 교체 순서도 통제하기 어려웠습니다."
      },
      {
        label: "해결",
        text: "로그인마다 UUID sid를 Token과 Redis 세션에 저장했습니다. 재발급 로직은 Redis Lua 스크립트로 묶어, 동시에 여러 요청이 들어와도 첫 요청만 토큰을 교체하고 나머지 요청에는 이미 발급된 최신 토큰을 반환했습니다."
      },
      {
        label: "결과",
        text: "원하는 기기만 로그아웃할 수 있고, 여러 탭에서 재발급 요청이 겹쳐도 세션이 끊기지 않도록 했습니다."
      }
    ],
    screens: [
      {
        src: "/assets/screens/session-1-source.png",
        alt: "Sadari 현재 기기와 전체 기기 로그아웃 선택 화면",
        caption: "기기별 로그아웃"
      },
      {
        src: "/assets/screens/account-deactivation.png",
        alt: "Sadari 계정 비활성화 확인 화면",
        caption: "계정 비활성화와 복구 정책"
      }
    ]
  },
  {
    eyebrow: "Book Search",
    title: "도서 검색",
    description: "한 사용자의 반복 검색이 외부 API 쿼터를 소진해 다른 사용자의 검색까지 막지 않도록 호출 경로를 보호했습니다.",
    details: [
      {
        label: "캐시",
        text: "공급자·정규화 검색어·시작 위치를 SHA-256 공용 Redis 키로 만들고 같은 검색 결과를 10분간 재사용했습니다."
      },
      {
        label: "호출 제한",
        text: "캐시된 결과를 반환하는 요청에는 높은 분당 한도를, 외부 API 호출이 필요한 요청에는 낮은 분당 한도를 적용했습니다. 실제 외부 호출 전에는 회원 일일 한도와 공급자별 앱 전체 일일 한도를 함께 확인해, 둘 다 남아 있을 때만 각 사용 횟수를 1회씩 늘렸습니다."
      },
      {
        label: "호출 절감",
        text: "동일 검색 결과를 캐시에서 재사용하고, Kakao 최대 5회·Google 최대 4회 필요하던 페이지 호출을 각각 1회로 줄여 외부 API 사용량을 통제했습니다."
      }
    ],
    screens: [
      {
        src: "/assets/screens/book-search-ko.png",
        alt: "Sadari 한국어 도서 검색 결과 화면",
        caption: "Kakao 한국어 검색"
      },
      {
        src: "/assets/screens/book-search-en.png",
        alt: "Sadari 영어 도서 검색 결과 화면",
        caption: "Google Books 영어 검색"
      }
    ]
  },
  {
    eyebrow: "Reading Goal",
    title: "독서 목표",
    description: "마이페이지 한 화면을 만들기 위해 같은 독후감과 목표 데이터를 기간만 바꿔 최대 19번 조회하고 있었습니다.",
    details: [
      {
        label: "문제",
        text: "현재·이전 주·월·연 독서량과 목표를 12회, 목표 달성을 3회, 도서 목록을 4회 따로 조회해 DB 왕복 비용이 누적됐습니다."
      },
      {
        label: "개선",
        text: "완료 독후감 기준 CTE와 조건부 집계로 기간별 수치를 한 행에 반환하고, 도서 목록도 한 번만 조회해 주·월·연 기준으로 분류했습니다."
      },
      {
        label: "결과",
        text: "응답 크기와 SHA-256 해시가 같은 상태에서 SQL을 19회에서 2회로 줄였고, 개발 DB 100 VU 부하 테스트의 평균 응답 시간을 51.33% 단축했습니다."
      }
    ],
    screens: [
      {
        src: "/assets/screens/reading-goal-source.png",
        alt: "Sadari 독서 목표 달성 현황 화면",
        caption: "주·월·연 목표 달성 현황",
        crop: "left"
      },
      {
        src: "/assets/screens/reading-goal-settings.png",
        alt: "Sadari 독서 목표 설정 화면",
        caption: "기간별 목표 설정"
      }
    ]
  },
  {
    eyebrow: "Content Safety",
    title: "비속어 필터",
    description: "비속어 사전을 매 요청마다 DB에서 읽지 않으면서도, 캐시 갱신 시 여러 요청이 중복 조회하거나 불완전한 사전을 사용하지 않도록 제어했습니다.",
    details: [
      {
        label: "탐지",
        text: "Aho-Corasick 트라이와 실패 링크로 입력 문자열을 한 번 순회하고, 특수문자·반복 문자 정규화와 예외 사전으로 변형 표현과 정상 단어를 구분했습니다."
      },
      {
        label: "캐시 갱신",
        text: "10분 캐시 만료 시 volatile과 Double-Checked Locking을 사용해 첫 번째 스레드만 DB에서 사전을 다시 읽도록 했습니다."
      },
      {
        label: "처리 결과",
        text: "입력 문자열을 한 번 순회해 변형 표현을 탐지하고, 완성된 불변 캐시를 한 번에 교체해 일반 요청은 락과 반복 DB 조회 없이 처리했습니다."
      }
    ],
    screens: [{
      src: "/assets/screens/content-safety-source.png",
      alt: "Sadari 이미지 선택과 콘텐츠 입력 화면",
      caption: "콘텐츠 입력과 이미지 처리"
    }]
  },
  {
    eyebrow: "Optimistic Lock",
    title: "동시 수정 충돌 방지",
    description: "두 탭이 같은 독후감을 열어둔 상태에서 늦게 저장한 요청이 먼저 저장된 내용을 덮어쓰는 문제를 낙관적 락으로 막았습니다.",
    details: [
      {
        label: "문제",
        text: "두 탭이나 기기가 같은 독후감을 조회한 뒤 순서대로 저장하면, 늦게 도착한 요청이 먼저 반영된 수정 내용을 그대로 덮어쓸 수 있었습니다."
      },
      {
        label: "해결",
        text: "상세 조회에서 수정 대상 필드를 SHA-256 editVersion으로 반환하고, 저장 시 UPDATE의 WHERE 절에서 조회 당시 버전과 현재 DB 해시가 일치할 때만 수정하도록 낙관적 락을 적용했습니다."
      },
      {
        label: "결과",
        text: "선행 수정이 있으면 UPDATE 0건을 409 Conflict로 반환해 최신 내용 확인을 안내하고, 먼저 저장된 변경을 보존한 채 원본이 일치하는 요청만 반영했습니다."
      }
    ],
    screens: [
      {
        src: "/assets/screens/report-edit-conflict.jpg",
        alt: "Sadari 독후감 동시 수정 충돌 안내 화면",
        caption: "다른 탭이나 기기의 선행 수정 감지"
      },
      {
        src: "/assets/screens/report-edit-success.jpg",
        alt: "Sadari 독후감 저장 완료 화면",
        caption: "원본이 일치하면 정상 저장"
      }
    ]
  },
  {
    eyebrow: "Translation",
    title: "독후감 번역",
    description: "같은 원문을 반복 번역하거나 동시 요청이 월간 외부 API 예산을 초과하지 않도록 캐시와 호출 예약을 함께 관리했습니다.",
    details: [
      {
        label: "캐시",
        text: "독후감·대상 언어별 번역문과 원문 SHA-256 해시를 저장하고, 원문이 같으면 외부 API 호출과 사용량 차감 없이 기존 결과를 반환했습니다."
      },
      {
        label: "비관적 락",
        text: "독후감 행에 비관적 락을 적용해 같은 원문의 동시 번역 요청을 직렬화하고, 공개 범위와 차단 관계도 잠금 이후 다시 확인했습니다."
      },
      {
        label: "쿼터",
        text: "유니코드 코드 포인트 수를 기준으로 Redis Lua에서 앱 전체 월간 50만 자 확인과 사용량 증가를 원자 처리해 승인된 요청만 외부 API를 호출했습니다."
      }
    ],
    screens: [
      {
        src: "/assets/screens/translation-source.png",
        alt: "Sadari 한국어와 영어 언어 설정 화면",
        caption: "계정 언어 설정",
        crop: "left"
      },
      {
        src: "/assets/screens/translation-result.png",
        alt: "Sadari 독후감 번역 결과 화면",
        caption: "원문과 번역문 전환"
      }
    ]
  },
  {
    eyebrow: "Book Group",
    title: "독서 모임",
    description: "가입 신청 승인과 초대가 동시에 처리되면 각 요청이 같은 빈자리를 보고 정원을 초과할 수 있었습니다.",
    details: [
      {
        label: "문제",
        text: "가입 승인과 초대가 동시에 처리되면 각 요청이 같은 빈자리를 확인해 모임 정원을 초과할 수 있었습니다."
      },
      {
        label: "비관적 락",
        text: "정원을 바꾸는 모든 경로에서 모임 행에 비관적 락을 적용하고, 활성 회원과 유효한 초대 예약석을 합산한 뒤 권한·차단·중복 가입을 다시 검증했습니다."
      },
      {
        label: "결과",
        text: "직접 가입·초대·승인에 동일한 좌석 기준을 적용해 동시 요청에서도 정원을 넘지 않도록 했고, 만석이면 신청 상태를 안전하게 유지했습니다."
      }
    ],
    screens: [
      {
        src: "/assets/screens/book-group-list.png",
        alt: "Sadari 내 독서 모임 목록 화면",
        caption: "가입 상태가 반영된 내 모임"
      },
      {
        src: "/assets/screens/book-group-detail.png",
        alt: "Sadari 독서 모임 상세 화면",
        caption: "독서 모임 상세와 좌석 현황"
      }
    ]
  },
  {
    eyebrow: "Notification",
    title: "알림·푸시",
    description: "핵심 업무와 알림 처리를 분리해 트랜잭션 정합성과 응답 흐름을 함께 지켰습니다.",
    details: [
      {
        label: "템플릿",
        text: "수신자 언어의 상황·템플릿 코드를 조회해 문구를 치환하고, 대상 유형·번호와 이동 경로를 검증한 뒤 알림 DB에 저장했습니다."
      },
      {
        label: "커밋 이후 발송",
        text: "알림 저장 트랜잭션이 완료된 뒤 FCM을 발송해 브라우저가 푸시 직후 조회해도 저장된 알림을 확인할 수 있도록 했습니다."
      },
      {
        label: "비동기 처리",
        text: "좋아요는 AFTER_COMMIT 이벤트와 @Async Worker로 Redis·알림·FCM 처리를 응답 경로에서 분리하고, 동일 좋아요·팔로우 알림은 1시간 차단했습니다."
      }
    ],
    screens: [{
      src: "/assets/screens/notification-push-source.png",
      alt: "Sadari 알림과 웹 푸시 화면",
      caption: "서비스 알림과 웹 푸시"
    }]
  }
];
