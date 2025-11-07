import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Equipment, Port, PortStatus, FilterOptions } from '../types';
import type { Language } from '../locales';
import { getTranslation } from '../locales';

interface PortStore {
  // State
  equipments: Equipment[];
  selectedEquipmentId: string | null;
  filterOptions: FilterOptions;
  isDarkMode: boolean;
  language: Language;

  // Actions - Theme
  toggleDarkMode: () => void;
  setLanguage: (lang: Language) => void;

  // Actions - Equipment
  addEquipment: (name: string, layout: { rows: number; cols: number }, location?: string, type?: string) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  selectEquipment: (id: string | null) => void;

  // Actions - Port
  updatePort: (equipmentId: string, portId: string, updates: Partial<Port>) => void;
  updatePortStatus: (equipmentId: string, portId: string, status: PortStatus) => void;
  updatePortName: (equipmentId: string, portId: string, name: string) => void;
  updatePortNote: (equipmentId: string, portId: string, note: string) => void;
  updatePortNamesBatch: (equipmentId: string, namePattern: string) => void;

  // Actions - Filter
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  clearFilters: () => void;

  // Getters
  getSelectedEquipment: () => Equipment | null;
  getFilteredEquipments: () => Equipment[];
}

// 초기 포트 생성 함수
const createInitialPorts = (rows: number, cols: number): Port[] => {
  const ports: Port[] = [];
  let portNumber = 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ports.push({
        id: `port-${portNumber}`,
        name: `포트 ${portNumber}`,
        status: '미지정',
        row,
        col,
      });
      portNumber++;
    }
  }

  return ports;
};

