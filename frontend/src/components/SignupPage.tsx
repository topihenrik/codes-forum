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

interface IError {
  message: string
}

function SignupPage() {
  const [signup, result] = useMutation(CREATE_USER);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<IError | null >(null);

  if (result.data) {
    navigate('/login');
  }

  useEffect(() => {
    if (result.error) {
      if (result.error.networkError) { // parse network error message
        const netError = result.error.networkError as ServerError;
        setError({ message: netError.result.errors[0].message });
      } else { // parse graphql error message
        setError({ message: result.error.message });
      }
    }
  }, [result.error]);

  const handleFileChange = (event: React.ChangeEvent) => {
    const inputFileElement = event.target as HTMLInputElement;
    if (!inputFileElement.files) {
      setFile(null);
      return;
    }
    setFile(inputFileElement.files[0]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    signup({ variables: { username, password, password_confirm: passwordConfirm } });
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
          onSubmit={handleSubmit}
        >
          <TextField
            label='Username'
            value={username}
            onChange={(event) => { setUsername(event.target.value); }}
          />
          <TextField
            type='password'
            label='Create Password'
            value={password}
            onChange={(event) => { setPassword(event.target.value); }}
          />
          <TextField
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
            {file ? file.name : 'Upload Avatar (max: 2MB)'}
            <input
              type='file'
              hidden
              accept='image/png, image/jpeg'
              onChange={handleFileChange}
            />
          </Button>
          {error && <Notification message={error.message} />}
          <Button
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
