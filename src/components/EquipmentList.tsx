/**
 * EquipmentList 컴포넌트
 * 
 * 장비 목록을 표시하고 선택할 수 있는 사이드바 컴포넌트입니다.
 * - 필터링된 장비 목록 표시
 * - 장비 클릭 시 선택 (포트 그리드에 표시)
 * - 선택된 장비 하이라이트
 * - 장비 추가 버튼
 */

import { usePortStore } from '../store/usePortStore';
import EquipmentFilter from './EquipmentFilter';
import AddEquipmentModal from './AddEquipmentModal';
import { useState } from 'react';
import type { Equipment } from '../types';

export default function EquipmentList() {
  const { 
    getFilteredEquipments, 
    selectedEquipmentId, 
    selectEquipment,
    deleteEquipment 
  } = usePortStore();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const filteredEquipments = getFilteredEquipments();

  // 장비 선택 핸들러
  const handleEquipmentClick = (equipmentId: string) => {
    selectEquipment(equipmentId);
  };

  // 장비 삭제 핸들러 (우클릭 또는 삭제 버튼)
  const handleDeleteEquipment = (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (confirm('이 장비를 삭제하시겠습니까?')) {
      deleteEquipment(equipmentId);
    }
  };

  // 장비 수정 핸들러
  const handleEditEquipment = (e: React.MouseEvent, equipment: Equipment) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setEditingEquipment(equipment);
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* 헤더 */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">네트워크 장비</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
        >
          + 장비 추가
        </button>
      </div>

      {/* 필터 섹션 */}
      <EquipmentFilter />

      {/* 장비 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredEquipments.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p className="mb-2">장비가 없습니다.</p>
            <p className="text-sm">장비를 추가해주세요.</p>
          </div>
        ) : (
          filteredEquipments.map((equipment) => (
            <div
              key={equipment.id}
              onClick={() => handleEquipmentClick(equipment.id)}
              className={`
                p-4 bg-white dark:bg-gray-700 rounded-lg border-2 cursor-pointer transition-all
                ${
                  selectedEquipmentId === equipment.id
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm'
                }
              `}
            >
              {/* 장비 이름 */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{equipment.name}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => handleEditEquipment(e, equipment)}
                    className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm px-2 py-1"
                    title="장비 수정"
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => handleDeleteEquipment(e, equipment.id)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm px-2 py-1"
                    title="장비 삭제"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* 장비 정보 */}
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {equipment.location && (
                  <p>
                    <span className="font-medium">위치:</span> {equipment.location}
                  </p>
                )}
                {equipment.type && (
                  <p>
                    <span className="font-medium">타입:</span> {equipment.type}
                  </p>
                )}
                <p>
                  <span className="font-medium">포트:</span> {equipment.layout.rows}행 × {equipment.layout.cols}열
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(equipment.updatedAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 장비 추가/수정 모달 */}
      <AddEquipmentModal
        isOpen={isAddModalOpen || !!editingEquipment}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEquipment(null);
        }}
        editingEquipment={editingEquipment}
      />
    </div>
  );
}

