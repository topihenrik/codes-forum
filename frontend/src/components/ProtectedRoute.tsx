import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { tokenVar } from '../cache';

interface Props {
  children: JSX.Element
}

// checks whether the user has a token. if not then redirected to login page
function ProtectedRoute({ children }: Props) {
  const token = useReactiveVar(tokenVar);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  return children;
}

export default ProtectedRoute;
