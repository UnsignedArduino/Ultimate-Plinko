scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (tiles.locationXY(location, tiles.XY.row) > tiles.tilemapRows() - 4) {
        if (sprite.isHittingTile(CollisionDirection.Bottom)) {
            sprite.vy = Math.abs(sprite.vy)
            sprite.setFlag(SpriteFlag.AutoDestroy, true)
            sprite.setFlag(SpriteFlag.GhostThroughWalls, true)
            timer.after(1, function () {
                sprite.vy = Math.abs(sprite.vy)
            })
        }
    } else {
        if (Math.percentChance(50)) {
            sprite.vx = randint(50, 75)
        } else {
            sprite.vx = randint(-50, -75)
        }
        if (sprite.vy < 0) {
            timer.after(1, function () {
                sprite.vy = sprite.vy * 0.5
            })
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.image`10_points`, function (sprite, location) {
    info.changeScoreBy(5)
    sprite.setFlag(SpriteFlag.GhostThroughTiles, true)
})
function drop_coin (dropper: Sprite) {
    disable_movement(dropper)
    sprite_coin = sprites.create(assets.image`coin`, SpriteKind.Player)
    sprite_coin.x = dropper.x
    sprite_coin.bottom = dropper.top
    sprite_coin.ay = 100
    sprite_coin.setFlag(SpriteFlag.BounceOnWall, true)
    sprite_coin.setFlag(SpriteFlag.Ghost, true)
    timer.after(50, function () {
        sprite_coin.setFlag(SpriteFlag.Ghost, false)
    })
    timer.after(500, function () {
        enable_movement(dropper)
    })
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (info.score() >= 25) {
        timer.throttle("drop_coin", 500, function () {
            drop_coin(sprite_dropper)
            info.changeScoreBy(-25)
        })
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.image`100_points`, function (sprite, location) {
    // for some reason the events fire twice
    info.changeScoreBy(50)
    sprite.setFlag(SpriteFlag.GhostThroughTiles, true)
})
function make_containers () {
    fill_tiles(1, tiles.tilemapRows() - 1 - 3, 8, tiles.tilemapRows() - 1, assets.image`10_points`, false)
    fill_tiles(8, tiles.tilemapRows() - 1 - 3, 9, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(9, tiles.tilemapRows() - 1 - 3, 14, tiles.tilemapRows() - 1, assets.image`30_points`, false)
    fill_tiles(14, tiles.tilemapRows() - 1 - 3, 15, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(15, tiles.tilemapRows() - 1 - 3, 18, tiles.tilemapRows() - 1, assets.image`50_points`, false)
    fill_tiles(18, tiles.tilemapRows() - 1 - 3, 19, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(19, tiles.tilemapRows() - 1 - 3, 22, tiles.tilemapRows() - 1, assets.image`100_points`, false)
    fill_tiles(22, tiles.tilemapRows() - 1 - 3, 23, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(23, tiles.tilemapRows() - 1 - 3, 26, tiles.tilemapRows() - 1, assets.image`50_points`, false)
    fill_tiles(26, tiles.tilemapRows() - 1 - 3, 27, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(27, tiles.tilemapRows() - 1 - 3, 31, tiles.tilemapRows() - 1, assets.image`30_points`, false)
    fill_tiles(31, tiles.tilemapRows() - 1 - 3, 32, tiles.tilemapRows() - 1, assets.image`wall`, true)
    fill_tiles(32, tiles.tilemapRows() - 1 - 3, 39, tiles.tilemapRows() - 1, assets.image`10_points`, false)
}
function make_all_poles () {
    for (let row = 0; row <= tiles.tilemapRows() / 4 - 2; row++) {
        for (let col = 0; col <= tiles.tilemapColumns() / 4 - 2; col++) {
            if (row % 2 == 0) {
                tiles.setTileAt(tiles.getTileLocation((col + 1) * 4 - 2, (row + 1) * 4 - 1), assets.image`pole`)
                tiles.setWallAt(tiles.getTileLocation((col + 1) * 4 - 2, (row + 1) * 4 - 1), true)
            } else {
                tiles.setTileAt(tiles.getTileLocation((col + 1) * 4 - 1 + 1, (row + 1) * 4 - 1), assets.image`pole`)
                tiles.setWallAt(tiles.getTileLocation((col + 1) * 4 - 1 + 1, (row + 1) * 4 - 1), true)
            }
        }
    }
}
function disable_movement (dropper: Sprite) {
    controller.moveSprite(dropper, 0, 0)
}
function enable_movement (dropper: Sprite) {
    controller.moveSprite(dropper, 75, 0)
}
function make_coin_dropper () {
    sprite_dropper = sprites.create(assets.image`coin_dropper`, SpriteKind.Player)
    sprite_dropper.top = 0
    sprite_dropper.x = scene.screenWidth() / 2
    enable_movement(sprite_dropper)
}
scene.onOverlapTile(SpriteKind.Player, assets.image`30_points`, function (sprite, location) {
    info.changeScoreBy(15)
    sprite.setFlag(SpriteFlag.GhostThroughTiles, true)
})
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
scene.onOverlapTile(SpriteKind.Player, assets.image`50_points`, function (sprite, location) {
    info.changeScoreBy(25)
    sprite.setFlag(SpriteFlag.GhostThroughTiles, true)
})
let sprite_dropper: Sprite = null
let sprite_coin: Sprite = null
micromaps.createTilemap(micromaps.TileSize.Four, scene.screenWidth() / 4, scene.screenHeight() / 4)
scene.setBackgroundImage(assets.image`background`)
clear_tilemap()
make_map()
make_coin_dropper()
info.setScore(100)
