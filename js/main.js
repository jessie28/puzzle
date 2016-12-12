function preloadimages(obj, complete_cb, progress_cb) {
	var loaded = 0;
	var toload = 0;
	var images = obj instanceof Array ? [] : {};
	toload = obj.length;
	for (var i = 0; i < obj.length; i++) {
		images[i] = new Image();
		images[i].src = obj[i];
		images[i].onload = load;
		images[i].onerror = load;
		images[i].onabort = load;
	}
	if (obj.length == 0) {
		complete_cb(images);
	}
	function load() {
		++loaded;
		if (progress_cb) {
			progress_cb(loaded / toload);
		}
		if (loaded >= toload) {
			complete_cb(images);
		}
	}
}

var chose_img_arr_num;




var pos = [
	'0,0',
	'0,1',
	'0,2',
	'1,0',
	'1,1',
	'1,2',
	'2,0',
	'2,1',
	'2,2'
]
function disrupted(cLi,name){
	var new_arr = []
	var len = cLi.length;
	while(len){
		var num = parseInt(Math.random() * len)
		new_arr.push(cLi[num]);
		cLi.splice(num,1);
		len--
	}
	showCli(new_arr,name)
}

function showCli(arr,name){
	$("#page1 .puzzle ul").html("")
	for(var i = 0 ; i < arr.length ; i ++ ){
		var sort = arr[i].sort
		var img = "./image/"+name + '_'+sort+".jpg"
		var ele_li = "<li style='background: url("+img+") 0 0 no-repeat' data-sort="+sort+" data-pos="+pos[i]+"></li>";
		$("#page1 ul").append($(ele_li));
	}
	addEliClick();
}


function addEliClick(){
	var aLi = $("#page1 ul li");
	var oDrag = $("#drag");
	var startX,startY,moveX,moveY,old,thatNum,num,pX= 0,pY=0;
	var block = true
	var posArr = []
	var smallX = 200
	var smallY = 250
	var maxwidth = $("#page1 .box").width;
	var maxheight = $("#page1 .box").height;
	var minwidth = 0;
	var minheight = 0;
	var bingo = false
	for(var i = 0;i < aLi.length ; i ++){
		aLi[i].index = i
		aLi[i].addEventListener('touchstart',function(ev){
			var $that = $(this)
			old = this.index;
			posArr[0] = $that.data('pos').split(",");
			var color = $that.css('background')
			var top = Number(posArr[0][0]) * smallY;
			var left = Number(posArr[0][1]) * smallX;
			oDrag.css('top',top+'px');
			oDrag.css('left',left+'px');
			oDrag.css('background',color);
			oDrag.show();
			startX = 0;
			startY = 0;
			pX = 0;
			pY = 0;
			if(block && !bingo){
				startX = ev.touches[0].pageX;
				startY = ev.touches[0].pageY;
				block = false
			}
		});

		aLi[i].addEventListener('touchmove',function(ev){
			ev.preventDefault();
			if(!block && startX != 0 && startY != 0 && !bingo){
				pX = ev.touches[0].pageX;
				pY = ev.touches[0].pageY;

				moveX = pX - startX + Number(posArr[0][1]) * smallX;
				moveY = pY - startY + Number(posArr[0][0]) * smallY;
				if(moveX > maxwidth){
					moveX = maxwidth
				}
				if(moveX < minwidth ){
					moveX = minwidth
				}
				if(moveY > maxheight){
					moveY = maxheight
				}
				if(moveY < minheight ){
					moveY = minheight
				}

				oDrag.css('top',moveY+'px');
				oDrag.css('left',moveX+'px');
			}

		})

		aLi[i].addEventListener('touchend',function(ev){
			ev.preventDefault();
			if(!block && !bingo){
				block = true;
				oDrag.hide();
				if(pX == 0 || pY == 0 || moveX > maxwidth || moveX < minwidth || moveY > maxheight || moveY < minwidth){
					return false;
				}
				var little_moveX = moveX/smallX;
				var little_moveY = moveY/smallY;

				var diff_x = []

				diff_x[0] =  Math.abs( 0 - little_moveX );
				diff_x[1] = Math.abs( 1 - little_moveX );
				diff_x[2] = Math.abs( 2 - little_moveX );
				var minInNumbersX = Math.min.apply(Math,diff_x)

				var final_x = diff_x.indexOf(minInNumbersX)
				var diff_y = []

				diff_y[0] = Math.abs( 0 - little_moveY );
				diff_y[1] = Math.abs( 1 - little_moveY );
				diff_y[2] = Math.abs( 2 - little_moveY );

				var minInNumbersY = Math.min.apply(Math,diff_y)
				var final_y = diff_y.indexOf(minInNumbersY)

				var final_num = pos.indexOf(final_y+','+final_x);


				var old_style = $(aLi[old]).attr('style');
				var new_style = $(aLi[final_num]).attr('style');
				var old_data_index = $(aLi[old]).data('sort');
				var new_data_index = $(aLi[final_num]).data('sort');
				// var old_text = $(aLi[old]).html();
				// var new_text = $(aLi[final_num]).html();
				$(aLi[old]).attr('style',new_style);
				$(aLi[final_num]).attr('style',old_style);
				$(aLi[old]).data('sort',new_data_index);
				$(aLi[final_num]).data('sort',old_data_index);
				// $(aLi[old]).html(new_text);
				// $(aLi[final_num]).html(old_text);
				var count = 0;
				for(var k = 0 ; k < aLi.length ; k ++){
					var sort_num = $(aLi[k]).data('sort');
					if(Number(sort_num) != (k+1)){
						count = 0
						break;
					}else{
						count ++ ;
						if(count == aLi.length - 1){
							bingo = true
						}
					}
				}
				if(bingo){
					bingo = false;
					clearInterval(timer)
					$("#page1 .box").hide();
					$("#page1 .ori_img").show();
					$("#page1 .show").removeClass('show_img')
					alert("win")
				}

			}

		})
	}
}
var timer
function countdown() {
	var timeText = 15
	var time_ele = $("#time")
	time_ele.text(timeText)
	timer = setInterval(function(){
		--timeText;
		if(timeText <= 0){
			timeText = 0
			$("#dialog2").show();
			return false
		}
		time_ele.text(timeText)
	},1000)
}

