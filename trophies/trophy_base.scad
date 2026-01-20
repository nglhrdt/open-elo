$fn=60;
base_width = 50;
base_depth = 30;
height= 10;
base_height = 2;
top_width = base_width - 2 * height;
top_depth = base_depth - 2 * height;
top_height = 2;
socket_height = (base_width - top_width) / 2;
foot_depth = 5;
foot_width = 25;
season_number = 1;

tropy_base();

module tropy_base() {
    difference() {
        socket();
        translate([0, 0, socket_height]) foot();    
    }
    season_text();
}

module socket() {
    hull() {
        linear_extrude(base_height) {    
            hull (){
                translate([base_width / 2, base_depth / 2]) circle(2);
                translate([-base_width / 2, -base_depth / 2]) circle(2);
                translate([base_width / 2, -base_depth / 2]) circle(2);
                translate([-base_width / 2, base_depth / 2]) circle(2);
            }
        }

        translate([0, 0, socket_height]){
            linear_extrude(top_height) {  
                hull (){
                    translate([top_width / 2, top_depth / 2]) circle(2);
                    translate([-top_width / 2, -top_depth / 2]) circle(2);
                    translate([top_width / 2, -top_depth / 2]) circle(2);
                    translate([-top_width / 2, top_depth / 2]) circle(2);
                }    
            }
        }    
    }
}

module season_text() {
    season = str("SEASON", " ",  season_number);
    translate([0, -(base_depth / 2) + (height / 2) - top_height, top_height + socket_height / 2]) {
        rotate([45, 0, 0]) {
            linear_extrude(1) {
                text(season, size = 5, halign = "center", valign = "center" );
            }
        }
    }
}

module foot() {
    cube([foot_width, foot_depth, foot_depth], center = true);
    translate([0,0,-foot_depth]) {
        translate([foot_depth, 0]) cube([foot_depth, foot_depth, foot_depth], center = true);
        translate([-foot_depth, 0]) cube([foot_depth, foot_depth, foot_depth], center = true);
    }
}
