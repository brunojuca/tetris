// A ideia desse pequeno projeto é tentar replicar o jogo Tetris da maneira
// mais simples e intuitiva que eu conseguir pensar, tentando pensar o raciocínio
// lógico do desenvolvimento por conta própria, e só recorrer a algum auxílio ou 
// função mais elaborada quando estritamente necessário.
// Bruno de Oliveira Jucá.

var canvas = document.getElementById("GameCanvas");
var ctx = canvas.getContext("2d");

function arredonda20(n) { // Função para arredondar o tamanho do canvas e ficar com gráfico ok.
	n = n-20;
	while (n % 20 != 0)
		n--;
	return n;
}

canvas.height = arredonda20(window.innerHeight);
canvas.width = canvas.height/2;

ctx.scale(canvas.width/10,canvas.width/10); // Considera o tabuleiro como 10x20 px.

var bs = 0.03; //border size.
var bc = '#dddddd' //border color.

var score = 0;
var pointValue = 10;
var level = 1;
var refreshTime = 1000;
var inicialRefreshTime = 1000;
var linesCleared = 0;

var timeLast = Date.now(), timeNow; // Controle do tempo de atualização (ms).

var board;

const blockO = {
	shape: [[1,1,0],
		    [1,1,0],
	        [0,0,0]],
	color: 'yellow',
	size: 2
}

const blockT = {
	shape: [[0,2,0],
		    [2,2,2],
	        [0,0,0]],
	color: 'purple',
	size: 3
}

const blockS = {
	shape: [[0,3,3],
		    [3,3,0],
	        [0,0,0]],
	color: 'green',
	size: 3
}

const blockZ = {
	shape: [[4,4,0],
		    [0,4,4],
	        [0,0,0]],
	color: 'red',
	size: 3
}

const blockJ = {
	shape: [[0,5,0],
		    [0,5,0],
	        [5,5,0]],
	color: 'blue',
	size: 3
}

const blockL = {
	shape: [[0,6,0],
		    [0,6,0],
	        [0,6,6]],
	color: 'orange',
	size: 3
}

const blockI = {
	shape: [[0,0,0,0],
		    [7,7,7,7],
	        [0,0,0,0],
	        [0,0,0,0]],
	color: 'cyan',
	size: 4
}

var newBlock = {
	shape: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], // Por não conseguir criar um array com
	shadow: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],// tamanho a se definir depois, criei dessa
	color: '',										  // forma e usei o "size" para passar o
	x:4,           									  // tamanho de cada bloco.
	y:0,
	dy: 1,
	size: 0,
	rightClear: true
}

var nextBlock = {
	shape: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], // Por não conseguir criar um array com
	shadow: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],// tamanho a se definir depois, criei dessa
	color: '',										  // forma e usei o "size" para passar o
	x:4,           									  // tamanho de cada bloco.
	y:0,
	dy: 1,
	size: 0,
	rightClear: true
}

// A função a seguir seleciona e retorna "aleatoriamente" um bloco
// para ser usado na função fillNewBlock.

function selectRandomBlock() {
	switch (Math.floor(Math.random()*7)) {
		case 0:
			return blockO;
		break;

		case 1:
			return blockT;
		break;

		case 2:
			return blockS;
		break;

		case 3:
			return blockZ;
		break;

		case 4:
			return blockJ;
		break;

		case 5:
			return blockL;
		break;

		case 6:
			return blockI;
		break;

	}
}

// A função a seguir recebe um tipo de bloco e preenche o objeto
// referente ao bloco que está vindo. Provavelmente existe uma
// forma mais fácil de fazer esse processo, mas assim funcionou.

function fillNewBlock(blockType, blockWanted) {

	for (var i = 0; i < blockType.shape.length; i++)
		for (var j = 0; j < blockType.shape.length; j++) {
			blockWanted.shape[i][j] = blockType.shape[i][j];
			blockWanted.shadow[i][j] = blockType.shape[i][j];
		}
	blockWanted.color = blockType.color;
	blockWanted.size = blockType.size;
	blockWanted.x = 4;
	blockWanted.y = 0;
	blockWanted.rightClear = true;
}

