```javascript
// ==========================================
// PHẦN 1: HỆ THỐNG CẤU HÌNH & DATABASE NHỎ (Tab Config)
// ==========================================
const CONFIG_SHEET_NAME = 'Config';
const REPORTS_SHEET_NAME = 'Reports'; // Sheet lưu trữ Báo Cáo Tuần
// (TỰ ĐỘNG) Lấy ID của file Google Sheet hiện tại nếu script được nhúng vào file
// Bạn không cần thay đổi nếu đang gắn script này trực tiếp vào file Sheet!
// Nếu bạn chạy standalone, hãy điền ID của file Google Sheet vào biến này.
const FORM_SHEET_ID = ''; 
const FORM_TAB_GID = '';

function setupConfigSheet() {
  const ss = FORM_SHEET_ID ? SpreadsheetApp.openById(FORM_SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG_SHEET_NAME);
    sheet.appendRow(['Key', 'Value_JSON', 'Last Updated']);
    sheet.setFrozenRows(1);
    sheet.getRange("A1:C1").setFontWeight("bold").setBackground("#d9ead3");
  }
  return sheet;
}

function setupReportsSheet() {
  const ss = FORM_SHEET_ID ? SpreadsheetApp.openById(FORM_SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Không thể tìm thấy Google Sheet.");
  
  let sheet = ss.getSheetByName(REPORTS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(REPORTS_SHEET_NAME);
    sheet.appendRow(["MSSV", "Họ Tên Sinh Viên", "Tên Công Ty", "Tuần số", "Nội dung báo cáo (HTML)", "Thời gian nộp"]);
    sheet.getRange("A1:F1").setFontWeight("bold").setBackground("#f3f4f6");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(5, 500); // Mở rộng cột báo cáo
  }
  return sheet;
}

function setConfigValue(key, valueObj) {
  const sheet = setupConfigSheet();
  const data = sheet.getDataRange().getValues();
  const jsonValue = JSON.stringify(valueObj);
  const timestamp = new Date().toISOString();
  
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) { rowIndex = i + 1; break; }
  }
  
  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 2, 1, 2).setValues([[jsonValue, timestamp]]);
  } else {
    sheet.appendRow([key, jsonValue, timestamp]);
  }
}

function getConfigValue(key) {
  const sheet = setupConfigSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      try { return JSON.parse(data[i][1]); } catch(e) { return null; }
    }
  }
  return null;
}

function getFormResponseSheet() {
  const ss = FORM_SHEET_ID ? SpreadsheetApp.openById(FORM_SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Không thể tìm thấy Google Sheet. Đảm bảo script được gắn vào Google Sheet hoặc FORM_SHEET_ID được cung cấp.");
  
  const sheets = ss.getSheets();
  if (FORM_TAB_GID) {
    for (let i = 0; i < sheets.length; i++) {
       if (sheets[i].getSheetId() == FORM_TAB_GID) return sheets[i];
    }
  }
  
  // Tự động tìm tab nào đang được liên kết với Form
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getFormUrl()) return sheets[i];
  }
  
  // Nếu không thấy form, mặc định lấy sheet đầu tiên
  return sheets[0];
}

// ==========================================
// PHẦN 2: TRIGGER GỬI EMAIL KHI LỐ SLOT (ĐÃ NÂNG CẤP ĐỘNG)
// ==========================================
function onFormSubmit(e) {
  const sheet = e.range.getSheet();
  const row = e.range.getRow();
  const lastCol = sheet.getLastColumn();
  
  const rowData = sheet.getRange(row, 1, 1, lastCol).getValues()[0];
  const rowStr = rowData.join(' ').toUpperCase();
  
  // TỰ ĐỘNG lấy danh sách công ty từ Cấu Hình Web
  const customCompanies = getConfigValue('customCompanies') || [];
  
  let matchedCompany = null;
  let maxSlots = 0;
  
  for (const c of customCompanies) {
    if (rowStr.includes(c.name.trim().toUpperCase())) {
      matchedCompany = c.name;
      maxSlots = c.totalSlots || 0;
      break;
    }
  }
  
  if (!matchedCompany) return;
  
  const allData = sheet.getRange(2, 1, row - 1, lastCol).getValues();
  let validCount = 0;
  
  for (let i = 0; i < allData.length - 1; i++) {
    const prevRowStr = allData[i].join(' ').toUpperCase();
    if (!prevRowStr.includes('RỚT') && prevRowStr.includes(matchedCompany.toUpperCase())) {
      validCount++;
    }
  }
  
  if (validCount + 1 > maxSlots && maxSlots > 0) {
    // 1. Tô màu đỏ nguyên dòng
    sheet.getRange(row, 1, 1, lastCol).setBackground('#fce8e6');
    
    // 2. Chèn chữ "[RỚT DO HẾT SLOT]" vào ô công ty (hoặc ô ghi chú cuối cùng)
    sheet.getRange(row, lastCol).setValue('[RỚT DO HẾT SLOT] ' + sheet.getRange(row, lastCol).getValue());
    
    // 3. Gửi email thông báo cho sinh viên
    let studentEmail = "";
    for (let c = 0; c < rowData.length; c++) {
      if (typeof rowData[c] === 'string' && rowData[c].includes('@')) {
        studentEmail = rowData[c];
        break;
      }
    }
    
    if (studentEmail) {
      MailApp.sendEmail({
        to: studentEmail,
        subject: "Thông báo Đăng ký Thực tập Cơ Điện Tử",
        htmlBody: `
          <h3>Chào bạn,</h3>
          <p>Hệ thống ghi nhận bạn đăng ký vào công ty <b>${matchedCompany}</b>.</p>
          <p>Tuy nhiên công ty này <b>ĐÃ HẾT SLOT</b> trước khi bạn kịp đăng ký.</p>
          <p>Vui lòng quay lại website để chọn công ty khác.</p>
          <p>Trân trọng.</p>
        `
      });
    }
  }
}

// ==========================================
// PHẦN 3: API CHO WEB REACT (POST & GET)
// ==========================================
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    // --- API QUẢN LÝ CÔNG TY ---
    if (action === 'updateCompanies') {
      setConfigValue('customCompanies', payload.companies);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (action === 'getCompanies') {
      const companies = getConfigValue('customCompanies') || [];
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', companies: companies }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // --- API CẬP NHẬT CẤU HÌNH WEB ---
    if (action === 'updateWebConfig') {
      setConfigValue('webConfig', payload.config);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (action === 'updateGuide') {
      setConfigValue('internshipGuide', payload.guide);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // --- API LẤY DANH SÁCH ĐĂNG KÝ ---
    if (action === 'getRegistrations') {
      const sheet = getFormResponseSheet();
      if (!sheet) throw new Error("Không tìm thấy Tab Câu Trả Lời");
      const data = sheet.getDataRange().getValues();
      if (data.length < 2) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', registrations: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      const regs = [];
      const headers = data[0].map(h => String(h).toUpperCase().trim());
      
      let colMssv = -1, colName = -1, colCompany = -1, colPhone = -1, colEmail = -1, colClass = -1;
      for(let j = 0; j < headers.length; j++) {
        if(headers[j].includes('MSSV') || headers[j].includes('MÃ SỐ') || headers[j] === 'STUDENT ID') colMssv = j;
        else if(headers[j].includes('HỌ VÀ TÊN') || headers[j].includes('HỌ TÊN') || headers[j] === 'NAME') colName = j;
        else if(headers[j].includes('CÔNG TY') || headers[j] === 'COMPANY') colCompany = j;
        else if(headers[j].includes('ĐIỆN THOẠI') || headers[j].includes('SĐT') || headers[j].includes('PHONE')) colPhone = j;
        else if(headers[j].includes('EMAIL')) colEmail = j;
        else if(headers[j].includes('LỚP') || headers[j] === 'CLASS') colClass = j;
      }

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const rowStr = row.join(' ').toUpperCase();
        if (rowStr.includes('RỚT DO HẾT SLOT')) continue; // Bỏ qua bị loại

        let mssv = colMssv !== -1 ? String(row[colMssv]) : '';
        let name = colName !== -1 ? String(row[colName]) : '';
        let company = colCompany !== -1 ? String(row[colCompany]) : '';
        let phone = colPhone !== -1 ? String(row[colPhone]) : '';
        let email = colEmail !== -1 ? String(row[colEmail]) : '';
        let clss = colClass !== -1 ? String(row[colClass]) : '';

        // Nếu header không đúng, dùng fallback tìm theo regex
        if(!mssv && !name && !company) {
          for (let j = 0; j < row.length; j++) {
            const cell = String(row[j]).trim();
            if (/^(201|202)[0-9]{5}$/.test(cell)) mssv = cell;
            else if (cell.includes('@')) email = cell;
            else if (/^(0|\+84)[0-9]{8,9}$/.test(cell)) phone = cell;
            else if (cell.length > 5 && cell.length < 30 && !cell.includes('@')) {
               const customCompanies = getConfigValue('customCompanies') || [];
               for (const c of customCompanies) {
                 if (cell.toUpperCase().includes(c.name.toUpperCase())) {
                   company = c.name;
                   break;
                 }
               }
               if (!company && cell.length < 25 && /^[\\p{L}\\s]+$/u.test(cell)) name = cell;
            }
          }
        }

        if (mssv || name || company) {
          let regDate = new Date().toISOString();
          if (row[0]) {
            try {
              const parsed = new Date(row[0]);
              if (!isNaN(parsed.getTime())) {
                regDate = parsed.toISOString();
              }
            } catch(e) {}
          }
          regs.push({
            id: 'row_' + (i + 1),
            rowIndex: i + 1,
            studentId: mssv,
            studentName: name,
            studentPhone: phone,
            studentEmail: email,
            internClass: clss,
            companyName: company,
            registeredAt: regDate
          });
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', registrations: regs }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // --- API XÓA ĐĂNG KÝ (XÓA KHỎI FORM VÀ XÓA KHỎI SHEET) ---
    if (action === 'deleteRegistration') {
      const sheet = getFormResponseSheet();
      if (!sheet) throw new Error("Không tìm thấy Tab Câu Trả Lời");
      const rowIndex = payload.rowIndex;
      
      try {
        const formUrl = sheet.getFormUrl();
        if (formUrl) {
          const form = FormApp.openByUrl(formUrl);
          // Lấy Timestamp của người bị xóa (Cột A)
          const timestampToMatch = sheet.getRange(rowIndex, 1).getValue();
          
          if (timestampToMatch && timestampToMatch instanceof Date) {
            const responses = form.getResponses();
            // Duyệt ngược để tìm bản ghi (tối ưu hiệu suất vì các bản ghi mới nằm cuối)
            for (let i = responses.length - 1; i >= 0; i--) {
              const res = responses[i];
              // Google Form và Sheet có thể lệch nhau vài ms, cho phép sai số 2 giây (2000ms)
              if (Math.abs(res.getTimestamp().getTime() - timestampToMatch.getTime()) < 2000) {
                form.deleteResponse(res.getId());
                break;
              }
            }
          }
        }
      } catch (e) {
        // Bỏ qua lỗi nếu Google Form không link trực tiếp hoặc thiếu quyền quản lý Form
        console.error("Không thể xóa trên Form: ", e);
      }
      
      // Sau khi xóa trên Form (nếu được), thực hiện XÓA DÒNG trên Google Sheet
      sheet.deleteRow(rowIndex);
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // --- API NỘP BÁO CÁO TUẦN (CỦA SINH VIÊN) ---
    if (action === 'submitStudentReport') {
      const sheet = setupReportsSheet();
      const mssv = payload.mssv;
      const weekNumber = payload.weekNumber;
      const studentName = payload.studentName;
      const companyName = payload.companyName;
      const content = payload.content;
      
      const data = sheet.getDataRange().getValues();
      let foundRow = -1;
      
      for(let i=1; i<data.length; i++) {
        if(String(data[i][0]).toUpperCase() === String(mssv).toUpperCase() && data[i][3] == weekNumber) {
          foundRow = i + 1;
          break;
        }
      }
      
      const timestamp = new Date().toISOString();
      if(foundRow > -1) {
        sheet.getRange(foundRow, 5).setValue(content);
        sheet.getRange(foundRow, 7).setValue(timestamp);
      } else {
        sheet.appendRow([mssv, studentName, companyName, weekNumber, content, '', timestamp]);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // --- API NỘP ĐÁNH GIÁ (CỦA DOANH NGHIỆP) ---
    if (action === 'submitCompanyEvaluation') {
      const sheet = setupReportsSheet();
      const mssv = payload.mssv;
      const weekNumber = payload.weekNumber;
      const content = payload.content;
      
      const data = sheet.getDataRange().getValues();
      let foundRow = -1;
      
      for(let i=1; i<data.length; i++) {
        if(String(data[i][0]).toUpperCase() === String(mssv).toUpperCase() && data[i][3] == weekNumber) {
          foundRow = i + 1;
          break;
        }
      }
      
      const timestamp = new Date().toISOString();
      if(foundRow > -1) {
        sheet.getRange(foundRow, 6).setValue(content);
        sheet.getRange(foundRow, 7).setValue(timestamp);
      } else {
        sheet.appendRow([mssv, '', '', weekNumber, '', content, timestamp]);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // --- API NỘP ĐÁNH GIÁ CHUNG CHO TẤT CẢ SINH VIÊN (CỦA DOANH NGHIỆP) ---
    if (action === 'submitCompanyGeneralEvaluation') {
      const sheet = setupReportsSheet();
      const mssvs = payload.mssvs || [];
      const weekNumber = payload.weekNumber;
      const content = payload.content;
      
      const data = sheet.getDataRange().getValues();
      const timestamp = new Date().toISOString();
      
      for (let mssv of mssvs) {
        let foundRow = -1;
        for(let i = 1; i < data.length; i++) {
          if(String(data[i][0]).toUpperCase() === String(mssv).toUpperCase() && data[i][3] == weekNumber) {
            foundRow = i + 1;
            break;
          }
        }
        
        if(foundRow > -1) {
          sheet.getRange(foundRow, 6).setValue(content);
          sheet.getRange(foundRow, 7).setValue(timestamp);
        } else {
          sheet.appendRow([mssv, '', '', weekNumber, '', content, timestamp]);
          // Cập nhật lại biến data vì đã có thêm dòng mới
          // Tuy nhiên để tối ưu tốc độ, với mảng mssv lớn có thể sẽ chậm, nhưng với số lượng sinh viên 1 công ty < 50 thì ổn định.
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // --- API ĐĂNG KÝ VÀ KHAI BÁO CÔNG TY NGOÀI ---
    if (action === 'register' || action === 'submitExternalRegistration') {
      const sheet = getFormResponseSheet();
      if (!sheet) throw new Error("Không tìm thấy Tab Câu Trả Lời");
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).toUpperCase().trim());
      
      let colMssv = -1, colName = -1, colCompany = -1, colPhone = -1, colEmail = -1, colClass = -1, colSkills = -1, colNotes = -1;
      for(let j = 0; j < headers.length; j++) {
        if(headers[j].includes('MSSV') || headers[j].includes('MÃ SỐ') || headers[j] === 'STUDENT ID') colMssv = j;
        else if(headers[j].includes('HỌ VÀ TÊN') || headers[j].includes('HỌ TÊN') || headers[j] === 'NAME') colName = j;
        else if(headers[j].includes('CÔNG TY') || headers[j] === 'COMPANY') colCompany = j;
        else if(headers[j].includes('ĐIỆN THOẠI') || headers[j].includes('SĐT') || headers[j].includes('PHONE')) colPhone = j;
        else if(headers[j].includes('EMAIL')) colEmail = j;
        else if(headers[j].includes('LỚP') || headers[j] === 'CLASS') colClass = j;
        else if(headers[j].includes('KỸ NĂNG') || headers[j].includes('KỲ VỌNG')) colSkills = j;
        else colNotes = headers.length - 1; // Mặc định cột cuối là Ghi chú
      }
      
      const newRow = new Array(headers.length).fill('');
      newRow[0] = new Date().toISOString(); // Timestamp
      if(colMssv > -1) newRow[colMssv] = payload.studentId || '';
      if(colName > -1) newRow[colName] = payload.studentName || '';
      if(colPhone > -1) newRow[colPhone] = payload.phone || '';
      if(colEmail > -1) newRow[colEmail] = payload.email || '';
      if(colClass > -1) newRow[colClass] = payload.internClass || '';
      if(colSkills > -1) newRow[colSkills] = payload.expectedSkills || '';
      if(colCompany > -1) newRow[colCompany] = payload.companyName || '';
      
      if (action === 'submitExternalRegistration') {
        const extNotes = "Công ty ngoài. Đ/c: " + (payload.companyAddress||'') + ". SĐT liên hệ: " + (payload.companyPhone||'');
        if (colNotes > -1 && colNotes !== colSkills && colNotes !== colCompany) {
           newRow[colNotes] = extNotes;
        } else {
           // Nếu không tìm thấy cột trống ở cuối, tự động đẩy vào cột cuối cùng + 1
           newRow[headers.length - 1] = extNotes;
        }
        
        // Gửi thư mời
        const companyEmail = payload.companyEmail;
        if (companyEmail) {
          const companyName = payload.companyName || 'Quý Công ty';
          const htmlBody = `
            <p>Kính gửi: Ban Giám đốc / Bộ phận Nhân sự công ty <b>${companyName}</b>,</p>
            <p>Lời đầu tiên, thay mặt Khoa Cơ điện tử, Trường Cơ khí – Đại học Bách khoa Hà Nội, xin gửi lời chào trân trọng và lời chúc sức khỏe, thành công đến Quý Công ty.</p>
            <p>Nhằm mục đích tạo điều kiện cho sinh viên áp dụng kiến thức đã học vào môi trường thực tế, đồng thời mở ra cơ hội kết nối nguồn nhân lực chất lượng cao giữa nhà trường và doanh nghiệp, Khoa Cơ điện tử kính mong nhận được sự hợp tác và hỗ trợ từ Quý Công ty trong chương trình thực tập sắp tới.</p>
            <p>Để thuận tiện cho công tác tổ chức và sắp xếp, chúng tôi kính đề nghị Quý Công ty thực hiện 02 bước sau:</p>
            <p><b>1. Đăng ký thông tin doanh nghiệp và nhu cầu tuyển dụng</b><br>
            Quý Công ty vui lòng dành chút thời gian điền thông tin vào biểu mẫu trực tuyến theo đường dẫn dưới đây:<br>
            👉 <a href="https://forms.office.com/r/RqvQC2hkM2">https://forms.office.com/r/RqvQC2hkM2</a></p>
            <p><b>2. Gửi thư xác nhận tiếp nhận sinh viên</b><br>
            Sau khi hoàn tất biểu mẫu và thống nhất danh sách, kính mong Quý Công ty gửi lại cho chúng tôi một Thư/Giấy xác nhận tiếp nhận thực tập qua email <b>an.phamduc@hust.edu.vn</b> / <b>ducanpham83@gmail.com</b>. Thư xác nhận cần bao gồm các thông tin cơ bản sau:</p>
            <ul>
              <li>Họ và tên (các) sinh viên được tiếp nhận thực tập tại công ty.</li>
              <li>Khoảng thời gian thực tập dự kiến (Từ ngày [DD/MM/YYYY] đến ngày [DD/MM/YYYY]).</li>
            </ul>
            <p>Sự đồng hành của Quý Công ty là đóng góp vô cùng to lớn đối với chất lượng đào tạo của Khoa cũng như hành trang nghề nghiệp của các em sinh viên. Nếu cần trao đổi thêm bất kỳ thông tin nào, Quý Công ty vui lòng phản hồi lại email này hoặc liên hệ qua số điện thoại: <b>0971561418</b>.</p>
            <p>Một lần nữa, xin chân thành cảm ơn sự quan tâm và hợp tác của Quý Công ty.</p>
            <p>Trân trọng,</p>
            <p><b>PGS. TS. Phạm Đức An</b><br>
            Phó Trưởng Khoa Cơ điện tử – Đại học Bách khoa Hà Nội<br>
            SĐT: 0971561418<br>
            Email: an.phamduc@hust.edu.vn; ducanpham83@gmail.com</p>
          `;

          MailApp.sendEmail({
            to: companyEmail,
            cc: "an.phamduc@hust.edu.vn",
            subject: "Thư mời hợp tác và đăng ký tiếp nhận sinh viên thực tập – Khoa Cơ điện tử, ĐHBK Hà Nội",
            htmlBody: htmlBody
          });
        }
      }
      
      sheet.appendRow(newRow);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    
    // --- API LẤY BÁO CÁO TUẦN (CHO ADMIN) ---
    if (action === 'getWeeklyReports') {
      const sheet = setupReportsSheet();
      const data = sheet.getDataRange().getValues();
      const reports = [];
      
      for(let i=1; i<data.length; i++) {
        const mssv = String(data[i][0] || '');
        if(!mssv) continue;
        reports.push({
          id: mssv + '_w' + data[i][3],
          studentId: mssv,
          studentName: String(data[i][1] || ''),
          companyName: String(data[i][2] || ''),
          weekNumber: Number(data[i][3] || 1),
          studentReport: String(data[i][4] || ''),
          companyEval: String(data[i][5] || ''),
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', reports: reports }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Action not found' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Khoa Co Dien Tu - API is running!")
    .setMimeType(ContentService.MimeType.TEXT);
}
