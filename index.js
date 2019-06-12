var firstPlayer = 6;
var secondPlayer = 13;
var beans = [];
var computerTurn = true;

function HouseOnClick(pickedHouse) {
	var house = [];

	for (var i = 0; i < 14; ++i) {
		house[i] = parseInt(document.getElementById("house" + i.toString()).innerHTML);
	}

	if (computerTurn === false) {
		var again = Relocation(house, pickedHouse);

		for (var i = 0; i < 14; ++i) {
			document.getElementById("house" + i.toString()).innerHTML = house[i];
		}
	}
	else {
		MinMaxDecision(house, 14);
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
		house[index] = 0;
		house[playerShop] += house[12 - index];
	}

	return false;
}

function MinMaxDecision(house, depthMax) {
	var alpha = -1000;
	var beta = 1000;

	document.write(MaxValue(house, depthMax, 0, alpha, beta));
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
	}

	if (parseInt(document.getElementById("mode").value) === 0) {
		firstPlayer = 6;
		secondPlayer = 13;
		computerTurn = false;
	}
	else if (parseInt(document.getElementById("mode").value.toString()) === 1) {
		firstPlayer = 6;
		secondPlayer = 13;
		computerTurn = true;
	}
	else if (parseInt(document.getElementById("mode").value.toString()) === 2) {
		firstPlayer = 13;
		secondPlayer = 6;
		computerTurn = true;
	}

	document.getElementById("gametable").style.display = "block";
	document.getElementById("main").style.display = "none";
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