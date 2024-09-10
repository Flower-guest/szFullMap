const TMap = (window as any).TMap;

// type any = TMap.LatLng;

class ClusterBubble extends TMap.DOMOverlay {
  private content: string;
  private map: any;
  private position: any;

  constructor(options: { map: any; content: string; position: any }) {
    super(options);
    this.map = options.map;
    this.content = options.content;
    this.position = options.position;
  }

  onInit(options: { content: string; position: any }): void {
    this.content = options.content;
    this.position = options.position;
  }

  onDestroy(): void {
    this.dom.removeEventListener("touchend", this.onTouchend);
    this.dom.removeEventListener("click", this.onClick);
    this.removeAllListeners();
  }

  onClick(): void {
    this.emit("click");
  }

  onTouchend(): void {
    this.emit("touchend");
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("div");
    dom.classList.add("clusterBubble");
    dom.innerText = this.content;
    dom.style.cssText = [
      // `width: ${40 + parseInt(this.content) * 2}px;`,
      // `height: ${40 + parseInt(this.content) * 2}px;`,
      `width: 46px;`,
      `height: 52px;`,
      `line-height: 46px;`,
    ].join(" ");

    this.onClick = this.onClick.bind(this);
    dom.addEventListener("click", this.onClick);
    this.onTouchend = this.onTouchend.bind(this);
    dom.addEventListener("touchend", this.onTouchend);
    return dom;
  }

  updateDOM(): void {
    if (!this.map) {
      return;
    }
    const pixel = this.map.projectToContainer(this.position);
    const left = pixel.getX() - this.dom.clientWidth / 2 + "px";
    const top = pixel.getY() - this.dom.clientHeight / 2 + "px";
    this.dom.style.transform = `translate(${left}, ${top})`;

    this.emit("dom_updated");
  }
}

export default ClusterBubble;
