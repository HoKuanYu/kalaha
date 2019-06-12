var firstPlayer = 6;
var secondPlayer = 13;
var firstPlayerTitle;
var secondPlayerTitle;
var firstPlayerTurn;
var secondPlayerTurn;
var firstPlayerComputer;
var secondPlayerComputer;
var firstPlayerDepth;
var secondPlayerDepth;

function HouseButtonActive() {
	if (firstPlayerTurn && !firstPlayerComputer) {
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
	else if (firstPlayerTurn && firstPlayerComputer) {
		console.log('first');
		document.getElementById("title").innerHTML = "輪到" + firstPlayerTitle;

		for (var i = 0; i < 14; ++i) {
			if (i != 6 && i != 13)
				document.getElementById("house" + i.toString()).disabled = true;
		}

		setTimeout(function() {
			var action = MinMaxDecision(firstPlayerDepth, firstPlayer);
			console.log(action);
			HouseOnClick(action);
		}, 50);
	}
	else if (secondPlayerTurn && !secondPlayerComputer) {
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
			var action = MinMaxDecision(secondPlayerDepth, secondPlayer);
			HouseOnClick(action);
		}, 50);
	}
}

function HouseOnClick(pickedHouse) {
	if (firstPlayerTurn) {
		document.getElementById("infobox").innerHTML += '<div class="row"><label class="col-lg-5 col-form-label text-lg-right">' + firstPlayerTitle + '選擇了 :</label>'
											+ '<label class="col-lg-6 col-form-label">' + pickedHouse.toString() + '</label></div>';
	}
	else {
		document.getElementById("infobox").innerHTML += '<div class="row"><label class="col-lg-5 col-form-label text-lg-right">' + secondPlayerTitle + '選擇了 :</label>'
											+ '<label class="col-lg-6 col-form-label">' + pickedHouse.toString() + '</label></div>';
	}

	var house = [];

	for (var i = 0; i < 14; ++i) {
		house[i] = parseInt(document.getElementById("house" + i.toString()).innerHTML);
	}

	var again = Relocation(house, pickedHouse);

	document.getElementById("infobox").innerHTML += '<div class="row"><label class="col-lg-5 col-form-label text-lg-right">現在狀態 :</label>'
										+ '<label class="col-lg-6 col-form-label">[' + house.toString() + ']</label></div><br>';

	for (var i = 0; i < 14; ++i) {
		document.getElementById("house" + i.toString()).innerHTML = house[i];
	}

	if (again == false) {
		firstPlayerTurn = !firstPlayerTurn;
		secondPlayerTurn = !secondPlayerTurn;
	}

	if (HasSuccessors(house)) {
		HouseButtonActive();

		if (again == true)
			document.getElementById("title").innerHTML += "(再玩一次)";
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

function MinMaxDecision(depthMax, player) {
	var alpha = -1000;
	var beta = 1000;

	var house = [];

	for (var i = 0; i < 14; ++i) {
		house[i] = parseInt(document.getElementById("house" + i.toString()).innerHTML);
	}

	return MaxValue(house, depthMax, 0, alpha, beta, player);
}

function FinalScoring(house) {
	for (var i = 0; i < 6; ++i) {
		house[6] += house[i];
		house[13] += house[7 + i];
		house[i] = house[7 + i] = 0;
	}
}

function Evaluate(house, player1, player2) {
	return house[player1] - house[player2];
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

function MaxValue(house, depthMax, depth, alpha, beta, player) {
	if (HasSuccessors(house) === false) {
		FinalScoring(house);
		return Evaluate(house, player, (player + 7) % 14);
	}
	else if (depth >= depthMax) {
		return Evaluate(house, player, (player + 7) % 14);
	}
	else {
		var action;
		for (var i = player - 6; i < player; ++i) {
			if (house[i] === 0)
				continue;

			var tempHouse = [], tempValue;
			for (var j = 0; j < 14; ++j)
				tempHouse[j] = house[j];

			if (Relocation(tempHouse, i))
				tempValue = MaxValue(tempHouse, depthMax, depth + 2, alpha, beta, player);
			else
				tempValue = MinValue(tempHouse, depthMax, depth + 1, alpha, beta, (player + 7) % 14);

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

function MinValue(house, depthMax, depth, alpha, beta, player) {
	if (HasSuccessors(house) === false) {
		FinalScoring(house);
		return Evaluate(house, (player + 7) % 14, player);
	}
	else if (depth >= depthMax) {
		return Evaluate(house, (player + 7) % 14, player);
	}
	else {
		for (var i = player - 6; i < player; ++i) {
			if (house[i] === 0)
				continue;

			var tempHouse = [], tempValue;
			for (var j = 0; j < 14; ++j)
				tempHouse[j] = house[j];

			
			if (Relocation(tempHouse, i))
				tempValue = MinValue(tempHouse, depthMax, depth + 2, alpha, beta, player);
			else
				tempValue = MaxValue(tempHouse, depthMax, depth + 1, alpha, beta, (player + 7) % 14);

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

	firstPlayerTurn = true;
	secondPlayerTurn = false;
	firstPlayerTitle = document.getElementById("player1").value;
	secondPlayerTitle = document.getElementById("player2").value;

	if (parseInt(document.getElementById("mode").value) === 0) {
		firstPlayerComputer = false;
		secondPlayerComputer = false;
	}
	else if (parseInt(document.getElementById("mode").value.toString()) === 1) {
		firstPlayerComputer = false;
		secondPlayerComputer = true;
		secondPlayerDepth = parseInt(document.getElementById("depth2").value);
	}
	else if (parseInt(document.getElementById("mode").value.toString()) === 2) {
		firstPlayerComputer = true;
		secondPlayerComputer = false;
		firstPlayerDepth = parseInt(document.getElementById("depth1").value);
	}
	else {
		firstPlayerComputer = true;
		secondPlayerComputer = true;
		firstPlayerDepth = document.getElementById("depth1").value;
		secondPlayerDepth = parseInt(document.getElementById("depth2").value);
	}
	document.getElementById("gametable").style.display = "block";
	document.getElementById("main").style.display = "none";

	var house = [];

	for (var i = 0; i < 14; ++i) {
		house[i] = parseInt(document.getElementById("house" + i.toString()).innerHTML);
	}

	document.getElementById("info").style.display = "block";

	document.getElementById("infobox").innerHTML = '<div class="row"><label class="col-lg-5 col-form-label text-lg-right">初始 :</label>'
												+ '<label class="col-lg-6 col-form-label">[' + house.toString() + ']</label></div><br>';

	HouseButtonActive();
}

function Back() {
	document.getElementById("gametable").style.display = "none";
	document.getElementById("info").style.display = "none";
	document.getElementById("main").style.display = "block";
}

function modeSelectOnChange() {
	if (document.getElementById("mode").value == 0) {
		document.getElementById("depth1").disabled = true;
		document.getElementById("depth2").disabled = true;
	}
	else if (document.getElementById("mode").value == 1) {
		document.getElementById("depth1").disabled = true;
		document.getElementById("depth2").disabled = false;
	}
	else if (document.getElementById("mode").value == 2) {
		document.getElementById("depth1").disabled = false;
		document.getElementById("depth2").disabled = true;
	}
	else {
		document.getElementById("depth1").disabled = false;
		document.getElementById("depth2").disabled = false;
	}
}