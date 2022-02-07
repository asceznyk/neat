var arr = [1, 4, 1, 3, 8];

function manarr(list) {
	for(x = 0; x < list.length; x++) {
		console.log('before power:'+list[x]);
		list[x] = Math.pow(list[x],2);
		console.log('after power:'+list[x]);
	}

	return list;
}

function replacearr(list) {
	for(y = 0; y < list.length; y++) {
		list[y] = Math.floor(Math.random()*10);
	}

	return list;
}

function testfunc(list, i) {
	console.log('round '+i)
	if(i > 10) {
		return false;
	}
	let oldlist = manarr(list);
	let newlist = [1, 4, 1, 3, 8];
	testfunc(newlist, i+1);
}

testfunc(arr, 1);