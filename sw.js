self.addEventListener("push", async function (event) {
    // Ambil data dari payload push
    var data = event.data ? event.data.json() : {};

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
