const myCanvas = document.getElementById("myCanvas");
const context = myCanvas.getContext("2d");

const sizeX = 20;
const sizeY = 10;

let snakeHead = {
  x: 0,
  y: 0,
};
let snakeBody = [];
//Creando el alimento de la cerpiente

let food = null;

let dx = 0;
let dy = 0;

//esta variable toma como valor el ultimo eje en el que se mueve la serpiente

let lastAxis;

//este codigo genera un rectangulo que tiene su inicio en las coordenadas 0,0 y termina en 20,20

//Creo una funcion que recibe snakeHead y size como tamaño de la snake
const drawObject = (obj, color) => {
  context.fillStyle = color;

  context.fillRect(obj.x, obj.y, sizeX, sizeY);
};

//creando la posicion del alimento

const getRandomX = () => {
  let resu = parseInt(Math.random() * 15) * 20;
  return resu;
};

const getRandomY = () => {
  let resu = parseInt(Math.random() * 8) * 20;
  return resu;
};

//pint los elementos
const draw = () => {
  //define un color de fondo
  context.fillStyle = "black";

  context.fillRect(0, 0, myCanvas.width, myCanvas.height);
  //cabeza de la serpiente con su color
  drawObject(snakeHead, "lime");
  //alimento con su color
  drawObject(food, "white");
  //cuerpo de la cerpiente con su color
  snakeBody.forEach((elem) => drawObject(elem, "navy"));
};

//esta funcion guarda la posicion previa de la cabeza para agregarla como cuerpo
const increaseSnakeSize = (prevX, prevY) => {
  snakeBody.push({ x: prevX, y: prevY });
};

const gameOver = () => {
  alert("has perdido");
  snakeHead.x = 0;
  snakeHead.y = 0;
  dx = 0;
  dy = 0;
  snakeBody = [];
};

const checkSnakeCollision = () => {
  //la colision de la cabeza con su propio cuerpo se va a dar cuando las coor de la cabeza sea igual a las de algun elemento del cuerpo

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeHead.x == snakeBody[i].x && snakeHead.y == snakeBody[i].y) {
      return true;
    }
  }

  //Verificar que la serpiente no se salga de los limites
  const topCollision = snakeHead.y < 0;
  const bottomCollision = snakeHead.y > 140;
  const leftCollision = snakeHead.x < 0;
  const rightCollision = snakeHead.x > 280;

  if (topCollision || bottomCollision || leftCollision || rightCollision) {
    return true;
  }

  return false;
};

const checkFoodCollision = (position) => {
  //compara las coordenadas del alimento generado con el cuerpo de la serpiente
  for (let i = 0; i < snakeBody.length; i++) {
    if (position.x == snakeBody[i].x && position.y == snakeBody[i].y) {
      return true;
    }
  }

  //compara las coordenadas del alimento generado con la cabeza de la serpiente!!
  if (position.x == snakeHead.x && position.y == snakeHead.y) {
    return true;
  }
};

const randomFoodPosition = () => {
  let position;
  do {
    position = { x: getRandomX(), y: getRandomY() };
  } while (checkFoodCollision(position));
  return position;
};

const update = () => {
  const youLose = checkSnakeCollision();
  if (youLose) {
    gameOver();
    console.log("perdiste");
    return;
  }

  //guardar la posicion previa del ultimo elemento de serpiente para agregarla como parte del cuerpo al consumir un alimento
  let prevX, prevY;

  if (snakeBody.length >= 1) {
    prevX = snakeBody[snakeBody.length - 1].x;
    prevY = snakeBody[snakeBody.length - 1].y;
  } else {
    prevX = snakeHead.x;
    prevY = snakeHead.y;
  }

  //hace que el cuerpo de la cerpiente siga a la cabeza

  for (let i = snakeBody.length - 1; i >= 1; i--) {
    snakeBody[i].x = snakeBody[i - 1].x;
    snakeBody[i].y = snakeBody[i - 1].y; // elem 1 <- elem 0(el elemento 1 recibe la posicion anterior)
  }
  if (snakeBody.length >= 1) {
    snakeBody[0].x = snakeHead.x;
    snakeBody[0].y = snakeHead.y;
  }

  //actualiza las coordenadas de la cabeza de la serpiente
  snakeHead.x += dx;
  snakeHead.y += dy;

  if (dx !== 0) {
    lastAxis = "X";
  } else if (dy !== 0) {
    lastAxis = "Y";
  }

  //genera el alimento en caso de que no exista

  if (food == null) {
    food = randomFoodPosition();
    console.log(food);
    console.log(snakeHead);
  }

  //detecta si la cabeza de la serpiente consumio el alimento

  if (snakeHead.x === food.x && snakeHead.y === food.y) {
    console.log("consumio el alimento");
    food = {
      x: getRandomX(),
      y: getRandomY(),
    };
    //aumentar el tamanio de la serpiente
    increaseSnakeSize(prevX, prevY);
  }
};

const main = () => {
  //Esta funcion se encarga de actualizar los valores de las variables
  update();
  //va adibujar de acuerdo a la informacion que arroje update()
  draw();
};

//necesitamos escuchar cuando se precione una tecla

const moveSnake = (event) => {
  //los if restringen el movimiento sobre el mismo eje para que la serpiente no pueda vovlerse sobre su mismo cuerpo
  switch (event.key) {
    case "ArrowUp":
      console.log("mover hacia arriba");
      if (dy == 0) {
        dx = 0;
        dy = -sizeY;
      }
      break;
    case "ArrowDown":
      console.log("mover hacia abajo");
      if (dy == 0) {
        dx = 0;
        dy = +sizeY;
      }
      break;
    case "ArrowRight":
      console.log("mover hacia derecha");
      if (dx == 0) {
        dx = +sizeX;
        dy = 0;
      }

      break;
    case "ArrowLeft":
      console.log("mover hacia izquierda");
      if (dx == 0) {
        dx = -sizeX;
        dy = 0;
      }
      break;
  }
};

setInterval(main, 150);
document.addEventListener("keydown", moveSnake);
