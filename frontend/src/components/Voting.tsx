import {
  Box, Typography, ButtonBase, Tooltip,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useReactiveVar } from '@apollo/client';
import { Vote } from '../__generated__/graphql';
import { decodedTokenVar } from '../cache';

interface VotingProps {
  voteCount: number,
  voteStatus: Vote
  handleVoteSubmit: (voteStatus: Vote) => void
}

function Voting({ voteCount, voteStatus, handleVoteSubmit }: VotingProps) {
  const decodedToken = useReactiveVar(decodedTokenVar);
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', justifyContent: 'revert', alignItems: 'center',
    }}
    >
      <Tooltip title={decodedToken ? '' : 'Login to vote'}>
        <ButtonBase
          className='btn-vote'
          onClick={decodedToken
            ? () => { handleVoteSubmit(voteStatus === Vote.None ? Vote.Up : Vote.None); }
            : () => {}}
        >
          <ThumbUpIcon
            sx={{ color: voteStatus === Vote.None ? 'white' : 'primary.dark' }}
          />
        </ButtonBase>
      </Tooltip>
      <Typography
        className='text-votes'
      >
        {voteCount}
      </Typography>
    </Box>
  );
}

export default Voting;
