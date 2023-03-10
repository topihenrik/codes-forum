import { ServerError, useMutation } from '@apollo/client';
import {
  Box, Button, Container, TextField, Typography,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { CREATE_USER } from '../graphql/mutations';
import Notification from './Notification';

interface INotification {
  message: string,
  type: 'success' | 'error'
}

function SignupPage() {
  const [signup, result] = useMutation(CREATE_USER);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [avatar, setAvatar] = useState<File | undefined>(undefined);
  const [notification, setNotification] = useState<INotification | null>(null);

  // Handle notification change
  useEffect(() => {
    const timeid = setTimeout(() => { setNotification(null); }, 5000);
    return () => { clearTimeout(timeid); };
  }, [notification]);

  // Signup failed -> Inform user about issues
  useEffect(() => {
    if (result.error) {
      if (result.error.networkError) { // parse network error message
        const netError = result.error.networkError as ServerError;
        setNotification({ message: netError.result.errors[0].message, type: 'error' });
      } else { // parse graphql error message
        setNotification({ message: result.error.message, type: 'error' });
      }
    }
  }, [result.error]);

  // Signup success -> Navigate to login page
  useEffect(() => {
    if (result.data?.createUser) {
      navigate('/login');
    }
  }, [result.data, navigate]);

  const handleFileChange = (event: React.ChangeEvent) => {
    const inputFileElement = event.target as HTMLInputElement;
    if (!inputFileElement.files) {
      setAvatar(undefined);
      return;
    }
    setAvatar(inputFileElement.files[0]);
  };

  const handleSignupSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      await signup(
        {
          variables: {
            username, password, password_confirm: passwordConfirm, avatar,
          },
        },
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper>
        <Paper
          sx={{
            backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: '16px', display: 'flex', justifyContent: 'center',
          }}
        >
          <Typography variant='h4'>Create account</Typography>
        </Paper>
        <Box
          component='form'
          sx={{
            display: 'flex', flexDirection: 'column', gap: '16px', padding: { xs: '24px', sm: '32px' }, width: { xs: 'fit-content', sm: '340px' },
          }}
          onSubmit={handleSignupSubmit}
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
            label='Create Password'
            value={password}
            onChange={(event) => { setPassword(event.target.value); }}
          />
          <TextField
            id='input-confirm-password'
            type='password'
            label='Confirm Password'
            value={passwordConfirm}
            onChange={(event) => { setPasswordConfirm(event.target.value); }}
          />
          <Button
            variant='outlined'
            component='label'
          >
            <FileUploadIcon />
            {avatar ? avatar.name : 'Upload Avatar (max: 2MB)'}
            <input
              type='file'
              hidden
              accept='image/png, image/jpeg'
              onChange={handleFileChange}
            />
          </Button>
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
            />
          )}
          <Button
            id='btn-signup'
            variant='contained'
            type='submit'
            disabled={result.loading}
          >
            Signup
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignupPage;
