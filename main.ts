function clear_tilemap () {
    for (let row = 0; row <= tiles.tilemapRows() - 1; row++) {
        for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
            tiles.setTileAt(tiles.getTileLocation(col, row), assets.image`clear_tile`)
        }
    }
}
function make_map () {
    for (let row = 0; row <= tiles.tilemapRows() / 4 - 2; row++) {
        for (let col = 0; col <= tiles.tilemapColumns() / 4 - 2; col++) {
            if (row % 2 == 0) {
                tiles.setTileAt(tiles.getTileLocation((col + 1) * 4 - 2, (row + 1) * 4 - 1), assets.image`pole`)
            } else {
                tiles.setTileAt(tiles.getTileLocation((col + 1) * 4 - 1 + 1, (row + 1) * 4 - 1), assets.image`pole`)
            }
        }
    }
    for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
        tiles.setTileAt(tiles.getTileLocation(col, tiles.tilemapRows() - 1), assets.image`wall`)
        tiles.setWallAt(tiles.getTileLocation(col, tiles.tilemapRows() - 1), true)
    }
    for (let row = 0; row <= tiles.tilemapRows() - 1; row++) {
        tiles.setTileAt(tiles.getTileLocation(0, row), assets.image`wall`)
        tiles.setWallAt(tiles.getTileLocation(0, row), true)
        tiles.setTileAt(tiles.getTileLocation(tiles.tilemapColumns() - 1, row), assets.image`wall`)
        tiles.setWallAt(tiles.getTileLocation(tiles.tilemapColumns() - 1, row), true)
    }
}
scene.setBackgroundColor(11)
micromaps.createTilemap(micromaps.TileSize.Four, scene.screenWidth() / 4, scene.screenHeight() / 4)
clear_tilemap()
make_map()
