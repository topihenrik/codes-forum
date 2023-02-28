import {
  Box, Typography, ButtonBase,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Vote } from '../__generated__/graphql';

interface VotingProps {
  voteCount: number,
  voteStatus: Vote
  handleVoteSubmit: (voteStatus: Vote) => void
}

function Voting({ voteCount, voteStatus, handleVoteSubmit }: VotingProps) {
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', justifyContent: 'revert', alignItems: 'center',
    }}
    >
      <ButtonBase
        onClick={() => { handleVoteSubmit(voteStatus === Vote.None ? Vote.Up : Vote.None); }}
      >
        <ThumbUpIcon
          sx={{ color: voteStatus === Vote.None ? 'white' : 'primary.dark' }}
        />
      </ButtonBase>
      <Typography>
        {voteCount}
      </Typography>
    </Box>
  );
}

export default Voting;
