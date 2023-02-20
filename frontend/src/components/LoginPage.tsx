import {
  Box, Button, Container, TextField, Typography, Paper,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../graphql/mutations';
import { tokenVar } from '../cache';
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

  if (result?.data?.login) {
    const token = result.data.login.value;
    localStorage.setItem('auth_token', token);
    tokenVar(token);
    navigate('/');
  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper>
        <Paper sx={{
          backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: '16px', display: 'flex', justifyContent: 'center',
        }}
        >
          <Typography variant='h4'>Login</Typography>
        </Paper>
        <Box
          component='form'
          sx={{
            display: 'flex', flexDirection: 'column', gap: '16px', padding: { xs: '24px', sm: '32px' }, width: { xs: 'fit-content', sm: '340px' },
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            label='Username'
            value={username}
            onChange={(event) => { setUsername(event.target.value); }}
          />
          <TextField
            type='password'
            label='Password'
            value={password}
            onChange={(event) => { setPassword(event.target.value); }}
          />
          {result.error && <Notification message={result.error.message} />}
          <Button
            variant='contained'
            type='submit'
            disabled={result.loading}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