// A função a seguir (re)inicia o jogo.

function restart() {

	board =    [[1,0,0,0,0,0,0,0,0,0,0,1], // Inicialmente dessa forma para melhor visualização.
				[1,0,0,0,0,0,0,0,0,0,0,1],
		      	[1,0,0,0,0,0,0,0,0,0,0,1],
			  	[1,0,0,0,0,0,0,0,0,0,0,1],
			  	[1,0,0,0,0,0,0,0,0,0,0,1],
			  	[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]];

	refreshTime = inicialRefreshTime;
	score = 0;
	level = 1;
        linesCleared = 0;
	fillNewBlock(selectRandomBlock(), newBlock);
	fillNewBlock(selectRandomBlock(), nextBlock);
}

// A função abaixo desenha o placar

function drawScore() {

	ctx.beginPath();
	ctx.fillStyle = 'grey';
	ctx.font = "0.7px Courier";
	ctx.fillText("Score: " + score , 0.1, 0.7);
	ctx.fillText("Level: " + level , 0.1, 1.6);
	ctx.closePath();

}

function drawNextBlock() { // Copiada de drawBlock. Alterar para função única depois.
	ctx.beginPath();

	for (var i = 0; i < nextBlock.size; i++) {
		for (var j = 0; j < nextBlock.size; j++) {
			if (nextBlock.shape[i][j] != 0) {
				ctx.fillStyle = nextBlock.color;
				ctx.fillRect(8+j*0.4, 0.3+i*0.4, 0.4, 0.4);

				ctx.fillStyle = bc; // Desenha a borda dos blocos.
				ctx.fillRect(8+j*0.4, 0.3+i*0.4, bs, 0.4);
				ctx.fillRect(8+j*0.4, 0.3+i*0.4, 0.4, bs);
				ctx.fillRect(8+(j+1-bs)*0.4, 0.3+i*0.4, bs, 0.4);
				ctx.fillRect(8+j*0.4, 0.3+(i+1-bs)*0.4, 0.4, bs);
			}
		}
	}
	ctx.closePath();
}


// A função abaixo desenha o bloco que está vindo 
// com base na sua posição (x,y).

function drawBlock() {

	ctx.beginPath();
	for (var i = 0; i < newBlock.size; i++) {
		for (var j = 0; j < newBlock.size; j++) {
			if (newBlock.shape[i][j] != 0) {
				ctx.fillStyle = newBlock.color;
				ctx.fillRect(newBlock.x+j, newBlock.y+i, 1, 1);

				ctx.fillStyle = bc; // Desenha a borda dos blocos.
				ctx.fillRect(newBlock.x+j, newBlock.y+i, bs, 1);
				ctx.fillRect(newBlock.x+j, newBlock.y+i, 1, bs);
				ctx.fillRect(newBlock.x+j+1-bs, newBlock.y+i, bs, 1);
				ctx.fillRect(newBlock.x+j, newBlock.y+i+1-bs, 1, bs);
			}
		}
	}
	ctx.closePath();
}

// A função a seguir desenha o tabuleiro. Por utilizar uma camada externa
// com "1" para representar a borda, os índices para referenciar x e y 
// ficaram um pouco confusos. Arrumar isso quando possível. Além disso, não
// estou satisfeito com o jeito de preencher o tabuleiro por causa das cores.
// Alterar isso também.
 
