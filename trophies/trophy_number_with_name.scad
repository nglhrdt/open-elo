$fn=256;
base_height = 2;
foot_depth = 4.5;
foot_width = 24;
rank = 3;
player_name = "FabianG";

trophy_number();

module trophy_number() {
    union() {
        linear_extrude(foot_depth) {
            rank_text = str("#", rank);
            text(rank_text, size = foot_width,  halign = "center", valign = "center");        
            difference(){
                circle(foot_width);
                circle(foot_width - 2);
            }      
        
            difference() {
                translate([0, -18.7, 0]) square([40,15], center = true);
                difference() {
                        circle(50);
                        circle(foot_width);
                }
            }
            
        }
        translate([0,- foot_width + 2, foot_depth / 2]) rotate([-90,0,0]) foot();
        
    }
    linear_extrude(foot_depth + 0.4) 
    translate([0, -15.5]) 
    text(player_name, size = 5,  halign = "center", valign = "center"); 
}

module foot() {
    cube([foot_width, foot_depth, foot_depth], center = true);
    translate([0,0,-foot_depth]) {
        translate([foot_depth, 0]) cube([foot_depth, foot_depth, foot_depth], center = true);
        translate([-foot_depth, 0]) cube([foot_depth, foot_depth, foot_depth], center = true);
    }
}
