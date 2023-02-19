import { Box, Typography } from '@mui/material';

interface INotificationProps {
  message: string
}
function Notification({ message }: INotificationProps) {
  return (
    <Box sx={{ bgcolor: 'error.main', padding: '8px', borderRadius: '6px' }}>
      <Typography color='white'>{message}</Typography>
    </Box>
  );
}

export default Notification;
