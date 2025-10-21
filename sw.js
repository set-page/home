// Service Worker - menangani event Push API
self.addEventListener("push", async function (event) {
  console.log("[ServiceWorker] Push event diterima.");

  // Ambil data dari payload (jika ada)
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    console.error("[ServiceWorker] Gagal parse payload:", e);
  }

  // Ambil isi data (bisa langsung dari root atau dari field 'data')
  const data = payload.data || payload;

  // Pastikan title & body ada nilai default
  const title = data.title || "No Title";
  const body = data.body || "No message content";

  // Siapkan opsi notifikasi
  const options = {
    body: body,
    data: {
      url: data.url || "../home" // URL yang dibuka saat notifikasi diklik
    }
  };

  // Tampilkan notifikasi
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});