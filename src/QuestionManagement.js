import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function QuestionManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [subRes, qRes] = await Promise.all([
          axios.get(`http://localhost:9000/subjects/${id}`).catch(() => ({ data: { id: id, name: id } })),
          axios.get(`http://localhost:9000/questions?subjectId=${id}`),
        ]);
        setSubject(subRes.data);
        setQuestions(qRes.data);
      } catch (err) {
        console.error('Error fetching questions', err);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Handle Delete with window.confirm (Function 3 yêu cầu)
  const handleDelete = async (questionId) => {
    const confirm = window.confirm('Bạn có chắc chắn muốn xóa không?');
    if (confirm) {
      try {
        await axios.delete(`http://localhost:9000/questions/${questionId}`);
        setQuestions(questions.filter((q) => q.id !== questionId));
      } catch (err) {
        alert('Lỗi khi xóa câu hỏi');
      }
    }
  };

  return (
    <Container className="mt-4">
      {/* Header & Statistics */}
      <Row className="align-items-center mb-3">
        <Col>
          <h3 className="mb-1">
            Bộ câu hỏi môn: {subject ? `${subject.name} (${subject.id})` : id}
          </h3>
          <p className="text-muted mb-0">
            Tổng số câu hỏi: <strong>{questions.length}</strong>
          </p>
        </Col>
        <Col className="text-end">
          <Button variant="success" className="me-2" size="sm">
            + Thêm câu hỏi mới
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/subjects')}>
            Quay lại danh sách môn
          </Button>
        </Col>
      </Row>

      {/* Question Table */}
      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th style={{ width: '50px' }}>#</th>
            <th>Nội dung câu hỏi</th>
            <th>Các đáp án</th>
            <th>Đáp án đúng</th>
            <th style={{ width: '150px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, index) => (
            <tr key={q.id || index}>
              <td>{index + 1}</td>
              <td>{q.content}</td>
              <td>{Array.isArray(q.options) ? q.options.join(', ') : q.options}</td>
              <td style={{ color: 'green', fontWeight: 'bold' }}>{q.correctAnswer}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2 text-dark">
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(q.id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
          {questions.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                Chưa có câu hỏi nào trong môn này
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default QuestionManagement;
