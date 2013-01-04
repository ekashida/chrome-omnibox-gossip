chrome-omnibox-gossip
=====================

Prototype to get Gossip results into the Chrome Omnibar.

Getting Started
---------------

Trigger the extension by typing 'g' (for gossip) and then entering a space. At this point, you will see your a default omnibox dropdown. Once you start typing, the omnibox will show gossip results.

Notes
-----

* There is no way to provide results upon switching context from the default omnibox to an extension. This means that we can't have an initial default state, triggered by an empty query.
* The only event that the omnibox fires is the click event. This means that we are not notified when the user hovers over a suggestion or traverses them using the up/down arrow.
* The omnibox seems to render its default suggestions before injecting the extension's suggesions. You can see this in a FOUC-esque manner.
