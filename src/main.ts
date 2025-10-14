import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';


// Enable Firestore debug logs in the browser for troubleshooting transport/server errors.
// This is temporary and should be removed when debugging is finished.
if (typeof window !== 'undefined') {
  try {
    // Importing from the modular SDK at runtime to avoid tree-shake issues in SSR.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { setLogLevel } = require('firebase/firestore');
    setLogLevel('debug');
    console.info('Firestore logLevel set to debug (temporary)');
  } catch (e) {
    // If firebase/firestore isn't available at startup (unlikely), don't block boot.
    console.warn('Could not set Firestore debug log level', e);
  }
}

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
