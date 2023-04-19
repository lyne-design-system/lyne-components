export class OverlayDOMController {
  /** The overlay component that will be attached/detached. */
  private _baseComponent: HTMLElement;

  /** A reference of the original position of the element. */
  private _reference: globalThis.Comment;

  public attachViewToDom(element: HTMLElement, containerId: string = null): void {
    this._baseComponent = element;

    /** Create a placeholder comment so that we can return this component to where it was previously. */
    this._reference = document.createComment(`${element.tagName} teleport`);
    this._baseComponent.parentNode.insertBefore(this._reference, this._baseComponent);

    // FIXME where the component should be attached?
    const container = containerId ? document.getElementById(containerId) : document.body;
    container.appendChild(this._baseComponent);
  }

  public removeViewFromDom(): void {
    /** Return component to where it was previously in the DOM. */
    if (this._baseComponent && this._reference) {
      this._reference.parentNode.insertBefore(this._baseComponent, this._reference);
      this._reference.remove();
    }
  }
}
