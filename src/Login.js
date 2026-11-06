import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.get('http://localhost:9000/accounts');
      const accounts = res.data;

      const user = accounts.find(
        (acc) => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
      );

      if (!user) {
        setError('Sai email hoặc mật khẩu!');
        return;
      }

      if (user.status && user.status.toLowerCase() === 'inactive') {
        setError('Tài khoản đã bị khóa');
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));
      navigate('/subjects');
    } catch (err) {
      setError('Không thể kết nối đến máy chủ Mock API (port 9000)');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }} className="p-4 shadow-sm">
        <h3 className="text-center mb-4">Sign In</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="email of student or lecture"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Login;

