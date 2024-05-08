**Commonplace Book** is a multi-user wiki implemented as a single page application using Svelte. **CPB** is a work in progress but currently functions admirably as a basic wiki.

# Design Concepts

## Resources

All objects in the wiki are modeled as *resources*, from users to images to articles, and all resources are treated uniformly. Resources are addressed by an *NSTU* and may be *anchored* in the global namespace. All resources have a UUID by which they can be addressed regardless of their location in the namespace, if any. All resources are versioned and old versions may be addressed by their UUID.

## NSTU

An **NSTU** is an identifier which can be used to address resources in CPB. NSTU stands for **N**ame**s**pace-**T**itle/**U**UID. All resources always have a UUID by which they may be addressed. Resources anchored to the namespace by also be addressed by their namespace and title. Examples of valid NSTUs:

* `Home` (The resource anchored at `main:Home`. The `main` namespace may be omitted.)
* `main:Home` (Same as above.)
* `docs:Editing` (Namespaces other than `main` have to be given explicitly.)
* `:login` (There exists a special blank namespace used for system pages, like the login page.)
* `docs:` (Every namespace has an index page at its root.)
* `BD1B6976-3007-48AF-99DD-DF069B0306EC` (Every resource and version has a UUID by which it may be addressed. UUIDs are valid NSTUs.)
* `~root` (User resources are unique in that their title must always begin with a tilde. No other resource may beginw with one.)

## Namespace

Resources can be anchored to a namespace by giving them a title. They can then be addressed by their Namespace-Title pair (the NST in NSTU). The default namespace is called `main` and may be omitted in NSTUs.

# Wiki Markdown

**CPB** features a purpose-built markup language called **Wiki Markdown**, or WMD. WMD combines Markdown with WikiText link syntax and features novel syntax for decorators and external link shortcuts.

# Future Plans

* Saved searches
* Custom search views
* Structured data system
* Dynamic visualizations using data system, as search views
* Transclusion
* Tagging
* User Permissions

