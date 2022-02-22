import { Container, Typography, List, ListItem, ListItemText, Divider, ListSubheader, Icon} from "@mui/material";
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';
import { Query } from '../generated/graphql-generated-types';
import styles from '../styles/coaches.module.css';


const GET_COACHES = gql`
query Coaches {
  coaches {
    id
    name
    email
    city
  }
}
`;

const Coaches = () => {
  const { loading, error, data } = useQuery<{ coaches: Query['coaches'] }>(GET_COACHES);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <Container>
      <List className={ styles.list }>
        <ListSubheader className={ styles.listSubHeader }>
          <Link href="/">
            <a>
              <Image src="/siteLogo-inten.png" alt="Sport-Thieme Logo" width="230" height="54"/>
            </a>
          </Link>
          <Typography className={ styles.listTitle } variant="h6" component="h1" gutterBottom>
            Coach List
          </Typography>
        </ListSubheader>
        { data.coaches.map( coach => {
          return(
            <Link key={ coach.id } href={`/coach/${ coach.id }/`}>
              <a>
                <ListItem alignItems="center">
                  <ListItemText
                    primary={ coach.name }
                    sx={{ color: '#000' }}
                    secondary={
                      <>
                        <Typography
                          className={ styles.listTextSecondary }
                          component="span"
                          variant="body2"
                          >
                          { coach.email }
                        </Typography>
                        <Typography
                          className={ styles.listTextSeparator }
                          component="span"
                          variant="body2"
                        > - </Typography>
                        <Typography
                          className={ styles.listTextSecondary }
                          component="span"
                          variant="body2"
                        >{ coach.city }
                        </Typography>
                      </>
                    }
                  />
                  <Icon>arrow_forward_ios</Icon>
                </ListItem>
                <Divider className={ styles.listDivider }/>
              </a>
            </Link>
          )
        })}
      </List>
    </Container>
  )
}

export default Coaches;
