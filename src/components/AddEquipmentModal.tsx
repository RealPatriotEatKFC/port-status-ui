/**
 * AddEquipmentModal 컴포넌트
 * 
 * 새 장비를 추가하거나 기존 장비를 수정하기 위한 모달 다이얼로그입니다.
 * - 장비 이름 입력
 * - 위치 입력 (선택)
 * - 타입 입력 (선택)
 * - 포트 레이아웃 설정 (행/열 개수)
 * - 유효성 검사
 * - 수정 모드 시 기존 포트 정보 보존
 */

import { useState, useEffect } from 'react';
import { usePortStore } from '../store/usePortStore';
import type { Equipment } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingEquipment?: Equipment | null; // 수정할 장비 정보
}

export default function AddEquipmentModal({ isOpen, onClose, editingEquipment }: AddEquipmentModalProps) {
  const { addEquipment, updateEquipment } = usePortStore();
  const t = useTranslation();
  const isEditMode = !!editingEquipment;
  
  // 폼 상태
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [rows, setRows] = useState(2); // 기본값: 2행
  const [cols, setCols] = useState(10); // 기본값: 10열

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (isOpen && editingEquipment) {
      setName(editingEquipment.name);
      setLocation(editingEquipment.location || '');
      setType(editingEquipment.type || '');
      setRows(editingEquipment.layout.rows);
      setCols(editingEquipment.layout.cols);
    } else if (isOpen && !editingEquipment) {
      // 추가 모드일 때 폼 초기화
      setName('');
      setLocation('');
      setType('');
      setRows(2);
      setCols(10);
    }
  }, [isOpen, editingEquipment]);

  // 모달이 닫힐 때 폼 초기화
  const handleClose = () => {
    setName('');
    setLocation('');
    setType('');
    setRows(2);
    setCols(10);
    onClose();
  };

  // 장비 추가/수정 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!name.trim()) {
      alert(t.equipment.nameRequired);
      return;
    }
    
    if (rows < 1 || cols < 1) {
      alert(t.equipment.rowsRequired);
      return;
    }

    if (isEditMode && editingEquipment) {
      // 장비 수정
      updateEquipment(editingEquipment.id, {
        name: name.trim(),
        location: location.trim() || undefined,
        type: type.trim() || undefined,
        layout: { rows, cols },
      });
    } else {
      // 장비 추가
      addEquipment(
        name.trim(),
        { rows, cols },
        location.trim() || undefined,
        type.trim() || undefined
      );
    }

    // 폼 초기화 및 모달 닫기
    handleClose();
  };

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    // 배경 오버레이 (클릭 시 모달 닫기)
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      {/* 모달 컨텐츠 */}
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 버블링 방지
      >
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEditMode ? t.equipment.edit : t.equipment.addNew}
          </h2>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* 장비 이름 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.equipment.name} <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.equipment.namePlaceholder}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* 위치 */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.common.location}
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t.equipment.locationPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 타입 */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.common.type}
            </label>
            <input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder={t.equipment.typePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 포트 레이아웃 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rows" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.equipment.rows} <span className="text-red-500">*</span>
              </label>
              <input
                id="rows"
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="cols" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.equipment.cols} <span className="text-red-500">*</span>
              </label>
              <input
                id="cols"
                type="number"
                min="1"
                max="50"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 포트 개수 미리보기 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isEditMode ? (
                <>
                  {t.common.total} <span className="font-semibold text-gray-900 dark:text-gray-100">{rows * cols}</span> {t.equipment.portCountEdit}
                  {editingEquipment && rows * cols < editingEquipment.ports.length && (
                    <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                      {t.equipment.layoutWarning}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {t.common.total} <span className="font-semibold text-gray-900 dark:text-gray-100">{rows * cols}</span> {t.equipment.portCount}
                </>
              )}
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
            >
              {isEditMode ? t.common.edit : t.common.add}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

