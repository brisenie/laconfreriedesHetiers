// Bouton « retour » du navigateur sur le site web.
//
// Le site remplace toujours la même entrée de l'historique du navigateur :
// sans ce module, un seul « retour » quitte le site. Ici on garde une entrée
// d'avance dans l'historique, et chaque « retour » est traité dans le site :
//   1. s'il y a une fenêtre ouverte (image agrandie, livre, arsenal), on la ferme ;
//   2. sinon on revient à la page précédente du site ;
//   3. sur la première page visitée, on reste sur place.
// Sur téléphone (application native), ce module ne fait rien.

import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web' && typeof window !== 'undefined';

// Fenêtres ouvertes qui veulent se fermer au « retour » (la plus récente en dernier)
const closeHandlers: (() => void)[] = [];

// Pages visitées dans le site, et action « page précédente »
const visited: string[] = [];
let goBackInApp: ((path: string) => void) | null = null;
let goingBack = false;

if (isWeb) {
  // Entrée d'avance dans l'historique : le « retour » reste dans le site
  window.history.pushState({ confrerie: true }, '', window.location.href);

  // Écouteur posé avant celui du routeur : il passe en premier et l'empêche
  // de réagir à ce « retour »
  window.addEventListener('popstate', (event) => {
    event.stopImmediatePropagation();
    const current = visited[visited.length - 1] ?? window.location.pathname;
    window.history.pushState({ confrerie: true }, '', current);

    const close = closeHandlers[closeHandlers.length - 1];
    if (close) {
      close();
      return;
    }

    if (visited.length > 1 && goBackInApp) {
      visited.pop();
      goingBack = true;
      goBackInApp(visited[visited.length - 1]);
    }
  });
}

export function registerBackHandler(close: () => void) {
  closeHandlers.push(close);
  return () => {
    const index = closeHandlers.lastIndexOf(close);
    if (index >= 0) closeHandlers.splice(index, 1);
  };
}

// À utiliser une fois, dans la mise en page racine
export function useWebBack() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    goBackInApp = (path) => router.replace(path as never);
    return () => {
      goBackInApp = null;
    };
  }, [router]);

  // Mémorise les pages visitées dans le site
  useEffect(() => {
    if (!isWeb) return;
    if (goingBack) {
      goingBack = false;
      return;
    }
    if (visited[visited.length - 1] !== pathname) visited.push(pathname);
  }, [pathname]);
}

// Pour une fenêtre : tant qu'elle est ouverte, le « retour » la ferme
export function useBackClose(open: boolean, close: () => void) {
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open) return;
    return registerBackHandler(() => closeRef.current());
  }, [open]);
}
