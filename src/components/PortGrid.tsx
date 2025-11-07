/**
 * PortGrid 컴포넌트
 * 
 * 선택된 장비의 포트들을 그리드 형태로 표시하는 컴포넌트입니다.
 * - 장비의 레이아웃(행/열)에 맞춰 포트 그리드 생성
 * - 각 포트를 클릭하면 PortModal 열림
 * - 포트 상태에 따라 색상으로 표시
 * - 포트 이름과 상태를 시각적으로 표시
 */

import { useState } from 'react';
import { usePortStore } from '../store/usePortStore';
import type { Port, PortStatus } from '../types';
import PortModal from './PortModal';

interface PortGridProps {
  isSidebarOpen: boolean;
}

export default function PortGrid({ isSidebarOpen }: PortGridProps) {
  const { getSelectedEquipment } = usePortStore();
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const equipment = getSelectedEquipment();

  // 장비가 선택되지 않았을 때
  if (!equipment) {
    return (
      <div 
        className="flex-1 flex items-center justify-center bg-gray-50 transition-all duration-300"
        style={{
          // 사이드바가 열려있을 때: 사이드바 너비(320px)만큼, 닫혀있을 때: 토글 버튼(48px)만큼 왼쪽 마진 추가
          marginLeft: isSidebarOpen ? '320px' : '48px',
        }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">장비를 선택해주세요</p>
          <p className="text-sm">왼쪽 목록에서 장비를 선택하면 포트 그리드가 표시됩니다.</p>
        </div>
      </div>
    );
  }

  // 포트 클릭 핸들러
  const handlePortClick = (port: Port) => {
    setSelectedPort(port);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPort(null);
  };

  // 포트 상태별 색상 클래스
  const getStatusColorClass = (status: PortStatus) => {
    switch (status) {
      case '정상':
        return 'bg-port-normal hover:bg-green-600';
      case '미사용':
        return 'bg-port-unused hover:bg-gray-600';
      case '점검필요':
        return 'bg-port-check hover:bg-orange-600';
      default:
        return 'bg-gray-400';
    }
  };

  // 포트 상태별 텍스트 색상
  const getStatusTextColor = (status: PortStatus) => {
    switch (status) {
      case '정상':
        return 'text-white';
      case '미사용':
        return 'text-white';
      case '점검필요':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  // 그리드에서 포트 찾기 (행, 열 기준)
  const getPortAtPosition = (row: number, col: number): Port | undefined => {
    return equipment.ports.find((p) => p.row === row && p.col === col);
  };

  return (
    <div 
      className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-300"
      style={{
        // 사이드바가 열려있을 때: 사이드바 너비(320px)만큼, 닫혀있을 때: 토글 버튼(48px)만큼 왼쪽 마진 추가
        marginLeft: isSidebarOpen ? '320px' : '48px',
      }}
    >
      {/* 헤더 */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{equipment.name}</h2>
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
          {equipment.location && (
            <span>
              <span className="font-medium">위치:</span> {equipment.location}
            </span>
          )}
          {equipment.type && (
            <span>
              <span className="font-medium">타입:</span> {equipment.type}
            </span>
          )}
          <span>
            <span className="font-medium">레이아웃:</span> {equipment.layout.rows}행 × {equipment.layout.cols}열
          </span>
        </div>
      </div>

      {/* 포트 그리드 */}
      <div className="flex-1 overflow-auto">
        <div className="w-full">
          {/* 상태 범례 */}
          <div className="mb-4 flex gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-port-normal rounded"></div>
              <span>정상</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-port-unused rounded"></div>
              <span>미사용</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-port-check rounded"></div>
              <span>점검필요</span>
            </div>
          </div>

          {/* 포트 개수 정보 (디버깅용) */}
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            총 {equipment.ports.length}개 포트 ({equipment.layout.rows}행 × {equipment.layout.cols}열)
          </div>

          {/* 그리드 컨테이너 - 브라우저 크기에 맞춰 자동 조절 */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div
              className="grid gap-3"
              style={{
                // 그리드 컬럼을 화면 너비에 맞춰 자동 조절
                // minmax(80px, 1fr): 최소 80px 보장, 화면이 넓으면 균등 분배
                gridTemplateColumns: `repeat(${equipment.layout.cols}, minmax(80px, 1fr))`,
              }}
            >
              {/* 각 행 */}
              {Array.from({ length: equipment.layout.rows }).map((_, rowIndex) => (
                // 각 열
                Array.from({ length: equipment.layout.cols }).map((_, colIndex) => {
                  const port = getPortAtPosition(rowIndex, colIndex);
                  
                  if (!port) {
                    // 포트가 없는 경우 (이론적으로는 발생하지 않아야 함)
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="min-w-[80px] min-h-[80px] bg-gray-200 rounded border-2 border-dashed border-gray-300"
                      />
                    );
                  }

                  // 포트 이름 길이에 따라 폰트 크기 조정
                  const nameLength = port.name.length;
                  const fontSizeClass = nameLength > 10 ? 'text-[10px]' : nameLength > 6 ? 'text-xs' : 'text-sm';

                  return (
                    <button
                      key={port.id}
                      onClick={() => handlePortClick(port)}
                      className={`
                        min-w-[80px] w-full aspect-square rounded border-2 transition-all
                        ${getStatusColorClass(port.status)}
                        ${getStatusTextColor(port.status)}
                        border-gray-300 hover:border-blue-500 hover:shadow-md
                        flex flex-col items-center justify-center p-1.5
                        cursor-pointer
                      `}
                      title={`${port.name} - ${port.status}${port.note ? `\n메모: ${port.note}` : ''}`}
                    >
                      {/* 포트 이름 - 길이에 따라 폰트 크기 조정 */}
                      <span className={`${fontSizeClass} font-medium break-words text-center leading-tight max-w-full px-1`}>
                        {port.name}
                      </span>
                      {/* 포트 상태 */}
                      <span className="text-[10px] mt-0.5 opacity-90">{port.status}</span>
                    </button>
                  );
                })
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 포트 모달 */}
      <PortModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        equipmentId={equipment.id}
        port={selectedPort}
      />
    </div>
  );
}

