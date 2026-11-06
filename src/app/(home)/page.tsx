import SWRFallback from '@/components/atoms/swr-fallback';
import AdminPanel from '@/components/organisms/admin-panel';
import ListSheets from '@/components/organisms/list-sheets';
import LoginForm from '@/components/organisms/login-form';
import { asJson, listSheets } from '@/lib/server/queries';
import { getSession } from '@/lib/server/session';
import { isTestLoginEnabled } from '@/lib/server/test-login';
import { Alert, Typography } from '@mui/material';
import { Suspense } from 'react';

/**
 * Connexion refusée ou échouée : Auth.js revient ici avec `?error=…` (voir
 * `pages.error` dans auth.ts). AccessDenied : l'adresse n'est pas dans la
 * whitelist.
 */
const SIGN_IN_ERRORS: Record<string, string> = {
  AccessDenied:
    "Cette adresse Google n'est pas encore sur la liste du groupe. Demande au MJ de l'ajouter, puis reconnecte-toi.",
};
const SIGN_IN_FAILED =
  "La connexion n'a pas abouti. Réessaie\u00a0; si ça recommence, préviens le MJ.";

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const session = await getSession();
  const { error } = await searchParams;
  // La liste des fiches arrive avec la page.
  const sheets = session?.user
    ? asJson(await listSheets(session.user.id))
    : null;
  const signInError =
    !session?.user && typeof error === 'string'
      ? (SIGN_IN_ERRORS[error] ?? SIGN_IN_FAILED)
      : null;

  return (
    <Suspense>
      <Typography
        variant="h1"
        sx={{
          textAlign: 'center',
        }}
      >
        ONIRIA
      </Typography>
      {!session?.user && (
        // Qui arrive ici pour la première fois sait ce qu'il ouvre, et
        // pourquoi Google peut refuser son adresse.
        <Typography
          color="textSecondary"
          sx={{
            maxWidth: '46ch',
            textAlign: 'center',
            textWrap: 'balance',
            mt: -1,
          }}
        >
          {/* Espace insécable : les deux-points ne commencent jamais une ligne. */}
          Les fiches de personnages des Lunes d&apos;Oniria. Connexion réservée
          au groupe{'\u00a0'}: le MJ ajoute ton adresse Google.
        </Typography>
      )}
      {signInError && (
        <Alert severity="warning" role="alert" sx={{ maxWidth: 560 }}>
          {signInError}
        </Alert>
      )}
      {!!session?.user && session?.user.role == 'ADMIN' && <AdminPanel />}
      <LoginForm testLogin={isTestLoginEnabled()} />
      {!!session?.user && (
        <SWRFallback fallback={{ '/api/sheets': sheets }}>
          <ListSheets />
        </SWRFallback>
      )}
    </Suspense>
  );
};

export default Home;
