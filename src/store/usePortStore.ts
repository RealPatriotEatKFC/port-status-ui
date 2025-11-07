import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Equipment, Port, PortStatus, FilterOptions } from '../types';

interface PortStore {
  // State
  equipments: Equipment[];
  selectedEquipmentId: string | null;
  filterOptions: FilterOptions;
  isDarkMode: boolean;

  // Actions - Theme
  toggleDarkMode: () => void;

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
        status: '미사용',
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
              const newTotalPorts = newRows * newCols;
              const oldTotalPorts = eq.layout.rows * eq.layout.cols;

              // 기존 포트 중 유지할 수 있는 포트들 (새 레이아웃 범위 내)
              const preservedPorts = eq.ports.filter((port) => port.row < newRows && port.col < newCols);

              // 새로운 포트 생성 (부족한 경우)
              const newPorts: Port[] = [];
              let portNumber = preservedPorts.length + 1;

              // 기존 포트 유지
              preservedPorts.forEach((port) => {
                newPorts.push(port);
              });

              // 새로운 포트 추가
              for (let row = 0; row < newRows; row++) {
                for (let col = 0; col < newCols; col++) {
                  // 이미 해당 위치에 포트가 있는지 확인
                  const existingPort = preservedPorts.find((p) => p.row === row && p.col === col);
                  if (!existingPort) {
                    newPorts.push({
                      id: `port-${Date.now()}-${portNumber}`,
                      name: `포트 ${portNumber}`,
                      status: '미사용',
                      row,
                      col,
                    });
                    portNumber++;
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

