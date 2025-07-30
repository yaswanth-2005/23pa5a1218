// frontend/src/components/ShortenerList.jsx

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Link,
} from '@mui/material';

const ShortenerList = ({ urls }) => {
  if (!urls || urls.length === 0) return null;

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Shortened URLs
      </Typography>
      <Grid container spacing={2}>
        {urls.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  Original URL:
                </Typography>
                <Typography variant="body2" noWrap>
                  {item.url}
                </Typography>

                <Typography variant="subtitle2" mt={1} color="textSecondary">
                  Shortened URL:
                </Typography>
                <Link
                  href={`http://localhost:5000/${item.shortcode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`http://localhost:5000/${item.shortcode}`}
                </Link>

                {item.expiry && (
                  <>
                    <Typography variant="subtitle2" mt={1} color="textSecondary">
                      Expires At:
                    </Typography>
                    <Typography variant="body2">{item.expiry}</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ShortenerList;
