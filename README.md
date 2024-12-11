# FreeWatch

Chrome Extension to easily identify "Included With Prime" and "Leaves Prime In X Days" videos in your Amazon Prime Video Watchlist.

* "Included With Prime" videos are highlighted in green.
* Non-"Included With Prime" videos are subtly dimmed.
* "Leaves Prime In X Days" will highlight red **when hovered over**.
* Observes the html DOM for dynamic loads as the page is scrolled.

<img width="1030" alt="image" src="https://github.com/user-attachments/assets/e7ae2cc2-57f3-45c6-91a3-772c82886a2f">

**You will need to often manually refresh the page (Control/Command-R).**

This project currently only works for Chrome browsing Amazom Prime video.

Feel free to contribute to this extension to improve it and/or support other browsers and/or video providers!

# Background

I have always found it more difficult than necessary to easily distingush "Included With Prime" videos from videos that have to be paid for; Amazon's little yellow shopping cart icon, <img width="28" alt="image" src="https://github.com/user-attachments/assets/67c64772-0836-49b7-82bb-38f724c6cafa">, is **by itself** fairly obvious and easy to spot, but **in a sea of video thumbnails it just becomes noise**.

I have also found it easy to miss videos that are "Leaving Prime In X Days".

I looked for and did not find any existing extension to highlight Free or Expiring videos.

So I wrote this extension initially for my own personal use case.

## Details

The html of the (view-source:https://www.amazon.com/gp/video/mystuff/watchlist)[https://amazon.com/gp/video/mystuff] pages is pretty huge and messy, but it is overall not too complicated.

The main root for the list of videos is all of the `<article ... data-testid="card">` elements under the `<div data-testid="grid-mini-details-controller">` element.  

An example snippet can be seen in [scratch.html](scratch.html).

### Free: Included With Prime

Each `<article>` itself is relatively simple and small; the biggest individual blob in each article is usually any `"Store Filled"` svg that indicates that the video costs money to watch and is thus **NOT** `Included With Prime`.

The existence of the `"Store Filled"` svg alone seems to be enough to determine if the video is pay or free.

### Expiring: Leaves Prime In X Days

There seems to be nothing in any initially loaded `<article>` that identifies the video as Expiring or not.

The only dynamic way I have found to determine this is hover over the item and query for any `<div data-testid="standard-mini-details"> ... <div data-testid="high-value-msg"> ... Leaves Prime in X days`.

### WIP: Script Injection

This WIP is being tracked in the `script_inject` branch.

In addition to the html DOM, the page also defines a [exceptionally large] [initially static] script block of JSON (also seen in [scratch.html](scratch.html)):
```html
<script type="text/template">
    {
        "props":{
            "body":[
                {
                    "props":{
                        "content":{
                            "baseOutput":{
                                "containers":[
                                    {
                                        "entities":[
                                            {
                                                video 0...
                                                "entitlementCues":{
                                                    ...
                                                    "focusMessage":{
                                                        ...
                                                        "message":"Included with Prime"
                                                    },
                                                    ...
                                                    "highValueMessage":{"message":"Leaves Prime in 5 days"},
                                                    ...
                                                },
                                                ...
                                            },
                                            {
                                                video 1...
                                                ...
                                            },
                                            ...
                                            {
                                                video N...
                                                ...
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        }
    }
</script>
```

Each entity in the `"entities"` block has the metadata for each video in the list.

It is possible from that JSON's `entitlementCues` fields to determine if the video is "Free" or not and "Expiring" or not.

This would be preferred over observing the DOM, **and most importantly would avoid the need to hover over a video before we can determine if it is "Expiring"**, but the problem is that I have not yet found a way to dynamically observe mutations to this javascript `props` object as new content is dynamically loaded when the page is scrolled.

I think this requires script injection, but I have not been able to successfully get this working... yet.

### WIP: Filter/Sort "Free" and "Expiring"

This WIP is being tracked in the `filter` branch.

I would also like to add a Filter and Sort feature for Free and Expiring video.

I was initially able to Filter the default loaded data, but I have been unable to Filter dynamically loaded data, especially without causing javascript content mutation errors.

## Other References

* https://expiringtitlesonamazonprime.blogspot.com/
  * https://expiringtitlesonamazonprime.blogspot.com/2024/11/expiring-titles-nov-2024.html

## TODO
* Add "Free" or "Expiring" buttons to only show them.
* Add ablity to sort by Free/Expiring.
* Find way to inject script to better detect "Included With Prime" and "Leaves Prime in X days".
* Track changes from previous sessions and notify when videos become Free or Expiring.
