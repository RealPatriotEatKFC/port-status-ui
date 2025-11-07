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
import { useTranslation } from '../hooks/useTranslation';

interface PortGridProps {
  isSidebarOpen: boolean;
}

export default function PortGrid({ isSidebarOpen }: PortGridProps) {
  const { getSelectedEquipment, updatePortNamesBatch } = usePortStore();
  const t = useTranslation();
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchNameModalOpen, setIsBatchNameModalOpen] = useState(false);
  const [namePattern, setNamePattern] = useState('');

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
          <p className="text-lg mb-2">{t.port.selectEquipment}</p>
          <p className="text-sm">{t.port.selectEquipmentDesc}</p>
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
      case '미지정':
        return 'bg-port-unspecified hover:bg-purple-600';
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
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{equipment.name}</h2>
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
              {equipment.location && (
                <span>
                  <span className="font-medium">{t.common.location}:</span> {equipment.location}
                </span>
              )}
              {equipment.type && (
                <span>
                  <span className="font-medium">{t.common.type}:</span> {equipment.type}
                </span>
              )}
              <span>
                <span className="font-medium">{t.common.layout}:</span> {equipment.layout.rows}{t.common.rows} × {equipment.layout.cols}{t.common.cols}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsBatchNameModalOpen(true)}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium text-sm"
            title={t.port.batchRename}
          >
            {t.port.batchRename}
          </button>
        </div>
      </div>

      {/* 포트 그리드 */}
      <div className="flex-1 overflow-auto">
        <div className="w-full">
          {/* 상태 범례 */}
          <div className="mb-4 flex gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-port-normal rounded"></div>
              <span>{t.portStatus.normal}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-port-unused rounded"></div>
              <span>{t.portStatus.unused}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-port-check rounded"></div>
              <span>{t.portStatus.check}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-port-unspecified rounded"></div>
              <span>{t.portStatus.unspecified}</span>
            </div>
          </div>

          {/* 포트 개수 정보 */}
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            {t.common.total} {equipment.ports.length} {t.port.portCount} ({equipment.layout.rows}{t.common.rows} × {equipment.layout.cols}{t.common.cols})
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
                      title={`${port.name} - ${port.status === '정상' ? t.portStatus.normal : port.status === '미사용' ? t.portStatus.unused : port.status === '점검필요' ? t.portStatus.check : t.portStatus.unspecified}${port.note ? `\n${t.common.note}: ${port.note}` : ''}`}
                    >
                      {/* 포트 이름 - 길이에 따라 폰트 크기 조정 */}
                      <span className={`${fontSizeClass} font-medium break-words text-center leading-tight max-w-full px-1`}>
                        {port.name}
                      </span>
                      {/* 포트 상태 */}
                      <span className="text-[10px] mt-0.5 opacity-90">
                        {port.status === '정상' ? t.portStatus.normal : port.status === '미사용' ? t.portStatus.unused : port.status === '점검필요' ? t.portStatus.check : t.portStatus.unspecified}
                      </span>
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

      {/* 포트 이름 일괄 변경 모달 */}
      {isBatchNameModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setIsBatchNameModalOpen(false);
            setNamePattern('');
          }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t.port.batchRenameTitle}</h2>
            </div>

            {/* 폼 */}
            <div className="px-6 py-4 space-y-4">
              {/* 패턴 입력 */}
              <div>
                <label htmlFor="name-pattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.port.namePattern}
                </label>
                <input
                  id="name-pattern"
                  type="text"
                  value={namePattern}
                  onChange={(e) => setNamePattern(e.target.value)}
                  placeholder={t.port.namePatternPlaceholder}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (namePattern.trim()) {
                        updatePortNamesBatch(equipment.id, namePattern.trim());
                        setIsBatchNameModalOpen(false);
                        setNamePattern('');
                      } else {
                        alert(t.port.namePatternRequired);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">{t.port.supportedFormats}:</p>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                    <div>
                      <span className="font-medium">{t.port.format1}</span> <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">{t.port.format1Example}</code>
                      <p className="ml-4 mt-0.5 text-gray-500">{t.port.format1Desc}</p>
                    </div>
                    <div>
                      <span className="font-medium">{t.port.format2}</span> <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">{t.port.format2Example}</code>
                      <p className="ml-4 mt-0.5 text-gray-500">{t.port.format2Desc}</p>
                    </div>
                    <div>
                      <span className="font-medium">{t.port.format3}</span> <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">{t.port.format3Example}</code>
                      <p className="ml-4 mt-0.5 text-gray-500">{t.port.format3Desc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsBatchNameModalOpen(false);
                    setNamePattern('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (namePattern.trim()) {
                      updatePortNamesBatch(equipment.id, namePattern.trim());
                      setIsBatchNameModalOpen(false);
                      setNamePattern('');
                    } else {
                      alert(t.port.namePatternRequired);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
                >
                  {t.common.apply}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

