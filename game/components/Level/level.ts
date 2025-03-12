// import Character from "../Character/Character";
// import * as levelCSS from "./levelCSS"
import * as levelGen from "./levelGen";

var playerCharacter
var myObstacle
var gameArea = {
    canvas : document.createElement("canvas"),
    context: null as CanvasRenderingContext2D | null,
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 30);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


function startGame() {
    playerCharacter = new component(20, 30, "red", 64, 128)
    gameArea.start();
}



function component(width: Number, height: Number, color: String, x: Number, y: Number) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        const ctx = gameArea.context;
        if (ctx) { // Check if ctx is defined
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    
}

function updateGameArea() {
    gameArea.clear();
    console.log("Updating")
    // myObstacle.update();
    playerCharacter.newPos();    
    playerCharacter.update();
}

// export default function Level() {
//     const [characterPos, setCharacterPos] = useState({ x: 0, y: 0, size: 0 });
//     const [isMoving, setIsMoving] = useState(false);
//     const [isFalling, setIsFalling] = useState(true);

//     const updateCharacterPosition = () => {
//         const doorElement = document.getElementById("door");
//         if (doorElement) {
//             const rect = doorElement.getBoundingClientRect();
//             setCharacterPos({ x: rect.x, y: rect.y, size: rect.width });
//         }
//     };

//     useEffect(() => {
//         updateCharacterPosition();
//         window.addEventListener("resize", updateCharacterPosition);
//         return () => window.removeEventListener("resize", updateCharacterPosition);
//     }, []);

//     useEffect(() => {
//         if (!isMoving) return;

//         const moveCharacter = setInterval(() => {
//             const characterElement = document.getElementById("character");
//             if (!characterElement) return;

//             const rect = characterElement.getBoundingClientRect();
//             const nextY = rect.y + 5;
//             const belowTile = document.elementFromPoint(rect.x + 5, nextY + rect.height);
//             if (belowTile && belowTile.id) {
//                 setIsFalling(false);
//             } else {
//                 setIsFalling(true);
//                 setCharacterPos(prev => ({ ...prev, y: prev.y + 5 }));
//                 return;
//             }

//             if (!isFalling) {
//                 const nextX = rect.x + 5;
//                 const frontTile = document.elementFromPoint(nextX + rect.width, rect.y + rect.height / 2);

//                 if (!frontTile || !frontTile.id) {
//                     setCharacterPos(prev => ({ ...prev, x: prev.x + 5 }));
//                 }
//             }
//         }, 1000 / 60);

//         return () => clearInterval(moveCharacter);
//     }, [isMoving, isFalling]);


//     return (
//         <div
//             id="grid"
//             onClick={() => setIsMoving(true)}
//             style={{

//                 gridTemplateColumns: `repeat(${levelData[0].length}, 1fr)`,
//                 gridTemplateRows: `repeat(${levelData.length}, 1fr)`,
//             }}
//         >
//             {levelData.flat().map((tile, index) => (
//                 <div
//                     id={tile === Tiles.Door ? "door" : tile !== Tiles.Blank ? `tile-${index}` : undefined}
//                     className="tile"
//                     key={index}
//                     style={{
//                         backgroundColor: tile === Tiles.Floor ? "red" : tile === Tiles.Door ? "yellow" : tile === Tiles.Exit ? "blue" : "transparent",
//                         border: tile === Tiles.Blank ? "none" : "1px solid black",
//                     }}
//                 />
//             ))}
//             <Character position={characterPos} />
//         </div>
//     );
// };