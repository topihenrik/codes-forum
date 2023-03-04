import {
  Container, Box, Paper, TextField,
} from '@mui/material';
import { TagsInput } from 'react-tag-input-component';
import { styled } from '@mui/material/styles';
import { convertToRaw, EditorState } from 'draft-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ServerError, useMutation, useReactiveVar } from '@apollo/client';
import { decodedTokenVar } from '../config/cache';
import DraftEditor from './DraftEditor';
import { CREATE_POST } from '../graphql/mutations';
import { GET_FEED_POSTS, GET_POSTS_COUNT } from '../graphql/queries';
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

interface INotification {
  message: string,
  type: 'success' | 'error'
}

function PostCreatePage() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [notification, setNotification] = useState<INotification | null>(null);
  const decodedToken = useReactiveVar(decodedTokenVar);

  const [createPost, result] = useMutation(
    CREATE_POST,
    {
      refetchQueries: [
        { query: GET_FEED_POSTS, variables: { offset: 0, limit: 10 } },
        { query: GET_POSTS_COUNT },
      ],
    },
  );

  // Handle notification change
  useEffect(() => {
    const timeid = setTimeout(() => { setNotification(null); }, 5000);
    return () => { clearTimeout(timeid); };
  }, [notification]);

  // Post creation successful -> Navigate to the post site
  useEffect(() => {
    if (result.data?.createPost) {
      navigate(`/post/${result.data.createPost._id}`);
    }
  }, [result.data, navigate]);

  // Post creation failed -> Inform the user about issues
  useEffect(() => {
    if (result.error) {
      if (result.error.networkError) { // parse network error message
        const netError = result.error.networkError as ServerError;
        setNotification({ message: netError.result.errors[0].message, type: 'error' });
      } else { // parse graphql error message
        setNotification({ message: result.error.message, type: 'error' });
      }
    }
  }, [result.error]);

  const handlePostSubmit = async () => {
    try {
      if (title.length <= 5) {
        setNotification({ message: 'Title too short. Minimum length: 5', type: 'error' });
        return;
      }

      if (editorState.getCurrentContent().getPlainText().length <= 50) {
        setNotification({ message: 'Post too short. Minimum length: 50', type: 'error' });
        return;
      }

      await createPost(
        {
          variables: {
            title,
            tags,
            body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          },
        },
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const handleTagsOnChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const beforeAddTagsValidate = (newTag: string, existingTags: string[]) => {
    if (newTag.length <= 16 && existingTags.length < 3) return true;
    return false;
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '8px', width: 'clamp(300px, 85%, 640px)',
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
          <Box sx={{
            display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px',
          }}
          >
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}/* 'error' */
              />
            )}
            <Box sx={{
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}
            >
              <Box sx={{ width: 'fit-content' }}>
                <TagsInput
                  value={tags}
                  onChange={handleTagsOnChange}
                  beforeAddValidate={beforeAddTagsValidate}
                  placeHolder='Tags (max: 3)'
                />
              </Box>
              <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
              }}
              >
                <Button
                  variant='contained'
                  onClick={handlePostSubmit}
                  disabled={result.loading}
                >
                  Submit
                </Button>
                <Typography
                  sx={{ wordBreak: 'break-word' }}
                >
                  author: @
                  {decodedToken && decodedToken.username}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default PostCreatePage;
