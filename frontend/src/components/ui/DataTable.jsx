import React, { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DataTable = ({ columns, data, searchable = true, pagination = true, rowClassName = '' }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter data based on search term
  const filteredData = searchTerm
    ? data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // Sort data
  const sortedData = sortField
    ? [...filteredData].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData;

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = pagination ? sortedData.slice(start, start + itemsPerPage) : sortedData;

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="ml-1" />;
    return sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  return (
    <div className="overflow-hidden">
      {searchable && (
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 w-full border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      )}

      <div className="overflow-x-auto shadow rounded-lg px-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => column.sortable !== false && handleSort(column.field)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable !== false && getSortIcon(column.field)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 overflow-visible">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  className={`transition-all duration-200 cursor-pointer hover:scale-[1.025] hover:shadow-lg hover:bg-blue-50 rounded-full border border-transparent hover:border-blue-200 overflow-visible ${rowClassName}`}
                  whileHover={{ scale: 1.001, zIndex: 10 }}
                  initial={{ zIndex: 1 }}
                  style={{ borderRadius: 9999 }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.field}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${column.cellClass || ''}`}
                    >
                      {column.render ? column.render(row) : row[column.field]}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {start + 1} to {Math.min(start + itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-outline py-1 px-2 text-sm disabled:opacity-50 border border-gray-300 rounded-md"
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page + 1)}
                className={`py-1 px-3 text-sm rounded-md border border-gray-300 ${
                  currentPage === page + 1 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-outline py-1 px-2 text-sm disabled:opacity-50 border border-gray-300 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable; 