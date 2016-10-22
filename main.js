var mainDiv=document.getElementById("maindiv");
    //获得开始界面
var startdiv=document.getElementById("startdiv");
    //获得游戏中分数显示界面
var scorediv=document.getElementById("scorediv");
    //获得分数界面
var scorelabel=document.getElementById("label");
    //获得暂停界面
var suspenddiv=document.getElementById("suspenddiv");
    //获得游戏结束界面
var enddiv=document.getElementById("enddiv");
    //获得游戏结束后分数统计界面
var planscore=document.getElementById("planscore");
    //初始化分数
function Plane(hp,x,y,width,height,score,dietime,speed,boomimage,planeimage){
    this.hp =hp;
    this.score = score;
    this.dietime = dietime;
    this.dietimes = 0;
    this.speed = speed;
    this.attack = 1;
    this.imagenode = null;
    this.isdie = false;
    this.init = function(){
        this.imagenode = document.createElement('img');
        this.imagenode.style.width = width + 'px';
        this.imagenode.style.height = height + 'px';
        this.imagenode.style.left = x + 'px';
        this.imagenode.style.top = y + 'px';
        this.imagenode.src = planeimage;
        this.boomimage = boomimage;
        mainDiv.appendChild(this.imagenode);
    }
    this.init();
    this.move = function(){
        if(scores<=50000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.speed+"px";
        }
        else if(scores>50000&&scores<=100000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.speed+1+"px";
        }
        else if(scores>100000&&scores<=150000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.speed+2+"px";
        }
        else if(scores>150000&&scores<=200000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.speed+3+"px";
        }
        else if(scores>200000&&scores<=300000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.speed+4+"px";
        }
        else{
            this.imagenode.style.top=this.imagenode.offsetTop+this.speed+5+"px";
        }
    }
}

