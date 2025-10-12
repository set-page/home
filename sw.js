self.addEventListener("push", async function (event) {
    // Ambil data dari payload push
    var payload = event.data ? event.data.json() : {};
    var data = payload.data || payload; // handle FCM atau push langsung

    // Pastikan title dan body ada
    var title = data.title || "No Title";
    var body = data.body || "No message content";

    // Siapkan opsi notifikasi
    var options = {
        body: body,
        data: {
            url: data.url || "../home"
        }
    };

    // Tampilkan notifikasi
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
