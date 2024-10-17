import { auth } from '@/app/auth';
import Attribute from '@/components/molecules/attribute';
import DeleteSheetButton from '@/components/molecules/delete-sheet-button';
import db from '@/lib/helpers/db';
import { ability } from '@/lib/helpers/skills';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const Sheet = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  if (!session?.user) redirect('/');

  const sheet = await db.sheet.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  const body = Math.trunc(
    (sheet.strength + sheet.agility + sheet.vivacity + sheet.vigour) / 5,
  );

  const spirit = Math.trunc(
    (sheet.thinking +
      sheet.perception +
      sheet.concentration +
      sheet.understanding) /
      5,
  );

  const soul = Math.trunc(
    (sheet.charisma + sheet.empathy + sheet.ego + sheet.will) / 5,
  );

  const mai = Math.trunc(soul / 10);

  const directBlow = ability(sheet.strength, sheet.agility);
  const subtleBlow = ability(sheet.vivacity, sheet.agility);
  const deadlyBlow = ability(sheet.vivacity, sheet.concentration);
  const parade = ability(sheet.agility, sheet.strength);
  const dodge = ability(sheet.agility, sheet.vivacity);
  const discretion = ability(sheet.agility, sheet.concentration);

  const care = ability(sheet.perception, sheet.empathy);
  const reflexion = ability(sheet.understanding, sheet.thinking);
  const improvisation = ability(sheet.thinking, sheet.concentration);
  const shooting = ability(sheet.perception, sheet.concentration);
  const integrity = ability(sheet.concentration, sheet.ego);
  const focus = ability(sheet.thinking, sheet.charisma);
  const spell = ability(sheet.understanding, sheet.will);
  const ritual = ability(sheet.concentration, sheet.empathy);

  const feeling = ability(sheet.empathy, sheet.perception);
  const persuasion = ability(sheet.charisma, sheet.ego);
  const charm = ability(sheet.charisma, sheet.empathy);
  const intimidation = ability(sheet.charisma, sheet.will);
  const fraud = ability(sheet.charisma, sheet.concentration);
  const belief = ability(sheet.ego, sheet.will);
  const resolution = ability(sheet.will, sheet.ego);

  const damage = Math.trunc(sheet.strength / 10 - 5);
  const initiative = Math.trunc(sheet.vivacity / 10);
  const impact = Math.trunc(sheet.thinking / 10);
  const impulsion = Math.trunc(sheet.perception / 10);
  const conduction = Math.trunc(sheet.concentration / 10);

  const health = Math.trunc(sheet.vigour / 10);
  const healthThreshold = Math.trunc(sheet.vigour / 5);
  const stability = Math.trunc(sheet.understanding / 10);
  const stabilityThreshold = Math.trunc(sheet.understanding / 5);
  const radiance = Math.trunc(soul / 10);
  const radianceThreshold = Math.trunc(soul / 5);

  return (
    <Suspense>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/">
          <Button>
            <ArrowBackIcon />
          </Button>
        </Link>
        <Box>
          <DeleteSheetButton id={sheet.id} />
        </Box>
      </Box>
      <Typography variant="h1">{sheet.name}</Typography>
      <Typography variant="subtitle1">
        Joueur-euse : {sheet.user.name}
      </Typography>
      <Card sx={{ display: 'flex' }}>
        <CardMedia
          component="img"
          image={sheet.avatar || '/public/default.png'}
          sx={{ width: '200px', height: 'auto' }}
        />
        <CardContent>
          <Grid display="flex" justifyContent="space-evenly" gap={4}>
            <Grid>
              <Typography variant="h4" align="center">
                Visage
              </Typography>
              <Typography variant="h5">Le Soi</Typography>
              <Typography variant="body1">
                Âge : {sheet.age ? `${sheet.age} ans` : '?'}
              </Typography>
              <Typography variant="h5">L&apos;Autre</Typography>
              <Typography variant="body1">
                Maï : {sheet.current_mai} / {mai}
              </Typography>
              <Typography variant="h5">Le Monde</Typography>
              <Typography variant="body1">Aspect : {sheet.aspect}</Typography>
              <Typography variant="body1">Devenir : {sheet.become}</Typography>
            </Grid>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Grid>
              <Typography variant="h4" align="center">
                Experiences
              </Typography>
              <Typography variant="h5">Eprouver</Typography>
              <Typography variant="body1">Dépensé : XXX</Typography>
              <Typography variant="body1">A dépenser : XXX</Typography>
              <Typography variant="h5">Apprendre</Typography>
              <Typography variant="body1">Dépensé : XXX</Typography>
              <Typography variant="body1">A dépenser : XXX</Typography>
              <Typography variant="h5">Vivre</Typography>
              <Typography variant="body1">Dépensé : XXX</Typography>
              <Typography variant="body1">A dépenser : XXX</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gap={4}>
            Caractères
          </Typography>
          <Grid display="flex" justifyContent="space-evenly">
            <Grid>
              <Typography variant="h5">
                Le Corps <em>({body})</em>
              </Typography>
              <Attribute name="Force" value={sheet.strength} editable />
              <Attribute name="Agilité" value={sheet.agility} editable />
              <Attribute name="Vivacité" value={sheet.vivacity} editable />
              <Attribute name="Vigueur" value={sheet.vigour} editable />
            </Grid>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Grid>
              <Typography variant="h5">
                L&apos;Esprit <em>({spirit})</em>
              </Typography>
              <Attribute name="Raisonnement" value={sheet.thinking} editable />
              <Attribute name="Perception" value={sheet.perception} editable />
              <Attribute
                name="Concentration"
                value={sheet.concentration}
                editable
              />
              <Attribute
                name="Entendement"
                value={sheet.understanding}
                editable
              />
            </Grid>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Grid>
              <Typography variant="h5">
                L&apos;Âme <em>({soul})</em>
              </Typography>
              <Attribute name="Charisme" value={sheet.charisma} editable />
              <Attribute name="Empathie" value={sheet.empathy} editable />
              <Attribute name="Ego" value={sheet.ego} editable />
              <Attribute name="Volonté" value={sheet.will} editable />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gap={4}>
            Facultés
          </Typography>
          <Grid display="flex" justifyContent="space-evenly">
            <Grid>
              <Typography variant="h5">La Chair</Typography>
              <Attribute
                name="Coup Brutal"
                major="Force"
                minor="Agilité"
                value={directBlow}
              />
              <Typography variant="body1">
                Coup Subtil <em>(Viv/Agi)</em> : {subtleBlow}
              </Typography>
              <Typography variant="body1">
                Coup Mortel <em>(Viv/Con)</em> : {deadlyBlow}
              </Typography>
              <Typography variant="body1">
                Parade <em>(Agi/For)</em> : {parade}
              </Typography>
              <Typography variant="body1">
                Esquive <em>(Agi/Viv)</em> : {dodge}
              </Typography>
              <Typography variant="body1">
                Discrétion <em>(Agi/Con)</em> : {discretion}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h5">La Pensée</Typography>
              <Typography variant="body1">
                Attention <em>(Per/Emp)</em> : {care}
              </Typography>
              <Typography variant="body1">
                Réflexion <em>(Ent/Rai)</em> : {reflexion}
              </Typography>
              <Typography variant="body1">
                Improvisation <em>(Rai/Con)</em> : {improvisation}
              </Typography>
              <Typography variant="body1">
                Tir <em>(Per/Con)</em> : {shooting}
              </Typography>
              <Typography variant="body1">
                Intégrité <em>(Con/Ego)</em> : {integrity}
              </Typography>
              <Typography variant="body1">
                Focus <em>(Rai/Cha)</em> : {focus}
              </Typography>
              <Typography variant="body1">
                Sortilège <em>(Ent/Vol)</em> : {spell}
              </Typography>
              <Typography variant="body1">
                Rituel <em>(Con/Emp)</em> : {ritual}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h5">La Lien</Typography>
              <Typography variant="body1">
                Impression <em>(Emp/Per)</em> : {feeling}
              </Typography>
              <Typography variant="body1">
                Persuasion <em>(Cha/Ego)</em> : {persuasion}
              </Typography>
              <Typography variant="body1">
                Séduction <em>(Cha/Emp)</em> : {charm}
              </Typography>
              <Typography variant="body1">
                Intimidation <em>(Cha/Vol)</em> : {intimidation}
              </Typography>
              <Typography variant="body1">
                Tromperie <em>(Cha/Con)</em> : {fraud}
              </Typography>
              <Typography variant="body1">
                Conviction <em>(Ego/Vol)</em> : {belief}
              </Typography>
              <Typography variant="body1">
                Résolution <em>(Vol/Ego)</em> : {resolution}
              </Typography>
            </Grid>
          </Grid>
          <Divider flexItem sx={{ my: 2 }} />
          <Grid display="flex" justifyContent="space-evenly">
            <Grid>
              <Typography variant="body1">
                Dégâts <em>((For / 10) - 5)</em> : {damage}
              </Typography>
              <Typography variant="body1">
                Initiative <em>(Viv / 10)</em> : {initiative}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="body1">
                Impact <em>(Rai / 10)</em> : {impact}
              </Typography>
              <Typography variant="body1">
                Impulsion <em>(Per / 10)</em> : {impulsion}
              </Typography>
              <Typography variant="body1">
                Conduction <em>(Con / 10)</em> : {conduction}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="body1">Protection : -</Typography>
              <Typography variant="body1">Encombrement : -</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gap={4}>
            Existences
          </Typography>
          <Grid display="flex" justifyContent="space-evenly">
            <Grid>
              <Typography variant="body1">
                La Santé <em>(Vig / 10)</em> : {sheet.current_health} / {health}
              </Typography>
              <Typography variant="body1">
                Seuil <em>(Vig / 5)</em> : {healthThreshold}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="body1">
                L&apos;Équilibre <em>(Ent / 10)</em> : {sheet.current_stability}{' '}
                / {stability}
              </Typography>
              <Typography variant="body1">
                Seuil <em>(Ent / 5)</em> : {stabilityThreshold}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="body1">
                L&apos;Éclat <em>(Âme / 10)</em> : {sheet.current_radiance} /{' '}
                {radiance}
              </Typography>
              <Typography variant="body1">
                Seuil <em>(Âme / 5)</em> : {radianceThreshold}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Suspense>
  );
};

export default Sheet;
