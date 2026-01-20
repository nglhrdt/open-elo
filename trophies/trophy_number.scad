$fn=60;
base_height = 2;
foot_depth = 5;
foot_width = 25;
rank = 1;

trophy_number();

module trophy_number() {
    rank_text = str("#", rank);
    union() {
        linear_extrude(5) {
            text(rank_text, size = 18,  halign = "center", valign = "bottom");        
        }
        rotate([-90,0,0]) {
            translate([0, -foot_depth / 2, - base_height]) {
                foot();
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
