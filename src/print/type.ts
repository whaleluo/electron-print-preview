export interface PdfCreateOptions {
    /**
     * Currently only inline styles are supported
     */
    htmlString?: string,
    /**
     * The address of the web page you want to generate a pdf
     */
    url?: string,
    /**
     * Standard model or Quirks mode
     * default 怪异模式
     */
    mode?: string
}

export interface PdfReloadOptions {
    isLandscape?: boolean,
    margin?: number,
    pageSize?: string,
    scaleFactor?:number
}

export interface configPdfOptions {
    /**
     * pdf window name
     */
    name?: string,
    /**
     * pdf window width
     */
    width?: number,
    /**
     * pdf window height
     */
    height?: number,

    /**
     * pdf window right controlPanel width
     */
    controlPanelWidth?: number,

    /**
     * defaultPageSize
     */
    defaultPageSize?: string,
    /**
     * defaultIsLandscape
     */
    defaultLandscape?: boolean,
    /**
     * defaultMargin
     */
    defaultMargin?: number,
    /**
     * defaultScaleFactor
     */
    defaultScaleFactor?:number
}
export interface HtmlConstruct {
    style?: string | undefined,
    script?: string | undefined,
}