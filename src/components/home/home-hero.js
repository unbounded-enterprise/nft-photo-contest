import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { Box, Button, Link, useTheme, Container, Typography, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { authApi } from '../../_api_/auth-api';
import { useAuth } from 'src/hooks/use-auth';

export const HomeHero = (props) => {
  const [redirectionUrl, setRedirectionUrl] = useState("/");
  const { app } = props;
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    authApi.getRedirectionURL().then((url) => { 
      if (url) setRedirectionUrl(url); 
    });
  }, []);
  
  return (
    <Box 
      sx={{ pt: 2, pb: '2em' }}
      {...props}
    >    
      <Container
        maxWidth="md"
        sx={{
          mt:{ xs: '1em', md: '6em' },
          ml:{ xs: '.5em', md: '3em' },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          align="left"
          variant="h4"
          sx={{ 
            mb: ".5em",
            mr:{ xs: '1em', md: '3em' } 
          }}
        >
          Welcome to {app.appName}
        </Typography>
        <Typography
          align="left"
          variant="p1"
          sx={{ 
            mb: '1em', 
            mr:{ xs: '1em', md: '3em' } 
          }}
        >
          {app.description.split('/n').map((line, index) => (
            <span key={index}>
              {line.replace('/n',"")}
            <br />
            </span>
          ))}
        </Typography>
        <NextLink href={'/explorer/slot/64661df89c62e203e8fe61c1'} legacyBehavior passHref>
          <Button 
            sx={{
              height: '4em',
              width: '20em',
              backgroundColor: '#045CD2', 
              color: 'white',
              fontSize: '1em',
              px: '1em',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#045CD2',
                transform: 'scale(1.01)',
              }
            }}
          >
            View Entries
          </Button>
        </NextLink>
      </Container>
    </Box>
  );
};
