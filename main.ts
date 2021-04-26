function make_containers () {
    fill_tiles(1, tiles.tilemapRows() - 1 - 3, 8, tiles.tilemapRows() - 1, assets.image`10_points`, false)
    fill_tiles(8, tiles.tilemapRows() - 1 - 3, 9, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(9, tiles.tilemapRows() - 1 - 3, 14, tiles.tilemapRows() - 1, assets.image`25_points`, false)
    fill_tiles(14, tiles.tilemapRows() - 1 - 3, 15, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(15, tiles.tilemapRows() - 1 - 3, 18, tiles.tilemapRows() - 1, assets.image`50_points`, false)
    fill_tiles(18, tiles.tilemapRows() - 1 - 3, 19, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(19, tiles.tilemapRows() - 1 - 3, 22, tiles.tilemapRows() - 1, img`
        3 3 3 3 
        3 3 3 3 
        3 3 3 3 
        3 3 3 3 
        `, false)
    fill_tiles(22, tiles.tilemapRows() - 1 - 3, 23, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(24, tiles.tilemapRows() - 1 - 3, 26, tiles.tilemapRows() - 1, assets.image`50_points`, false)
    fill_tiles(26, tiles.tilemapRows() - 1 - 3, 27, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(27, tiles.tilemapRows() - 1 - 3, 31, tiles.tilemapRows() - 1, assets.image`25_points`, false)
    fill_tiles(31, tiles.tilemapRows() - 1 - 3, 32, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(32, tiles.tilemapRows() - 1 - 3, 39, tiles.tilemapRows() - 1, assets.image`10_points`, false)
}
function make_all_poles () {
    for (let row = 0; row <= tiles.tilemapRows() / 4 - 2; row++) {
        for (let col = 0; col <= tiles.tilemapColumns() / 4 - 2; col++) {
            if (row % 2 == 0) {
                tiles.setTileAt(tiles.getTileLocation((col + 1) * 4 - 2, (row + 1) * 4 - 1), assets.image`pole`)
            } else {
                tiles.setTileAt(tiles.getTileLocation((col + 1) * 4 - 1 + 1, (row + 1) * 4 - 1), assets.image`pole`)
            }
        }
    }
}
function make_coin_dropper () {
    sprite_dropper = sprites.create(assets.image`coin_dropper`, SpriteKind.Player)
    sprite_dropper.top = 0
    sprite_dropper.x = scene.screenWidth() / 2
    controller.moveSprite(sprite_dropper, 75, 0)
}
function clear_tilemap () {
    for (let row = 0; row <= tiles.tilemapRows() - 1; row++) {
        for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
            tiles.setTileAt(tiles.getTileLocation(col, row), assets.image`clear`)
        }
    }
}
function make_map () {
    make_walls()
    make_all_poles()
    make_containers()
}
function fill_tiles (from_col: number, from_row: number, to_col: number, to_row: number, tile: Image, wall: boolean) {
    for (let row = 0; row <= to_row - from_row - 1; row++) {
        for (let col = 0; col <= to_col - from_col - 1; col++) {
            tiles.setTileAt(tiles.getTileLocation(from_col + col, from_row + row), tile)
            tiles.setWallAt(tiles.getTileLocation(from_col + col, from_row + row), wall)
        }
    }
}
function make_walls () {
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
let sprite_dropper: Sprite = null
micromaps.createTilemap(micromaps.TileSize.Four, scene.screenWidth() / 4, scene.screenHeight() / 4)
pause(100)
scene.setBackgroundImage(assets.image`background`)
clear_tilemap()
make_map()
make_coin_dropper()
