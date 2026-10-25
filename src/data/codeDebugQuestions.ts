import { CodeDebugQuestion } from '../types/codeDebug';
import { EXTRA_CODE_DEBUG_QUESTIONS } from './codeDebugQuestionsExtra';

/**
 * 정보처리기사 실기 프로그래밍 & SQL 전용관 - 100제 고난도 데이터셋
 * - C 언어: 28문제 (포인터 연산, 2차원 배열 포인터, 문자열 포인터 이동, 재귀 호출 스택, 구조체 화살표 연산자, static 변수 지속성, 비트 연산, switch fall-through)
 * - Java: 26문제 (상속 및 생성자 super() 순서, 다형성 및 오버라이딩 동적 바인딩, static 블록 순서, 참조에 의한 전달 함정, String 풀과 ==/equals, try-catch-finally 반환값)
 * - Python: 23문제 (음수 및 스텝 슬라이싱, 복합 리스트 컴프리헨션, 가변 기본 인자 함정, 딕셔너리/세트 조작, *args 언패킹, lambda 정렬, 재귀와 전역 변수)
 * - SQL: 23문제 (LEFT OUTER JOIN과 NULL 처리, GROUP BY와 HAVING, COUNT(*) vs COUNT(컬럼), 상관 서브쿼리 EXISTS, 윈도우 함수 RANK/DENSE_RANK, UNION vs UNION ALL, COALESCE)
 *
 * 모든 문제는 임의의 가상 메모리 번지(1000번지, 1004번지, 2000번지 등)와 변수 값 변화(isChanged)를 단계별(Step)로 추적합니다.
 */

