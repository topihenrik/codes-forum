import {
  Container, Box, Paper, TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TagsInput } from 'react-tag-input-component';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ContentLoader from 'react-content-loader';
import {
  ServerError, useMutation, useQuery, useReactiveVar,
} from '@apollo/client';
import { errorVar, decodedTokenVar } from '../cache';
import DraftEditor from './DraftEditor';
import { EDIT_POST } from '../graphql/mutations';
import { GET_POST } from '../graphql/queries';
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

function PostEditPage() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [error, setError] = useState<IError | null >(null);
  const decodedToken = useReactiveVar(decodedTokenVar);
  const postid = useParams().id || '';

  const oldPostResult = useQuery(GET_POST, {
    variables: {
      _id: postid,
    },
  });
  const [editPost, editResult] = useMutation(
    EDIT_POST,
    /* {
      refetchQueries: [{ query: GET_POSTS }, { query: GET_POST, variables: { _id: postid } }],
    }, */
    {
      refetchQueries: [
        { query: GET_POST, variables: { _id: postid } },
        /* { query: GET_FEED_POSTS, variables: { offset: 0, limit: 10 } },
        { query: GET_POSTS_COUNT }, */
      ],
    },
  );

  useEffect(() => {
    if (!oldPostResult.loading) {
      // Loading is complete
      if (!(oldPostResult?.data?.post?.author)) {
        // Post was not found -> Post 404
        errorVar('Post not found');
        navigate('/error', { replace: true });
        // return;
      } else if (oldPostResult.data.post.author._id !== decodedToken?._id) {
        // Post author doesn't match the current user -> Unauthorized
        errorVar('Unauthorized');
        navigate('/error', { replace: true });
      }
    }
  }, [oldPostResult, navigate, decodedToken]);

  useEffect(() => {
    if (oldPostResult?.data?.post?.body) {
      const oldContentState = convertFromRaw(JSON.parse(oldPostResult.data.post.body));
      setEditorState(EditorState.createWithContent(oldContentState));
    }
    if (oldPostResult?.data?.post?.title) {
      setTitle(oldPostResult.data.post.title);
    }
    if (oldPostResult.data?.post?.tags) {
      setTags(oldPostResult.data.post.tags);
    }
  }, [oldPostResult.data, setEditorState]);

  // After succesful post edit -> Navigate back to post site
  useEffect(() => {
    if (editResult.data) {
      navigate(`/post/${postid}`);
    }
  }, [editResult.data, postid, navigate]);

  // If post update fails in the backend -> Inform the user about issues
  useEffect(() => {
    if (editResult.error) {
      if (editResult.error.networkError) { // parse network error message
        const netError = editResult.error.networkError as ServerError;
        setError({ message: netError.result.errors[0].message });
      } else { // parse graphql error message
        setError({ message: editResult.error.message });
      }
    }
  }, [editResult.error]);

  const handleTagsOnChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const beforeAddTagsValidate = (newTag: string, existingTags: string[]) => {
    if (newTag.length <= 16 && existingTags.length < 3) return true;
    return false;
  };

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const handlePostSubmit = async () => {
    try {
      if (title.length <= 5) {
        setError({ message: 'Title too short. Minimum length: 5' });
        return;
      }

      if (editorState.getCurrentContent().getPlainText().length <= 50) {
        setError({ message: 'Post too short. Minimum length: 50' });
        return;
      }

      await editPost(
        {
          variables: {
            _id: postid,
            title,
            body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
            tags,
          },
        },
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  if (oldPostResult.loading) {
    return (
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: '8px', width: 'clamp(300px, 85%, 640px)',
        }}
        >
          <ContentLoader
            viewBox='0 0 576 512'
            backgroundColor='#262626'
            foregroundColor='#2a2a2a'
          >
            <rect
              x='16'
              y='16'
              rx='5'
              ry='5'
              width='544'
              height='80'
            />
            <rect
              x='16'
              y='128'
              rx='5'
              ry='5'
              width='544'
              height='368'
            />
          </ContentLoader>
        </Box>
      </Container>
    );
  }

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
              Edit Your Question
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
            display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0 0 0',
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
              >
                Update
              </Button>
              <Typography>
                author: @
                {decodedToken && decodedToken.username}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default PostEditPage;
