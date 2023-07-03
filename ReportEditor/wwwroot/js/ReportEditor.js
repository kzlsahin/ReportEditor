var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ******
// Element Definitions
import { ReportHeading } from './EditorComponents.js';
ReportHeading.whenLevelChanged = () => {
    giveNumbersToHeadings();
};
ReportHeading.whenHeadingChanged = () => {
};
// ******
let SelectedElement;
let pageEditable = false;
let reportContainerId = "report";
let reportId;
let isInteractedBeforeSave = false;
const timer = {
    _seconds: 0,
    _next() {
        if (this._seconds++ == this.until) {
            this.do();
            console.log("autosave...");
        }
        this._timer = setTimeout(this._next.bind(this), 1000);
    },
    refresh() { this._seconds = 0; },
    _timer: null,
    start() { this._next(); },
    stop() { clearTimeout(this._timer); },
    until: 60,
    do: () => SaveReport()
};
const PageLoad = () => {
    console.log("page is loaded");
    let lastDocId = sessionStorage.getItem("LastDocId");
    if (lastDocId != null) {
        let id = +lastDocId;
        if (id > 0) {
            GetReportDocument(id);
        }
    }
};
window.onbeforeunload = () => {
    if (isInteractedBeforeSave) {
        storeReport();
    }
};
const TrashCanIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z M 8 9 L 10 9 L 10 20 L 8 20 L 8 9 z M 14 9 L 16 9 L 16 20 L 14 20 L 14 9 z" /></svg>`;
const paragNumarator = new class {
    constructor() {
        this._index = 0;
    }
    get next() {
        return ++this._index;
    }
};
const headNumarator = class {
    constructor() {
        this._index = [0, 0, 0, 0, 0, 0];
        this.lastLevel = 0;
    }
    next(hLevel) {
        if (hLevel < this.lastLevel) {
            for (let i = 0; i < 6; i++) {
                if (i > hLevel) {
                    this._index[i] = 0;
                }
            }
        }
        ++this._index[hLevel];
        this.lastLevel = hLevel;
        return [...this._index];
    }
};
const giveNumbersToHeadings = () => {
    let numarator = new headNumarator();
    let headings = document.getElementsByTagName("report-heading");
    for (let heading of headings) {
        let head = heading;
        let level = head.secLevel;
        let numbers = numarator.next(level - 1);
        let numberString = generateNumberString(numbers);
        heading.setAttribute("sec-number", numberString);
    }
};
const giveNumbersToImageLabels = () => {
    let numarator = new headNumarator();
    let labels = document.getElementsByTagName("img-label");
    for (let label of labels) {
        let level = 1;
        label = label;
        let nums = numarator.next(level - 1);
        let numStr = generateNumberString(nums);
        label.setAttribute("label-number", numStr);
    }
};
const generateNumberString = (numbers) => {
    let numStr = "";
    let levelFound = false;
    for (let number of numbers) {
        if (number <= 0) {
            if (levelFound) {
                break;
            }
            else {
                numStr += `_.`;
            }
        }
        else {
            levelFound = true;
            numStr += `${number}.`;
        }
    }
    if (numStr == "") {
        numStr = "0. ";
    }
    numStr += " ";
    return numStr;
};
const UpdateIndextable = () => {
    let elems = document.querySelectorAll('report-index');
    for (let elem of elems) {
        elem.generate();
    }
};
const startCheck = () => {
    checkEditable();
    numarateAllParagraphs();
};
const numarateAllParagraphs = () => {
    let elems = document.querySelectorAll("report-document .report-p");
    elems.forEach(el => {
        el.setAttribute("id", `rp-${paragNumarator.next}`);
    });
};
// be cautious, if forceToClose=true, this will work synchronously that can cause trouble
const changeEditMode = (forceToClose = false) => {
    console.log("edit mode change");
    SelectedElemChanged(null, true);
    giveNumbersToImageLabels();
    if (forceToClose) {
        console.log("forced to close");
        pageEditable = false;
        checkEditable();
        return;
    }
    console.log("edit mode is changed");
    new Promise(resolve => setTimeout(() => {
        pageEditable = !pageEditable;
        checkEditable();
    }, 100)).then(_ => isInteractedBeforeSave = true);
};
const checkEditable = () => {
    if (pageEditable === true) {
        openEditMode();
        document.getElementById("btn-editmode").innerText = "Edit Mode is Open";
    }
    else {
        closeEditModeContents();
        document.getElementById("btn-editmode").innerText = "Edit Mode is Closed";
    }
};
const makeParagraphsEditable = () => {
    let elemList = document.querySelectorAll("report-document P");
    elemList.forEach(el => {
        el.setAttribute("contenteditable", "");
    });
};
const makeSectionHeadsEditable = () => {
    let elemList = document.querySelectorAll("report-document .report-sec .report-heading");
    elemList.forEach(el => {
        el.setAttribute("contenteditable", "");
    });
    elemList = document.querySelectorAll("report-heading");
    elemList.forEach(el => {
        el.setAttribute("editable", "true");
    });
    elemList = document.querySelectorAll(".editable");
    elemList.forEach(el => {
        el.setAttribute("editable", "true");
    });
};
const closeParagraphToEdit = () => {
    let elemList = document.querySelectorAll("#report P");
    elemList.forEach(el => {
        el.setAttribute("contenteditable", "false");
    });
};
const closeSectionHeadsEditable = () => {
    let elemList = document.querySelectorAll("report-document .report-sec .report-heading");
    elemList.forEach(el => {
        el.setAttribute("contenteditable", "false");
    });
    elemList = document.querySelectorAll("report-heading");
    elemList.forEach(el => {
        el.setAttribute("editable", "false");
    });
    elemList = document.querySelectorAll(".editable");
    elemList.forEach(el => {
        el.setAttribute("editable", "false");
    });
};
const closeEditModeDivs = () => {
    let elemList = document.querySelectorAll(".editor-only");
    elemList.forEach(el => {
        el.style.display = 'none';
    });
    elemList = document.querySelectorAll(".out-edit-mode");
    elemList.forEach(el => {
        el.style.display = 'block';
    });
};
const openEditModeDivs = () => {
    let elemList = document.querySelectorAll(".out-edit-mode");
    elemList.forEach(el => {
        el.style.display = 'none';
    });
    elemList = document.querySelectorAll(".editor-only");
    elemList.forEach(el => {
        el.style.display = 'block';
    });
};
const openEditMode = () => {
    makeParagraphsEditable();
    makeSectionHeadsEditable();
    openEditModeDivs();
    timer.start();
    UpdateIndextable();
};
// don't call this method to close editmode
const closeEditModeContents = () => {
    //set timeout to let the engine close editor features
    timer.stop();
    closeParagraphToEdit();
    closeSectionHeadsEditable();
    closeEditModeDivs();
    UpdateIndextable();
};
const GetReportDocument = (id) => {
    let nId = +id;
    if (!id || nId < 1) {
        return;
    }
    fetch(`Editor/Report?id=${id}`, {
        method: "Post",
        cache: "no-store"
    }).then(response => response.text().then(inp => {
        if (response.ok) {
            reportId = id;
            sessionStorage.setItem("LastDocId", reportId);
            console.log(`document is recieved id: ${id}`);
            let reportContainer = document.getElementById(reportContainerId);
            reportContainer.innerHTML = inp;
            startCheck();
        }
    }));
};
const storeReport = () => __awaiter(void 0, void 0, void 0, function* () {
    yield changeEditMode();
    let data = document.getElementById("report").innerHTML;
    sessionStorage.setItem("report_backup", data);
});
const SaveReport = () => __awaiter(void 0, void 0, void 0, function* () {
    let isClosing = pageEditable ? true : false;
    // this is important to check is it editted before save or not
    yield changeEditMode(); // always close editMode before save!
    //also very important for closing of the controls before save
    if (!isClosing) {
        // do not save during opening
        return;
    }
    console.log("saving");
    let data = document.getElementById("report").innerHTML;
    fetch(`Editor/Save?reportId=${reportId}`, {
        method: "POST",
        cache: "no-store",
        body: data,
        headers: {
            "Content-type": "text/plain"
        }
    }).then(response => {
        if (response.ok) {
            isInteractedBeforeSave = false;
            console.log("document is saved.");
        }
    });
});
// ** Components
const NewParagraph = () => {
    let p = document.createElement("P");
    p.setAttribute("class", "report-p");
    if (pageEditable) {
        p.setAttribute("contenteditable", "");
    }
    p.setAttribute("id", `rp-${paragNumarator.next}`);
    return p;
};
const NewSection = (level) => {
    let l = Math.floor(level);
    //let s = document.createElement("ARTICLE");
    //s.setAttribute("class", `report-sec`);
    //s.appendChild(NewHeader(l));
    //SelectedElemChanged();
    let s = document.createElement("report-heading");
    s.setAttribute("class", `report-heading`);
    s.setAttribute("sec-level", `${l}`);
    s.setAttribute("heading-text", "New Section Heading");
    s.setAttribute("editable", (pageEditable == true).toString());
    SelectedElemChanged(null, true);
    return s;
};
//const NewHeader = (level: number, text = "New Heading"): HTMLElement => {
//    let l = Math.floor(level);
//    let h: HTMLHeadElement;
//    if (l < 0) { l = 1; }
//    if (l > 6) { l = 6; }
//    h = document.createElement(`h${l}`);
//    h.setAttribute("class", "report-h");
//    h.innerText = text;
//    if (pageEditable) {
//        h.setAttribute("contenteditable", "");
//    }
//    SelectedElemChanged();
//    return h;
//}
const NewBtnAddSection = (target) => {
    let btn = document.createElement("BUTTON");
    btn.innerText = "+section";
    btn.setAttribute("class", "btn-add-section");
    btn.addEventListener("click", () => { target.after(NewSection(1)); });
    return btn;
};
const NewBtnAddParagraph = (target) => {
    let btn = document.createElement("BUTTON");
    btn.innerText = "+paragraph";
    btn.setAttribute("class", "btn-add-paragraph");
    btn.addEventListener("click", () => {
        target.after(NewParagraph());
    });
    return btn;
};
const NewBtnRemove = (target) => {
    let btn = document.createElement("BUTTON");
    btn.innerHTML = TrashCanIcon;
    btn.setAttribute("class", "btn-delete");
    btn.addEventListener("click", () => {
        RemoveReportItem(SelectedElement);
    });
    return btn;
};
const NewUnderControl = (target) => {
    let c = document.createElement("DİV");
    c.appendChild(NewBtnAddParagraph(target));
    c.appendChild(NewBtnAddSection(target));
    c.appendChild(NewBtnRemove(target));
    c.setAttribute("class", "report-underControl");
    c.setAttribute("report-parag", target.id);
    return c;
};
// Sec Contorls
const NewBtnHeadLevelUp = (heading) => {
    let btn = document.createElement("BUTTON");
    btn.innerText = "head up";
    btn.setAttribute("class", "btn-sec-levelup");
    btn.addEventListener("click", () => { SectionlevelUp(heading); });
    return btn;
};
const NewBtnHeadLevelDown = (heading) => {
    let btn = document.createElement("BUTTON");
    btn.innerText = "head down";
    btn.setAttribute("class", "btn-sec-levelup");
    btn.addEventListener("click", () => { SectionlevelDown(heading); });
    return btn;
};
const NewSectionControl = (heading) => {
    let c = document.createElement("DİV");
    c.appendChild(NewBtnHeadLevelUp(heading));
    c.appendChild(NewBtnHeadLevelDown(heading));
    c.setAttribute("class", "report-secControl");
    return c;
};
// ** Controls
const RemoveReportItem = (item) => {
    setTimeout(() => {
        item.parentElement.removeChild(item);
    }, 100);
};
const SectionlevelDown = (secHeading) => secHeading.levelDown();
const SectionlevelUp = (secHeading) => secHeading.levelUp();
/*const SectionlevelDown = (secHeading: HTMLElement) => SectionlevelUp(secHeading, true);*/
// level up means h4 to h3 or h3 to h2 or h2 to h1 then h1 to h6 again
//const SectionlevelUp = (secHeader: HTMLElement, down = false) => {
//    let oldHeader = secHeader;
//    let level: number = Number(oldHeader.parentElement.getAttribute("sec-level"));
//    console.log(oldHeader);
//    console.log(`is going to be changed. Level is ${level}`);
//    if (down) {
//        if (level == 6) {
//            level = 1;
//        } else {
//            level++;
//        }
//    }
//    else {
//        if (level == 1) {
//            level = 6;
//        } else {
//            level--;
//        }
//    }
//    let newH = NewHeader(level, oldHeader.innerText);
//    let sec = oldHeader.parentElement;
//    sec.replaceChild(newH, oldHeader);
//    sec.setAttribute("sec-level", `${level}`);
//    SelectedElement;
//}
const AddSectionControls = (elem) => {
    elem.after(NewSectionControl(elem));
};
const RemoveSectionControls = (elem) => {
    var _a, _b;
    let control = (_a = elem === null || elem === void 0 ? void 0 : elem.parentNode) === null || _a === void 0 ? void 0 : _a.querySelector(".report-secControl");
    if (control) {
        (_b = elem === null || elem === void 0 ? void 0 : elem.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(control);
    }
};
const AddUnderControls = (elem) => {
    elem === null || elem === void 0 ? void 0 : elem.after(NewUnderControl(elem));
};
const RemoveUnderControls = (elem) => {
    var _a;
    let elems = elem === null || elem === void 0 ? void 0 : elem.parentNode.querySelectorAll(".report-underControl");
    if (elems == null) {
        return;
    }
    for (let item of elems) {
        (_a = elem === null || elem === void 0 ? void 0 : elem.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(item);
    }
};
// **
function SelectedElemChanged(event, unselectAll = false) {
    if (SelectedElement) {
        RemoveUnderControls(SelectedElement);
        RemoveSectionControls(SelectedElement);
    }
    if (unselectAll) {
        SelectedElement = null;
        return;
    }
    SelectedElement = event.target;
    if (SelectedElement.classList.contains("report-p")) {
        AddUnderControls(SelectedElement);
    }
    else if (SelectedElement.classList.contains("report-heading")) {
        AddUnderControls(SelectedElement);
        AddSectionControls(SelectedElement);
    }
}
const ClickHandler = (event) => {
    timer.refresh();
    let trg = event.target;
    trg.id;
    // only for editableMode
    if (!pageEditable)
        return;
    SelectedElemChanged(event, false);
};
const KeyHandler = (event) => {
    if (pageEditable) {
        timer.refresh();
    }
};
window.addEventListener("click", (event) => ClickHandler(event));
window.addEventListener("keydown", (event) => KeyHandler(event));
export { PageLoad, changeEditMode, SaveReport, GetReportDocument };
// 3. When the user prints the page, calculate which headings are visible on the printed page
window.onbeforeprint = () => {
    let visibleHeadings = [];
    let scrollTop = window.pageYOffset;
    let windowHeight = window.innerHeight;
    let headings = Array.from(document.querySelectorAll('report-heading'));
    // 2. Calculate the position of each heading element relative to the top of the page
    const headingPositions = headings.map((heading) => {
        let rect = heading.getBoundingClientRect();
        return rect.top + window.pageYOffset;
    });
    for (let i = 0; i < headingPositions.length; i++) {
        if (headingPositions[i] >= scrollTop && headingPositions[i] <= scrollTop + windowHeight) {
            visibleHeadings.push(headings[i]);
        }
    }
    // 4. Based on the position of the visible headings, estimate the page number of each heading and display it next to the heading
    let page = 1;
    let currentPageStart = 0;
    for (let i = 0; i < visibleHeadings.length; i++) {
        const rect = visibleHeadings[i].getBoundingClientRect();
        const headingTop = rect.top + window.pageYOffset;
        if (headingTop >= currentPageStart + windowHeight) {
            page++;
            currentPageStart += windowHeight;
        }
        const pageNumber = document.createElement('span');
        pageNumber.classList.add('page-number');
        pageNumber.innerText = `Page ${page}`;
        visibleHeadings[i].appendChild(pageNumber);
    }
};
// Remove page numbers when the print dialog is closed
window.onafterprint = () => {
    const pageNumbers = document.querySelectorAll('.page-number');
    pageNumbers.forEach((pageNumber) => {
        pageNumber.parentNode.removeChild(pageNumber);
    });
};
//# sourceMappingURL=ReportEditor.js.map