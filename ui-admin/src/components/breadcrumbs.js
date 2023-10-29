import { Breadcrumbs, Typography, Link } from '@mui/material';
import NextLink from 'next/link';

import PropTypes from 'prop-types';

export const StyledBreadCrumbs = (props) => {
  const sequence = props.sequence;

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        href={'/'}
        component={NextLink}
        sx={{ typography: 'subtitle2' }}
        underline="hover"
      >
        Admin panel
      </Link>
      {
        (sequence || []).map((s, i) => {
          return s?.active ?
            <Typography key={s?.linkUrl + i} variant='subtitle2' color="text.primary">{s?.text}</Typography> :
            (
              <Link
                component={NextLink}
                key={s?.linkUrl + i}
                sx={{ typography: 'subtitle2' }}
                underline="hover"
                href={s?.linkUrl}
              >

                {s?.text}
              </Link>
            )
        })
      }
    </Breadcrumbs>
  )
};

StyledBreadCrumbs.propTypes = {
  sequence: PropTypes.array
};
