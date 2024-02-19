# Mini Git GUI - Web GUI

React Web Frontend GUI for Mini Git GUI. Setup with Vite.

## Graph Generation Notes

The graph generation algorithm is not yet perfect.

It loads quite long for large repositories, and it breaks for certain edge cases.

The graph generation is also run on client-side for now, which is slow on single-threaded JavaScript in the browser.

But for smaller projects, it should work just fine.

Works as a proof-of-concept, and works for my use case for now.
