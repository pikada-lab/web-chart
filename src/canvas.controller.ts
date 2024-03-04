import { Drawer } from "./drawer/drawer";
import { EventShape } from "./drawer/shapes/event.shape";
import { FrameShape } from "./drawer/shapes/frame.shape";
import {
  Dragable,
  Selectable,
  Shape,
  isDragable,
  isSelectable,
} from "./drawer/shapes/shape";
import { Point } from "./lib/geometry/point.geo";
import { Doc } from "./graph/doc";
import { dto } from "./model/testing/index.e2e.dto";
import { WebChart } from "./model/web-chart/web-chart";
import { Action } from "./editor/actions/action";
import { StandardCalendar } from "./model/calendar/standard-calendar";
import { ZoomDrawer } from "./drawer/zoom.drawer";

export class CanvasController {
  private move: boolean = false;
  private drawableObjects: Shape[] = [];
  private selected: Selectable[] = [];
  private drag: Dragable | null = null;
  private dragOffset: Point = Point.empty();
  private dragOriginal: Point = Point.empty();

  private doc: Doc | null = null;

  constructor(private readonly drawer: Drawer) {
    const btSave = document.getElementById("save");
    const btLoad = document.getElementById("load");
    const btTest = document.getElementById("test");
    btSave?.addEventListener("click", () => {
      this.onSave();
    });
    btLoad?.addEventListener("click", () => {
      this.onLoad();
    });
    btTest?.addEventListener("click", () => {
      this.test();
    });
    const canvas = document.getElementById(drawer.getId());
    canvas!.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.onWheel(e, new Point(e.offsetX, e.offsetY));
    });
    canvas!.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.onMousedown(new Point(e.offsetX, e.offsetY));
    });
    canvas!.addEventListener("mouseup", (e) => {
      e.preventDefault();
      this.onMouseup(new Point(e.offsetX, e.offsetY));
    });

    canvas!.addEventListener("mousemove", (e) => {
      e.preventDefault();
      this.onMousemove(new Point(e.offsetX, e.offsetY));
    });
    window!.addEventListener("keydown", (e) => {
      console.log(e);
      e.preventDefault();
      if (e.code === "KeyD") {
        // const name = prompt('Введите название работы');
        this.doc!.addEvent("!");
        this.clear();
        this.doc!.getShapes().forEach((s) => {
          this.addElement(s);
        });
        this.render();
      }
    });
  }
  onSave(): void {
    if (!this.doc) {
      return;
    }
    const doc = this.doc!.toJSON();
    localStorage.setItem(`doc${doc.id}`, JSON.stringify(doc));
  }

  onLoad(): void {
    const dtoString = localStorage.getItem("doc0");
    if (!dtoString) {
      console.log("Нет сохранённой копии");
      return;
    }
    const dto = JSON.parse(dtoString);
    const sut = Doc.Restore(dto, this.web());
    if (sut.isFailure) {
      console.log(sut.error);
      return;
    }
    this.clear();
    sut.value.getShapes().forEach((s) => {
      this.addElement(s);
    });
    const frame = new FrameShape();
    this.addElement(frame);
    this.render();
  }
  web(): WebChart {
    const wdto = structuredClone(dto);
    wdto.tasks.forEach((t) => {
      t.work.normal = t.work.normal.replace(/(m)/, "w");
    });
    const web = WebChart.Restore(wdto).value;
    console.table(web.getListOfWork(new Date(), new StandardCalendar()));
    return web;
  }

  test(): void {
    const frame = new FrameShape();
    this.doc = new Doc(this.web());
    this.doc.getShapes().forEach((s) => {
      this.addElement(s);
    });
    this.addElement(frame);
    this.render();
  }

  clear(): void {
    this.drawableObjects.length = 0;
  }

  addElement(s: Shape): void {
    this.drawableObjects.push(s);
  }

  render(): void {
    this.drawer.clear();
    this.drawableObjects.forEach((object) => {
      object.draw(this.drawer);
    });
  }

  onMousedown(point: Point): void {
    this.move = true;
    for (const object of this.drawableObjects) {
      if (!isSelectable(object)) {
        continue;
      }
      if (object.intersect(point)) {
        object.select(true);
        this.selected.push(object);

        if (isDragable(object)) {
          this.drag = object;
          this.dragOffset = Point.empty();
          this.dragOriginal = point;
          break;
        }
      } else {
        object.select(false);
        const index = this.selected.findIndex((shape) => shape === object);
        if (index !== -1) {
          this.selected.splice(index, 1);
        }
      }
    }
    this.render();
  }

  onMouseup(point: Point): void {
    this.move = false;
    if (this.drag) {
      this.drag.drop(this.dragOffset);
      this.drag = null;
    }
    this.render();
  }

  onMousemove(point: Point): void {
    if (this.move) {
      if (this.drag) {
        this.dragOffset = new Point(
          point.X - this.dragOriginal.X,
          point.Y - this.dragOriginal.Y,
        );
        this.drag.drag(this.dragOffset);
        this.render();
      }
    }
  }

  onWheel(e: WheelEvent, point: Point) {
    console.log(e.deltaY, point);
    if (this.drawer instanceof ZoomDrawer) {
      if (e.ctrlKey) {
        this.drawer.plusZoom(-e.deltaY / 1000);
      } else 
      if (e.shiftKey) {
        this.drawer.plusPan(Point.from([e.deltaY / 10, 0]))
      } else {
        this.drawer.plusPan(Point.from([0, e.deltaY / 10]))
      }
      this.render();
    }
  }
}
