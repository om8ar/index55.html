// إضافة أسماء الطلاب
function loadAddStudentsPage() {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>إضافة أسماء الطلاب</h2>';

    // مسح الأسماء القديمة إذا كانت موجودة
    localStorage.removeItem('students');

    const studentListInput = document.createElement('textarea');
    studentListInput.placeholder = 'أدخل أسماء الطلاب، كل اسم في سطر منفصل';
    studentListInput.id = 'studentList';
    studentListInput.style.width = '100%';
    studentListInput.style.height = '150px';

    const saveButton = document.createElement('button');
    saveButton.innerText = 'حفظ الأسماء';
    saveButton.onclick = () => saveStudents(studentListInput.value);

    content.appendChild(studentListInput);
    content.appendChild(saveButton);
}

// حفظ أسماء الطلاب في Local Storage
function saveStudents(studentText) {
    const students = studentText.split('\n').map(name => name.trim()).filter(name => name);
    localStorage.setItem('students', JSON.stringify(students));
    alert('تم حفظ أسماء الطلاب');
}

// تسجيل الحضور
function loadAttendancePage() {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>تسجيل الحضور والغياب</h2>';

    const students = JSON.parse(localStorage.getItem('students')) || [];
    if (students.length === 0) {
        alert('يرجى إضافة أسماء الطلاب أولاً');
        return;
    }

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'attendanceDate';
    content.appendChild(dateInput);

    students.forEach((student, index) => {
        const studentRow = document.createElement('div');
        studentRow.className = 'student-row';

        const studentName = document.createElement('span');
        studentName.innerText = student;

        const presentRadio = document.createElement('input');
        presentRadio.type = 'radio';
        presentRadio.name = `attendance${index}`;
        presentRadio.value = '✔️';

        const absentRadio = document.createElement('input');
        absentRadio.type = 'radio';
        absentRadio.name = `attendance${index}`;
        absentRadio.value = '❌';

        studentRow.appendChild(studentName);
        studentRow.appendChild(presentRadio);
        studentRow.appendChild(absentRadio);
        content.appendChild(studentRow);
    });

    const saveButton = document.createElement('button');
    saveButton.innerText = 'حفظ الحضور';
    saveButton.onclick = () => saveAttendance(students.length, dateInput.value);
    content.appendChild(saveButton);
}

// حفظ بيانات الحضور
function saveAttendance(studentCount, date) {
    const attendance = [];
    for (let i = 0; i < studentCount; i++) {
        const status = document.querySelector(`input[name="attendance${i}"]:checked`);
        attendance.push(status ? status.value : '❌');
    }

    if (attendance.length === 0) {
        alert('يرجى تحديد الحضور أو الغياب لكل طالب');
        return;
    }

    const dateKey = `attendance-${date}`;
    localStorage.setItem(dateKey, JSON.stringify(attendance));
    alert('تم حفظ الحضور');
}

// عرض التقارير
function loadReportPage() {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>عرض التقرير</h2>';

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    content.appendChild(dateInput);

    const generateReportButton = document.createElement('button');
    generateReportButton.innerText = 'عرض التقرير';
    generateReportButton.onclick = () => generateReport(dateInput.value);
    content.appendChild(generateReportButton);
}

// توليد التقرير
function generateReport(date) {
    const content = document.getElementById('content');
    content.innerHTML = `<h2>تقرير الحضور بتاريخ ${date}</h2>`;

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const attendance = JSON.parse(localStorage.getItem(`attendance-${date}`)) || [];

    students.forEach((student, i) => {
        const studentRow = document.createElement('div');
        studentRow.className = 'student-report';

        const studentName = document.createElement('span');
        studentName.className = 'student-name';
        studentName.innerText = student;

        const status = attendance[i] || '❌';
        const statusLabel = document.createElement('span');
        statusLabel.innerText = ` : ${status}`;

        studentRow.appendChild(studentName);
        studentRow.appendChild(statusLabel);
        content.appendChild(studentRow);
    });
}
