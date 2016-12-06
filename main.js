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
var docEle = document.documentElement;
var deviceWidth = docEle.clientWidth;
var deviceHeight = docEle.clientHeight;
//飞机类，基类
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
        setPosition(this.imagenode,x,y);
        this.imagenode.src = planeimage;
        this.boomimage = boomimage;
        mainDiv.appendChild(this.imagenode);
    }
    this.init();
    this.move = function(){
        var translateArr = getTranslate(this.imagenode),
            imagenodeTop = translateArr[5],
            imagenodeLeft = translateArr[4];

        if(scores<=50000){
            setPosition(this.imagenode,imagenodeLeft,imagenodeTop+this.speed);
        }
        else if(scores>50000&&scores<=100000){
            setPosition(this.imagenode,imagenodeLeft,imagenodeTop+this.speed+1);
        }
        else if(scores>100000&&scores<=150000){
            setPosition(this.imagenode,imagenodeLeft,imagenodeTop+this.speed+2);
        }
        else if(scores>150000&&scores<=200000){
            setPosition(this.imagenode,imagenodeLeft,imagenodeTop+this.speed+3);
        }
        else if(scores>200000&&scores<=300000){
            setPosition(this.imagenode,imagenodeLeft,imagenodeTop+this.speed+4);
        }
        else{
            setPosition(this.imagenode,imagenodeLeft,imagenodeTop+this.speed+5);
        }
    }
}
/**
 * 设置dom位移
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
function setPosition(el,x,y){
    var val = '';
    if(x !== null && y !== null){
        val = 'translate3d('+x+'px,'+y+'px,0)';
    }else if(x !== null){
        val = 'translate3d('+x+'px,0,0)';
    }else if(y !==null){
        val = 'translate3d(0,'+y+'px,0)';
    }
    //console.log(x,y,tran_val)
    el.style.transform = val;
}
/**获取渲染后的css样式,做兼容
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function getStyle(el,attr){
    return window.getComputedStyle?window.getComputedStyle(el,null)[attr]:el.getCurrentStyle[attr];
}
function getTranslateX(el){
    return getTranslate(el)[4];
}
function getTranslate(el){
    var attr = getStyle(el,'transform');
    var pattern = /\((.+)\)/;
    return pattern.exec(attr)?pattern.exec(attr)[1].split(',').map(function(el){
        return Number(el);
    }):[];
}
function getTranslateY(el){
    return getTranslate(el)[5];
}
function OurPlane(){//使用到单例模式
    this.boomimage = 'images/my_boom.gif';
    this.planeimage = 'images/my_plane.gif';
    this.width = 66;
    this.height = 88;
    this.x = (deviceWidth-this.width)/2;
    this.y = deviceHeight-this.height;
    Plane.call(this,1,this.x,this.y,this.width,this.height,0,660,0,this.boomimage,this.planeimage)
    this.shift = function(x,y){
        var imagenodeWidth = this.imagenode.offsetWidth,
            imagenodeHeight = this.imagenode.offsetHeight;

        setPosition(this.imagenode,x - imagenodeWidth/2,y - imagenodeHeight/2);
    }
    this.reset = function(){
        this.imagenode.src = this.planeimage;
        setPosition(this.imagenode,this.x,this.y);
    }
}
function getInstance(fn){
    var result;
    return function(){
        return result || (result = new fn());//fn 记得要有返回值
    }
}
var getOurPlane = getInstance(OurPlane);
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
        //console.log(x,y)
        setPosition(this.imagenode,x,y);
        mainDiv.appendChild(this.imagenode);
    }
    this.init();
    this.move = function(){
        var imagenodeTop = getTranslateY(this.imagenode);
        setPosition(this.imagenode,x,imagenodeTop - 20);
    }
}
var enemies = [];
var tobeCleared = [];
var self = getOurPlane();
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
    var selfnode = self.imagenode,
        selfnodeTrans = getTranslate(selfnode),
        selfnodeLeft = selfnodeTrans[4],
        selfnodeTop = selfnodeTrans[5],
        selfnodeWidth = selfnode.offsetWidth,
        selfnodeHeight = selfnode.offsetHeight;
    if(mark == 20){
        mark1++;
        if(mark1%5 == 0){
            enemies.push(new Enemy(6,0,274,46,60,5000,360,getRan(1,3),'images/middle_boom.gif','images/enemy3_fly_1.png'));
        }
        if(mark1 == 20){
            enemies.push(new Enemy(12,0,210,110,164,30000,540,1,'images/big_boom.gif','images/enemy2_fly_1.png'));
            mark1 = 0;
        }else{
            enemies.push(new Enemy(1,0,286,34,24,100,360,4,'images/small_boom.gif','images/enemy1_fly_1.png'));
        }
        mark = 0;
    }
    for(var i=0;i<enemies.length;i++){
        enemies[i].move();
        if(enemies[i].isdie == false){
            var enemynode = enemies[i].imagenode,
                enemynodeTrans = getTranslate(enemynode),
                enemynodeLeft = enemynodeTrans[4],
                enemynodeWidth = enemynode.offsetWidth,
                enemynodeTop = enemynodeTrans[5],
                enemynodeHeight = enemynode.offsetHeight;

            if(enemynodeTop >= mainDiv.offsetHeight){
                //mainDiv.removeChild(enemynode);
                tobeCleared.push(enemies.splice(i,1)[0]);
            }

            if(selfnodeLeft + selfnodeWidth >= enemynodeLeft && enemynodeLeft+enemynodeWidth>=selfnodeLeft){
                if(enemynodeTop+enemynodeHeight>=selfnodeTop && enemynodeTop <= selfnodeTop+selfnodeHeight){
                    enddiv.style.display = 'block';
                    self.imagenode.src = self.boomimage;
                    planscore.innerHTML = scores;
                    pause();
                    return false;
                }
            }
        }
        if(enemies[i].isdie == true){
            enemies[i].dietimes += 20;
            if(enemies[i].dietimes == enemies[i].dietime){
                //mainDiv.removeChild(enemies[i].imagenode);
                //enemies.splice(i,1);
                tobeCleared.push(enemies.splice(i,1)[0]);
            }
        }
    }
    if(mark%5 == 0){
        //console.log(selfnodeLeft,typeof selfnodeLeft,selfnodeLeft+31,selfnodeTop);
        bullets.push(new Bullet(selfnodeLeft+31,selfnodeTop,6,14,'images/bullet1.png'));
    }
    for(var i=0;i<bullets.length;i++){
        bullets[i].move();
        var bulletnode = bullets[i].imagenode;
        //console.log(getTranslateY( bulletnode ),bulletnode,getTranslate(bulletnode))
        if(getTranslateY( bulletnode )<0){
            //mainDiv.removeChild(bulletnode);
            //bullets.splice(i,1);
            tobeCleared.push(bullets.splice(i,1)[0]);
        }
    }
    for(var i=0;i<bullets.length;i++){      //如果将子弹的运动放在这个循环中，子弹的运动速度将会变得很慢
        for(var j=0;j<enemies.length;j++){
            if(bullets[i] && enemies[j].isdie == false){
                var bulletnode = bullets[i].imagenode,
                    enemynode = enemies[j].imagenode,
                    bulletnodeTrans = getTranslate(bulletnode),
                    enemynodeTrans = getTranslate(enemynode),
                    bulletnodeLeft = bulletnodeTrans[4],
                    bulletnodeTop = bulletnodeTrans[5],
                    bulletnodeWidth = bulletnode.offsetWidth,
                    bulletnodeHeight = bulletnode.offsetHeight,
                    enemynodeLeft = enemynodeTrans[4],
                    enemynodeTop = enemynodeTrans[5],
                    enemynodeWidth = enemynode.offsetWidth,
                    enemynodeHeight = enemynode.offsetHeight;

                if(bulletnodeLeft + bulletnodeWidth >= enemynodeLeft && enemynodeLeft+enemynodeWidth>=bulletnodeLeft){
                    if(enemynodeTop+enemynodeHeight>=bulletnodeTop && enemynodeTop <= bulletnodeTop+bulletnodeHeight){
                        enemies[j].hp -= self.attack;
                        if(enemies[j].hp == 0){
                            enemies[j].isdie = true;
                            enemynode.src = enemies[j].boomimage;
                            scores = scores + enemies[j].score;
                           // console.log(enemies[j].score);
                            scorelabel.innerHTML = scores;
                        }
                        //mainDiv.removeChild(bullets[i].imagenode);
                        //bullets.splice(i,1);
                        tobeCleared.push(bullets.splice(i,1)[0]);
                    }
                }
            }
        }
        
    }
    //统一清除掉需要消失的飞机或子弹
    for(var i=0;i<tobeCleared.length;i++){
        mainDiv.removeChild(tobeCleared.splice(i,1)[0].imagenode);
    }
    timer = window.requestAnimationFrame(start);
}
//暂停
function pause(){
    //clearInterval(timer);
    window.cancelAnimationFrame(timer);
    removeEvent(document,'touchmove',touchMove);
}
//清屏
function clearScreen(){
    for(var i=0,l=enemies.length;i<l;i++){
        maindiv.removeChild(enemies[i].imagenode);
    }
    for(var i=0,l=bullets.length;i<l;i++){
        maindiv.removeChild(bullets[i].imagenode);
    }
}
//重来
function again(){
    //location.reload(true);
    clearScreen();
    enemies = [];
    bullets = [];
    enddiv.style.display = 'none';
    self.reset();
    mark = 0;
    mark1 = 0;
    scores = 0;
    positionY = 0;
    timer = null;
    begin();
}
addEvent(document,'touchmove',touchMove);
function addEvent(el,type,handle){
    if(el.addEventListener){
        el.addEventListener(type,handle,false);
    }else if(el.attachEvent){
        el.attachEvent('on'+type,handle);
    }else{
        el['on'+type] = handle;
    }
}
function removeEvent(el,type,handle){
    if(el.removeEventListener){
        el.removeEventListener(type,handle,false);
    }else if(el.attachEvent){
        el.detachEvent('on'+type,handle);
    }
}
//鼠标移动事件函数
function touchMove(e){
    var x = e.touches[0].clientX;
    var y = e.touches[0].clientY;
    //console.log(x)
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
    e.preventDefault();
    return false;
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
addEvent(document,'click',function(){
    suspenddiv.style.display = 'block';
    pause();
});
function begin(ev){
    var e = window.event || ev;
    startdiv.style.display = 'none';
    mainDiv.style.display = 'block';
    scorediv.style.display = 'block';
    addEvent(document,'touchmove',touchMove);
    //timer = setInterval(start,20);
    timer = window.requestAnimationFrame(start);
    stopEventBubble(e);
}
var aButton = suspenddiv.getElementsByTagName('button');
addEvent(aButton[0],'click',function(ev){
    var e = window.event || ev;
    //timer = setInterval(start,20);
    timer = window.requestAnimationFrame(start);
    suspenddiv.style.display = 'none';
    addEvent(document,'touchmove',touchMove);
    stopEventBubble(e);
});
addEvent(aButton[1],'click',function(ev){
    var e = window.event || ev;
    again();
    suspenddiv.style.display = 'none';
    stopEventBubble(e);
});
addEvent(aButton[2],'click',function(ev){
    var e = window.event || ev;
    suspenddiv.style.display = 'none';
    mainDiv.style.display = 'none';
    startdiv.style.display = 'block';
    stopEventBubble(e);
});