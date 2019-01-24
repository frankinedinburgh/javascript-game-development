const InitChallenge = (function (){
	const canvas = document.getElementById('myCanvas');
	let ctx = canvas.getContext('2d')
	let x = (canvas.width / 2) + Math.floor(Math.random() * 21) - 10;
	let y = (canvas.height - 30) + Math.floor(Math.random() * 21) - 10;
	let dx = 3;
	let dy = -3;
	let ballRadius = 10;
	let paddleHeight = 10;
	let paddleWidth = 75;
	let paddleX = (canvas.width - paddleWidth) / 2;
	let rightPressed = false;
	let leftPressed = false;
	let brickRowCount = 3;
	let brickColCount = 5;
	let brickWidth = 75;
	let brickHeight = 20;
	let brickPadding = 10;
	let brickOffsetTop = 30;
	let brickOffsetLeft = 30;
	let score = 0;
	let lives = 5;
	let level = 1;
	let maxLevel = 5;
	let paused = false;

	let bricks = [];


	function initBricks(){
		for (let c = 0; c < brickColCount; c++) {
			bricks[ c ] = [];
			for (let r = 0; r < brickRowCount; r++) {
				bricks[ c ][ r ] = {x: 0, y: 0, status: 1};
			}
		}
	}

	function keyDownHandler(e){
		if (e.which === 37 || e.code === "ArrowLeft") {
			leftPressed = true;
		} else if (e.which === 39 || e.code === "ArrowRight") {
			rightPressed = true;
		}
	}

	function keyUpHandler(e){
		if (e.which === 37 || e.code === "ArrowLeft") {
			leftPressed = false;
		} else if (e.which === 39 || e.code === "ArrowRight") {
			rightPressed = false;
		}
	}

	function mouseMoveHandler(e){
		let relativeX = e.clientX - canvas.offsetLeft;
		console.log('paddleX => ' + (paddleWidth / 2));


		if (relativeX > 0 + (paddleWidth / 2) && relativeX < (canvas.width - (paddleWidth / 2))) {
			paddleX = relativeX - (paddleWidth / 2)
		}
	}

	function drawBall(){
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = "#0009DD";
		ctx.fill();
		ctx.closePath()
	}

	function collisionDetection(){
		for (let c = 0; c < brickColCount; c++) {
			for (let r = 0; r < brickRowCount; r++) {
				let b = bricks[ c ][ r ];
				if (b.status === 1) {

					if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
						console.log(bricks[ c ][ r ])
						dy = -dy;
						b.status = 0;
						score++;

						if (score === (brickRowCount * brickColCount)) {
							if (level === maxLevel) {
								alert('CONGRATULATIONS!!!!')
								document.location.reload();
							} else {
								level++;
								brickRowCount++;
								initBricks();
								score = 0;
								dx += 1;
								dy = -dy;
								dy -= 1;
								x = (canvas.width / 2) + Math.floor(Math.random() * 21) - 10;
								y = (canvas.height - 30) + Math.floor(Math.random() * 21) - 10;
								paddleX = (canvas.width - paddleWidth) / 2;
								paused = true;

								ctx.beginPath()
								ctx.rect(0, 0, canvas.width, canvas.height);
								canvas.fillStyle = '#0095dd';
								ctx.fill();
								ctx.font = "16px Arial";
								ctx.fillStyle = "#ffffff";
								ctx.fillText("Level " + (level - 1) + " completed, starting next level ...", 110, 150)
								ctx.closePath();
								setTimeout(function (){
									paused = false;
									draw()
								}, 3000)
							}
						}
					}
				}
			}
		}
	}

	function drawPaddle(){
		ctx.beginPath()
		ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
		ctx.fillStyle = "#0009DD";
		ctx.fill();
		ctx.closePath()
	}

	function drawBricks(){

		for (let c = 0; c < brickColCount; c++) {
			for (let r = 0; r < brickRowCount; r++) {
				if (bricks[ c ][ r ].status === 1) {
					let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
					let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
					bricks[ c ][ r ].x = brickX;
					bricks[ c ][ r ].y = brickY;
					ctx.beginPath()
					ctx.rect(brickX, brickY, brickWidth, brickHeight);
					ctx.fillStyle = "#0009DD";
					ctx.fill();
					ctx.closePath()
				}
			}
		}
	}

	function drawScore(){
		ctx.font = "18px Arial";
		ctx.fillStyle = "#0009DD";
		ctx.fillText("Score: " + score, 8, 20);
	}

	function drawLevel(){
		ctx.font = "18px Arial";
		ctx.fillStyle = "#0009DD";
		ctx.fillText("Level: " + level, canvas.width - 85, 20);
	}

	function drawLives(){
		ctx.font = "18px Arial";
		ctx.fillStyle = "#0009DD";
		ctx.fillText("Lives: " + lives, (canvas.width / 2) - 30, 20);
	}

	function reset(){
		x = (canvas.width / 2) + Math.floor(Math.random() * 21) - 10;
		y = (canvas.height - 30) + Math.floor(Math.random() * 21) - 10;
		paddleX = (canvas.width - paddleWidth) / 2;
	}

	function draw(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBall();
		drawPaddle();
		drawBricks();
		drawScore();
		drawLives();
		drawLevel();
		collisionDetection();


		if ((y + dy) > (canvas.height - ballRadius)) {
			if ((x > paddleX) && (x < paddleX + paddleWidth)) {
				dy = -dy;
			} else {
				lives--;
				if (!lives) {
					alert("Game Over")
					document.location.reload();
				} else {
					reset()
				}
			}
		}

		// y + dy = centre of the ball
		if ((y + dy < (0 + ballRadius)) /*|| (y + dy > canvas.height - ballRadius)*/) {
			dy = -dy;
		}

		if ((x + dx < (0 + ballRadius)) || (x + dx > (canvas.width - ballRadius))) {
			dx = -dx;
		}

		if (rightPressed && (paddleX < canvas.width - paddleWidth)) {
			paddleX += 7;
		} else if (leftPressed && (paddleX > 0)) {
			paddleX -= 7;
		}

		x += dx;
		y += dy;
		if (!paused) {
			requestAnimationFrame(draw)
		}
	}

	return {
		init: function (){
			initBricks();
			draw();
		},
		press: function (){
			document.addEventListener("keydown", keyDownHandler)
			document.addEventListener("keyup", keyUpHandler)
			document.addEventListener("mousemove", mouseMoveHandler)
		}
	}
})();


InitChallenge.init();
InitChallenge.press();


