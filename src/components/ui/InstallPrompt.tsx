import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Floating "Install app" affordance. Appears only when the browser fires
// beforeinstallprompt (i.e. the PWA is installable and not already installed).
// Mounted once at the app root so it shows on every route.
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!deferred || dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-3 z-[100] flex justify-center px-3">
      <div className="gov-panel flex items-center gap-3 px-3 py-2 shadow-float">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy text-white">
          <Download className="h-4 w-4" />
        </span>
        <p className="text-[12px] font-semibold text-ink">
          Install NEERVANA <span className="font-normal text-muted">— add to your home screen</span>
        </p>
        <button
          onClick={async () => {
            await deferred.prompt();
            await deferred.userChoice.catch(() => undefined);
            setDeferred(null);
          }}
          className="gov-focus rounded-md bg-navy px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-navy-light"
        >
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="gov-focus grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
