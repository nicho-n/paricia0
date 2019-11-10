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
var table = document.createElement("table");
table.id = "table";
var socket = window.parent.socket;

socket.on('load inventory', function(inventory){
	if (_this){
		_this.commodities = inventory;
		if (activeTab = "buyTab")
		_this.loadBuyTab();
	}
        //players[username] = 0;
});

slider.oninput = function(){
        number.value = slider.value;
        button.innerHTML = (slider.value * 5)+"$";
}
function displayInfo(file, commodity, ifSell){
        	slider.value = 0;
        	number.value = 0;
       		button.value = "0$";
        	commodityInfo.src = file;
        	selectedItem = commodity;
		if (ifSell == "sell")
			slider.max = selectedItem.quantity;
}

function clickHandler(page, key, ifSell) {
        return function(){
		displayInfo(page, key, ifSell);
	};
}

function insertTableRow(item1, item2, item3, id1, id2, id3){
	  var tr = document.createElement("tr");
          var td1 = document.createElement("td");
          var td2 = document.createElement("td");
          var td3 = document.createElement("td");

          var text1 = document.createTextNode(item1);
          var text2 = document.createTextNode(item2);
          var text3 = document.createTextNode(item3);

	  td1.id = id1
	  td2.id = id2;
	  td3.id = id3;

          td1.appendChild(text1);
          td2.appendChild(text2);
          td3.appendChild(text3);

          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);

          table.appendChild(tr);

}

class Station{
        constructor(){
                _this = this;
                _this.commodities = {};
        }

	loadCommodityTable(){
                table.innerHTML = "";
		_this.loadBuyTab();
	}

	loadBuyTab(){
		activeTab = "buyTab";
		table.innerHTML = "";
                insertTableRow("Items", "Quantity", "Price", "Q", "P");
		_this.populateCommodityTable(_this.commodities, 0);

                buyTab.style.backgroundColor = "blue";
                sellTab.style.backgroundColor = "black";

                for (var first in _this.commodities) break;
                displayInfo(_this.commodities[first].buyPage, _this.commodities[first], 0);

                slider.max = Math.min((p.money/5), p.cargoSpace/5);
                button.onclick = function(){

		//Configure slider/buttons to buy items from the station 
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
                	        socket.emit('update commodities', _this.commodities);

			}
		};
	}

	loadSellTab(){
		activeTab = "sellTab";
		sellTab.style.backgroundColor = "blue";
		buyTab.style.backgroundColor = "black";
		table.innerHTML = "";
                insertTableRow("Your Items", "Quantity", "Sell Price", "Q", "P");
                _this.populateCommodityTable(p.inventory, "sell");


                if (Object.keys(p.inventory).length > 0){
			for (var first in p.inventory) break;
                	displayInfo(p.inventory[first].buyPage, p.inventory[first], "sell");
		}
 
	        button.onclick = function(){
          	      if (slider.value != 0){
                	        button.innerHTML = "$";
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
                	socket.emit('update commodities', _this.commodities);
		};


	}}

	populateCommodityTable(commodities, ifSell){

		//add a row for each commodity
		for (var key in commodities){
			var commodity = commodities[key];
			insertTableRow(commodity.name, commodity.quantity, commodity.value, key, key+"quantity", key+"price");
                }

		commodityList.appendChild(table);

		//assign each row an onclick function to display its corresponding info panel.
		for (var key in commodities){
			var commodity = commodities[key];
			document.getElementById(key).addEventListener("click", clickHandler(commodity.sellPage, commodity, ifSell));
		}


	}
}

