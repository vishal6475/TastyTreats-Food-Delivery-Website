import { Divider, Typography } from '@mui/material';

const InfoHeader = ({ title }) => {
    return (
      <div>
        <Typography variant='subtitle1' sx={{ color: 'tastytreats.grey', fontWeight: 1000, mt:'2rem' }}>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </div>
    )
  }

export default InfoHeader