function drawBoard() {

	ctx.beginPath();
	for (var i = 0; i < 21; i++) {
		for (var j = 0; j < 12; j++) {
			if (board[i][j] == 1) {
				ctx.fillStyle = blockO.color;
				ctx.fillRect(j-1, i, 1, 1);
			}
			else if (board[i][j] == 2) {
				ctx.fillStyle = blockT.color
				ctx.fillRect(j-1, i, 1, 1);
			}
			else if (board[i][j] == 3) {
				ctx.fillStyle = blockS.color
				ctx.fillRect(j-1, i, 1, 1);
			}
			else if (board[i][j] == 4) {
				ctx.fillStyle = blockZ.color
				ctx.fillRect(j-1, i, 1, 1);
			}
			else if (board[i][j] == 5) {
				ctx.fillStyle = blockJ.color
				ctx.fillRect(j-1, i, 1, 1);
			}
			else if (board[i][j] == 6) {
				ctx.fillStyle = blockL.color
				ctx.fillRect(j-1, i, 1, 1);
			}
			else if (board[i][j] == 7) {
				ctx.fillStyle = blockI.color
				ctx.fillRect(j-1, i, 1, 1);
			}

			ctx.fillStyle = bc; // Desenha a borda dos blocos.
			ctx.fillRect(j-1, i, bs, 1);
			ctx.fillRect(j-1, i, 1, bs);
			ctx.fillRect(j-1+1-bs, i, bs, 1);
			ctx.fillRect(j-1, i+1-bs, 1, bs);
		}
	}
	ctx.closePath();

}

// Essa função só é ativada pelas teclas do teclado e confere ao bloco
// os movimentos de translação e rotação.

function updateBlock(movement) {
	switch (movement) {
		case 37: // Move o bloco para a esquerda.
				if (isClear('left'))
					newBlock.x--;
			break;
		case 39: // Move o bloco para a direita.
				if (isClear('right'))
					newBlock.x++;
			break;
		case 40: // Acelera a queda do bloco.
				if (isClear('down'))
					newBlock.y++;
			break;
		case 38: // Gira o bloco no sentido horário.
				if (isClear('rotation')) {
					for (var i = 0; i < newBlock.size; i++)
						for (var j = 0; j < newBlock.size; j++)
							newBlock.shape[i][j] = newBlock.shadow[newBlock.size-j-1][i]; // Método para girar no sentido horário uma matriz NxN.
					for (var i = 0; i < newBlock.size; i++)
						for (var j = 0; j < newBlock.size; j++)
							newBlock.shadow[i][j] = newBlock.shape[i][j]; // Faz o shadow do bloco acompanha-lo para facilitar a rotação. (Realmente necessário?)
				}
			break;
		case 32:
				refreshTime = 1;
			break;
	}
}

// A função a seguir "olha" para os lados do bloco (menos para cima) e garante
// que ele possa se mover do jeito que o argumento de entrada pede (retorna true).
// Se não for possível ela retorna false. Atualmente ela testa cada case em todas
// as iterações, mudar se possível.(De um jeito simples eu acho que daria para jogar
// o loop de for para dentro de cada caso, mas isso alongaria o texto, já que 
// ainda não bolei um jeito de facilitar esse loop).

function isClear(side) {
	for (var i = 0; i < newBlock.size; i++)
		for (var j = 0; j < newBlock.size; j++) {
			switch (side) {
				case 'right': // Checa a direita.
					if (newBlock.shape[i][j] != 0 && board[i+newBlock.y][j+newBlock.x+2] != 0)
						return false;
				break;

				case 'left': // Checa a esquerda.
					if (newBlock.shape[i][j] != 0 && board[i+newBlock.y][j+newBlock.x] != 0)
						return false;
				break;

				case 'down': // Checa em baixo.
					if (newBlock.shape[i][j] != 0 && board[i+newBlock.y+1][j+newBlock.x+1] != 0)
						return false;
				break;

				case 'rotation': // Checa se é possível girar no sentido horário.
					if (board[i+newBlock.y][j+newBlock.x+1] != 0 && newBlock.shape[newBlock.size-j-1][i] != 0)
						return false;
				break;
			}
		}
	return true;	
}

// A função abaixo checa constantemente se alguma linha está preenchida.
// Se sim, ela remove aquela linha e adiciona uma nova no começo do tabuleiro. 

