import { useSheet } from '@/lib/hooks/use-sheet';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import SheetField from '../molecules/sheet-field';

const AbilitiesCard = ({ id }) => {
  const { sheet } = useSheet(id);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gap={4}>
          Facultés
        </Typography>
        <Grid display="flex" justifyContent="space-evenly" gap={4}>
          <Grid>
            <Typography variant="h5">La Chair</Typography>
            <SheetField
              label="Coup Brutal"
              value={sheet.directBlow}
              tooltip="[Force / Agilité] Du direct du droit au revers de hache en passant par la charge d’épaule ou un bon coup de boule, cette manoeuvre rassemble toutes les attaques visant à briser, broyer, tuer ou faire mal et c’est tout. N’entrent donc dans cette catégorie que les coups épurés de tout objectif autre que ‘taper’."
            />
            <SheetField
              label="Coup Subtil"
              value={sheet.subtleBlow}
              tooltip="[Vivacité / Agilité] Du croche-pied à la clé de bras, d’un estoc vicieux à l’aine au pouce dans l’œil en passant par la chaîne autour du pied, cette manoeuvre rassemble toutes les attaques ne cherchant pas simplement à blesser l’adversaire, ou au contraire en un point bien précis. Comptant sur la liberté de ses mouvements, le personnage applique à son potentiel de réussite ses malus d’encombrement. Attention, une fois au corps-à-corps, toute action de tir se résout par un coup subtil."
            />
            <SheetField
              label="Coup Mortel"
              value={sheet.deadlyBlow}
              tooltip="[Vivacité / Concentration]"
            />
            <SheetField
              label="Parade"
              value={sheet.parade}
              tooltip="[Agilité / Force] Blocage au bouclier, à la lame ou à l’avant-bras, mais aussi déviation d’un coup adverse ou libération d’une prise par la force, cette manoeuvre rassemble toutes les actions défensives comptant sur un rapport des forces."
            />
            <SheetField
              label="Esquive"
              value={sheet.dodge}
              tooltip="[Agilité / Vivacité] Pas chassé sur la droite, un genou à terre au bon moment, le petit bond arrière ou juste un mouvement de tête, cette manoeuvre rassemble toutes les actions défensives qui n’impliquent pas un rapport de forces, mais s’attachent à l’éviter. Comptant sur la liberté de ses mouvements, le personnage applique évidemment à son potentiel de réussite ses malus d’encombrement."
            />
            <SheetField
              label="Discrétion"
              value={sheet.discretion}
              tooltip="[Agilité / Concentration] A l’arc, à l’arbalète, à la sarbacane, avec un flingue ou un bon vieux fusil-laser, voire un trébuchet ou une pièce d’artillerie, cette manoeuvre rassemble toutes les actions où le personnage fait usage d’un outil lui permettant d’envoyer des projectiles."
            />
          </Grid>
          <Grid>
            <Typography variant="h5">La Pensée</Typography>
            <SheetField
              label="Attention"
              value={sheet.care}
              tooltip="[Perception / Empathie]"
            />
            <SheetField
              label="Réflexion"
              value={sheet.reflexion}
              tooltip="[Entendement / Raisonnement]"
            />
            <SheetField
              label="Improvisation"
              value={sheet.improvisation}
              tooltip="[Raisonnement / Concentration]"
            />
            <SheetField
              label="Tir"
              value={sheet.shooting}
              tooltip="[Perception / Concentration] A l’arc, à l’arbalète, à la sarbacane, avec un flingue ou un bon vieux fusil-laser, voire un trébuchet ou une pièce d’artillerie, cette manoeuvre rassemble toutes les actions où le personnage fait usage d’un outil lui permettant d’envoyer des projectiles."
            />
            <SheetField
              label="Intégrité"
              value={sheet.integrity}
              tooltip="[Concentration / Ego]"
            />
            <SheetField
              label="Focus"
              value={sheet.focus}
              tooltip="[Raisonnement / Charisme]"
            />
            <SheetField
              label="Sortilège"
              value={sheet.spell}
              tooltip="[Entendement / Volonté]"
            />
            <SheetField
              label="Rituel"
              value={sheet.ritual}
              tooltip="[Concentration / Empathie]"
            />
          </Grid>
          <Grid>
            <Typography variant="h5">La Lien</Typography>
            <SheetField
              label="Impression"
              value={sheet.feeling}
              tooltip="[Empathie / Perception]"
            />
            <SheetField
              label="Persuasion"
              value={sheet.persuasion}
              tooltip="[Charisme / Ego]"
            />
            <SheetField
              label="Séduction"
              value={sheet.charm}
              tooltip="[Charisme / Empathie]"
            />
            <SheetField
              label="Intimidation"
              value={sheet.intimidation}
              tooltip="[Charisme / Volonté]"
            />
            <SheetField
              label="Tromperie"
              value={sheet.fraud}
              tooltip="[Charisme / Concentration]"
            />
            <SheetField
              label="Conviction"
              value={sheet.belief}
              tooltip="[Ego / Volonté]"
            />
            <SheetField
              label="Résolution"
              value={sheet.resolution}
              tooltip="[Volonté / Ego]"
            />
          </Grid>
        </Grid>
        <Divider flexItem sx={{ my: 2 }} />
        <Grid display="flex" justifyContent="space-evenly">
          <Grid>
            <SheetField
              label="Dégâts"
              value={sheet.damage}
              tooltip="(Force / 10) - 5"
            />
            <SheetField
              label="Initiative"
              value={sheet.initiative}
              tooltip="Vivacité / 10"
            />
          </Grid>
          <Grid>
            <SheetField
              label="Impact"
              value={sheet.impact}
              tooltip="Raisonnement / 10"
            />
            <SheetField
              label="Impulsion"
              value={sheet.impulsion}
              tooltip="Perception / 10"
            />
            <SheetField
              label="Conduction"
              value={sheet.conduction}
              tooltip="Concentration / 10"
            />
          </Grid>
          <Grid>
            <SheetField label="Protection" value="-" />
            <SheetField label="Encombrement" value="-" />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AbilitiesCard;
