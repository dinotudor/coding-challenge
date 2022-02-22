import type { NextPage } from "next";
import { Box, Card, CardContent, CardMedia, Container, Typography } from "@mui/material";
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/home.module.css';

const Home: NextPage = () => {
  return (

    <Container>
      <Box paddingY={ 5 }>
        <Card className={ styles.cardBox }>
          <CardContent>
            <Image src="/siteLogo-inten.png" alt="Sport-Thieme Logo" width="230" height="54"/>
            <Typography className={ styles.desc } variant="body2" color="text.secondary">
              This is a beta version of a new interface for editing coches. We appreciate your feedback!
            </Typography>
            <Link href="/coaches">
              <a className={ styles.coachBtn }>Coches List</a>
            </Link>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Home;
