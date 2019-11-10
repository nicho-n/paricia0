class Player{
	constructor(username, passcode, obj, position, rotation){
		this.username = username;
		this.passcode = passcode;
		this.position = position;
		this.rotation = rotation;
		this.money = 1000;
		this.cargoCapacity = 300;
		this.cargoSpace = 300;
		this.inventory = {};
	}

}
