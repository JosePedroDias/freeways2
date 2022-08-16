# TL;DR

Exploring the concepts behind the game [freeways](https://captaingames.itch.io/freeways).

## REFERENCE MATERIAL

https://pixijs.io/guides/
https://pixijs.download/release/docs/index.html
https://pixijs.io/examples/


https://pixijs.io/examples/#/demos-advanced/collision-detection.js
https://pixijs.io/examples/#/demos-advanced/mouse-trail.js
https://pixijs.io/examples/#/graphics/dynamic.js

https://github.com/timohausmann/quadtree-ts/
https://timohausmann.github.io/quadtree-js/dynamic.html
alternative https://github.com/CorentinTh/quadtree-js

https://github.com/getditto/dijkstra-calculator
https://github.com/tcort/dijkstrajs
https://github.com/ProfDeCube/dijkstrajs
https://github.com/chen0040/js-graph-algorithms

https://github.com/pixijs/particle-emitter
http://pixijs.io/particle-emitter/docs/

https://github.com/pixijs/sound


A* https://www.youtube.com/watch?v=pKnV6ViDpAI
best path Dijkstra's Algorithm https://www.youtube.com/watch?v=iFdOKsw6x6A
https://www.youtube.com/watch?v=GazC3A4OQTE


## CREDITS

- using assets from this bundle as stubs https://gamesupply.itch.io/cars-and-trucks


## TODO

- [x] road segment drawing action and visuals
- [x] make cars move toward simple destinations
- [x] detect proximity of other cars ahead and stop
- [ ] extrapolate graph from intersection of roads
- [ ] apply Dijkstra shortest path and tag segments accordingly
- [ ] add sources and destinations to the map
- [ ] make cars spawn from sources
- [ ] make cars pick closest road connected to destination
- [ ] make cars die on destinations
- [ ] aux vis: display connected roads
- [ ] accelerate time
- [ ] detect traffic jam

- [ ] undo support
- [ ] delete closest road
- [ ] delete orphan segments
- [ ] fix nearly perfect segments (position very close to existing one with versors not very far off)
- [ ] support ramps and multiple layers
- [ ] add obstacles - roads can't go there
- [ ] draw obstacles with procedural drawing
- [ ] draw origins and destinations with location name signs
- [ ] basic event sounds
- [ ] engine + environmental sounds
- [ ] good looking cars
- [ ] particle effects (smoke on new ramps, something on new roads or deletions, haze for new segments being driven?)
- [ ] basic shadows between layers?
- [ ] level editor
- [ ] procedural level generation?
