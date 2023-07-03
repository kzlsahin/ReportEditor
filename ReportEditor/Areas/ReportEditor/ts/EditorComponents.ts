export { Report, ReportHeading, ImgContainer, ImgLabel, IndexList, PageBreak, ImageBox }

class Report extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        // Element functionality written in here
    }
}
class PageBreak extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        // Element functionality written in here
    }
}

class ImageBox extends HTMLElement {
    link: string;
    _alt: string;
    _shadow : ShadowRoot;
    _imgElem : HTMLImageElement;
    constructor() {
        // Always call super first in constructor
        super();
        // Element functionality written in here
        this._imgElem = document.createElement("img");
        this._imgElem.style.width = "100%";
        this._shadow = this.attachShadow({ mode: "closed" });
        this._shadow.appendChild(this._imgElem);
    }
    static get observedAttributes() {
        return ['src', 'alt'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src') {
            this.link = newValue;
            this._imgElem.src = this.link;
        }
        else if (name === 'alt') {
            this._alt = newValue;
        }
    }
    connectedCallback() {

    }
}

class ImgLabel extends HTMLElement {
    _number: string;
    _numberField: HTMLSpanElement;
    _shadow: ShadowRoot;
    _prefix;
    _prefixField;
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });
        this._prefixField = document.createElement("SPAN");
        this._numberField = document.createElement("SPAN");
        this._shadow.appendChild(this._prefixField);
        this._shadow.appendChild(this._numberField);
        let slot = document.createElement("SLOT");
        slot.setAttribute("id", "text-field");
        slot.setAttribute("name", "text");
        this._shadow.appendChild(slot);

    }
    static get observedAttributes() {
        return ['editable', 'label-number', 'label-prefix'];
    }
    connectedCallback() {
        // browser calls this method when the element is added to the document
        // (can be called many times if an element is repeatedly added/removed)
        this._numberField.setAttribute("id", "number-field");
        this._prefixField.setAttribute("id", "prefix-field");
        this.setAttribute("class", "editable");
        this.number = "__";
        this.prefix = "Image";
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "label-number") {
            this.number = newValue;
            this.updateNumber();
        }
        else if (name === "label-prefix") {
            this.prefix = newValue;
            this.updatePrefix();
        }
        else if (name === "editable") {
            let textNode = (this.shadowRoot.querySelector('SLOT') as HTMLSlotElement).assignedElements()[0];
            (textNode as HTMLElement).setAttribute("contenteditable", newValue);
        }
    }

    updatePrefix() {
        this._prefixField.innerText = this.prefix;
    }

    updateNumber() {
        this._numberField.innerText = this.number;
    }

    get number() {
        return this._number
    }

    set number(value) {
        if (value.length < 1) {
            value = "__";
        }
        this._number = value;
    }
    get prefix() {
        return this._prefix;
    }

    set prefix(value) {
        if (value.length < 1) {
            value = "Image";
        }
        this._prefix = value;
    }

}

// ******************
class ImgContainer extends HTMLElement {
    _src: string;
    shadow: ShadowRoot;
    _imgDom: HTMLImageElement;
    _alt: string;

    constructor() {
        // Always call super first in constructor
        super();
        // Element functionality written in here
        this.shadow = this.attachShadow({ mode: "open" });
        this._imgDom = document.createElement("IMG") as HTMLImageElement;
    }

    static get observedAttributes() {
        return ['src', 'alt'];
    }

    connectedCallback() {
        this._imgDom.src = this.src;
        this._imgDom.alt = this.alt;
        this._imgDom.style.width = "100%";
        this._imgDom.style.height = "100%";
        this.shadow.appendChild(this._imgDom);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src') {
            this.src = newValue;
        }
        else if (name === 'alt') {
            this.alt = newValue;
        }
    }
    get alt() {
        return this._alt;
    }

    set alt(value) {
        this._alt = value;
        this._imgDom.alt = value;
    }
    get src() {
        return this._src;
    }

    set src(value) {
        this._src = value;
        this._imgDom.src = value;
    }
}

