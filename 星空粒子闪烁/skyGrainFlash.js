(function(doc, win){
	let canvas = doc.querySelector('canvas');
	if(canvas == null){
		canvas = doc.createElement('canvas');
		doc.body.appendChild(canvas);
	}
	let width = canvas.width = win.innerWidth,
		height = canvas.height = win.innerHeight,
		ctx = canvas.getContext('2d');
	let numsOfDots = 300,
		array = [],
		maxr = 0.9,//半径
		flashTime = 100,//闪烁时间
		maxalpha = 1,//最大亮度
		minalpha = 0.5,//最小亮度
		chance = 0.7,//闪烁的几率
		centerX = width / 2,
		centerY = height / 2;

	
	function run(){
		clear(ctx);
		array.forEach(item => {
			item.draw(ctx);
		});
		flashTime = randomTime();
		setTimeout(run, flashTime);
		//requestAnimationFrame(run);
	}
	function Dot({x, y, r}){
		Object.assign(this, {x,y,r, flag: false, alpha: minalpha, step: 0.1});
	}
	Dot.prototype.draw = function(ctx){
		let flag = Math.random() < chance,
			color = "";
		if(this.flag){
			this.alpha += this.step;
			if(this.alpha >= maxalpha || this.alpha <= minalpha){
				this.step = -this.step;
			}
			if(this.alpha <= minalpha){
				this.flag = false;
			}
			color = `rgba(255,255,255,${this.alpha})`;
		}else{
			this.flag = flag;
			color = `rgba(255,255,255,0.3)`;
		}
		//this.computedPos();
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
	Dot.prototype.computedPos = function(){
		let ox = centerX - this.x,
			oy = centerY - this.y,
			oz = Math.sqrt(Math.pow(ox, 2), Math.pow(oy, 2));
		let x = oy/oz;
		x += 0.3;
		if(x >= 1){
			x = -1;
		}
		let deg = Math.asin(x);
		
		this.y = centerY - Math.sin(deg) * oz;
		this.x = centerX - Math.cos(deg) * oz;
	}
	function createDots(){
		for(let i = 0; i < numsOfDots; i++){
			array.push(new Dot(randomData()))
		}
	}
	function randomTime(){
		return Math.floor(Math.random()*100) + 100;
	}
	function randomData(){
		let r = maxr,
			x = Math.max(0, Math.floor(Math.random()*(width - r))),
			y = Math.max(0, Math.floor(Math.random()*(height - r)));
		return {r, x, y};
	}
	function clear(ctx){
		ctx.clearRect(0,0, width, height);
	}
	createDots();
	run();
})(document, window)