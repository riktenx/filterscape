#!/bin/bash

echo "generating filterscape.rs2f..."

echo "" > filterscape.rs2f

cat module/highlights/module.rs2f >> filterscape.rs2f
cat module/hides/module.rs2f >> filterscape.rs2f
cat module/boss/generalgraardor/module.rs2f >> filterscape.rs2f
cat module/boss/commanderzilyana/module.rs2f >> filterscape.rs2f
cat module/boss/kriltsutsaroth/module.rs2f >> filterscape.rs2f
cat module/boss/kreearra/module.rs2f >> filterscape.rs2f
cat module/boss/nex/module.rs2f >> filterscape.rs2f
cat module/boss/vorkath/module.rs2f >> filterscape.rs2f
cat module/zulrah/module.rs2f >> filterscape.rs2f
cat module/muspah/module.rs2f >> filterscape.rs2f
cat module/cox/module.rs2f >> filterscape.rs2f
cat module/toa/module.rs2f >> filterscape.rs2f
cat module/unique/module.rs2f >> filterscape.rs2f
cat module/potion/module.rs2f >> filterscape.rs2f
cat module/value/module.rs2f >> filterscape.rs2f
cat module/currency/module.rs2f >> filterscape.rs2f
cat module/clue/module.rs2f >> filterscape.rs2f
cat module/herb/module.rs2f >> filterscape.rs2f

echo "done."
