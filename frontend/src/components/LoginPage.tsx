import {
  Box, Button, Container, TextField, Typography,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../graphql/mutations';
import { tokenVar } from '../graphql/cache';
import Notification from './Notification';

function LoginPage() {
  const [login, result] = useMutation(LOGIN_USER);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  useEffect(() => {
    if (result?.data?.login) {
      const token = result.data.login.value;
      localStorage.setItem('auth_token', token);
      tokenVar(token);
      navigate('/');
    }
  }, [result.data]);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <form
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content', gap: '16px',
        }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">Login</Typography>
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: '16px', width: 'fit-content',
        }}
        >
          <TextField label="username" value={username} onChange={(event) => { setUsername(event.target.value); }} />
          <TextField type="password" label="password" value={password} onChange={(event) => { setPassword(event.target.value); }} />
          {result.error && <Notification message={result.error.message} />}
          <Button variant="contained" type="submit" disabled={result.loading}>Login</Button>
        </Box>
      </form>
    </Container>
  );
}

export default LoginPage;
