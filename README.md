# TL;DR

Exploring the concepts behind the game [freeways](https://captaingames.itch.io/freeways).

## REFERENCE MATERIAL

https://pixijs.io/guides/
https://pixijs.download/release/docs/index.html
https://pixijs.io/examples/

animatedSprite and spriteSheet https://pixijs.download/dev/docs/PIXI.AnimatedSprite.html


https://pixijs.io/examples/#/demos-advanced/collision-detection.js
https://pixijs.io/examples/#/demos-advanced/mouse-trail.js
https://pixijs.io/examples/#/graphics/dynamic.js

https://github.com/timohausmann/quadtree-ts/ <-
https://timohausmann.github.io/quadtree-js/dynamic.html
alternative https://github.com/CorentinTh/quadtree-js

https://github.com/getditto/dijkstra-calculator <-
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
- grass https://naldzgraphics.net/free-seamless-grass-textures/
- map landmarks https://www.uidownload.com/en/vector-jkmmc
- water https://www.sketchuptextureclub.com/textures/nature-elements/water/sea-water


## TODO

- [x] road segment drawing action and visuals
- [x] make cars move toward simple destinations
- [x] detect proximity of other cars ahead and stop
- [x] extrapolate graph from intersection of roads
- [x] apply Dijkstra shortest path and tag segments accordingly
- [x] add sources and destinations to the map
- [x] make cars spawn from sources (and not on top of other cars)
- [x] make cars die on destinations
- [x] new cars shouldn't spawn on top of other cars
- [ ] draw origins and destinations with location name signs
- [ ] avoid strokes over obstacle
- [ ] aux vis: display connected roads
- [ ] accelerate time
- [ ] detect traffic jam
- [ ] support ramps and multiple layers
- [ ] add obstacles - passable (over water) and blocking (buildings)

- [x] basic undo support
- [x] delete closest road
- [x] delete orphan segments
- [x] merge close-enough vertices
- [ ] reuse existing vertices at stroke start
- [ ] basic event sounds
- [ ] engine + environmental sounds
- [ ] good looking cars
- [ ] particle effects (smoke on new ramps, something on new roads or deletions, haze for new segments being driven?)
- [ ] basic shadows between layers?
- [ ] level editor
- [ ] procedural level generation?


## KNOWN BUGS