function OurPlane(){
    var boomimage = 'images/本方飞机爆炸.gif';
    var planeimage = 'images/我的飞机.gif';
    Plane.call(this,1,120,485,66,80,0,660,0,boomimage,planeimage);
    this.shift = function(x,y){
        this.imagenode.style.left = x - this.imagenode.offsetWidth/2 + 'px';
        this.imagenode.style.top = y - this.imagenode.offsetHeight/2 + 'px';
    }
}
function Enemy(hp,a,b,width,height,score,dietime,speed,boomimage,planeimage){
    Plane.call(this,hp,getRan(a,b),-100,width,height,score,dietime,speed,boomimage,planeimage);
}
function getRan(a,b){
    return Math.ceil(Math.random()*(b-a+1)+a);
}
function Bullet(x,y,width,height,bulletimage){
    this.imagenode = null;
    this.init = function(){
        this.imagenode = document.createElement('img');
        this.imagenode.src = bulletimage;
        this.imagenode.style.width = width + 'px';
        this.imagenode.style.height = height + 'px';
        this.imagenode.style.left = x + 'px';
        this.imagenode.style.top = y + 'px';
        mainDiv.appendChild(this.imagenode);
    }
    this.init();
    this.move = function(){
        this.imagenode.style.top = this.imagenode.offsetTop - 20 + 'px';
    }
}
var enemies = [];
var self = new OurPlane();
var bullets = [];
var mark = 0;
var mark1 = 0;
var scores = 0;
var positionY = 0;
var timer = null;
function start(){
    mainDiv.style.backgroundPositionY = positionY+'px';
    positionY += 0.5;
    if(positionY == mainDiv.offsetHeight){
        positionY = 0;
    }
    mark++;
    if(mark == 20){
        mark1++;
        if(mark1%5 == 0){
            enemies.push(new Enemy(6,0,274,46,60,5000,360,getRan(1,3),'images/中飞机爆炸.gif','images/enemy3_fly_1.png'));
        }
        if(mark1 == 20){
            enemies.push(new Enemy(12,0,210,110,164,30000,540,1,'images/大飞机爆炸.gif','images/enemy2_fly_1.png'));
            mark1 = 0;
        }else{
            enemies.push(new Enemy(1,0,286,34,24,100,360,4,'images/小飞机爆炸.gif','images/enemy1_fly_1.png'));
        }
        mark = 0;
    }
    for(var i=0;i<enemies.length;i++){
        enemies[i].move();
        if(enemies[i].isdie == false){
            if(enemies[i].imagenode.offsetTop >= mainDiv.offsetHeight){
                //enemies[i].isdie = true;
                mainDiv.removeChild(enemies[i].imagenode);
                enemies.splice(i,1);
            }
            var enemynode = enemies[i].imagenode;
            var selfnode = self.imagenode;
            if(selfnode.offsetLeft + selfnode.offsetWidth >= enemynode.offsetLeft && enemynode.offsetLeft+enemynode.offsetWidth>=selfnode.offsetLeft){
                if(enemynode.offsetTop+enemynode.offsetHeight>=selfnode.offsetTop && enemynode.offsetTop <= selfnode.offsetTop+selfnode.offsetHeight){
                    enddiv.style.display = 'block';
                    self.imagenode.src = self.boomimage;
                    planscore.innerHTML = scores;
                    pause();
                }
            }
        }
        if(enemies[i].isdie == true){
            enemies[i].dietimes += 20;
            if(enemies[i].dietimes == enemies[i].dietime){
                mainDiv.removeChild(enemies[i].imagenode);
                enemies.splice(i,1);
            }
        }
    }
    if(mark%5 == 0){
        bullets.push(new Bullet(parseInt( self.imagenode.style.left )+31,parseInt(self.imagenode.style.top),6,14,'images/bullet1.png'));
    }
    for(var i=0;i<bullets.length;i++){
        bullets[i].move();
        if(bullets[i].imagenode.offsetTop<0){
            mainDiv.removeChild(bullets[i].imagenode);
            bullets.splice(i,1);
        }
    }
    for(var i=0;i<bullets.length;i++){      //如果将子弹的运动放在这个循环中，子弹的运动速度将会变得很慢
        for(var j=0;j<enemies.length;j++){
            if(enemies[j].isdie == false){
                var bulletnode = bullets[i].imagenode;
                var enemynode = enemies[j].imagenode;
                if(bulletnode.offsetLeft + bulletnode.offsetWidth >= enemynode.offsetLeft && enemynode.offsetLeft+enemynode.offsetWidth>=bulletnode.offsetLeft){
                    if(enemynode.offsetTop+enemynode.offsetHeight>=bulletnode.offsetTop && enemynode.offsetTop <= bulletnode.offsetTop+bulletnode.offsetHeight){
                        enemies[j].hp -= self.attack;
                        if(enemies[j].hp == 0){
                            enemies[j].isdie = true;
                            enemynode.src = enemies[j].boomimage;
                            scores = scores + enemies[j].score;
                           // console.log(enemies[j].score);
                            scorelabel.innerHTML = scores;
                        }
                        mainDiv.removeChild(bullets[i].imagenode);
                        bullets.splice(i,1);
                    }
                }
            }
        }
        
    }
}
//暂停
function pause(){
    clearInterval(timer);
    document.onmousemove = null;
}
//重来
function again(){
    location.reload(true);
}
document.onmousemove = mouseMove;
//鼠标移动事件函数
function mouseMove(ev){
    var e = window.event || ev;
    var x = e.clientX - 500;
    var y = e.clientY;
    //console.log(x,y)
    if(x<0){
        x = 0;
    }
    if(x>mainDiv.offsetWidth){
        x = mainDiv.offsetWidth;
    }
    if(y<0){
        y = 0;
    }
    if(y>mainDiv.offsetHeight){
        y = mainDiv.offsetHeight
    }
    self.shift(x,y);
}
//阻止事件冒泡
function stopEventBubble(ev){
    var e = window.event || ev;
    if(e.stopPropagation){
        e.stopPropagation(e);
    }else{
        e.cancelBubble();
    }
}
document.onclick = function(){
    suspenddiv.style.display = 'block';
    pause();
}
function begin(ev){
    var e = window.event || ev;
    startdiv.style.display = 'none';
    mainDiv.style.display = 'block';
    scorediv.style.display = 'block';
    if(document.onmousemove == null){
        document.onmousemove = mouseMove;
    }
    timer = setInterval(start,20);
    stopEventBubble(e);
}
var aButton = suspenddiv.getElementsByTagName('button');
aButton[0].onclick = function(ev){
    var e = window.event || ev;
    timer = setInterval(start,20);
    suspenddiv.style.display = 'none';
    document.onmousemove = mouseMove;
    stopEventBubble(e);
};
aButton[1].onclick = function(ev){
    var e = window.event || ev;
    again();
    stopEventBubble(e);
}
aButton[2].onclick = function(ev){
    var e = window.event || ev;
    suspenddiv.style.display = 'none';
    mainDiv.style.display = 'none';
    startdiv.style.display = 'block';
    stopEventBubble(e);
}