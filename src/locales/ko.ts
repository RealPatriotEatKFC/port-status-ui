export const ko = {
  // 공통
  common: {
    cancel: '취소',
    save: '저장',
    apply: '적용',
    delete: '삭제',
    edit: '수정',
    add: '추가',
    close: '닫기',
    search: '검색',
    location: '위치',
    type: '타입',
    name: '이름',
    status: '상태',
    note: '메모',
    layout: '레이아웃',
    port: '포트',
    ports: '포트',
    total: '총',
    rows: '행',
    cols: '열',
  },

  // 장비 관련
  equipment: {
    title: '네트워크 장비',
    add: '장비 추가',
    addNew: '새 장비 추가',
    edit: '장비 수정',
    delete: '장비 삭제',
    deleteConfirm: '이 장비를 삭제하시겠습니까?',
    noEquipment: '장비가 없습니다.',
    addEquipmentPrompt: '장비를 추가해주세요.',
    name: '장비 이름',
    namePlaceholder: '예: 스위치-01',
    nameRequired: '장비 이름을 입력해주세요.',
    locationPlaceholder: '예: 서버실 A랙',
    typePlaceholder: '예: 스위치, 라우터',
    rows: '행 개수',
    cols: '열 개수',
    rowsRequired: '행과 열은 1 이상이어야 합니다.',
    portCount: '개의 포트가 생성됩니다.',
    portCountEdit: '개의 포트가 됩니다.',
    layoutWarning: '⚠️ 레이아웃이 줄어들면 일부 포트 정보가 삭제될 수 있습니다.',
  },

  // 포트 관련
  port: {
    title: '포트 정보',
    position: '위치',
    batchRename: '포트 이름 일괄 변경',
    batchRenameTitle: '포트 이름 일괄 변경',
    namePattern: '이름 패턴',
    namePatternPlaceholder: '예: E1/1 또는 E1/1 - 2/24 또는 E{row}/{col}',
    namePatternRequired: '이름 패턴을 입력해주세요.',
    supportedFormats: '지원 형식:',
    format1: '1. 시작 형식:',
    format1Example: 'E1/1',
    format1Desc: '→ E1/1, E1/2, E1/3... 자동으로 증가',
    format2: '2. 범위 형식:',
    format2Example: 'E1/1 - 2/24',
    format2Desc: '→ E1/1부터 E2/24까지 범위 지정',
    format3: '3. 템플릿 형식:',
    format3Example: 'E{row}/{col}',
    format3Desc: '→ 행/열 번호 자동 치환 (1행1열 → E1/1)',
    patternNotRecognized: '패턴을 인식하지 못했습니다. 입력한 형식을 확인해주세요.',
    supportedFormatsList: '지원 형식:',
    errorOccurred: '포트 이름 변경 중 오류가 발생했습니다.',
    namePlaceholder: '예: Gi1/0/1',
    selectEquipment: '장비를 선택해주세요',
    selectEquipmentDesc: '왼쪽 목록에서 장비를 선택하면 포트 그리드가 표시됩니다.',
    portCount: '개 포트',
  },

  // 포트 상태
  portStatus: {
    normal: '정상',
    unused: '미사용',
    check: '점검필요',
    unspecified: '미지정',
  },

  // 사이드바
  sidebar: {
    hide: '사이드바 숨기기',
    show: '사이드바 보이기',
  },

  // 다크 모드
  darkMode: {
    toggle: '다크 모드로 전환',
    toggleLight: '라이트 모드로 전환',
  },

  // 언어
  language: {
    korean: '한국어',
    english: 'English',
    changeLanguage: '언어 변경',
  },

  // 필터
  filter: {
    search: '검색',
    searchPlaceholder: '장비 이름, 위치, 타입으로 검색...',
    location: '위치',
    type: '타입',
    all: '전체',
    clearFilters: '필터 초기화',
  },
};

