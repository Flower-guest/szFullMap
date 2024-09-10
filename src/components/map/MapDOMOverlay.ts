const TMap = (window as any).TMap;

class CustomOverlay extends TMap.DOMOverlay {
  mayDom: HTMLImageElement | null;
  position: any;
  src: string;
  width: number;
  height: number;
  id: string;
  name: string;

  constructor(options: any) {
    super(options);
    this.mayDom = null;
    this.position = options.position;
    this.src = options.src;
    this.width = options.width || 20;
    this.height = options.height || 20;
    this.id = options.id;
    this.name = options.name;
  }
  onInit(options: any) {
    this.position = options.position;
    this.src = options.src;
    this.width = options.width || 20;
    this.height = options.height || 20;
    this.id = options.id;
    this.name = options.name;
  }
  createDOM(): HTMLElement {
    this.mayDom = document.createElement("img");
    this.mayDom.style.cssText = `z-index:-1;width:${this.width}px;height:${this.height}px;position:absolute`;
    this.mayDom.src = this.src;
    this.onClick = () => {
      // DOMOverlay继承自EventEmitter，可以使用emit触发事件
      this.emit("click");
    };
    this.mayDom.addEventListener("click", this.onClick);
    return this.mayDom;
  }
  updateDOM() {
    if (!this.map) {
      return;
    }
    const pixel = this.map.projectToContainer(this.position);
    const width = this.dom.clientWidth / 2;
    const left = `${pixel.getX() - width}px`;
    const top = `${pixel.getY() - this.dom.clientHeight}px`;
    this.dom.style.transform = `translate(${left}, ${top})`;
  }
}

class DOMOverlay {
  geometries: any; //主要的精减数据
  map: any;
  DOMOverlay: any; //自定义覆盖物对象
  constructor(map: any, DOMoverlays: any) {
    this.geometries = [];
    this.DOMOverlay = [];
    this.map = map;
    if (DOMoverlays.length != 0) this.initDOMoverlays(DOMoverlays);
  }
  // 在后台获取到覆盖物数据初始化
  initDOMoverlays(DOMoverlays) {
    if (DOMoverlays) {
      for (const i in DOMoverlays) {
        this.add(DOMoverlays[i]);
      }
    }
  }
  // 添加
  add(val: any = "") {
    const position = new TMap.LatLng(val.position.lat, val.position.lng);
    const defaultDOM = {
      src: val.src,
      position: position,
      id: val.id,
      width: val.width,
      height: val.height,
      name: val.name,
    };
    this.DOMOverlay.push(new CustomOverlay({ ...defaultDOM, map: this.map }));
    this.geometries.push(defaultDOM);
  }
}

export default DOMOverlay;
