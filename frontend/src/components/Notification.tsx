import { Box, Typography } from '@mui/material';

interface INotificationProps {
  message: string
  type: 'error' | 'success'
}
function Notification({ message, type }: INotificationProps) {
  return (
    <Box sx={{ bgcolor: `${type}.dark`, padding: '8px', borderRadius: '6px' }}>
      <Typography color='white'>{message}</Typography>
    </Box>
  );
}

export default Notification;
