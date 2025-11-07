// 포트 상태 타입
export type PortStatus = '정상' | '미사용' | '점검필요';

// 포트 정보
export interface Port {
  id: string;
  name: string;
  status: PortStatus;
  row: number; // 행 위치
  col: number; // 열 위치
  note?: string; // 메모
}

// 장비 레이아웃 설정
export interface EquipmentLayout {
  rows: number; // 행 개수
  cols: number; // 열 개수
}

// 네트워크 장비 정보
export interface Equipment {
  id: string;
  name: string; // 장비 이름
  location?: string; // 위치 (예: "서버실 A랙")
  type?: string; // 장비 타입 (예: "스위치", "라우터")
  layout: EquipmentLayout; // 포트 레이아웃
  ports: Port[]; // 포트 목록
  createdAt: string; // 생성일시
  updatedAt: string; // 수정일시
}

// 필터 옵션
export interface FilterOptions {
  search: string; // 검색어
  location?: string; // 위치 필터
  type?: string; // 타입 필터
}

