var firstPlayer;
var secondPlayer;
var firstPlayerTitle;
var secondPlayerTitle;
var firstPlayerTurn;
var secondPlayerTurn;
var computerTurn;

function HouseButtonActive() {
	if (firstPlayerTurn) {
		document.getElementById("title").innerHTML = "輪到" + firstPlayerTitle;
		for (var i = firstPlayer - 6; i < firstPlayer; ++i) {
			if (document.getElementById("house" + i.toString()).innerHTML != 0)
				document.getElementById("house" + i.toString()).disabled = false;
			else
				document.getElementById("house" + i.toString()).disabled = true;
		}

		for (var i = secondPlayer - 6; i < secondPlayer; ++i)
			document.getElementById("house" + i.toString()).disabled = true;

	}
	else if (secondPlayerTurn && !computerTurn) {
		document.getElementById("title").innerHTML = "輪到" + secondPlayerTitle;
		for (var i = firstPlayer - 6; i < firstPlayer; ++i) 
			document.getElementById("house" + i.toString()).disabled = true;

		for (var i = secondPlayer - 6; i < secondPlayer; ++i){
			if (document.getElementById("house" + i.toString()).innerHTML != 0)
				document.getElementById("house" + i.toString()).disabled = false;
			else
				document.getElementById("house" + i.toString()).disabled = true;
		}
	}
	else {
		document.getElementById("title").innerHTML = "輪到" + secondPlayerTitle;

		for (var i = 0; i < 14; ++i) {
			if (i != 6 && i != 13)
				document.getElementById("house" + i.toString()).disabled = true;
		}

		setTimeout(function() {
			var action = MinMaxDecision(parseInt(document.getElementById("depth").value));
			HouseOnClick(action);
		}, 100);
	}
}

function HouseOnClick(pickedHouse) {
	var house = [];

	for (var i = 0; i < 14; ++i) {
		house[i] = parseInt(document.getElementById("house" + i.toString()).innerHTML);
	}
	console.log(house);
	console.log(pickedHouse);

	var again = Relocation(house, pickedHouse);
	console.log(house);

	for (var i = 0; i < 14; ++i) {
		document.getElementById("house" + i.toString()).innerHTML = house[i];
	}

	if (again == false) {
		firstPlayerTurn = !firstPlayerTurn;
		secondPlayerTurn = !secondPlayerTurn;
	}

	if (HasSuccessors(house)) {
		HouseButtonActive();
	}
	else {
		FinalScoring(house);
		for (var i = 0; i < 14; ++i) {
			document.getElementById("house" + i.toString()).innerHTML = house[i];
		}		
		for (var i = 0; i < 14; ++i) {
			if (i != 6 && i != 13)
				document.getElementById("house" + i.toString()).disabled = true;
		}
		if (house[secondPlayer] > house[firstPlayer]) {
			document.getElementById("title").innerHTML = secondPlayerTitle + "獲勝";
		}
		else if (house[secondPlayer] == house[firstPlayer]) {
			document.getElementById("title").innerHTML = "平手";
		}
		else {
			document.getElementById("title").innerHTML = firstPlayerTitle + "獲勝";
		}
	}
}

function Relocation(house, pickedHouse) {
	var playerShop = 6, opponentShop = 13;
	if (pickedHouse > 6) {
		playerShop = 13;
		opponentShop = 6;
	}

	var index = pickedHouse, seeds = house[pickedHouse];
	house[index] = 0;
	while (seeds > 0) {
		index = (index + 1) % 14;
		if (index === opponentShop)
			continue;

		house[index] += 1;
		seeds -= 1;
	}

	if (index === playerShop)
		return true;

	if (house[index] == 1 && house[12 - index] != 0 && index >= (playerShop - 6) && index < playerShop) {
		house[playerShop] += house[12 - index];
		house[playerShop] += 1;
		house[index] = 0;
		house[12 - index] = 0;
	}

	return false;
}

function MinMaxDecision(depthMax) {
	var alpha = -1000;
	var beta = 1000;

	var house = [];

	for (var i = 0; i < 14; ++i) {
		house[i] = parseInt(document.getElementById("house" + i.toString()).innerHTML);
	}

	return MaxValue(house, depthMax, 0, alpha, beta);
}

