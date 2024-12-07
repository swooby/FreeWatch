//console.log('FreeWatch content script loaded');

function quote(s) {
    return s ? `"${s}"` : '""'; 
}

// Function to process watchlist items
function processWatchlistItems(filterFree = false) {
    const watchlistItems = document.querySelectorAll('article[data-testid="card"]');
    watchlistItems.forEach((item) => {
        //console.log('item:', item);

        // Skip already processed items
        if (item.dataset.processed) return;

        // Extract the title from the article's data attribute
        const title = (item.getAttribute('data-card-title') || 'Unknown').trim();
        //console.log("title:", title);

        // Check if the "Store Filled" title exists in the SVG element
        const isPaid = item.querySelector('svg title')?.textContent.trim() === 'Store Filled';
        //console.log("isPaid:", isPaid);

        const isFree = !isPaid;

        // Apply a rounded green gradient border if the item is free
        item.style.border = 'none'; // Remove any existing border
        item.style.borderRadius = '12px'; // Add rounded corners
        item.style.padding = '4px'; // Add some padding to make space for the border
        item.style.backgroundOrigin = 'border-box';
        item.style.backgroundClip = 'content-box, border-box';
        if (isPaid) {
            item.style.backgroundImage = 'linear-gradient(to right, gray, dimgray), linear-gradient(gray, dimgray)';
        
            const pictureElement = item.querySelector('picture');
            // console.log('pictureElement:', pictureElement);
            if (pictureElement) {
                pictureElement.style.opacity = '0.7'; // Subtly dim the paid item
            }
        } else {
            item.style.backgroundImage = 'linear-gradient(to right, lime, green), linear-gradient(lime, green)';

            // Setup a MutationObserver to monitor the hover effect for `standard-mini-details`
            const observer = new MutationObserver(() => {
                const detailsDiv = item.querySelector('div[data-testid="standard-mini-details"]');
                // console.log('detailsDiv:', detailsDiv);
                if (detailsDiv) {
                    const leavesPrimeText = detailsDiv.textContent.includes("Leaves Prime in");
                    // console.log('leavesPrimeText:', leavesPrimeText);
                    // Apply styling based on the presence of "Leaves Prime in"
                    if (leavesPrimeText) {
                        // Highlight in red
                        item.style.border = 'none';
                        item.style.borderRadius = '12px';
                        item.style.padding = '4px';
                        item.style.backgroundImage = 'linear-gradient(to right, red, darkred), linear-gradient(red, darkred)';
                        item.style.backgroundOrigin = 'border-box';
                        item.style.backgroundClip = 'content-box, border-box';
                    }
                    observer.disconnect(); // Stop observing once processed
                }
            });

            observer.observe(item, {
                childList: true, // Watch for changes in child elements
                subtree: true    // Watch deeper within the DOM tree
            });
        }

        // Mark the item as processed
        item.dataset.processed = true;
        
        // const watchlistItem = {
        //     title,
        //     isFree,
        // };
        // console.log("watchlistItem:", watchlistItem);
    });
}

// Function to observe DOM changes and process new watchlist items
let mutationObserverFilterActive = false; // Track whether filter is active
function observeDynamicContent() {
    const targetNode = document.querySelector('div[data-testid="grid-mini-details-controller"]');
    if (!targetNode) {
        console.error('Target node for observation not found');
        return;
    }

    const observer = new MutationObserver(() => {
        //console.log('Mutation detected, processing new items...');
        processWatchlistItems(mutationObserverFilterActive); // Apply filtering if active
    });

    observer.observe(targetNode, {
        childList: true, // Watch for addition/removal of child elements
        subtree: true    // Watch deeper within the DOM tree
    });

    //console.log('Started observing dynamic content...');
}

// Run the script after the page has fully loaded
window.addEventListener('load', () => {
    //console.log('Page fully loaded. Processing initial watchlist items...');
    processWatchlistItems();
    observeDynamicContent();
});
