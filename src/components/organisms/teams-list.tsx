'use client';

import { useTeams } from '@/lib/hooks/use-team';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {teams.map((team) => (
          <TeamListElement team={team} key={team.id} />
        ))}
        <TeamAddButton />
      </Box>
    </Container>
  );
};

export default TeamsList;
