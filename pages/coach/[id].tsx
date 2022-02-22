import { useState } from "react";
import { Box, Container, FormControl, TextField, Typography, Card, CardContent, Icon, List, ListItem } from "@mui/material";
import { gql, useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styles from '../../styles/coach.module.css'
import Image from 'next/image';
import { Coach, CoachUpdateInput } from '../../generated/graphql-generated-types';

const GET_COACH = gql`
query Coach($where: CoachWhereUniqueInput!) {
  coach(where: $where) {
    id
    name
    email
    city
    specialties {
      id
      name
    }
  }
}
`;

const ADD_SPECIALTIES = gql`
mutation Coach($data: CoachUpdateInput!, $where: CoachWhereUniqueInput!) {
  updateCoach(data: $data, where: $where) {
    specialties {
      name
    }
  }
}
`;

const EDIT_CITY = gql`
  mutation UpdateCoach($data: CoachUpdateInput!, $where: CoachWhereUniqueInput!) {
    updateCoach(data: $data, where: $where) {
      name
      email
      city
    }
}
`;

const Coach = () => {
  const router: NextRouter = useRouter();
  const { loading, error, data } = useQuery<{ coach: Coach }>(GET_COACH, {
    variables:
      { "where":
        { "id": +router.query.id }
      }
    }
  );
  const [createNew] = useMutation<{ updateCoach: CoachUpdateInput }>(ADD_SPECIALTIES, {
    refetchQueries: [
      GET_COACH,
      'Coach'
    ],
  });
  const [updateCity] = useMutation<{ updateCoach: CoachUpdateInput }>(EDIT_CITY, {
    refetchQueries: [
    GET_COACH,
    'Coach'
    ],
  });

  const [city, setCity] = useState<string>();
  const [specialty, setSpecialty] = useState<string>();
  const [saveCity, setSaveCity] = useState<boolean>(true);
  const [saveSpecialty, setSaveSpecialty] = useState<boolean>(true);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const handleChangeCity = (e) => {
    setCity(e.target.value);
    setSaveCity(false);
  };

  const handleChangeSpecialty = (e) => {
    setSpecialty(e.target.value);
    setSaveSpecialty(false);
  };

  const handleSubmitCoach = (e) => {
        e.preventDefault();
        updateCity({
          variables: {
            "data": {
              "city": {
                "set": city
                }
            },
            "where": {
              "id": +router.query.id
            }
          }
      });
    setSaveCity(true);
  }

  const handleSubmitSpecialty = (e) => {
    if (specialty === '') {
      setSaveSpecialty(true);
      return;
    } else {
      e.preventDefault();
      createNew({
        variables: {
          "data": {
            "specialties": {
              "create": [
                {
                  "name": specialty
                }
              ]
            }
          },
          "where": {
            "id": +router.query.id
          }
        }
      });
      setSpecialty('');
      setSaveSpecialty(true);
    }
  }

  return (
      <Container className={ styles.containerCoach } >
        <Link href="/">
          <a className={ styles.logoCoachPage }>
            <Image className={ styles.mb } src="/siteLogo-inten.png" alt="Sport-Thieme Logo" width="230" height="54"/>
          </a>
        </Link>
        <Box className={ styles.boxGrid }>
          <Card className={ styles.boxCard }>
            <Typography className={ styles.cardTitle } variant="h6" component="h1" gutterBottom>
              <Icon className={ styles.mr }>sports</Icon>
              Coach
            </Typography>
            <CardContent>
              <Typography className={ styles.centerLink } variant="h6">
                <Icon className={ styles.iconColor }>face</Icon>
                <strong>{ data.coach.name }</strong>
              </Typography>
              <Typography className={ styles.centerLink } variant="h6">
                <Icon className={ styles.iconColor }>place</Icon>
                <strong>{ data.coach.city }</strong>
              </Typography>
              <Typography className={ styles.centerLink } variant="h6">
                <Icon className={ styles.iconColor }>mail</Icon>
                <strong>{ data.coach.email }</strong>
              </Typography>
              <Typography className={ styles.centerLink } variant="h6">
                <Icon className={ styles.iconColor }>stars</Icon>
                <strong>Specialities</strong>
              </Typography>
              <List className={ styles.specialityList }>
              { data.coach.specialties.map( item => {
                return(
                  <ListItem key={ item.id } className={ styles.centerLink }>
                    <Icon className={ styles.iconColor }>horizontal_rule</Icon>
                      { item.name }
                  </ListItem>
                )
              })}
            </List>
            </CardContent>
          </Card>
          <Card className={ styles.editCoachCard }>
            <Typography  className={ styles.editCoachTitle } variant="h6">
              <Icon className={ styles.mr }>edit</Icon>
              <strong className={ styles.mb }>Edit Coach</strong>
              </Typography>
            <FormControl>
              <Stack direction="row" spacing={2}>
                <TextField
                  className={ styles.input }
                  label="City"
                  defaultValue={ data.coach.city }
                  onChange={ handleChangeCity }
                  />
                <Button
                  disabled={ saveCity }
                  onClick={ handleSubmitCoach }
                >
                  save
                </Button>
              </Stack>
            </FormControl>
            <FormControl>
              <Stack direction="row" spacing={2}>
                <TextField
                  className={ styles.input }
                  label="Add Specialty"
                  onChange={ handleChangeSpecialty }
                  value={ specialty }
                />
                <Button
                  disabled={ saveSpecialty }
                  onClick={ handleSubmitSpecialty }
                >
                  save
                </Button>
              </Stack>
            </FormControl>
          </Card>
        </Box>
        <Link href="/coaches">
          <a className={ styles.btnBack }>
            <Icon className={ styles.mr }>arrow_back</Icon>
            <Typography variant="body1" component="span">Back to coaches list</Typography>
          </a>
        </Link>
    </Container>
  )
}
export default Coach;
