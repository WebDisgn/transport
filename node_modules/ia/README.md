# ia.js

ia.js is a collection of utilities to manage information architecture.  It currently only provides an API for an extensible hierarchical information architecture (a site map, for example).

## Universe

The `Universe` refers to the top-level organization of all content.  The name is taken from set theory, where "universe" refers to the set of all relevant elements.  In ia.js, the `Universe` object is also a `Node` (the root node, if you will).

## Node

`Node` represents a _content node_ (for example, a page on a website).  Every content node has a unique path-like address in the `Universe`.  There are three types of nodes:

* Content node: regular node that has a user-defined payload (aka data aka content).
* Placeholder node: node that provides hierarchical structure, is not reflected in the short address, and has no payload.
* Transparent node: node that provides hierarchical structure, is not reflected in the short address, but has a payload.
* Reference node: node that is an alias for another node (by extension, the payload of a reference node is the payload of the node it references).

## Content Addressing

Content is addressed one of two ways: either by its _formal_ address, or by its _short_ address.  The formal address reflects the organization of all of your content.  The short address mirrors the formal address, but with placeholder nodes (see below) removed.

For example, consider the following IA:

```
Formal Address 
(as tree)           Formal Address                       Short Address
-----------------   -------------------                  ----------------
/products           /products                            /products
  /by-name          /products/by-name                  
    /anvil          /products/by-name/anvil              /products/anvil
    /balloon        /products/by-name/balloon            /products/balloon
    /chisel         /products/by-name/chisel             /products/chisel
  /by-category      /products/by-category                /products/by-category
    /tools          /products/by-category/tools          /products/tools
      /anvil        /products/by-category/tools/anvil    /products/anvil
      /chisel       /products/by-category/tools/chisel   /products/chisel
    /fun            /products/by-category/fun            /products/fun
      /balloon      /products/by-category/fun/balloon    /products/balloon
```

This example demonstrates all types of node.  `/products/by-name` is a _placeholder node_.  That is, it helps organize content, but has no content (reflected by the fact that it has no short address).  Because `/products/by-name` is a placeholder node, it does not appear in the short address of its children.  `/products/by-category`, `/products/by-category/tools`, and `/products/by-category/fun` are _transparent nodes_: they have content, but do not appear in the short address of their children.  Finally, `/products/by-category/tools/anvil` (like the other categorized products) is a _reference node_, referring to `/products/anvil`. 

## Usage

TODO: this library is under construction, and will be documented soon.

## Contributing

If you wish to contribute to this, make sure your contributions pass all existing tests (`npm test`).  PRs should generally include new tests.


