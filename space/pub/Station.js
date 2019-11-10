var commodityInfo = document.getElementById("commodityInfo");
var p = window.parent.window.parent.playerInfo;
var commodityList = document.getElementById("commodityList");
var buyTab = document.getElementById("buyTab");
var sellTab = document.getElementById("sellTab");
var slider = document.getElementById("slider");
var number = document.getElementById("number");
var button = document.getElementById("buy");
var _this;
var activeTab = "buyTab";
var selectedItem = 0;

function displayInfo(file, commodity){
	slider.value = 0;
	number.value = 0;
	button.value = "0$";
	commodityInfo.src = file;
	selectedItem = commodity;
}



class Station{
	constructor(){
		_this = this;
		_this.commodities = {};
	}

	addCommodity(key, commodity){
		commodities[key] = commodity;
	}

	loadBuyTab(){
		activeTab = "buyTab";
		buyTab.style.backgroundColor = "blue";
		sellTab.style.backgroundColor = "black";
		commodityList.innerHTML = "";
		var table = document.createElement("table");
		table.id="table";
		var tr = document.createElement("tr");
		var td1 = document.createElement("td");
		var td2 = document.createElement("td");
		var td3 = document.createElement("td");
		var td4 = document.createElement("td");
		var text1 = document.createTextNode("Items");
		var text2 = document.createTextNode("Quantity");
		var text3 = document.createTextNode("Weight");
		var text4 = document.createTextNode("Price");
		td1.appendChild(text1);
		td2.appendChild(text2);
		td3.appendChild(text3);
		td4.appendChild(text4);

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);

		table.appendChild(tr);

	        var createClickHandler = function(page, key) {
                	return function() { displayInfo(page, key) };
                }


		for (var key in _this.commodities){
			//var tr = document.createElement("tr");
			_this.commodities[key].price = 5;
			var tr = table.insertRow();
			var td1 = document.createElement("td");
			var td2 = document.createElement("td");
			var td3 = document.createElement("td");
			var td4 = document.createElement("td");
			td3.id = key+"quantity";
			td4.id = key+"price";
			var text1 = document.createTextNode(_this.commodities[key].name);
			var text2 = document.createTextNode(_this.commodities[key].quantity);
                        var text3 = document.createTextNode(_this.commodities[key].weight); 
			var text3 = document.createTextNode(_this.commodities[key].value);
			td1.appendChild(text1);
			td2.appendChild(text2);
			td3.appendChild(text3);
			td4.appendChild(text4);
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			tr.appendChild(td4);
			tr.onclick = createClickHandler(_this.commodities[key].buyPage, _this.commodities[key]);			
			table.appendChild(tr);
		}

		commodityList.appendChild(table);
		for (var first in _this.commodities) break;
		displayInfo(_this.commodities[first].buyPage, _this.commodities[first]);

		slider.max = Math.min((p.money/5), p.cargoSpace/5);
        	button.onclick = function(){
                if (slider.value != 0){
                        button.innerHTML = "$"
                        selectedItem.quantity -= slider.value;
                        var tableQuantity = document.getElementById(selectedItem.name + "quantity");
                        tableQuantity.childNodes[0].data -= slider.value;
                        if (!(selectedItem.name in p.inventory)){
                                p.inventory[selectedItem.name] = new Commodity(selectedItem.name, selectedItem.weight, selectedItem.sellPage, selectedItem.buyPage);
                                p.inventory[selectedItem.name].quantity = slider.value;
                        }
                        else{
                                p.inventory[selectedItem.name].quantity = parseInt(p.inventory[selectedItem.name].quantity) + parseInt(slider.value);
                        }
                        p.money -= slider.value * 5;
                        p.cargoSpace -= slider.value *5;
                        slider.value = 0;
                        number.value = 0;
                        slider.max = Math.min((p.money/5), p.cargoSpace/5);
                }
	}

	}

	loadSellTab(){
		activeTab = "sellTab";
		sellTab.style.backgroundColor = "blue";
		buyTab.style.backgroundColor = "black";
        	commodityList.innerHTML = "";
                var table = document.createElement("table");
		table.id= "table";
                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                var td2 = document.createElement("td");
		var td3 = document.createElement("td");
                var text1 = document.createTextNode("Your Items");
                var text2 = document.createTextNode("Quantity");
		var text3 = document.createTextNode("Sell Price");
                td1.appendChild(text1);
                td2.appendChild(text2);
		td3.appendChild(text3);

                tr.appendChild(td1);
                tr.appendChild(td2);
		tr.appendChild(td3);

                table.appendChild(tr);
                for (var key in p.inventory){
                        var tr = document.createElement("tr");
                        var td1 = document.createElement("td");
                        var td2 = document.createElement("td");
			td2.id = key+"quantity";
			var td3 = document.createElement("td");
			td3.id = key+"price";
                        var text1 = document.createTextNode(p.inventory[key].name);
                        var text2 = document.createTextNode(p.inventory[key].quantity);
			var text3 = document.createTextNode(p.inventory[key].value);
                        td1.appendChild(text1);
                        td2.appendChild(text2);
			td3.appendChild(text3);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
			tr.appendChild(td3);
			tr.onclick = displayInfo(p.inventory[key].buyPage, p.inventory[key]);
                        table.appendChild(tr);
                }

                commodityList.appendChild(table);

		if (selectedItem.name in p.inventory)
			slider.max = p.inventory[selectedItem.name].quantity;
		else slider.max = 0;
		button.onclick = function(){
                if (slider.value != 0){
                        button.innerHTML = "$"
                        selectedItem.quantity -= slider.value;
                        var tableQuantity = document.getElementById(selectedItem.name + "quantity");
                        tableQuantity.childNodes[0].data -= slider.value;
                        if (!(selectedItem.name in _this.commodities)){
                                _this.commodities[selectedItem.name] = new Commodity(selectedItem.name, selectedItem.weight, selectedItem.buyPage, selectedItem.sellPage);
                                _this.commodities[selectedItem.name].quantity = slider.value;
                        }
                        else{
                                _this.commodities[selectedItem.name].quantity = parseInt(_this.commodities[selectedItem.name].quantity) + parseInt(slider.value);
                        }
                        p.money += slider.value * 5;
                        p.cargoSpace += slider.value *5;
                        slider.value = 0;
                        number.value = 0;
                   	slider.max = p.inventory[selectedItem.name].quantity;
                }
        }


	}

}

slider.oninput = function(){
	number.value = slider.value;
	button.innerHTML = (slider.value * 5)+"$";
}

if (activeTab = "buyTab"){
	slider.max = Math.min((p.money/5), p.cargoSpace/5);
	button.onclick = function(){
		if (slider.value != 0){
			button.innerHTML = "$"
			selectedItem.quantity -= slider.value;
			var tableQuantity = document.getElementById(selectedItem.name + "quantity");
			tableQuantity.childNodes[0].data -= slider.value;
			if (!(selectedItem.name in p.inventory)){
				p.inventory[selectedItem.name] = new Commodity(selectedItem.name, selectedItem.weight, selectedItem.buyPage, selectedItem.sellPage);
				p.inventory[selectedItem.name].quantity = slider.value;
			}
			else{
				p.inventory[selectedItem.name].quantity = parseInt(p.inventory[selectedItem.name].quantity) + parseInt(slider.value);
			}
			p.money -= slider.value * 5;
			p.cargoSpace -= slider.value *5;
			slider.value = 0;
			number.value = 0;
	          	slider.max = Math.min((p.money/5), p.cargoSpace/5);
		}
	}
}

