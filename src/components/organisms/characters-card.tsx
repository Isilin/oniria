'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import SheetField from '../molecules/sheet-field';

const CharactersCard = ({ id }) => {
  const { sheet, mutate } = useSheet(id);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gap={4}>
          Caractères
        </Typography>
        <Grid display="flex" justifyContent="space-evenly" gap={4}>
          <Grid>
            <Typography variant="h5">
              Le Corps <em>({sheet.body})</em>
            </Typography>
            <SheetField
              label="Force"
              value={sheet.strength}
              tooltip="Elle représente, comme son nom l’indique, la force physique du personnage, la puissance cinétique et la pression que celui-ci est apte à mobiliser et à appliquer à son environnement par un contact matériel."
              onEdit={(newVal) => {
                mutate({ strength: Number(newVal) });
              }}
            />
            <SheetField
              label="Agilité"
              value={sheet.agility}
              tooltip="Autrement dit la souplesse physique, la précision et l’exactitude des mouvements du personnage, mais aussi sa grâce et son aptitude à mobiliser son corps d’une façon qui lui convient en l’instant."
              onEdit={(newVal) => {
                mutate({ agility: Number(newVal) });
              }}
            />
            <SheetField
              label="Vivacité"
              value={sheet.vivacity}
              tooltip="Les réflexes, la rapidité d’exécution et d’action du corps du personnage, la maîtrise instinctive que possède ce dernier et qu’il peut mettre en œuvre sans réellement y penser, la facilité qu’ont ses muscles à s’activer et agir comme d’eux-mêmes."
              onEdit={(newVal) => {
                mutate({ vivacity: Number(newVal) });
              }}
            />
            <SheetField
              label="Vigueur"
              value={sheet.vigour}
              tooltip="L’endurance physique, la solidité du corps, sa capacité à encaisser fatigue, faim et soif, blessures, entre autres maux concrets qu’un personnage peut subir."
              onEdit={(newVal) => {
                mutate({ vigour: Number(newVal) });
              }}
            />
          </Grid>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Grid>
            <Typography variant="h5">
              L&apos;Esprit <em>({sheet.spirit})</em>
            </Typography>
            <SheetField
              label="Raisonnement"
              value={sheet.thinking}
              tooltip="La pertinence de calcul que l’esprit d’un personnage possède, son aptitude à penser juste, à appliquer à ses pensées sa raison de façon efficace."
              onEdit={(newVal) => {
                mutate({ thinking: Number(newVal) });
              }}
            />
            <SheetField
              label="Perception"
              value={sheet.perception}
              tooltip="Si l’acuité des sens relève davantage du physique que du mental, c’est pourtant la faculté de l’esprit à se montrer ouvert aux informations qui lui sont relayées comme clairvoyant dans leur tri, qui est là représenté. Pour exemple, de bons yeux ne signifient pas toujours une bonne vue."
              onEdit={(newVal) => {
                mutate({ perception: Number(newVal) });
              }}
            />
            <SheetField
              label="Concentration"
              value={sheet.concentration}
              tooltip="Ou à quel point l’esprit du personnage peut faire, lorsque c’est nécessaire, abstraction de toute distraction intérieure comme extérieure, pour se focaliser sur l’essentiel."
              onEdit={(newVal) => {
                mutate({ concentration: Number(newVal) });
              }}
            />
            <SheetField
              label="Entendement"
              value={sheet.understanding}
              tooltip="La capacité d’un personnage à appréhender le monde qui l’entoure, à intégrer à ce qu’il sait ou croit savoir de nouvelles données, à jongler avec des sujets de réflexion denses et complexes comme à mobiliser des connaissances fraîchement acquises ou depuis longtemps délaissées."
              onEdit={(newVal) => {
                mutate({ understanding: Number(newVal) });
              }}
            />
          </Grid>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Grid>
            <Typography variant="h5">
              L&apos;Âme <em>({sheet.soul})</em>
            </Typography>
            <SheetField
              label="Charisme"
              value={sheet.charisma}
              tooltip="La présence, l’aura d’un personnage, l’impression qu’il donne et laisse à autrui, la place qu’il occupe en les autres. A noter qu’un charisme faible ne signifie pas nécessairement quelqu’un d’effacé, mais peut tout aussi bien être la marque d’un être beaucoup trop remarqué mais jamais comme il faut, de la même façon qu’un charisme élevé ne veut pas toujours dire un personnage qui rayonne et en impose, mais parfois simplement quelqu’un qui semble toujours à sa place, toujours là où il doit être ou comme il le doit, sans que cela ne paraisse déplacé."
              onEdit={(newVal) => {
                mutate({ charisma: Number(newVal) });
              }}
            />
            <SheetField
              label="Empathie"
              value={sheet.empathy}
              tooltip="La perméabilité aux ambiances, aux émotions d’autrui comme aux atmosphères d’alentour. La sensibilité d’un personnage à ce qui l’entoure."
              onEdit={(newVal) => {
                mutate({ empathy: Number(newVal) });
              }}
            />
            <SheetField
              label="Ego"
              value={sheet.ego}
              tooltip="Il représente une forme de mesure de l’individualité d’un personnage, de la densité, de la complexité de sa personnalité. Pas forcément sa force de caractère, mais à quel point ce dernier est formé, unique et personnel."
              onEdit={(newVal) => {
                mutate({ ego: Number(newVal) });
              }}
            />
            <SheetField
              label="Volonté"
              value={sheet.will}
              tooltip="La résolution, la détermination, la confiance en soi du personnage. Sa capacité à ne pas faillir à ses propres aspirations ou décisions."
              onEdit={(newVal) => {
                mutate({ will: Number(newVal) });
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CharactersCard;
