namespace SpriteKind {
    export const Dropper = SpriteKind.create()
}
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (tiles.locationXY(location, tiles.XY.row) > tiles.tilemapRows() - 4) {
        if (sprite.isHittingTile(CollisionDirection.Bottom)) {
            sprite.vy = Math.abs(sprite.vy)
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
function make_title_text (sprite: Sprite, top: number, left: number) {
    sprite.top = top
    sprite.left = left
    sprite.setFlag(SpriteFlag.AutoDestroy, true)
    sprite.setFlag(SpriteFlag.Ghost, true)
    return sprite
}
scene.onOverlapTile(SpriteKind.Player, assets.image`10_points`, function (sprite, location) {
    change_score(5)
    sprite.setFlag(SpriteFlag.GhostThroughTiles, true)
    popup_text(sprite, "+10")
})
function drop_coin (dropper: Sprite, coin: Sprite) {
    coins_dropping += 1
    coin.x = dropper.x
    coin.bottom = dropper.top
    coin.ay = 100
    coin.setFlag(SpriteFlag.BounceOnWall, true)
    coin.setFlag(SpriteFlag.AutoDestroy, true)
    coin.setFlag(SpriteFlag.Ghost, true)
    timer.after(50, function () {
        coin.setFlag(SpriteFlag.Ghost, false)
        coin.setFlag(SpriteFlag.GhostThroughSprites, true)
    })
    timer.after(500, function () {
        coin.setFlag(SpriteFlag.GhostThroughSprites, false)
        coins_dropping += -1
    })
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    try_coin_drop()
})
function try_coin_drop () {
    if (can_drop) {
        if (actual_score >= 25) {
            drop_coin(sprite_dropper, sprites.create(assets.image`coin`, SpriteKind.Player))
            change_score(-25)
        }
    }
}
// for some reason the events fire twice
scene.onOverlapTile(SpriteKind.Player, assets.image`100_points`, function (sprite, location) {
    change_score(50)
    sprite.setFlag(SpriteFlag.GhostThroughTiles, true)
    popup_text(sprite, "+100")
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
function fade_out (delay: number, block: boolean) {
    color.startFade(color.Black, color.originalPalette, delay)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function save_high_score () {
    if (actual_score > high_scores[mode]) {
        high_scores[mode] = actual_score
    }
    blockSettings.writeNumberArray("high_scores", high_scores)
}
info.onCountdownEnd(function () {
    can_drop = false
    disable_movement(sprite_dropper)
    timer.background(function () {
        while (sprites.allOfKind(SpriteKind.Player).length > 0) {
            pause(100)
        }
        save_high_score()
        while (info.score() != actual_score) {
            pause(100)
        }
        pause(2000)
        game.over(true, effects.confetti)
    })
})
function wait_for_selected () {
    selected = false
    while (!(selected)) {
        pause(100)
    }
    blockMenu.closeMenu()
}
function fade_in (delay: number, block: boolean) {
    color.startFade(color.originalPalette, color.Black, delay)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function make_all_poles () {
    for (let row = 0; row <= tiles.tilemapRows() / 4 - 2; row++) {
        for (let col = 0; col <= tiles.tilemapColumns() / 4 - 2; col++) {
            if (row % 2 == 0) {
                location = tiles.getTileLocation((col + 1) * 4 - 2, (row + 1) * 4 - 1)
            } else {
                location = tiles.getTileLocation((col + 1) * 4 - 1 + 1, (row + 1) * 4 - 1)
            }
            tiles.setTileAt(location, assets.image`pole`)
            tiles.setWallAt(location, true)
        }
    }
}
function disable_movement (dropper: Sprite) {
    controller.moveSprite(dropper, 0, 0)
}
function add_pole (column: number, row: number) {
    tiles.setTileAt(tiles.getTileLocation(column, row), assets.image`partway_through_pole`)
    tiles.setWallAt(tiles.getTileLocation(column, row), true)
    timer.after(100, function () {
        tiles.setTileAt(tiles.getTileLocation(column, row), assets.image`pole`)
        tiles.setWallAt(tiles.getTileLocation(column, row), true)
    })
}
function enable_movement (dropper: Sprite) {
    controller.moveSprite(dropper, 75, 0)
}
function popup_text (sprite: Sprite, text: string) {
    timer.after(50, function () {
        sprite_popup = textsprite.create(text, 0, 15)
        sprite_popup.bottom = sprite.top
        sprite_popup.x = sprite.x
        sprite_popup.vy = -25
        sprite_popup.lifespan = 200
        sprite_popup.setFlag(SpriteFlag.Ghost, true)
    })
}
function make_coin_dropper () {
    sprite_dropper = sprites.create(assets.image`coin_dropper`, SpriteKind.Dropper)
    sprite_dropper.top = 0
    sprite_dropper.x = scene.screenWidth() * 0.33
}
scene.onOverlapTile(SpriteKind.Player, assets.image`30_points`, function (sprite, location) {
    change_score(15)
    sprite.setFlag(SpriteFlag.GhostThroughTiles, true)
    popup_text(sprite, "+30")
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Player, function (sprite, otherSprite) {
    sprite.setVelocity(sprite.vx * -1, sprite.vy * -1)
    otherSprite.setVelocity(otherSprite.vx * -1, otherSprite.vy * -1)
    angle = spriteutils.angleFrom(otherSprite, sprite)
    spriteutils.placeAngleFrom(
    sprite,
    angle,
    6,
    otherSprite
    )
    spriteutils.placeAngleFrom(
    otherSprite,
    angle + 3.14159,
    6,
    sprite
    )
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
function change_score (value: number) {
    actual_score += value
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
blockMenu.onMenuOptionSelected(function (option, index) {
    selected = true
})
scene.onOverlapTile(SpriteKind.Player, assets.image`50_points`, function (sprite, location) {
    change_score(25)
    sprite.setFlag(SpriteFlag.GhostThroughTiles, true)
    popup_text(sprite, "+50")
})
function remove_pole (column: number, row: number) {
    tiles.setTileAt(tiles.getTileLocation(column, row), assets.image`partway_through_pole`)
    tiles.setWallAt(tiles.getTileLocation(column, row), false)
    timer.after(100, function () {
        tiles.setTileAt(tiles.getTileLocation(column, row), assets.image`clear`)
        tiles.setWallAt(tiles.getTileLocation(column, row), false)
    })
}
let angle = 0
let sprite_popup: TextSprite = null
let location: tiles.Location = null
let selected = false
let sprite_dropper: Sprite = null
let can_drop = false
let coins_dropping = 0
let actual_score = 0
let mode = 0
let high_scores: number[] = []
color.setPalette(
color.Black
)
micromaps.createTilemap(micromaps.TileSize.Four, scene.screenWidth() / 4, scene.screenHeight() / 4)
scene.setBackgroundImage(assets.image`background`)
clear_tilemap()
make_map()
make_coin_dropper()
let text_title = make_title_text(sprites.create(assets.image`title_screen`, SpriteKind.Text), 0, 0)
blockMenu.setColors(1, 15)
let in_game = false
if (!(blockSettings.exists("high_scores"))) {
    blockSettings.writeNumberArray("high_scores", [0, 0, 0, 0, 0])
}
high_scores = blockSettings.readNumberArray("high_scores")
let options: string[] = []
options.push("" + high_scores[0] + " pts | Easy (8 coins + 120 secs)")
options.push("" + high_scores[1] + " pts | Regular (4 coins + 60 secs)")
options.push("" + high_scores[2] + " pts | Hard (1 coin + 60 secs)")
options.push("" + high_scores[3] + " pts | Fast (4 coins + 30 secs)")
options.push("Free play (10 coins + infinite time)")
blockMenu.showMenu(options, MenuStyle.List, MenuLocation.BottomHalf)
fade_out(2000, false)
timer.background(function () {
    wait_for_selected()
    text_title.ay = -500
    if (blockMenu.selectedMenuIndex() == 0) {
        info.setScore(200)
        info.startCountdown(120)
    } else if (blockMenu.selectedMenuIndex() == 1) {
        info.setScore(100)
        info.startCountdown(60)
    } else if (blockMenu.selectedMenuIndex() == 2) {
        info.setScore(25)
        info.startCountdown(60)
    } else if (blockMenu.selectedMenuIndex() == 3) {
        info.setScore(100)
        info.startCountdown(30)
    } else if (blockMenu.selectedMenuIndex() == 4) {
        info.setScore(250)
    }
    mode = blockMenu.selectedMenuIndex()
    blockSettings.writeNumber("high-score", high_scores[mode])
    actual_score = info.score()
    coins_dropping = 0
    in_game = true
    can_drop = true
    enable_movement(sprite_dropper)
})
game.onUpdate(function () {
    if (can_drop) {
        if (coins_dropping > 0) {
            disable_movement(sprite_dropper)
        } else {
            enable_movement(sprite_dropper)
        }
    }
})
game.onUpdateInterval(25, function () {
    if (info.score() > actual_score) {
        if (Math.abs(info.score() - actual_score) > 50) {
            info.changeScoreBy(-5)
        } else {
            info.changeScoreBy(-1)
        }
    } else if (info.score() < actual_score) {
        if (Math.abs(info.score() - actual_score) > 50) {
            info.changeScoreBy(5)
        } else {
            info.changeScoreBy(1)
        }
    }
})
forever(function () {
    pause(1000)
    if (in_game) {
        if (Math.percentChance(10)) {
            for (let row = 0; row <= tiles.tilemapRows() / 4 - 2; row++) {
                for (let col = 0; col <= tiles.tilemapColumns() / 4 - 2; col++) {
                    if (row % 2 == 0) {
                        location = tiles.getTileLocation((col + 1) * 4 - 2, (row + 1) * 4 - 1)
                    } else {
                        location = tiles.getTileLocation((col + 1) * 4 - 1 + 1, (row + 1) * 4 - 1)
                    }
                    if (Math.percentChance(75)) {
                        if (tiles.tileAtLocationEquals(location, assets.image`clear`)) {
                            add_pole(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
                        }
                    } else {
                        if (tiles.tileAtLocationEquals(location, assets.image`pole`)) {
                            remove_pole(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
                        }
                    }
                    pause(100)
                }
            }
        }
    }
})
forever(function () {
    if (in_game) {
        if (actual_score < 25 && sprites.allOfKind(SpriteKind.Player).length == 0) {
            info.stopCountdown()
            can_drop = false
            disable_movement(sprite_dropper)
            while (info.score() != actual_score) {
                pause(100)
            }
            pause(2000)
            game.over(false, effects.melt)
        }
    }
    pause(1000)
})
