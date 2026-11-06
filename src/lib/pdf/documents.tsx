'use no memo';

import { Document, View } from '@react-pdf/renderer';
import { SheetPage } from './frame';
import { type SheetModel, sheetName } from './model';
import { Existences } from './sections/existences';
import { Experience } from './sections/experience';
import { Inventory } from './sections/inventory';
import { Journal } from './sections/journal';
import { Notes } from './sections/notes';
import { Plate } from './sections/plate';
import { Play } from './sections/play';
import { Magic, Schemes, Skills } from './sections/schemes';
import { sheetAnchor, TeamCover } from './sections/team-cover';
import { Traits } from './sections/traits';
import { pdfText } from './text';

const AUTHOR = "Lunes d'Oniria";

/**
 * Une fiche complète, sur une page qui se poursuit autant qu'il faut : la
 * page de jeu (plaque, Existences, Caractères, Facultés, Combat,
 * Expérience), puis les onglets dans l'ordre de l'écran, et l'historique
 * de l'expérience.
 */
export const SheetPages = ({
  model,
  team,
}: {
  model: SheetModel;
  /** Export d'une table : son nom, au pied de chaque page. */
  team?: string;
}) => {
  const name = pdfText(sheetName(model.sheet));
  return (
    <SheetPage
      title="Feuille de personnage"
      footerName={name}
      footerContext={team}
      bookmark={{ title: name, fit: true, expanded: !team }}
      id={sheetAnchor(model.sheet.id)}
    >
      <View>
        <Plate model={model} />
        <Existences model={model} />
        <Play model={model} />
        <Experience model={model} />
      </View>
      <Traits model={model} />
      <Schemes model={model} />
      <Skills model={model} />
      <Magic model={model} />
      <Inventory model={model} />
      <Notes model={model} />
      <Journal model={model} />
    </SheetPage>
  );
};

export const SheetDocument = ({ model }: { model: SheetModel }) => (
  <Document
    title={`${pdfText(sheetName(model.sheet))} - Feuille de personnage`}
    author={AUTHOR}
    creator="Oniria"
    language="fr-FR"
    pageMode="useOutlines"
  >
    <SheetPages model={model} />
  </Document>
);

/** Toutes les fiches d'une table, après une page de garde. */
export const TeamDocument = ({
  name,
  models,
  exportedAt,
}: {
  name: string;
  models: SheetModel[];
  exportedAt: Date;
}) => (
  <Document
    title={`${pdfText(name)} - Fiches`}
    author={AUTHOR}
    creator="Oniria"
    language="fr-FR"
    pageMode="useOutlines"
  >
    <SheetPage
      title="Table de jeu"
      footerName={pdfText(name)}
      bookmark={{ title: 'Vue d’ensemble', fit: true }}
    >
      <TeamCover name={name} models={models} exportedAt={exportedAt} />
    </SheetPage>
    {models.map((model) => (
      <SheetPages key={model.sheet.id} model={model} team={pdfText(name)} />
    ))}
  </Document>
);
