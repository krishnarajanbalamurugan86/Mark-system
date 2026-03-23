import React, { useRef, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarksContext } from '../context/MarksContext';

const AddMark = () => {
  const { addMark } = useContext(MarksContext);
  const navigate = useNavigate();
  
  // useRef demonstration
  const nameRef = useRef(null);
  const subjectRef = useRef(null);
  const scoreRef = useRef(null);

  const [error, setError] = useState('');

  // Event handling
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const name = nameRef.current.value;
    const subject = subjectRef.current.value;
    const score = Number(scoreRef.current.value);

    if (!name || !subject || !score) {
      setError('All fields are required.');
      return;
    }

    addMark({ studentName: name, subject, score });
    navigate('/');
  };

  return (
    <div className="add-container">
      <h2>Add New Mark Record</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="mark-form">
        <div className="form-group">
          <label>Student Name</label>
          <input type="text" ref={nameRef} placeholder="Enter name" />
        </div>
        <div className="form-group">
          <label>Subject</label>
          <input type="text" ref={subjectRef} placeholder="Enter subject" />
        </div>
        <div className="form-group">
          <label>Score (Marks)</label>
          <input type="number" ref={scoreRef} placeholder="Enter score" />
        </div>
        <button type="submit" className="submit-btn">Save Record</button>
      </form>
    </div>
  );
};

export default AddMark;
