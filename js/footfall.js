var n_p = 19;
var n_d = 365;
var centre = [300,300]
var offsets = [220,120];
var points;
var timer;
var clock_radius = 245;
var clock_width = 10;

var scale = 0.0025;

var tick_t = 100;
var tick_d = 0.5;

var running = false;
var dragging = false;

// start animation on a canvas
function start(idCanvas)
{
    var i = 0,
      pos;

    points = points || [];
  // initialise the canvas id (second parameter is fps)
    jc.clear(idCanvas);
    jc.start(idCanvas,25);
    // set up the dial 
    jc.circle(centre[0],centre[1],0,'rgba(12,12,12,1)',1).animate({radius:clock_radius+clock_width/2},tick_t*3)
        .shadow({ x:5, y:5, blur:15, color:'rgba(128,128,128,1.0)' });
    jc.circle(centre[0],centre[1],0,'rgba(255,255,255,1)',1).animate({radius:clock_radius-clock_width/2},tick_t*3);
    // set up the timer
    timer = jc.circle(centre[0],centre[1]-clock_radius,15,'rgba(12,12,12,1)',1)
        .shadow({ x:5, y:5, blur:15, color:'rgba(128,128,128,0.5)' });
    // p            .mousedown(function(){
    //                 this.color('#00ff00');
    //                             });
    //
    // set up the points
    //points = [jc.circle(pos[0]+offsets[0],pos[1]+offsets[1],0,'rgba(128,128,128,0.5)',1) for each (pos in pos_adj)];
    for (i = 0; i < pos_adj.length; i++) {
      pos = pos_adj[i];
      points[i] = jc.circle(pos[1] + offsets[1], 2 * centre[1] - (pos[0] + offsets[0]), 0, 'rgba(128, 128, 128, 0.5)', 1);
    }
    //points = [jc.circle(pos[1]+offsets[1],2*centre[1]-(pos[0]+offsets[0]),0,'rgba(128,128,128,0.5)',1) for each (pos in pos_adj)];
    // start
    running = true;
    set_day(0);
}

// stop animation on a canvas
function stop(idCanvas)
{
    running = false;
    jc.clear(idCanvas);
}

function pause()
{
    running = false;
}

function resume()
{
    running = true;
}

function set_day(d)
{
    if (d>=n_d) { d = 0; }
    if (!running)
    {
        window.setTimeout(function(){set_day(d)},5*tick_t);
        return;
    }
    // move the timer
    theta = (d/n_d+0.75)*(2*Math.PI);
    cx = clock_radius*Math.cos(theta) + centre[0];
    cy = clock_radius*Math.sin(theta) + centre[1];
    timer.animate({x:cx,y:cy},tick_t);

    yd_0 = Math.floor(d)%n_d;
    yd_1 = (yd_0+1)%n_d;
    yd_2 = (yd_0+2)%n_d;
    yd_3 = (yd_0+3)%n_d;
    t   = (d-yd_0)/3.0;

    for (var i = 0; i < n_p; i++)
    {
        y_0 = data[yd_0][i];
        y_1 = data[yd_1][i];
        y_2 = data[yd_2][i];
        y_3 = data[yd_3][i];

        c_y = 3*(y_1 - y_0);
        b_y = 3*(y_2 - y_1) - c_y;
        a_y = y_3 - y_0 - c_y - b_y;

        y_d = a_y*Math.pow(t,3) + b_y*Math.pow(t,2) + c_y*t + y_0;

        points[i].animate({radius:y_d*scale},tick_t);
    }
    window.setTimeout(function(){set_day(d>=data.length-1 ? 0 : d+tick_d)},tick_t);
}

