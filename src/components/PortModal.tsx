/**
 * PortModal 컴포넌트
 * 
 * 포트를 클릭했을 때 나타나는 모달로, 포트의 상세 정보를 입력/수정할 수 있습니다.
 * - 포트 이름 수정
 * - 포트 상태 선택 (정상, 미사용, 점검필요)
 * - 메모 입력
 */

import { useState, useEffect } from 'react';
import { usePortStore } from '../store/usePortStore';
import type { Port, PortStatus } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface PortModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId: string;
  port: Port | null;
}

export default function PortModal({ isOpen, onClose, equipmentId, port }: PortModalProps) {
  const { updatePortName, updatePortStatus, updatePortNote } = usePortStore();
  const t = useTranslation();
  
  // 로컬 상태 (포트 정보를 복사해서 관리)
  const [name, setName] = useState('');
  const [status, setStatus] = useState<PortStatus>('미지정');
  const [note, setNote] = useState('');

  // 포트 정보가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    if (port) {
      setName(port.name);
      setStatus(port.status);
      setNote(port.note || '');
    }
  }, [port]);

  // 모달이 열려있지 않거나 포트가 없으면 렌더링하지 않음
  if (!isOpen || !port) return null;

  // 저장 핸들러
  const handleSave = () => {
    // 포트 정보 업데이트
    updatePortName(equipmentId, port.id, name.trim() || port.name);
    updatePortStatus(equipmentId, port.id, status);
    updatePortNote(equipmentId, port.id, note.trim() || undefined);
    
    // 모달 닫기
    onClose();
  };

  // 상태별 색상 클래스
  const getStatusColorClass = (status: PortStatus) => {
    switch (status) {
      case '정상':
        return 'bg-port-normal text-white';
      case '미사용':
        return 'bg-port-unused text-white';
      case '점검필요':
        return 'bg-port-check text-white';
      case '미지정':
        return 'bg-port-unspecified text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    // 배경 오버레이
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* 모달 컨텐츠 */}
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t.port.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.port.position}: {port.row + 1}{t.common.rows} {port.col + 1}{t.common.cols}
          </p>
        </div>

        {/* 폼 */}
        <div className="px-6 py-4 space-y-4">
          {/* 포트 이름 */}
          <div>
            <label htmlFor="port-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.common.port} {t.common.name}
            </label>
            <input
              id="port-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.port.namePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 포트 상태 */}
          <div>
            <label htmlFor="port-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.common.status}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['정상', '미사용', '점검필요', '미지정'] as PortStatus[]).map((s) => {
                const statusText = s === '정상' ? t.portStatus.normal :
                                  s === '미사용' ? t.portStatus.unused :
                                  s === '점검필요' ? t.portStatus.check :
                                  t.portStatus.unspecified;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`
                      px-4 py-2 rounded-md font-medium transition-all
                      ${
                        status === s
                          ? getStatusColorClass(s) + ' ring-2 ring-offset-2 ring-blue-500'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {statusText}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label htmlFor="port-note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.common.note}
            </label>
            <textarea
              id="port-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
            >
              {t.common.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

