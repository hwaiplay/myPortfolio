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
    description: "JWT만으로는 로그인한 기기 하나만 끊거나, 여러 탭에서 동시에 들어온 재발급 요청의 순서를 통제하기 어려웠습니다.",
    details: [
      {
        label: "구조",
        text: "로그인마다 UUID sid를 만들고 Access·Refresh Token에 함께 담았습니다. Redis에는 sid별 세션 Hash와 회원별 세션 목록을 저장했습니다."
      },
      {
        label: "인증",
        text: "JwtFilter에서 서명과 만료시간을 검증한 뒤 sid의 소유 회원이 일치하는지 Redis에서 다시 확인합니다. 현재 기기 로그아웃은 해당 sid만, 전체 로그아웃은 회원의 모든 sid를 제거합니다."
      },
      {
        label: "동시성",
        text: "Refresh Token 검증과 교체를 Redis Lua 한 번으로 처리했습니다. 10초 유예시간 안에 직전 토큰으로 들어온 다중 탭 요청에는 이미 저장된 최신 토큰을 반환합니다."
      },
      {
        label: "선택",
        text: "요청마다 Redis 조회가 추가되는 비용을 감수하고, Access Token 만료 전에도 기기별 세션을 즉시 무효화할 수 있게 했습니다."
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
        text: "공급자·정규화한 검색어·시작 위치를 SHA-256으로 변환해 사용자와 연결되지 않는 공용 Redis 키를 만들고 결과를 10분간 재사용합니다."
      },
      {
        label: "제한",
        text: "캐시 적중과 미적중의 분당 제한을 나누고, 외부 호출 직전에는 회원별 일간 사용량과 공급자별 앱 전체 사용량을 Lua로 함께 예약합니다."
      },
      {
        label: "호출",
        text: "Kakao는 최대 50권, Google Books는 최대 40권을 먼저 받아 화면에서 10권씩 보여줍니다. 10권마다 호출하는 구조보다 각각 최대 5회·4회 호출을 1회로 줄였습니다."
      },
      {
        label: "장애",
        text: "Redis에서 쿼터를 확인하지 못하면 외부 호출을 중단하고, 인기 검색어 집계 실패는 일반 검색 결과와 분리했습니다."
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
        label: "원인",
        text: "현재·이전 주·월·연 독서량과 목표를 12회, 목표 달성을 3회, 도서 목록을 4회 따로 조회해 DB 왕복 비용이 누적됐습니다."
      },
      {
        label: "집계",
        text: "완료 독후감 기준 집합을 CTE로 한 번 만들고 SUM(CASE WHEN …) 조건부 집계로 기간별 독서량과 목표 달성을 한 행에 반환했습니다."
      },
      {
        label: "목록",
        text: "현재 읽는 책과 올해 완료한 책만 한 번 조회한 뒤 Java에서 한 번 순회해 주·월·연 목록으로 분류했습니다. 전체 이력을 올리지 않아 메모리 범위도 제한했습니다."
      },
      {
        label: "검증",
        text: "응답 크기와 SHA-256 해시가 같은 상태에서 SQL을 19회에서 2회로 줄였습니다. 개발 DB 부하 테스트의 100 VU 평균은 51.33% 감소했지만 개선 후에도 10.79초여서 절대 응답 시간은 추가 개선 과제로 남았습니다."
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
        text: "비속어와 예외 허용어를 Aho-Corasick 트라이와 실패 링크로 미리 구성해 입력 문자열을 한 번 순회하며 탐지합니다."
      },
      {
        label: "우회",
        text: "특수문자·숫자 처리본과 반복 문자 축약·제거본을 순차 검사하고, ‘시발점’처럼 비속어가 정상 단어 범위 안에 포함되면 예외 사전으로 통과시킵니다."
      },
      {
        label: "동시성",
        text: "10분 캐시 만료 시 volatile과 Double-Checked Locking을 사용합니다. 첫 번째 스레드만 synchronized 블록에서 DB를 조회하고, 대기하던 스레드는 만료 여부를 다시 확인해 중복 조회를 생략합니다."
      },
      {
        label: "일관성",
        text: "비속어·예외어 매처 4개를 모두 완성한 뒤 불변 BadWordCache 참조를 한 번에 교체합니다. 유효한 캐시를 읽는 일반 요청은 락 없이 처리합니다."
      },
      {
        label: "한계",
        text: "JVM 로컬 캐시이므로 서버가 여러 대면 인스턴스별로 갱신하며, 공통코드 변경은 캐시 TTL에 따라 최대 10분 뒤 반영될 수 있습니다."
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
        label: "버전",
        text: "상세 조회 시 언어·독서 상태·기간·평점·책장 색상·공개 여부·본문을 같은 순서로 결합해 SHA-256 editVersion을 반환합니다."
      },
      {
        label: "수정",
        text: "클라이언트가 조회 당시 editVersion을 저장 요청에 포함하면, UPDATE의 WHERE 절에서 현재 DB 값의 해시와 비교해 일치할 때만 수정합니다."
      },
      {
        label: "충돌",
        text: "다른 탭이나 기기가 먼저 수정해 영향받은 행이 0건이면 409 Conflict로 응답하고, 기존 입력을 덮어쓰지 않은 채 최신 내용을 확인하도록 안내합니다."
      },
      {
        label: "한계",
        text: "별도 버전 컬럼 없이 수정 대상 필드만 추적하므로 조회와 UPDATE의 필드 구성과 순서를 함께 유지해야 합니다."
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
        text: "독후감·대상 언어별 번역문과 원문의 SHA-256 해시를 저장합니다. 현재 원문 해시가 같으면 Google 호출과 사용량 차감 없이 기존 결과를 반환합니다."
      },
      {
        label: "동시성",
        text: "공개 범위와 차단 관계를 다시 확인한 뒤 독후감 행을 SELECT … FOR UPDATE로 잠가 같은 원문에 대한 동시 번역 요청을 직렬화합니다."
      },
      {
        label: "쿼터",
        text: "원문의 유니코드 코드 포인트 수를 계산하고 Redis Lua에서 앱 전체 월간 50만 자 한도 확인과 사용량 증가를 원자적으로 처리한 요청만 외부 API를 호출합니다."
      },
      {
        label: "장애",
        text: "API 키나 Redis 사용량을 확인할 수 없으면 신규 호출을 막습니다. 과금 여부가 불명확한 실패는 예약량을 되돌리지 않아 비용 한도를 보수적으로 보호합니다."
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
        label: "잠금",
        text: "정원을 바꾸는 모든 경로에서 모임 마스터 행을 SELECT … FOR UPDATE로 먼저 잠가 한 모임의 좌석 계산을 트랜잭션 단위로 직렬화합니다."
      },
      {
        label: "좌석",
        text: "확정된 활성 회원과 아직 유효한 초대 예약석을 함께 점유 좌석으로 계산해 직접 가입·초대·승인에 같은 기준을 적용합니다."
      },
      {
        label: "재검증",
        text: "락을 얻은 뒤 모임장 권한, 차단 관계, 중복 가입·신청을 다시 확인합니다. 승인 시 정원이 찼으면 신청을 대기 상태로 유지합니다."
      },
      {
        label: "선택",
        text: "인기 모임의 가입 처리가 한 행에서 대기할 수 있지만, 처리량보다 어느 경로에서도 정원을 넘지 않는 정합성을 우선했습니다."
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
    description: "알림이나 FCM 실패 때문에 핵심 요청까지 롤백되거나, 커밋 전 푸시가 먼저 도착하지 않도록 저장과 발송 시점을 분리했습니다.",
    details: [
      {
        label: "템플릿",
        text: "수신자 언어의 상황·템플릿 코드를 조회해 #{key} 값을 치환하고, 대상 유형·번호와 이동 경로 조합을 서버에서 검증한 뒤 알림 DB에 저장합니다."
      },
      {
        label: "커밋",
        text: "알림 저장 트랜잭션이 성공한 뒤에만 FCM 푸시를 발송합니다. 푸시 실패는 로그로 격리해 이미 저장된 알림과 핵심 업무를 롤백하지 않습니다."
      },
      {
        label: "비동기",
        text: "좋아요는 핵심 트랜잭션의 AFTER_COMMIT 이벤트를 @Async Worker로 넘겨 Redis 닉네임 조회·알림 저장·FCM 처리를 응답 경로와 분리했습니다."
      },
      {
        label: "중복·한계",
        text: "좋아요·팔로우의 동일 알림은 1시간 차단합니다. 현재 FCM 실패는 로그로만 남기고 영속 재시도 큐는 없어 푸시 재전송은 추가 과제입니다."
      }
    ],
    screens: [{
      src: "/assets/screens/notification-push-source.png",
      alt: "Sadari 알림과 웹 푸시 화면",
      caption: "서비스 알림과 웹 푸시"
    }]
  }
];