function play(){
	$(".page").hide();
	$("#page1").show();
	$("#page1 .box").hide();
	$("#page1 .puzzle").show();
	countdown();
}

function ready_puzzle() {
	var chose_img_arr = [
		{'sort':1},
		{'sort':2},
		{'sort':3},
		{'sort':4},
		{'sort':5},
		{'sort':6},
		{'sort':7},
		{'sort':8},
		{'sort':9}
	];
	var chose_img_name = '';
	switch (chose_img_arr_num){
		case 1:
			chose_img_name = 'thumb1';
			break;
		case 2:
			chose_img_name = 'thumb2';
			break;
		case 3:
			break;
		case 4:
			break;
	}
	$("#page1 .ori_img").html("");
	$("#page1 .ori_img").html("<img src='./image/"+chose_img_name+".jpg' />")
	disrupted(chose_img_arr,chose_img_name);
}


$(function() {
	var preloadImageList = [
		'./image/thumb1.jpg',
		'./image/thumb2.jpg'

	];
	for(var img_index = 1 ;img_index < 10 ;img_index ++){
		var img1 = './image/thumb1_'+img_index+'.jpg';
		preloadImageList.push(img1)
		var img2 = './image/thumb2_'+img_index+'.jpg';
		preloadImageList.push(img2)
	}

	var timeEnd = false;
	var imgLoaded = false;

	preloadimages( preloadImageList , function () {
		imgLoaded = true;
		$("#page0").show()
		// page1_start();
		// $(".page2").show();
	}, function(progress){
		var text = Math.floor( progress*100 );
		//to do show text
	} );



	$("#page0 .haibao .little_img").on('click',function(){
		var $that = $(this);
		chose_img_arr_num = $that.data('img');
		if(chose_img_arr_num != 0){
			ready_puzzle()
			$(".page").hide();
			$("#page1").show();
			$("#page1 .box").hide();
			$("#page1 .ori_img").show();
			$(".dialog").hide();
			$("#dialog1").show()
		}
	})


	$("#dialog1 .go").get(0).addEventListener('animationend',function(){
		$(".dialog").hide()
		play()
	})
	$("#dialog1 .go").get(0).addEventListener('webkitAnimationEnd',function(){
		$(".dialog").hide()
		play()
	})

	$("#dialog2 .again").on('click',function(){
		ready_puzzle();
		clearInterval(timer)
		$(".dialog").hide();
		play()
	})
	
	$("#page1 .show").on('click',function(){
		if($(this).hasClass('show_img')){
			$("#page1 .ori_img").show()
			setTimeout(function () {
				$("#page1 .ori_img").hide()
			},2000)
		}

	})
	

});