import { CodeDebugQuestion } from '../types/codeDebug';

/**
 * 정보처리기사 실기 고난도 기출변형 64선 (C: 12제, Java: 20제, Python: 17제, SQL: 15제)
 * - 단순 눈계산 불가: 2차원 배열 포인터 보폭 연산, 재귀 분기 스택, 동적 바인딩과 미초기화 필드 은닉,
 *   클로저 nonlocal 상태 갱신, GROUP BY HAVING과 NULL 집계 등 실전 최고난도 문제 수록
 * - 모든 문제에 1000번지/2000번지 가상 메모리 및 테이블 상태 3단계 인터랙티브 디버깅 데이터 포함
 */
export const EXTRA_CODE_DEBUG_QUESTIONS: CodeDebugQuestion[] = [
  // =========================================================================
  // [C LANGUAGE] 12 High-Difficulty Problems (code-c-029 ~ code-c-040)
  // =========================================================================
  {
    id: 'code-c-029',
    language: 'C',
    difficulty: '최상',
    title: '2차원 배열 포인터 보폭 연산과 간접 참조',
    topic: '2차원 배열 포인터',
    tags: ['포인터', '2차원배열', '주소연산'],
    code: `#include <stdio.h>
int main() {
    int a[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    int (*p)[4] = a + 1;
    int *q = *p + 2;
    printf("%d %d %d", *q, *(q + 3), *(*(p - 1) + 3));
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '7 10 4',
    acceptedAnswers: ['7 10 4'],
    keyTakeaway: 'p는 크기 4인 배열을 가리키는 행 포인터(1행 주소 1016번지). *p + 2는 a[1][2]=7. q+3은 연속 메모리상 3칸(12바이트) 뒤인 a[2][1]=10. *(p-1)은 0행이고 +3은 a[0][3]=4입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '3x4 배열 메모리 연속 배치 및 행 포인터 초기화',
        lineHighlight: 7,
        description: '배열 a(1000~1044번지)에서 p=a+1은 1행 시작 번지인 1016번지(&a[1][0])를 가리킵니다.',
        memoryState: [
          { address: '1000번지', name: 'a[0][0..3]', value: '{1, 2, 3, 4}', scope: 'Stack' },
          { address: '1016번지', name: 'a[1][0..3]', value: '{5, 6, 7, 8}', scope: 'Stack' },
          { address: '1032번지', name: 'a[2][0..3]', value: '{9, 10, 11, 12}', scope: 'Stack' },
          { address: '2000번지', name: 'p', type: 'int(*)[4]', value: '1016번지 (&a[1])', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'int *q = *p + 2; 및 주소 연산',
        lineHighlight: 8,
        description: '*p는 1016번지. 여기에 +2(2 * 4 = 8바이트)를 더해 1024번지(&a[1][2], 값 7)를 q에 저장합니다.',
        memoryState: [
          { address: '1024번지', name: 'a[1][2]', value: '7', scope: 'Stack' },
          { address: '2004번지', name: 'q', type: 'int*', value: '1024번지 (&a[1][2])', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'q+3 및 *(*(p-1)+3) 평가 및 출력',
        lineHighlight: 9,
        description: 'q+3은 1024 + 12 = 1036번지(&a[2][1], 값 10). *(p-1)은 0행(1000번지), +3은 1012번지(&a[0][3], 값 4). 출력: 7 10 4.',
        memoryState: [
          { address: '1036번지', name: 'a[2][1]', value: '10', scope: 'Stack' },
          { address: '1012번지', name: 'a[0][3]', value: '4', scope: 'Stack' }
        ],
        consoleOutput: '7 10 4'
      }
    ]
  },
  {
    id: 'code-c-030',
    language: 'C',
    difficulty: '최상',
    title: '문자열 포인터 배열과 전치/후치 증감 간접 참조',
    topic: '포인터 배열과 증감',
    tags: ['포인터배열', '이중포인터', '문자열'],
    code: `#include <stdio.h>
int main() {
    char *arr[] = { "PROGRAM", "ENGINEER", "DATABASE", "NETWORK" };
    char **p = arr;
    printf("%c ", **p++);
    printf("%c ", *(*p + 2));
    printf("%s", *++p + 4);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'P G BASE',
    acceptedAnswers: ['P G BASE'],
    keyTakeaway: '**p++는 현재 **p인 \'P\'를 취한 뒤 p가 arr+1로 전진. *p는 "ENGINEER"이고 +2는 \'G\'. *++p는 p를 arr+2("DATABASE")로 먼저 전진 후 +4 오프셋인 "BASE"를 출력합니다.',
    steps: [
      {
        stepNumber: 1,
        title: '문자열 포인터 배열 및 이중 포인터 초기화',
        lineHighlight: 4,
        description: 'arr[0]=3000("PROGRAM"), arr[1]=3010("ENGINEER"), arr[2]=3020("DATABASE"), arr[3]=3030("NETWORK"). p는 arr[0]의 주소 2000번지를 가리킵니다.',
        memoryState: [
          { address: '2000번지', name: 'p', type: 'char**', value: '1000번지 (&arr[0])', isChanged: true, scope: 'Stack' },
          { address: '3000번지', name: 'arr[0]', value: '"PROGRAM"', scope: 'Data' },
          { address: '3010번지', name: 'arr[1]', value: '"ENGINEER"', scope: 'Data' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'printf("%c ", **p++); 수행 (후위 포인터 이동)',
        lineHighlight: 5,
        description: '**p는 현재 p가 가리키는 arr[0]("PROGRAM")의 첫 글자인 \'P\'를 취하여 출력합니다. 후위 연산(p++)에 의해 p는 1000번지(&arr[0])에서 1004번지(&arr[1])로 전진합니다.',
        memoryState: [
          { address: '2000번지', name: 'p', type: 'char**', value: '1004번지 (&arr[1])', previousValue: '1000번지 (&arr[0])', isChanged: true, changeNote: 'arr[1] 주소로 4B 전진', scope: 'Stack' }
        ],
        consoleOutput: 'P '
      },
      {
        stepNumber: 3,
        title: 'printf("%c ", *(*p + 2)); 수행 (문자열 내 오프셋)',
        lineHighlight: 6,
        description: '*p는 arr[1]의 문자열 주소인 3010번지("ENGINEER")입니다. 여기에 +2(2바이트 오프셋)를 적용하여 3012번지의 문자 \'G\'를 출력합니다. (p 자체는 이동하지 않음)',
        memoryState: [
          { address: '2000번지', name: 'p', type: 'char**', value: '1004번지 (&arr[1])', scope: 'Stack' }
        ],
        consoleOutput: 'P G '
      },
      {
        stepNumber: 4,
        title: 'printf("%s", *++p + 4); 수행 (전위 포인터 이동 후 문자열 출력)',
        lineHighlight: 7,
        description: '전위 연산(++p)에 의해 p가 먼저 arr[2](1008번지, "DATABASE")로 전진합니다. *p는 3020번지이고, 여기에 +4를 더해 3024번지("BASE\\0")를 %s로 출력합니다. 최종 출력: "P G BASE".',
        memoryState: [
          { address: '2000번지', name: 'p', type: 'char**', value: '1008번지 (&arr[2])', previousValue: '1004번지 (&arr[1])', isChanged: true, changeNote: 'arr[2] 주소로 4B 전진', scope: 'Stack' }
        ],
        consoleOutput: 'P G BASE'
      }
    ]
  },
  {
    id: 'code-c-031',
    language: 'C',
    difficulty: '최상',
    title: '정적 변수를 포함한 다중 분기 재귀 함수 역추적',
    topic: '재귀 함수와 static 변수',
    tags: ['재귀함수', 'static', '호출스택'],
    code: `#include <stdio.h>
int func(int n) {
    static int acc = 0;
    acc += n;
    if (n <= 1) return acc;
    if (n % 2 == 0) return func(n / 2) + n;
    return func(n - 1) - n;
}
int main() {
    printf("%d", func(6));
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '17',
    acceptedAnswers: ['17'],
    keyTakeaway: '정적 변수 acc는 스택이 풀려도 초기화되지 않고 계속 누적됩니다. func(6)->acc=6, func(3)->acc=9, func(2)->acc=11, func(1)->acc=12(반환). 역방향 계산: 12+2=14, 14-3=11, 11+6=17이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'func(6) 및 func(3) 호출 전개',
        lineHighlight: 4,
        description: 'func(6): acc=0+6=6, 6은 짝수 -> func(3)+6 호출 대기. func(3): acc=6+3=9, 3은 홀수 -> func(2)-3 호출 대기.',
        memoryState: [
          { address: '3000번지 (BSS)', name: 'acc', value: '9', isChanged: true, scope: 'Static' }
        ],
        callStack: ['main()', 'func(6)', 'func(3)'],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'func(2) 및 func(1) 기저 조건 도달',
        lineHighlight: 5,
        description: 'func(2): acc=9+2=11 -> func(1)+2 대기. func(1): acc=11+1=12. n<=1 기저 조건 만족으로 12 반환 시작.',
        memoryState: [
          { address: '3000번지 (BSS)', name: 'acc', value: '12', isChanged: true, scope: 'Static' }
        ],
        callStack: ['main()', 'func(6)', 'func(3)', 'func(2)', 'func(1)'],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: '스택 언와인딩 및 반환값 누적',
        lineHighlight: 10,
        description: 'func(2) = 12 + 2 = 14 반환. func(3) = 14 - 3 = 11 반환. func(6) = 11 + 6 = 17 최종 반환.',
        memoryState: [
          { address: '3000번지 (BSS)', name: 'acc', value: '12', scope: 'Static' }
        ],
        callStack: ['main()'],
        consoleOutput: '17'
      }
    ]
  },
  {
    id: 'code-c-032',
    language: 'C',
    difficulty: '최상',
    title: '자기참조 구조체 단일 연결 리스트 삽입과 가중치 합계',
    topic: '연결 리스트 노드 조작',
    tags: ['구조체', '연결리스트', '포인터연산'],
    code: `#include <stdio.h>
struct Node {
    int val;
    struct Node *next;
};
int main() {
    struct Node n3 = { 30, NULL };
    struct Node n2 = { 20, &n3 };
    struct Node n1 = { 10, &n2 };
    struct Node ins = { 15, NULL };
    struct Node *head = &n1;
    ins.next = head->next;
    head->next = &ins;
    int sum = 0, count = 0;
    while (head != NULL) {
        sum += head->val * (++count);
        head = head->next;
    }
    printf("%d", sum);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '220',
    acceptedAnswers: ['220'],
    keyTakeaway: 'head 뒤에 ins가 삽입되어 연결 순서는 n1(10) -> ins(15) -> n2(20) -> n3(30)입니다. count는 1, 2, 3, 4로 증가하며 sum = 10*1 + 15*2 + 20*3 + 30*4 = 10 + 30 + 60 + 120 = 220.',
    steps: [
      {
        stepNumber: 1,
        title: '초기 3개 노드 연결 상태',
        lineHighlight: 10,
        description: 'n1(1000번지: val=10, next=1020번지), n2(1020번지: val=20, next=1040번지), n3(1040번지: val=30, next=NULL).',
        memoryState: [
          { address: '1000번지', name: 'n1.val', value: '10', scope: 'Stack' },
          { address: '1020번지', name: 'n2.val', value: '20', scope: 'Stack' },
          { address: '1040번지', name: 'n3.val', value: '30', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'ins 노드 삽입 및 초기 합계 변수 설정',
        lineHighlight: 13,
        description: 'ins.next = head->next(&n2), head->next = &ins로 노드가 삽입되어 순서가 n1(10) ➔ ins(15) ➔ n2(20) ➔ n3(30)이 됩니다. sum=0, count=0이 초기화됩니다.',
        memoryState: [
          { address: '1060번지', name: 'ins.val', value: '15', scope: 'Stack' },
          { address: '1064번지', name: 'ins.next', value: '1020번지 (&n2)', isChanged: true, scope: 'Stack' },
          { address: '1004번지', name: 'n1.next', value: '1060번지 (&ins)', isChanged: true, scope: 'Stack' },
          { address: '2000번지', name: 'sum', value: '0', scope: 'Stack' },
          { address: '2004번지', name: 'count', value: '0', scope: 'Stack' },
          { address: '2008번지', name: 'head', value: '1000번지 (&n1)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: '루프 1회차: n1(10) 처리 (count=1, sum=10)',
        lineHighlight: 16,
        description: 'head가 n1(10)을 가리킵니다. ++count로 count가 1이 되고, sum += 10 * 1 = 10. head는 head->next인 ins(1060번지)로 이동합니다.',
        memoryState: [
          { address: '2004번지', name: 'count', value: '1', previousValue: '0', isChanged: true, changeNote: '0 + 1 = 1', scope: 'Stack' },
          { address: '2000번지', name: 'sum', value: '10', previousValue: '0', isChanged: true, changeNote: '0 + 10*1 = 10', scope: 'Stack' },
          { address: '2008번지', name: 'head', value: '1060번지 (&ins)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: '루프 2회차: ins(15) 처리 (count=2, sum=40)',
        lineHighlight: 16,
        description: 'head가 ins(15)를 가리킵니다. ++count로 count가 2가 되고, sum += 15 * 2 = 30이 더해져 sum은 40이 됩니다. head는 n2(1020번지)로 이동합니다.',
        memoryState: [
          { address: '2004번지', name: 'count', value: '2', previousValue: '1', isChanged: true, changeNote: '1 + 1 = 2', scope: 'Stack' },
          { address: '2000번지', name: 'sum', value: '40', previousValue: '10', isChanged: true, changeNote: '10 + 15*2 = 40', scope: 'Stack' },
          { address: '2008번지', name: 'head', value: '1020번지 (&n2)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 5,
        title: '루프 3회차: n2(20) 처리 (count=3, sum=100)',
        lineHighlight: 16,
        description: 'head가 n2(20)을 가리킵니다. ++count로 count가 3이 되고, sum += 20 * 3 = 60이 더해져 sum은 100이 됩니다. head는 n3(1040번지)로 이동합니다.',
        memoryState: [
          { address: '2004번지', name: 'count', value: '3', previousValue: '2', isChanged: true, changeNote: '2 + 1 = 3', scope: 'Stack' },
          { address: '2000번지', name: 'sum', value: '100', previousValue: '40', isChanged: true, changeNote: '40 + 20*3 = 100', scope: 'Stack' },
          { address: '2008번지', name: 'head', value: '1040번지 (&n3)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 6,
        title: '루프 4회차: n3(30) 처리 (count=4, sum=220)',
        lineHighlight: 16,
        description: 'head가 n3(30)을 가리킵니다. ++count로 count가 4가 되고, sum += 30 * 4 = 120이 더해져 sum은 220이 됩니다. head는 n3->next인 NULL로 이동합니다.',
        memoryState: [
          { address: '2004번지', name: 'count', value: '4', previousValue: '3', isChanged: true, changeNote: '3 + 1 = 4', scope: 'Stack' },
          { address: '2000번지', name: 'sum', value: '220', previousValue: '100', isChanged: true, changeNote: '100 + 30*4 = 220', scope: 'Stack' },
          { address: '2008번지', name: 'head', value: 'NULL', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 7,
        title: 'while 루프 종료 및 printf("%d", sum) 출력',
        lineHighlight: 19,
        description: 'head가 NULL이므로 while 루프가 완전히 종료됩니다. 최종 계산된 sum(220)이 표준 출력에 인쇄됩니다.',
        memoryState: [
          { address: '2000번지', name: 'sum', value: '220', scope: 'Stack' },
          { address: '2004번지', name: 'count', value: '4', scope: 'Stack' }
        ],
        consoleOutput: '220'
      }
    ]
  },
  {
    id: 'code-c-033',
    language: 'C',
    difficulty: '상',
    title: '비트 니블 교환(Nibble Swap)과 XOR 마스킹',
    topic: '비트 단위 연산자',
    tags: ['비트연산', '시프트연산', '마스크'],
    code: `#include <stdio.h>
int main() {
    unsigned char x = 0x5B; /* 0101 1101 (91) */
    unsigned char high = (x & 0xF0) >> 4; /* 0x05 */
    unsigned char low = (x & 0x0F) << 4;  /* 0xB0 */
    unsigned char swapped = high | low;   /* 0xB5 */
    unsigned char mask = 0x3C;            /* 0011 1100 (60) */
    unsigned char result = swapped ^ mask;
    printf("%d", result);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 10진수로 쓰시오.',
    expectedAnswer: '137',
    acceptedAnswers: ['137'],
    keyTakeaway: '상위 4비트(5)와 하위 4비트(B)를 맞바꾸면 0xB5(1011 0101). mask 0x3C(0011 1100)와 XOR(다르면 1)하면 1000 1001(0x89) = 128 + 8 + 1 = 137이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '상위/하위 4비트 분리 및 시프트',
        lineHighlight: 4,
        description: 'high = 0x50 >> 4 = 0x05(0000 0101). low = 0x0B << 4 = 0xB0(1011 0000).',
        memoryState: [
          { address: '1000번지', name: 'high', value: '0x05', scope: 'Stack' },
          { address: '1001번지', name: 'low', value: '0xB0', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'swapped 결합 및 XOR 마스킹',
        lineHighlight: 7,
        description: 'swapped = 0x05 | 0xB0 = 0xB5(1011 0101). 0xB5 ^ 0x3C(0011 1100) = 1000 1001(0x89).',
        memoryState: [
          { address: '1002번지', name: 'swapped', value: '0xB5 (181)', isChanged: true, scope: 'Stack' },
          { address: '1003번지', name: 'result', value: '0x89 (137)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'printf("%d", result); 10진수 출력',
        lineHighlight: 9,
        description: '0x89는 8 * 16 + 9 = 137. 화면에 137 출력.',
        memoryState: [],
        consoleOutput: '137'
      }
    ]
  },
  {
    id: 'code-c-034',
    language: 'C',
    difficulty: '최상',
    title: '문자열 포인터 이동과 시저 암호식 인플레이스 치환',
    topic: '문자열 포인터 조작',
    tags: ['문자열', '아스키코드', '포인터'],
    code: `#include <stdio.h>
int main() {
    char str[] = "EXAM2026C";
    char *p = str, *q = str;
    while (*p) {
        if (*p >= 'A' && *p <= 'Z') {
            *q = 'A' + (*p - 'A' + 2) % 26;
            q++;
        }
        p++;
    }
    *q = '\\0';
    printf("%s", str);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: 'GZCOE',
    acceptedAnswers: ['GZCOE'],
    keyTakeaway: '\'E\'(+2)->\'G\', \'X\'(+2)->\'Z\', \'A\'(+2)->\'C\', \'M\'(+2)->\'O\'. 숫자(\'2\',\'0\',\'2\',\'6\')는 q를 이동시키지 않고 건너뜁니다. \'C\'(+2)->\'E\'. q 끝에 \'\\0\'을 넣어 "GZCOE" 완성.',
    steps: [
      {
        stepNumber: 1,
        title: 'str 배열 및 포인터 p, q 시작점 지정',
        lineHighlight: 4,
        description: 'str은 1000번지에 "EXAM2026C\\0" 할당. p와 q 모두 1000번지(\'E\')를 가리킵니다.',
        memoryState: [
          { address: '1000번지', name: 'str', value: '"EXAM2026C"', scope: 'Stack' },
          { address: '2000번지', name: 'p', value: '1000번지', scope: 'Stack' },
          { address: '2004번지', name: 'q', value: '1000번지', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '대문자 필터링 및 2칸 시프트 변환 루프',
        lineHighlight: 6,
        description: 'E->G, X->Z, A->C, M->O (q는 1004번지까지 전진). 2026은 if문 불만족으로 p만 통과. 마지막 C->E 대입 후 *q=\'\\0\'.',
        memoryState: [
          { address: '1000번지', name: 'str[0..4]', value: "'G', 'Z', 'C', 'O', 'E'", isChanged: true, scope: 'Stack' },
          { address: '1005번지', name: 'str[5]', value: "'\\0'", isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'printf("%s", str); 출력',
        lineHighlight: 13,
        description: '인덱스 5에 널문자가 위치하므로 "GZCOE"가 출력됩니다.',
        memoryState: [],
        consoleOutput: 'GZCOE'
      }
    ]
  },
  {
    id: 'code-c-035',
    language: 'C',
    difficulty: '상',
    title: 'switch-case 문 break 누락(Fall-through) 누적 연산',
    topic: 'switch-case 제어문',
    tags: ['조건문', 'break', 'fall-through'],
    code: `#include <stdio.h>
int main() {
    int res = 0;
    for (int i = 1; i <= 5; i++) {
        switch (i % 3) {
            case 0: res += 10; break;
            case 1: res += 5;
            case 2: res += 2; break;
        }
    }
    printf("%d", res);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '28',
    acceptedAnswers: ['28'],
    keyTakeaway: 'case 1에 break가 없으므로 case 2로 계속 진행(fall-through)되어 5 + 2 = 7이 더해집니다. i=1(7), i=2(2), i=3(10), i=4(7), i=5(2). 총 누적합: 7 + 2 + 10 + 7 + 2 = 28.',
    steps: [
      {
        stepNumber: 1,
        title: 'res = 0 초기화',
        lineHighlight: 4,
        description: '스택 1000번지에 누적 변수 res = 0으로 초기화됩니다.',
        memoryState: [
          { address: '1000번지', name: 'res', type: 'int', value: '0', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '루프 1회차 (i=1): 1%3=1 ➔ case 1, 2 Fall-through (res=7)',
        lineHighlight: [5, 7, 8],
        description: 'i=1에서 i%3은 1. case 1로 진입하여 res += 5 실행 후 break가 없으므로 아래 case 2(res += 2)까지 연속 실행! res = 0 + 5 + 2 = 7이 됩니다.',
        memoryState: [
          { address: '1004번지', name: 'i', type: 'int', value: '1', isChanged: true, scope: 'Stack' },
          { address: '1000번지', name: 'res', type: 'int', value: '7', previousValue: '0', isChanged: true, changeNote: '0 + 5 + 2 = 7 (Fall-through)', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: '루프 2회차 (i=2): 2%3=2 ➔ case 2 (res=9)',
        lineHighlight: [5, 8],
        description: '증감식 i++로 i가 2로 증가. 2%3은 2이므로 case 2로 직접 진입하여 res += 2 실행 후 break 탈출. res = 7 + 2 = 9가 됩니다.',
        memoryState: [
          { address: '1004번지', name: 'i', type: 'int', value: '2', previousValue: '1', isChanged: true, changeNote: 'i++ (1 ➔ 2)', scope: 'Stack' },
          { address: '1000번지', name: 'res', type: 'int', value: '9', previousValue: '7', isChanged: true, changeNote: '7 + 2 = 9', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: '루프 3회차 (i=3): 3%3=0 ➔ case 0 (res=19)',
        lineHighlight: [5, 6],
        description: '증감식 i++로 i가 3으로 증가. 3%3은 0이므로 case 0으로 진입하여 res += 10 실행 후 break 탈출. res = 9 + 10 = 19가 됩니다.',
        memoryState: [
          { address: '1004번지', name: 'i', type: 'int', value: '3', previousValue: '2', isChanged: true, changeNote: 'i++ (2 ➔ 3)', scope: 'Stack' },
          { address: '1000번지', name: 'res', type: 'int', value: '19', previousValue: '9', isChanged: true, changeNote: '9 + 10 = 19', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 5,
        title: '루프 4회차 (i=4): 4%3=1 ➔ case 1, 2 Fall-through (res=26)',
        lineHighlight: [5, 7, 8],
        description: '증감식 i++로 i가 4로 증가. 4%3은 1이므로 case 1(+5) 진입 후 break 없이 case 2(+2)까지 연속 실행! res = 19 + 5 + 2 = 26이 됩니다.',
        memoryState: [
          { address: '1004번지', name: 'i', type: 'int', value: '4', previousValue: '3', isChanged: true, changeNote: 'i++ (3 ➔ 4)', scope: 'Stack' },
          { address: '1000번지', name: 'res', type: 'int', value: '26', previousValue: '19', isChanged: true, changeNote: '19 + 5 + 2 = 26', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 6,
        title: '루프 5회차 (i=5): 5%3=2 ➔ case 2 (res=28)',
        lineHighlight: [5, 8],
        description: '증감식 i++로 i가 5로 증가. 5%3은 2이므로 case 2로 진입하여 res += 2 실행 후 break 탈출. res = 26 + 2 = 28이 됩니다.',
        memoryState: [
          { address: '1004번지', name: 'i', type: 'int', value: '5', previousValue: '4', isChanged: true, changeNote: 'i++ (4 ➔ 5)', scope: 'Stack' },
          { address: '1000번지', name: 'res', type: 'int', value: '28', previousValue: '26', isChanged: true, changeNote: '26 + 2 = 28', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 7,
        title: '루프 탈출 검사 (i=6): 6 <= 5 거짓으로 for문 종료',
        lineHighlight: 4,
        description: '증감식 i++로 i가 6으로 증가. 조건식 6 <= 5가 거짓(False)이 되어 for 반복문을 빠져나옵니다.',
        memoryState: [
          { address: '1004번지', name: 'i', type: 'int', value: '6', previousValue: '5', isChanged: true, changeNote: '6 <= 5 거짓 ➔ 루프 종료', scope: 'Stack' },
          { address: '1000번지', name: 'res', type: 'int', value: '28', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 8,
        title: 'printf("%d", res) 최종 결과 출력',
        lineHighlight: 11,
        description: '최종 누적된 res의 값인 28이 출력됩니다.',
        memoryState: [
          { address: '1000번지', name: 'res', type: 'int', value: '28', scope: 'Stack' }
        ],
        consoleOutput: '28'
      }
    ]
  },
  {
    id: 'code-c-036',
    language: 'C',
    difficulty: '상',
    title: '2차원 행렬 대각 요소 차이(주대각선 - 부대각선)',
    topic: '2차원 배열과 인덱스 공식',
    tags: ['2차원배열', '대각선', '포인터연산'],
    code: `#include <stdio.h>
int main() {
    int m[3][3] = {
        {2, 7, 6},
        {9, 5, 1},
        {4, 3, 8}
    };
    int d1 = 0, d2 = 0;
    for (int i = 0; i < 3; i++) {
        d1 += *(*(m + i) + i);
        d2 += *(*(m + i) + (2 - i));
    }
    printf("%d", d1 - d2);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '0',
    acceptedAnswers: ['0'],
    keyTakeaway: '주대각선 d1 = m[0][0](2) + m[1][1](5) + m[2][2](8) = 15. 부대각선 d2 = m[0][2](6) + m[1][1](5) + m[2][0](4) = 15. 차이는 15 - 15 = 0입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '3x3 행렬 m 및 d1=0, d2=0 초기화',
        lineHighlight: [3, 4, 5, 6, 7, 8],
        description: '행렬 m(1000~1032번지)에 9개 원소가 저장되고, 주대각선 합 d1=0, 부대각선 합 d2=0으로 초기화됩니다.',
        memoryState: [
          { address: '1000번지', name: 'm[0][0]', type: 'int', value: '2', scope: 'Stack' },
          { address: '1008번지', name: 'm[0][2]', type: 'int', value: '6', scope: 'Stack' },
          { address: '1016번지', name: 'm[1][1]', type: 'int', value: '5', scope: 'Stack' },
          { address: '1024번지', name: 'm[2][0]', type: 'int', value: '4', scope: 'Stack' },
          { address: '1032번지', name: 'm[2][2]', type: 'int', value: '8', scope: 'Stack' },
          { address: '2000번지', name: 'd1', type: 'int', value: '0', scope: 'Stack' },
          { address: '2004번지', name: 'd2', type: 'int', value: '0', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '루프 1회차 (i=0): 0 < 3 참 ➔ m[0][0], m[0][2] 누적',
        lineHighlight: [9, 10, 11],
        description: 'i=0. 주대각선 m[0][0](2)을 d1에 누적(d1=2). 부대각선 m[0][2-0](6)을 d2에 누적(d2=6).',
        memoryState: [
          { address: '2008번지', name: 'i', type: 'int', value: '0', isChanged: true, scope: 'Stack' },
          { address: '2000번지', name: 'd1', type: 'int', value: '2', previousValue: '0', isChanged: true, changeNote: '0 + 2 = 2', scope: 'Stack' },
          { address: '2004번지', name: 'd2', type: 'int', value: '6', previousValue: '0', isChanged: true, changeNote: '0 + 6 = 6', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: '루프 2회차 (i=1): 1 < 3 참 ➔ m[1][1], m[1][1] 누적',
        lineHighlight: [9, 10, 11],
        description: '증감식 i++로 i가 1로 증가. 주대각선 m[1][1](5)을 d1에 누적(d1=7). 부대각선 m[1][2-1](5)을 d2에 누적(d2=11).',
        memoryState: [
          { address: '2008번지', name: 'i', type: 'int', value: '1', previousValue: '0', isChanged: true, changeNote: 'i++ (0 ➔ 1)', scope: 'Stack' },
          { address: '2000번지', name: 'd1', type: 'int', value: '7', previousValue: '2', isChanged: true, changeNote: '2 + 5 = 7', scope: 'Stack' },
          { address: '2004번지', name: 'd2', type: 'int', value: '11', previousValue: '6', isChanged: true, changeNote: '6 + 5 = 11', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: '루프 3회차 (i=2): 2 < 3 참 ➔ m[2][2], m[2][0] 누적',
        lineHighlight: [9, 10, 11],
        description: '증감식 i++로 i가 2로 증가. 주대각선 m[2][2](8)을 d1에 누적(d1=15). 부대각선 m[2][2-2](4)을 d2에 누적(d2=15).',
        memoryState: [
          { address: '2008번지', name: 'i', type: 'int', value: '2', previousValue: '1', isChanged: true, changeNote: 'i++ (1 ➔ 2)', scope: 'Stack' },
          { address: '2000번지', name: 'd1', type: 'int', value: '15', previousValue: '7', isChanged: true, changeNote: '7 + 8 = 15', scope: 'Stack' },
          { address: '2004번지', name: 'd2', type: 'int', value: '15', previousValue: '11', isChanged: true, changeNote: '11 + 4 = 15', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 5,
        title: '루프 탈출 검사 (i=3): 3 < 3 거짓으로 for문 종료',
        lineHighlight: 9,
        description: '증감식 i++로 i가 3으로 증가. 조건식 3 < 3이 거짓이 되어 for 루프를 종료합니다.',
        memoryState: [
          { address: '2008번지', name: 'i', type: 'int', value: '3', previousValue: '2', isChanged: true, changeNote: '3 < 3 거짓 ➔ 루프 종료', scope: 'Stack' },
          { address: '2000번지', name: 'd1', type: 'int', value: '15', scope: 'Stack' },
          { address: '2004번지', name: 'd2', type: 'int', value: '15', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 6,
        title: 'printf("%d", d1 - d2) 최종 결과 출력',
        lineHighlight: 13,
        description: 'd1(15) - d2(15) = 0이 최종 출력됩니다.',
        memoryState: [
          { address: '2000번지', name: 'd1', type: 'int', value: '15', scope: 'Stack' },
          { address: '2004번지', name: 'd2', type: 'int', value: '15', scope: 'Stack' }
        ],
        consoleOutput: '0'
      }
    ]
  },
  {
    id: 'code-c-037',
    language: 'C',
    difficulty: '최상',
    title: '이중 포인터를 활용한 포인터 변수 주소 스왑과 값 갱신',
    topic: '이중 포인터 함수 호출',
    tags: ['이중포인터', 'CallByReference', '스왑'],
    code: `#include <stdio.h>
void swap_ptr(int **a, int **b) {
    int *t = *a;
    *a = *b;
    *b = t;
}
int main() {
    int x = 10, y = 30;
    int *p = &x, *q = &y;
    swap_ptr(&p, &q);
    *p += 5;
    *q *= 2;
    printf("%d %d", x, y);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '20 35',
    acceptedAnswers: ['20 35'],
    keyTakeaway: 'swap_ptr은 p와 q가 가리키는 대상 주소를 맞바꿉니다. 이제 p는 y(1004번지)를 가리키고, q는 x(1000번지)를 가리킵니다. *p+=5는 y를 35로, *q*=2는 x를 20으로 만듭니다. x, y 순서로 출력하므로 20 35.',
    steps: [
      {
        stepNumber: 1,
        title: '초기 x, y 및 포인터 p, q 할당',
        lineHighlight: 8,
        description: 'x=10(1000번지), y=30(1004번지). p는 1000번지, q는 1004번지를 가리킵니다.',
        memoryState: [
          { address: '1000번지', name: 'x', value: '10', scope: 'Stack' },
          { address: '1004번지', name: 'y', value: '30', scope: 'Stack' },
          { address: '2000번지', name: 'p', value: '1000번지 (&x)', scope: 'Stack' },
          { address: '2004번지', name: 'q', value: '1004번지 (&y)', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'swap_ptr(&p, &q) 실행 후 포인터 역전',
        lineHighlight: 10,
        description: 'p의 값이 1004번지(&y)로 교체되고, q의 값이 1000번지(&x)로 교체됩니다.',
        memoryState: [
          { address: '2000번지', name: 'p', value: '1004번지 (&y)', isChanged: true, scope: 'Stack' },
          { address: '2004번지', name: 'q', value: '1000번지 (&x)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: '*p += 5; *q *= 2; 수행 및 printf',
        lineHighlight: 13,
        description: '*p(y)에 5 더해 y=35. *q(x)에 2 곱해 x=20. x와 y를 순서대로 출력하므로 "20 35".',
        memoryState: [
          { address: '1000번지', name: 'x', value: '20', isChanged: true, scope: 'Stack' },
          { address: '1004번지', name: 'y', value: '35', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '20 35'
      }
    ]
  },
  {
    id: 'code-c-038',
    language: 'C',
    difficulty: '최상',
    title: '버블 정렬 2회전(Pass) 후의 특정 인덱스 배열 상태',
    topic: '정렬 알고리즘 회전 추적',
    tags: ['버블정렬', '루프추적', '배열'],
    code: `#include <stdio.h>
int main() {
    int a[5] = { 25, 14, 39, 10, 19 };
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 4 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
        }
    }
    printf("%d %d %d", a[0], a[3], a[4]);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '14 25 39',
    acceptedAnswers: ['14 25 39'],
    keyTakeaway: '1회전 후 최댓값 39가 a[4]로 이동({14, 25, 10, 19, 39}). 2회전 후 그 다음 최댓값 25가 a[3]으로 이동({14, 10, 19, 25, 39}). a[0]=14, a[3]=25, a[4]=39.',
    steps: [
      {
        stepNumber: 1,
        title: 'i=0 (1회전) 수행 후 상태',
        lineHighlight: 4,
        description: '인접 원소 비교 교환으로 39가 맨 끝(a[4])으로 확정 배치됩니다: {14, 25, 10, 19, 39}.',
        memoryState: [
          { address: '1000번지', name: 'a[0..4]', value: '{14, 25, 10, 19, 39}', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'i=1 (2회전) 수행 후 상태',
        lineHighlight: 4,
        description: 'j=0(14,25), j=1(25,10 교환), j=2(25,19 교환) -> 25가 a[3]에 안착: {14, 10, 19, 25, 39}.',
        memoryState: [
          { address: '1000번지', name: 'a[0..4]', value: '{14, 10, 19, 25, 39}', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'printf("%d %d %d", a[0], a[3], a[4]); 출력',
        lineHighlight: 11,
        description: 'a[0]=14, a[3]=25, a[4]=39가 공백으로 출력됩니다.',
        memoryState: [],
        consoleOutput: '14 25 39'
      }
    ]
  },
  {
    id: 'code-c-039',
    language: 'C',
    difficulty: '최상',
    title: '피보나치 재귀 호출 횟수와 반환값 동시 추적',
    topic: '재귀 함수 호출 횟수',
    tags: ['재귀함수', '호출트리', '전역변수'],
    code: `#include <stdio.h>
int cnt = 0;
int fib(int n) {
    cnt++;
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
int main() {
    int r = fib(4);
    printf("%d %d", r, cnt);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '3 9',
    acceptedAnswers: ['3 9'],
    keyTakeaway: 'fib(4)는 3입니다. 재귀 호출 횟수 cnt는 fib(4)->1, fib(3)->2, fib(2)->3, fib(1)->4, fib(0)->5, fib(1)->6, fib(2)->7, fib(1)->8, fib(0)->9로 총 9회 호출됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'fib(4) 재귀 호출 트리 분기',
        lineHighlight: 4,
        description: 'fib(4) -> fib(3) + fib(2). fib(3) -> fib(2) + fib(1). fib(2) -> fib(1) + fib(0).',
        memoryState: [
          { address: '3000번지', name: 'cnt', value: '5 (fib(4), 3, 2, 1, 0 순서)', isChanged: true, scope: 'Global' }
        ],
        callStack: ['fib(4)', 'fib(3)', 'fib(2)', 'fib(1)'],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '우측 서브트리 fib(2) 완료 및 cnt 누적',
        lineHighlight: 6,
        description: '남은 우측 분기들(fib(1), fib(2), fib(1), fib(0))이 모두 호출되어 cnt가 9에 도달합니다.',
        memoryState: [
          { address: '3000번지', name: 'cnt', value: '9', isChanged: true, scope: 'Global' },
          { address: '2000번지', name: 'r', value: '3', isChanged: true, scope: 'Stack' }
        ],
        callStack: ['main()'],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'printf("%d %d", r, cnt); 출력',
        lineHighlight: 10,
        description: 'r=3, cnt=9 출력: "3 9".',
        memoryState: [],
        consoleOutput: '3 9'
      }
    ]
  },
  {
    id: 'code-c-040',
    language: 'C',
    difficulty: '상',
    title: '문자열 중간 널문자 치환과 포인터 오프셋 출력',
    topic: '문자열과 널문자 종단',
    tags: ['문자열', '널문자', '포인터오프셋'],
    code: `#include <stdio.h>
int main() {
    char str[] = "SEOUL_KOREA_2026";
    str[5] = '\\0';
    str[11] = '\\0';
    printf("%s %s", str + 6, str);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'KOREA SEOUL',
    acceptedAnswers: ['KOREA SEOUL'],
    keyTakeaway: '인덱스 5(\'_\')와 11(\'_\')에 \'\\0\'이 들어가 "SEOUL\\0KOREA\\02026"이 됩니다. str+6은 "KOREA"의 시작점이고 11의 널문자에서 끝나므로 "KOREA", str은 5의 널문자에서 끝나므로 "SEOUL". 결과: "KOREA SEOUL".',
    steps: [
      {
        stepNumber: 1,
        title: 'str 배열 초기화 및 널문자 치환',
        lineHighlight: 4,
        description: '1005번지(str[5])와 1011번지(str[11])가 \'\\0\'으로 덮어써집니다.',
        memoryState: [
          { address: '1000번지', name: 'str[0..4]', value: '"SEOUL"', scope: 'Stack' },
          { address: '1005번지', name: 'str[5]', value: "'\\0'", isChanged: true, scope: 'Stack' },
          { address: '1006번지', name: 'str[6..10]', value: '"KOREA"', scope: 'Stack' },
          { address: '1011번지', name: 'str[11]', value: "'\\0'", isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'printf("%s %s", str + 6, str); 평가 및 출력',
        lineHighlight: 5,
        description: 'str+6(1006번지)은 "KOREA", str(1000번지)은 "SEOUL". 출력: "KOREA SEOUL".',
        memoryState: [],
        consoleOutput: 'KOREA SEOUL'
      }
    ]
  },

  // =========================================================================
  // [JAVA] 20 High-Difficulty Problems (code-java-011 ~ code-java-030)
  // =========================================================================
  {
    id: 'code-java-011',
    language: 'JAVA',
    difficulty: '최상',
    title: '생성자 내부 동적 디스패치와 필드 은닉(Field Hiding)의 함정',
    topic: '생성자 동적 바인딩 및 필드 은닉',
    tags: ['상속', '동적바인딩', '필드은닉', '생성자'],
    code: `class Base {
    int x = 10;
    Base() {
        print();
    }
    void print() {
        System.out.print("B:" + x + " ");
    }
}
class Derived extends Base {
    int x = 20;
    Derived() {
        print();
    }
    void print() {
        System.out.print("D:" + x + " ");
    }
}
public class Main {
    public static void main(String[] args) {
        Base obj = new Derived();
        System.out.print("F:" + obj.x);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'D:0 D:20 F:10',
    acceptedAnswers: ['D:0 D:20 F:10'],
    keyTakeaway: 'Base() 생성자에서 print() 호출 시 런타임 객체인 Derived의 print()가 동적 바인딩되지만, Derived.x는 아직 초기화 전(0)이므로 "D:0 ". 이어 Derived() 생성자가 실행되어 "D:20 ". obj.x는 Base 타입 참조이므로 Base.x인 "F:10"이 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'new Derived() 시 Base() 생성자 먼저 실행',
        lineHighlight: 4,
        description: 'Base() 내부에서 print() 호출. 런타임 객체가 Derived이므로 Derived.print()가 동적 디스패치됩니다. 이때 Derived.x는 기본값 0!',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'obj.Base.x', value: '10', scope: 'Heap' },
          { address: '2004번지 (Heap)', name: 'obj.Derived.x', value: '0 (미초기화 기본값)', isChanged: true, scope: 'Heap' }
        ],
        consoleOutput: 'D:0 '
      },
      {
        stepNumber: 2,
        title: 'Derived() 생성자 본문 실행',
        lineHighlight: 14,
        description: 'Derived.x가 20으로 초기화된 후 print() 호출 -> "D:20 " 출력.',
        memoryState: [
          { address: '2004번지 (Heap)', name: 'obj.Derived.x', value: '20', isChanged: true, scope: 'Heap' }
        ],
        consoleOutput: 'D:0 D:20 '
      },
      {
        stepNumber: 3,
        title: 'obj.x 필드 접근 평가 및 출력',
        lineHighlight: 22,
        description: '자바 필드는 정적 바인딩(컴파일 타임 선언 타입 기준)되므로 obj(Base)의 x(10)에 접근하여 "F:10" 출력.',
        memoryState: [],
        consoleOutput: 'D:0 D:20 F:10'
      }
    ]
  },
  {
    id: 'code-java-012',
    language: 'JAVA',
    difficulty: '최상',
    title: '상속 계층 간 static 블록과 인스턴스 초기화 블록 실행 순서',
    topic: '클래스 로딩 및 초기화 순서',
    tags: ['static블록', '초기화블록', '생성자순서'],
    code: `class Alpha {
    static { System.out.print("A_S "); }
    { System.out.print("A_I "); }
    Alpha() { System.out.print("A_C "); }
}
class Beta extends Alpha {
    static { System.out.print("B_S "); }
    { System.out.print("B_I "); }
    Beta() { System.out.print("B_C "); }
}
public class Main {
    public static void main(String[] args) {
        System.out.print("M_START ");
        new Beta();
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'A_S B_S M_START A_I A_C B_I B_C ',
    acceptedAnswers: ['A_S B_S M_START A_I A_C B_I B_C', 'A_S B_S M_START A_I A_C B_I B_C '],
    keyTakeaway: '클래스 로딩 시 부모 static -> 자식 static 실행. main 진입 후 "M_START ". new Beta() 시 부모 인스턴스 블록 -> 부모 생성자 -> 자식 인스턴스 블록 -> 자식 생성자 순으로 실행됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '클래스 로딩 및 static 블록 실행',
        lineHighlight: 2,
        description: 'Alpha static 블록("A_S ") -> Beta static 블록("B_S ") 차례로 실행됩니다.',
        memoryState: [],
        consoleOutput: 'A_S B_S '
      },
      {
        stepNumber: 2,
        title: 'main() 시작 및 new Beta() 인스턴스 생성',
        lineHighlight: 14,
        description: '"M_START " 출력 후 new Beta() 진입. Alpha의 인스턴스 블록("A_I ") -> Alpha() 생성자("A_C ").',
        memoryState: [],
        consoleOutput: 'A_S B_S M_START A_I A_C '
      },
      {
        stepNumber: 3,
        title: 'Beta 인스턴스 블록 및 생성자 완료',
        lineHighlight: 9,
        description: 'Beta의 인스턴스 블록("B_I ") -> Beta() 생성자("B_C ") 완료.',
        memoryState: [],
        consoleOutput: 'A_S B_S M_START A_I A_C B_I B_C '
      }
    ]
  },
  {
    id: 'code-java-013',
    language: 'JAVA',
    difficulty: '최상',
    title: '메서드 오버로딩과 오버라이딩의 다형성 디스패치 우선순위',
    topic: '다형성과 메서드 시그니처 바인딩',
    tags: ['다형성', '오버로딩', '동적바인딩'],
    code: `class Parent {
    void show(Object o) { System.out.print("P_Obj "); }
    void show(String s) { System.out.print("P_Str "); }
}
class Child extends Parent {
    void show(Object o) { System.out.print("C_Obj "); }
    void show(Integer i) { System.out.print("C_Int "); }
}
public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        Object x = "Test";
        p.show(x);
        p.show("Test");
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'C_Obj P_Str ',
    acceptedAnswers: ['C_Obj P_Str', 'C_Obj P_Str '],
    keyTakeaway: 'p.show(x)는 x의 컴파일 타입(Object)에 의해 Parent.show(Object)로 결정된 후 Child.show(Object)가 오버라이딩되어 "C_Obj " 실행. p.show("Test")는 Parent.show(String)으로 결정되며 Child에 show(String)이 없으므로 부모의 "P_Str " 실행.',
    steps: [
      {
        stepNumber: 1,
        title: 'Parent p = new Child(); 인스턴스화',
        lineHighlight: 11,
        description: '스택 변수 p(Parent 타입)가 힙 메모리의 Child 인스턴스를 참조합니다.',
        memoryState: [
          { address: '1000번지 (Stack)', name: 'p', type: 'Parent', value: '2000번지 (Child 객체)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'p.show(x) 컴파일 및 런타임 동적 디스패치',
        lineHighlight: 13,
        description: 'x의 선언 타입이 Object이므로 컴파일러는 Parent.show(Object) 선택. 런타임에 Child.show(Object)가 실행되어 "C_Obj " 출력.',
        memoryState: [],
        consoleOutput: 'C_Obj '
      },
      {
        stepNumber: 3,
        title: 'p.show("Test") 실행',
        lineHighlight: 14,
        description: '"Test"는 String이므로 Parent.show(String) 선택. Child에 재정의된 show(String)이 없으므로 부모 메서드 실행 -> "P_Str " 출력.',
        memoryState: [],
        consoleOutput: 'C_Obj P_Str '
      }
    ]
  },
  {
    id: 'code-java-014',
    language: 'JAVA',
    difficulty: '최상',
    title: '참조에 의한 값 전달(Pass-by-Value)과 객체 재할당 함정',
    topic: '자바의 매개변수 전달 방식',
    tags: ['PassByValue', '참조변수', '힙메모리'],
    code: `class Point { int x = 10, y = 20; }
public class Main {
    static void transform(Point p1, Point p2) {
        p1.x += 15;
        p2 = new Point();
        p2.x += 30;
    }
    public static void main(String[] args) {
        Point a = new Point();
        Point b = new Point();
        transform(a, b);
        System.out.println(a.x + " " + b.x);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '25 10',
    acceptedAnswers: ['25 10'],
    keyTakeaway: '자바는 항상 Call-by-Value입니다. p1.x += 15는 힙의 객체 a의 필드를 직접 변경하여 a.x=25가 됩니다. 반면 p2 = new Point()는 스택의 로컬 복사본 p2에 새 주소를 넣었을 뿐이므로 호출자의 원본 참조 b(b.x=10)는 변경되지 않습니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'main에서 Point a, b 객체 힙 생성',
        lineHighlight: 9,
        description: 'a는 2000번지(x=10), b는 2010번지(x=10)를 참조합니다.',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'a.x', value: '10', scope: 'Heap' },
          { address: '2010번지 (Heap)', name: 'b.x', value: '10', scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'transform(a, b) 실행: 필드 수정 vs 로컬 참조 재할당',
        lineHighlight: 4,
        description: 'p1.x += 15는 2000번지(a.x)를 25로 변경. p2 = new Point()는 로컬 변수 p2만 새 3000번지로 바꿀 뿐 b(2010번지)에는 영향 없음.',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'a.x', value: '25', isChanged: true, scope: 'Heap' },
          { address: '2010번지 (Heap)', name: 'b.x', value: '10', scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'System.out.println(a.x + " " + b.x); 출력',
        lineHighlight: 12,
        description: 'a.x는 25, b.x는 10이므로 "25 10"이 출력됩니다.',
        memoryState: [],
        consoleOutput: '25 10'
      }
    ]
  },
  {
    id: 'code-java-015',
    language: 'JAVA',
    difficulty: '최상',
    title: 'try-catch-finally 반환값 스택 레지스터 보존',
    topic: '예외 처리와 finally 반환 제어',
    tags: ['try-catch-finally', '스택반환값', '연산자우선순위'],
    code: `public class Main {
    static int test(int val) {
        try {
            val += 10;
            return val++;
        } finally {
            val += 50;
        }
    }
    public static void main(String[] args) {
        System.out.println(test(5));
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '15',
    acceptedAnswers: ['15'],
    keyTakeaway: 'try 블록에서 val이 15가 된 후 return val++에 의해 15가 임시 반환 레지스터에 복사됩니다. 후위 증가로 val은 16이 되고 finally 블록에서 val이 66으로 증가하지만, finally에 return문이 없으므로 보존된 15가 최종 반환됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'try 블록 val += 10 및 return val++ 평가',
        lineHighlight: 4,
        description: 'val = 5 + 10 = 15. return val++에서 15가 반환 레지스터에 저장되고 val은 16으로 증가.',
        memoryState: [
          { address: 'Stack-Reg', name: 'return_val', value: '15', isChanged: true, scope: 'Stack' },
          { address: '1000번지', name: 'val', value: '16', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'finally 블록 val += 50 실행',
        lineHighlight: 7,
        description: 'val = 16 + 50 = 66으로 증가하지만, finally에 별도 return이 없으므로 레지스터의 15 유지.',
        memoryState: [
          { address: '1000번지', name: 'val', value: '66', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: '최종 메서드 반환 및 출력',
        lineHighlight: 11,
        description: '보존된 반환값 15가 출력됩니다.',
        memoryState: [],
        consoleOutput: '15'
      }
    ]
  },
  {
    id: 'code-java-016',
    language: 'JAVA',
    difficulty: '상',
    title: 'String 상수 풀(Constant Pool)과 new String(), intern() 동일성',
    topic: '문자열 상수 풀과 intern',
    tags: ['String', 'intern', '동일성비교'],
    code: `public class Main {
    public static void main(String[] args) {
        String a = "DATA";
        String b = new String("DATA");
        String c = b.intern();
        System.out.print((a == b) + " " + (a == c) + " " + (b == c));
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'false true false',
    acceptedAnswers: ['false true false'],
    keyTakeaway: 'a는 상수 풀의 주소(5000번지), b는 힙의 새 객체 주소(6000번지)이므로 a==b는 false. b.intern()은 상수 풀에서 동일 문자열의 주소(5000번지)를 반환하므로 a==c는 true. b==c는 false.',
    steps: [
      {
        stepNumber: 1,
        title: 'String a, b, c 메모리 할당',
        lineHighlight: 5,
        description: 'a는 상수 풀(5000번지), b는 일반 힙(6000번지), c는 b.intern()으로 상수 풀 주소(5000번지) 참조.',
        memoryState: [
          { address: '5000번지 (Constant Pool)', name: 'Literal "DATA"', value: '"DATA"', scope: 'Heap' },
          { address: '6000번지 (Heap)', name: 'new String Instance', value: '"DATA"', scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '== 주소 비교 연산 및 출력',
        lineHighlight: 6,
        description: '(a == b)는 false, (a == c)는 true, (b == c)는 false. 출력: "false true false".',
        memoryState: [],
        consoleOutput: 'false true false'
      }
    ]
  },
  {
    id: 'code-java-017',
    language: 'JAVA',
    difficulty: '최상',
    title: 'this()와 super() 생성자 체이닝 연쇄 호출',
    topic: '생성자 체이닝',
    tags: ['this()', 'super()', '생성자'],
    code: `class A {
    A() {
        this(10);
        System.out.print("A0 ");
    }
    A(int x) {
        System.out.print("A" + x + " ");
    }
}
class B extends A {
    B() {
        super();
        System.out.print("B0 ");
    }
    B(int x) {
        this();
        System.out.print("B" + x + " ");
    }
}
public class Main {
    public static void main(String[] args) {
        new B(5);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'A10 A0 B0 B5 ',
    acceptedAnswers: ['A10 A0 B0 B5', 'A10 A0 B0 B5 '],
    keyTakeaway: 'new B(5) -> this()로 B() 호출 -> super()로 A() 호출 -> this(10)으로 A(10)("A10 ") -> A() 본문("A0 ") -> B() 본문("B0 ") -> B(5) 본문("B5 ") 순으로 실행됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '생성자 호출 체인 진입',
        lineHighlight: 21,
        description: 'B(5) -> B() -> A() -> A(10) 순서로 생성자 호출 스택이 쌓입니다.',
        callStack: ['B(5)', 'B()', 'A()', 'A(10)'],
        memoryState: [],
        consoleOutput: 'A10 '
      },
      {
        stepNumber: 2,
        title: '부모 생성자 본문 복귀 및 완료',
        lineHighlight: 4,
        description: 'A(10) 완료 후 A() 본문 실행 -> "A0 " 출력. A() 완료.',
        callStack: ['B(5)', 'B()'],
        memoryState: [],
        consoleOutput: 'A10 A0 '
      },
      {
        stepNumber: 3,
        title: '자식 생성자 본문 복귀 및 완료',
        lineHighlight: 16,
        description: 'B() 본문 실행 -> "B0 " 출력 후, B(5) 본문 복귀 -> "B5 " 출력.',
        callStack: ['main()'],
        memoryState: [],
        consoleOutput: 'A10 A0 B0 B5 '
      }
    ]
  },
  {
    id: 'code-java-018',
    language: 'JAVA',
    difficulty: '상',
    title: '추상 클래스 템플릿 메서드 패턴과 오버라이딩 동적 바인딩',
    topic: '추상 클래스와 템플릿 메서드',
    tags: ['추상클래스', '오버라이딩', '다형성'],
    code: `abstract class Template {
    void run() {
        step1();
        step2();
    }
    void step1() { System.out.print("T1 "); }
    abstract void step2();
}
class Worker extends Template {
    void step1() { System.out.print("W1 "); }
    void step2() { System.out.print("W2 "); }
}
public class Main {
    public static void main(String[] args) {
        Template t = new Worker();
        t.run();
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'W1 W2 ',
    acceptedAnswers: ['W1 W2', 'W1 W2 '],
    keyTakeaway: 'Template의 run()에서 step1()과 step2()를 호출할 때, 런타임 객체가 Worker이므로 둘 다 Worker에서 재정의된 메서드가 동적 바인딩되어 "W1 W2 "가 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'Template t = new Worker(); 인스턴스화',
        lineHighlight: 16,
        description: 't는 Template 타입이지만 실제 객체는 Worker 인스턴스입니다.',
        memoryState: [
          { address: '2000번지 (Heap)', name: 't', value: 'Worker Instance', scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 't.run() 내부 동적 디스패치',
        lineHighlight: 3,
        description: 'step1() 호출 시 Worker.step1()("W1 ") 실행, step2() 호출 시 Worker.step2()("W2 ") 실행.',
        memoryState: [],
        consoleOutput: 'W1 W2 '
      }
    ]
  },
  {
    id: 'code-java-019',
    language: 'JAVA',
    difficulty: '상',
    title: '인터페이스 다중 상속과 default 메서드 충돌 명시적 해결',
    topic: '인터페이스 default 메서드',
    tags: ['인터페이스', 'default메서드', '다중상속'],
    code: `interface I1 { default void act() { System.out.print("I1 "); } }
interface I2 { default void act() { System.out.print("I2 "); } }
class Impl implements I1, I2 {
    public void act() {
        I2.super.act();
        System.out.print("Impl ");
    }
}
public class Main {
    public static void main(String[] args) {
        new Impl().act();
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'I2 Impl ',
    acceptedAnswers: ['I2 Impl', 'I2 Impl '],
    keyTakeaway: '인터페이스 default 메서드 충돌 시 자식 클래스는 I2.super.act() 형태로 특정 인터페이스 메서드를 명시 호출합니다. 따라서 "I2 " 후 "Impl "이 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'I2.super.act() 명시적 디스패치',
        lineHighlight: 5,
        description: 'I2 인터페이스의 default 메서드가 실행되어 "I2 " 출력.',
        memoryState: [],
        consoleOutput: 'I2 '
      },
      {
        stepNumber: 2,
        title: 'Impl 본문 실행 및 완료',
        lineHighlight: 6,
        description: 'Impl의 나머지 출력 "Impl "이 이어져 "I2 Impl " 출력.',
        memoryState: [],
        consoleOutput: 'I2 Impl '
      }
    ]
  },
  {
    id: 'code-java-020',
    language: 'JAVA',
    difficulty: '상',
    title: 'StringBuilder 가변 버퍼 vs String 불변 객체의 루프 연산',
    topic: '문자열 가변성과 불변성',
    tags: ['String', 'StringBuilder', '불변객체'],
    code: `public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("GISA");
        String s = "GISA";
        for (int i = 0; i < 2; i++) {
            sb.append(i);
            s.concat(String.valueOf(i));
        }
        System.out.println(sb + " " + s);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'GISA01 GISA',
    acceptedAnswers: ['GISA01 GISA'],
    keyTakeaway: 'StringBuilder.append()는 객체 내부 버퍼를 직접 수정하여 "GISA01"이 됩니다. String.concat()은 새 문자열을 반환하지만 s = s.concat(...)처럼 재대입하지 않았으므로 불변 원본 "GISA"를 유지합니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'for 루프 2회 순회',
        lineHighlight: 6,
        description: 'sb는 0, 1을 버퍼 뒤에 덧붙여 "GISA01"로 갱신. s.concat()의 반환값은 버려지므로 s는 "GISA" 유지.',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'sb.buffer', value: '"GISA01"', isChanged: true, scope: 'Heap' },
          { address: '2010번지 (Heap)', name: 's', value: '"GISA"', scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '출력문 실행',
        lineHighlight: 9,
        description: '"GISA01 GISA" 출력.',
        memoryState: [],
        consoleOutput: 'GISA01 GISA'
      }
    ]
  },
  {
    id: 'code-java-021',
    language: 'JAVA',
    difficulty: '최상',
    title: '상속 관계에서의 static 변수 공유와 자식 생성자 누적',
    topic: '정적 변수 상속 공유',
    tags: ['static변수', '상속', '생성자'],
    code: `class Counter {
    static int count = 0;
    Counter() { count += 2; }
}
class SubCounter extends Counter {
    SubCounter() { count += 3; }
}
public class Main {
    public static void main(String[] args) {
        new Counter();
        new SubCounter();
        System.out.println(Counter.count);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '7',
    acceptedAnswers: ['7'],
    keyTakeaway: 'static 변수 count는 상속 계층 전체에서 1개만 공유됩니다. new Counter()에서 count+=2(2). new SubCounter()는 부모 생성자를 먼저 암묵적 호출하므로 count+=2(4), 자식 생성자에서 count+=3(7)이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'new Counter(); 생성',
        lineHighlight: 10,
        description: 'Counter() 실행 -> count = 0 + 2 = 2.',
        memoryState: [
          { address: '4000번지 (Method Area)', name: 'Counter.count', value: '2', isChanged: true, scope: 'Static' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'new SubCounter(); 생성',
        lineHighlight: 11,
        description: 'super()에 의해 Counter() 먼저 실행(+2 -> 4), 그 후 SubCounter() 본문 실행(+3 -> 7).',
        memoryState: [
          { address: '4000번지 (Method Area)', name: 'Counter.count', value: '7', isChanged: true, scope: 'Static' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'Counter.count 출력',
        lineHighlight: 12,
        description: '7 출력.',
        memoryState: [],
        consoleOutput: '7'
      }
    ]
  },
  {
    id: 'code-java-022',
    language: 'JAVA',
    difficulty: '상',
    title: '제네릭 타입 소거(Type Erasure)와 메서드 디스패치',
    topic: '제네릭과 타입 소거',
    tags: ['제네릭', '타입소거', '클래스'],
    code: `class Holder<T> {
    T val;
    Holder(T v) { this.val = v; }
    void print(T v) { System.out.print("T:" + v + " "); }
}
public class Main {
    public static void main(String[] args) {
        Holder<Integer> h = new Holder<>(100);
        h.print(200);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'T:200 ',
    acceptedAnswers: ['T:200', 'T:200 '],
    keyTakeaway: '타입 매개변수 T가 Integer로 바인딩되어 h.print(200) 호출 시 "T:200 "이 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'Holder<Integer> 인스턴스화 및 메서드 호출',
        lineHighlight: 9,
        description: 'val=100 저장 후, h.print(200) 실행으로 "T:200 " 출력.',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'h.val', value: '100', scope: 'Heap' }
        ],
        consoleOutput: 'T:200 '
      }
    ]
  },
  {
    id: 'code-java-023',
    language: 'JAVA',
    difficulty: '상',
    title: '배열의 공변성(Covariance)과 요소 누적 합산',
    topic: '배열 공변성과 다형성',
    tags: ['배열', '공변성', 'Number'],
    code: `public class Main {
    public static void main(String[] args) {
        Number[] arr = new Integer[2];
        arr[0] = 10;
        arr[1] = 20;
        int sum = arr[0].intValue() + arr[1].intValue();
        System.out.println(sum);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '30',
    acceptedAnswers: ['30'],
    keyTakeaway: '자바의 배열은 공변성(covariant)을 가지므로 Number[]에 Integer[] 인스턴스를 할당할 수 있으며, 10 + 20 = 30이 계산됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'Number[] arr = new Integer[2]; 할당 및 원소 저장',
        lineHighlight: 5,
        description: 'arr[0]=10, arr[1]=20 저장. 10 + 20 = 30.',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'arr[0]', value: '10', scope: 'Heap' },
          { address: '2004번지 (Heap)', name: 'arr[1]', value: '20', scope: 'Heap' }
        ],
        consoleOutput: '30'
      }
    ]
  },
  {
    id: 'code-java-024',
    language: 'JAVA',
    difficulty: '최상',
    title: '람다 비교자(Comparator)를 활용한 1의 자리 내림차순 정렬',
    topic: '람다식과 커스텀 정렬',
    tags: ['람다', 'Comparator', '정렬'],
    code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        List<Integer> list = Arrays.asList(15, 24, 33, 42, 51);
        list.sort((a, b) -> (b % 10) - (a % 10));
        System.out.println(list.get(0) + " " + list.get(list.size() - 1));
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '15 51',
    acceptedAnswers: ['15 51'],
    keyTakeaway: '1의 자리(b%10 - a%10) 기준 내림차순 정렬: 15(5), 24(4), 33(3), 42(2), 51(1). 첫 원소는 15, 마지막 원소는 51.',
    steps: [
      {
        stepNumber: 1,
        title: '1의 자리 기준 정렬 수행',
        lineHighlight: 5,
        description: '각 수의 1의 자리: 15(5), 24(4), 33(3), 42(2), 51(1). 내림차순 정렬 결과: [15, 24, 33, 42, 51].',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'list', value: '[15, 24, 33, 42, 51]', scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '첫 원소와 마지막 원소 출력',
        lineHighlight: 6,
        description: 'list.get(0)=15, list.get(4)=51. 출력: "15 51".',
        memoryState: [],
        consoleOutput: '15 51'
      }
    ]
  },
  {
    id: 'code-java-025',
    language: 'JAVA',
    difficulty: '최상',
    title: '이진 트리 전위 순회(Pre-order Traversal) 재귀 방문 순서',
    topic: '자료구조 트리 순회',
    tags: ['이진트리', '전위순회', '재귀'],
    code: `class Node {
    int val; Node left, right;
    Node(int v) { this.val = v; }
}
public class Main {
    static void preOrder(Node n) {
        if (n == null) return;
        System.out.print(n.val + " ");
        preOrder(n.left);
        preOrder(n.right);
    }
    public static void main(String[] args) {
        Node root = new Node(1);
        root.left = new Node(2);
        root.right = new Node(3);
        root.left.right = new Node(4);
        preOrder(root);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '1 2 4 3 ',
    acceptedAnswers: ['1 2 4 3', '1 2 4 3 '],
    keyTakeaway: '전위 순회(Pre-order)는 루트 -> 왼쪽 자식 -> 오른쪽 자식 순서로 방문합니다: 루트 1 -> 왼쪽 자식 2 -> 2의 오른쪽 4 -> 루트의 오른쪽 자식 3. 결과: "1 2 4 3 ".',
    steps: [
      {
        stepNumber: 1,
        title: '트리 구성 및 preOrder(root) 시작',
        lineHighlight: 14,
        description: 'root(1) 출력("1 ") 후 왼쪽 자식 preOrder(2) 호출.',
        memoryState: [],
        consoleOutput: '1 '
      },
      {
        stepNumber: 2,
        title: 'Node 2 및 자식 노드 순회',
        lineHighlight: 8,
        description: '2 출력("2 "), 2의 왼쪽(null) 복귀 후 오른쪽 4 출력("4 ").',
        memoryState: [],
        consoleOutput: '1 2 4 '
      },
      {
        stepNumber: 3,
        title: '우측 서브트리 Node 3 방문 및 완료',
        lineHighlight: 10,
        description: '3 출력("3 "). 최종 결과: "1 2 4 3 ".',
        memoryState: [],
        consoleOutput: '1 2 4 3 '
      }
    ]
  },
  {
    id: 'code-java-026',
    language: 'JAVA',
    difficulty: '상',
    title: '래퍼 클래스 캐싱 범위(-128~127)와 == vs equals',
    topic: '래퍼 클래스 Integer Cache',
    tags: ['WrapperClass', 'IntegerCache', 'equals'],
    code: `public class Main {
    public static void main(String[] args) {
        Integer a = 127, b = 127;
        Integer c = 128, d = 128;
        System.out.print((a == b) + " " + (c == d) + " " + c.equals(d));
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'true false true',
    acceptedAnswers: ['true false true'],
    keyTakeaway: '자바의 Integer 캐시는 -128부터 127까지만 객체를 재사용하므로 127인 a==b는 true입니다. 128은 새 객체로 생성되므로 c==d는 false이며, 내용 값을 비교하는 c.equals(d)는 true입니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'Integer 객체 할당 및 캐시 조회',
        lineHighlight: 4,
        description: 'a와 b는 캐시 테이블 3000번지 공유. c(4000번지)와 d(4010번지)는 128이므로 별도 힙 할당.',
        memoryState: [
          { address: '3000번지 (Cache)', name: 'Integer(127)', value: '127 (공유)', scope: 'Heap' },
          { address: '4000번지 (Heap)', name: 'c', value: 'Integer(128)', scope: 'Heap' },
          { address: '4010번지 (Heap)', name: 'd', value: 'Integer(128)', scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '비교 연산 평가 및 출력',
        lineHighlight: 5,
        description: 'a==b(true), c==d(false), c.equals(d)(true) -> "true false true".',
        memoryState: [],
        consoleOutput: 'true false true'
      }
    ]
  },
  {
    id: 'code-java-027',
    language: 'JAVA',
    difficulty: '최상',
    title: 'AutoCloseable 리소스의 try-with-resources 역순 해제',
    topic: 'try-with-resources 해제 순서',
    tags: ['AutoCloseable', '자원해제순서', '예외처리'],
    code: `class Resource implements AutoCloseable {
    String name;
    Resource(String n) { this.name = n; }
    public void close() { System.out.print(name + "_closed "); }
}
public class Main {
    public static void main(String[] args) {
        try (Resource r1 = new Resource("R1");
             Resource r2 = new Resource("R2")) {
            System.out.print("BODY ");
        }
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'BODY R2_closed R1_closed ',
    acceptedAnswers: ['BODY R2_closed R1_closed', 'BODY R2_closed R1_closed '],
    keyTakeaway: 'try-with-resources 문은 try 블록 본문("BODY ")이 정상 종료된 직후, 선언된 리소스의 역순(r2 -> r1)으로 close() 메서드를 자동 호출합니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'try 본문 실행',
        lineHighlight: 9,
        description: '"BODY " 출력.',
        memoryState: [],
        consoleOutput: 'BODY '
      },
      {
        stepNumber: 2,
        title: '선언 역순 close() 호출',
        lineHighlight: 10,
        description: 'r2.close()("R2_closed ") 먼저 실행 후 r1.close()("R1_closed ") 실행.',
        memoryState: [],
        consoleOutput: 'BODY R2_closed R1_closed '
      }
    ]
  },
  {
    id: 'code-java-028',
    language: 'JAVA',
    difficulty: '최상',
    title: '2차원 배열의 90도 시계방향 회전 알고리즘',
    topic: '2차원 배열 회전 알고리즘',
    tags: ['2차원배열', '회전', '행렬변환'],
    code: `public class Main {
    public static void main(String[] args) {
        int[][] m = { {1, 2}, {3, 4} };
        int[][] r = new int[2][2];
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                r[j][1 - i] = m[i][j];
            }
        }
        System.out.println(r[0][0] + " " + r[0][1]);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '3 1',
    acceptedAnswers: ['3 1'],
    keyTakeaway: '90도 시계방향 회전 공식 r[j][n-1-i] = m[i][j]에 의해 [[1, 2], [3, 4]]는 [[3, 1], [4, 2]]가 됩니다. 0행의 두 원소 r[0][0]=3, r[0][1]=1.',
    steps: [
      {
        stepNumber: 1,
        title: '인덱스 치환 루프 회전',
        lineHighlight: 7,
        description: 'm[0][0](1)->r[0][1], m[0][1](2)->r[1][1], m[1][0](3)->r[0][0], m[1][1](4)->r[1][0].',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'r[0]', value: '{3, 1}', isChanged: true, scope: 'Heap' },
          { address: '2008번지 (Heap)', name: 'r[1]', value: '{4, 2}', isChanged: true, scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'r[0][0]과 r[0][1] 출력',
        lineHighlight: 10,
        description: '3과 1 출력.',
        memoryState: [],
        consoleOutput: '3 1'
      }
    ]
  },
  {
    id: 'code-java-029',
    language: 'JAVA',
    difficulty: '상',
    title: '익명 내부 클래스의 외부 지역 변수 캡처(Effectively Final)',
    topic: '익명 내부 클래스와 변수 캡처',
    tags: ['익명클래스', '변수캡처', '인터페이스'],
    code: `interface Greeter { void greet(); }
public class Main {
    public static void main(String[] args) {
        int base = 100;
        Greeter g = new Greeter() {
            int val = 20;
            public void greet() {
                System.out.println(base + val);
            }
        };
        g.greet();
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '120',
    acceptedAnswers: ['120'],
    keyTakeaway: '익명 내부 클래스는 외부의 effectively final 변수 base(100)를 복사 캡처하여 자신의 필드 val(20)과 더하므로 120이 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '익명 객체 생성 및 greet() 호출',
        lineHighlight: 8,
        description: '100 + 20 = 120 계산 후 출력.',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'g.val', value: '20', scope: 'Heap' }
        ],
        consoleOutput: '120'
      }
    ]
  },
  {
    id: 'code-java-030',
    language: 'JAVA',
    difficulty: '최상',
    title: '예외 발생 시 catch 블록과 finally 블록의 명시적 return 우선순위',
    topic: '예외 처리 return 덮어쓰기',
    tags: ['try-catch', 'finally', 'return우선순위'],
    code: `public class Main {
    static int calc() {
        int x = 10;
        try {
            x /= 0;
        } catch (ArithmeticException e) {
            x = 30;
            return x;
        } finally {
            x = 50;
            return x;
        }
    }
    public static void main(String[] args) {
        System.out.println(calc());
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '50',
    acceptedAnswers: ['50'],
    keyTakeaway: 'catch 블록에서 return 30을 준비했더라도, finally 블록 내부에 명시적 return x가 존재하면 catch 블록의 반환값과 예외는 완전히 무시되고 finally의 50이 최종 반환됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'try 블록 x /= 0 산술 예외 발생 및 catch 이동',
        lineHighlight: 6,
        description: 'ArithmeticException 발생으로 catch 진입. x = 30 대입 후 return 30 대기.',
        memoryState: [
          { address: '1000번지', name: 'x', value: '30', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'finally 블록 진입 및 return 덮어쓰기',
        lineHighlight: 10,
        description: 'finally 블록에서 x=50 변경 후 직접 return x 실행 -> 50 최종 반환.',
        memoryState: [
          { address: '1000번지', name: 'x', value: '50', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '50'
      }
    ]
  },

  // =========================================================================
  // [PYTHON] 17 High-Difficulty Problems (code-py-007 ~ code-py-023)
  // =========================================================================
  {
    id: 'code-py-007',
    language: 'PYTHON',
    difficulty: '최상',
    title: '가변 객체 기본 인자 누적과 명시적 인자 분리',
    topic: '기본 매개변수 가변 객체 함정',
    tags: ['가변객체', '기본인자', '함수스코프'],
    code: `def collect(item, box=[]):
    box.append(item)
    return sum(box)

a = collect(5)
b = collect(10, [100])
c = collect(15)
print(f"{a} {b} {c}")`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '5 110 20',
    acceptedAnswers: ['5 110 20'],
    keyTakeaway: '기본 인자 box는 함수 정의 시점에 1회 생성되어 메모리를 공유합니다. a 호출 시 box=[5](sum=5). b는 새 리스트 [100]을 넘겨 [100, 10](sum=110). c는 공유된 box에 15가 추가되어 [5, 15](sum=20). 출력: 5 110 20.',
    steps: [
      {
        stepNumber: 1,
        title: 'a = collect(5) 실행',
        lineHighlight: 5,
        description: '기본 인자 리스트(5000번지)에 5 추가 -> [5]. sum = 5.',
        memoryState: [
          { address: '5000번지 (Default Pool)', name: 'box', value: '[5]', isChanged: true, scope: 'Function Default' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'b = collect(10, [100]) 실행',
        lineHighlight: 6,
        description: '명시적 새 리스트 [100](6000번지)에 10 추가 -> [100, 10]. sum = 110.',
        memoryState: [
          { address: '6000번지 (Heap)', name: 'explicit_box', value: '[100, 10]', isChanged: true, scope: 'Local' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'c = collect(15) 실행 및 출력',
        lineHighlight: 7,
        description: '다시 기본 인자(5000번지)가 쓰여 [5, 15]. sum = 20. 결과: "5 110 20".',
        memoryState: [
          { address: '5000번지 (Default Pool)', name: 'box', value: '[5, 15]', isChanged: true, scope: 'Function Default' }
        ],
        consoleOutput: '5 110 20'
      }
    ]
  },
  {
    id: 'code-py-008',
    language: 'PYTHON',
    difficulty: '최상',
    title: '행 합계 홀수 조건과 원소 필터링 2차원 컴프리헨션',
    topic: '중첩 리스트 컴프리헨션',
    tags: ['컴프리헨션', '2차원리스트', '필터링'],
    code: `matrix = [
    [2, 7, 4],
    [9, 5, 8],
    [6, 1, 3]
]
res = [x * 2 for row in matrix if sum(row) % 2 == 1 for x in row if x >= 5]
print(res)`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 리스트 형식으로 쓰시오.',
    expectedAnswer: '[14]',
    acceptedAnswers: ['[14]'],
    keyTakeaway: '각 행의 합: row 0은 2+7+4=13(홀수), row 1은 9+5+8=22(짝수), row 2는 6+1+3=10(짝수). 오직 row 0만 조건을 통과합니다. row 0에서 5 이상인 원소는 7 하나뿐이므로 7 * 2 = 14.',
    steps: [
      {
        stepNumber: 1,
        title: 'if sum(row) % 2 == 1 행 필터링',
        lineHighlight: 6,
        description: 'row 0(합 13)만 통과, row 1(22)과 row 2(10)는 제외됩니다.',
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'for x in row if x >= 5 및 변환',
        lineHighlight: 6,
        description: 'row 0([2, 7, 4]) 중 x>=5인 원소는 7. x*2 = 14. 최종 리스트: [14].',
        memoryState: [
          { address: '2000번지', name: 'res', value: '[14]', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: '[14]'
      }
    ]
  },
  {
    id: 'code-py-009',
    language: 'PYTHON',
    difficulty: '최상',
    title: '음수 스텝 슬라이싱과 인덱스 경계값',
    topic: '문자열 음수 슬라이싱',
    tags: ['슬라이싱', '문자열', '스텝연산'],
    code: `s = "COMPUTER_SCIENCE_2026"
res = s[15:1:-3]
print(res)`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 쓰시오.',
    expectedAnswer: 'EC_TP',
    acceptedAnswers: ['EC_TP'],
    keyTakeaway: '인덱스 15부터 1 초과까지 -3씩 건너뜁니다: 15번째 글자 \'E\', 12번째 \'C\', 9번째 \'_\', 6번째 \'T\', 3번째 \'P\'. 0번째는 stop=1에 걸리므로 포함되지 않습니다. 결과: \'EC_TP\'.',
    steps: [
      {
        stepNumber: 1,
        title: '슬라이싱 인덱스 추적 (15, 12, 9, 6, 3)',
        lineHighlight: 2,
        description: 's[15]=\'E\', s[12]=\'C\', s[9]=\'_\', s[6]=\'T\', s[3]=\'P\'.',
        memoryState: [
          { address: '2000번지', name: 'res', value: '"EC_TP"', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: 'EC_TP'
      }
    ]
  },
  {
    id: 'code-py-010',
    language: 'PYTHON',
    difficulty: '최상',
    title: '클로저(Closure)와 nonlocal 키워드의 상태 누적',
    topic: '클로저와 nonlocal 스코프',
    tags: ['클로저', 'nonlocal', '상태유지'],
    code: `def maker(n):
    def inner(x):
        nonlocal n
        n = n * 2 + x
        return n
    return inner

f = maker(3)
print(f(2), f(1), f(0))`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '8 17 34',
    acceptedAnswers: ['8 17 34'],
    keyTakeaway: 'nonlocal n은 maker 함수의 변수 n을 내부 함수에서 갱신합니다. 초기 n=3. f(2) -> 3*2+2=8. f(1) -> 8*2+1=17. f(0) -> 17*2+0=34.',
    steps: [
      {
        stepNumber: 1,
        title: 'f(2) 실행',
        lineHighlight: 8,
        description: 'n = 3 * 2 + 2 = 8 갱신 및 반환.',
        memoryState: [
          { address: '1000번지 (Closure)', name: 'n', value: '8', isChanged: true, scope: 'Closure' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'f(1) 및 f(0) 실행',
        lineHighlight: 8,
        description: 'f(1) -> 8 * 2 + 1 = 17. f(0) -> 17 * 2 + 0 = 34.',
        memoryState: [
          { address: '1000번지 (Closure)', name: 'n', value: '34', isChanged: true, scope: 'Closure' }
        ],
        consoleOutput: '8 17 34'
      }
    ]
  },
  {
    id: 'code-py-011',
    language: 'PYTHON',
    difficulty: '상',
    title: '다중 정렬 키 람다식(점수 내림차순, 순번 오름차순)',
    topic: '람다 정렬과 다중 키',
    tags: ['람다', 'sort', '튜플키'],
    code: `scores = [('Kim', 85, 2), ('Lee', 90, 1), ('Park', 85, 1), ('Choi', 90, 2)]
scores.sort(key=lambda x: (-x[1], x[2]))
print(" ".join(x[0] for x in scores))`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'Lee Choi Park Kim',
    acceptedAnswers: ['Lee Choi Park Kim'],
    keyTakeaway: '첫 번째 키(-x[1])로 점수 내림차순, 동점일 때 두 번째 키(x[2])로 순번 오름차순: 90점(Lee, Choi) -> 85점(Park, Kim). 결과: "Lee Choi Park Kim".',
    steps: [
      {
        stepNumber: 1,
        title: '다중 키 기준 정렬 수행',
        lineHighlight: 2,
        description: 'Lee(90점, 1번) -> Choi(90점, 2번) -> Park(85점, 1번) -> Kim(85점, 2번).',
        memoryState: [
          { address: '2000번지', name: 'scores', value: '[Lee, Choi, Park, Kim]', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: 'Lee Choi Park Kim'
      }
    ]
  },
  {
    id: 'code-py-012',
    language: 'PYTHON',
    difficulty: '최상',
    title: '별표 언패킹(*b)과 리스트 슬라이스 대입 치환',
    topic: '언패킹과 슬라이스 할당',
    tags: ['언패킹', '슬라이스치환', '리스트'],
    code: `a, *b, c = [10, 20, 30, 40, 50, 60]
b[1:3] = [99]
print(f"{a} {b} {c}")`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '10 [20, 99, 50] 60',
    acceptedAnswers: ['10 [20, 99, 50] 60'],
    keyTakeaway: 'a=10, c=60, b=[20, 30, 40, 50]. b[1:3]=[99]는 인덱스 1과 2(30, 40)의 두 원소를 [99] 하나의 원소로 치환하므로 b는 [20, 99, 50]이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'a, *b, c 별표 언패킹',
        lineHighlight: 1,
        description: 'a=10, c=60, b=[20, 30, 40, 50].',
        memoryState: [
          { address: '1000번지', name: 'a', value: '10', scope: 'Global' },
          { address: '1004번지', name: 'b', value: '[20, 30, 40, 50]', scope: 'Global' },
          { address: '1008번지', name: 'c', value: '60', scope: 'Global' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'b[1:3] = [99] 슬라이스 치환',
        lineHighlight: 2,
        description: '인덱스 1~2(30, 40)가 99로 대체되어 b=[20, 99, 50].',
        memoryState: [
          { address: '1004번지', name: 'b', value: '[20, 99, 50]', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: '10 [20, 99, 50] 60'
      }
    ]
  },
  {
    id: 'code-py-013',
    language: 'PYTHON',
    difficulty: '상',
    title: '클래스 변수와 인스턴스 변수 이름 충돌 탐색 순서',
    topic: '클래스 변수 vs 인스턴스 변수',
    tags: ['클래스변수', '네임스페이스', '객체지향'],
    code: `class Item:
    count = 0
    def __init__(self):
        Item.count += 1
        self.count = 10

a = Item()
b = Item()
print(f"{a.count} {Item.count}")`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '10 2',
    acceptedAnswers: ['10 2'],
    keyTakeaway: 'a.count는 인스턴스 네임스페이스의 self.count(10)를 먼저 찾아 반환합니다. Item.count는 Item() 인스턴스가 2번 생성되면서 클래스 변수가 누적되어 2가 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'a = Item(); b = Item() 생성',
        lineHighlight: 7,
        description: 'Item.count는 2로 증가. a와 b의 인스턴스 변수 self.count는 각자 10으로 저장.',
        memoryState: [
          { address: '1000번지 (Class NS)', name: 'Item.count', value: '2', isChanged: true, scope: 'Class' },
          { address: '2000번지 (Instance NS)', name: 'a.count', value: '10', scope: 'Instance' }
        ],
        consoleOutput: '10 2'
      }
    ]
  },
  {
    id: 'code-py-014',
    language: 'PYTHON',
    difficulty: '최상',
    title: '제너레이터 표현식의 지연 평가와 조건부 sum()',
    topic: '제너레이터와 조건부 집계',
    tags: ['제너레이터', '지연평가', 'sum'],
    code: `nums = [1, 2, 3, 4, 5, 6, 7, 8]
gen = (x ** 2 for x in nums if x % 3 != 0)
print(sum(x for x in gen if x > 20))`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 쓰시오.',
    expectedAnswer: '139',
    acceptedAnswers: ['139'],
    keyTakeaway: 'nums에서 3의 배수(3, 6)를 제외: 1, 2, 4, 5, 7, 8. 제곱: 1, 4, 16, 25, 49, 64. 이 중 20 초과인 원소: 25 + 49 + 64 = 139.',
    steps: [
      {
        stepNumber: 1,
        title: '제너레이터 필터링 및 제곱 계산',
        lineHighlight: 2,
        description: 'x % 3 != 0 필터 통과: 1, 2, 4, 5, 7, 8. 제곱: 1, 4, 16, 25, 49, 64.',
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'x > 20 조건 필터링 및 합산',
        lineHighlight: 3,
        description: '25 + 49 + 64 = 139 출력.',
        memoryState: [],
        consoleOutput: '139'
      }
    ]
  },
  {
    id: 'code-py-015',
    language: 'PYTHON',
    difficulty: '상',
    title: 'zip() 묶기와 딕셔너리 키-값 역인덱싱',
    topic: 'zip과 딕셔너리 역인덱싱',
    tags: ['zip', '딕셔너리', 'get'],
    code: `keys = ['apple', 'banana', 'cherry']
vals = [3, 2, 3]
d = {}
for k, v in zip(keys, vals):
    d[v] = d.get(v, []) + [k]
print(len(d[3]))`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 쓰시오.',
    expectedAnswer: '2',
    acceptedAnswers: ['2'],
    keyTakeaway: 'd에는 값(3, 2)이 키가 됩니다: d[3] = [\'apple\', \'cherry\'], d[2] = [\'banana\']. d[3]의 길이는 2입니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'd 딕셔너리 구성 및 len(d[3]) 계산',
        lineHighlight: 5,
        description: 'd[3]에 \'apple\'과 \'cherry\' 2개가 매핑됨 -> len(d[3]) = 2.',
        memoryState: [
          { address: '2000번지', name: 'd[3]', value: "['apple', 'cherry']", scope: 'Global' }
        ],
        consoleOutput: '2'
      }
    ]
  },
  {
    id: 'code-py-016',
    language: 'PYTHON',
    difficulty: '상',
    title: '세트 대칭차집합(^)과 교집합(&)의 체이닝 연산',
    topic: '집합 연산자 우선순위',
    tags: ['세트', '대칭차집합', '교집합'],
    code: `s1 = { 1, 2, 3, 4, 5 }
s2 = { 4, 5, 6, 7 }
s3 = { 2, 4, 6, 8 }
res = (s1 ^ s2) & s3
print(sorted(list(res)))`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 리스트 형식으로 쓰시오.',
    expectedAnswer: '[2, 6]',
    acceptedAnswers: ['[2, 6]'],
    keyTakeaway: 's1 ^ s2 대칭차집합 = {1, 2, 3, 6, 7}. 여기에 s3({2, 4, 6, 8})와의 교집합(&)을 구하면 {2, 6}이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 's1 ^ s2 대칭차집합 계산',
        lineHighlight: 4,
        description: '공통인 4, 5를 제외한 {1, 2, 3, 6, 7}.',
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '& s3 교집합 및 정렬 출력',
        lineHighlight: 5,
        description: '{1, 2, 3, 6, 7}과 {2, 4, 6, 8}의 교집합은 {2, 6}. 정렬 후 [2, 6] 출력.',
        memoryState: [
          { address: '2000번지', name: 'res', value: '{2, 6}', scope: 'Global' }
        ],
        consoleOutput: '[2, 6]'
      }
    ]
  },
  {
    id: 'code-py-017',
    language: 'PYTHON',
    difficulty: '상',
    title: 'try-except-else-finally 실행 제어 흐름',
    topic: '예외 처리 제어문 else/finally',
    tags: ['try-except', 'else', 'finally'],
    code: `out = []
try:
    out.append('T')
    x = 10 / 2
except ZeroDivisionError:
    out.append('E')
else:
    out.append('L')
finally:
    out.append('F')
print("".join(out))`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 쓰시오.',
    expectedAnswer: 'TLF',
    acceptedAnswers: ['TLF'],
    keyTakeaway: 'try에서 예외가 발생하지 않으면 except는 건너뛰고 else 블록이 실행됩니다. 마지막에 finally가 항상 실행되므로 \'T\' -> \'L\' -> \'F\' 순으로 결합되어 "TLF"가 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'try 블록 성공 및 else 블록 실행',
        lineHighlight: 7,
        description: '10/2 정상 계산으로 except 건너뛰고 else 실행 -> [\'T\', \'L\'].',
        memoryState: [
          { address: '1000번지', name: 'out', value: "['T', 'L']", isChanged: true, scope: 'Global' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'finally 블록 실행 및 출력',
        lineHighlight: 10,
        description: 'finally에서 \'F\' 추가 -> "TLF" 출력.',
        memoryState: [
          { address: '1000번지', name: 'out', value: "['T', 'L', 'F']", isChanged: true, scope: 'Global' }
        ],
        consoleOutput: 'TLF'
      }
    ]
  },
  {
    id: 'code-py-018',
    language: 'PYTHON',
    difficulty: '최상',
    title: '양 끝 슬라이싱을 이용한 재귀적 회문(Palindrome) 판별',
    topic: '재귀 함수와 문자열 슬라이싱',
    tags: ['재귀', '회문', '슬라이싱'],
    code: `def is_pal(s):
    if len(s) <= 1: return 1
    if s[0] != s[-1]: return 0
    return is_pal(s[1:-1])

print(is_pal("RADAR"), is_pal("ROBOT"))`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '1 0',
    acceptedAnswers: ['1 0'],
    keyTakeaway: '"RADAR"는 양 끝 글자가 같아 재귀를 통과하므로 회문(1). "ROBOT"는 첫 글자 \'R\'과 끝 글자 \'T\'가 달라 첫 단계에서 0을 반환합니다. 결과: "1 0".',
    steps: [
      {
        stepNumber: 1,
        title: 'is_pal("RADAR") 재귀 호출',
        lineHighlight: 4,
        description: 'R==R -> is_pal("ADA") -> A==A -> is_pal("D") -> 길이 1 기저조건 만족으로 1 반환.',
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'is_pal("ROBOT") 호출 및 출력',
        lineHighlight: 3,
        description: 'R != T 이므로 즉시 0 반환. 출력: "1 0".',
        memoryState: [],
        consoleOutput: '1 0'
      }
    ]
  },
  {
    id: 'code-py-019',
    language: 'PYTHON',
    difficulty: '최상',
    title: '리스트 얕은 복사(Shallow Copy)에서의 중첩 하위 객체 참조 공유',
    topic: '얕은 복사와 중첩 리스트',
    tags: ['얕은복사', '리스트', '참조공유'],
    code: `a = [[1, 2], [3, 4]]
b = list(a)
b[0].append(99)
b.append([5, 6])
print(f"{len(a[0])} {len(a)}")`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '3 2',
    acceptedAnswers: ['3 2'],
    keyTakeaway: 'list(a)는 최상위 리스트만 새로 만들고 내부 원소인 [1, 2]는 같은 객체 주소를 공유합니다. b[0].append(99)는 a[0]도 변경시켜 len(a[0])은 3이 됩니다. 반면 b.append([5,6])는 b에만 추가되므로 len(a)는 그대로 2입니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'b = list(a) 얕은 복사 및 b[0].append(99)',
        lineHighlight: 3,
        description: 'a[0]과 b[0]이 동일한 3000번지 리스트를 가리키므로 a[0]도 [1, 2, 99]로 늘어남(길이 3).',
        memoryState: [
          { address: '3000번지 (공유)', name: 'a[0] / b[0]', value: '[1, 2, 99]', isChanged: true, scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'b.append([5, 6]) 및 길이 출력',
        lineHighlight: 4,
        description: 'b에는 새 원소가 추가되어 len(b)=3이지만 a에는 추가되지 않아 len(a)=2. 출력: "3 2".',
        memoryState: [],
        consoleOutput: '3 2'
      }
    ]
  },
  {
    id: 'code-py-020',
    language: 'PYTHON',
    difficulty: '상',
    title: 'enumerate() start=1 옵션과 가중 누적합',
    topic: 'enumerate 함수와 인덱스 연산',
    tags: ['enumerate', '가중치합', '루프'],
    code: `arr = [10, 20, 30, 40]
total = sum(val * idx for idx, val in enumerate(arr, start=1))
print(total)`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 쓰시오.',
    expectedAnswer: '300',
    acceptedAnswers: ['300'],
    keyTakeaway: 'start=1 옵션에 의해 idx는 1, 2, 3, 4가 됩니다: 10*1 + 20*2 + 30*3 + 40*4 = 10 + 40 + 90 + 160 = 300.',
    steps: [
      {
        stepNumber: 1,
        title: 'start=1 가중치 연산',
        lineHighlight: 2,
        description: '10*1=10, 20*2=40, 30*3=90, 40*4=160. 합계 = 300.',
        memoryState: [
          { address: '1000번지', name: 'total', value: '300', scope: 'Global' }
        ],
        consoleOutput: '300'
      }
    ]
  },
  {
    id: 'code-py-021',
    language: 'PYTHON',
    difficulty: '상',
    title: 'all()과 any()의 거짓(Falsy) 원소 슬라이스 판별',
    topic: '논리 함수 all과 any',
    tags: ['all', 'any', 'Falsy'],
    code: `data = [0, '', [], False, 1]
print(f"{any(data)} {all(data[:4])} {any(data[1:3])}")`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'True False False',
    acceptedAnswers: ['True False False'],
    keyTakeaway: 'data에 참인 정수 1이 있으므로 any(data)는 True. data[:4]는 전부 Falsy(0, \'\', [], False)이므로 all은 False. data[1:3](\'\', []) 역시 둘 다 거짓이므로 any는 False입니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'all/any 논리 평가 및 출력',
        lineHighlight: 2,
        description: 'any(data)->True, all(data[:4])->False, any(data[1:3])->False. 출력: "True False False".',
        memoryState: [],
        consoleOutput: 'True False False'
      }
    ]
  },
  {
    id: 'code-py-022',
    language: 'PYTHON',
    difficulty: '최상',
    title: 'zip(*m)을 이용한 2차원 행렬 전치(Transpose)와 인덱싱',
    topic: '행렬 전치와 zip 언패킹',
    tags: ['zip', '언패킹', '전치행렬'],
    code: `m = [[1, 2, 3], [4, 5, 6]]
t = list(map(list, zip(*m)))
print(t[1][0], t[2][1])`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '2 6',
    acceptedAnswers: ['2 6'],
    keyTakeaway: 'zip(*m)은 행과 열을 맞바꿔 전치 행렬 t = [[1, 4], [2, 5], [3, 6]]를 만듭니다. t[1][0]은 2, t[2][1]은 6입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '전치 행렬 t 생성',
        lineHighlight: 2,
        description: 't = [[1, 4], [2, 5], [3, 6]].',
        memoryState: [
          { address: '2000번지', name: 't', value: '[[1, 4], [2, 5], [3, 6]]', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 't[1][0] 및 t[2][1] 출력',
        lineHighlight: 3,
        description: 't[1][0]=2, t[2][1]=6. 출력: "2 6".',
        memoryState: [],
        consoleOutput: '2 6'
      }
    ]
  },
  {
    id: 'code-py-023',
    language: 'PYTHON',
    difficulty: '상',
    title: '문자열 구분자 분리, 슬라이스 역순 및 join 체이닝',
    topic: '문자열 split, slice, join',
    tags: ['split', 'join', '역순슬라이싱'],
    code: `text = "2026-INFO-GISA-PASS"
parts = text.split("-")[1:3]
print("_".join(parts[::-1]))`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 쓰시오.',
    expectedAnswer: 'GISA_INFO',
    acceptedAnswers: ['GISA_INFO'],
    keyTakeaway: 'text.split("-")는 [\'2026\', \'INFO\', \'GISA\', \'PASS\']. [1:3]으로 자르면 [\'INFO\', \'GISA\']. 역순 슬라이싱 parts[::-1]은 [\'GISA\', \'INFO\']. \'_\'.join()으로 연결하여 \'GISA_INFO\'.',
    steps: [
      {
        stepNumber: 1,
        title: 'split 및 부분 슬라이스 추출',
        lineHighlight: 2,
        description: 'parts = [\'INFO\', \'GISA\'].',
        memoryState: [
          { address: '1000번지', name: 'parts', value: "['INFO', 'GISA']", scope: 'Global' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '역순 정렬 및 join 결합 출력',
        lineHighlight: 3,
        description: '\'GISA_INFO\' 출력.',
        memoryState: [],
        consoleOutput: 'GISA_INFO'
      }
    ]
  },

  // =========================================================================
  // [SQL] 15 High-Difficulty Problems (code-sql-006 ~ code-sql-020)
  // =========================================================================
  {
    id: 'code-sql-006',
    language: 'SQL',
    difficulty: '최상',
    title: 'GROUP BY와 HAVING 절에서 COUNT(*) vs COUNT(컬럼)의 NULL 함정',
    topic: 'GROUP BY와 HAVING 집계',
    tags: ['GROUP BY', 'HAVING', 'COUNT', 'NULL'],
    code: `-- EMP 테이블
-- EMPNO | DEPT | BONUS
-- 101   | D1   | 500
-- 102   | D1   | NULL
-- 103   | D1   | 300
-- 104   | D2   | NULL
-- 105   | D2   | 400

SELECT DEPT, COUNT(*) AS TOTAL_CNT, COUNT(BONUS) AS BONUS_CNT
FROM EMP
GROUP BY DEPT
HAVING COUNT(BONUS) >= 2;`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(DEPT, TOTAL_CNT, BONUS_CNT)를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'D1 3 2',
    acceptedAnswers: ['D1 3 2'],
    keyTakeaway: 'COUNT(*)은 NULL을 포함하여 전체 행을 세지만, COUNT(BONUS)는 BONUS가 NULL인 행을 제외합니다. D1의 BONUS_CNT는 2(101, 103), D2는 1(105). HAVING COUNT(BONUS) >= 2 조건에 의해 D1 부서만 조회됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '부서별 그룹화 및 개수 집계',
        lineHighlight: 10,
        description: 'D1: 총 3행, BONUS 존재 2건. D2: 총 2행, BONUS 존재 1건.',
        sqlTableState: {
          tableName: 'GROUP BY 집계 중간 상태',
          columns: ['DEPT', 'COUNT(*)', 'COUNT(BONUS)'],
          rows: [
            ['D1', 3, 2],
            ['D2', 2, 1]
          ]
        },
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'HAVING COUNT(BONUS) >= 2 필터링 및 최종 출력',
        lineHighlight: 12,
        description: 'D1만 조건 만족. 최종 결과: D1 3 2.',
        sqlTableState: {
          tableName: '최종 결과셋',
          columns: ['DEPT', 'TOTAL_CNT', 'BONUS_CNT'],
          rows: [['D1', 3, 2]]
        },
        memoryState: [],
        consoleOutput: 'D1 3 2'
      }
    ]
  },
  {
    id: 'code-sql-007',
    language: 'SQL',
    difficulty: '최상',
    title: '상관 서브쿼리와 NOT EXISTS를 활용한 미수강생 차집합 추출',
    topic: '상관 서브쿼리 NOT EXISTS',
    tags: ['상관서브쿼리', 'NOT EXISTS', '안티조인'],
    code: `-- 학생(STUDENT): (1, '김'), (2, '이'), (3, '박')
-- 수강(COURSE): (1, '자바'), (1, 'SQL'), (2, '자바')

SELECT S.NAME
FROM STUDENT S
WHERE NOT EXISTS (
    SELECT 1
    FROM COURSE C
    WHERE C.SID = S.SID AND C.SUBJECT = 'SQL'
);`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(NAME)를 각 줄에 쓰시오.',
    expectedAnswer: '이\n박',
    acceptedAnswers: ['이\n박', '이, 박', '이 박'],
    keyTakeaway: '학생 1(김)은 \'SQL\' 수강 내역이 존재(EXISTS 참)하므로 NOT EXISTS는 거짓이 되어 제외됩니다. 2(이)와 3(박)은 SQL 수강 내역이 없으므로(EXISTS 거짓) NOT EXISTS가 참이 되어 조회됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '각 학생별 상관 서브쿼리 평가',
        lineHighlight: 7,
        description: '1번(김): SQL 수강 존재 -> 제외. 2번(이): SQL 미수강 -> 포함. 3번(박): 수강 없음 -> 포함.',
        sqlTableState: {
          tableName: '학생별 서브쿼리 매칭 결과',
          columns: ['SID', 'NAME', 'EXISTS(SQL 수강)', 'NOT EXISTS'],
          rows: [
            [1, '김', 'TRUE', 'FALSE (제외)'],
            [2, '이', 'FALSE', 'TRUE (포함)'],
            [3, '박', 'FALSE', 'TRUE (포함)']
          ]
        },
        memoryState: [],
        consoleOutput: '이\n박'
      }
    ]
  },
  {
    id: 'code-sql-008',
    language: 'SQL',
    difficulty: '최상',
    title: '윈도우 순위 함수 DENSE_RANK() vs RANK() 동점자 순위',
    topic: '윈도우 순위 함수',
    tags: ['RANK', 'DENSE_RANK', '동점자순위'],
    code: `-- SCORE_TBL 테이블
-- NAME | SCORE
-- 김   | 95
-- 이   | 90
-- 박   | 90
-- 최   | 85
-- 정   | 80

SELECT NAME,
       RANK() OVER (ORDER BY SCORE DESC) AS R,
       DENSE_RANK() OVER (ORDER BY SCORE DESC) AS DR
FROM SCORE_TBL
WHERE NAME = '최';`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(NAME, R, DR)를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '최 4 3',
    acceptedAnswers: ['최 4 3'],
    keyTakeaway: '95점이 1등, 90점이 2명(공동 2등)입니다. RANK()는 공동 2등 수만큼 건너뛰어 최를 4등으로 매깁니다. DENSE_RANK()는 순위를 건너뛰지 않고 3등으로 매깁니다. 결과: "최 4 3".',
    steps: [
      {
        stepNumber: 1,
        title: '전체 점수 정렬 및 순위 함수 계산',
        lineHighlight: 10,
        description: '김(95): R=1, DR=1. 이(90): R=2, DR=2. 박(90): R=2, DR=2. 최(85): R=4, DR=3. 정(80): R=5, DR=4.',
        sqlTableState: {
          tableName: '순위 산출 테이블',
          columns: ['NAME', 'SCORE', 'RANK (R)', 'DENSE_RANK (DR)'],
          rows: [
            ['김', 95, 1, 1],
            ['이', 90, 2, 2],
            ['박', 90, 2, 2],
            ['최', 85, 4, 3],
            ['정', 80, 5, 4]
          ]
        },
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'WHERE NAME = \'최\' 필터링',
        lineHighlight: 13,
        description: '최 4 3 출력.',
        memoryState: [],
        consoleOutput: '최 4 3'
      }
    ]
  },
  {
    id: 'code-sql-009',
    language: 'SQL',
    difficulty: '상',
    title: 'LEFT OUTER JOIN과 IS NULL을 결합한 차집합 부서 검출',
    topic: '외부 조인과 안티 조인',
    tags: ['LEFT JOIN', 'IS NULL', '차집합'],
    code: `-- 부서(DEPT): (10, '개발'), (20, '인사'), (30, '영업')
-- 사원(EMP): (101, '김', 10), (102, '이', 10), (103, '박', 20)

SELECT D.DNAME
FROM DEPT D
LEFT JOIN EMP E ON D.DEPTNO = E.DEPTNO
WHERE E.EMPNO IS NULL;`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(DNAME)를 쓰시오.',
    expectedAnswer: '영업',
    acceptedAnswers: ['영업'],
    keyTakeaway: 'LEFT JOIN 시 소속 사원이 없는 영업(30) 부서는 오른쪽 EMP 컬럼들이 NULL로 채워집니다. WHERE E.EMPNO IS NULL 조건에 의해 사원이 0명인 \'영업\' 부서만 조회됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'LEFT OUTER JOIN 결합 행 생성',
        lineHighlight: 6,
        description: '개발(101, 102 매칭), 인사(103 매칭), 영업(매칭 사원 없어 E.EMPNO = NULL).',
        sqlTableState: {
          tableName: 'LEFT JOIN 중간 결과',
          columns: ['DEPTNO', 'DNAME', 'EMPNO', 'ENAME'],
          rows: [
            [10, '개발', 101, '김'],
            [10, '개발', 102, '이'],
            [20, '인사', 103, '박'],
            [30, '영업', 'NULL', 'NULL']
          ]
        },
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'WHERE E.EMPNO IS NULL 필터링',
        lineHighlight: 7,
        description: '\'영업\' 출력.',
        memoryState: [],
        consoleOutput: '영업'
      }
    ]
  },
  {
    id: 'code-sql-010',
    language: 'SQL',
    difficulty: '상',
    title: 'COALESCE 함수와 NULL 산술 연산 방어 합계',
    topic: 'COALESCE와 NULL 연산',
    tags: ['COALESCE', 'NULL처리', 'SUM'],
    code: `-- 주문(ORDERS):
-- ID | PRICE | DISCOUNT
-- 1  | 100   | 20
-- 2  | 200   | NULL
-- 3  | NULL  | 50

SELECT SUM(COALESCE(PRICE, 0) - COALESCE(DISCOUNT, 0)) AS NET_TOTAL
FROM ORDERS;`,
    questionPrompt: '다음 SQL 문의 최종 실행 결과 숫자를 쓰시오.',
    expectedAnswer: '230',
    acceptedAnswers: ['230'],
    keyTakeaway: 'NULL에 산술 연산을 하면 결과가 NULL이 되므로 COALESCE로 0을 대체합니다: 1행(100 - 20 = 80), 2행(200 - 0 = 200), 3행(0 - 50 = -50). 전체 합: 80 + 200 - 50 = 230.',
    steps: [
      {
        stepNumber: 1,
        title: '행별 COALESCE 평가 및 차감 계산',
        lineHighlight: 7,
        description: '1번 주문: 80, 2번 주문: 200, 3번 주문: -50.',
        sqlTableState: {
          tableName: '행별 실 결제액',
          columns: ['ID', 'PRICE', 'DISCOUNT', 'NET_CALC'],
          rows: [
            [1, 100, 20, 80],
            [2, 200, 'NULL->0', 200],
            [3, 'NULL->0', 50, -50]
          ]
        },
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'SUM(NET_CALC) 집계 및 출력',
        lineHighlight: 8,
        description: '80 + 200 - 50 = 230 출력.',
        memoryState: [],
        consoleOutput: '230'
      }
    ]
  },
  {
    id: 'code-sql-011',
    language: 'SQL',
    difficulty: '최상',
    title: '자기 참조 조인(Self-Join)을 통한 관리자보다 급여가 높은 사원 검출',
    topic: 'Self-Join 계층 비교',
    tags: ['Self-Join', '계층조인', '조건필터'],
    code: `-- 사원(EMP):
-- EMPNO | ENAME | MGR  | SAL
-- 1     | 김    | NULL | 5000
-- 2     | 이    | 1    | 6000
-- 3     | 박    | 1    | 4500

SELECT E.ENAME
FROM EMP E
JOIN EMP M ON E.MGR = M.EMPNO
WHERE E.SAL > M.SAL;`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(ENAME)를 쓰시오.',
    expectedAnswer: '이',
    acceptedAnswers: ['이'],
    keyTakeaway: '사원 이(6000)는 자신의 직속 관리자 김(5000)보다 급여가 높으므로 조건을 만족합니다. 사원 박(4500)은 관리자 김(5000)보다 낮으므로 제외됩니다. 결과: \'이\'.',
    steps: [
      {
        stepNumber: 1,
        title: '사원(E)과 관리자(M) Self-Join 매핑',
        lineHighlight: 8,
        description: '사원 이(급여 6000) -> 관리자 김(급여 5000). 사원 박(급여 4500) -> 관리자 김(급여 5000).',
        sqlTableState: {
          tableName: 'Self-Join 비교 테이블',
          columns: ['사원명', '사원급여(E.SAL)', '관리자명', '관리자급여(M.SAL)', 'E.SAL > M.SAL'],
          rows: [
            ['이', 6000, '김', 5000, 'TRUE (조회)'],
            ['박', 4500, '김', 5000, 'FALSE (제외)']
          ]
        },
        memoryState: [],
        consoleOutput: '이'
      }
    ]
  },
  {
    id: 'code-sql-012',
    language: 'SQL',
    difficulty: '상',
    title: 'UNION vs UNION ALL 중복 제거 건수 차이',
    topic: '집합 연산자 중복 처리',
    tags: ['UNION', 'UNION ALL', '중복제거'],
    code: `-- T1 테이블: { 10, 20, 20, 30 } (4행)
-- T2 테이블: { 20, 30, 40 } (3행)

SELECT COUNT(*) FROM (
    SELECT NUM FROM T1
    UNION
    SELECT NUM FROM T2
);`,
    questionPrompt: '다음 SQL 문의 최종 결과 숫자를 쓰시오.',
    expectedAnswer: '4',
    acceptedAnswers: ['4'],
    keyTakeaway: 'UNION은 두 집합을 합친 뒤 중복을 제거합니다. 10, 20, 30, 40의 4개 고유 값만 남으므로 COUNT(*)는 4입니다. (참고로 UNION ALL은 4 + 3 = 7행).',
    steps: [
      {
        stepNumber: 1,
        title: 'UNION 연산 및 중복 제거',
        lineHighlight: 5,
        description: '고유 원소 집합: { 10, 20, 30, 40 } (총 4행).',
        sqlTableState: {
          tableName: 'UNION 결과셋',
          columns: ['NUM'],
          rows: [[10], [20], [30], [40]]
        },
        memoryState: [],
        consoleOutput: '4'
      }
    ]
  },
  {
    id: 'code-sql-013',
    language: 'SQL',
    difficulty: '최상',
    title: 'SELECT 절 스칼라 서브쿼리와 부서별 평균 급여 계산',
    topic: '스칼라 서브쿼리',
    tags: ['스칼라', '서브쿼리', 'AVG'],
    code: `-- DEPT: (10, '개발'), (20, '인사')
-- EMP: (1, 10, 300), (2, 10, 500), (3, 20, 400)
-- 컬럼: EMPNO, DEPTNO, SAL

SELECT D.DNAME,
       (SELECT AVG(E.SAL) FROM EMP E WHERE E.DEPTNO = D.DEPTNO) AS AVG_SAL
FROM DEPT D
WHERE D.DEPTNO = 10;`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(DNAME, AVG_SAL)를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '개발 400',
    acceptedAnswers: ['개발 400'],
    keyTakeaway: '부서 10(\'개발\')에 소속된 사원의 급여는 300과 500입니다. 스칼라 서브쿼리는 이 둘의 평균 (300 + 500) / 2 = 400을 단일 값으로 반환하여 \'개발 400\'이 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'WHERE DEPTNO=10 및 스칼라 서브쿼리 실행',
        lineHighlight: 6,
        description: '부서 10의 EMP 급여 목록: [300, 500] -> AVG = 400.',
        sqlTableState: {
          tableName: '스칼라 서브쿼리 결과',
          columns: ['DNAME', 'AVG_SAL'],
          rows: [['개발', 400]]
        },
        memoryState: [],
        consoleOutput: '개발 400'
      }
    ]
  },
  {
    id: 'code-sql-014',
    language: 'SQL',
    difficulty: '상',
    title: 'INSTR과 SUBSTR 함수의 조합으로 문자열 가변 토큰 추출',
    topic: '문자열 내장 함수',
    tags: ['INSTR', 'SUBSTR', '문자열함수'],
    code: `SELECT SUBSTR('INFOGISA-2026-PASS', INSTR('INFOGISA-2026-PASS', '-') + 1, 4) AS YEAR
FROM DUAL;`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(YEAR)를 쓰시오.',
    expectedAnswer: '2026',
    acceptedAnswers: ['2026'],
    keyTakeaway: 'INSTR(\'INFOGISA-2026-PASS\', \'-\')는 첫 번째 \'-\'의 1-based 인덱스인 9를 반환합니다. +1 하면 10번째 위치(\'2\')부터 시작하여 4글자를 잘라내므로 \'2026\'이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'INSTR 위치 탐색',
        lineHighlight: 1,
        description: '\'-\'가 처음 나타나는 위치는 9. 9 + 1 = 10.',
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'SUBSTR(..., 10, 4) 추출',
        lineHighlight: 1,
        description: '10번째 자리부터 4글자 추출 -> \'2026\'.',
        memoryState: [],
        consoleOutput: '2026'
      }
    ]
  },
  {
    id: 'code-sql-015',
    language: 'SQL',
    difficulty: '상',
    title: 'NULLIF와 COALESCE를 조합한 0 나누기 오류 방어 계산',
    topic: 'NULLIF와 조건부 계산',
    tags: ['NULLIF', 'COALESCE', '산술연산'],
    code: `-- TBL 테이블:
-- A   | B
-- 100 | 0
-- 200 | 50

SELECT SUM(A / COALESCE(NULLIF(B, 0), 1)) AS RES
FROM TBL;`,
    questionPrompt: '다음 SQL 문의 최종 결과 숫자를 쓰시오.',
    expectedAnswer: '104',
    acceptedAnswers: ['104'],
    keyTakeaway: 'NULLIF(B, 0)은 B가 0일 때 NULL을 반환합니다. COALESCE는 NULL을 1로 대체하여 0 나누기를 방지합니다: 1행(100 / 1 = 100), 2행(200 / 50 = 4). SUM = 100 + 4 = 104.',
    steps: [
      {
        stepNumber: 1,
        title: '행별 NULLIF 및 COALESCE 나눗셈',
        lineHighlight: 7,
        description: '1행: NULLIF(0, 0)=NULL -> COALESCE로 1 -> 100 / 1 = 100. 2행: 200 / 50 = 4.',
        sqlTableState: {
          tableName: '행별 나눗셈 결과',
          columns: ['A', 'B', 'COALESCE(NULLIF(B,0),1)', '계산값'],
          rows: [
            [100, 0, 1, 100],
            [200, 50, 50, 4]
          ]
        },
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'SUM(계산값) 집계',
        lineHighlight: 7,
        description: '100 + 4 = 104 출력.',
        memoryState: [],
        consoleOutput: '104'
      }
    ]
  },
  {
    id: 'code-sql-016',
    language: 'SQL',
    difficulty: '최상',
    title: 'ROLLUP 다차원 소계와 총계 생성 행 수 계산',
    topic: 'ROLLUP 그룹 함수',
    tags: ['ROLLUP', '소계', '총계'],
    code: `-- SALES 테이블: (서울, 강남, 10), (서울, 강동, 20), (부산, 해운대, 30)
-- REGION | SUB_REGION | QTY

SELECT REGION, SUB_REGION, SUM(QTY)
FROM SALES
GROUP BY ROLLUP(REGION, SUB_REGION);`,
    questionPrompt: '다음 SQL 문의 최종 결과로 반환되는 전체 행(Row) 수를 숫자로 쓰시오.',
    expectedAnswer: '6',
    acceptedAnswers: ['6', '6행'],
    keyTakeaway: 'ROLLUP(A, B)는 (A, B) 상세 레벨 3행 + (A) 지역별 소계 2행(서울, 부산) + () 전체 총계 1행으로 총 3 + 2 + 1 = 6행이 생성됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'ROLLUP 계층별 그룹 집계',
        lineHighlight: 5,
        description: '상세(서울-강남 10, 서울-강동 20, 부산-해운대 30: 3행) + 소계(서울 30, 부산 30: 2행) + 총계(60: 1행) = 총 6행.',
        sqlTableState: {
          tableName: 'ROLLUP 결과 테이블',
          columns: ['REGION', 'SUB_REGION', 'SUM(QTY)', '계층 구분'],
          rows: [
            ['서울', '강남', 10, '상세'],
            ['서울', '강동', 20, '상세'],
            ['부산', '해운대', 30, '상세'],
            ['서울', 'NULL', 30, '지역 소계'],
            ['부산', 'NULL', 30, '지역 소계'],
            ['NULL', 'NULL', 60, '전체 총계']
          ]
        },
        memoryState: [],
        consoleOutput: '6'
      }
    ]
  },
  {
    id: 'code-sql-017',
    language: 'SQL',
    difficulty: '상',
    title: 'INTERSECT 교집합 연산자를 활용한 공통 활성 사용자 추출',
    topic: 'INTERSECT 집합 연산자',
    tags: ['INTERSECT', '교집합', '중복제거'],
    code: `-- WEB_USER: { 'U1', 'U2', 'U3' }
-- APP_USER: { 'U2', 'U3', 'U4' }

SELECT USER_ID FROM WEB_USER
INTERSECT
SELECT USER_ID FROM APP_USER;`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(USER_ID)를 각 줄에 쓰시오.',
    expectedAnswer: 'U2\nU3',
    acceptedAnswers: ['U2\nU3', 'U2, U3', 'U2 U3'],
    keyTakeaway: 'INTERSECT는 두 쿼리의 결과셋에서 공통으로 존재하는 행만 중복 없이 반환합니다. 양쪽 모두에 존재하는 ID는 \'U2\'와 \'U3\'입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '교집합 도출',
        lineHighlight: 3,
        description: 'WEB_USER와 APP_USER의 공통 원소: U2, U3.',
        sqlTableState: {
          tableName: 'INTERSECT 결과',
          columns: ['USER_ID'],
          rows: [['U2'], ['U3']]
        },
        memoryState: [],
        consoleOutput: 'U2\nU3'
      }
    ]
  },
  {
    id: 'code-sql-018',
    language: 'SQL',
    difficulty: '상',
    title: 'CASE WHEN 조건 분기 표현식과 등급 산출',
    topic: 'CASE WHEN 조건문',
    tags: ['CASE', '조건표현식', '등급'],
    code: `SELECT SCORE,
       CASE WHEN SCORE >= 90 THEN 'A'
            WHEN SCORE >= 80 THEN 'B'
            ELSE 'C' END AS GRADE
FROM (SELECT 85 AS SCORE FROM DUAL);`,
    questionPrompt: '다음 SQL 문의 최종 결과(SCORE, GRADE)를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '85 B',
    acceptedAnswers: ['85 B'],
    keyTakeaway: '85점은 첫 번째 조건(>= 90)을 만족하지 않고, 두 번째 조건(>= 80)을 만족하므로 \'B\'가 반환되어 \'85 B\'가 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'CASE 식 순차 평가',
        lineHighlight: 2,
        description: '85 >= 90(거짓) -> 85 >= 80(참) -> \'B\' 반환.',
        sqlTableState: {
          tableName: '결과',
          columns: ['SCORE', 'GRADE'],
          rows: [[85, 'B']]
        },
        memoryState: [],
        consoleOutput: '85 B'
      }
    ]
  },
  {
    id: 'code-sql-019',
    language: 'SQL',
    difficulty: '상',
    title: 'CROSS JOIN 데카르트 곱과 OR 제외 조건 필터링',
    topic: 'CROSS JOIN과 카티션 프로덕트',
    tags: ['CROSS JOIN', '카티션곱', '조건필터'],
    code: `-- T1 테이블 (A, B) (2행)
-- T2 테이블 (1, 2, 3) (3행)

SELECT COUNT(*)
FROM T1 CROSS JOIN T2
WHERE T1.VAL != 'A' OR T2.NUM != 1;`,
    questionPrompt: '다음 SQL 문의 최종 결과 숫자를 쓰시오.',
    expectedAnswer: '5',
    acceptedAnswers: ['5'],
    keyTakeaway: '2 * 3 = 총 6개의 조합((A,1), (A,2), (A,3), (B,1), (B,2), (B,3)) 중 (A, 1)만 조건(VAL!=\'A\' OR NUM!=1)을 만족하지 못합니다(거짓 OR 거짓 = 거짓). 나머지 5개 쌍은 통과하므로 5입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '6개 카티션 쌍 조건 검사',
        lineHighlight: 5,
        description: '(A, 1)만 제외되고 나머지 5쌍(A-2, A-3, B-1, B-2, B-3) 조건 만족.',
        memoryState: [],
        consoleOutput: '5'
      }
    ]
  },
  {
    id: 'code-sql-020',
    language: 'SQL',
    difficulty: '상',
    title: 'MOD 나머지 함수와 GROUP BY를 활용한 홀수 합계 집계',
    topic: 'MOD 나머지 함수와 그룹화',
    tags: ['MOD', 'GROUP BY', 'HAVING'],
    code: `-- NUM_TBL: 1, 2, 3, 4, 5, 6
SELECT MOD(NUM, 2) AS REM, SUM(NUM) AS S
FROM NUM_TBL
GROUP BY MOD(NUM, 2)
HAVING MOD(NUM, 2) = 1;`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(REM, S)를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '1 9',
    acceptedAnswers: ['1 9'],
    keyTakeaway: 'MOD(NUM, 2)가 1인 홀수 그룹(1, 3, 5)의 나머지 REM은 1이고, 이들의 합계는 1 + 3 + 5 = 9입니다. 결과: "1 9".',
    steps: [
      {
        stepNumber: 1,
        title: 'MOD(NUM, 2) 그룹화 및 HAVING 1 필터',
        lineHighlight: 5,
        description: '홀수 그룹(1, 3, 5)의 나머지 1, 합계 9. 출력: "1 9".',
        sqlTableState: {
          tableName: '홀수 그룹 집계',
          columns: ['REM', 'S'],
          rows: [[1, 9]]
        },
        memoryState: [],
        consoleOutput: '1 9'
      }
    ]
  }
];
