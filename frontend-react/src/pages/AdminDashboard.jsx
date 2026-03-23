import React, { useState, useContext, useReducer } from 'react';
import { MarksContext } from '../context/MarksContext';

// [USER REQUEST]: useReducer
// Using useReducer to securely manage the UI state of the form (errors, loading states, etc.)
const uiReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ERROR': return { ...state, error: action.payload };
    case 'CLEAR_ERROR': return { ...state, error: '' };
    default: return state;
  }
};

const AdminDashboard = () => {
  const { marks, addMark, deleteMark } = useContext(MarksContext);
  
  const [formData, setFormData] = useState({
    studentName: '', regNo: '', courseCode: '', courseType: 'T',
    A1: '', A2: '', L1: '', L2: '', Asg1: '', Asg2: ''
  });
  
  const [uiState, dispatch] = useReducer(uiReducer, { error: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'CLEAR_ERROR' });
    
    if (!formData.studentName || !formData.regNo || !formData.courseCode) {
      dispatch({ type: 'SET_ERROR', payload: 'Student Name, Register Number, and Course Code are required.' });
      return;
    }

    const A1 = Number(formData.A1) || 0;
    const A2 = Number(formData.A2) || 0;
    let internal = 0;
    let recordSubjects = { A1, A2 };

    if (formData.courseType === 'LIT') {
      const L1 = Number(formData.L1) || 0;
      const L2 = Number(formData.L2) || 0;
      const Asg1 = Number(formData.Asg1) || 0;
      internal = (A1 + A2 + L1 + L2 + Asg1) / 10;
      recordSubjects = { ...recordSubjects, L1, L2, Asg1, internal };
    } else {
      const Asg1 = Number(formData.Asg1) || 0;
      const Asg2 = Number(formData.Asg2) || 0;
      internal = (A1 + A2 + Asg1 + Asg2) / 10;
      recordSubjects = { ...recordSubjects, Asg1, Asg2, internal };
    }

    const newRecord = {
      studentName: formData.studentName,
      regNo: formData.regNo,
      courseCode: formData.courseCode,
      courseType: formData.courseType,
      subjects: recordSubjects
    };

    addMark(newRecord);

    setFormData({ studentName: '', regNo: '', courseCode: '', courseType: 'T', A1: '', A2: '', L1: '', L2: '', Asg1: '', Asg2: '' });
  };

  return (
    <div className="dashboard-container">
      <h2>Admin / Teacher Dashboard</h2>
      
      <div className="admin-grid">
        <div className="add-container" style={{maxWidth: '100%'}}>
          <h3>Add Course Record</h3>
          {uiState.error && <p className="error">{uiState.error}</p>}
          <form onSubmit={handleAddSubmit} className="mark-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Register Number</label>
                <input type="text" name="regNo" value={formData.regNo} onChange={handleInputChange} autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Course Code</label>
                <input type="text" name="courseCode" value={formData.courseCode} onChange={handleInputChange} autoComplete="off" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Course Type</label>
                <select name="courseType" value={formData.courseType} onChange={handleInputChange} className="dropdown-select">
                  <option value="T">Theory (T)</option>
                  <option value="LIT">Lab-Integrated-Theory (LIT)</option>
                </select>
              </div>
            </div>

            <h4>Internal Marks (Out of 100 per component)</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Assessment 1</label>
                <input type="number" name="A1" value={formData.A1} onChange={handleInputChange} min="0" max="100" />
              </div>
              <div className="form-group">
                <label>Assessment 2</label>
                <input type="number" name="A2" value={formData.A2} onChange={handleInputChange} min="0" max="100" />
              </div>
              
              {formData.courseType === 'LIT' && (
                <>
                  <div className="form-group">
                    <label>Lab Test 1</label>
                    <input type="number" name="L1" value={formData.L1} onChange={handleInputChange} min="0" max="100" />
                  </div>
                  <div className="form-group">
                    <label>Lab Test 2</label>
                    <input type="number" name="L2" value={formData.L2} onChange={handleInputChange} min="0" max="100" />
                  </div>
                  <div className="form-group">
                    <label>Assignment</label>
                    <input type="number" name="Asg1" value={formData.Asg1} onChange={handleInputChange} min="0" max="100" />
                  </div>
                </>
              )}

              {formData.courseType === 'T' && (
                <>
                  <div className="form-group">
                    <label>Assignment 1</label>
                    <input type="number" name="Asg1" value={formData.Asg1} onChange={handleInputChange} min="0" max="100" />
                  </div>
                  <div className="form-group">
                    <label>Assignment 2</label>
                    <input type="number" name="Asg2" value={formData.Asg2} onChange={handleInputChange} min="0" max="100" />
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="submit-btn" style={{marginTop: '10px'}}>Save Record</button>
          </form>
        </div>
      </div>

      <div style={{marginTop: '30px'}}>
        <h3>All Courses Records</h3>
        <table className="marks-table">
          <thead>
            <tr>
              <th>Register No</th>
              <th>Name</th>
              <th>Course Code</th>
              <th>Type</th>
              <th>Assess 1</th>
              <th>Assess 2</th>
              <th>Internal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {marks.map(record => (
              <tr key={record.id}>
                <td>{record.regNo}</td>
                <td>{record.studentName}</td>
                <td>{record.courseCode}</td>
                <td>{record.courseType}</td>
                <td>{record.subjects?.A1}</td>
                <td>{record.subjects?.A2}</td>
                <td>{record.subjects?.internal} / {record.courseType === 'LIT' ? '50' : '40'}</td>
                <td>
                  <button className="del-btn" onClick={() => deleteMark(record.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {marks.length === 0 && (
              <tr><td colSpan="8" style={{textAlign: 'center'}}>No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
