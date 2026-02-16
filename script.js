// Schichtdefinitionen
const shiftDefinitions = {
    'K1': { name: 'KTW 1', start: '06:00', end: '14:30', break: '0.5h' },
    'K2': { name: 'KTW 2/12', start: '07:30', end: '16:00', break: '0.5h' },
    'K3': { name: 'KTW 3', start: '08:30', end: '17:00', break: '0.5h' },
    'K4': { name: 'KTW 4', start: '09:00', end: '17:30', break: '0.5h' },
    'K5': { name: 'KTW 5', start: '10:30', end: '19:00', break: '0.5h' },
    'K6': { name: 'KTW 6', start: '08:30', end: '17:00', break: '0.5h' },
    'K7': { name: 'KTW 7/13', start: '07:30', end: '16:00', break: '0.5h' },
    'K8': { name: 'KTW 8', start: '09:00', end: '17:30', break: '0.5h' },
    'K9': { name: 'KTW 9/10/11', start: '09:30', end: '18:00', break: '0.5h' },
    'F': { name: 'Frühdienst', start: '05:30', end: '14:00', break: '0.5h' },
    'S': { name: 'Spätdienst', start: '13:30', end: '22:00', break: '0.5h' },
    'I': { name: 'Innendienst', start: '07:15', end: '18:00', break: '0.75h' },
    'SD': { name: 'Sonderdienst', start: '--:--', end: '--:--', break: '-' }
};

// Schichtdaten für Felix Schaar
let shiftData = {
    '2026-01': {
        19: 'K8',
        20: 'K8',
        21: 'K8',
        22: 'K8',
        23: 'K8',
        27: 'K2',
        28: 'K2',
        29: 'K2',
        30: 'K2',
        31: 'K9'
    },
    '2026-02': {
       2: 'K9',
       3: 'K9',
       4: 'K9',
       5: 'K9',
       6: 'K9',
       9: 'K2',
       10: 'K2',
       11: 'K2',
       12: 'K2',
       13: 'K2',
       16: 'K8',
       17: 'K8',
       18: 'K8',
       19: 'K8',
       20: 'K8',
       23: 'K7',
       24: 'K7',
       25: 'K7',
       26: 'K7',
       27: 'K7'
    },
    '2026-03': {
       2: 'K4',
       3: 'K4',
       4: 'K4',
       5: 'K4',
       6: 'K4',
       10: 'K9',
       11: 'K9',
       12: 'K9',
       13: 'K9',
       14: 'S',
       16: 'K8',
       17: 'K8',
       18: 'K8',
       19: 'K8',
       20: 'K8',
       23: 'K1',
       24: 'K1',
       25: 'K1',
       26: 'K1',
       27: 'K1',
       30: 'K4',
       31: 'K4'
    }
};

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    setupEventListeners();
    createLegend();
});

function initializeCalendar() {
    renderCalendar();
    updateMonthDisplay();
}

function setupEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
        updateMonthDisplay();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
        updateMonthDisplay();
    });
}

function updateMonthDisplay() {
    const monthNames = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    document.getElementById('currentMonth').textContent = 
        `${monthNames[currentMonth]} ${currentYear}`;
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Montag = 0

    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    // Leere Zellen für Tage vor dem ersten Tag des Monats
    for (let i = 0; i < startingDayOfWeek; i++) {
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const prevLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
        const dayNum = prevLastDay - startingDayOfWeek + i + 1;
        calendar.appendChild(createDayElement(dayNum, true, prevYear, prevMonth));
    }

    // Tage des aktuellen Monats
    const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = isCurrentMonth && day === today.getDate();
        calendar.appendChild(createDayElement(day, false, currentYear, currentMonth, monthKey, isToday));
    }

    // Leere Zellen für Tage nach dem letzten Tag des Monats
    const totalCells = startingDayOfWeek + daysInMonth;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
        for (let day = 1; day <= remainingCells; day++) {
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
            calendar.appendChild(createDayElement(day, true, nextYear, nextMonth));
        }
    }
}

function createDayElement(day, isOtherMonth, year, month, monthKey = null, isToday = false) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    if (isToday) {
        dayElement.classList.add('today');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);

    // Schichtinformationen hinzufügen
    if (monthKey && shiftData[monthKey] && shiftData[monthKey][day]) {
        const shiftCode = shiftData[monthKey][day];
        const shift = shiftDefinitions[shiftCode] || shiftDefinitions['SD'];
        
        dayElement.classList.add('has-shift');
        
        const shiftCodeElement = document.createElement('div');
        shiftCodeElement.className = 'shift-code';
        shiftCodeElement.textContent = shiftCode;
        dayElement.appendChild(shiftCodeElement);
        
        const shiftTimeElement = document.createElement('div');
        shiftTimeElement.className = 'shift-time';
        shiftTimeElement.textContent = `ab ${shift.start}`;
        dayElement.appendChild(shiftTimeElement);

        // Klick-Event für Details
        dayElement.addEventListener('click', () => {
            showShiftDetails(day, month + 1, year, shiftCode, shift);
        });
    }

    return dayElement;
}

function showShiftDetails(day, month, year, shiftCode, shift) {
    const detailsDiv = document.getElementById('shiftDetails');
    const monthNames = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    
    detailsDiv.innerHTML = `
        <p><strong>Datum:</strong> ${day}. ${monthNames[month - 1]} ${year}</p>
        <p><strong>Schicht:</strong> ${shiftCode} - ${shift.name}</p>
        <p><strong>Beginn:</strong> ${shift.start} Uhr</p>
        <p><strong>Ende:</strong> ${shift.end} Uhr</p>
        <p><strong>Pause:</strong> ${shift.break}</p>
    `;
}

function createLegend() {
    const legendContent = document.getElementById('legendContent');
    legendContent.innerHTML = '';

    Object.entries(shiftDefinitions).forEach(([code, shift]) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <strong>${code}</strong>
            <span>${shift.name} | ${shift.start} - ${shift.end} Uhr</span>
        `;
        legendContent.appendChild(legendItem);
    });
}

// Hilfsfunktion zum Hinzufügen von Schichtdaten (für manuelle Eingabe)
function addShiftData(year, month, day, shiftCode) {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    if (!shiftData[monthKey]) {
        shiftData[monthKey] = {};
    }
    shiftData[monthKey][day] = shiftCode;
    renderCalendar();
}

// Beispiel: Daten hinzufügen
// addShiftData(2026, 2, 1, 'K1');


