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
import { useMutation, useReactiveVar } from '@apollo/client';
import { tokenVar } from '../cache';
import { decodeToken, type IDecodedToken } from '../utils';
import DraftEditor from './DraftEditor';
import { CREATE_POST } from '../graphql/mutations';
import { GET_POSTS } from '../graphql/queries';

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

function PostCreatePage() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [decodedToken, setDecodedToken] = useState<IDecodedToken | null>(null);
  const token = useReactiveVar(tokenVar);
  const [createPost, result] = useMutation(
    CREATE_POST,
    {
      refetchQueries: [{ query: GET_POSTS }],
    },
  );

  useEffect(() => {
    if (result.data) {
      navigate('/');
    }
  }, [result.data, navigate]);

  useEffect(() => {
    setDecodedToken(decodeToken(token));
  }, [token]);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const handleSubmit = async () => {
    if (editorState.getCurrentContent().getPlainText().length >= 50 || title.length >= 5) {
      try {
        await createPost(
          {
            variables: {
              title,
              body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
            },
          },
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
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
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
            />
          </Box>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px',
          }}
          >
            <Button
              variant='contained'
              onClick={handleSubmit}
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
