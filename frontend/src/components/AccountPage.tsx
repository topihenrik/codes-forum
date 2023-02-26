import { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';
import {
  Box, Button, Container, Typography, Paper, TextField, Avatar, Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  ServerError, useMutation, useQuery, useReactiveVar,
} from '@apollo/client';
import { decodedTokenVar } from '../cache';
import { GET_ACCOUNT } from '../graphql/queries';
import { AccountQuery } from '../__generated__/graphql';
import { EDIT_BASIC_USER, EDIT_PASSWORD_USER } from '../graphql/mutations';
import Notification from './Notification';

interface BasicInfoFormProps {
  data: AccountQuery | undefined,
  loading: boolean
}

interface INotification {
  message: string,
  type: 'success' | 'error'
}

function BasicInfoForm({ data, loading }: BasicInfoFormProps) {
  const decodedToken = useReactiveVar(decodedTokenVar);
  const [editBasic, result] = useMutation(EDIT_BASIC_USER);
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [notification, setNotification] = useState<INotification | null>(null);

  // Set old datas to text fields
  useEffect(() => {
    setUsername(data?.account?.username || '');
    setBio(data?.account?.bio || '');
  }, [data?.account]);

  // Succesful information update -> Inform user
  useEffect(() => {
    if (result.data?.editBasicUser) {
      setNotification({ message: 'Information updated', type: 'success' });
    }
  }, [result.data?.editBasicUser]);

  // Failed information update -> Inform user about issues
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

  const handleFileChange = (event: React.ChangeEvent) => {
    const inputFileElement = event.target as HTMLInputElement;
    if (!inputFileElement.files) {
      setFile(null);
      return;
    }
    setFile(inputFileElement.files[0]);
  };

  const handleEditBasicSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      await editBasic({ variables: { _id: decodedToken?._id || '', username, bio } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <Paper>
      <Paper sx={{
        backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: '16px',
      }}
      >
        <Typography variant='h6'>Basic Information</Typography>
      </Paper>
      <Box
        component='form'
        sx={{
          display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', padding: { xs: '16px', sm: '32px' }, boxSizing: 'border-box',
        }}
      >
        { (loading) ? (
          <ContentLoader
            viewBox='0 0 340 258'
            backgroundColor='#262626'
            foregroundColor='#2a2a2a'
          >
            <rect
              x='0'
              y='0'
              rx='5'
              ry='5'
              width='340'
              height='60'
            />
            <rect
              x='0'
              y='76'
              rx='5'
              ry='5'
              width='340'
              height='60'
            />
            <rect
              x='0'
              y='152'
              rx='5'
              ry='5'
              width='340'
              height='45'
            />
            <rect
              x='0'
              y='213'
              rx='5'
              ry='5'
              width='340'
              height='45'
            />
          </ContentLoader>
        ) : (
          <>
            <TextField
              id='input-username'
              label='Username'
              // defaultValue={data?.account?.username}
              value={username}
              onChange={(event) => { setUsername(event.target.value); }}
            />
            <TextField
              id='input-bio'
              label='Bio'
              multiline
              // defaultValue={data?.account?.bio}
              value={bio}
              onChange={(event) => { setBio(event.target.value); }}
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
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
              />
            )}
            <Button
              id='btn-update-basic'
              variant='contained'
              onClick={handleEditBasicSubmit}
            >
              Update Information
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
}

interface PasswordInfoFormProps {
  loading: boolean
}

function PasswordInfoForm({ loading }: PasswordInfoFormProps) {
  const decodedToken = useReactiveVar(decodedTokenVar);
  const [editPassword, result] = useMutation(EDIT_PASSWORD_USER);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [notification, setNotification] = useState<INotification | null>(null);

  // Succesful password update -> Inform user
  useEffect(() => {
    if (result.data?.editPasswordUser) {
      setNotification({ message: 'Password updated', type: 'success' });
    }
  }, [result.data?.editPasswordUser]);

  // Failed password update -> Inform user about issues
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

  const handleEditPasswordSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      await editPassword({
        variables: {
          _id: decodedToken?._id || '', old_password: oldPassword, password, password_confirm: passwordConfirm,
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <Paper>
      <Paper sx={{
        backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: '16px',
      }}
      >
        <Typography variant='h6'>Change Password</Typography>
      </Paper>
      <Box
        component='form'
        sx={{
          display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', padding: { xs: '16px', sm: '32px' }, boxSizing: 'border-box',
        }}
      >
        {loading ? (
          <ContentLoader
            viewBox='0 0 340 258'
            backgroundColor='#262626'
            foregroundColor='#2a2a2a'
          >
            <rect
              x='0'
              y='0'
              rx='5'
              ry='5'
              width='340'
              height='60'
            />
            <rect
              x='0'
              y='76'
              rx='5'
              ry='5'
              width='340'
              height='60'
            />
            <rect
              x='0'
              y='152'
              rx='5'
              ry='5'
              width='340'
              height='45'
            />
            <rect
              x='0'
              y='213'
              rx='5'
              ry='5'
              width='340'
              height='45'
            />
          </ContentLoader>
        ) : (
          <>
            <TextField
              id='input-old-password'
              label='Old Password'
              type='password'
              value={oldPassword}
              onChange={(event) => { setOldPassword(event.target.value); }}
            />
            <TextField
              id='input-new-password'
              label='New Password'
              type='password'
              value={password}
              onChange={(event) => { setPassword(event.target.value); }}
            />
            <TextField
              id='input-confirm-password'
              label='Confirm New Password'
              type='password'
              value={passwordConfirm}
              onChange={(event) => { setPasswordConfirm(event.target.value); }}
            />
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
              />
            )}
            <Button
              id='btn-update-password'
              variant='contained'
              onClick={handleEditPasswordSubmit}
            >
              Update Password
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
}

function AccountPage() {
  const result = useQuery(GET_ACCOUNT);

  return (
    <Container sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0',
    }}
    >
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '32px', margin: { xs: '0 8px', sm: '0' }, width: 'clamp(300px, 70%, 576px)',
      }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Paper sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper sx={{
              backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: '8px',
            }}
            >
              <Typography
                variant='h4'
                sx={{ textAlign: 'center' }}
              >
                Account
              </Typography>
            </Paper>
            <Box sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: '24px', sm: '32px' },
            }}
            >
              { result.loading ? (
                <ContentLoader
                  style={{ height: '285px', width: '256px' }}
                  viewBox='0 0 256 290'
                  backgroundColor='#262626'
                  foregroundColor='#2a2a2a'
                >
                  <rect
                    x='0'
                    y='0'
                    rx='5'
                    ry='5'
                    width='256'
                    height='256'
                  />
                  <rect
                    x='28'
                    y='260'
                    rx='5'
                    ry='5'
                    width='200'
                    height='30'
                  />
                </ContentLoader>
              ) : (
                <>
                  <Avatar
                    sx={{ height: '256px', width: '256px', borderRadius: '8px' }}
                    alt='avatar'
                    src='https://res.cloudinary.com/dqcnxy51g/image/upload/v1665038713/blog-api/y3cc4mknjxyhqa3pgggz.webp'
                  />
                  <Link
                    sx={{ color: 'inherit' }}
                    component={RouterLink}
                    to={`/profile/${result.data?.account?._id}`}
                  >
                    <Typography>
                      @
                      {result.data?.account?.username}
                      {' '}
                      - Your Profile
                    </Typography>
                  </Link>
                </>
              )}
            </Box>
          </Paper>
        </Box>
        <BasicInfoForm
          data={result.data}
          loading={result.loading}
        />
        <PasswordInfoForm
          loading={result.loading}
        />
      </Box>
    </Container>
  );
}

export default AccountPage;
