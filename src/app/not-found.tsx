import ErrorNotice from '@/components/organisms/error-notice';

/** Adresse inconnue, fiche ou table supprimée : la page le dit en français. */
const NotFound = () => (
  <ErrorNotice title="Page introuvable">
    Cette page n&apos;existe pas, ou plus{'\u00a0'}: la fiche ou la table a
    peut-être été supprimée.
  </ErrorNotice>
);

export default NotFound;
