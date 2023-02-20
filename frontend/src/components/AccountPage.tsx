import { useState } from 'react';
import {
  Box, Button, Container, Typography, Paper, TextField,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function BasicInformationForm() {
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
          display: 'flex', flexDirection: 'column', gap: '16px', width: { xs: 'fit-content', sm: '340px' }, padding: { xs: '24px', sm: '32px' },
        }}
      >
        <TextField
          label='Username'
        />
        <TextField
          label='Bio'
          multiline
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
      </Box>
    </Paper>
  );
}

function PasswordInformationForm() {
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
          display: 'flex', flexDirection: 'column', gap: '16px', width: { xs: 'fit-content', sm: '340px' }, padding: { xs: '24px', sm: '32px' },
        }}
      >
        <TextField
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
  return (
    <Container sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0',
    }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
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
              <img
                style={{ height: '256px', width: '256px', borderRadius: '8px' }}
                alt='avatar'
                src='https://res.cloudinary.com/dqcnxy51g/image/upload/v1665038713/blog-api/y3cc4mknjxyhqa3pgggz.webp'
              />
              <Typography>@jartsa82 - Your Profile</Typography>
            </Box>
          </Paper>
        </Box>
        <BasicInformationForm />
        <PasswordInformationForm />
      </Box>
    </Container>
  );
}

export default AccountPage;
