self.addEventListener('push', event => {
  console.log('[ServiceWorker] Push event diterima');
  if (event.data) {
    console.log('[ServiceWorker] Data:', event.data.text());
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        data: { url: data.url }
      })
    );
  } else {
    console.log('[ServiceWorker] event.data kosong!');
    event.waitUntil(
      self.registration.showNotification('Push Kosong', {
        body: 'Payload tidak bisa didekripsi'
      })
    );
  }
});
