import { Question } from '../../types/quiz';

export const part17_design_coupling_cohesion: Question[] = [
  // ==========================================
  // [디자인 패턴 - 생성 패턴 5종 및 종합]
  // ==========================================
  {
    id: 'dgc-dp-001',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '114',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 디자인 패턴 중 생성(Creational) 패턴에 해당하며, 전역 변수를 사용하지 않고 단 하나의 유일한 객체 인스턴스만을 생성하도록 보장하여 어디서든 이 인스턴스에 접근할 수 있도록 하는 디자인 패턴의 명칭은 무엇인가?',
    standardAnswer: '싱글톤',
    acceptedAnswers: ['Singleton', '싱글톤 패턴', 'Singleton Pattern', '싱글톤패턴'],
    explanation: '싱글톤(Singleton) 패턴은 프로그램 전역에서 단 하나의 인스턴스만을 공유하여 사용할 때 적용하는 대표적인 생성 패턴입니다.'
  },
  {
    id: 'dgc-dp-002',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '114',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 생성 패턴 중 구체적인 클래스에 의존하지 않고, 서로 관련성이 있거나 독립적인 여러 객체들의 군(Family)을 생성하기 위한 인터페이스를 제공하는 패턴의 명칭은 무엇인가?',
    standardAnswer: '추상 팩토리',
    acceptedAnswers: ['Abstract Factory', '추상 팩토리 패턴', '추상팩토리', '추상팩토리 패턴'],
    explanation: '추상 팩토리(Abstract Factory) 패턴은 연관된 객체들의 집합을 한꺼번에 통일된 방식으로 생성할 때 사용되는 GoF 생성 패턴입니다.'
  },
  {
    id: 'dgc-dp-003',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '114',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 생성 패턴 중 객체의 생성 작업을 서브클래스로 분리 위임하여 캡슐화하며, 상위 클래스에서는 인터페이스만 정의하고 실제 어떤 클래스를 인스턴스화할지는 하위 클래스가 결정하게 하는 가상 생성자(Virtual Constructor) 패턴은 무엇인가?',
    standardAnswer: '팩토리 메소드',
    acceptedAnswers: ['Factory Method', '팩토리 메서드', '팩토리메소드', '팩토리 메서드 패턴', '팩토리 메소드 패턴'],
    explanation: '팩토리 메소드(Factory Method) 패턴은 인스턴스 생성을 서브 클래스에 위임하여 결합도를 낮춥니다.'
  },
  {
    id: 'dgc-dp-004',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '114',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 생성 패턴 중 복합 객체의 생성 단계와 표현 방법을 분리하여, 동일한 생성 절차에서 서로 다른 형태의 객체를 단계별(step-by-step)로 조립하여 완성할 수 있도록 돕는 패턴은 무엇인가?',
    standardAnswer: '빌더',
    acceptedAnswers: ['Builder', '빌더 패턴', 'Builder Pattern', '빌더패턴'],
    explanation: '빌더(Builder) 패턴은 복잡한 속성을 지닌 인스턴스를 가독성 있게 단계별로 구축할 때 널리 쓰입니다.'
  },
  {
    id: 'dgc-dp-005',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '114',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 빈출',
    question: 'GoF 생성 패턴 중 원본이 되는 전형적인 프로토타입 객체를 생성해 두고, 이를 복제(Clone)하여 새로운 객체를 생성하는 패턴은 무엇인가?',
    standardAnswer: '프로토타입',
    acceptedAnswers: ['Prototype', '프로토타입 패턴', 'Prototype Pattern', '프로토타입패턴'],
    explanation: '프로토타입(Prototype) 패턴은 new 생성 비용이 크거나 객체 생성이 복잡할 때 clone을 이용하여 객체를 생성합니다.'
  },
  {
    id: 'dgc-dp-006',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '113',
    importance: 'A',
    questionType: 'BLANK',
    frequency: '기출 키워드',
    question: 'GoF(Gang of Four) 디자인 패턴의 3대 분류는 객체의 인스턴스 생성 과정에 관여하는 ( ① ) 패턴, 클래스나 객체들을 조합하여 더 큰 구조로 만드는 ( ② ) 패턴, 그리고 객체들 사이의 상호작용과 책임 분배를 다루는 ( ③ ) 패턴으로 나뉜다. ①, ②, ③을 쓰시오.',
    standardAnswer: '생성, 구조, 행위',
    acceptedAnswers: [
      '생성 구조 행위',
      '생성,구조,행위',
      '생성 패턴, 구조 패턴, 행위 패턴',
      '생성패턴, 구조패턴, 행위패턴'
    ],
    explanation: 'GoF 디자인 패턴은 총 23개로 생성(5개), 구조(7개), 행위(11개) 패턴으로 분류됩니다.'
  },

  // ==========================================
  // [디자인 패턴 - 구조 패턴 7종]
  // ==========================================
  {
    id: 'dgc-dp-007',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '115',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 구조(Structural) 패턴 중 서로 호환되지 않는 인터페이스를 가진 두 클래스가 함께 동작할 수 있도록 중간에서 인터페이스를 변환해 주는 래퍼(Wrapper) 역할을 하는 패턴은 무엇인가?',
    standardAnswer: '어댑터',
    acceptedAnswers: ['Adapter', '어댑터 패턴', 'Adapter Pattern', '아답터', '어댑터패턴'],
    explanation: '어댑터(Adapter) 패턴은 220V 콘센트 변환 플러그처럼 호환되지 않는 인터페이스를 맞춰줍니다.'
  },
  {
    id: 'dgc-dp-008',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '115',
    importance: 'A',
    questionType: 'TERM',
    frequency: '2026년 1회 기출',
    question: 'GoF 구조 패턴 중 구현부(Implementation)에서 추상층(Abstraction)을 분리하여, 서로 독립적으로 확장할 수 있도록 다리(Bridge) 역할을 수행하는 디자인 패턴은 무엇인가?',
    standardAnswer: '브리지',
    acceptedAnswers: ['Bridge', '브릿지', '브리지 패턴', 'Bridge Pattern', '브리지패턴'],
    explanation: '브리지(Bridge) 패턴은 기능의 계층과 구현의 계층을 분리하여 독립적인 변경을 가능하게 합니다.'
  },
  {
    id: 'dgc-dp-009',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '115',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 구조 패턴 중 개별 객체(Leaf)와 복합 객체(Composite)를 동일한 인터페이스로 다룰 수 있도록 객체들을 트리 구조로 구성하는 디자인 패턴은 무엇인가?',
    standardAnswer: '컴포지트',
    acceptedAnswers: ['Composite', '컴포지트 패턴', 'Composite Pattern', '합성 패턴', '컴포지트패턴'],
    explanation: '컴포지트(Composite) 패턴은 디렉터리와 파일 관계처럼 계층적인 트리 구조를 단일 인터페이스로 다룹니다.'
  },
  {
    id: 'dgc-dp-010',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '115',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 구조 패턴 중 기존 객체에 영향을 주지 않고, 런타임에 동적으로 새로운 책임이나 기능(장식)을 유연하게 추가할 수 있도록 해주는 패턴은 무엇인가?',
    standardAnswer: '데코레이터',
    acceptedAnswers: ['Decorator', '데코레이터 패턴', 'Decorator Pattern', '데코레이터패턴'],
    explanation: '데코레이터(Decorator) 패턴은 서브클래스 상속 대신 객체를 래핑하여 기능을 덧붙입니다.'
  },
  {
    id: 'dgc-dp-011',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '115',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 구조 패턴 중 복잡한 하위 서브시스템들의 인터페이스를 직접 호출하지 않고, 전면에 단순화된 단일 창구 인터페이스를 제공하여 사용성을 극대화하는 패턴은 무엇인가?',
    standardAnswer: '퍼싸드',
    acceptedAnswers: ['Facade', '퍼사드', '퍼싸드 패턴', '퍼사드 패턴', 'Facade Pattern'],
    explanation: '퍼싸드(Facade) 패턴은 건물의 정면 외벽처럼 복잡한 내부 구조를 감추고 간편한 통합 인터페이스를 제공합니다.'
  },
  {
    id: 'dgc-dp-012',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '115',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 빈출',
    question: 'GoF 구조 패턴 중 수많은 소형 객체를 매번 새로 만들지 않고 가능한 한 공유(Sharing)하여 메모리 낭비를 줄이고 시스템 성능을 최적화하는 경량화 패턴은 무엇인가?',
    standardAnswer: '플라이웨이트',
    acceptedAnswers: ['Flyweight', '플라이웨이트 패턴', 'Flyweight Pattern', '플라이웨이트패턴'],
    explanation: '플라이웨이트(Flyweight) 패턴은 폰트 글자 객체나 게임의 타일처럼 동일한 속성을 공유하여 메모리를 절약합니다.'
  },
  {
    id: 'dgc-dp-013',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '115',
    importance: 'A',
    questionType: 'TERM',
    frequency: '2025년 2회 기출',
    question: 'GoF 구조 패턴 중 대상 객체에 대한 대리자(대리인) 역할을 수행하여, 실제 객체에 접근하기 전에 접근 제어, 지연 로딩, 보안 검사 등을 수행하는 패턴은 무엇인가?',
    standardAnswer: '프록시',
    acceptedAnswers: ['Proxy', '프록시 패턴', 'Proxy Pattern', '프록시패턴'],
    explanation: '프록시(Proxy) 패턴은 실제 무거운 객체를 직접 부르기 전에 대리인을 두어 제어합니다.'
  },

  // ==========================================
  // [디자인 패턴 - 행위 패턴 11종]
  // ==========================================
  {
    id: 'dgc-dp-014',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 행위(Behavioral) 패턴 중 한 객체의 상태 변화가 발생했을 때 그 객체에 의존하고 있는 다른 모든 객체들에게 자동으로 통지가 전달되고 갱신되도록 하는 발행-구독(Publish-Subscribe) 모델의 패턴은 무엇인가?',
    standardAnswer: '옵서버',
    acceptedAnswers: ['Observer', '옵저버', '옵서버 패턴', '옵저버 패턴', 'Observer Pattern'],
    explanation: '옵서버(Observer) 패턴은 1:N 의존 관계를 정의하여 주체의 상태 변화를 관찰자들에게 즉시 브로드캐스팅합니다.'
  },
  {
    id: 'dgc-dp-015',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 행위 패턴 중 동일 목적의 알고리즘 군을 각각 독립적인 클래스로 캡슐화하여 정의하고, 클라이언트의 필요에 따라 동적으로 상호 교체하여 사용할 수 있도록 만드는 전략 패턴은 무엇인가?',
    standardAnswer: '스트래티지',
    acceptedAnswers: ['Strategy', '전략 패턴', '스트래티지 패턴', '스트레티지', 'Strategy Pattern'],
    explanation: '전략(Strategy) 패턴은 지불 수단 선택(카드, 계좌이체 등)처럼 알고리즘을 캡슐화하여 런타임에 갈아 끼웁니다.'
  },
  {
    id: 'dgc-dp-016',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 행위 패턴 중 상위 클래스에서 알고리즘의 뼈대와 처리 순서를 정의하고, 세부적인 구현 단계는 하위 클래스에서 재정의할 수 있도록 위임하는 패턴은 무엇인가?',
    standardAnswer: '템플릿 메소드',
    acceptedAnswers: ['Template Method', '템플릿 메서드', '템플릿 메소드 패턴', '템플릿 메서드 패턴'],
    explanation: '템플릿 메소드(Template Method) 패턴은 전체 알고리즘 흐름을 강제하면서 구체적인 작업 내용은 서브클래스에 위임합니다.'
  },
  {
    id: 'dgc-dp-017',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 행위 패턴 중 수행할 요청(명령)을 하나의 객체로 캡슐화하여 매개변수화하고, 작업 큐잉이나 실행 취소(Undo) 및 재실행(Redo) 기능을 지원할 수 있도록 하는 패턴은 무엇인가?',
    standardAnswer: '커맨드',
    acceptedAnswers: ['Command', '커맨드 패턴', '명령 패턴', 'Command Pattern', '커맨드패턴'],
    explanation: '커맨드(Command) 패턴은 요청 발신자와 수신자를 분리하고 요청 자체를 객체화합니다.'
  },
  {
    id: 'dgc-dp-018',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: 'GoF 행위 패턴 중 객체의 내부 상태에 따라 스스로 동작을 변경할 수 있게 하여, 마치 객체의 클래스가 바뀌는 것처럼 보이게 하는 패턴은 무엇인가?',
    standardAnswer: '상태',
    acceptedAnswers: ['State', '스테이트', '상태 패턴', 'State Pattern', '스테이트 패턴'],
    explanation: '상태(State) 패턴은 복잡한 if-else/switch 조건문 대신 각 상태를 별도의 클래스로 캡슐화합니다.'
  },
  {
    id: 'dgc-dp-019',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 빈출',
    question: 'GoF 행위 패턴 중 객체들의 복잡한 상호작용과 다대다(M:N) 결합을 방지하기 위해, 모든 통신을 중앙의 전담 중개자 객체에 집중시켜 일대다(1:N) 관계로 결합도를 낮추는 패턴은 무엇인가?',
    standardAnswer: '중재자',
    acceptedAnswers: ['Mediator', '미디에이터', '중재자 패턴', 'Mediator Pattern', '중재자패턴'],
    explanation: '중재자(Mediator) 패턴은 공항 관제탑처럼 비행기들끼리 직접 통신하지 않고 관제탑을 통해 통신하게 합니다.'
  },
  {
    id: 'dgc-dp-020',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 빈출',
    question: 'GoF 행위 패턴 중 캡슐화를 위반하지 않은 채 객체의 내부 상태를 캡처하여 저장해 두었다가, 나중에 해당 상태로 복구(스냅샷 롤백)할 수 있도록 돕는 패턴은 무엇인가?',
    standardAnswer: '메멘토',
    acceptedAnswers: ['Memento', '메멘토 패턴', 'Memento Pattern', '메멘토패턴'],
    explanation: '메멘토(Memento) 패턴은 게임 세이브포인트나 문서 편집기의 특정 시점 복원 기능에 사용됩니다.'
  },
  {
    id: 'dgc-dp-021',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 빈출',
    question: 'GoF 행위 패턴 중 내부 구조나 표현 방식을 노출하지 않고, 컬렉션(집합 객체)에 들어 있는 원소들을 순차적으로 순회하며 접근할 수 있게 해주는 패턴은 무엇인가?',
    standardAnswer: '이터레이터',
    acceptedAnswers: ['Iterator', '반복자', '이터레이터 패턴', '반복자 패턴', 'Iterator Pattern'],
    explanation: '반복자(Iterator) 패턴은 리스트, 배열, 트리 등 복합 데이터 구조를 동일한 인터페이스로 순회할 수 있게 합니다.'
  },
  {
    id: 'dgc-dp-022',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 빈출',
    question: 'GoF 행위 패턴 중 데이터 구조(클래스 구조)와 그 구조에 적용할 연산(처리 로직)을 분리하여, 기존 클래스를 수정하지 않고도 새로운 연산을 쉽게 추가할 수 있도록 방문자 객체를 정의하는 패턴은 무엇인가?',
    standardAnswer: '비지터',
    acceptedAnswers: ['Visitor', '방문자', '방문자 패턴', '비지터 패턴', 'Visitor Pattern'],
    explanation: '방문자(Visitor) 패턴은 데이터 구조를 변경하지 않고도 새로운 오퍼레이션을 추가할 수 있는 행위 패턴입니다.'
  },
  {
    id: 'dgc-dp-023',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 빈출',
    question: 'GoF 행위 패턴 중 특정 언어나 문법을 표현하는 규칙을 클래스화하여, 주어진 언어의 문장들을 해석(Evaluate)하고 처리하는 파서(Parser) 구현에 주로 사용되는 패턴은 무엇인가?',
    standardAnswer: '인터프리터',
    acceptedAnswers: ['Interpreter', '해석자', '인터프리터 패턴', '해석자 패턴', 'Interpreter Pattern'],
    explanation: '인터프리터(Interpreter) 패턴은 간단한 쿼리 언어나 수식 평가 엔진을 만들 때 적용됩니다.'
  },
  {
    id: 'dgc-dp-024',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '116',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 빈출',
    question: 'GoF 행위 패턴 중 요청을 처리할 수 있는 핸들러 객체들을 사슬(Chain) 형태로 연결하여, 요청을 보낸 객체가 어느 핸들러가 처리할지 알 필요 없이 사슬을 따라 요청을 순차 전달하는 패턴은 무엇인가?',
    standardAnswer: '책임 연쇄',
    acceptedAnswers: ['Chain of Responsibility', '책임연쇄', '책임 연쇄 패턴', '책임연쇄 패턴'],
    explanation: '책임 연쇄(Chain of Responsibility) 패턴은 윈도우 이벤트 버블링이나 결재 라인 처리에 주로 쓰입니다.'
  },

  // ==========================================
  // [결합도 (Coupling) - 6종 및 순서/특징]
  // ==========================================
  {
    id: 'dgc-cpl-001',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '104',
    importance: 'A',
    questionType: 'BLANK',
    frequency: '최빈출',
    question: '소프트웨어 모듈 간의 결합도(Coupling)를 가장 약한 것(품질 우수)부터 가장 강한 것(품질 불량) 순서대로 나열하시오. [자료 - 스탬프 - ( ① ) - ( ② ) - ( ③ ) - 내용]',
    standardAnswer: '제어, 외부, 공통',
    acceptedAnswers: [
      '제어 외부 공통',
      '제어,외부,공통',
      '제어결합도, 외부결합도, 공통결합도',
      '제어 결합도, 외부 결합도, 공통 결합도'
    ],
    explanation: '결합도 순서(약함→강함): 자료(Data) < 스탬프(Stamp) < 제어(Control) < 외부(External) < 공통(Common) < 내용(Content) 결합도입니다.'
  },
  {
    id: 'dgc-cpl-002',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '104',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: '결합도(Coupling)의 유형 중 모듈 간의 인터페이스가 오직 단순 데이터 파라미터(정수, 실수 등 단일 값)로만 구성되어 모듈 간 독립성이 가장 높고 품질이 가장 우수한 결합도는 무엇인가?',
    standardAnswer: '자료 결합도',
    acceptedAnswers: ['Data Coupling', '자료결합도', '데이터 결합도', '데이터결합도'],
    explanation: '자료 결합도(Data Coupling)는 모듈 간 통신이 순수 데이터 전달만으로 이루어지는 가장 이상적인 결합도입니다.'
  },
  {
    id: 'dgc-cpl-003',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '104',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: '결합도의 유형 중 모듈 간 매개변수로 배열이나 구조체, 레코드와 같은 동일한 복합 데이터 구조를 주고받을 때 발생하는 결합도는 무엇인가?',
    standardAnswer: '스탬프 결합도',
    acceptedAnswers: ['Stamp Coupling', '스탬프결합도', '검인 결합도', '검인결합도'],
    explanation: '스탬프 결합도(Stamp Coupling)는 모듈에서 쓰이지 않는 불필요한 필드까지 통째로 전달될 수 있어 결합도가 높아집니다.'
  },
  {
    id: 'dgc-cpl-004',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '104',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: '결합도의 유형 중 한 모듈이 다른 모듈의 내부 논리적 흐름이나 제어 순서를 변경하기 위해 제어 신호, 플래그(Flag), 또는 스위치 변수를 파라미터로 전달할 때 발생하는 결합도는 무엇인가?',
    standardAnswer: '제어 결합도',
    acceptedAnswers: ['Control Coupling', '제어결합도'],
    explanation: '제어 결합도(Control Coupling)는 호출하는 모듈이 하위 모듈의 세부 내부 로직을 알고 통제하려 하므로 독립성을 크게 저해합니다.'
  },
  {
    id: 'dgc-cpl-005',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '104',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 빈출',
    question: '결합도의 유형 중 모듈들이 외부의 공통 데이터 형식, 통신 프로토콜, 또는 디바이스 인터페이스를 공유하여 통신할 때 발생하는 결합도는 무엇인가?',
    standardAnswer: '외부 결합도',
    acceptedAnswers: ['External Coupling', '외부결합도'],
    explanation: '외부 결합도(External Coupling)는 외부 시스템이나 하드웨어 인터페이스 변경 시 모듈에 직접적인 영향을 미칩니다.'
  },
  {
    id: 'dgc-cpl-006',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '104',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: '결합도의 유형 중 여러 모듈이 외부에 선언된 전역 변수(Global Variable)나 공용 메모리 영역을 공유하여 직접 읽고 쓸 때 발생하는 결합도는 무엇인가?',
    standardAnswer: '공통 결합도',
    acceptedAnswers: ['Common Coupling', '공통결합도', '공유 결합도', '공유결합도'],
    explanation: '공통 결합도(Common Coupling)는 전역 변수 하나가 수정되면 연관된 수많은 모듈에 예측할 수 없는 부작용(Side Effect)을 초래합니다.'
  },
  {
    id: 'dgc-cpl-007',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '104',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: '결합도의 유형 중 한 모듈이 다른 모듈의 내부 기능 및 그 내부에 선언된 지역 변수를 직접 참조하거나 무단으로 수정하는 가장 결합도가 높고 품질이 나쁜 최악의 결합도는 무엇인가?',
    standardAnswer: '내용 결합도',
    acceptedAnswers: ['Content Coupling', '내용결합도'],
    explanation: '내용 결합도(Content Coupling)는 캡슐화가 완전히 무너져 다른 모듈의 내부를 직접 건드리는 최악의 결합도입니다.'
  },

  // ==========================================
  // [응집도 (Cohesion) - 7종 및 순서/특징]
  // ==========================================
  {
    id: 'dgc-coh-001',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '106',
    importance: 'A',
    questionType: 'BLANK',
    frequency: '최빈출',
    question: '소프트웨어 모듈의 응집도(Cohesion)를 가장 강한 것(품질 우수)부터 가장 약한 것(품질 불량) 순서대로 나열하시오. [기능적 - 순차적 - ( ① ) - 절차적 - ( ② ) - 논리적 - ( ③ )]',
    standardAnswer: '교환적, 시간적, 우연적',
    acceptedAnswers: [
      '교환적 시간적 우연적',
      '교환적,시간적,우연적',
      '통신적, 시간적, 우연적',
      '통신적 시간적 우연적',
      '교환적 응집도, 시간적 응집도, 우연적 응집도'
    ],
    explanation: '응집도 순서(강함→약함): 기능적(Functional) > 순차적(Sequential) > 교환적/통신적(Communicational) > 절차적(Procedural) > 시간적(Temporal) > 논리적(Logical) > 우연적(Coincidental) 응집도입니다.'
  },
  {
    id: 'dgc-coh-002',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '106',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: '응집도(Cohesion)의 유형 중 모듈 내부의 모든 구성 요소들이 오직 단 하나의 단일 목적 및 명확한 기능을 수행하기 위해 모인 가장 응집력이 강하고 품질이 우수한 응집도는 무엇인가?',
    standardAnswer: '기능적 응집도',
    acceptedAnswers: ['Functional Cohesion', '기능적응집도', '기능 응집도'],
    explanation: '기능적 응집도(Functional Cohesion)는 하나의 모듈이 오직 하나의 필수 기능(예: 제곱근 계산 함수)만을 완벽히 수행하는 이상적인 상태입니다.'
  },
  {
    id: 'dgc-coh-003',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '106',
    importance: 'A',
    questionType: 'TERM',
    frequency: '2026년 1회 기출',
    question: '응집도의 유형 중 모듈 내 한 활동에서 나온 출력 데이터가 바로 다음 활동의 입력 데이터로 순차 전달되는 파이프라인 형태의 응집도는 무엇인가?',
    standardAnswer: '순차적 응집도',
    acceptedAnswers: ['Sequential Cohesion', '순차적응집도', '순차 응집도'],
    explanation: '순차적 응집도(Sequential Cohesion)는 앞 작업의 결과가 뒷 작업의 입력으로 바로 투입되는 밀접한 관계입니다.'
  },
  {
    id: 'dgc-coh-004',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '106',
    importance: 'A',
    questionType: 'TERM',
    frequency: '2026년 1회 기출',
    question: '응집도의 유형 중 동일한 입력 데이터나 출력 데이터를 사용하여 서로 다른 여러 기능을 수행하는 구성 요소들이 하나의 모듈로 모였을 때 나타나는 응집도는 무엇인가?',
    standardAnswer: '교환적 응집도',
    acceptedAnswers: ['Communication Cohesion', '교환적응집도', '통신적 응집도', '통신적응집도', '교환 응집도'],
    explanation: '동일한 DB 레코드를 읽어서 보고서를 출력하고 화면에도 표시하는 형태는 교환적(통신적) 응집도입니다.'
  },
  {
    id: 'dgc-coh-005',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '106',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 빈출',
    question: '응집도의 유형 중 모듈이 수행하는 다수의 기능들이 일정한 실행 순서(절차)를 가지고 순차적으로 실행되지만, 이전 작업의 결과가 다음 작업의 입력으로 직접 쓰이지는 않는 응집도는 무엇인가?',
    standardAnswer: '절차적 응집도',
    acceptedAnswers: ['Procedural Cohesion', '절차적응집도', '절차 응집도'],
    explanation: '절차적 응집도(Procedural Cohesion)는 순차적 흐름은 따르지만 데이터 종속성(출력이 곧 입력)은 없는 모듈입니다.'
  },
  {
    id: 'dgc-coh-006',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '106',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: '응집도의 유형 중 프로그램 시작 시의 변수 초기화, 파일 열기, 환경설정 로드처럼 "특정 시간대나 시점"에 반드시 함께 수행되어야 하는 처리들을 하나의 모듈에 모아 둔 응집도는 무엇인가?',
    standardAnswer: '시간적 응집도',
    acceptedAnswers: ['Temporal Cohesion', '시간적응집도', '시간 응집도'],
    explanation: '시간적 응집도(Temporal Cohesion)는 기능적 연관보다는 특정 시점(초기화, 종료 등)에 동시에 실행되는 요소들의 모임입니다.'
  },
  {
    id: 'dgc-coh-007',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '106',
    importance: 'A',
    questionType: 'TERM',
    frequency: '최빈출',
    question: '응집도의 유형 중 유사한 성격을 갖거나 논리적으로 같은 범주에 속하는 기능들(예: 모든 입출력 드라이버 루틴 모음, 사칙연산 처리 모음)을 파라미터 분기에 의해 선택 실행하도록 묶어 둔 응집도는 무엇인가?',
    standardAnswer: '논리적 응집도',
    acceptedAnswers: ['Logical Cohesion', '논리적응집도', '논리 응집도'],
    explanation: '논리적 응집도(Logical Cohesion)는 표면상 유사해 보이지만 내부 로직이 서로 달라 유지보수성이 떨어집니다.'
  },
  {
    id: 'dgc-coh-008',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '106',
    importance: 'A',
    questionType: 'TERM',
    frequency: '2026년 1회 기출',
    question: '응집도의 유형 중 모듈 내부의 구성 요소들이 아무런 논리적 관련성이나 연관 없이 우연히 하나의 모듈에 묶여 있어 응집도가 가장 약하고 품질이 최악인 응집도는 무엇인가?',
    standardAnswer: '우연적 응집도',
    acceptedAnswers: ['Coincidental Cohesion', '우연적응집도', '우연 응집도'],
    explanation: '우연적 응집도(Coincidental Cohesion)는 아무런 공통점 없는 코드들이 모여 있어 재사용 및 유지보수가 불가능에 가깝습니다.'
  },

  // ==========================================
  // [모듈 독립성 및 설계 원칙 종합]
  // ==========================================
  {
    id: 'dgc-all-001',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '103',
    importance: 'A',
    questionType: 'TERM',
    frequency: '핵심 기본',
    question: '소프트웨어 모듈의 독립성을 높이고 유지보수성을 극대화하기 위한 모듈 설계의 황금 원칙은 모듈 간의 ( ① )는 최소화(약하게)하고, 모듈 내부의 ( ② )는 최대화(강하게)하는 것이다. ①과 ②를 순서대로 쓰시오.',
    standardAnswer: '결합도, 응집도',
    acceptedAnswers: [
      '결합도 응집도',
      '결합도,응집도',
      'Coupling, Cohesion',
      'Coupling Cohesion'
    ],
    explanation: 'Loose Coupling(약한 결합도)과 High Cohesion(강한 응집도)은 모듈화 및 객체지향 설계의 핵심 목표입니다.'
  },
  {
    id: 'dgc-all-002',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '113',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 키워드',
    question: 'GoF 디자인 패턴 중 생성 패턴에 해당하는 5가지는 싱글톤, 팩토리 메소드, 빌더, 프로토타입, 그리고 (       ) 패턴이다. 괄호 안에 들어갈 생성 패턴을 쓰시오.',
    standardAnswer: '추상 팩토리',
    acceptedAnswers: ['Abstract Factory', '추상 팩토리 패턴', '추상팩토리', '추상팩토리 패턴'],
    explanation: '생성 패턴 5가지 암기: "추-팩-빌-프-싱" (추상 팩토리, 팩토리 메소드, 빌더, 프로토타입, 싱글톤).'
  },
  {
    id: 'dgc-all-003',
    chapter: 'CH4_서버프로그램',
    chapterTitle: '4장 서버 프로그램 구현',
    topicNumber: '113',
    importance: 'A',
    questionType: 'TERM',
    frequency: '기출 키워드',
    question: 'GoF 디자인 패턴 중 구조 패턴에 해당하는 7가지는 어댑터, 브리지, 컴포지트, 데코레이터, 퍼싸드, 프록시, 그리고 (       ) 패턴이다. 괄호 안에 들어갈 구조 패턴을 쓰시오.',
    standardAnswer: '플라이웨이트',
    acceptedAnswers: ['Flyweight', '플라이웨이트 패턴', 'Flyweight Pattern', '플라이웨이트패턴'],
    explanation: '구조 패턴 7가지 암기: "어-브-컴-데-퍼-플-프" (어댑터, 브리지, 컴포지트, 데코레이터, 퍼싸드, 플라이웨이트, 프록시).'
  }
];
