import React, { createContext, useState, useEffect } from 'react';

export const MarksContext = createContext();

export const MarksProvider = ({ children }) => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize from LocalStorage
  useEffect(() => {
    const storedMarks = localStorage.getItem('internal_marks_db');
    if (storedMarks) {
      setMarks(JSON.parse(storedMarks));
    } else {
      // Seed some demo data using the new course format
      const seedData = [
        { 
          id: 1, studentName: 'Alice', regNo: 'stu123', courseCode: 'CS23401', courseType: 'LIT', 
          subjects: { A1: 85, A2: 92, L1: 90, L2: 88, Asg1: 100, internal: 45.5 } 
        },
        { 
          id: 2, studentName: 'Alice', regNo: 'stu123', courseCode: 'MA23C03', courseType: 'T', 
          subjects: { A1: 40, A2: 45, Asg1: 50, Asg2: 50, internal: 18.5 } 
        }
      ];
      setMarks(seedData);
      localStorage.setItem('internal_marks_db', JSON.stringify(seedData));
    }
    setLoading(false);
  }, []);

  const saveToStorage = (newData) => {
    setMarks(newData);
    localStorage.setItem('internal_marks_db', JSON.stringify(newData));
  };

  const addMark = async (newRecord) => {
    const recordWithId = { ...newRecord, id: Date.now() };
    const updated = [...marks, recordWithId];
    saveToStorage(updated);
    
    // Push silently to the backend so Angular can read it
    try {
      await fetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordWithId)
      });
    } catch(err) {
      console.warn('Failed to sync with backend', err);
    }
  };

  const updateMark = (id, updatedRecord) => {
    const updated = marks.map((m) => (m.id === id ? { ...m, ...updatedRecord } : m));
    saveToStorage(updated);
  };

  const deleteMark = (id) => {
    const updated = marks.filter((m) => m.id !== id);
    saveToStorage(updated);
  };

  return (
    <MarksContext.Provider value={{ marks, loading, addMark, updateMark, deleteMark }}>
      {children}
    </MarksContext.Provider>
  );
};
