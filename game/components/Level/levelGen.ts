export const TILE_SIZE = 64;

// Tile types
export enum Tiles {
    Door = "Door",
    Exit = "Exit",
    Blank = "Blank",
    Trap = "Trap",
    Floor = "Floor"
}


// Level layout
export const levelData = [
    [Tiles.Floor, Tiles.Door, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor,],
    [Tiles.Floor, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Floor,],
    [Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Blank, Tiles.Floor, Tiles.Floor,],
    [Tiles.Floor, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Floor,],
    [Tiles.Floor, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Blank, Tiles.Exit, Tiles.Blank, Tiles.Blank, Tiles.Floor,],
    [Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor, Tiles.Floor,],
];