export const usePortStore = create<PortStore>()(
  persist(
    (set, get) => ({
      // Initial State
      equipments: [],
      selectedEquipmentId: null,
      filterOptions: {
        search: '',
      },
      isDarkMode: false,
      language: 'ko' as Language,

      // Theme Actions
      toggleDarkMode: () => {
        const newMode = !get().isDarkMode;
        set({ isDarkMode: newMode });
        // HTML 요소에 dark 클래스 추가/제거
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setLanguage: (lang: Language) => {
        set({ language: lang });
      },

      // Equipment Actions
      addEquipment: (name, layout, location, type) => {
        const now = new Date().toISOString();
        const newEquipment: Equipment = {
          id: `equipment-${Date.now()}`,
          name,
          location,
          type,
          layout,
          ports: createInitialPorts(layout.rows, layout.cols),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          equipments: [...state.equipments, newEquipment],
          selectedEquipmentId: newEquipment.id,
        }));
      },

      updateEquipment: (id, updates) => {
        set((state) => ({
          equipments: state.equipments.map((eq) => {
            if (eq.id !== id) return eq;

            // 레이아웃이 변경되는 경우 포트 정보 보존
            if (updates.layout && (updates.layout.rows !== eq.layout.rows || updates.layout.cols !== eq.layout.cols)) {
              const newRows = updates.layout.rows;
              const newCols = updates.layout.cols;

              // 기존 포트 중 유지할 수 있는 포트들 (새 레이아웃 범위 내)
              const preservedPorts = eq.ports.filter((port) => port.row < newRows && port.col < newCols);

              // 새로운 포트 배열 생성
              const newPorts: Port[] = [];
              
              // 기존 포트를 먼저 배치하고, 빈 자리는 새 포트로 채움
              for (let row = 0; row < newRows; row++) {
                for (let col = 0; col < newCols; col++) {
                  // 해당 위치에 기존 포트가 있는지 확인
                  const existingPort = preservedPorts.find((p) => p.row === row && p.col === col);
                  if (existingPort) {
                    // 기존 포트 유지
                    newPorts.push(existingPort);
                  } else {
                    // 새 포트 생성
                    const portNumber = newPorts.length + 1;
                    newPorts.push({
                      id: `port-${Date.now()}-${row}-${col}`,
                      name: `포트 ${portNumber}`,
                      status: '미지정',
                      row,
                      col,
                    });
                  }
                }
              }

              return {
                ...eq,
                ...updates,
                ports: newPorts,
                updatedAt: new Date().toISOString(),
              };
            }

            // 레이아웃 변경이 아닌 경우 일반 업데이트
            return { ...eq, ...updates, updatedAt: new Date().toISOString() };
          }),
        }));
      },

      deleteEquipment: (id) => {
        set((state) => ({
          equipments: state.equipments.filter((eq) => eq.id !== id),
          selectedEquipmentId:
            state.selectedEquipmentId === id ? null : state.selectedEquipmentId,
        }));
      },

      selectEquipment: (id) => {
        set({ selectedEquipmentId: id });
      },

      // Port Actions
      updatePort: (equipmentId, portId, updates) => {
        set((state) => ({
          equipments: state.equipments.map((eq) => {
            if (eq.id !== equipmentId) return eq;

            return {
              ...eq,
              ports: eq.ports.map((port) =>
                port.id === portId ? { ...port, ...updates } : port
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updatePortStatus: (equipmentId, portId, status) => {
        get().updatePort(equipmentId, portId, { status });
      },

      updatePortName: (equipmentId, portId, name) => {
        get().updatePort(equipmentId, portId, { name });
      },

      updatePortNote: (equipmentId, portId, note) => {
        get().updatePort(equipmentId, portId, { note });
      },

      // 포트 이름 일괄 업데이트
      updatePortNamesBatch: (equipmentId, namePattern) => {
        try {
          const equipment = get().equipments.find((eq) => eq.id === equipmentId);
          if (!equipment) {
            console.error('Equipment not found:', equipmentId);
            return;
          }

          if (!namePattern || !namePattern.trim()) {
            console.error('Name pattern is empty');
            return;
          }

          const pattern = namePattern.trim();

          // 포트를 행/열 순서로 정렬
          const sortedPorts = [...equipment.ports].sort((a, b) => {
            if (a.row !== b.row) return a.row - b.row;
            return a.col - b.col;
          });

          // E{row}/{col} 형식 파싱 (템플릿 형식)
          if (pattern.includes('{row}') || pattern.includes('{col}')) {
            set((state) => ({
              equipments: state.equipments.map((eq) => {
                if (eq.id !== equipmentId) return eq;

                return {
                  ...eq,
                  ports: eq.ports.map((port) => {
                    // {row}와 {col}을 실제 행/열 번호로 치환 (1부터 시작)
                    const portName = pattern
                      .replace(/\{row\}/g, String(port.row + 1))
                      .replace(/\{col\}/g, String(port.col + 1));
                    return {
                      ...port,
                      name: portName,
                    };
                  }),
                  updatedAt: new Date().toISOString(),
                };
              }),
            }));
            return;
          }

          // E1/1 - 2/24 형식 파싱 (범위 지정)
          const rangeMatch = pattern.match(/^([A-Za-z]+)(\d+)\/(\d+)\s*-\s*(\d+)\/(\d+)$/);
          if (rangeMatch) {
            const [, prefix, startRow, startCol, endRow, endCol] = rangeMatch;
            const startRowNum = parseInt(startRow, 10);
            const startColNum = parseInt(startCol, 10);
            const endRowNum = parseInt(endRow, 10);
            const endColNum = parseInt(endCol, 10);

            // 포트 이름 맵 생성
            const portNameMap = new Map<string, string>();
            let currentRow = startRowNum;
            let currentCol = startColNum;

            for (const port of sortedPorts) {
              // 범위를 벗어나면 중단
              if (currentRow > endRowNum || (currentRow === endRowNum && currentCol > endColNum)) {
                break;
              }

              // 포트 이름 부여
              portNameMap.set(port.id, `${prefix}${currentRow}/${currentCol}`);

              // 다음 포트를 위한 계산
              currentCol++;
              if (currentCol > endColNum) {
                currentCol = startColNum;
                currentRow++;
              }
            }

            set((state) => ({
              equipments: state.equipments.map((eq) => {
                if (eq.id !== equipmentId) return eq;

                return {
                  ...eq,
                  ports: eq.ports.map((port) => {
                    const newName = portNameMap.get(port.id);
                    if (newName) {
                      return { ...port, name: newName };
                    }
                    return port;
                  }),
                  updatedAt: new Date().toISOString(),
                };
              }),
            }));
            return;
          }

          // 단순 패턴 (예: E1/1) - 자동 증가
          const simpleMatch = pattern.match(/^([A-Za-z]+)(\d+)\/(\d+)$/);
          if (simpleMatch) {
            const [, prefix, startRow, startCol] = simpleMatch;
            const startRowNum = parseInt(startRow, 10);
            const startColNum = parseInt(startCol, 10);

            // 포트 이름 맵 생성
            const portNameMap = new Map<string, string>();
            let currentRow = startRowNum;
            let currentCol = startColNum;

            for (const port of sortedPorts) {
              portNameMap.set(port.id, `${prefix}${currentRow}/${currentCol}`);

              // 다음 포트를 위한 계산
              currentCol++;
              if (currentCol > 999) { // 열이 너무 커지면 행 증가
                currentCol = startColNum;
                currentRow++;
              }
            }

            set((state) => ({
              equipments: state.equipments.map((eq) => {
                if (eq.id !== equipmentId) return eq;

                return {
                  ...eq,
                  ports: eq.ports.map((port) => {
                    const newName = portNameMap.get(port.id);
                    if (newName) {
                      return { ...port, name: newName };
                    }
                    return port;
                  }),
                  updatedAt: new Date().toISOString(),
                };
              }),
            }));
            return;
          }

          // 패턴을 인식하지 못한 경우
          const t = getTranslation(get().language);
          alert(`${t.port.patternNotRecognized}\n\n${t.port.supportedFormatsList}:\n- ${t.port.format2Example} (Range)\n- ${t.port.format3Example} (Template)\n- ${t.port.format1Example} (Auto increment)`);
        } catch (error) {
          console.error('Error updating port names:', error);
          const t = getTranslation(get().language);
          alert(t.port.errorOccurred);
        }
      },

      // Filter Actions
      setFilterOptions: (options) => {
        set((state) => ({
          filterOptions: { ...state.filterOptions, ...options },
        }));
      },

      clearFilters: () => {
        set({
          filterOptions: {
            search: '',
          },
        });
      },

      // Getters
      getSelectedEquipment: () => {
        const { equipments, selectedEquipmentId } = get();
        return equipments.find((eq) => eq.id === selectedEquipmentId) || null;
      },

      getFilteredEquipments: () => {
        const { equipments, filterOptions } = get();
        let filtered = [...equipments];

        // 검색어 필터
        if (filterOptions.search) {
          const searchLower = filterOptions.search.toLowerCase();
          filtered = filtered.filter(
            (eq) =>
              eq.name.toLowerCase().includes(searchLower) ||
              eq.location?.toLowerCase().includes(searchLower) ||
              eq.type?.toLowerCase().includes(searchLower)
          );
        }

        // 위치 필터
        if (filterOptions.location) {
          filtered = filtered.filter((eq) => eq.location === filterOptions.location);
        }

        // 타입 필터
        if (filterOptions.type) {
          filtered = filtered.filter((eq) => eq.type === filterOptions.type);
        }

        return filtered;
      },
    }),
    {
      name: 'port-status-storage', // localStorage key
    }
  )
);

