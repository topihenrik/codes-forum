import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { decodedTokenVar } from '../config/cache';

interface Props {
  children: JSX.Element
}

// checks whether the user has a token. if not then redirected to login page
function ProtectedRoute({ children }: Props) {
  const decodedToken = useReactiveVar(decodedTokenVar);
  const navigate = useNavigate();

  useEffect(() => {
    if (!decodedToken) {
      navigate('/login', { replace: true });
    }
  }, [decodedToken, navigate]);

  return children;
}

export default ProtectedRoute;