function rowCheck () {
	let rown = 0;
	for (var i = 0; i < board.length-1; i++)
		for (var j = 0; j < board[0].length; j++) {
			if (board[i][j] == 0)
				break;
			else
				if (j == 11) {
					board.splice(i, 1);
					board.unshift([1,0,0,0,0,0,0,0,0,0,0,1]);
					rown++;
					linesCleared++;
					if (linesCleared == 10*level)
						level++;
				}
		}
	score += 10*rown*rown*level;
}

// A função abaixo é ativada somente a cada refreshTime, e somente se o bloco
// se encaixar, passando os dados de preenchimento do bloco para o tabuleiro
// e chamando um novo bloco. Também trata o caso do bloco nao ter mais espaço
// dando restart.

function update() {

	if ((newBlock.y-1) >= 0) { 
		for (var i = 0; i < newBlock.size; i++)
			for (var j = 0; j < newBlock.size; j++)
					if (newBlock.shape[i][j] != 0)
						board[i+newBlock.y][j+newBlock.x+1] = newBlock.shape[i][j];
	if (refreshTime != 100)
		refreshTime = inicialRefreshTime-(level*100);
	fillNewBlock(nextBlock, newBlock);
	fillNewBlock(selectRandomBlock(), nextBlock);
	}
	else {
                alert('Your Score is ' + score);
		restart();
        }	
}

//Abaixo inicia-se o processo geral de desenhar
//tudo repetidamente no canvas

function draw() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	timeNow = Date.now(); // Define o tempo a todo momento
	rowCheck();
	drawBoard();
	drawBlock();
	drawNextBlock();
	drawScore();
	if (timeNow - timeLast > refreshTime) { // Move o bloco se o tempo de atualizar for atingido
		if (isClear('down'))
			newBlock.y += newBlock.dy;
		else
			update();
		timeLast = Date.now(); // "Reseta" o tempo da última atualização.
	}
	requestAnimationFrame(draw);
}
restart();
requestAnimationFrame(draw);

// O EventListener a seguir vai checar 
// constantemente as teclas pressionadas.

document.addEventListener('keydown', function(event) {
	updateBlock(event.keyCode);
});

// A parte abaixo trata de gestos touch. A maior parte do código
// eu imortei de um repositório no github, mas ainda precisei
// fazer algumas adaptações.

let touchstartX = null;
let touchstartY = null;
let touchendX = null;
let touchendY = null;
let newtouchmoveX = null;
let newtouchmoveY = null;
let oldtouchmoveX = null;


document.addEventListener('touchmove', function(event) {
	event.preventDefault();
	newtouchmoveX = event.changedTouches[0].screenX;
	newtouchmoveY = event.changedTouches[0].screenY;
	touchendY = null;
	handleGesture();
}, false, { passive: false });

document.addEventListener('touchstart', function(event) {
	event.preventDefault();
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
    oldtouchmoveX = touchstartX;
    touchendY = null;

}, false, { passive: false });

document.addEventListener('touchend', function(event) {
	event.preventDefault();
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture();
}, false, { passive: false }); 

function handleGesture() {

	if (touchendY === touchstartY) {
       updateBlock(38); // Toque
       touchstartY = null;
       touchendY = 0;
    }

    else if (newtouchmoveX+50 < oldtouchmoveX &&  (Math.abs(touchstartX - newtouchmoveX)) > (Math.abs(touchstartY - newtouchmoveY))) {
        oldtouchmoveX = newtouchmoveX;
        updateBlock(37); // Esquerda
    }
    
    else if (newtouchmoveX-50 > oldtouchmoveX && (Math.abs(touchstartX - newtouchmoveX)) > (Math.abs(touchstartY - newtouchmoveY))) {
        oldtouchmoveX = newtouchmoveX;
        updateBlock(39); // Direita
    }
    
    else if (touchendY < touchstartY && (Math.abs(touchstartX - touchendX)) < (Math.abs(touchstartY - touchendY))) {
        console.log('Swiped up'); // Cima
    }
    
    else if (touchendY > touchstartY && (Math.abs(touchstartX - touchendX)) < (Math.abs(touchstartY - touchendY))) {
       updateBlock(32); // Baixo
    }
}
