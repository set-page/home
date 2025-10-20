// -----------------------------
// Service Worker: sw.js
// -----------------------------

// Event: Push diterima
self.addEventListener('push', event => {
  console.log('[ServiceWorker] Push event diterima (mulai)');

  if (!event.data) {
    console.warn('[ServiceWorker] event.data kosong! Mungkin payload gagal didekripsi.');
    event.waitUntil(
      self.registration.showNotification('Push Kosong', {
        body: 'Payload tidak bisa didekripsi atau header salah.',
        icon: '/icons/icon-192.png'
      })
    );
    return;
  }

  // Coba baca payload
  let dataText = '';
  try {
    dataText = event.data.text();
  } catch (e) {
    console.error('[ServiceWorker] Gagal membaca event.data.text():', e);
  }

  event.waitUntil(
    (async () => {
      let payload;
      try {
        const text = await dataText;
        console.log('[ServiceWorker] Raw payload:', text);

        // Jika payload berupa JSON valid
        try {
          payload = JSON.parse(text);
        } catch {
          payload = { data: { title: 'Pesan', body: text, url: '/' } };
        }

        const notifData = payload.data || {};
        const title = notifData.title || 'Push Notification';
        const options = {
          body: notifData.body || 'Pesan kosong',
          icon: notifData.icon || '/icons/icon-192.png',
          badge: notifData.badge || '/icons/icon-96.png',
          data: { url: notifData.url || '/' },
          vibrate: [100, 50, 100],
        };

        console.log('[ServiceWorker] Menampilkan notifikasi:', title, options);
        await self.registration.showNotification(title, options);

      } catch (err) {
        console.error('[ServiceWorker] Error saat proses payload:', err);
        await self.registration.showNotification('Push Error', {
          body: 'Terjadi kesalahan saat menampilkan notifikasi.',
        });
      }
    })()
  );
});

// -----------------------------
// Event: Klik notifikasi
// -----------------------------
self.addEventListener('notificationclick', event => {
  console.log('[ServiceWorker] Notifikasi diklik:', event.notification);
  event.notification.close();

  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
    for (const client of windowClients) {
      if (client.url === url && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});

// -----------------------------
// Event: Install/Activate
// -----------------------------
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activated');
  event.waitUntil(clients.claim());
});
