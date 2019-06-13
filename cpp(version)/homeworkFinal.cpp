#include <iostream>
using namespace std;

void showHouse(int house[]);
bool validate(int house[], int pickedHouse, int player);
inline bool hasSuccessors(int house[]);
bool relocation(int house[], int pickedHouse);
void finalScoring(int house[]);
inline int evaluate(int house[], int playerShop, int oppoentShop);
int minimaxDecision(int house[], int depthMax, int player);
int maxValue(int house[], int depthMax, int depth, int alpha, int beta, int playerShop);
int minValue(int house[], int depthMax, int depth, int alpha, int beta, int playerShop);

int main() {
	char playerName[2][20];
	int playerComputer[2], house[14] = { 0 }, player = 0, seeds, depth[2];

	cout << "The first player is (0)human or (1)computer: ";
	cin >> playerComputer[0];
	if (playerComputer[0] == 1) {
		cout << "The first min-max depth: ";
		cin >> depth[0];
	}
	cout << "The first player's nickname: ";
	cin >> playerName[0];

	cout << "The second player is (0)human or (1)computer: ";
	cin >> playerComputer[1];
	if (playerComputer[1] == 1) {
		cout << "The second min-max depth: ";
		cin >> depth[1];
	}
	cout << "The second player's nickname: ";
	cin >> playerName[1];

	cout << "The house's seeds: ";
	cin >> seeds;

	for (int i = 0; i < 14; ++i)
		if (i != 6 && i != 13)
			house[i] = seeds;

	while (hasSuccessors(house)) {
		showHouse(house);
		int action;

		cout << playerName[player] << "'s turn to take action: ";

		if (playerComputer[player]) {
			action = minimaxDecision(house, depth[player], player);
			cout << action << endl;
		}
		else
			cin >> action;

		if (!validate(house, action, player))
			continue;

		cout << endl;

		if (relocation(house, action))
			player = (player == 0 ? 0 : 1);
		else
			player = (player == 0 ? 1 : 0);
	}

	finalScoring(house);
	showHouse(house);
	if (house[13] > house[6])
		cout << playerName[1] << " win" << endl;
	else if (house[13] == house[6])
		cout << "draw" << endl;
	else
		cout << playerName[0] << " win" << endl;

	system("pause");
}

void showHouse(int house[]) {
	cout << "[ " << house[13] << "]";
	for (int i = 12; i > 6; --i)
		cout << "," << house[i];
	cout << endl;

	cout << "     ";
	for (int i = 1; i < 6; ++i)
		cout << house[i] << ",";
	cout << "[ " << house[6] << "]" << endl;
}

bool validate(int house[], int pickedHouse, int player) {
	int playerShop = 6;
	if (player == 1)
		playerShop = 13;

	if (pickedHouse >= playerShop || pickedHouse < playerShop - 6) {
		cout << "House#" << pickedHouse << " is not your house.\n" << endl;
		return false;
	}
	else if (house[pickedHouse] == 0) {
		cout << "There is no seed in house#" << pickedHouse << ".\n" << endl;
		return false;
	}
	else {
		return true;
	}
}

inline bool hasSuccessors(int house[]) {
	bool player1 = false, player2 = false;
	for (int i = 0; i < 6; ++i) {
		if (house[i] != 0)
			player1 = true;
		if (house[7 + i] != 0)
			player2 = true;
	}
	return player1 && player2;
}

bool relocation(int house[], int pickedHouse) {
	int playerShop = 13, opponentShop = 6;
	if (pickedHouse >= 0 && pickedHouse < 6) {
		playerShop = 6;
		opponentShop = 13;
	}

	int seeds = house[pickedHouse], index = pickedHouse;
	house[index] = 0;
	while (seeds > 0) {
		index = (index + 1) % 14;
		if (index == opponentShop)
			continue;

		house[index] += 1;
		seeds -= 1;
	}

	if (index == playerShop)
		return true;

	if (house[index] == 1 && house[12 - index] != 0 && index >= (playerShop - 6) && index < playerShop) {
		house[playerShop] += house[12 - index];
		house[playerShop] += 1;
		house[index] = 0;
		house[12 - index] = 0;
	}

	return false;
}

void finalScoring(int house[]) {
	for (int i = 0; i < 6; ++i) {
		house[6] += house[i];
		house[13] += house[7 + i];
		house[i] = house[7 + i] = 0;
	}
}

inline int evaluate(int house[], int playerShop, int oppoentShop) {
	return house[playerShop] - house[oppoentShop];
}

int minimaxDecision(int house[], int depthMax, int player) {
	int alpha = -1000;
	int beta = 1000;

	int playerShop = 13;
	if (player == 0)
		playerShop = 6;

	return maxValue(house, depthMax, 0, alpha, beta, playerShop);
}

int maxValue(int house[], int depthMax, int depth, int alpha, int beta, int playerShop) {
	if (hasSuccessors(house) == false) {
		finalScoring(house);
		return evaluate(house, playerShop, (playerShop + 7) % 14);
	}
	else if (depth >= depthMax) {
		return evaluate(house, playerShop, (playerShop + 7) % 14);
	}
	else {
		int action;

		for (int i = playerShop - 6; i < playerShop; ++i) {
			if (house[i] == 0)
				continue;

			int tempHouse[14], tempValue;
			for (int j = 0; j < 14; ++j)
				tempHouse[j] = house[j];

			if (relocation(tempHouse, i))
				tempValue = maxValue(tempHouse, depthMax, depth + 2, alpha, beta, playerShop);
			else
				tempValue = minValue(tempHouse, depthMax, depth + 1, alpha, beta, playerShop);

			if (alpha < tempValue) {
				alpha = tempValue;
				action = i;
			}

			if (alpha >= beta)
				break;
		}
		if (depth == 0)
			return action;
		else
			return alpha;
	}
}

int minValue(int house[], int depthMax, int depth, int alpha, int beta, int playerShop) {
	if (hasSuccessors(house) == false) {
		finalScoring(house);
		return evaluate(house, playerShop, (playerShop + 7) % 14);
	}
	else if (depth >= depthMax) {
		return evaluate(house, playerShop, (playerShop + 7) % 14);
	}
	else {
		int action, oppoentShop = (playerShop + 7) % 14;

		for (int i = oppoentShop - 6; i < oppoentShop; ++i) {
			if (house[i] == 0)
				continue;

			int tempHouse[14], tempValue;
			for (int j = 0; j < 14; ++j)
				tempHouse[j] = house[j];

			if (relocation(tempHouse, i))
				tempValue = minValue(tempHouse, depthMax, depth + 2, alpha, beta, playerShop);
			else
				tempValue = maxValue(tempHouse, depthMax, depth + 1, alpha, beta, playerShop);

			if (beta > tempValue)
				beta = tempValue;

			if (alpha >= beta)
				break;
		}
		return beta;
	}
}