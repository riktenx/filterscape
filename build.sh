#!/bin/bash

echo "generating filterscape.rs2f..."

echo "" > filterscape.rs2f

cat highlights/module.rs2f >> filterscape.rs2f
cat hides/module.rs2f >> filterscape.rs2f
cat boss/generalgraardor/module.rs2f >> filterscape.rs2f
cat boss/commanderzilyana/module.rs2f >> filterscape.rs2f
cat boss/kriltsutsaroth/module.rs2f >> filterscape.rs2f
cat boss/kreearra/module.rs2f >> filterscape.rs2f
cat boss/nex/module.rs2f >> filterscape.rs2f
cat boss/vorkath/module.rs2f >> filterscape.rs2f
cat zulrah/module.rs2f >> filterscape.rs2f
cat muspah/module.rs2f >> filterscape.rs2f
cat cox/module.rs2f >> filterscape.rs2f
cat toa/module.rs2f >> filterscape.rs2f
cat unique/module.rs2f >> filterscape.rs2f
cat potion/module.rs2f >> filterscape.rs2f
cat value/module.rs2f >> filterscape.rs2f
cat currency/module.rs2f >> filterscape.rs2f
cat clue/module.rs2f >> filterscape.rs2f
cat herb/module.rs2f >> filterscape.rs2f

echo "done."
