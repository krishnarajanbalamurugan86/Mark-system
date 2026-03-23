import React, { useContext } from 'react';
import { MarksContext } from '../context/MarksContext';
import { useSortAndFilter } from '../hooks/useSortAndFilter';

// Props handling demonstration
const MarkRow = ({ record, onDelete }) => (
  <div className="mark-row">
    <div>
      <strong>{record.studentName}</strong> - {record.subject}
    </div>
    <div>
      <span className="score-badge">{record.score}</span>
      <button className="del-btn" onClick={() => onDelete(record.id)}>Delete</button>
    </div>
  </div>
);

const Dashboard = () => {
  const { marks, loading, deleteMark } = useContext(MarksContext);
  const { processedData, searchTerm, setSearchTerm, sortOrder, setSortOrder } = useSortAndFilter(marks);

  // Conditional Rendering
  if (loading) return <div className="loading">Loading internal data...</div>;

  return (
    <div className="dashboard-container">
      <h2>Student Records</h2>
      
      <div className="controls">
        <input 
          type="text" 
          placeholder="Search by name or subject..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Sort by Score (Low to High)</option>
          <option value="desc">Sort by Score (High to Low)</option>
        </select>
      </div>

      <div className="records-list">
        {processedData.length === 0 ? (
          <p>No records found matching your criteria.</p>
        ) : (
          processedData.map((record) => (
            <MarkRow key={record.id} record={record} onDelete={deleteMark} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
