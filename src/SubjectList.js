import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SubjectList() {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    // Fetch subjects & questions
    const fetchData = async () => {
      try {
        const [subRes, qRes] = await Promise.all([
          axios.get('http://localhost:9000/subjects'),
          axios.get('http://localhost:9000/questions'),
        ]);
        setSubjects(subRes.data);
        setQuestions(qRes.data);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredSubjects = subjects.filter((s) => {
    const term = search.toLowerCase();
    const idMatch = s.id ? s.id.toLowerCase().includes(term) : false;
    const nameMatch = s.name ? s.name.toLowerCase().includes(term) : false;
    return idMatch || nameMatch;
  });

  const getQuestionCount = (subjectId) => {
    return questions.filter((q) => q.subjectId === subjectId).length;
  };

  if (!user) return null;

  return (
    <Container className="mt-4">
      {/* Header & User Information */}
      <Row className="align-items-center mb-3">
        <Col>
          <span className="text-secondary">
            Hello {user.email} ({user.role})
          </span>
        </Col>
        <Col className="text-end">
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>

      <h3 className="mb-3">Danh sách môn học</h3>

      {/* Search & Filter */}
      <Form.Group className="mb-3" style={{ maxWidth: '400px' }}>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm môn học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>

      {/* Subject Table */}
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Mã môn</th>
            <th>Tên môn học</th>
            <th>Số lượng câu hỏi</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.map((sub) => (
            <tr key={sub.id}>
              <td>{sub.id}</td>
              <td>{sub.name}</td>
              <td>{getQuestionCount(sub.id)}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/questions/${sub.id}`)}
                >
                  Truy cập bộ câu hỏi
                </Button>
                <Button variant="secondary" size="sm">
                  Thông tin
                </Button>
              </td>
            </tr>
          ))}
          {filteredSubjects.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                Không tìm thấy môn học nào
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default SubjectList;

