// A ideia desse pequeno projeto é tentar replicar o jogo Tetris da maneira
// mais simples e intuitiva que eu conseguir pensar, tentando pensar o raciocínio
// lógico do desenvolvimento por conta própria, e só recorrer a algum auxílio ou 
// função mais elaborada quando estritamente necessário.
// Bruno de Oliveira Jucá.

var canvas = document.getElementById("GameCanvas");
var ctx = canvas.getContext("2d");
ctx.scale(30,30); // Considera o tabuleiro como 10x20 px.

var timeLast = Date.now(), timeNow, refreshTime = 1000; // Controle do tempo de atualização (ms).

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
	        [0,5,5]],
	color: 'blue',
	size: 3
}

const blockL = {
	shape: [[0,6,0],
		    [0,6,0],
	        [6,6,0]],
	color: 'orange',
	size: 3
}

const blockI = {
	shape: [[7,7,7,7],
		    [0,0,0,0],
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

function fillNewBlock(blockType) {

	for (var i = 0; i < blockType.shape.length; i++)
		for (var j = 0; j < blockType.shape.length; j++) {
			newBlock.shape[i][j] = blockType.shape[i][j];
			newBlock.shadow[i][j] = blockType.shape[i][j];
		}
	newBlock.color = blockType.color;
	newBlock.size = blockType.size;
	newBlock.x = 4;
	newBlock.y = 0;
	newBlock.rightClear = true;
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

	fillNewBlock(selectRandomBlock());
}

// A função abaixo desenha o bloco que está vindo 
// com base na sua posição (x,y).

function drawBlock() {

	ctx.beginPath();
	ctx.fillStyle = newBlock.color;
	for (var i = 0; i < newBlock.size; i++) {
		for (var j = 0; j < newBlock.size; j++) {
			if (newBlock.shape[i][j] != 0) {
				ctx.fillRect(newBlock.x+j, newBlock.y+i, 1, 1);
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
	for (var i = 0; i < 20; i++) {
		for (var j = 1; j < 11; j++) {
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
		}
	}
	ctx.closePath();

}

// Essa função só é ativada pelas teclas do teclado e confere ao bloco
// os movimentos de translação e rotação.

function updateBlock(event) {
	switch (event.keyCode) {
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
					if (newBlock.shape[i][j] != 0 && board[newBlock.size-j-1+newBlock.y][i+newBlock.x+1] != 0)
						return false;
				break;
			}
		}
	return true;	
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
		fillNewBlock(selectRandomBlock());
	}
	else 
		restart();	
}

//Abaixo inicia-se o processo geral de desenhar
//tudo repetidamente no canvas

function draw() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	timeNow = Date.now(); // Define o tempo a todo momento
	drawBoard();
	drawBlock();
	if (timeNow - timeLast > refreshTime) { // Move o bloco se o tempo de atualizar for atingido
		if (isClear('down'))
			newBlock.y += newBlock.dy;
		else
			update();
		timeLast = Date.now(); // "Reseta" o tempo da última atualização
	}
	requestAnimationFrame(draw);
}
restart();
requestAnimationFrame(draw);

// O EventListener a seguir vai checar 
// constantemente as teclas pressionadas
document.addEventListener('keydown', updateBlock);