// *****************
class ReportHeading extends HTMLElement {
    heading: HTMLElement;
    secNumberSpan: HTMLSpanElement;
    _secNumber = "0. ";
    headingTextSpan: HTMLSpanElement;
    _headingText = "New Heading";
    shadow: ShadowRoot;
    _secLevel = 1;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.fillHeading();
    }

    static get observedAttributes() {
        return ['editable', 'sec-level', 'heading-text', 'sec-number'];
    }
    connectedCallback() {
        // browser calls this method when the element is added to the document
        // (can be called many times if an element is repeatedly added/removed)
        this.secNumberSpan.onclick = () => this.levelUp();
        this.secNumberSpan.style.cursor = "pointer";
        this.headingTextSpan.addEventListener("blur", () => this.setAttribute("heading-text", this.headingTextSpan.innerText));
        this.classList.add("report-editable");
    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'editable') {
            this.headingTextSpan.setAttribute('contenteditable', newValue);
        }
        else if (name === 'sec-level') {
            let seclev = Number(newValue);
            if (isNaN(seclev)) {
                seclev = 1;
            }
            this.secLevel = seclev;
        }
        else if (name === 'heading-text') {
            this.headingText = newValue;            
            ReportHeading.whenHeadingChanged();
        }
        else if (name === 'sec-number') {
            this.secNumber = newValue;
        }
    }
    set headingText(value) {
        this._headingText = value;
        this.headingTextSpan.innerHTML = value;
    }
    get headingText() {
        return this._headingText;
    }
    toString(): string {
        let str: string = this.secNumber;
        str += this.headingText;
        return str;
    }
    get secNumber() {
        return this._secNumber;
    }
    set secNumber(value) {
        if (value.length < 1) {
            value = "__";
        }
        this._secNumber = value;
        this.secNumberSpan.innerHTML = value;
        this.updateHeadingLevel();
    }
    get secLevel() {
        return this._secLevel;
    }

    set secLevel(value) {
        if (value > 6) {
            value = 1;
        } else if (value < 1) {
            value = 6;
        }
        this._secLevel = value;
        this.updateHeadingLevel();
        ReportHeading.whenLevelChanged();
    }

    levelUp = () => {
        this.secLevel--;
        this.setAttribute("sec-level", this.secLevel.toString());
    }

    levelDown = () => {
        this.secLevel++;        
        this.setAttribute("sec-level", this.secLevel.toString());
    }

    updateHeadingLevel() {
        let newHeading = document.createElement(`H${this._secLevel}`);
        this.shadow.replaceChild(newHeading, this.heading);
        newHeading.appendChild(this.secNumberSpan);
        newHeading.appendChild(this.headingTextSpan);
        this.heading = newHeading;        
    }

    fillHeading = () => {
        this.heading = document.createElement(`H${this._secLevel}`);

        this.secNumberSpan = document.createElement("SPAN");
        this.headingTextSpan = document.createElement("SPAN");

        this.secNumberSpan.classList.add("sec-number");
        this.secNumberSpan.innerHTML = this.secNumber;

        this.heading.appendChild(this.secNumberSpan);
        this.heading.appendChild(this.headingTextSpan);

        this.shadow.appendChild(this.heading);
    }

    static whenHeadingChanged() {
        // to be set by client code
    }
    static whenLevelChanged() {
        // to be set by client code
    }
}

class ReportParag extends HTMLParagraphElement {
    
    constructor() {
        // Always call super first in constructor
        super();
        
        // Element functionality written in here
    }
}

// *********
class IndexList extends HTMLElement {
    content;
    title = '';
    tocDepth = 2;
    constructor() {
        // Always call super first in constructor
        super();       
        // Element functionality written in here
    }
    connectedCallback() {
        this.innerHTML = '';
        this.addNewContent();
        this.classList.add("index-list");
        //this.addEventListener("focus", this.generate);
    }
    static get observedAttributes() {
        return ['toc-depth'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'toc-depth') {
            this.tocDepth = Number(newValue);
        }
    }
    addNewContent(){
        this.innerHTML = '';
        this.content = document.createElement('DIV');
        this.appendChild(this.content);
    }
    generate() {
        console.log("updating content list...");
        let headings = document.getElementsByTagName("report-heading");
        this.addNewContent();
        let lastLevel = [1];
        let container = document.createElement("OL");
        container.setAttribute('class', 'toc');
        this.content.appendChild(container);
        let lastContainer = [container];
        let idCounter = 0;
        for (let heading of headings) {

            let level = (heading as ReportHeading).secLevel;
            if (level > this.tocDepth) {
                continue;
            }

            let content = (heading as ReportHeading).toString();
            
            while (level > lastLevel[lastLevel.length-1]) {
                lastLevel.push(lastLevel[lastLevel.length - 1] + 1);
                let subContainer = document.createElement("OL");
                subContainer.setAttribute('class', 'toc');
                lastContainer[lastContainer.length - 1].appendChild(subContainer);
                lastContainer.push(subContainer);
            }
            while (level < lastLevel[lastLevel.length - 1]) {
                lastContainer.pop();
                lastLevel.pop();
            }

            let item = document.createElement("LI");            
            let anch = document.createElement('a');
            let id = `rep-heading-${idCounter++}`;
            //let line = document.createElement('span');
            //line.setAttribute('class', 'dotted=line');
            //let pageNum = document.createElement('span');
            //pageNum.setAttribute('class', 'toc-page-num');
            heading.setAttribute('id', id);
            anch.href = '#' + id;
            anch.innerHTML = content;
            item.appendChild(anch);
            //item.appendChild(line);
            /*item.appendChild(pageNum);*/
            lastContainer[lastContainer.length - 1].appendChild(item);
        }
    }

}
customElements.define("report-document", Report);
customElements.define("report-heading", ReportHeading);
customElements.define("img-container", ImgContainer);
customElements.define("img-label", ImgLabel);
customElements.define("report-index", IndexList);
customElements.define("page-break", PageBreak);
customElements.define("image-box", ImageBox);