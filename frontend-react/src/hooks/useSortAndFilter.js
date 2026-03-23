import { useMemo, useState } from 'react';

// Custom Hook demonstration
export const useSortAndFilter = (dataList) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // asc or desc

  const processedData = useMemo(() => {
    // Filter
    let result = dataList.filter(item => 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    result = result.sort((a, b) => {
      if (sortOrder === 'asc') return a.score - b.score;
      return b.score - a.score;
    });

    return result;
  }, [dataList, searchTerm, sortOrder]);

  return { processedData, searchTerm, setSearchTerm, sortOrder, setSortOrder };
};
