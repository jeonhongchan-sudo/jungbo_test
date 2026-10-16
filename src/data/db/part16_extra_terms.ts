import { Question } from '../../types/quiz';

export const part16_extra_terms: Question[] = [
  {
    id: 'extra-term-001',
    chapter: 'CH9_소프트웨어보안',
    chapterTitle: '9장 소프트웨어 개발 보안 구축',
    importance: 'A',
    questionType: 'TERM',
    question: '일반적인 네트워크 방화벽과 달리 웹 애플리케이션 보안에 특화되어 SQL 삽입(SQL Injection), 크로스 사이트 스크립팅(XSS) 등 웹 계층(L7)의 악의적인 HTTP/HTTPS 트래픽을 탐지하고 차단하는 전용 보안 솔루션의 영문 약어는 무엇인가?',
    standardAnswer: 'WAF',
    acceptedAnswers: ['Web Application Firewall', '웹 방화벽', '웹방화벽', '와프'],
    explanation: 'WAF(Web Application Firewall, 웹 방화벽)는 OSI 7계층의 애플리케이션 계층에서 웹 취약점 공격 트래픽을 전문적으로 차단합니다.'
  },
  {
    id: 'extra-term-002',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    importance: 'A',
    questionType: 'TERM',
    question: '마이크로서비스 아키텍처(MSA)에서 특정 서비스에 장애나 지연이 발생했을 때, 연쇄적인 장애 전파(Cascading Failure)를 차단하기 위해 호출을 즉시 차단하고 사전에 정의된 대체 로직(Fallback)을 반환하는 소프트웨어 회복탄력성 디자인 패턴은 무엇인가?',
    standardAnswer: '서킷 브레이커',
    acceptedAnswers: ['Circuit Breaker', '서킷 브레이커 패턴', '서킷브레이커', '서킷브레이커 패턴'],
    explanation: '전기 차단기(Circuit Breaker)처럼 한 서비스의 과부하나 장애가 전체 시스템으로 번지는 것을 막기 위해 회로를 열어(Open) 즉시 실패를 반환합니다.'
  },
  {
    id: 'extra-term-003',
    chapter: 'CH3_통합구현',
    chapterTitle: '3장 통합 구현',
    importance: 'A',
    questionType: 'TERM',
    question: 'HTTP 프로토콜의 기존 인프라와 메서드(GET, POST, PUT, DELETE)를 그대로 활용하여 자원(URI)을 명시하고 상태를 주고받는 아키텍처 스타일로, 무상태성(Stateless)과 캐시 가능성(Cacheable)을 특징으로 하는 웹 인터페이스 기술의 약어는 무엇인가?',
    standardAnswer: 'REST',
    acceptedAnswers: ['Representational State Transfer', '레스트', 'RESTful'],
    explanation: 'REST(Representational State Transfer)는 로이 필딩(Roy Fielding)이 박사 학위 논문에서 제안한 웹 아키텍처 스타일입니다.'
  },
  {
    id: 'extra-term-004',
    chapter: 'CH11_응용SW기초',
    chapterTitle: '11장 응용 SW 기초 기술 활용',
    importance: 'A',
    questionType: 'TERM',
    question: '서버, 스토리지, 네트워크 등의 IT 인프라 구성을 물리적인 수동 작업 대신 코드 형태의 설정 파일(Terraform, Ansible 등)로 작성하여 버전 관리, 자동화, 재사용을 가능하게 하는 기술을 무엇이라고 하는가?',
    standardAnswer: '코드형 인프라',
    acceptedAnswers: ['IaC', 'Infrastructure as Code', '코드 형 인프라', '코드형인프라'],
    explanation: 'IaC(Infrastructure as Code)는 인프라 배포를 소프트웨어 개발처럼 Git과 연계하여 체계적으로 관리합니다.'
  },
  {
    id: 'extra-term-005',
    chapter: 'CH2_데이터입출력',
    chapterTitle: '2장 데이터 입출력 구현',
    importance: 'A',
    questionType: 'TERM',
    question: '데이터 모델링에서 부모 개체의 기본키가 자식 개체의 외래키이면서 "동시에 기본키(Primary Key)의 일부"로 상속되어, 자식 개체가 부모 개체 없이 독자적으로 존재할 수 없는 종속적인 관계를 무엇이라고 하는가?',
    standardAnswer: '식별 관계',
    acceptedAnswers: ['Identifying Relationship', '식별관계'],
    explanation: '부모 기본키가 자식의 기본키에 포함되면 식별 관계(실선 표기), 일반 속성으로만 상속되면 비식별 관계(점선 표기)입니다.'
  },
  {
    id: 'extra-term-006',
    chapter: 'CH2_데이터입출력',
    chapterTitle: '2장 데이터 입출력 구현',
    importance: 'A',
    questionType: 'TERM',
    question: '데이터 모델링에서 부모 개체의 기본키가 자식 개체의 기본키가 아닌 "일반 속성(외래키)"으로만 전이되어 상속되는 관계를 무엇이라고 하는가?',
    standardAnswer: '비식별 관계',
    acceptedAnswers: ['Non-Identifying Relationship', '비식별관계'],
    explanation: '비식별 관계는 자식 개체가 부모 개체의 존재 유무와 관계없이 독립적인 생명주기를 가질 수 있습니다.'
  },
  {
    id: 'extra-term-007',
    chapter: 'CH2_데이터입출력',
    chapterTitle: '2장 데이터 입출력 구현',
    importance: 'A',
    questionType: 'TERM',
    question: '테이블당 오직 1개만 생성할 수 있으며, 인덱스의 키 값 순서대로 실제 테이블의 물리적 행 데이터들이 정렬(Sort)되어 저장되는 인덱스 방식을 무엇이라고 하는가?',
    standardAnswer: '클러스터드 인덱스',
    acceptedAnswers: ['Clustered Index', '클러스터 인덱스', '클러스터드인덱스'],
    explanation: '클러스터드 인덱스는 사전(Dictionary)처럼 실제 데이터 자체가 인덱스 순서대로 정렬되어 있어 범위 검색 속도가 매우 빠릅니다.'
  },
  {
    id: 'extra-term-008',
    chapter: 'CH9_소프트웨어보안',
    chapterTitle: '9장 소프트웨어 개발 보안 구축',
    importance: 'A',
    questionType: 'TERM',
    question: 'DDoS(분산 서비스 거부) 공격이 발생했을 때, 대규모 유해 공격 트래픽을 정상 트래픽으로부터 격리하여 공격 트래픽은 걸러내고(세척) 정제된 정상 트래픽만을 원본 서버로 전달해 주는 전문 완화 센터의 명칭은 무엇인가?',
    standardAnswer: '스크러빙 센터',
    acceptedAnswers: ['Scrubbing Center', '클린존', 'Clean Zone', '스크러빙센터'],
    explanation: '스크러빙 센터(Scrubbing Center)는 대역폭 고갈형 DDoS 공격 트래픽을 세척(Scrubbing)하여 서버의 가용성을 보호합니다.'
  },
  {
    id: 'extra-term-009',
    chapter: 'CH11_응용SW기초',
    chapterTitle: '11장 응용 SW 기초 기술 활용',
    importance: 'A',
    questionType: 'TERM',
    question: '소프트웨어 정의 네트워킹(SDN) 환경에서 중앙 집중형 제어 계층(컨트롤러)과 실제 패킷 전달을 담당하는 데이터 계층(스위치) 간의 통신을 제어하기 위해 널리 사용되는 최초의 개방형 표준 프로토콜 규격은 무엇인가?',
    standardAnswer: 'OpenFlow',
    acceptedAnswers: ['오픈플로우', '오픈 플로우', 'openflow'],
    explanation: 'OpenFlow(오픈플로우)는 SDN 컨트롤러가 네트워크 스위치의 포워딩 플로우 테이블을 직접 프로그래밍할 수 있게 해줍니다.'
  },
  {
    id: 'extra-term-010',
    chapter: 'CH12_소프트웨어패키징',
    chapterTitle: '12장 제품 소프트웨어 패키징',
    importance: 'A',
    questionType: 'TERM',
    question: 'Git 저장소를 단일 진실 공급원(Single Source of Truth)으로 삼아, Git의 커밋 및 PR 승인을 통해 인프라와 애플리케이션의 배포 상태를 쿠버네티스 등 클라우드 클러스터에 자동으로 동기화하는 배포 운영 모델은 무엇인가?',
    standardAnswer: 'GitOps',
    acceptedAnswers: ['깃옵스', 'gitops'],
    explanation: 'GitOps(깃옵스)는 Git의 선언적 설정(Declarative)을 기반으로 ArgoCD, Flux 등을 활용하여 배포를 자동화합니다.'
  }
];
