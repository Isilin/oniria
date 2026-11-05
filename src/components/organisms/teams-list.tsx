'use client';

import { useTeams } from '@/lib/hooks/use-team';
import { CircularProgress, Container, Typography } from '@mui/material';
import CardRow from '../atoms/card-row';
import LoadError from '../atoms/load-error';
import TeamAddButton from '../molecules/team-add-button';
import TeamListElement from '../molecules/team-list-element';

/**
 * Les tables, rangées comme les fiches de l'accueil : des cartes alignées à
 * gauche, et la carte en pointillés pour en créer une à la suite.
 */
const TeamsList = () => {
  const { teams, error, isLoading, retry } = useTeams();

  if (!teams) {
    // Une lecture en échec n'est pas une liste vide.
    return isLoading || !error ? (
      <CircularProgress />
    ) : (
      <LoadError
        what="Les tables n'ont pas pu être lues."
        error={error}
        onRetry={retry}
      />
    );
  }

  return (
    <Container>
      {!teams.length && (
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          Aucune table de jeu.
        </Typography>
      )}
      <CardRow>
        {teams.map((team) => (
          <TeamListElement team={team} key={team.id} />
        ))}
        <TeamAddButton />
      </CardRow>
    </Container>
  );
};

export default TeamsList;
