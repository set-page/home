self.addEventListener("push", async function (event) {
  console.log("[ServiceWorker] Push event diterima:", event);
  if (!event.data) {
    console.warn("[ServiceWorker] event.data kosong -> payload gagal didekripsi.");
  } else {
    console.log("[ServiceWorker] event.data ada:", event.data);
  }

  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    console.error("[ServiceWorker] Gagal parse payload:", e);
  }

  const data = payload.data || payload;
  const title = data.title || "No Title";
  const body = data.body || "No message content";

  console.log("[ServiceWorker] Title:", title, "Body:", body);

  const options = {
    body: body,
    data: { url: data.url || "../home" }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
