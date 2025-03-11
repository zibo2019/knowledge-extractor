declare module 'dom-to-image' {
  export interface DomToImageOptions {
    /**
     * 图片宽度
     */
    width?: number;
    /**
     * 图片高度
     */
    height?: number;
    /**
     * 样式对象
     */
    style?: Record<string, any>;
    /**
     * 背景颜色
     */
    bgcolor?: string;
    /**
     * 质量，范围0-1
     */
    quality?: number;
    /**
     * 缩放比例
     */
    scale?: number;
    /**
     * 图像类型
     */
    imagePlaceholder?: string;
  }

  /**
   * 将DOM节点转换为PNG图片
   * @param node DOM节点
   * @param options 配置选项
   * @returns Promise<string> 返回图片的dataURL
   */
  export function toPng(node: HTMLElement, options?: DomToImageOptions): Promise<string>;

  /**
   * 将DOM节点转换为JPEG图片
   * @param node DOM节点
   * @param options 配置选项
   * @returns Promise<string> 返回图片的dataURL
   */
  export function toJpeg(node: HTMLElement, options?: DomToImageOptions): Promise<string>;

  /**
   * 将DOM节点转换为SVG图片
   * @param node DOM节点
   * @param options 配置选项
   * @returns Promise<string> 返回图片的dataURL
   */
  export function toSvg(node: HTMLElement, options?: DomToImageOptions): Promise<string>;

  /**
   * 将DOM节点转换为Blob对象
   * @param node DOM节点
   * @param options 配置选项
   * @returns Promise<Blob> 返回图片的Blob对象
   */
  export function toBlob(node: HTMLElement, options?: DomToImageOptions): Promise<Blob>;

  /**
   * 将DOM节点转换为像素数据
   * @param node DOM节点
   * @param options 配置选项
   * @returns Promise<Uint8ClampedArray> 返回图片的像素数据
   */
  export function toPixelData(node: HTMLElement, options?: DomToImageOptions): Promise<Uint8ClampedArray>;

  export default {
    toPng,
    toJpeg,
    toSvg,
    toBlob,
    toPixelData
  };
} 