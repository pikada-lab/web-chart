import { CanvasController } from "./canvas.controller";
import { CanvasDrawer } from "./drawer/canvas.drawer"; 
import { LineController } from "./line.controller";

var drawer = new CanvasDrawer("canvas");
 
var controller = new LineController(drawer);
controller.test();