import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SharedData {
  title?: string;
  text?: string;
  url?: string;
  images?: File[];
}

// Define serialized file interface for cross-browser compatibility
interface SerializedFile {
  name: string;
  type: string;
  size: number;
  data: ArrayBuffer;
}

// Helper function to deserialize files
async function deserializeFiles(serializedFiles: SerializedFile[]): Promise<File[]> {
  return Promise.all(serializedFiles.map((file) => new File([new Blob([file.data])], file.name, { type: file.type })));
}

export const useWebShareTarget = () => {
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const navigate = useNavigate();

  // Debug flag - set to false in production
  const DEBUG_WEB_SHARE = false;

  const log = (message: string, ...args: unknown[]) => {
    if (DEBUG_WEB_SHARE) {
      console.log(message, ...args);
    }
  };

  useEffect(() => {
    log('Web Share Target: useEffect triggered');
    log('Web Share Target: Current URL:', window.location.href);
    log('Web Share Target: Current search params:', window.location.search);

    // Check service worker status (only in debug mode)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        log('Web Share Target: Service Worker registrations:', registrations.length);
        registrations.forEach((reg) => {
          log('Web Share Target: SW scope:', reg.scope, 'active:', !!reg.active);
        });
      });
    }

    // Check if the app was launched via Web Share Target API
    const handleLaunch = async () => {
      log('Web Share Target: handleLaunch called');

      // Check for shared data in URL parameters (for GET requests)
      const urlParams = new URLSearchParams(window.location.search);
      const sharedTitle = urlParams.get('title');
      const sharedText = urlParams.get('text');
      const sharedUrl = urlParams.get('url');
      const shareId = urlParams.get('shareId');

      log('Web Share Target: URL params found:', { sharedTitle, sharedText, sharedUrl, shareId });

      // Handle direct GET parameters (for simple text sharing)
      if (sharedTitle || sharedText || sharedUrl) {
        const data: SharedData = {};
        if (sharedTitle) data.title = sharedTitle;
        if (sharedText) data.text = sharedText;
        if (sharedUrl) data.url = sharedUrl;

        log('Web Share Target: Received shared data from GET:', data);
        setSharedData(data);
        // Note: React Router has base path '/pika', so '/add' becomes '/pika/add'
        navigate('/add');
        return;
      }

      // Handle share ID from service worker (for POST requests with files)
      if (shareId) {
        log('Web Share Target: Processing share ID:', shareId);

        // Request shared data from service worker
        if ('serviceWorker' in navigator) {
          try {
            // Wait for service worker to be ready
            const registration = await navigator.serviceWorker.ready;
            log('Web Share Target: Service Worker ready:', registration);

            if (registration.active) {
              const messageChannel = new MessageChannel();

              // Add timeout for service worker communication
              const timeout = setTimeout(() => {
                log('Web Share Target: Service Worker communication timeout');
                messageChannel.port1.close();
              }, 5000); // 5 second timeout

              messageChannel.port1.onmessage = async (event) => {
                clearTimeout(timeout);
                if (event.data.type === 'SHARED_DATA_RESPONSE') {
                  const sharedData = event.data.payload;
                  log('Web Share Target: Received shared data from service worker:', sharedData);

                  if (sharedData) {
                    // Convert service worker data format to our format
                    const data: SharedData = {
                      title: sharedData.title,
                      text: sharedData.text,
                      url: sharedData.sharedUrl,
                      images: sharedData.files ? await deserializeFiles(sharedData.files) : undefined,
                    };

                    // Set shared data first, then navigate
                    setSharedData(data);
                    // Use setTimeout to ensure state is set before navigation
                    setTimeout(() => {
                      navigate('/add');
                    }, 0);
                  }
                }
                messageChannel.port1.close();
              };

              registration.active.postMessage(
                {
                  type: 'GET_SHARED_DATA',
                  shareId: shareId,
                },
                [messageChannel.port2],
              );
            } else {
              log('Web Share Target: Service Worker not active');
            }
          } catch (error) {
            log('Web Share Target: Error communicating with service worker:', error);
          }
        }
      }
    };

    // Handle both launch scenarios
    log('Web Share Target: Calling launch function...');
    handleLaunch().catch((error) => log('Web Share Target: Error in handleLaunch:', error));

    // Listen for navigation events to check for shared data
    const handlePopState = () => {
      setTimeout(() => {
        handleLaunch().catch((error) => log('Web Share Target: Error in handlePopState:', error));
      }, 100);
    };

    // Listen for direct messages from service worker
    const handleServiceWorkerMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'DIRECT_SHARED_DATA') {
        log('Web Share Target: Received direct shared data from service worker:', event.data.payload);

        try {
          const sharedData = event.data.payload;
          if (sharedData.files) {
            sharedData.files = await deserializeFiles(sharedData.files);
          }

          setSharedData(sharedData);
          // Navigate after ensuring data is set
          setTimeout(() => {
            navigate('/add');
          }, 0);
        } catch (error) {
          log('Web Share Target: Error processing direct shared data:', error);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Add service worker message listener
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, [navigate]);

  const clearSharedData = () => {
    setSharedData(null);
  };

  // Debug: Add global function for testing (only in debug mode)
  if (typeof window !== 'undefined' && DEBUG_WEB_SHARE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).testWebShareTarget = (data: SharedData) => {
      log('Global test function called with:', data);
      setSharedData(data);
      navigate('/add');
    };
  }

  return {
    sharedData,
    clearSharedData,
    hasSharedData: !!sharedData,
  };
};
