import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import SubjectList from './SubjectList';
import QuestionManagement from './QuestionManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/subjects" element={<SubjectList />} />
        <Route path="/syllabus" element={<SubjectList />} />
        <Route path="/questions/:id" element={<QuestionManagement />} />
        {/* Redirect root (/) and any invalid paths (*) to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
