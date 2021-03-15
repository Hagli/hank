//for every funcs and procs that dont need dependencies

exports.time_count = function(second){//initiate hour and minute with 0
    let hour = 0;
    let minute = 0;
    second = (second/1000).toFixed(0);
    while (second > 3600){
        hour += 1;
        second -= 3600;
    }
    if (hour < 10){
        hour = "0" + hour;
    }
    while (second > 60){
        minute += 1;
        second -= 60;
    }
    if (minute < 10){
        minute = "0" + minute;
    }
    if (second < 10){
        second = "0" + second;
    }

    return hour + ":" + minute + ":" + second;
}