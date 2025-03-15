self.addEventListener("push", async function (event) {
    var data = event.data ? event.data.json() : {};
    var title = data.title || "home";
    var options = {
        body: data.body || "Click to launch app!",
        data: { url: data.url || "../home" }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Saat notifikasi ditutup
self.addEventListener("notificationclose", async event => {
    var notification = event.notification;

    var logData = {
        title: notification.title,
        event: "notification_closed",
        timestamp: new Date().toISOString(),
        model: "Unknown" // Default, nanti akan di-update
    };

    // Kirim permintaan ke semua client (tab yang terbuka)
    const clientsList = await clients.matchAll({ type: "window", includeUncontrolled: true });

    if (clientsList.length > 0) {
        // Kirim pesan ke salah satu tab yang terbuka untuk mendapatkan model perangkat
        const client = clientsList[0];
        client.postMessage({ action: "getDeviceModel" });

        // Tunggu respons dari client
        const modelPromise = new Promise(resolve => {
            self.addEventListener("message", event => {
                if (event.data && event.data.deviceModel) {
                    resolve(event.data.deviceModel);
                }
            });
        });

        logData.model = await modelPromise;
    }

    // Kirim data ke server
    event.waitUntil(
        fetch("https://posttestserver.dev/p/home/post/json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(logData)
        }).then(response => console.log("Log sent", response))
        .catch(error => console.error("Log failed", error))
    );
});

// Saat notifikasi diklik
self.addEventListener("notificationclick", event => {
    event.notification.close();
    var urlToOpen = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
            for (var client of clientList) {
                if (client.url === urlToOpen && "focus" in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(urlToOpen);
        })
    );
});