function FinalScoring(house) {
	for (var i = 0; i < 6; ++i) {
		house[6] += house[i];
		house[13] += house[7 + i];
		house[i] = house[7 + i] = 0;
	}
}

function Evaluate(house) {
	return house[secondPlayer] - house[firstPlayer];
}

function HasSuccessors(house) {
	var player1 = false, player2 = false;

	for (var i = 0; i < 6; ++i) {
		if (house[i] != 0)
			player1 = true;

		if (house[7 + i] != 0)
			player2 = true;
	}

	return player1 && player2;
}

function MaxValue(house, depthMax, depth, alpha, beta) {
	if (HasSuccessors(house) === false) {
		FinalScoring(house);
		return Evaluate(house);
	}
	else if (depth >= depthMax) {
		return Evaluate(house);
	}
	else {
		var action;
		for (var i = secondPlayer - 6; i < secondPlayer; ++i) {
			if (house[i] === 0)
				continue;

			var tempHouse = [], tempValue;
			for (var j = 0; j < 14; ++j)
				tempHouse[j] = house[j];

			if (Relocation(tempHouse, i))
				tempValue = MaxValue(tempHouse, depthMax, depth + 2, alpha, beta);
			else
				tempValue = MinValue(tempHouse, depthMax, depth + 1, alpha, beta);

			if (alpha < tempValue) {
				alpha = tempValue;
				action = i;
			}

			if (alpha >= beta)
				break;
		}

		if (depth === 0)
			return action;
		else
			return alpha;
	}
}

function MinValue(house, depthMax, depth, alpha, beta) {
	if (HasSuccessors(house) === false) {
		FinalScoring(house);
		return Evaluate(house);
	}
	else if (depth >= depthMax) {
		return Evaluate(house);
	}
	else {
		for (var i = firstPlayer - 6; i < firstPlayer; ++i) {
			if (house[i] === 0)
				continue;

			var tempHouse = [], tempValue;
			for (var j = 0; j < 14; ++j)
				tempHouse[j] = house[j];

			
			if (Relocation(tempHouse, i))
				tempValue = MinValue(tempHouse, depthMax, depth + 2, alpha, beta);
			else
				tempValue = MaxValue(tempHouse, depthMax, depth + 1, alpha, beta);

			if (beta > tempValue)
				beta = tempValue;

			if (alpha >= beta)
				break;
		}
		return beta;
	}
}

function Start() {
	for (var i = 0; i < 14; ++i) {
		if (i != 6 && i != 13)
			document.getElementById("house" + i.toString()).innerHTML = document.getElementById("seeds").value;
		else
			document.getElementById("house" + i.toString()).innerHTML = 0;
	}

	if (parseInt(document.getElementById("mode").value) === 0) {
		firstPlayer = 6;
		secondPlayer = 13;
		firstPlayerTitle = document.getElementById("player1").value;
		secondPlayerTitle = document.getElementById("player2").value;
		firstPlayerTurn = true;
		secondPlayerTurn = false;
		computerTurn = false;
	}
	else if (parseInt(document.getElementById("mode").value.toString()) === 1) {
		firstPlayer = 6;
		secondPlayer = 13;
		firstPlayerTitle = document.getElementById("player1").value;
		secondPlayerTitle = "電腦";
		firstPlayerTurn = true;
		secondPlayerTurn = false;
		computerTurn = true;
	}
	else if (parseInt(document.getElementById("mode").value.toString()) === 2) {
		firstPlayer = 13;
		secondPlayer = 6;
		firstPlayerTitle = document.getElementById("player1").value;
		secondPlayerTitle = "電腦";
		firstPlayerTurn = false;
		secondPlayerTurn = true;
		computerTurn = true;
	}
	document.getElementById("gametable").style.display = "block";
	document.getElementById("main").style.display = "none";

	HouseButtonActive();
}

function Back() {
	document.getElementById("gametable").style.display = "none";
	document.getElementById("main").style.display = "block";
}

function modeSelectOnChange() {
	if (document.getElementById("mode").value == 0)
		document.getElementById("player2").disabled = false;
	else
		document.getElementById("player2").disabled = true;
}

function Test2(x) {
	var z = [x[0]];
	z[0] = 22;
	console.log(x);
	console.log(z);
}

function Test() {
	var a = [3];
	Test2(a);
}