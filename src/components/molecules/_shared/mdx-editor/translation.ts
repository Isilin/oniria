/**
 * L'éditeur des notes en français : libellés de la barre d'outils, des
 * menus de tableau et des dialogues (lien, image). Les clés absentes gardent
 * leur texte d'origine.
 */
const FR: Record<string, string> = {
  'contentArea.editableMarkdown': 'Notes',
  'dialog.close': 'Fermer',
  'dialogControls.cancel': 'Annuler',
  'dialogControls.save': 'Enregistrer',

  'toolbar.undo': 'Annuler {{shortcut}}',
  'toolbar.redo': 'Rétablir {{shortcut}}',
  'toolbar.blockTypeSelect.placeholder': 'Style',
  'toolbar.blockTypeSelect.selectBlockTypeTooltip': 'Choisir le style',
  'toolbar.blockTypes.paragraph': 'Paragraphe',
  'toolbar.blockTypes.heading': 'Titre {{level}}',
  'toolbar.blockTypes.quote': 'Citation',
  'toolbar.bold': 'Gras',
  'toolbar.removeBold': 'Retirer le gras',
  'toolbar.italic': 'Italique',
  'toolbar.removeItalic': "Retirer l'italique",
  'toolbar.underline': 'Souligné',
  'toolbar.removeUnderline': 'Retirer le soulignement',
  'toolbar.inlineCode': 'Code',
  'toolbar.removeInlineCode': 'Retirer le code',
  'toolbar.bulletedList': 'Liste à puces',
  'toolbar.numberedList': 'Liste numérotée',
  'toolbar.checkList': 'Liste à cocher',
  'toolbar.thematicBreak': 'Insérer un séparateur',
  'toolbar.table': 'Insérer un tableau',
  'toolbar.image': 'Insérer une image',
  'toolbar.link': 'Créer un lien',
  'toolbar.toggleGroup': 'groupe de boutons',

  'createLink.url': 'Adresse (URL)',
  'createLink.urlPlaceholder': 'Choisir ou coller une adresse',
  'createLink.text': 'Texte du lien',
  'createLink.textTooltip': 'Le texte affiché pour le lien',
  'createLink.title': 'Titre du lien',
  'createLink.titleTooltip': 'Le titre du lien, affiché au survol',
  'createLink.saveTooltip': "Enregistrer l'adresse",
  'createLink.cancelTooltip': 'Annuler la modification',
  'linkPreview.edit': "Modifier l'adresse du lien",
  'linkPreview.remove': 'Retirer le lien',
  'linkPreview.copyToClipboard': 'Copier',
  'linkPreview.copied': 'Copié\u00a0!',

  'table.deleteTable': 'Supprimer le tableau',
  'table.rowMenu': 'Menu de la ligne',
  'table.columnMenu': 'Menu de la colonne',
  'table.insertRowAbove': 'Insérer une ligne au-dessus',
  'table.insertRowBelow': 'Insérer une ligne en dessous',
  'table.deleteRow': 'Supprimer cette ligne',
  'table.insertColumnLeft': 'Insérer une colonne à gauche',
  'table.insertColumnRight': 'Insérer une colonne à droite',
  'table.deleteColumn': 'Supprimer cette colonne',
  'table.textAlignment': 'Alignement du texte',
  'table.alignLeft': 'Aligner à gauche',
  'table.alignCenter': 'Centrer',
  'table.alignRight': 'Aligner à droite',

  'imageEditor.editImage': "Modifier l'image",
  'imageEditor.deleteImage': "Supprimer l'image",
  'uploadImage.dialogTitle': 'Ajouter une image',
  'uploadImage.dialogDescription':
    'Insérer une image depuis une adresse ou depuis ton appareil.',
  'uploadImage.dialogDescriptionNoUpload':
    'Insérer une image depuis une adresse.',
  'uploadImage.uploadInstructions':
    'Envoyer une image depuis ton appareil\u00a0:',
  'uploadImage.addViaUrlInstructions':
    'Ou ajouter une image depuis une adresse\u00a0:',
  'uploadImage.addViaUrlInstructionsNoUpload':
    'Ajouter une image depuis une adresse\u00a0:',
  'uploadImage.autoCompletePlaceholder':
    "Choisir ou coller l'adresse d'une image",
  'uploadImage.alt': 'Texte alternatif\u00a0:',
  'uploadImage.title': 'Titre\u00a0:',
  'uploadImage.width': 'Largeur\u00a0:',
  'uploadImage.height': 'Hauteur\u00a0:',
};

/** Fonction `translation` de MDXEditor : texte français, variables remplacées. */
export const translateEditor = (
  key: string,
  defaultValue: string,
  interpolations?: Record<string, unknown>,
) =>
  Object.entries(interpolations ?? {}).reduce(
    (text, [name, value]) =>
      text.replaceAll(`{{${name}}}`, String(value ?? '')),
    FR[key] ?? defaultValue,
  );
