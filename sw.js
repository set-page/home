self.addEventListener("push", function (event) {
  console.log("[ServiceWorker] Push event received");

  let payload = {};
  try {
    if (event.data) {
      // Coba parse JSON
      payload = event.data.json();
      console.log("[ServiceWorker] Payload:", payload);
    } else {
      console.warn("[ServiceWorker] No data in push event");
    }
  } catch (e) {
    console.error("[ServiceWorker] Error parsing push data:", e);
  }

  // Ambil data dari payload (baik di root atau di bawah "data")
  const data = payload.data || payload;

  const title = data.title || "Notifikasi";
  const body = data.body || "(tidak ada isi)";
  const url = (data.url || "/");

  const options = {
    body,
    icon: "/icons/icon-192.png", // opsional
    badge: "/icons/badge.png",   // opsional
    data: { url }
  };

  // Tampilkan notifikasi
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
