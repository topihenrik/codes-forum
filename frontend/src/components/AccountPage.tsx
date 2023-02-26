import { useState } from 'react';
import ContentLoader from 'react-content-loader';
import {
  Box, Button, Container, Typography, Paper, TextField, Avatar, Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useQuery } from '@apollo/client';
import { GET_ACCOUNT } from '../graphql/queries';
import { AccountQuery } from '../__generated__/graphql';

interface BasicInfoFormProps {
  data: AccountQuery | undefined,
  loading: boolean
}

function BasicInfoForm({ data, loading }: BasicInfoFormProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent) => {
    const inputFileElement = event.target as HTMLInputElement;
    if (!inputFileElement.files) {
      setFile(null);
      return;
    }
    setFile(inputFileElement.files[0]);
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
        { (loading && !data) ? (
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
              label='Username'
              defaultValue={data?.account?.username}
            />
            <TextField
              label='Bio'
              multiline
              defaultValue={data?.account?.bio}
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
            <Button variant='contained'>
              Update Information
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
}

function PasswordInfoForm() {
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
        <TextField
          sx={{ width: '100%' }}
          label='Old Password'
        />
        <TextField
          label='New Password'
        />
        <TextField
          label='Confirm New Password'
        />
        <Button variant='contained'>
          Update Password
        </Button>
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
        <PasswordInfoForm />
      </Box>
    </Container>
  );
}

export default AccountPage;
