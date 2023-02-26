import {
  Container, Box, Paper, TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { convertToRaw, EditorState } from 'draft-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ServerError, useMutation, useReactiveVar } from '@apollo/client';
import { decodedTokenVar } from '../cache';
import DraftEditor from './DraftEditor';
import { CREATE_POST } from '../graphql/mutations';
import { GET_POSTS } from '../graphql/queries';
import Notification from './Notification';

const TitleTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'black',
    borderColor: 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      color: 'black',
      borderColor: 'black',
    },
    '&:hover fieldset': {
      color: 'black',
      borderColor: 'black',
    },
    '&.Mui-focused fieldset': {
      color: 'black',
      borderColor: 'black',
    },
  },
});

interface IError {
  message: string
}

function PostCreatePage() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [error, setError] = useState<IError | null >(null);
  const decodedToken = useReactiveVar(decodedTokenVar);
  const [createPost, result] = useMutation(
    CREATE_POST,
    {
      refetchQueries: [{ query: GET_POSTS }],
    },
  );

  // After succesful post creation -> Navigate to the post site
  useEffect(() => {
    if (result.data?.createPost) {
      navigate(`/post/${result.data.createPost._id}`);
    }
  }, [result.data, navigate]);

  // If post creation fails in the backend -> Inform the user about issues
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

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const handlePostSubmit = async () => {
    if (title.length <= 5) {
      setError({ message: 'Title too short. Minimum length: 5' });
      return;
    }

    if (editorState.getCurrentContent().getPlainText().length <= 50) {
      setError({ message: 'Post too short. Minimum length: 50' });
      return;
    }

    try {
      await createPost(
        {
          variables: {
            title,
            body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          },
        },
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '8px', width: 'clamp(300px, 50%, 768px)',
      }}
      >
        <Paper sx={{ padding: '8px' }}>
          <Paper
            sx={{
              backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: '8px',
            }}
          >
            <Typography variant='h4'>
              Ask A New Question
            </Typography>
          </Paper>
          <Box sx={{ backgroundColor: '#FFF' }}>
            <Box sx={{ padding: '8px' }}>
              <TitleTextField
                id='input-title'
                value={title}
                onChange={(event) => { setTitle(event.target.value); }}
                color='error'
                sx={{
                  label: { color: 'black', borderColor: 'black' }, input: { color: 'black', borderColor: 'black' }, width: '100%', boxSizing: 'border-box',
                }}
                label='Title'
              />
            </Box>
            <DraftEditor
              name='post'
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
            />
          </Box>
          {error && (
            <Notification
              message={error.message}
              type='error'
            />
          )}
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px',
          }}
          >
            <Button
              variant='contained'
              onClick={handlePostSubmit}
            >
              Submit
            </Button>
            <Typography>
              author: @
              {decodedToken && decodedToken.username}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default PostCreatePage;
