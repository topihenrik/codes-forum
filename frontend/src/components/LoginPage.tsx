import {
  Box, Button, Container, TextField, Typography, Paper,
} from '@mui/material';
import { useMutation, useApolloClient } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../graphql/mutations';
import { decodedTokenVar } from '../cache';
import Notification from './Notification';
import { decodeToken } from '../utils';

function LoginPage() {
  const [login, result] = useMutation(LOGIN_USER);
  const navigate = useNavigate();
  const client = useApolloClient();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      await login({ variables: { username, password } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  useEffect(() => {
    if (result?.data?.login) {
      const token = result.data.login.value;
      localStorage.setItem('auth_token', token);
      decodedTokenVar(decodeToken(token));
      client.resetStore();
      navigate('/');
    }
  }, [result.data, client, navigate]);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper>
        <Paper sx={{
          backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: '16px', display: 'flex', justifyContent: 'center',
        }}
        >
          <Typography variant='h4'>Account Login</Typography>
        </Paper>
        <Box
          component='form'
          sx={{
            display: 'flex', flexDirection: 'column', gap: '16px', padding: { xs: '24px', sm: '32px' }, width: { xs: 'fit-content', sm: '340px' },
          }}
          onSubmit={handleLoginSubmit}
        >
          <TextField
            id='input-username'
            label='Username'
            value={username}
            onChange={(event) => { setUsername(event.target.value); }}
          />
          <TextField
            id='input-password'
            type='password'
            label='Password'
            value={password}
            onChange={(event) => { setPassword(event.target.value); }}
          />
          {result.error && (
            <Notification
              message={result.error.message}
              type='error'
            />
          )}
          <Button
            id='btn-login'
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
