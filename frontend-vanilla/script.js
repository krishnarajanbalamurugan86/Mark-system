// 1. JS Basics: Variables, Datatypes, typeof
var appMode = 'development'; // var
let recordCount = 0; // let
const API_BASE = 'http://localhost:3000/api'; // const

console.log('Type of appMode:', typeof(appMode));

// 13. Advanced JS: Classes, Objects, Constructors, Getters/Setters
class Record {
    constructor(id, name, subject, marks) {
        this._id = id;
        this.name = name;
        this.subject = subject;
        this.marks = marks; // Will be number due to conversion
    }
    
    get id() { return this._id; }
    set id(val) { this._id = val; }
    
    // 2. Functions with return
    displayFormat() {
        return `${this.name} - ${this.subject}: ${this.marks}`;
    }
}

// Ensure page is loaded (onload is inline in some cases, here via eventListener)
window.addEventListener('load', () => {
    initApp();
});

function initApp() {
    // 17 & 18. Read embedded XML string and parse
    const xmlString = document.getElementById('embeddedXml').textContent;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // 5. Content Manipulation via textContent
    const appName = xmlDoc.getElementsByTagName('appName')[0].textContent;
    document.getElementById('mainTitle').textContent = appName;
    
    // 14. Timing Functions: Digital Clock & Countdown
    setInterval(updateClock, 1000);
    startCountdown();
    
    // 12. Setup Event Listeners
    setupEvents();
}

function updateClock() {
    const now = new Date();
    document.getElementById('clockDisplay').textContent = now.toLocaleTimeString();
}

function startCountdown() {
    let count = 5;
    const countdownEl = document.getElementById('countdown');
    const timerId = setInterval(() => {
        count--;
        countdownEl.textContent = count;
        if (count <= 0) {
            clearInterval(timerId);
            // 9. Removing Elements
            document.getElementById('countdownContainer').remove();
            document.getElementById('formContainer').style.display = 'block';
        }
    }, 1000);
}

function setupEvents() {
    // 4. DOM Selectors
    const addBtn = document.querySelector('#addBtn');
    
    // 10. Advanced Event Handling using event object
    addBtn.addEventListener('click', function(event) {
        // Form inputs
        const nameInput = document.getElementById('studentName');
        const subjInput = document.getElementById('subject');
        const marksInput = document.querySelector('#marks');
        
        let mVal = marksInput.value;
        // 7. Type Conversion
        mVal = Number(mVal);
        
        if (nameInput.value && subjInput.value && !isNaN(mVal)) {
            recordCount++;
            const newRecord = new Record(recordCount, nameInput.value, subjInput.value, mVal);
            appendRecordUI(newRecord);
            
            // clear
            nameInput.value = ''; subjInput.value = ''; marksInput.value = '';
        } else {
            alert('Please fill valid data');
        }
    });

    const loadJsonBtn = document.getElementById('loadJsonBtn');
    // Using inline arrow functions
    loadJsonBtn.addEventListener('click', (e) => loadDataViaFetch(API_BASE + '/marks', 'json'));

    const loadXmlBtn = document.getElementById('loadXmlBtn');
    loadXmlBtn.addEventListener('click', (e) => loadDataViaFetch(API_BASE + '/marks-xml', 'xml'));
}

// 8. Element Manipulation & Creation
function appendRecordUI(recordObj) {
    const list = document.getElementById('marksList');
    
    const li = document.createElement('li');
    li.style.backgroundColor = recordObj.marks >= 50 ? '#d4edda' : '#f8d7da';
    
    // 5. innerHTML
    li.innerHTML = `<span>${recordObj.displayFormat()}</span>`;
    
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    // setAttribute
    delBtn.setAttribute('class', 'delete-btn');
    
    delBtn.addEventListener('click', function(e) {
        // 11. DOM Traversal (parentElement) & 9. Removing Element
        e.target.parentElement.remove();
    });
    
    // insertAdjacentElement usage (appends as last child implicitly via helper)
    li.insertAdjacentElement('beforeend', delBtn);
    list.appendChild(li);
}

function loadDataViaFetch(url, type) {
    fetch(url)
    .then(res => res.text())
    .then(data => {
        const out = document.getElementById('apiOutput');
        if (type === 'json') {
            const parsed = JSON.parse(data);
            out.textContent = `JSON Loaded: ${parsed.length} items`;
        } else if (type === 'xml') {
            const dp = new DOMParser();
            const xml = dp.parseFromString(data, "text/xml");
            const records = xml.getElementsByTagName('record');
            out.textContent = `XML Loaded: count = ${records.length}`;
        }
    })
    .catch(err => {
        document.getElementById('apiOutput').textContent = "Error fetching API (is backend running?)";
    });
}
