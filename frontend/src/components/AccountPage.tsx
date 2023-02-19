import { useState } from 'react';
import {
  Box, Button, Container, Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField/TextField';
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
    <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography variant='h6'>Basic Information</Typography>
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
    </form>
  );
}

function PasswordInformationForm() {
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography variant='h6'>Change Password</Typography>
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
    </form>
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
          <Typography
            variant='h4'
            sx={{ textAlign: 'center' }}
          >
            Account
          </Typography>
          <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img
              style={{ height: '64px', width: '64px', borderRadius: '8px' }}
              alt='avatar'
              src='https://res.cloudinary.com/dqcnxy51g/image/upload/v1665038713/blog-api/y3cc4mknjxyhqa3pgggz.webp'
            />
            <Typography>@jartsa82</Typography>
          </Box>
        </Box>
        <BasicInformationForm />
        <PasswordInformationForm />
      </Box>
    </Container>
  );
}

export default AccountPage;
