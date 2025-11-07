/**
 * EquipmentFilter 컴포넌트
 * 
 * 장비 목록을 필터링하기 위한 검색 및 필터 UI를 제공합니다.
 * - 검색어 입력: 장비 이름, 위치, 타입으로 검색
 * - 위치 필터: 특정 위치의 장비만 표시
 * - 타입 필터: 특정 타입의 장비만 표시
 */

import { usePortStore } from '../store/usePortStore';
import { useState, useEffect } from 'react';

export default function EquipmentFilter() {
  const { filterOptions, setFilterOptions, clearFilters, getFilteredEquipments } = usePortStore();
  
  // 필터링된 장비 목록에서 고유한 위치와 타입 추출
  const filteredEquipments = getFilteredEquipments();
  const uniqueLocations = Array.from(
    new Set(filteredEquipments.map((eq) => eq.location).filter(Boolean))
  ) as string[];
  const uniqueTypes = Array.from(
    new Set(filteredEquipments.map((eq) => eq.type).filter(Boolean))
  ) as string[];

  // 검색어 입력 핸들러
  const handleSearchChange = (value: string) => {
    setFilterOptions({ search: value });
  };

  // 위치 필터 변경 핸들러
  const handleLocationChange = (location: string) => {
    setFilterOptions({ location: location || undefined });
  };

  // 타입 필터 변경 핸들러
  const handleTypeChange = (type: string) => {
    setFilterOptions({ type: type || undefined });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 space-y-3">
      {/* 검색 입력창 */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          검색
        </label>
        <input
          id="search"
          type="text"
          value={filterOptions.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="장비 이름, 위치, 타입으로 검색..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 위치 필터 */}
      {uniqueLocations.length > 0 && (
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            위치
          </label>
          <select
            id="location"
            value={filterOptions.location || ''}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">전체</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 타입 필터 */}
      {uniqueTypes.length > 0 && (
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            타입
          </label>
          <select
            id="type"
            value={filterOptions.type || ''}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">전체</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 필터 초기화 버튼 */}
      {(filterOptions.search || filterOptions.location || filterOptions.type) && (
        <button
          onClick={clearFilters}
          className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
        >
          필터 초기화
        </button>
      )}
    </div>
  );
}

