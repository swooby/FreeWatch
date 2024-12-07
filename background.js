let previousWatchlist = [];

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateWatchlist") {
        const currentWatchlist = message.items;

        // Find changes
        const changes = currentWatchlist.filter(item =>
            !previousWatchlist.some(prev => prev.title === item.title && prev.isPaid === item.isPaid)
        );
        console.log("changes=", changes);

        // Notify about changes
        if (changes.length > 0) {
            changes.forEach(change => {
                console.log("change=", change);
                /*
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "FreeWatch.png",
                    title: "Watchlist Update",
                    message: `${change.title} is now ${change.isPaid ? "Paid Content" : "Included with Prime"}`
                });
                */
            });
        }

        // Update the watchlist state
        previousWatchlist = currentWatchlist;
        sendResponse({ success: true });
    }
});
