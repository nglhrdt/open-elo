# Trophy Generation

This directory contains OpenSCAD files for generating 3D-printable trophies for the Open ELO ranking system.

## Components

The trophy consists of two separate parts that fit together:

### Trophy Base (`trophy_base.scad`)
Creates the base pedestal with a socket for the number piece.

**Parameter:**
- `season_number` - The season number to display on the base (default: 1)

**Usage:**
```bash
openscad -o base.3mf -D "season_number=1" trophy_base.scad
```

### Trophy Number (`trophy_number.scad`)
Creates the rank number piece that inserts into the base.

**Parameter:**
- `rank` - The ranking position to display (default: 1)

**Usage:**
```bash
openscad -o number.3mf -D "rank=1" trophy_number.scad
```

## Assembly

1. Generate the base with the desired season number
2. Generate the number piece with the desired rank
3. The number piece has a foot that slots into the socket on the base
4. Print both pieces and assemble by inserting the number foot into the base socket

## Examples

Generate a trophy for Season 2, Rank 1:
```bash
openscad -o season2_base.3mf -D "season_number=2" trophy_base.scad
openscad -o rank1_number.3mf -D "rank=1" trophy_number.scad
```