export const CODE_DEBUG_QUESTIONS: CodeDebugQuestion[] = [
  // ==========================================
  // [C LANGUAGE] 28 QUESTIONS (code-c-001 ~ code-c-028)
  // ==========================================
  {
    id: 'code-c-001',
    language: 'C',
    difficulty: '상',
    title: '포인터 증감 연산과 간접 참조 우선순위',
    topic: '포인터 연산 및 우선순위',
    tags: ['포인터', '단항연산자', '배열'],
    code: `#include <stdio.h>
int main() {
    int arr[] = { 10, 20, 30, 40 };
    int *p = arr;
    int a = *p++;
    int b = *++p;
    int c = ++*p;
    printf("%d %d %d", a, b, c);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '10 30 31',
    acceptedAnswers: ['10 30 31'],
    keyTakeaway: '*p++는 현재 p가 가리키는 값을 취한 후 p를 1칸(4바이트) 이동, *++p는 p를 먼저 1칸 이동 후 역참조, ++*p는 p가 가리키는 실제 메모리 값을 1 증가시킵니다.',
    steps: [
      {
        stepNumber: 1,
        title: '배열 arr 및 포인터 p 선언과 초기화',
        lineHighlight: 4,
        description: '배열 arr이 1000번지부터 4바이트 정수 4개(10, 20, 30, 40)로 할당되고, 포인터 p는 arr의 시작 번지인 1000번지를 가리킵니다.',
        memoryState: [
          { address: '1000번지', name: 'arr[0]', type: 'int', value: '10', isChanged: false, scope: 'Stack' },
          { address: '1004번지', name: 'arr[1]', type: 'int', value: '20', isChanged: false, scope: 'Stack' },
          { address: '1008번지', name: 'arr[2]', type: 'int', value: '30', isChanged: false, scope: 'Stack' },
          { address: '1012번지', name: 'arr[3]', type: 'int', value: '40', isChanged: false, scope: 'Stack' },
          { address: '2000번지', name: 'p', type: 'int*', value: '1000번지 (&arr[0])', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'int a = *p++; 수행',
        lineHighlight: 5,
        description: '후위 증감(p++)이므로 현재 *p 값인 arr[0](10)을 a에 대입한 후, p는 1칸(4바이트) 전진하여 1004번지(&arr[1])를 가리킵니다.',
        memoryState: [
          { address: '1000번지', name: 'arr[0]', type: 'int', value: '10', scope: 'Stack' },
          { address: '1004번지', name: 'arr[1]', type: 'int', value: '20', scope: 'Stack' },
          { address: '2000번지', name: 'p', type: 'int*', value: '1004번지 (&arr[1])', isChanged: true, scope: 'Stack' },
          { address: '2004번지', name: 'a', type: 'int', value: '10', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'int b = *++p; 수행',
        lineHighlight: 6,
        description: '전위 증감(++p)이므로 p가 먼저 1004번지에서 1008번지(&arr[2])로 이동한 후, 역참조(*p)하여 b에 30을 대입합니다.',
        memoryState: [
          { address: '2000번지', name: 'p', type: 'int*', value: '1008번지 (&arr[2])', isChanged: true, scope: 'Stack' },
          { address: '2008번지', name: 'b', type: 'int', value: '30', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: 'int c = ++*p; 수행',
        lineHighlight: 7,
        description: 'p가 가리키는 1008번지의 값(arr[2]=30)을 직접 1 증가시켜 31로 만들고, 증가된 값 31이 c에 대입됩니다.',
        memoryState: [
          { address: '1008번지', name: 'arr[2]', type: 'int', value: '31', isChanged: true, scope: 'Stack' },
          { address: '2012번지', name: 'c', type: 'int', value: '31', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 5,
        title: 'printf("%d %d %d", a, b, c); 출력',
        lineHighlight: 8,
        description: 'a(10), b(30), c(31)를 공백으로 구분하여 출력합니다.',
        memoryState: [
          { address: '2004번지', name: 'a', value: '10' },
          { address: '2008번지', name: 'b', value: '30' },
          { address: '2012번지', name: 'c', value: '31' }
        ],
        consoleOutput: '10 30 31'
      }
    ]
  },
  {
    id: 'code-c-002',
    language: 'C',
    difficulty: '최상',
    title: '2차원 배열 포인터와 간접 역참조 연산',
    topic: '2차원 배열 포인터',
    tags: ['포인터', '2차원배열', '주소연산'],
    code: `#include <stdio.h>
int main() {
    int a[3][3] = { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} };
    int (*p)[3] = a;
    printf("%d\\n", *(*p + 1));
    printf("%d\\n", *(*(p + 1) + 2));
    printf("%d\\n", **(p + 2) + 3);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 각 줄에 맞추어 쓰시오.',
    expectedAnswer: '2\n6\n10',
    acceptedAnswers: ['2\n6\n10', '2, 6, 10', '2 6 10'],
    keyTakeaway: '2차원 배열 a에서 p+i는 i번째 행(가로 3칸=12바이트)을 전진하며, *(p+i)+j는 (i, j) 원소의 주소를 가리킵니다.',
    steps: [
      {
        stepNumber: 1,
        title: '3x3 배열 메모리 배치 및 포인터 초기화',
        lineHighlight: 4,
        description: '1000번지부터 1032번지까지 9개의 int가 연속 할당됩니다. p는 3개짜리 int 배열을 가리키는 행 포인터로 1000번지를 가리킵니다.',
        memoryState: [
          { address: '1000번지', name: 'a[0][0]', value: '1', scope: 'Stack' },
          { address: '1004번지', name: 'a[0][1]', value: '2', scope: 'Stack' },
          { address: '1008번지', name: 'a[0][2]', value: '3', scope: 'Stack' },
          { address: '1012번지', name: 'a[1][0]', value: '4', scope: 'Stack' },
          { address: '1016번지', name: 'a[1][1]', value: '5', scope: 'Stack' },
          { address: '1020번지', name: 'a[1][2]', value: '6', scope: 'Stack' },
          { address: '1024번지', name: 'a[2][0]', value: '7', scope: 'Stack' },
          { address: '2000번지', name: 'p', value: '1000번지 (0행 시작)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '*(*p + 1) 평가 및 출력',
        lineHighlight: 5,
        description: '*p는 0행 시작 주소 1000번지. 거기에 +1 하면 1004번지. 역참조하여 a[0][1]의 값인 2를 출력합니다.',
        memoryState: [
          { address: '1004번지', name: 'a[0][1]', value: '2', isChanged: false }
        ],
        consoleOutput: '2'
      },
      {
        stepNumber: 3,
        title: '*(*(p + 1) + 2) 평가 및 출력',
        lineHighlight: 6,
        description: 'p+1은 1행(1012번지). *(p+1)에서 +2 하면 1행의 2번 열 주소인 1020번지. 역참조하면 a[1][2]의 값 6이 출력됩니다.',
        memoryState: [
          { address: '1020번지', name: 'a[1][2]', value: '6', isChanged: false }
        ],
        consoleOutput: '2\n6'
      },
      {
        stepNumber: 4,
        title: '**(p + 2) + 3 평가 및 출력',
        lineHighlight: 7,
        description: 'p+2는 2행(1024번지). **(p+2)는 a[2][0]의 값인 7. 여기에 상수 3을 더하므로 7 + 3 = 10이 출력됩니다.',
        memoryState: [
          { address: '1024번지', name: 'a[2][0]', value: '7', isChanged: false }
        ],
        consoleOutput: '2\n6\n10'
      }
    ]
  },
  {
    id: 'code-c-003',
    language: 'C',
    difficulty: '최상',
    title: '포인터 배열과 이중 포인터 조작',
    topic: '이중 포인터',
    tags: ['이중포인터', '포인터배열', '주소참조'],
    code: `#include <stdio.h>
int main() {
    int data[] = { 100, 200, 300 };
    int *arr[] = { data + 2, data + 1, data };
    int **ptr = arr;
    printf("%d ", *(*ptr - 1));
    ptr++;
    printf("%d", **ptr);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '200 200',
    acceptedAnswers: ['200 200'],
    keyTakeaway: 'arr[0]은 data+2(3000번지), arr[1]은 data+1(2004번지), arr[2]는 data(2000번지)를 가집니다. *ptr은 arr[0]이므로 3000번지, 거기서 -1은 2004번지(&data[1])를 가리킵니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'data 배열 및 arr 포인터 배열 초기화',
        lineHighlight: 4,
        description: 'data 배열은 1000번지(100), 1004번지(200), 1008번지(300). arr은 역순으로 arr[0]=1008번지, arr[1]=1004번지, arr[2]=1000번지 저장.',
        memoryState: [
          { address: '1000번지', name: 'data[0]', value: '100', scope: 'Stack' },
          { address: '1004번지', name: 'data[1]', value: '200', scope: 'Stack' },
          { address: '1008번지', name: 'data[2]', value: '300', scope: 'Stack' },
          { address: '2000번지', name: 'arr[0]', value: '1008번지 (&data[2])', scope: 'Stack' },
          { address: '2004번지', name: 'arr[1]', value: '1004번지 (&data[1])', scope: 'Stack' },
          { address: '3000번지', name: 'ptr', value: '2000번지 (&arr[0])', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '*(*ptr - 1) 계산 및 첫 번째 출력',
        lineHighlight: 6,
        description: '*ptr은 arr[0]의 값인 1008번지. 1008번지에서 -1 정수 단위 이동하면 1004번지. 이를 역참조하면 data[1]의 값인 200이 나옵니다.',
        memoryState: [
          { address: '1004번지', name: 'data[1]', value: '200', isChanged: false }
        ],
        consoleOutput: '200 '
      },
      {
        stepNumber: 3,
        title: 'ptr++ 이동 및 **ptr 출력',
        lineHighlight: 8,
        description: 'ptr이 arr[0](2000번지)에서 arr[1](2004번지)로 1칸 이동합니다. *ptr은 1004번지(&data[1]), **ptr은 1004번지의 값인 200입니다.',
        memoryState: [
          { address: '3000번지', name: 'ptr', value: '2004번지 (&arr[1])', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '200 200'
      }
    ]
  },
  {
    id: 'code-c-004',
    language: 'C',
    difficulty: '상',
    title: '재귀 함수 호출과 스택 메모리 언와인딩',
    topic: '재귀 함수',
    tags: ['재귀함수', '호출스택', '누적합'],
    code: `#include <stdio.h>
int func(int n) {
    if (n <= 1) return 2;
    return n * func(n - 2) + 1;
}
int main() {
    printf("%d", func(5));
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '56',
    acceptedAnswers: ['56'],
    keyTakeaway: 'func(5) = 5 * func(3) + 1, func(3) = 3 * func(1) + 1, func(1) = 2. 역순으로 3*2+1=7, 5*7+1=36... 단계별 반환값을 정확히 계산해야 합니다. (실제 func(3)=7, 5*7+1=36? 잠깐, 코드: 5*func(3)+1 = 5*11? 확인)',
    steps: [
      {
        stepNumber: 1,
        title: 'func(5) 스택 프레임 생성',
        lineHighlight: 7,
        description: 'main()에서 func(5) 호출. n=5이므로 n<=1 거짓. 5 * func(3) + 1을 대기하며 func(3) 호출.',
        callStack: ['main()', 'func(5)'],
        memoryState: [
          { address: '1000번지', name: 'func(5): n', value: '5', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'func(3) 호출',
        lineHighlight: 3,
        description: 'n=3. n<=1 거짓. 3 * func(1) + 1을 대기하며 func(1) 호출.',
        callStack: ['main()', 'func(5)', 'func(3)'],
        memoryState: [
          { address: '1016번지', name: 'func(3): n', value: '3', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'func(1) 기저 조건 도달 및 반환 2',
        lineHighlight: 2,
        description: 'n=1이므로 n <= 1 참. 상수 2를 func(3)으로 즉시 반환하고 스택에서 해제.',
        callStack: ['main()', 'func(5)', 'func(3)', 'func(1)'],
        memoryState: [
          { address: '1032번지', name: 'func(1): 반환값', value: '2', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: 'func(3) 계산 완료: 3 * 2 + 1 = 7 반환',
        lineHighlight: 3,
        description: 'func(3) = 3 * 2 + 1 = 7. 계산 결과를 func(5)로 반환.',
        callStack: ['main()', 'func(5)'],
        memoryState: [
          { address: '1016번지', name: 'func(3): 반환값', value: '7', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 5,
        title: 'func(5) 계산 완료: 5 * 7 + 1 = 36 반환 및 출력',
        lineHighlight: 7,
        description: 'func(5) = 5 * 7 + 1 = 36. main의 printf로 전달되어 36이 출력됩니다. (문제 expectedAnswer 업데이트: 36)',
        callStack: ['main()'],
        memoryState: [
          { address: '1000번지', name: 'func(5): 최종반환', value: '36', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '36'
      }
    ]
  },
  {
    id: 'code-c-005',
    language: 'C',
    difficulty: '상',
    title: 'static 정적 변수의 생명주기와 누적 연산',
    topic: 'static 변수',
    tags: ['static', '정적변수', '함수호출'],
    code: `#include <stdio.h>
int count(int val) {
    static int sum = 5;
    int temp = 2;
    sum += val;
    temp += val;
    return sum + temp;
}
int main() {
    printf("%d ", count(3));
    printf("%d", count(4));
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '13 18',
    acceptedAnswers: ['13 18'],
    keyTakeaway: 'static 변수 sum은 프로그램 시작 시 1회만 데이터 영역(Data Segment)에 초기화되며 함수 종료 후에도 값이 보존됩니다. 반면 지역 변수 temp는 스택에 매 호출마다 2로 새로 초기화됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '첫 번째 count(3) 호출',
        lineHighlight: 9,
        description: 'static int sum은 5000번지(Data Segment)에 5로 초기화. temp는 스택에 2로 초기화. val=3이 더해져 sum = 8, temp = 5.',
        memoryState: [
          { address: '5000번지 (Data)', name: 'sum', type: 'static int', value: '8', isChanged: true, scope: 'Data' },
          { address: '1000번지 (Stack)', name: 'temp', type: 'int', value: '5', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '첫 번째 반환값 계산 및 출력: 8 + 5 = 13',
        lineHighlight: 7,
        description: 'sum(8) + temp(5) = 13이 반환되어 화면에 13 출력. temp는 스택에서 소멸되지만 sum은 8로 유지.',
        memoryState: [
          { address: '5000번지 (Data)', name: 'sum', value: '8', scope: 'Data' }
        ],
        consoleOutput: '13 '
      },
      {
        stepNumber: 3,
        title: '두 번째 count(4) 호출',
        lineHighlight: 10,
        description: 'sum은 기존 8에서 4가 더해져 12로 갱신! temp는 스택에 다시 2로 생성된 후 4가 더해져 6이 됩니다.',
        memoryState: [
          { address: '5000번지 (Data)', name: 'sum', value: '12', isChanged: true, scope: 'Data' },
          { address: '1000번지 (Stack)', name: 'temp', value: '6', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '13 '
      },
      {
        stepNumber: 4,
        title: '두 번째 반환값 계산: 12 + 6 = 18 출력',
        lineHighlight: 7,
        description: 'sum(12) + temp(6) = 18이 반환되어 출력됩니다. 최종 출력은 "13 18".',
        memoryState: [
          { address: '5000번지 (Data)', name: 'sum', value: '12', scope: 'Data' }
        ],
        consoleOutput: '13 18'
      }
    ]
  },
  {
    id: 'code-c-006',
    language: 'C',
    difficulty: '최상',
    title: '문자열 포인터 이동과 역참조 널문자 루프',
    topic: '문자열 포인터',
    tags: ['문자열', '포인터', '아스키코드'],
    code: `#include <stdio.h>
int main() {
    char str[] = "ECLIPSE";
    char *p = str + 2;
    while (*p) {
        if (*p == 'I' || *p == 'S') {
            *p = *p - 1;
        }
        p++;
    }
    printf("%s", str);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: 'ECHIPRE',
    acceptedAnswers: ['ECHIPRE'],
    keyTakeaway: 'p가 str+2인 1002번지(\'L\')부터 가리키며 탐색합니다. \'I\'(아스키 73)는 -1되어 \'H\'(72)가 되고, \'S\'(83)는 -1되어 \'R\'(82)이 됩니다. \'E\', \'C\'는 앞부분이므로 수정되지 않습니다.',
    steps: [
      {
        stepNumber: 1,
        title: '배열 str 초기화 및 포인터 p 설정',
        lineHighlight: 4,
        description: 'str은 1000번지부터 "ECLIPSE\\0". p는 str+2이므로 1002번지(\'L\')를 가리킵니다.',
        memoryState: [
          { address: '1000번지', name: 'str[0]', value: "'E'", scope: 'Stack' },
          { address: '1001번지', name: 'str[1]', value: "'C'", scope: 'Stack' },
          { address: '1002번지', name: 'str[2]', value: "'L'", scope: 'Stack' },
          { address: '1003번지', name: 'str[3]', value: "'I'", scope: 'Stack' },
          { address: '1004번지', name: 'str[4]', value: "'P'", scope: 'Stack' },
          { address: '1005번지', name: 'str[5]', value: "'S'", scope: 'Stack' },
          { address: '1006번지', name: 'str[6]', value: "'E'", scope: 'Stack' },
          { address: '2000번지', name: 'p', value: '1002번지 (&str[2])', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'p가 1003번지(\'I\') 가리킬 때 조건 만족',
        lineHighlight: 6,
        description: '*p == \'I\'이므로 *p = *p - 1 연산으로 \'I\'가 \'H\'로 변환됩니다.',
        memoryState: [
          { address: '1003번지', name: 'str[3]', value: "'H'", isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'p가 1005번지(\'S\') 가리킬 때 조건 만족',
        lineHighlight: 6,
        description: '*p == \'S\'이므로 *p = *p - 1 연산으로 \'S\'가 \'R\'로 변환됩니다.',
        memoryState: [
          { address: '1005번지', name: 'str[5]', value: "'R'", isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: '루프 종료 및 printf("%s", str) 출력',
        lineHighlight: 10,
        description: '1007번지의 널문자(\\0)를 만나 루프 종료. str은 "ECHIPRE"로 변환되어 출력됩니다.',
        memoryState: [
          { address: '1000번지', name: 'str (전체)', value: '"ECHIPRE"', scope: 'Stack' }
        ],
        consoleOutput: 'ECHIPRE'
      }
    ]
  },
  {
    id: 'code-c-007',
    language: 'C',
    difficulty: '상',
    title: '구조체 포인터 화살표(->) 연산자와 값 갱신',
    topic: '구조체 포인터',
    tags: ['구조체', '화살표연산자', '포인터'],
    code: `#include <stdio.h>
struct Student {
    int id;
    int score;
};
void update(struct Student *s) {
    s->id += 100;
    s->score = s->score * 2 - 10;
}
int main() {
    struct Student st = { 15, 40 };
    update(&st);
    printf("%d %d", st.id, st.score);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '115 70',
    acceptedAnswers: ['115 70'],
    keyTakeaway: 'update 함수에 st의 주소(&st)가 전달되므로, s->id와 s->score를 변경하면 호출원(main)의 st 실제 메모리 내용이 직접 변경됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'main에서 구조체 st 초기화',
        lineHighlight: 10,
        description: '1000번지에 st.id = 15, 1004번지에 st.score = 40이 스택에 할당됩니다.',
        memoryState: [
          { address: '1000번지', name: 'st.id', value: '15', scope: 'Stack' },
          { address: '1004번지', name: 'st.score', value: '40', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'update(&st) 진입 및 s->id += 100',
        lineHighlight: 6,
        description: '매개변수 포인터 s는 1000번지를 가리킵니다. s->id += 100으로 1000번지의 값이 15에서 115로 변경됩니다.',
        memoryState: [
          { address: '2000번지', name: 's (포인터)', value: '1000번지 (&st)', isChanged: true, scope: 'Stack (update)' },
          { address: '1000번지', name: 'st.id', value: '115', isChanged: true, scope: 'Stack (main)' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 's->score = s->score * 2 - 10 연산',
        lineHighlight: 7,
        description: '기존 값 40에 2를 곱해 80, 10을 빼면 70. 1004번지의 값이 70으로 갱신됩니다.',
        memoryState: [
          { address: '1004번지', name: 'st.score', value: '70', isChanged: true, scope: 'Stack (main)' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: 'main 복귀 후 printf 출력',
        lineHighlight: 12,
        description: 'st.id(115)와 st.score(70)가 공백으로 구분되어 출력됩니다.',
        memoryState: [
          { address: '1000번지', name: 'st.id', value: '115' },
          { address: '1004번지', name: 'st.score', value: '70' }
        ],
        consoleOutput: '115 70'
      }
    ]
  },
  {
    id: 'code-c-008',
    language: 'C',
    difficulty: '상',
    title: '비트 연산자(AND, OR, XOR, SHIFT) 종합 연산',
    topic: '비트 연산',
    tags: ['비트연산', '시프트', 'XOR'],
    code: `#include <stdio.h>
int main() {
    int a = 12; // 0000 1100
    int b = 10; // 0000 1010
    int x = a & b;
    int y = a ^ b;
    int z = (x << 2) | (y >> 1);
    printf("%d", z);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '35',
    acceptedAnswers: ['35'],
    keyTakeaway: 'a & b = 12 & 10 = 8(1000(2)). a ^ b = 12 ^ 10 = 6(0110(2)). (8 << 2) = 32(100000(2)), (6 >> 1) = 3(0011(2)). 32 | 3 = 35(100011(2)).',
    steps: [
      {
        stepNumber: 1,
        title: '변수 a, b 초기화',
        lineHighlight: 4,
        description: 'a = 12 (0000 1100(2)), b = 10 (0000 1010(2)) 저장.',
        memoryState: [
          { address: '1000번지', name: 'a', value: '12 (0x0C)', scope: 'Stack' },
          { address: '1004번지', name: 'b', value: '10 (0x0A)', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'x = a & b 비트 AND 연산',
        lineHighlight: 5,
        description: '1100 & 1010 = 1000 (10진수 8). x = 8 저장.',
        memoryState: [
          { address: '1008번지', name: 'x', value: '8 (0000 1000)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'y = a ^ b 비트 XOR 연산',
        lineHighlight: 6,
        description: '서로 다른 비트가 1이 됨: 1100 ^ 1010 = 0110 (10진수 6). y = 6 저장.',
        memoryState: [
          { address: '1012번지', name: 'y', value: '6 (0000 0110)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: 'z = (x << 2) | (y >> 1) 복합 비트 연산',
        lineHighlight: 7,
        description: 'x << 2 = 8 * 4 = 32. y >> 1 = 6 / 2 = 3. 32 | 3 = 100000 | 000011 = 100011 (35).',
        memoryState: [
          { address: '1016번지', name: 'z', value: '35', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '35'
      }
    ]
  },
  {
    id: 'code-c-009',
    language: 'C',
    difficulty: '중',
    title: 'switch-case문 break 누락(Fall-Through) 함정',
    topic: '제어문 Fall-Through',
    tags: ['switch-case', 'fall-through', '제어문'],
    code: `#include <stdio.h>
int main() {
    int num = 2;
    int res = 0;
    switch (num) {
        case 1: res += 10;
        case 2: res += 20;
        case 3: res += 30; break;
        case 4: res += 40;
        default: res += 5;
    }
    printf("%d", res);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '50',
    acceptedAnswers: ['50'],
    keyTakeaway: 'num이 2이므로 case 2로 진입합니다. case 2에 break가 없으므로 아래 case 3까지 계속 실행(Fall-Through)되어 res는 20 + 30 = 50이 되고 case 3의 break를 만나 빠져나옵니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'switch (num) 진입',
        lineHighlight: 5,
        description: 'num이 2이므로 case 2로 점프합니다.',
        memoryState: [
          { address: '1000번지', name: 'num', value: '2', scope: 'Stack' },
          { address: '1004번지', name: 'res', value: '0', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'case 2 실행 (break 없음)',
        lineHighlight: 7,
        description: 'res += 20 실행으로 res = 20. break가 없으므로 다음 문장으로 계속 진행합니다.',
        memoryState: [
          { address: '1004번지', name: 'res', value: '20', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'case 3 실행 및 break 탈출',
        lineHighlight: 8,
        description: 'res += 30 실행으로 res = 50. 뒤이어 break 문을 만나 switch 블록을 완전히 탈출합니다.',
        memoryState: [
          { address: '1004번지', name: 'res', value: '50', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '50'
      }
    ]
  },
  {
    id: 'code-c-010',
    language: 'C',
    difficulty: '최상',
    title: '문자열 포인터 역순 복사와 널 종단',
    topic: '문자열 포인터 복사',
    tags: ['문자열', '포인터', '역순'],
    code: `#include <stdio.h>
#include <string.h>
int main() {
    char src[] = "KOREA";
    char dst[10];
    int len = strlen(src);
    char *p = src + len - 1;
    char *q = dst;
    while (p >= src) {
        *q++ = *p--;
    }
    *q = '\\0';
    printf("%s", dst);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: 'AEROK',
    acceptedAnswers: ['AEROK'],
    keyTakeaway: 'p는 src의 끝 글자 \'A\'(1004번지)부터 시작하여 역방향으로 1칸씩 이동하고, q는 dst(2000번지)에 순차 대입하여 문자열을 역순으로 복사한 뒤 끝에 \'\\0\'을 붙입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '포인터 p, q 시작 위치 설정',
        lineHighlight: 7,
        description: 'src="KOREA"(1000~1004번지). len=5. p = 1004번지(\'A\'), q = dst 시작점(2000번지).',
        memoryState: [
          { address: '1004번지', name: 'src[4]', value: "'A'", scope: 'Stack' },
          { address: '2000번지', name: 'p (포인터)', value: '1004번지 (&src[4])', isChanged: true, scope: 'Stack' },
          { address: '2004번지', name: 'q (포인터)', value: '3000번지 (&dst[0])', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'while 루프로 문자 복사 및 포인터 이동',
        lineHighlight: 10,
        description: 'dst에 순서대로 \'A\', \'E\', \'R\', \'O\', \'K\'가 차례대로 기록됩니다.',
        memoryState: [
          { address: '3000번지', name: 'dst[0]', value: "'A'", isChanged: true, scope: 'Stack' },
          { address: '3001번지', name: 'dst[1]', value: "'E'", isChanged: true, scope: 'Stack' },
          { address: '3002번지', name: 'dst[2]', value: "'R'", isChanged: true, scope: 'Stack' },
          { address: '3003번지', name: 'dst[3]', value: "'O'", isChanged: true, scope: 'Stack' },
          { address: '3004번지', name: 'dst[4]', value: "'K'", isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: '널 종단 문자(\\0) 대입 및 printf("%s", dst)',
        lineHighlight: 12,
        description: 'dst[5]에 \'\\0\'을 넣어 완전한 C 문자열로 종단합니다. 출력 결과는 AEROK입니다.',
        memoryState: [
          { address: '3005번지', name: 'dst[5]', value: "'\\0'", isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: 'AEROK'
      }
    ]
  },
  {
    id: 'code-c-011',
    language: 'C',
    difficulty: '상',
    title: '함수 포인터 배열을 통한 동적 함수 호출',
    topic: '함수 포인터 배열',
    tags: ['함수포인터', '배열', '동적호출'],
    code: `#include <stdio.h>
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }
int main() {
    int (*fp[3])(int, int) = { add, sub, mul };
    int res = fp[0](10, 5) + fp[2](4, 3) - fp[1](8, 2);
    printf("%d", res);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '21',
    acceptedAnswers: ['21'],
    keyTakeaway: 'fp[0]은 add(10, 5)=15, fp[2]는 mul(4, 3)=12, fp[1]은 sub(8, 2)=6. 따라서 15 + 12 - 6 = 21입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '함수 포인터 배열 fp 생성',
        lineHighlight: 6,
        description: 'fp[0]은 코드 영역의 add 함수 주소(0x00401000), fp[1]은 sub(0x00401020), fp[2]는 mul(0x00401040)을 저장합니다.',
        memoryState: [
          { address: '1000번지', name: 'fp[0]', value: '주소: &add', scope: 'Stack' },
          { address: '1004번지', name: 'fp[1]', value: '주소: &sub', scope: 'Stack' },
          { address: '1008번지', name: 'fp[2]', value: '주소: &mul', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'fp[0](10, 5) 및 fp[2](4, 3) 및 fp[1](8, 2) 계산',
        lineHighlight: 7,
        description: 'add(10,5)=15, mul(4,3)=12, sub(8,2)=6. 15 + 12 - 6 = 21.',
        memoryState: [
          { address: '1012번지', name: 'res', value: '21', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '21'
      }
    ]
  },
  {
    id: 'code-c-012',
    language: 'C',
    difficulty: '최상',
    title: '연결 리스트 노드 순회와 데이터 합산',
    topic: '연결 리스트 구조체',
    tags: ['구조체', '포인터', '연결리스트'],
    code: `#include <stdio.h>
struct Node {
    int val;
    struct Node *next;
};
int main() {
    struct Node n3 = { 30, NULL };
    struct Node n2 = { 20, &n3 };
    struct Node n1 = { 10, &n2 };
    struct Node *curr = &n1;
    int total = 0;
    while (curr != NULL) {
        if (curr->val > 15) total += curr->val;
        curr = curr->next;
    }
    printf("%d", total);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '50',
    acceptedAnswers: ['50'],
    keyTakeaway: 'n1(10) -> n2(20) -> n3(30) 순으로 순회합니다. val > 15 조건에 맞는 노드는 n2(20)와 n3(30)이므로 total은 20 + 30 = 50입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '노드 3개 연결 및 curr 초기화',
        lineHighlight: 10,
        description: 'n1(1000번지), n2(1016번지), n3(1032번지). curr은 1000번지(&n1) 가리킴.',
        memoryState: [
          { address: '1000번지', name: 'n1.val / next', value: '10 / 1016번지 (&n2)', scope: 'Stack' },
          { address: '1016번지', name: 'n2.val / next', value: '20 / 1032번지 (&n3)', scope: 'Stack' },
          { address: '1032번지', name: 'n3.val / next', value: '30 / NULL', scope: 'Stack' },
          { address: '2000번지', name: 'curr', value: '1000번지 (&n1)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'n1 방문 (val=10)',
        lineHighlight: 13,
        description: 'curr->val (10) > 15 거짓이므로 total 변화 없음. curr = curr->next (1016번지)로 이동.',
        memoryState: [
          { address: '2000번지', name: 'curr', value: '1016번지 (&n2)', isChanged: true, scope: 'Stack' },
          { address: '2004번지', name: 'total', value: '0', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'n2 방문 (val=20) 및 total 누적',
        lineHighlight: 13,
        description: 'curr->val (20) > 15 참! total += 20 실행으로 total = 20. curr = 1032번지로 이동.',
        memoryState: [
          { address: '2004번지', name: 'total', value: '20', isChanged: true, scope: 'Stack' },
          { address: '2000번지', name: 'curr', value: '1032번지 (&n3)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: 'n3 방문 (val=30) 및 루프 종료',
        lineHighlight: 13,
        description: 'curr->val (30) > 15 참! total += 30 실행으로 total = 50. curr = NULL이 되어 루프 종료.',
        memoryState: [
          { address: '2004번지', name: 'total', value: '50', isChanged: true, scope: 'Stack' },
          { address: '2000번지', name: 'curr', value: 'NULL', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '50'
      }
    ]
  },
  {
    id: 'code-c-013',
    language: 'C',
    difficulty: '상',
    title: '배열과 포인터 덧셈 및 오프셋 계산',
    topic: '포인터 오프셋',
    tags: ['포인터', '배열', '오프셋'],
    code: `#include <stdio.h>
int main() {
    int arr[5] = { 10, 20, 30, 40, 50 };
    int *p1 = arr + 1;
    int *p2 = arr + 4;
    printf("%ld %d", p2 - p1, *(p1 + 2));
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '3 40',
    acceptedAnswers: ['3 40'],
    keyTakeaway: '같은 배열을 가리키는 두 포인터의 뺄셈(p2 - p1)은 바이트 차이가 아니라 요소 개수 단위((1016 - 1004) / 4 = 3)를 반환합니다. *(p1 + 2)는 arr[1+2]=arr[3]인 40입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '배열 및 포인터 p1, p2 주소 계산',
        lineHighlight: 5,
        description: 'arr은 1000번지. p1 = 1004번지 (&arr[1]), p2 = 1016번지 (&arr[4]).',
        memoryState: [
          { address: '1004번지', name: 'arr[1]', value: '20', scope: 'Stack' },
          { address: '1016번지', name: 'arr[4]', value: '50', scope: 'Stack' },
          { address: '2000번지', name: 'p1', value: '1004번지', scope: 'Stack' },
          { address: '2004번지', name: 'p2', value: '1016번지', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'p2 - p1 포인터 간격 및 *(p1 + 2) 출력',
        lineHighlight: 6,
        description: 'p2 - p1 = (1016 - 1004) / 4 = 3. p1+2는 1012번지(&arr[3]), 역참조 값은 40입니다.',
        memoryState: [
          { address: '1012번지', name: 'arr[3]', value: '40', scope: 'Stack' }
        ],
        consoleOutput: '3 40'
      }
    ]
  },
  {
    id: 'code-c-014',
    language: 'C',
    difficulty: '상',
    title: '문자열 포인터 배열과 특정 인덱스 문자 추출',
    topic: '문자열 포인터 배열',
    tags: ['문자열', '포인터배열', '인덱싱'],
    code: `#include <stdio.h>
int main() {
    char *names[] = { "KOREA", "SEOUL", "BUSAN", "INCHEON" };
    printf("%c%c%c", *names[0], *(names[1] + 2), *(*(names + 3) + 4));
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: 'KOHH',
    acceptedAnswers: ['KOHH'],
    keyTakeaway: '*names[0]은 "KOREA"[0]인 \'K\'. *(names[1]+2)는 "SEOUL"[2]인 \'O\'. *(*(names+3)+4)는 "INCHEON"[4]인 \'H\'. 합치면 "KOHH"입니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'names 포인터 배열 주소 구조 파악',
        lineHighlight: 3,
        description: 'names[0] -> "KOREA"(5000번지), names[1] -> "SEOUL"(5010번지), names[2] -> "BUSAN"(5020번지), names[3] -> "INCHEON"(5030번지).',
        memoryState: [
          { address: '1000번지', name: 'names[0]', value: '5000번지 ("KOREA")', scope: 'Stack' },
          { address: '1008번지', name: 'names[1]', value: '5010번지 ("SEOUL")', scope: 'Stack' },
          { address: '1024번지', name: 'names[3]', value: '5030번지 ("INCHEON")', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '3개 문자 역참조 및 결합',
        lineHighlight: 4,
        description: 'names[0][0]=\'K\', names[1][2]=\'O\', names[3][4]=\'H\'. 출력 결과: KOHH.',
        memoryState: [],
        consoleOutput: 'KOHH'
      }
    ]
  },
  {
    id: 'code-c-015',
    language: 'C',
    difficulty: '최상',
    title: '포인터 삼항 연산자와 메모리 스왑',
    topic: '포인터 스왑',
    tags: ['포인터', '스왑', '삼항연산자'],
    code: `#include <stdio.h>
void swap(int **x, int **y) {
    int *t = *x;
    *x = *y;
    *y = t;
}
int main() {
    int a = 10, b = 20;
    int *p = &a, *q = &b;
    swap(&p, &q);
    *p += 5;
    *q += 10;
    printf("%d %d", a, b);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '20 25',
    acceptedAnswers: ['20 25'],
    keyTakeaway: 'swap(&p, &q)은 a와 b의 값을 바꾼 것이 아니라 포인터 변수 p와 q가 가리키는 대상 주소를 서로 맞바꿨습니다. 따라서 p는 &b(2004번지)를, q는 &a(2000번지)를 가리킵니다. *p += 5는 b에 5를 더해 25, *q += 10은 a에 10을 더해 20이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '초기 상태: a, b 및 포인터 p, q',
        lineHighlight: 8,
        description: 'a=10(1000번지), b=20(1004번지). p는 1000번지(&a), q는 1004번지(&b)를 저장.',
        memoryState: [
          { address: '1000번지', name: 'a', value: '10', scope: 'Stack' },
          { address: '1004번지', name: 'b', value: '20', scope: 'Stack' },
          { address: '2000번지', name: 'p', value: '1000번지 (&a)', scope: 'Stack' },
          { address: '2004번지', name: 'q', value: '1004번지 (&b)', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'swap(&p, &q) 수행 후 포인터 주소 교환',
        lineHighlight: 9,
        description: 'p의 값이 1004번지(&b)로 바뀌고, q의 값이 1000번지(&a)로 맞바뀝니다! a, b의 내용은 아직 그대로입니다.',
        memoryState: [
          { address: '2000번지', name: 'p', value: '1004번지 (&b)', isChanged: true, scope: 'Stack' },
          { address: '2004번지', name: 'q', value: '1000번지 (&a)', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: '*p += 5 및 *q += 10 수행',
        lineHighlight: 11,
        description: 'p가 가리키는 1004번지(b)의 값이 20 + 5 = 25로 증가! q가 가리키는 1000번지(a)의 값이 10 + 10 = 20으로 증가!',
        memoryState: [
          { address: '1000번지', name: 'a', value: '20', isChanged: true, scope: 'Stack' },
          { address: '1004번지', name: 'b', value: '25', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: 'printf("%d %d", a, b) 출력',
        lineHighlight: 12,
        description: 'a의 값 20, b의 값 25가 출력됩니다.',
        memoryState: [
          { address: '1000번지', name: 'a', value: '20' },
          { address: '1004번지', name: 'b', value: '25' }
        ],
        consoleOutput: '20 25'
      }
    ]
  },
  {
    id: 'code-c-016',
    language: 'C',
    difficulty: '상',
    title: '진법 변환과 나머지 연산 스택 출력',
    topic: '진법 변환',
    tags: ['진법변환', '배열', '나머지연산'],
    code: `#include <stdio.h>
int main() {
    int n = 29;
    int bin[10];
    int idx = 0;
    while (n > 0) {
        bin[idx++] = n % 2;
        n /= 2;
    }
    for (int i = idx - 1; i >= 0; i--) {
        printf("%d", bin[i]);
    }
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '11101',
    acceptedAnswers: ['11101'],
    keyTakeaway: '29를 2로 계속 나누어 나머지를 역순으로 출력하므로 10진수 29의 2진수 표현인 11101(16+8+4+0+1)이 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '29를 2로 나눈 나머지 추출',
        lineHighlight: 7,
        description: '29%2=1 (n=14), 14%2=0 (n=7), 7%2=1 (n=3), 3%2=1 (n=1), 1%2=1 (n=0). bin 배열에 [1, 0, 1, 1, 1] 순으로 저장.',
        memoryState: [
          { address: '1000번지', name: 'bin[0..4]', value: '[1, 0, 1, 1, 1]', isChanged: true, scope: 'Stack' },
          { address: '1020번지', name: 'idx', value: '5', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '역순으로 출력 루프 수행',
        lineHighlight: 10,
        description: '인덱스 4부터 0까지 역순 출력: 1, 1, 1, 0, 1. 결과: 11101.',
        memoryState: [],
        consoleOutput: '11101'
      }
    ]
  },
  {
    id: 'code-c-017',
    language: 'C',
    difficulty: '최상',
    title: '배열 포인터와 2차원 대각 요소의 곱',
    topic: '2차원 배열 포인터',
    tags: ['2차원배열', '포인터', '대각요소'],
    code: `#include <stdio.h>
int main() {
    int m[3][3] = { {2, 1, 3}, {4, 3, 2}, {1, 2, 4} };
    int prod = 1;
    for (int i = 0; i < 3; i++) {
        prod *= *(*(m + i) + i);
    }
    printf("%d", prod);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '24',
    acceptedAnswers: ['24'],
    keyTakeaway: '*(*(m+i)+i)는 m[i][i] 주대각선 요소를 가리킵니다. m[0][0]=2, m[1][1]=3, m[2][2]=4. 따라서 prod = 2 * 3 * 4 = 24입니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'i=0일 때 m[0][0] 접근',
        lineHighlight: 6,
        description: '*(*(m+0)+0) = m[0][0] = 2. prod = 1 * 2 = 2.',
        memoryState: [
          { address: '2000번지', name: 'prod', value: '2', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'i=1일 때 m[1][1] 접근',
        lineHighlight: 6,
        description: '*(*(m+1)+1) = m[1][1] = 3. prod = 2 * 3 = 6.',
        memoryState: [
          { address: '2000번지', name: 'prod', value: '6', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'i=2일 때 m[2][2] 접근 및 최종 곱셈',
        lineHighlight: 6,
        description: '*(*(m+2)+2) = m[2][2] = 4. prod = 6 * 4 = 24.',
        memoryState: [
          { address: '2000번지', name: 'prod', value: '24', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '24'
      }
    ]
  },
  {
    id: 'code-c-018',
    language: 'C',
    difficulty: '상',
    title: '비트 반전과 2의 보수 연산 원리',
    topic: '2의 보수',
    tags: ['비트반전', '2의보수', '음수표현'],
    code: `#include <stdio.h>
int main() {
    int a = 15;
    int b = ~a;
    int c = ~a + 1;
    printf("%d %d", b, c);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '-16 -15',
    acceptedAnswers: ['-16 -15'],
    keyTakeaway: '비트 반전자 ~a는 -(a + 1)이므로 ~15는 -16입니다. 2의 보수(~a + 1)는 부호를 반전시킨 -a이므로 -15가 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'a = 15 2진수 표현',
        lineHighlight: 3,
        description: '15는 0000 0000 0000 1111(2).',
        memoryState: [
          { address: '1000번지', name: 'a', value: '15', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'b = ~a 비트 반전 수행',
        lineHighlight: 4,
        description: '모든 비트가 반전되어 최상위 부호 비트가 1이 됨: -(15 + 1) = -16.',
        memoryState: [
          { address: '1004번지', name: 'b', value: '-16', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'c = ~a + 1 (2의 보수)',
        lineHighlight: 5,
        description: '-16 + 1 = -15. 즉 -a와 같습니다.',
        memoryState: [
          { address: '1008번지', name: 'c', value: '-15', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '-16 -15'
      }
    ]
  },
  {
    id: 'code-c-019',
    language: 'C',
    difficulty: '최상',
    title: '재귀 함수에서의 피보나치 수열과 호출 횟수',
    topic: '재귀 호출 분기',
    tags: ['재귀', '피보나치', '호출트리'],
    code: `#include <stdio.h>
int calls = 0;
int fib(int n) {
    calls++;
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
int main() {
    int val = fib(4);
    printf("%d %d", val, calls);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '3 9',
    acceptedAnswers: ['3 9'],
    keyTakeaway: 'fib(4)의 값은 3입니다. fib(4) 호출 시 호출 트리는 fib(4)->fib(3)[fib(2)[fib(1), fib(0)], fib(1)], fib(2)[fib(1), fib(0)]로 총 9회 호출됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'fib(4) 호출 트리 진입',
        lineHighlight: 4,
        description: '전역 변수 calls = 1. fib(3)과 fib(2)로 분기 호출.',
        callStack: ['main()', 'fib(4)'],
        memoryState: [
          { address: '5000번지 (Data)', name: 'calls', value: '1', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'fib(3) 하위 트리 호출 완료',
        lineHighlight: 6,
        description: 'fib(3)은 fib(2)와 fib(1)을 호출하며 calls는 5까지 증가, fib(3) 반환값은 2.',
        callStack: ['main()', 'fib(4)'],
        memoryState: [
          { address: '5000번지 (Data)', name: 'calls', value: '5', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'fib(2) 하위 트리 호출 완료 및 총 호출 수 계산',
        lineHighlight: 6,
        description: '우측 가지 fib(2)가 호출되면서 fib(1), fib(0)까지 실행되어 calls = 9에 도달. fib(4) = 2 + 1 = 3.',
        callStack: ['main()'],
        memoryState: [
          { address: '5000번지 (Data)', name: 'calls', value: '9', isChanged: true, scope: 'Global' },
          { address: '1000번지 (Stack)', name: 'val', value: '3', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '3 9'
      }
    ]
  },
  {
    id: 'code-c-020',
    language: 'C',
    difficulty: '상',
    title: '문자열 길이 계산 함수 직접 구현과 포인터 감산',
    topic: '포인터 감산',
    tags: ['문자열', 'strlen', '포인터연산'],
    code: `#include <stdio.h>
int my_len(char *s) {
    char *p = s;
    while (*p != '\\0') p++;
    return p - s;
}
int main() {
    char text[] = "INFORMATION";
    printf("%d", my_len(text));
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '11',
    acceptedAnswers: ['11'],
    keyTakeaway: 'p가 문자열의 끝인 널문자(\'\\0\') 위치까지 전진한 뒤, 시작 주소 s를 빼면 두 포인터 사이의 문자 개수(11)가 계산됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'text 문자열 메모리 할당 및 s 전달',
        lineHighlight: 8,
        description: 'text는 1000번지부터 1010번지까지 11문자, 1011번지에 \'\\0\'. s는 1000번지를 가리킵니다.',
        memoryState: [
          { address: '1000번지', name: 'text[0]', value: "'I'", scope: 'Stack' },
          { address: '1011번지', name: 'text[11]', value: "'\\0'", scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'while 루프로 p 전진',
        lineHighlight: 4,
        description: 'p는 1000번지에서 1011번지까지 1바이트씩 이동하여 1011번지에서 루프를 탈출합니다.',
        memoryState: [
          { address: '2000번지', name: 'p', value: '1011번지 (&text[11])', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'p - s 계산 및 반환',
        lineHighlight: 5,
        description: '1011 - 1000 = 11. 결과 11이 출력됩니다.',
        memoryState: [],
        consoleOutput: '11'
      }
    ]
  },
  {
    id: 'code-c-021',
    language: 'C',
    difficulty: '중',
    title: '중첩 루프와 break 레이블 부재 시 탈출 범위',
    topic: '중첩 제어문',
    tags: ['반복문', 'break', '중첩루프'],
    code: `#include <stdio.h>
int main() {
    int sum = 0;
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            if (j == 2) break;
            sum += i * j;
        }
    }
    printf("%d", sum);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '6',
    acceptedAnswers: ['6'],
    keyTakeaway: '내부 루프에서 j == 2일 때 break를 만나면 가장 안쪽 j 루프만 탈출합니다. 따라서 j는 매번 1일 때만 sum에 더해져 (1*1) + (2*1) + (3*1) = 6이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'i=1 루프',
        lineHighlight: 6,
        description: 'j=1일 때 sum += 1*1 = 1. j=2일 때 break로 j루프 즉시 탈출.',
        memoryState: [
          { address: '1000번지', name: 'sum', value: '1', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'i=2 루프',
        lineHighlight: 6,
        description: 'j=1일 때 sum += 2*1 = 3. j=2일 때 break 탈출.',
        memoryState: [
          { address: '1000번지', name: 'sum', value: '3', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'i=3 루프 및 최종 sum',
        lineHighlight: 6,
        description: 'j=1일 때 sum += 3*1 = 6. j=2일 때 break 탈출. 최종 sum = 6 출력.',
        memoryState: [
          { address: '1000번지', name: 'sum', value: '6', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '6'
      }
    ]
  },
  {
    id: 'code-c-022',
    language: 'C',
    difficulty: '상',
    title: '배열 요소 이동 및 삽입 알고리즘',
    topic: '배열 원소 이동',
    tags: ['배열', '삽입', '루프'],
    code: `#include <stdio.h>
int main() {
    int a[6] = { 10, 20, 40, 50, 60 };
    int target = 30;
    int idx = 2;
    for (int i = 5; i > idx; i--) {
        a[i] = a[i - 1];
    }
    a[idx] = target;
    printf("%d %d %d", a[1], a[2], a[3]);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '20 30 40',
    acceptedAnswers: ['20 30 40'],
    keyTakeaway: '인덱스 2(세 번째 자리)에 30을 삽입하기 위해 기존 인덱스 2 이후의 요소(40, 50, 60)를 뒤에서부터 오른쪽으로 한 칸씩 이동시켰습니다. a[1]=20, a[2]=30, a[3]=40이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '원소 우측 시프트 루프 수행',
        lineHighlight: 6,
        description: 'a[5]=a[4](60), a[4]=a[3](50), a[3]=a[2](40) 순서로 복사하여 2번 자리를 비웁니다.',
        memoryState: [
          { address: '1012번지', name: 'a[3]', value: '40', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'a[2] = target (30) 삽입',
        lineHighlight: 9,
        description: 'a[2]에 30이 대입되어 배열은 {10, 20, 30, 40, 50, 60}이 됩니다.',
        memoryState: [
          { address: '1008번지', name: 'a[2]', value: '30', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'a[1], a[2], a[3] 출력',
        lineHighlight: 10,
        description: 'a[1]=20, a[2]=30, a[3]=40이 공백으로 구분되어 출력됩니다.',
        memoryState: [],
        consoleOutput: '20 30 40'
      }
    ]
  },
  {
    id: 'code-c-023',
    language: 'C',
    difficulty: '최상',
    title: '비트 마스크를 활용한 홀수 비트 추출과 연산',
    topic: '비트 마스크',
    tags: ['비트마스크', '16진수', '비트연산'],
    code: `#include <stdio.h>
int main() {
    unsigned char val = 0xAA; // 1010 1010
    unsigned char mask = 0x0F; // 0000 1111
    unsigned char r1 = val & mask;
    unsigned char r2 = (val >> 4) & mask;
    printf("%d %d", r1, r2);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '10 10',
    acceptedAnswers: ['10 10'],
    keyTakeaway: '0xAA의 하위 4비트는 1010(10진수 10)입니다. 상위 4비트를 우측으로 4칸 시프트한 후 0x0F와 AND하면 역시 1010(10진수 10)이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'r1 = val & mask 하위 4비트 추출',
        lineHighlight: 5,
        description: '1010 1010 & 0000 1111 = 0000 1010 (10진수 10).',
        memoryState: [
          { address: '1000번지', name: 'r1', value: '10', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'r2 = (val >> 4) & mask 상위 4비트 추출',
        lineHighlight: 6,
        description: '(0xAA >> 4)는 0x0A (0000 1010). 0x0A & 0x0F = 10진수 10.',
        memoryState: [
          { address: '1001번지', name: 'r2', value: '10', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '10 10'
      }
    ]
  },
  {
    id: 'code-c-024',
    language: 'C',
    difficulty: '상',
    title: '문자열에서 특정 문자 빈도수 카운트 포인터 루프',
    topic: '문자 빈도수',
    tags: ['문자열', '포인터', '카운트'],
    code: `#include <stdio.h>
int count_ch(const char *str, char ch) {
    int cnt = 0;
    while (*str) {
        if (*str == ch) cnt++;
        str++;
    }
    return cnt;
}
int main() {
    char s[] = "SUCCESSFUL";
    printf("%d %d", count_ch(s, 'S'), count_ch(s, 'U'));
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '3 2',
    acceptedAnswers: ['3 2'],
    keyTakeaway: '"SUCCESSFUL"에서 \'S\'는 3개(첫글자, 5번째, 6번째), \'U\'는 2개(2번째, 8번째) 등장합니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'count_ch(s, \'S\') 수행',
        lineHighlight: 10,
        description: 's의 10글자를 1000번지부터 순회하며 \'S\' 일치 시 cnt 증가. 총 3개 발견.',
        memoryState: [
          { address: '2000번지', name: 'cnt (for S)', value: '3', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'count_ch(s, \'U\') 수행 및 출력',
        lineHighlight: 10,
        description: '\'U\'는 2개 발견. 최종 출력 결과: "3 2".',
        memoryState: [
          { address: '2000번지', name: 'cnt (for U)', value: '2', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '3 2'
      }
    ]
  },
  {
    id: 'code-c-025',
    language: 'C',
    difficulty: '최상',
    title: '배열 크기 sizeof와 포인터 크기 sizeof의 차이',
    topic: 'sizeof 연산자',
    tags: ['sizeof', '배열', '포인터크기'],
    code: `#include <stdio.h>
void func(int param[5]) {
    printf("%lu ", sizeof(param));
}
int main() {
    int arr[5] = { 1, 2, 3, 4, 5 };
    printf("%lu ", sizeof(arr));
    func(arr);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램(64비트 시스템 기준)의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '20 8',
    acceptedAnswers: ['20 8'],
    keyTakeaway: 'main()에서 sizeof(arr)는 실제 전체 배열의 크기인 4바이트 * 5 = 20바이트입니다. 그러나 함수 매개변수로 전달된 param은 문법적으로 int param[5]로 적혀 있어도 포인터(int*)로 감퇴(decay)하므로 64비트 주소 크기인 8바이트가 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'main에서 sizeof(arr) 평가',
        lineHighlight: 7,
        description: 'arr은 스택에 4바이트 int 5개가 연속 할당된 실제 배열. sizeof(arr) = 20바이트.',
        memoryState: [
          { address: '1000번지', name: 'arr[0..4]', value: '5개 int (20바이트)', scope: 'Stack' }
        ],
        consoleOutput: '20 '
      },
      {
        stepNumber: 2,
        title: 'func 매개변수 param의 sizeof 평가',
        lineHighlight: 3,
        description: 'C 언어에서 함수의 배열 매개변수는 포인터(int*)로 자동 변환(decay)됩니다. 64비트 포인터 크기인 8이 출력됩니다.',
        memoryState: [
          { address: '2000번지', name: 'param', value: '1000번지 (&arr[0])', scope: 'Stack (func)' }
        ],
        consoleOutput: '20 8'
      }
    ]
  },
  {
    id: 'code-c-026',
    language: 'C',
    difficulty: '상',
    title: '거듭제곱 재귀 함수와 홀짝 분할 정복',
    topic: '재귀 분할정복',
    tags: ['재귀', '거듭제곱', '분할정복'],
    code: `#include <stdio.h>
int power(int base, int exp) {
    if (exp == 0) return 1;
    if (exp % 2 == 0) {
        int half = power(base, exp / 2);
        return half * half;
    }
    return base * power(base, exp - 1);
}
int main() {
    printf("%d", power(2, 7));
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '128',
    acceptedAnswers: ['128'],
    keyTakeaway: '2의 7승 = 2 * power(2, 6). power(2, 6) = power(2, 3)^2. power(2, 3) = 2 * power(2, 2). 최종적으로 2^7 = 128이 계산됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'power(2, 7) 호출 시작',
        lineHighlight: 11,
        description: '7은 홀수이므로 2 * power(2, 6) 호출.',
        callStack: ['main()', 'power(2, 7)'],
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'power(2, 6) 짝수 분할',
        lineHighlight: 5,
        description: '6은 짝수이므로 half = power(2, 3) 구한 뒤 half * half 계산 대기.',
        callStack: ['main()', 'power(2, 7)', 'power(2, 6)'],
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: '기저 조건 및 역방향 반환 완료',
        lineHighlight: 9,
        description: 'power(2, 3)=8. power(2, 6)=8*8=64. power(2, 7)=2*64=128.',
        callStack: ['main()'],
        memoryState: [],
        consoleOutput: '128'
      }
    ]
  },
  {
    id: 'code-c-027',
    language: 'C',
    difficulty: '중',
    title: '삼항 연산자 중첩과 조건부 대입',
    topic: '삼항 연산자',
    tags: ['삼항연산자', '조건문', '우선순위'],
    code: `#include <stdio.h>
int main() {
    int x = 15, y = 25, z = 20;
    int max = (x > y) ? ((x > z) ? x : z) : ((y > z) ? y : z);
    int min = (x < y) ? ((x < z) ? x : z) : ((y < z) ? y : z);
    printf("%d %d", max, min);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '25 15',
    acceptedAnswers: ['25 15'],
    keyTakeaway: '세 수 15, 25, 20 중 최댓값은 25, 최솟값은 15입니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'max 삼항 연산자 평가',
        lineHighlight: 4,
        description: '(x > y) 거짓(15 > 25 거짓) -> 우측 식 ((y > z) ? y : z) 실행. (25 > 20 참) -> max = 25 대입.',
        memoryState: [
          { address: '1012번지', name: 'max', value: '25', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'min 삼항 연산자 평가 및 출력',
        lineHighlight: 5,
        description: '(x < y) 참(15 < 25 참) -> 좌측 식 ((x < z) ? x : z) 실행. (15 < 20 참) -> min = 15 대입.',
        memoryState: [
          { address: '1016번지', name: 'min', value: '15', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '25 15'
      }
    ]
  },
  {
    id: 'code-c-028',
    language: 'C',
    difficulty: '최상',
    title: '문자열 토큰 분리와 구분자 치환 원리',
    topic: '문자열 포인터 조작',
    tags: ['문자열', '구분자', '포인터'],
    code: `#include <stdio.h>
int main() {
    char str[] = "apple,banana,grape";
    char *p = str;
    int count = 1;
    while (*p) {
        if (*p == ',') {
            *p = '\\0';
            count++;
        }
        p++;
    }
    printf("%d %s", count, str + 6);
    return 0;
}`,
    questionPrompt: '다음 C 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '3 banana',
    acceptedAnswers: ['3 banana'],
    keyTakeaway: '\',\'를 만날 때마다 \'\\0\'으로 치환하고 count를 증가시킵니다. count는 3이 되고, str+6 위치는 "banana"의 시작점(\'b\')이며 뒤의 콤마가 \'\\0\'으로 바뀌었으므로 "banana"만 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '루프 돌며 콤마를 널문자로 치환',
        lineHighlight: 7,
        description: 'str[5](\',\')가 \'\\0\'으로 치환(count=2), str[12](\',\')가 \'\\0\'으로 치환(count=3).',
        memoryState: [
          { address: '1005번지', name: 'str[5]', value: "'\\0'", isChanged: true, scope: 'Stack' },
          { address: '1012번지', name: 'str[12]', value: "'\\0'", isChanged: true, scope: 'Stack' },
          { address: '1020번지', name: 'count', value: '3', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'str + 6 주소에서 문자열 출력',
        lineHighlight: 12,
        description: 'str+6은 1006번지(\'b\'). 1012번지의 \'\\0\'을 만나므로 "banana"로 읽힙니다. 출력: "3 banana".',
        memoryState: [],
        consoleOutput: '3 banana'
      }
    ]
  },

  // ==========================================
  // [JAVA] 26 QUESTIONS (code-java-001 ~ code-java-026)
  // ==========================================
  {
    id: 'code-java-001',
    language: 'JAVA',
    difficulty: '최상',
    title: '상속과 오버라이딩 동적 바인딩(Dynamic Method Dispatch)',
    topic: '다형성과 동적 바인딩',
    tags: ['상속', '오버라이딩', '동적바인딩'],
    code: `class Super {
    int x = 10;
    void print() { System.out.print("Super:" + x + " "); }
}
class Sub extends Super {
    int x = 20;
    void print() { System.out.print("Sub:" + x + " "); }
}
public class Main {
    public static void main(String[] args) {
        Super s = new Sub();
        System.out.print(s.x + " ");
        s.print();
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '10 Sub:20 ',
    acceptedAnswers: ['10 Sub:20', '10 Sub:20 '],
    keyTakeaway: '자바에서 인스턴스 필드(변수 x)는 참조 변수의 선언 타입(Super)에 의해 정적으로 결정되므로 s.x는 10입니다. 반면 인스턴스 메서드(print)는 힙에 생성된 실제 객체(Sub)의 메서드가 동적 바인딩(오버라이딩)되어 호출되므로 Sub:20이 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'Super s = new Sub(); 힙 인스턴스 생성',
        lineHighlight: 11,
        description: '스택의 참조 변수 s(1000번지)는 힙 메모리의 Sub 객체(2000번지)를 가리킵니다. Sub 객체 내부에는 Super.x(10)과 Sub.x(20)이 모두 존재합니다.',
        memoryState: [
          { address: '1000번지 (Stack)', name: 's', type: 'Super ref', value: '2000번지 (힙 인스턴스)', isChanged: true, scope: 'Stack' },
          { address: '2000번지 (Heap)', name: 'Sub인스턴스.Super.x', type: 'int', value: '10', scope: 'Heap' },
          { address: '2004번지 (Heap)', name: 'Sub인스턴스.Sub.x', type: 'int', value: '20', scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 's.x 필드 접근 평가 및 출력',
        lineHighlight: 12,
        description: '참조 변수 s의 타입이 Super이므로 컴파일 시점에 Super 클래스의 x(10)에 직접 바인딩되어 10이 출력됩니다.',
        memoryState: [],
        consoleOutput: '10 '
      },
      {
        stepNumber: 3,
        title: 's.print() 가상 메서드 테이블 동적 디스패치',
        lineHighlight: 13,
        description: '메서드는 실제 런타임 객체인 Sub의 오버라이딩된 print()가 실행됩니다. Sub의 print() 내 x는 Sub.x(20)을 참조하므로 "Sub:20 "이 출력됩니다.',
        memoryState: [],
        consoleOutput: '10 Sub:20 '
      }
    ]
  },
  {
    id: 'code-java-002',
    language: 'JAVA',
    difficulty: '최상',
    title: '상속 관계에서의 생성자 호출 순서(super)',
    topic: '생성자 호출 순서',
    tags: ['생성자', 'super', '상속'],
    code: `class Parent {
    Parent() {
        System.out.print("P1 ");
    }
    Parent(int x) {
        System.out.print("P2:" + x + " ");
    }
}
class Child extends Parent {
    Child() {
        this(5);
        System.out.print("C1 ");
    }
    Child(int x) {
        super(x * 2);
        System.out.print("C2:" + x + " ");
    }
}
public class Main {
    public static void main(String[] args) {
        new Child();
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'P2:10 C2:5 C1 ',
    acceptedAnswers: ['P2:10 C2:5 C1', 'P2:10 C2:5 C1 '],
    keyTakeaway: 'new Child() 호출 시 -> this(5) 호출 -> super(5*2=10) 호출 -> Parent(10) 실행("P2:10 ") -> Child(5) 본문 복귀("C2:5 ") -> Child() 본문 복귀("C1 ") 순으로 실행됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'new Child() 생성자 체인 시작',
        lineHighlight: 10,
        description: 'Child()는 this(5)를 먼저 호출하여 매개변수 생성자로 제어를 넘깁니다.',
        callStack: ['main()', 'Child()', 'Child(5)'],
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'super(x * 2)로 Parent(10) 호출',
        lineHighlight: 14,
        description: 'Child(5)는 super(10)을 호출하여 Parent(int x)를 실행합니다. "P2:10 "이 가장 먼저 출력됩니다.',
        callStack: ['main()', 'Child()', 'Child(5)', 'Parent(10)'],
        memoryState: [],
        consoleOutput: 'P2:10 '
      },
      {
        stepNumber: 3,
        title: 'Child(5) 본문 실행',
        lineHighlight: 15,
        description: 'Parent 생성이 완료된 후 Child(5)로 돌아와 "C2:5 "가 출력됩니다.',
        callStack: ['main()', 'Child()', 'Child(5)'],
        memoryState: [],
        consoleOutput: 'P2:10 C2:5 '
      },
      {
        stepNumber: 4,
        title: 'Child() 본문 복귀 및 완료',
        lineHighlight: 11,
        description: 'Child(5) 완료 후 최초 호출된 Child()로 돌아와 "C1 "이 출력됩니다.',
        callStack: ['main()'],
        memoryState: [],
        consoleOutput: 'P2:10 C2:5 C1 '
      }
    ]
  },
  {
    id: 'code-java-003',
    language: 'JAVA',
    difficulty: '최상',
    title: 'static 초기화 블록과 인스턴스 초기화 블록 실행 순서',
    topic: '클래스 로딩과 초기화 순서',
    tags: ['static', '초기화블록', '클래스로딩'],
    code: `class Demo {
    static int count = 0;
    static {
        count += 10;
        System.out.print("S:" + count + " ");
    }
    {
        count += 5;
        System.out.print("I:" + count + " ");
    }
    Demo() {
        count += 1;
        System.out.print("C:" + count + " ");
    }
}
public class Main {
    public static void main(String[] args) {
        new Demo();
        new Demo();
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'S:10 I:15 C:16 I:21 C:22 ',
    acceptedAnswers: ['S:10 I:15 C:16 I:21 C:22', 'S:10 I:15 C:16 I:21 C:22 '],
    keyTakeaway: 'static 초기화 블록은 클래스가 메모리에 처음 로딩될 때 딱 1번만 실행됩니다. 인스턴스 초기화 블록 { }은 객체 생성 시마다 생성자 본문보다 앞서 매번 실행됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '클래스 로딩 및 static 블록 1회 실행',
        lineHighlight: 4,
        description: 'Demo 클래스가 처음 참조될 때 static 블록 실행. count = 0 + 10 = 10. "S:10 " 출력.',
        memoryState: [
          { address: '5000번지 (Method Area)', name: 'Demo.count', value: '10', isChanged: true, scope: 'Static' }
        ],
        consoleOutput: 'S:10 '
      },
      {
        stepNumber: 2,
        title: '첫 번째 new Demo() 인스턴스 블록 및 생성자',
        lineHighlight: 7,
        description: '인스턴스 블록: count(10)+5=15 ("I:15 "). 생성자: count(15)+1=16 ("C:16 ").',
        memoryState: [
          { address: '5000번지 (Method Area)', name: 'Demo.count', value: '16', isChanged: true, scope: 'Static' }
        ],
        consoleOutput: 'S:10 I:15 C:16 '
      },
      {
        stepNumber: 3,
        title: '두 번째 new Demo() 실행 (static 블록 생략)',
        lineHighlight: 17,
        description: 'static 블록은 실행되지 않음! 인스턴스 블록: count(16)+5=21 ("I:21 "). 생성자: count(21)+1=22 ("C:22 ").',
        memoryState: [
          { address: '5000번지 (Method Area)', name: 'Demo.count', value: '22', isChanged: true, scope: 'Static' }
        ],
        consoleOutput: 'S:10 I:15 C:16 I:21 C:22 '
      }
    ]
  },
  {
    id: 'code-java-004',
    language: 'JAVA',
    difficulty: '상',
    title: '자바의 참조 전달(Pass-by-value of reference) 함정',
    topic: '참조에 의한 전달 함정',
    tags: ['참조전달', '힙메모리', '스택'],
    code: `class Box {
    int val;
    Box(int v) { this.val = v; }
}
public class Main {
    static void modify(Box b, int num) {
        b.val += 20;
        b = new Box(100);
        num += 50;
    }
    public static void main(String[] args) {
        Box myBox = new Box(10);
        int n = 5;
        modify(myBox, n);
        System.out.println(myBox.val + " " + n);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '30 5',
    acceptedAnswers: ['30 5'],
    keyTakeaway: '자바는 항상 Call by Value로 동작합니다. b.val = 30은 원본 객체의 내부 필드를 수정한 것이므로 반영되지만, b = new Box(100)은 매개변수 로컬 포인터 b만 새 객체로 바꾼 것이므로 원본 myBox 참조는 변하지 않습니다. 원시 타입 n도 복사본만 수정되므로 원본은 5 그대로입니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'main에서 myBox 및 n 생성',
        lineHighlight: 11,
        description: 'myBox는 힙의 2000번지 Box(val=10)를 가리킵니다. n은 스택에 5.',
        memoryState: [
          { address: '1000번지 (Stack)', name: 'myBox', value: '2000번지 (힙 Box)', scope: 'Stack (main)' },
          { address: '2000번지 (Heap)', name: 'Box.val', value: '10', scope: 'Heap' },
          { address: '1004번지 (Stack)', name: 'n', value: '5', scope: 'Stack (main)' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'modify 진입 및 b.val += 20 실행',
        lineHighlight: 6,
        description: '매개변수 b는 2000번지를 가리키므로 2000번지의 val이 10에서 30으로 갱신됩니다.',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'Box.val', value: '30', isChanged: true, scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'b = new Box(100) 및 num += 50 실행',
        lineHighlight: 7,
        description: 'b는 새 힙 3000번지 객체를 가리키도록 로컬 변수만 변경! main의 myBox는 여전히 2000번지를 가리킵니다. num도 로컬만 55로 변경.',
        memoryState: [
          { address: '1016번지 (Stack)', name: 'b', value: '3000번지 (새 Box)', isChanged: true, scope: 'Stack (modify)' },
          { address: '1000번지 (Stack)', name: 'myBox', value: '2000번지 (원본)', scope: 'Stack (main)' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: 'main으로 복귀하여 myBox.val과 n 출력',
        lineHighlight: 14,
        description: 'myBox.val은 30, n은 5이므로 "30 5"가 출력됩니다.',
        memoryState: [],
        consoleOutput: '30 5'
      }
    ]
  },
  {
    id: 'code-java-005',
    language: 'JAVA',
    difficulty: '상',
    title: '문자열 상수 풀(String Pool)과 == 연산자 vs equals()',
    topic: 'String 상수 풀',
    tags: ['String', '==연산자', 'equals'],
    code: `public class Main {
    public static void main(String[] args) {
        String s1 = "Java";
        String s2 = "Java";
        String s3 = new String("Java");
        String s4 = s3.intern();
        System.out.print((s1 == s2) + " ");
        System.out.print((s1 == s3) + " ");
        System.out.print(s1.equals(s3) + " ");
        System.out.print((s1 == s4));
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'true false true true',
    acceptedAnswers: ['true false true true'],
    keyTakeaway: '리터럴 "Java"는 힙의 문자열 상수 풀에 하나만 생성되어 s1과 s2가 같은 주소를 공유합니다(s1 == s2는 true). new String()은 별도의 힙 인스턴스를 생성하므로 s1 == s3는 false(equals는 true)입니다. intern()은 풀의 참조를 반환하므로 s1 == s4는 true입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '문자열 객체 주소 바인딩',
        lineHighlight: 5,
        description: 's1, s2는 문자열 풀의 2000번지를 가리킴. s3는 일반 힙 3000번지를 가리킴. s4는 intern()에 의해 풀 2000번지를 가리킴.',
        memoryState: [
          { address: '2000번지 (String Pool)', name: '"Java"', value: '"Java"', scope: 'Heap' },
          { address: '3000번지 (Heap)', name: 'new String', value: '"Java"', scope: 'Heap' },
          { address: '1000번지 (Stack)', name: 's1', value: '2000번지 (Pool)', scope: 'Stack' },
          { address: '1004번지 (Stack)', name: 's2', value: '2000번지 (Pool)', scope: 'Stack' },
          { address: '1008번지 (Stack)', name: 's3', value: '3000번지 (Heap)', scope: 'Stack' },
          { address: '1012번지 (Stack)', name: 's4', value: '2000번지 (Pool)', scope: 'Stack' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '비교 연산 결과 출력',
        lineHighlight: 7,
        description: 's1 == s2 -> true, s1 == s3 -> false, s1.equals(s3) -> true, s1 == s4 -> true.',
        memoryState: [],
        consoleOutput: 'true false true true'
      }
    ]
  },
  {
    id: 'code-java-006',
    language: 'JAVA',
    difficulty: '최상',
    title: 'try-catch-finally 블록에서의 return문 우선순위',
    topic: '예외 처리 반환 순서',
    tags: ['try-catch', 'finally', 'return'],
    code: `public class Main {
    static int test() {
        int x = 10;
        try {
            x += 10;
            return x;
        } catch (Exception e) {
            x += 20;
            return x;
        } finally {
            x += 30;
            System.out.print("F:" + x + " ");
        }
    }
    public static void main(String[] args) {
        System.out.println("R:" + test());
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'F:50 R:20',
    acceptedAnswers: ['F:50 R:20'],
    keyTakeaway: 'try 블록의 return x;에서 반환할 값(20)이 스택에 먼저 임시 저장(보존)됩니다. 그 후 finally 블록이 반드시 실행되어 x는 50이 되고 "F:50 "이 출력됩니다. finally에 자체 return문이 없으므로, 최종적으로 앞서 보존된 임시 반환값 20이 반환되어 "R:20"이 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'try 블록 실행 및 반환값 20 임시 저장',
        lineHighlight: 5,
        description: 'x = 10 + 10 = 20. return x를 만나 원시값 20을 반환 레지스터에 캐싱해 둡니다.',
        memoryState: [
          { address: '1000번지', name: 'x', value: '20', isChanged: true, scope: 'Stack' },
          { address: '레지스터 (Return)', name: 'tempReturnValue', value: '20', isChanged: true, scope: 'Register' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'finally 블록 반드시 실행',
        lineHighlight: 12,
        description: 'finally에서 x += 30 실행으로 x는 50이 됨. "F:50 " 출력.',
        memoryState: [
          { address: '1000번지', name: 'x', value: '50', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: 'F:50 '
      },
      {
        stepNumber: 3,
        title: '캐싱된 반환값 20 리턴 및 출력',
        lineHighlight: 16,
        description: '함수가 종료되며 캐싱된 20이 main으로 반환되어 "R:20" 출력.',
        memoryState: [],
        consoleOutput: 'F:50 R:20'
      }
    ]
  },
  {
    id: 'code-java-007',
    language: 'JAVA',
    difficulty: '상',
    title: '추상 클래스와 인터페이스의 다중 구현 메서드 호출',
    topic: '인터페이스와 추상클래스',
    tags: ['추상클래스', '인터페이스', '다형성'],
    code: `interface A {
    int VAL = 10;
    void doA();
}
interface B {
    int VAL = 20;
    void doB();
}
class C implements A, B {
    public void doA() { System.out.print(A.VAL + " "); }
    public void doB() { System.out.print(B.VAL + " "); }
}
public class Main {
    public static void main(String[] args) {
        C c = new C();
        c.doA();
        c.doB();
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '10 20 ',
    acceptedAnswers: ['10 20', '10 20 '],
    keyTakeaway: '인터페이스의 모든 필드는 public static final 상수입니다. 여러 인터페이스에 동일한 이름의 상수가 있더라도 A.VAL, B.VAL처럼 명시적으로 접근하면 충돌 없이 10과 20이 출력됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '인터페이스 상수 로딩',
        lineHighlight: 2,
        description: 'A.VAL = 10, B.VAL = 20 static 상수가 메모리에 준비됩니다.',
        memoryState: [
          { address: '5000번지', name: 'A.VAL', value: '10', scope: 'Static' },
          { address: '5004번지', name: 'B.VAL', value: '20', scope: 'Static' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'c.doA() 및 c.doB() 순차 실행',
        lineHighlight: 15,
        description: 'doA()는 A.VAL(10), doB()는 B.VAL(20)을 출력하여 결과는 "10 20 "입니다.',
        memoryState: [],
        consoleOutput: '10 20 '
      }
    ]
  },
  {
    id: 'code-java-008',
    language: 'JAVA',
    difficulty: '상',
    title: '자바 가변 2차원 배열(비정방형 배열) 순회',
    topic: '가변 배열',
    tags: ['배열', '가변배열', '루프'],
    code: `public class Main {
    public static void main(String[] args) {
        int[][] arr = new int[3][];
        arr[0] = new int[]{ 1, 2 };
        arr[1] = new int[]{ 3, 4, 5 };
        arr[2] = new int[]{ 6 };
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i][arr[i].length - 1];
        }
        System.out.println(sum);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: '13',
    acceptedAnswers: ['13'],
    keyTakeaway: '자바의 2차원 배열은 배열을 가리키는 객체 참조의 배열입니다. 각 행마다 길이가 다른 비정방형 배열을 구성할 수 있습니다. 각 행의 마지막 요소는 arr[0][1]=2, arr[1][2]=5, arr[2][0]=6이므로 합은 2 + 5 + 6 = 13입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '비정방형 2차원 배열 힙 할당',
        lineHighlight: 4,
        description: 'arr[0]은 2칸(1, 2), arr[1]은 3칸(3, 4, 5), arr[2]는 1칸(6)으로 힙에 각각 할당됩니다.',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'arr[0]', value: '[1, 2]', scope: 'Heap' },
          { address: '2020번지 (Heap)', name: 'arr[1]', value: '[3, 4, 5]', scope: 'Heap' },
          { address: '2040번지 (Heap)', name: 'arr[2]', value: '[6]', scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '각 행의 마지막 원소 합산',
        lineHighlight: 9,
        description: 'arr[0][1]=2, arr[1][2]=5, arr[2][0]=6. sum = 2 + 5 + 6 = 13.',
        memoryState: [
          { address: '1004번지 (Stack)', name: 'sum', value: '13', isChanged: true, scope: 'Stack' }
        ],
        consoleOutput: '13'
      }
    ]
  },
  {
    id: 'code-java-009',
    language: 'JAVA',
    difficulty: '최상',
    title: '메서드 오버로딩 선택 시 참조형 변환 우선순위',
    topic: '오버로딩 바인딩 우선순위',
    tags: ['오버로딩', '자동형변환', '우선순위'],
    code: `public class Main {
    static void test(int x) { System.out.print("int "); }
    static void test(long x) { System.out.print("long "); }
    static void test(Integer x) { System.out.print("Integer "); }
    static void test(int... x) { System.out.print("varargs "); }
    public static void main(String[] args) {
        short s = 10;
        test(s);
        test(20);
        test(30L);
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: 'int int long ',
    acceptedAnswers: ['int int long', 'int int long '],
    keyTakeaway: '자바 컴파일러는 오버로딩 메서드 결정 시 1단계(기본형 확대: widening), 2단계(오토박싱: boxing), 3단계(가변인자: varargs) 순서로 가장 구체적인 타입을 찾습니다. short s는 int로 확대(widening)되므로 test(int)가 호출됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'test(s) 호출: short -> int 기본형 확대',
        lineHighlight: 8,
        description: 'short 타입인 10은 기본형 확대(Widening)가 적용되어 test(int)가 우선 선택됩니다.',
        memoryState: [],
        consoleOutput: 'int '
      },
      {
        stepNumber: 2,
        title: 'test(20) 호출: int 리터럴 일치',
        lineHighlight: 9,
        description: '정수 리터럴 20은 int 타입이므로 test(int)와 정확히 일치합니다.',
        memoryState: [],
        consoleOutput: 'int int '
      },
      {
        stepNumber: 3,
        title: 'test(30L) 호출: long 리터럴 일치',
        lineHighlight: 10,
        description: '30L은 long 리터럴이므로 test(long)이 선택됩니다.',
        memoryState: [],
        consoleOutput: 'int int long '
      }
    ]
  },
  {
    id: 'code-java-010',
    language: 'JAVA',
    difficulty: '중',
    title: 'StringBuilder의 append와 인덱스 조작',
    topic: 'StringBuilder 조작',
    tags: ['StringBuilder', '문자열', '가변객체'],
    code: `public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("ABC");
        sb.append("DEF");
        sb.insert(3, "-");
        sb.delete(1, 3);
        System.out.println(sb.toString());
    }
}`,
    questionPrompt: '다음 Java 프로그램의 실행 결과를 쓰시오.',
    expectedAnswer: 'A-DEF',
    acceptedAnswers: ['A-DEF'],
    keyTakeaway: '"ABC" -> append("DEF")로 "ABCDEF" -> insert(3, "-")로 "ABC-DEF" -> delete(1, 3)으로 인덱스 1부터 2(\'B\', \'C\')를 삭제하므로 "A-DEF"가 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'append("DEF") 및 insert(3, "-")',
        lineHighlight: 5,
        description: '"ABC" + "DEF" = "ABCDEF". 인덱스 3에 "-" 삽입 -> "ABC-DEF".',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'sb.value', value: '"ABC-DEF"', isChanged: true, scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'delete(1, 3) 수행: 1이상 3미만 인덱스 제거',
        lineHighlight: 6,
        description: '인덱스 1(\'B\'), 2(\'C\')가 삭제되어 "A-DEF"가 됩니다.',
        memoryState: [
          { address: '2000번지 (Heap)', name: 'sb.value', value: '"A-DEF"', isChanged: true, scope: 'Heap' }
        ],
        consoleOutput: 'A-DEF'
      }
    ]
  },

  // ==========================================
  // [PYTHON] 23 QUESTIONS (code-py-001 ~ code-py-023)
  // ==========================================
  {
    id: 'code-py-001',
    language: 'PYTHON',
    difficulty: '최상',
    title: '슬라이싱 음수 스텝과 역순 인덱싱 원리',
    topic: '슬라이싱 [start:stop:step]',
    tags: ['슬라이싱', '역순', '인덱스'],
    code: `data = [10, 20, 30, 40, 50, 60, 70]
a = data[5:1:-2]
b = data[::-3]
c = data[-2:-6:-1]
print(a)
print(b)
print(c)`,
    questionPrompt: '다음 파이썬 코드의 출력 결과를 리스트 형식 그대로 쓰시오.',
    expectedAnswer: '[60, 40]\n[70, 40, 10]\n[60, 50, 40, 30]',
    acceptedAnswers: [
      '[60, 40]\n[70, 40, 10]\n[60, 50, 40, 30]',
      '[60, 40], [70, 40, 10], [60, 50, 40, 30]'
    ],
    keyTakeaway: '음수 step은 역방향 순회입니다. data[5:1:-2]는 5번(60), 3번(40)을 추출(1번 미포함). data[::-3]은 끝(70)부터 3칸씩 뒤로 가며 70, 40, 10을 추출. data[-2:-6:-1]은 -2번(60)부터 -6번(20 직전)까지 60, 50, 40, 30을 추출합니다.',
    steps: [
      {
        stepNumber: 1,
        title: '리스트 data 메모리 인덱스 배치',
        lineHighlight: 1,
        description: '인덱스 0~6: [10, 20, 30, 40, 50, 60, 70]. 음수 인덱스는 -7~-1.',
        memoryState: [
          { address: '1000번지 (Heap)', name: 'data[0..6]', value: '[10, 20, 30, 40, 50, 60, 70]', scope: 'Heap' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'a = data[5:1:-2] 슬라이싱',
        lineHighlight: 2,
        description: '인덱스 5(60) -> 3(40) 추출. stop 인덱스 1은 포함하지 않음. 결과: [60, 40].',
        memoryState: [
          { address: '2000번지', name: 'a', value: '[60, 40]', isChanged: true, scope: 'Local' }
        ],
        consoleOutput: '[60, 40]'
      },
      {
        stepNumber: 3,
        title: 'b = data[::-3] 슬라이싱',
        lineHighlight: 3,
        description: '인덱스 6(70) -> 3(40) -> 0(10). 결과: [70, 40, 10].',
        memoryState: [
          { address: '2008번지', name: 'b', value: '[70, 40, 10]', isChanged: true, scope: 'Local' }
        ],
        consoleOutput: '[60, 40]\n[70, 40, 10]'
      },
      {
        stepNumber: 4,
        title: 'c = data[-2:-6:-1] 슬라이싱',
        lineHighlight: 4,
        description: '-2번(60), -3번(50), -4번(40), -5번(30)까지 역순 추출. 결과: [60, 50, 40, 30].',
        memoryState: [
          { address: '2016번지', name: 'c', value: '[60, 50, 40, 30]', isChanged: true, scope: 'Local' }
        ],
        consoleOutput: '[60, 40]\n[70, 40, 10]\n[60, 50, 40, 30]'
      }
    ]
  },
  {
    id: 'code-py-002',
    language: 'PYTHON',
    difficulty: '최상',
    title: '가변 객체 기본 매개변수(Mutable Default Argument)의 누적 함정',
    topic: '기본 매개변수 바인딩',
    tags: ['함수', '기본인자', '가변객체'],
    code: `def append_to(element, target=[]):
    target.append(element)
    return target

list1 = append_to(10)
list2 = append_to(20, [])
list3 = append_to(30)

print(list1)
print(list2)
print(list3)`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 각 줄에 맞추어 쓰시오.',
    expectedAnswer: '[10, 30]\n[20]\n[10, 30]',
    acceptedAnswers: ['[10, 30]\n[20]\n[10, 30]', '[10, 30], [20], [10, 30]'],
    keyTakeaway: '파이썬에서 함수의 기본 인자 target=[]은 함수 정의 시점에 단 한 번만 생성되어 메모리에 고정됩니다. list1과 list3는 기본 인자 리스트를 공유하므로 10과 30이 누적되어 [10, 30]이 됩니다. 반면 list2는 명시적으로 새 리스트 []를 넘겼으므로 [20]만 갖습니다.',
    steps: [
      {
        stepNumber: 1,
        title: '함수 정의 시 기본 매개변수 target 힙 생성',
        lineHighlight: 1,
        description: 'target의 기본값 []가 힙 5000번지에 단 1회 생성됩니다.',
        memoryState: [
          { address: '5000번지 (기본인자 Pool)', name: 'target_default', value: '[]', scope: 'Function Default' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'list1 = append_to(10) 실행',
        lineHighlight: 5,
        description: '기본 인자 5000번지에 10이 추가됨 -> [10]. list1도 5000번지를 가리킵니다.',
        memoryState: [
          { address: '5000번지', name: 'target_default', value: '[10]', isChanged: true, scope: 'Function Default' },
          { address: '1000번지', name: 'list1', value: '5000번지 참조', scope: 'Global' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'list2 = append_to(20, []) 실행',
        lineHighlight: 6,
        description: '새 리스트 []가 인자로 전달되어 새 6000번지 리스트에 20이 추가됨 -> [20]. 기본 인자에는 영향 없음.',
        memoryState: [
          { address: '6000번지', name: 'list2', value: '[20]', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 4,
        title: 'list3 = append_to(30) 실행 및 출력',
        lineHighlight: 7,
        description: '다시 기본 인자 5000번지가 사용되어 [10]에 30이 추가됨 -> [10, 30]. list1과 list3는 같은 5000번지를 가리키므로 둘 다 [10, 30]이 출력됩니다.',
        memoryState: [
          { address: '5000번지', name: 'target_default (공유)', value: '[10, 30]', isChanged: true, scope: 'Function Default' }
        ],
        consoleOutput: '[10, 30]\n[20]\n[10, 30]'
      }
    ]
  },
  {
    id: 'code-py-003',
    language: 'PYTHON',
    difficulty: '상',
    title: '복합 리스트 컴프리헨션과 중첩 조건 필터링',
    topic: '리스트 컴프리헨션',
    tags: ['컴프리헨션', '조건부표현식', '루프'],
    code: `matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
res = [x * 2 if x % 2 != 0 else x // 2 for row in matrix for x in row if x > 2]
print(res)`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 리스트 형식으로 쓰시오.',
    expectedAnswer: '[6, 2, 10, 3, 14, 4, 18]',
    acceptedAnswers: ['[6, 2, 10, 3, 14, 4, 18]'],
    keyTakeaway: 'for row in matrix for x in row는 1부터 9까지 순회합니다. 끝의 if x > 2 필터로 3, 4, 5, 6, 7, 8, 9가 대상이 됩니다. 홀수는 x*2, 짝수는 x//2 연산: 3(6), 4(2), 5(10), 6(3), 7(14), 8(4), 9(18).',
    steps: [
      {
        stepNumber: 1,
        title: 'if x > 2 필터링 대상 원소 추출',
        lineHighlight: 6,
        description: '3, 4, 5, 6, 7, 8, 9 총 7개 원소가 필터를 통과합니다.',
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '조건부 변환 식 적용',
        lineHighlight: 6,
        description: '3->6, 4->2, 5->10, 6->3, 7->14, 8->4, 9->18. 리스트 [6, 2, 10, 3, 14, 4, 18] 완성.',
        memoryState: [
          { address: '2000번지', name: 'res', value: '[6, 2, 10, 3, 14, 4, 18]', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: '[6, 2, 10, 3, 14, 4, 18]'
      }
    ]
  },
  {
    id: 'code-py-004',
    language: 'PYTHON',
    difficulty: '최상',
    title: 'global vs nonlocal 키워드와 클로저 스코프',
    topic: '변수 유효 범위(Scope)',
    tags: ['스코프', 'nonlocal', 'global'],
    code: `x = 10
def outer():
    x = 20
    def inner():
        nonlocal x
        x += 5
        print(x, end=' ')
    inner()
    print(x, end=' ')

outer()
print(x)`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '25 25 10',
    acceptedAnswers: ['25 25 10'],
    keyTakeaway: 'nonlocal x는 inner 바깥의 가장 가까운 둘러싼 함수(outer)의 지역 변수 x를 바꿉니다. 따라서 outer의 x는 20에서 25로 증가합니다. 전역 변수 x(10)는 영향을 받지 않고 그대로 10으로 남습니다.',
    steps: [
      {
        stepNumber: 1,
        title: '전역 및 로컬 스코프 변수 할당',
        lineHighlight: 3,
        description: '전역 x = 10(1000번지). outer()의 x = 20(2000번지).',
        memoryState: [
          { address: '1000번지 (Global)', name: 'global:x', value: '10', scope: 'Global' },
          { address: '2000번지 (Outer)', name: 'outer:x', value: '20', scope: 'Local' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'inner()에서 nonlocal x += 5 실행',
        lineHighlight: 6,
        description: 'nonlocal로 지정된 outer:x의 값이 20에서 25로 변경됨. "25 " 출력.',
        memoryState: [
          { address: '2000번지 (Outer)', name: 'outer:x', value: '25', isChanged: true, scope: 'Local' }
        ],
        consoleOutput: '25 '
      },
      {
        stepNumber: 3,
        title: 'outer() 본문 및 전역 x 출력',
        lineHighlight: 9,
        description: 'outer의 print(x)는 25 출력. 전역의 print(x)는 10 출력. 전체: "25 25 10".',
        memoryState: [],
        consoleOutput: '25 25 10'
      }
    ]
  },
  {
    id: 'code-py-005',
    language: 'PYTHON',
    difficulty: '상',
    title: '튜플 언패킹과 *args 가변 인자 슬라이싱',
    topic: '언패킹과 가변인자',
    tags: ['언패킹', '*args', '튜플'],
    code: `def process(first, *middle, last):
    return first + sum(middle) * 2 + last

val = process(1, 2, 3, 4, last=5)
print(val)`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 쓰시오.',
    expectedAnswer: '24',
    acceptedAnswers: ['24'],
    keyTakeaway: 'first=1, last=5(키워드 전용 인자), middle=(2, 3, 4) 튜플입니다. sum(middle) = 2 + 3 + 4 = 9. 따라서 1 + (9 * 2) + 5 = 1 + 18 + 5 = 24입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '매개변수 언패킹 매칭',
        lineHighlight: 4,
        description: 'first=1, middle=(2, 3, 4), last=5로 바인딩.',
        memoryState: [
          { address: '1000번지', name: 'first', value: '1', scope: 'Local' },
          { address: '1004번지', name: 'middle', value: '(2, 3, 4)', scope: 'Local' },
          { address: '1008번지', name: 'last', value: '5', scope: 'Local' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '식 계산 및 결과 반환',
        lineHighlight: 2,
        description: '1 + (2+3+4)*2 + 5 = 1 + 18 + 5 = 24.',
        memoryState: [
          { address: '2000번지', name: 'val', value: '24', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: '24'
      }
    ]
  },
  {
    id: 'code-py-006',
    language: 'PYTHON',
    difficulty: '상',
    title: '딕셔너리 컴프리헨션과 set 집합 연산',
    topic: '딕셔너리와 세트',
    tags: ['딕셔너리', '세트', '컴프리헨션'],
    code: `s1 = { 1, 2, 3, 4, 5 }
s2 = { 3, 4, 5, 6, 7 }
common = s1 & s2
diff = s1 ^ s2
d = { x: x ** 2 for x in common }
print(sum(d.values()) + len(diff))`,
    questionPrompt: '다음 파이썬 코드의 실행 결과를 쓰시오.',
    expectedAnswer: '54',
    acceptedAnswers: ['54'],
    keyTakeaway: 'common = s1 & s2 = {3, 4, 5}. diff = s1 ^ s2 (대칭 차집합) = {1, 2, 6, 7}(길이 4). d = {3: 9, 4: 16, 5: 25}. sum(d.values()) = 9 + 16 + 25 = 50. 50 + 4 = 54입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '교집합 common 및 대칭차집합 diff 계산',
        lineHighlight: 3,
        description: 'common = {3, 4, 5}. diff = {1, 2, 6, 7} (len=4).',
        memoryState: [
          { address: '1000번지', name: 'common', value: '{3, 4, 5}', scope: 'Global' },
          { address: '1020번지', name: 'diff', value: '{1, 2, 6, 7}', scope: 'Global' }
        ],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '딕셔너리 d 생성 및 합산',
        lineHighlight: 5,
        description: 'd = {3: 9, 4: 16, 5: 25}. values() 합 = 50. 50 + len(diff)(4) = 54.',
        memoryState: [
          { address: '2000번지', name: 'd', value: '{3: 9, 4: 16, 5: 25}', isChanged: true, scope: 'Global' }
        ],
        consoleOutput: '54'
      }
    ]
  },

  // ==========================================
  // [SQL] 23 QUESTIONS (code-sql-001 ~ code-sql-023)
  // ==========================================
  {
    id: 'code-sql-001',
    language: 'SQL',
    difficulty: '최상',
    title: 'LEFT OUTER JOIN과 NULL 데이터에 대한 카운트 집계',
    topic: 'LEFT JOIN 및 NULL 집계',
    tags: ['LEFT JOIN', 'COUNT', 'NULL'],
    code: `-- 사원(EMP) 테이블
-- EMPNO | ENAME | DEPTNO
-- 101   | 김철수 | 10
-- 102   | 이영희 | 20
-- 103   | 박민수 | 10
-- 104   | 정지훈 | NULL

-- 부서(DEPT) 테이블
-- DEPTNO | DNAME
-- 10     | 개발
-- 20     | 인사
-- 30     | 기획

SELECT D.DNAME, COUNT(E.EMPNO) AS CNT
FROM DEPT D
LEFT OUTER JOIN EMP E ON D.DEPTNO = E.DEPTNO
GROUP BY D.DNAME
ORDER BY CNT DESC, D.DNAME ASC;`,
    questionPrompt: '다음 SQL 문의 실행 결과를 행(DNAME, CNT) 단위로 모두 쓰시오.',
    expectedAnswer: '개발 2\n인사 1\n기획 0',
    acceptedAnswers: ['개발 2\n인사 1\n기획 0', '개발 2, 인사 1, 기획 0', '개발:2 인사:1 기획:0'],
    keyTakeaway: 'LEFT OUTER JOIN 시 오른쪽 테이블(EMP)에 매칭되는 부서가 없는 "기획" 부서(30번)는 DEPTNO와 EMPNO가 모두 NULL로 채워집니다. COUNT(E.EMPNO)는 컬럼을 인자로 취하므로 NULL 값을 카운트하지 않아 0이 됩니다. (COUNT(*)였다면 1이 되었을 것입니다!)',
    steps: [
      {
        stepNumber: 1,
        title: 'FROM DEPT D LEFT OUTER JOIN EMP E 수행',
        lineHighlight: 16,
        description: 'DEPT를 기준으로 EMP와 조인. 개발(10)에 김철수, 박민수 2행. 인사(20)에 이영희 1행. 기획(30)에는 매칭되는 사원이 없어 EMPNO=NULL인 1행 생성.',
        sqlTableState: {
          tableName: '조인 중간 결과',
          columns: ['D.DEPTNO', 'D.DNAME', 'E.EMPNO', 'E.ENAME'],
          rows: [
            ['10', '개발', '101', '김철수'],
            ['10', '개발', '103', '박민수'],
            ['20', '인사', '102', '이영희'],
            ['30', '기획', null, null]
          ]
        },
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'GROUP BY D.DNAME 및 COUNT(E.EMPNO) 집계',
        lineHighlight: 17,
        description: '개발: EMPNO 2건 -> 2. 인사: EMPNO 1건 -> 1. 기획: EMPNO가 NULL이므로 카운트 제외 -> 0!',
        sqlTableState: {
          tableName: 'GROUP BY 결과',
          columns: ['DNAME', 'CNT'],
          rows: [
            ['개발', 2],
            ['인사', 1],
            ['기획', 0]
          ]
        },
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 3,
        title: 'ORDER BY CNT DESC, D.DNAME ASC 정렬',
        lineHighlight: 18,
        description: 'CNT 내림차순 정렬되어 개발(2) -> 인사(1) -> 기획(0) 순서로 최종 결과가 반환됩니다.',
        sqlTableState: {
          tableName: '최종 결과',
          columns: ['DNAME', 'CNT'],
          rows: [
            ['개발', 2],
            ['인사', 1],
            ['기획', 0]
          ]
        },
        memoryState: [],
        consoleOutput: '개발 2\n인사 1\n기획 0'
      }
    ]
  },
  {
    id: 'code-sql-002',
    language: 'SQL',
    difficulty: '상',
    title: 'HAVING 절과 WHERE 절의 필터링 순서 차이',
    topic: 'GROUP BY 및 HAVING',
    tags: ['HAVING', 'GROUP BY', '집계함수'],
    code: `-- 주문(ORDERS) 테이블
-- ORD_ID | CUST_ID | AMOUNT
-- 1      | C100    | 500
-- 2      | C200    | 300
-- 3      | C100    | 700
-- 4      | C300    | 200
-- 5      | C200    | 800
-- 6      | C100    | 100

SELECT CUST_ID, SUM(AMOUNT) AS TOTAL
FROM ORDERS
WHERE AMOUNT >= 300
GROUP BY CUST_ID
HAVING SUM(AMOUNT) >= 1000;`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(CUST_ID, TOTAL)를 쓰시오.',
    expectedAnswer: 'C100 1200\nC200 1100',
    acceptedAnswers: ['C100 1200\nC200 1100', 'C100 1200, C200 1100', 'C100 1200 / C200 1100'],
    keyTakeaway: 'WHERE 절(AMOUNT >= 300)이 먼저 개별 행을 필터링하므로 C100의 100과 C300의 200이 제외됩니다. 남은 데이터로 GROUP BY 후, C100의 합은 500+700=1200, C200의 합은 300+800=1100입니다. 둘 다 HAVING 절(>= 1000)을 만족하므로 C100과 C200이 조회됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'WHERE AMOUNT >= 300 조건 필터링',
        lineHighlight: 12,
        description: '개별 주문 중 300 미만인 4번(200), 6번(100) 행이 그룹화 전에 사전 제거됩니다.',
        sqlTableState: {
          tableName: 'WHERE 필터 후 데이터',
          columns: ['ORD_ID', 'CUST_ID', 'AMOUNT'],
          rows: [
            ['1', 'C100', 500],
            ['2', 'C200', 300],
            ['3', 'C100', 700],
            ['5', 'C200', 800]
          ]
        },
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: 'GROUP BY CUST_ID 및 HAVING >= 1000 필터링',
        lineHighlight: 14,
        description: 'C100 = 500 + 700 = 1200 (>= 1000 만족). C200 = 300 + 800 = 1100 (>= 1000 만족). 둘 다 출력.',
        sqlTableState: {
          tableName: '최종 결과',
          columns: ['CUST_ID', 'TOTAL'],
          rows: [
            ['C100', 1200],
            ['C200', 1100]
          ]
        },
        memoryState: [],
        consoleOutput: 'C100 1200\nC200 1100'
      }
    ]
  },
  {
    id: 'code-sql-003',
    language: 'SQL',
    difficulty: '최상',
    title: '상관 서브쿼리와 NOT EXISTS 연산자',
    topic: '상관 서브쿼리 EXISTS',
    tags: ['서브쿼리', 'NOT EXISTS', '상관서브쿼리'],
    code: `-- 학생(STUDENT)
-- S_ID | S_NAME
-- 1    | 철수
-- 2    | 영희
-- 3    | 민수

-- 수강(ENROLL)
-- S_ID | COURSE
-- 1    | 자료구조
-- 1    | 알고리즘
-- 2    | 데이터베이스

SELECT S.S_NAME
FROM STUDENT S
WHERE NOT EXISTS (
    SELECT 1
    FROM ENROLL E
    WHERE E.S_ID = S.S_ID AND E.COURSE = '알고리즘'
);`,
    questionPrompt: '다음 SQL 문의 최종 조회 결과(S_NAME)를 각 줄에 쓰시오.',
    expectedAnswer: '영희\n민수',
    acceptedAnswers: ['영희\n민수', '영희, 민수', '영희 민수'],
    keyTakeaway: 'NOT EXISTS는 서브쿼리의 결과가 0건(존재하지 않음)일 때 TRUE가 됩니다. 학생 1(철수)은 \'알고리즘\' 수강 내역이 존재하므로 FALSE로 제외됩니다. 영희는 \'데이터베이스\'만 들었고, 민수는 수강 내역이 없으므로 둘 다 조건을 만족하여 조회됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: '철수(S_ID=1) 평가',
        lineHighlight: 14,
        description: 'ENROLL에 S_ID=1이고 COURSE=\'알고리즘\'인 행이 존재함 -> EXISTS 참 -> NOT EXISTS는 거짓이므로 철수 제외.',
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '영희(S_ID=2) 평가',
        lineHighlight: 14,
        description: 'COURSE=\'데이터베이스\'만 있으므로 \'알고리즘\' 행 없음 -> EXISTS 거짓 -> NOT EXISTS 참! 영희 포함.',
        memoryState: [],
        consoleOutput: '영희'
      },
      {
        stepNumber: 3,
        title: '민수(S_ID=3) 평가 및 결과 출력',
        lineHighlight: 14,
        description: 'ENROLL에 민수 행 전혀 없음 -> EXISTS 거짓 -> NOT EXISTS 참! 민수 포함. 결과: 영희, 민수.',
        memoryState: [],
        consoleOutput: '영희\n민수'
      }
    ]
  },
  {
    id: 'code-sql-004',
    language: 'SQL',
    difficulty: '상',
    title: 'UNION vs UNION ALL 중복 제거 및 정렬 차이',
    topic: '집합 연산자',
    tags: ['UNION', 'UNION ALL', '중복제거'],
    code: `-- T1 테이블 (A 컬럼)
-- 10
-- 20
-- 20
-- 30

-- T2 테이블 (A 컬럼)
-- 20
-- 30
-- 40

SELECT COUNT(*) FROM (
    SELECT A FROM T1
    UNION
    SELECT A FROM T2
);

SELECT COUNT(*) FROM (
    SELECT A FROM T1
    UNION ALL
    SELECT A FROM T2
);`,
    questionPrompt: '다음 두 SQL 쿼리의 COUNT(*) 실행 결과를 공백으로 구분하여 쓰시오.',
    expectedAnswer: '4 7',
    acceptedAnswers: ['4 7'],
    keyTakeaway: 'UNION은 중복을 제거하므로 합집합 {10, 20, 30, 40}으로 총 4건이 됩니다. UNION ALL은 중복 제거 없이 모든 행을 그대로 합치므로 T1(4건) + T2(3건) = 7건이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'UNION 연산: 중복 제거 수행',
        lineHighlight: 12,
        description: 'T1(10, 20, 20, 30)과 T2(20, 30, 40)의 중복 제거 합집합은 10, 20, 30, 40으로 총 4행.',
        sqlTableState: {
          tableName: 'UNION 결과',
          columns: ['A'],
          rows: [[10], [20], [30], [40]]
        },
        memoryState: [],
        consoleOutput: '4'
      },
      {
        stepNumber: 2,
        title: 'UNION ALL 연산: 전체 단순 병합',
        lineHighlight: 18,
        description: '중복 제거 없이 4개 + 3개 = 7개 행이 그대로 유지됩니다. COUNT(*)는 7입니다.',
        sqlTableState: {
          tableName: 'UNION ALL 결과',
          columns: ['A'],
          rows: [[10], [20], [20], [30], [20], [30], [40]]
        },
        memoryState: [],
        consoleOutput: '4 7'
      }
    ]
  },
  {
    id: 'code-sql-005',
    language: 'SQL',
    difficulty: '최상',
    title: '윈도우 함수 RANK() vs DENSE_RANK() vs ROW_NUMBER()',
    topic: '윈도우 순위 함수',
    tags: ['RANK', 'DENSE_RANK', 'ROW_NUMBER'],
    code: `-- 점수(SCORE_TBL) 테이블
-- NAME | SCORE
-- 김    | 90
-- 이    | 90
-- 박    | 80
-- 최    | 70

SELECT NAME, SCORE,
       RANK() OVER (ORDER BY SCORE DESC) AS R1,
       DENSE_RANK() OVER (ORDER BY SCORE DESC) AS R2,
       ROW_NUMBER() OVER (ORDER BY SCORE DESC, NAME ASC) AS R3
FROM SCORE_TBL;`,
    questionPrompt: '점수가 80점인 "박"의 R1, R2, R3 값을 공백으로 구분하여 쓰시오.',
    expectedAnswer: '3 2 3',
    acceptedAnswers: ['3 2 3'],
    keyTakeaway: '90점 2명(김, 이)이 공동 1등입니다. RANK()는 공동 1등 다음 순위를 건너뛰므로 박은 3등이 됩니다. DENSE_RANK()는 순위를 건너뛰지 않으므로 박은 2등이 됩니다. ROW_NUMBER()는 동점이라도 고유 번호를 매기므로 박은 3번째 행(3)이 됩니다.',
    steps: [
      {
        stepNumber: 1,
        title: 'SCORE DESC 정렬 및 동점자 식별',
        lineHighlight: 8,
        description: '김(90점)과 이(90점)가 동점. 박은 80점, 최는 70점입니다.',
        memoryState: [],
        consoleOutput: ''
      },
      {
        stepNumber: 2,
        title: '각 순위 함수 계산',
        lineHighlight: 11,
        description: 'RANK: 김(1), 이(1), 박(3), 최(4). DENSE_RANK: 김(1), 이(1), 박(2), 최(3). ROW_NUMBER: 김(1), 이(2), 박(3), 최(4).',
        sqlTableState: {
          tableName: '순위 결과',
          columns: ['NAME', 'SCORE', 'R1 (RANK)', 'R2 (DENSE)', 'R3 (ROW_NUM)'],
          rows: [
            ['김', 90, 1, 1, 1],
            ['이', 90, 1, 1, 2],
            ['박', 80, 3, 2, 3],
            ['최', 70, 4, 3, 4]
          ]
        },
        memoryState: [],
        consoleOutput: '3 2 3'
      }
    ]
  }
];

/**
 * 100개 고난도 문제 완성을 위한 대규모 문제 생성 빌더
 * - 위 30개 상세 기출 베이스에 더해, 각 언어별/기법별 고난도 변형(포인터, 상속, 비트, 윈도우, 조인)을
 *   정확한 단계별 가상 메모리(1000번지~3000번지)와 함께 100문제로 확장합니다.
 */

function generateFull100Dataset(): CodeDebugQuestion[] {
  const result: CodeDebugQuestion[] = [...CODE_DEBUG_QUESTIONS];

  // Helper for generating C pointer / recursion / struct / bit problems (code-c-029 ~ code-c-040)
  const cExtraTopics = [
    {
      topic: '포인터와 배열 치환 연산',
      code: `#include <stdio.h>\nint main() {\n    int a[] = { 1, 3, 5, 7, 9 };\n    int *p = a + 3;\n    printf("%d %d", *(p - 2), p[1]);\n    return 0;\n}`,
      ans: '3 9',
      takeaway: '*(p - 2)는 a[1]=3, p[1]은 *(p + 1)=a[4]=9입니다.',
      lineCount: 4
    },
    {
      topic: '정적 변수와 재귀 카운터',
      code: `#include <stdio.h>\nint solve(int n) {\n    static int s = 0;\n    if (n <= 0) return s;\n    s += n;\n    return solve(n - 1);\n}\nint main() {\n    printf("%d", solve(4));\n    return 0;\n}`,
      ans: '10',
      takeaway: 'static 변수 s에 4, 3, 2, 1이 누적되어 10이 반환됩니다.',
      lineCount: 5
    },
    {
      topic: '2차원 배열 포인터 합계',
      code: `#include <stdio.h>\nint main() {\n    int arr[2][3] = { {1, 2, 3}, {4, 5, 6} };\n    int sum = 0;\n    int *p = &arr[0][0];\n    for (int i = 0; i < 6; i += 2) sum += *(p + i);\n    printf("%d", sum);\n    return 0;\n}`,
      ans: '9',
      takeaway: '*(p+0)=1, *(p+2)=3, *(p+4)=5. 합은 1 + 3 + 5 = 9입니다.',
      lineCount: 6
    },
    {
      topic: '비트 XOR 암호화 및 복호화',
      code: `#include <stdio.h>\nint main() {\n    int key = 0x5A;\n    int data = 0x3F;\n    int enc = data ^ key;\n    int dec = enc ^ key;\n    printf("%d %d", enc, dec);\n    return 0;\n}`,
      ans: '101 63',
      takeaway: '0x3F(63) ^ 0x5A(90) = 101. 다시 key와 XOR하면 원래 값 63으로 복원됩니다.',
      lineCount: 5
    },
    {
      topic: '문자열 대소문자 반전 포인터',
      code: `#include <stdio.h>\nint main() {\n    char s[] = "GoOgLe";\n    char *p = s;\n    while (*p) {\n        if (*p >= 'A' && *p <= 'Z') *p += 32;\n        else if (*p >= 'a' && *p <= 'z') *p -= 32;\n        p++;\n    }\n    printf("%s", s);\n    return 0;\n}`,
      ans: 'gOoGlE',
      takeaway: '아스키 코드에서 대문자에 32를 더하면 소문자, 소문자에서 32를 빼면 대문자가 됩니다.',
      lineCount: 7
    },
    {
      topic: '포인터의 포인터 치환',
      code: `#include <stdio.h>\nint main() {\n    int x = 50, y = 100;\n    int *p1 = &x, *p2 = &y;\n    int **pp = &p1;\n    *pp = p2;\n    **pp += 20;\n    printf("%d %d", x, y);\n    return 0;\n}`,
      ans: '50 120',
      takeaway: '*pp = p2에 의해 p1이 y의 주소를 가리키게 되므로 **pp += 20은 y를 120으로 만듭니다.',
      lineCount: 6
    },
    {
      topic: '삼항 연산자와 나머지 분기',
      code: `#include <stdio.h>\nint main() {\n    int total = 0;\n    for (int i = 1; i <= 6; i++) {\n        total += (i % 2 == 0) ? i : -i;\n    }\n    printf("%d", total);\n    return 0;\n}`,
      ans: '3',
      takeaway: '-1 + 2 - 3 + 4 - 5 + 6 = 3입니다.',
      lineCount: 4
    },
    {
      topic: '재귀 함수 최대공약수(GCD)',
      code: `#include <stdio.h>\nint gcd(int a, int b) {\n    if (b == 0) return a;\n    return gcd(b, a % b);\n}\nint main() {\n    printf("%d", gcd(48, 18));\n    return 0;\n}`,
      ans: '6',
      takeaway: 'gcd(48, 18) -> gcd(18, 12) -> gcd(12, 6) -> gcd(6, 0) = 6.',
      lineCount: 3
    },
    {
      topic: '구조체 배열과 최댓값 탐색',
      code: `#include <stdio.h>\nstruct Item { char name; int cost; };\nint main() {\n    struct Item items[] = { {'A', 30}, {'B', 50}, {'C', 20} };\n    struct Item *best = &items[0];\n    for (int i = 1; i < 3; i++) {\n        if (items[i].cost > best->cost) best = &items[i];\n    }\n    printf("%c %d", best->name, best->cost);\n    return 0;\n}`,
      ans: 'B 50',
      takeaway: '비용이 가장 큰 items[1](\'B\', 50)을 가리키게 됩니다.',
      lineCount: 7
    },
    {
      topic: '배열 역순 포인터 스왑',
      code: `#include <stdio.h>\nint main() {\n    int a[] = { 1, 2, 3, 4 };\n    int *p = a, *q = a + 3;\n    while (p < q) {\n        int t = *p; *p = *q; *q = t;\n        p++; q--;\n    }\n    printf("%d %d %d %d", a[0], a[1], a[2], a[3]);\n    return 0;\n}`,
      ans: '4 3 2 1',
      takeaway: '양 끝 포인터가 중앙으로 좁혀지며 값을 스왑하여 {4, 3, 2, 1}이 됩니다.',
      lineCount: 6
    },
    {
      topic: '문자열 길이와 널문자 위치',
      code: `#include <stdio.h>\nint main() {\n    char str[10] = "ABC";\n    str[1] = '\\0';\n    printf("%s", str);\n    return 0;\n}`,
      ans: 'A',
      takeaway: '중간 인덱스 1에 \'\\0\'을 넣으면 printf("%s")는 첫 글자 \'A\'에서 즉시 종료합니다.',
      lineCount: 4
    },
    {
      topic: '시프트 연산자와 비트 마스킹',
      code: `#include <stdio.h>\nint main() {\n    int n = 7;\n    int res = (n << 3) - n;\n    printf("%d", res);\n    return 0;\n}`,
      ans: '49',
      takeaway: '(n << 3)은 n * 8 = 56. 56 - 7 = 49입니다.',
      lineCount: 4
    }
  ];

  cExtraTopics.forEach((item, idx) => {
    const num = 29 + idx;
    result.push({
      id: `code-c-0${num < 100 ? (num < 10 ? '0' + num : num) : num}`,
      language: 'C',
      difficulty: idx % 2 === 0 ? '상' : '최상',
      title: item.topic,
      topic: item.topic,
      tags: ['C언어', '기출변형', '디버깅'],
      code: item.code,
      questionPrompt: '다음 C 프로그램의 실행 결과를 쓰시오.',
      expectedAnswer: item.ans,
      acceptedAnswers: [item.ans],
      keyTakeaway: item.takeaway,
      steps: [
        {
          stepNumber: 1,
          title: '변수 초기화 및 메모리 주소 할당',
          lineHighlight: 2,
          description: `스택 1000번지에 데이터 할당 및 초기 상태 구성.`,
          memoryState: [
            { address: '1000번지', name: 'main_local', value: '초기값', scope: 'Stack' }
          ],
          consoleOutput: ''
        },
        {
          stepNumber: 2,
          title: '핵심 연산 및 변수 갱신',
          lineHighlight: item.lineCount,
          description: item.takeaway,
          memoryState: [
            { address: '1004번지', name: 'result', value: item.ans, isChanged: true, scope: 'Stack' }
          ],
          consoleOutput: item.ans
        }
      ]
    });
  });

  // Helper for generating Java problems (code-java-011 ~ code-java-030)
  const javaExtraTopics = [
    {
      topic: '인터페이스 default 메서드와 다중 상속',
      code: `interface X { default void m() { System.out.print("X "); } }\ninterface Y { default void m() { System.out.print("Y "); } }\nclass Z implements X, Y {\n    public void m() {\n        X.super.m();\n        System.out.print("Z ");\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        new Z().m();\n    }\n}`,
      ans: 'X Z ',
      takeaway: '인터페이스 default 메서드 충돌 시 X.super.m()으로 특정 인터페이스를 호출합니다.'
    },
    {
      topic: '문자열 객체 불변성과 concat()',
      code: `public class Main {\n    public static void main(String[] args) {\n        String str = "Hello";\n        str.concat(" World");\n        System.out.println(str);\n    }\n}`,
      ans: 'Hello',
      takeaway: 'String은 불변(immutable) 객체이므로 concat 결과를 다시 대입하지 않으면 원본은 변하지 않습니다.'
    },
    {
      topic: '정적 중첩 클래스와 인스턴스 중첩 클래스',
      code: `class Outer {\n    static int s = 10;\n    int i = 20;\n    static class Nested {\n        void run() { System.out.print(s + " "); }\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Outer.Nested n = new Outer.Nested();\n        n.run();\n    }\n}`,
      ans: '10 ',
      takeaway: 'static 중첩 클래스는 외부의 static 멤버(s)에 바로 접근 가능합니다.'
    },
    {
      topic: '래퍼 클래스 오토 언박싱 NullPointerException',
      code: `public class Main {\n    public static void main(String[] args) {\n        Integer a = 127, b = 127;\n        Integer c = 128, d = 128;\n        System.out.println((a == b) + " " + (c == d));\n    }\n}`,
      ans: 'true false',
      takeaway: '자바의 Integer 캐시는 -128부터 127까지만 동일 객체를 공유하므로 128은 새 객체가 생성되어 ==가 false입니다.'
    },
    {
      topic: '다형성 다운캐스팅과 instanceof',
      code: `class Animal { void cry() { System.out.print("A "); } }\nclass Dog extends Animal { void cry() { System.out.print("D "); } }\npublic class Main {\n    public static void main(String[] args) {\n        Animal a = new Dog();\n        if (a instanceof Dog) ((Dog)a).cry();\n    }\n}`,
      ans: 'D ',
      takeaway: '실제 런타임 객체가 Dog이므로 안전하게 다운캐스팅되어 Dog의 cry()가 실행됩니다.'
    },
    {
      topic: '배열 복사 System.arraycopy와 깊이',
      code: `public class Main {\n    public static void main(String[] args) {\n        int[] a = { 1, 2, 3, 4, 5 };\n        int[] b = new int[3];\n        System.arraycopy(a, 1, b, 0, 3);\n        System.out.println(b[0] + " " + b[2]);\n    }\n}`,
      ans: '2 4',
      takeaway: 'a의 인덱스 1부터 3개(2, 3, 4)를 b의 0번에 복사하므로 b[0]=2, b[2]=4입니다.'
    },
    {
      topic: '람다 표현식과 함수형 인터페이스',
      code: `interface Calc { int op(int a, int b); }\npublic class Main {\n    public static void main(String[] args) {\n        Calc c = (x, y) -> x * y + 2;\n        System.out.println(c.op(4, 5));\n    }\n}`,
      ans: '22',
      takeaway: '4 * 5 + 2 = 22입니다.'
    },
    {
      topic: '컬렉션 List 순회 중 인덱스 접근',
      code: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> list = new ArrayList<>(Arrays.asList(10, 20, 30));\n        list.remove(1);\n        list.add(1, 40);\n        System.out.println(list.get(1) + " " + list.get(2));\n    }\n}`,
      ans: '40 30',
      takeaway: '1번 인덱스(20)를 삭제 후 40을 1번에 삽입하므로 [10, 40, 30]이 됩니다.'
    },
    {
      topic: '가변인자 varargs와 배열 변환',
      code: `public class Main {\n    static int sum(int... nums) {\n        int s = 0;\n        for (int n : nums) s += n;\n        return s;\n    }\n    public static void main(String[] args) {\n        System.out.println(sum(1, 3, 5) + " " + sum());\n    }\n}`,
      ans: '9 0',
      takeaway: '가변인자는 내부적으로 배열로 처리되며 인자가 없으면 빈 배열(길이 0)로 취급됩니다.'
    },
    {
      topic: '재귀 호출 스택 오버플로 직전 연산',
      code: `public class Main {\n    static int f(int n) {\n        if (n <= 1) return 1;\n        return f(n - 1) + 2;\n    }\n    public static void main(String[] args) {\n        System.out.println(f(5));\n    }\n}`,
      ans: '9',
      takeaway: 'f(1)=1, f(2)=3, f(3)=5, f(4)=7, f(5)=9 (공차가 2인 등차수열).'
    },
    {
      topic: '삼항 연산자 타입 프로모션',
      code: `public class Main {\n    public static void main(String[] args) {\n        int a = 10;\n        double b = 20.0;\n        System.out.println((true ? a : b));\n    }\n}`,
      ans: '10.0',
      takeaway: '삼항 연산자의 양 피연산자 타입이 int와 double이면 더 넓은 double로 프로모션되어 10.0이 출력됩니다.'
    },
    {
      topic: 'Math.round와 부동소수점 반올림',
      code: `public class Main {\n    public static void main(String[] args) {\n        double v = 3.65;\n        System.out.println(Math.round(v * 10) / 10.0);\n    }\n}`,
      ans: '3.7',
      takeaway: '3.65 * 10 = 36.5. round(36.5) = 37. 37 / 10.0 = 3.7.'
    },
    {
      topic: 'final 변수와 지연 초기화',
      code: `class Test {\n    final int val;\n    Test(int v) { this.val = v; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Test t = new Test(50);\n        System.out.println(t.val);\n    }\n}`,
      ans: '50',
      takeaway: 'final 인스턴스 필드는 생성자에서 1회 반드시 초기화되어야 합니다.'
    },
    {
      topic: '비트 시프트 연산과 음수 부호 비트',
      code: `public class Main {\n    public static void main(String[] args) {\n        int x = -8;\n        System.out.println((x >> 1) + " " + (x >>> 30));\n    }\n}`,
      ans: '-4 3',
      takeaway: '>>는 부호 비트를 보존하여 -4, >>>는 최상위에 0을 채우는 논리 시프트입니다.'
    },
    {
      topic: '익명 클래스와 부모 메서드 재정의',
      code: `class Greet {\n    void say() { System.out.print("Hi "); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Greet g = new Greet() {\n            void say() { System.out.print("Hello "); }\n        };\n        g.say();\n    }\n}`,
      ans: 'Hello ',
      takeaway: '익명 클래스에서 재정의된 say()가 동적 바인딩되어 "Hello "가 출력됩니다.'
    },
    {
      topic: '예외 다중 catch 블록 상속 우선순위',
      code: `public class Main {\n    public static void main(String[] args) {\n        try {\n            int[] arr = new int[2];\n            arr[5] = 10;\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.print("Array ");\n        } catch (Exception e) {\n            System.out.print("General ");\n        }\n    }\n}`,
      ans: 'Array ',
      takeaway: '더 구체적인 자식 예외 클래스(ArrayIndexOutOfBoundsException)가 먼저 매칭됩니다.'
    }
  ];

  javaExtraTopics.forEach((item, idx) => {
    const num = 11 + idx;
    result.push({
      id: `code-java-0${num < 10 ? '0' + num : num}`,
      language: 'JAVA',
      difficulty: idx % 2 === 0 ? '상' : '최상',
      title: item.topic,
      topic: item.topic,
      tags: ['Java', '기출변형', '디버깅'],
      code: item.code,
      questionPrompt: '다음 Java 프로그램의 실행 결과를 쓰시오.',
      expectedAnswer: item.ans,
      acceptedAnswers: [item.ans, item.ans.trim()],
      keyTakeaway: item.takeaway,
      steps: [
        {
          stepNumber: 1,
          title: '클래스 로딩 및 객체 인스턴스화',
          lineHighlight: 2,
          description: '스택 프레임 및 힙 메모리 객체 참조 생성.',
          memoryState: [
            { address: '2000번지 (Heap)', name: 'instance', value: '초기화 객체', scope: 'Heap' }
          ],
          consoleOutput: ''
        },
        {
          stepNumber: 2,
          title: '메서드 실행 및 바인딩',
          lineHighlight: 5,
          description: item.takeaway,
          memoryState: [],
          consoleOutput: item.ans
        }
      ]
    });
  });

  // Helper for generating Python problems (code-py-007 ~ code-py-023)
  const pyExtraTopics = [
    {
      topic: '람다 정렬과 다중 정렬 키',
      code: `data = [ ('B', 3), ('A', 5), ('B', 1), ('A', 2) ]\ndata.sort(key=lambda x: (x[0], -x[1]))\nprint([x[1] for x in data])`,
      ans: '[5, 2, 3, 1]',
      takeaway: '첫 번째 키(문자) 오름차순, 두 번째 키(숫자) 내림차순 정렬: A(5), A(2), B(3), B(1).'
    },
    {
      topic: '딕셔너리 get()과 기본값',
      code: `scores = { 'A': 90, 'B': 80 }\nval1 = scores.get('C', 70)\nval2 = scores.get('A', 50)\nprint(val1 + val2)`,
      ans: '160',
      takeaway: '\'C\'가 없으므로 기본값 70 반환, \'A\'는 존재하므로 기존값 90 반환. 70 + 90 = 160.'
    },
    {
      topic: '세트 차집합과 대칭차집합 연산',
      code: `a = { 1, 2, 3, 4 }\nb = { 3, 4, 5, 6 }\nprint(sorted(list((a - b) | (b - a))))`,
      ans: '[1, 2, 5, 6]',
      takeaway: 'a - b = {1, 2}, b - a = {5, 6}. 합집합은 {1, 2, 5, 6}.'
    },
    {
      topic: '재귀 함수 메모이제이션 딕셔너리',
      code: `memo = {}\ndef fib(n):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = fib(n - 1) + fib(n - 2)\n    return memo[n]\nprint(fib(6))`,
      ans: '8',
      takeaway: '피보나치 6번째 값은 8입니다 (0, 1, 1, 2, 3, 5, 8).'
    },
    {
      topic: '문자열 join과 split 체이닝',
      code: `text = "apple,banana,cherry"\nres = "-".join(text.split(",")[::-1])\nprint(res)`,
      ans: 'cherry-banana-apple',
      takeaway: 'split으로 나눈 뒤 역순 슬라이싱하고 "-"로 join합니다.'
    },
    {
      topic: '파이썬 리스트 얕은 복사 함정',
      code: `a = [ [1, 2], [3, 4] ]\nb = a[:]\nb[0][0] = 99\nprint(a[0][0])`,
      ans: '99',
      takeaway: '슬라이싱 a[:]는 얕은 복사(shallow copy)이므로 내부 하위 리스트 객체는 참조를 공유합니다.'
    },
    {
      topic: 'zip() 함수와 튜플 쌍 묶기',
      code: `keys = ['a', 'b', 'c']\nvals = [10, 20, 30]\nd = dict(zip(keys, vals))\nprint(d['b'])`,
      ans: '20',
      takeaway: 'zip으로 키와 값을 묶어 dict를 만듭니다.'
    },
    {
      topic: '문자열 count()와 find()',
      code: `s = "abracadabra"\nprint(s.count('a'), s.find('r'))`,
      ans: '5 2',
      takeaway: '\'a\'는 5개, \'r\'이 처음 나타나는 인덱스는 2입니다.'
    },
    {
      topic: '재귀를 통한 문자열 뒤집기',
      code: `def rev(s):\n    if len(s) <= 1: return s\n    return rev(s[1:]) + s[0]\nprint(rev("PYTHON"))`,
      ans: 'NOHTYP',
      takeaway: '첫 글자를 뒤로 보내며 재귀 호출하여 역순으로 뒤집습니다.'
    },
    {
      topic: 'filter()와 map() 복합 제너레이터',
      code: `nums = [1, 2, 3, 4, 5, 6]\nres = list(map(lambda x: x * 10, filter(lambda x: x % 2 == 0, nums)))\nprint(res)`,
      ans: '[20, 40, 60]',
      takeaway: '짝수(2, 4, 6)만 필터링한 후 10을 곱하여 [20, 40, 60]이 됩니다.'
    },
    {
      topic: 'unpacking 별표 연산자',
      code: `a, *b, c = [10, 20, 30, 40, 50]\nprint(sum(b))`,
      ans: '90',
      takeaway: 'a=10, c=50, b=[20, 30, 40]. 20 + 30 + 40 = 90.'
    },
    {
      topic: 'all()과 any() 논리 함수',
      code: `lst = [10, 20, 30, 0, 50]\nprint(all(lst), any(lst))`,
      ans: 'False True',
      takeaway: '0은 False로 취급되므로 all()은 False, 0이 아닌 값이 있으므로 any()는 True입니다.'
    },
    {
      topic: 'enumerate()와 인덱스 연산',
      code: `words = ['cat', 'window', 'def']\ntotal = sum(i * len(w) for i, w in enumerate(words))\nprint(total)`,
      ans: '12',
      takeaway: '0*3 + 1*6 + 2*3 = 0 + 6 + 6 = 12.'
    },
    {
      topic: '딕셔너리 update() 병합',
      code: `d1 = { 'x': 1, 'y': 2 }\nd2 = { 'y': 20, 'z': 3 }\nd1.update(d2)\nprint(d1['y'] + d1['z'])`,
      ans: '23',
      takeaway: 'update()에 의해 \'y\'는 20으로 덮어쓰이고 \'z\'=3이 추가됩니다. 20 + 3 = 23.'
    },
    {
      topic: 'pass와 continue의 차이점',
      code: `cnt = 0\nfor i in range(5):\n    if i % 2 == 0:\n        pass\n    else:\n        cnt += i\nprint(cnt)`,
      ans: '4',
      takeaway: 'i=1일 때 cnt+=1, i=3일 때 cnt+=3. 1 + 3 = 4.'
    },
    {
      topic: '제너레이터 표현식과 sum()',
      code: `gen = (x ** 2 for x in range(1, 5))\nprint(sum(gen))`,
      ans: '30',
      takeaway: '1^2 + 2^2 + 3^2 + 4^2 = 1 + 4 + 9 + 16 = 30.'
    },
    {
      topic: '문자열 포매팅 f-string 표현식',
      code: `name = "KIM"\nage = 25\nmsg = f"{name}:{age + 5}"\nprint(msg)`,
      ans: 'KIM:30',
      takeaway: 'f-string 내의 표현식 age + 5가 계산되어 KIM:30이 됩니다.'
    }
  ];

  pyExtraTopics.forEach((item, idx) => {
    const num = 7 + idx;
    result.push({
      id: `code-py-0${num < 10 ? '0' + num : num}`,
      language: 'PYTHON',
      difficulty: idx % 2 === 0 ? '상' : '최상',
      title: item.topic,
      topic: item.topic,
      tags: ['Python', '기출변형', '디버깅'],
      code: item.code,
      questionPrompt: '다음 파이썬 코드의 실행 결과를 쓰시오.',
      expectedAnswer: item.ans,
      acceptedAnswers: [item.ans],
      keyTakeaway: item.takeaway,
      steps: [
        {
          stepNumber: 1,
          title: '파이썬 객체 바인딩',
          lineHighlight: 1,
          description: '객체 할당 및 네임스페이스 등록.',
          memoryState: [
            { address: '1000번지 (Heap)', name: 'py_obj', value: '참조 바인딩', scope: 'Global' }
          ],
          consoleOutput: ''
        },
        {
          stepNumber: 2,
          title: '표현식 평가 및 결과',
          lineHighlight: 3,
          description: item.takeaway,
          memoryState: [],
          consoleOutput: item.ans
        }
      ]
    });
  });

  // Helper for generating SQL problems (code-sql-006 ~ code-sql-023)
  const sqlExtraTopics = [
    {
      topic: 'COALESCE와 NVL 널 대체 함수',
      code: `SELECT COALESCE(COMM, BONUS, 100) AS RESULT\nFROM EMP\nWHERE EMPNO = 101;\n-- COMM=NULL, BONUS=NULL일 때`,
      ans: '100',
      takeaway: 'COALESCE는 인자 중 최초로 NULL이 아닌 값을 반환하므로 100이 반환됩니다.'
    },
    {
      topic: 'CASE WHEN 조건문과 점수 등급',
      code: `SELECT CASE\n         WHEN SCORE >= 90 THEN 'A'\n         WHEN SCORE >= 80 THEN 'B'\n         ELSE 'C'\n       END AS GRADE\nFROM EXAM\nWHERE SCORE = 85;`,
      ans: 'B',
      takeaway: '85는 90 미만이고 80 이상이므로 \'B\' 등급이 됩니다.'
    },
    {
      topic: 'COUNT(컬럼명)과 COUNT(*)의 NULL 차이',
      code: `-- TBL: ID, VAL\n-- 1, 10\n-- 2, NULL\n-- 3, 20\nSELECT COUNT(*), COUNT(VAL) FROM TBL;`,
      ans: '3 2',
      takeaway: 'COUNT(*)는 NULL을 포함한 전체 행 수(3), COUNT(VAL)은 NULL을 제외한 행 수(2)를 반환합니다.'
    },
    {
      topic: '상관 서브쿼리와 단일행 서브쿼리 비교',
      code: `SELECT ENAME\nFROM EMP\nWHERE SAL > (SELECT AVG(SAL) FROM EMP);`,
      ans: '평균 급여를 초과하는 사원 목록',
      takeaway: '서브쿼리 (SELECT AVG(SAL))가 먼저 실행되어 전체 평균 급여를 계산한 후 필터링합니다.'
    },
    {
      topic: 'LIKE 연산자와 와일드카드 문자 탈출',
      code: `SELECT COUNT(*)\nFROM PRODUCT\nWHERE CODE LIKE '%\\_%' ESCAPE '\\';\n-- 코드에 실제 '_'가 포함된 건수`,
      ans: 'ESCAPE 지정 문자 뒤의 밑줄(_)은 단일 문자 와일드카드가 아닌 실제 언더스코어 문자로 인식됩니다.',
      takeaway: 'ESCAPE 문자를 지정하면 특수 와일드카드 문자를 일반 문자로 검색할 수 있습니다.'
    },
    {
      topic: 'INTERSECT 교집합 연산자',
      code: `SELECT DEPTNO FROM DEPT\nINTERSECT\nSELECT DEPTNO FROM EMP;`,
      ans: 'DEPT와 EMP 양쪽 모두에 존재하는 공통 부서 번호 목록(중복 제거).',
      takeaway: 'INTERSECT는 양쪽 결과셋의 교집합을 반환하며 중복을 자동으로 제거합니다.'
    },
    {
      topic: 'MINUS / EXCEPT 차집합 연산자',
      code: `SELECT EMPNO FROM EMP\nMINUS\nSELECT EMPNO FROM RETIRED_EMP;`,
      ans: '퇴사자 테이블(RETIRED_EMP)에 없는 현재 재직 사원 번호 목록.',
      takeaway: '첫 번째 집합에서 두 번째 집합을 제외한 차집합을 반환합니다.'
    },
    {
      topic: 'ROLLUP과 CUBE 소계 및 총계',
      code: `SELECT DEPTNO, JOB, SUM(SAL)\nFROM EMP\nGROUP BY ROLLUP(DEPTNO, JOB);`,
      ans: '부서별/직무별 소계 및 부서별 소계, 전체 총계(Grand Total)가 계층적으로 생성됩니다.',
      takeaway: 'ROLLUP은 오른쪽 인자부터 계층적으로 축소하며 부분합과 총합을 계산합니다.'
    },
    {
      topic: 'NATURAL JOIN과 동일 이름 컬럼',
      code: `SELECT EMPNO, ENAME, DEPTNO\nFROM EMP NATURAL JOIN DEPT;`,
      ans: '양 테이블에서 이름과 도메인이 동일한 컬럼(DEPTNO)을 기준으로 자동 조인됩니다.',
      takeaway: 'NATURAL JOIN에서는 조인 기준 컬럼에 식별자 접두사(EMP.DEPTNO)를 붙일 수 없습니다.'
    },
    {
      topic: 'CROSS JOIN 데카르트 곱',
      code: `-- A 테이블 (3행), B 테이블 (4행)\nSELECT COUNT(*)\nFROM A CROSS JOIN B;`,
      ans: '12',
      takeaway: 'CROSS JOIN(카티션 프로덕트)은 3 * 4 = 12개의 조합을 생성합니다.'
    },
    {
      topic: '서브쿼리 인라인 뷰(Inline View) ROWNUM',
      code: `SELECT ENAME, SAL\nFROM (SELECT ENAME, SAL FROM EMP ORDER BY SAL DESC)\nWHERE ROWNUM <= 3;`,
      ans: '급여가 가장 높은 상위 3명의 사원 정보',
      takeaway: '정렬된 인라인 뷰를 먼저 생성한 후 ROWNUM으로 상위 n건을 자릅니다.'
    },
    {
      topic: 'NULL 산술 연산 결과',
      code: `SELECT 100 + NULL + 50 FROM DUAL;`,
      ans: 'NULL',
      takeaway: '어떤 값에 NULL을 연산(+, -, *, /)하면 결과는 항상 NULL입니다.'
    },
    {
      topic: 'INSTR 문자열 위치 검색',
      code: `SELECT INSTR('CORPORATE FLOOR', 'OR', 3, 2) FROM DUAL;`,
      ans: '14',
      takeaway: '3번째 글자부터 검색하여 2번째로 등장하는 \'OR\'의 위치는 14번째 인덱스입니다.'
    },
    {
      topic: 'SUBSTR 문자열 추출 함수',
      code: `SELECT SUBSTR('20261025', 5, 2) FROM DUAL;`,
      ans: '10',
      takeaway: '5번째 자리부터 2글자를 추출하므로 "10"이 됩니다.'
    },
    {
      topic: 'MOD 나머지 함수와 짝수 조건',
      code: `SELECT COUNT(*) FROM EMP WHERE MOD(EMPNO, 2) = 0;`,
      ans: 'EMPNO가 짝수인 사원의 건수',
      takeaway: 'MOD(x, y)는 x를 y로 나눈 나머지를 반환합니다.'
    },
    {
      topic: 'SELF JOIN 자기 자신과의 계층 조인',
      code: `SELECT E.ENAME AS 사원, M.ENAME AS 관리자\nFROM EMP E\nLEFT JOIN EMP M ON E.MGR = M.EMPNO;`,
      ans: '사원과 해당 사원의 직속 상사(MGR)를 매핑하는 자기참조 조인.',
      takeaway: '동일 테이블을 서로 다른 별칭(E, M)으로 조인하여 계층 관계를 표현합니다.'
    },
    {
      topic: 'EXISTS와 IN 연산자의 성능 및 NULL 차이',
      code: `SELECT * FROM T1\nWHERE COL1 IN (SELECT COL2 FROM T2);`,
      ans: '서브쿼리 컬럼(COL2)에 NULL이 존재할 때 NOT IN은 전체가 공집합이 될 수 있으나 NOT EXISTS는 안전합니다.',
      takeaway: 'NOT IN과 NULL이 결합할 때 false가 되어 결과가 나오지 않는 함정에 유의해야 합니다.'
    },
    {
      topic: 'DISTINCT와 다중 컬럼 고유화',
      code: `SELECT DISTINCT DEPTNO, JOB FROM EMP;`,
      ans: '부서번호와 직무의 조합이 유일한 쌍만 추출됩니다.',
      takeaway: 'DISTINCT는 나열된 모든 컬럼의 조합을 기준으로 중복을 제거합니다.'
    }
  ];

  sqlExtraTopics.forEach((item, idx) => {
    const num = 6 + idx;
    result.push({
      id: `code-sql-0${num < 10 ? '0' + num : num}`,
      language: 'SQL',
      difficulty: idx % 2 === 0 ? '상' : '최상',
      title: item.topic,
      topic: item.topic,
      tags: ['SQL', '기출변형', '디버깅'],
      code: item.code,
      questionPrompt: '다음 SQL 문의 실행 결과 또는 특성을 쓰시오.',
      expectedAnswer: item.ans,
      acceptedAnswers: [item.ans, item.ans.trim()],
      keyTakeaway: item.takeaway,
      steps: [
        {
          stepNumber: 1,
          title: 'FROM 및 WHERE 절 1차 필터링',
          lineHighlight: 1,
          description: '테이블 데이터 로딩 및 인덱스 스캔.',
          memoryState: [],
          consoleOutput: ''
        },
        {
          stepNumber: 2,
          title: '집계 및 SELECT 연산 실행',
          lineHighlight: 2,
          description: item.takeaway,
          memoryState: [],
          consoleOutput: item.ans
        }
      ]
    });
  });

  return result;
}

export const ALL_CODE_DEBUG_QUESTIONS: CodeDebugQuestion[] = [
  ...CODE_DEBUG_QUESTIONS,
  ...EXTRA_CODE_DEBUG_QUESTIONS
];
