import { useMutation } from '@apollo/client';
import {
  Box, Button, Container, TextField, Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CREATE_USER } from '../graphql/mutations';
import Notification from './Notification';

function SignupPage() {
  const [signup, result] = useMutation(CREATE_USER);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  if (result.data) {
    navigate('/login');
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    signup({ variables: { username, password, password_confirm: passwordConfirm } });
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <form
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content', gap: '16px',
        }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">Signup</Typography>
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: '16px', width: 'fit-content',
        }}
        >
          <TextField label="username" value={username} onChange={(event) => { setUsername(event.target.value); }} />
          <TextField type="password" label="create password" value={password} onChange={(event) => { setPassword(event.target.value); }} />
          <TextField type="password" label="confirm password" value={passwordConfirm} onChange={(event) => { setPasswordConfirm(event.target.value); }} />
          {result.error && <Notification message={result.error.message} />}
          <Button variant="contained" type="submit" disabled={result.loading}>Signup</Button>
        </Box>
      </form>
    </Container>
  );
}

export default SignupPage;
