import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

function ErrorPage() {
  const { message } = useParams();
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box>
        <Typography variant='h4'>
          Error:
          {' '}
          {message}
        </Typography>
      </Box>
    </Container>
  );
}

export default ErrorPage;
