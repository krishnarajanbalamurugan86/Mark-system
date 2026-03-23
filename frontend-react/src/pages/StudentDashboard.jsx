import React, { useContext, useMemo } from 'react';
import { MarksContext } from '../context/MarksContext';
import { AuthContext } from '../context/AuthContext';

const StudentDashboard = () => {
  const { marks } = useContext(MarksContext);
  const { user } = useContext(AuthContext);

  // Find all courses for this student
  const studentRecords = useMemo(() => {
    return marks.filter(m => m.regNo === user.username);
  }, [marks, user]);

  if (!studentRecords || studentRecords.length === 0) {
    return (
      <div className="dashboard-container">
        <h2>Student Dashboard</h2>
        <p className="error">No records found for Register Number: <strong>{user?.username}</strong></p>
        <p>Please contact your teacher to ensure your marks have been uploaded.</p>
      </div>
    );
  }

  // Use the student's name and details from the first record found
  const { studentName, regNo } = studentRecords[0];

  return (
    <div className="dashboard-container">
      <h2>Welcome, {studentName}!</h2>
      
      <div className="student-card info-card">
        <p><strong>Register Number:</strong> {regNo}</p>
        <p><strong>Department:</strong> CSE</p>
      </div>

      <div className="student-card marks-card" style={{padding: '0'}}>
        <h3 style={{padding: '20px 20px 0 20px'}}>Internal Marks by Course</h3>
        <table className="marks-table" style={{marginTop: '15px'}}>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Assessment 1</th>
              <th>Assessment 2</th>
              <th>Internals</th>
            </tr>
          </thead>
          <tbody>
            {studentRecords.map(record => (
              <tr key={record.id}>
                <td><strong>{record.courseCode || 'N/A'}</strong> ({record.courseType || 'T'})</td>
                <td><span className="score-badge">{record.subjects?.A1 ?? '-'}</span></td>
                <td><span className="score-badge">{record.subjects?.A2 ?? '-'}</span></td>
                <td>
                  <span className="score-badge" style={{ backgroundColor: '#2e7d32', color: 'white' }}>
                    {record.subjects?.internal ?? '-'} / {record.courseType === 'LIT' ? '50' : '40'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;
