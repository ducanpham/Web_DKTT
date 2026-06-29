export type Role = 'student' | 'admin';

export interface Company {
  id: string;
  name: string;
  logo: string; // emoji placeholder
  isGalaSponsor: boolean;
  isOnlineRecruitment: boolean;
  // Fields visible to both
  fields: string[];
  skills: string[];
  qOptions?: string[];
  benefits: {
    allowance: string;
    meals: string;
    housing: string;
  };
  totalSlots: number;
  availableSlots: number;
  // Admin-only fields
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  address: string;
  industry: string;
}

export interface Registration {
  id: string;
  rowIndex?: number; // Added to map to Google Sheets row index
  studentId: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  internClass: string;
  companyId: string;
  companyName: string;
  registeredAt: string;
  isExternal: boolean;
  expectedSkills?: string;
}

export interface WeeklyReport {
  id: string;           // MSSV + tuần
  studentId: string;
  studentName: string;
  internClass: string;
  companyName: string;
  weekLabel: string;    // VD: "Tuần 1", "Tuần 2"...
  content: string;      // Công việc đã làm
  difficulties: string; // Khó khăn / Đề xuất
  submittedAt: string;
}

export interface WeeklyReportConfig {
  enabled: boolean;            // Admin bật/tắt chức năng
  googleFormUrl: string;       // Link Google Form cho sinh viên nộp
  sheetsCsvUrl: string;        // Link CSV Google Sheets để admin fetch
}

export interface InternshipGuide {
  technicalLink: string;    // Link hướng dẫn thực tập kỹ thuật
  engineerLink: string;     // Link thực tập kỹ sư chuyên sâu
  technicalLabel: string;
  engineerLabel: string;
}

export const DEFAULT_GUIDE: InternshipGuide = {
  technicalLink: '',
  engineerLink: '',
  technicalLabel: 'Hướng dẫn Thực tập Kỹ thuật',
  engineerLabel: 'Thực tập Kỹ sư Chuyên sâu',
};

export interface StudentViewConfig {
  showFields: boolean;
  showSkills: boolean;
  showBenefits: boolean;
  showSlots: boolean;
  showStatCards: boolean;
  enableFallback: boolean;
  fallbackFormUrl: string;
  showCompanyAddress: boolean;
  showContactPerson: boolean;
  allowExternalDeclaration: boolean;
  appsScriptUrl: string;
  weeklyReport: WeeklyReportConfig;
  careerEvent?: {
    enabled: boolean;
    url: string;
  };
}

export const DEFAULT_STUDENT_VIEW_CONFIG: StudentViewConfig = {
  showFields: true,
  showSkills: true,
  showBenefits: true,
  showSlots: true,
  showStatCards: true,
  enableFallback: true,
  fallbackFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeZX-vE38wQlbxnO1naG_XInjO53qQJMBBQ_lmbpVxWVy_tDw/viewform?usp=header',
  showCompanyAddress: true,
  showContactPerson: true,
  allowExternalDeclaration: true,
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbwtmAJcBdPENz0sZpHS2w5skziD-jt7UALY72iXRkohp6FzEE67BR3XIQY2H1O_LFaw/exec',
  weeklyReport: {
    enabled: false,
    googleFormUrl: '',
    sheetsCsvUrl: '',
  },
  careerEvent: {
    enabled: false,
    url: '',
  }
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: "real_1",
    name: "CÔNG TY CỔ PHẦN SẢN XUẤT VÀ DỊCH VỤ LEANMAC",
    logo: "🏭",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Ứng dụng AI/Machine Learning trong sản xuất","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt"],
    qOptions: ["Cùng tham gia đánh giá, hướng dẫn Đồ án tốt nghiệp của sinh viên (bố trí được người hướng dẫn kỹ thuật cho sinh viên)"],
    benefits: {
      allowance: "Chỉ hỗ trợ các chi phí cơ bản (ăn trưa, gửi xe...)",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 6,
    availableSlots: 6,
    contactName: "Phạm Thị Ngọc Bích",
    contactPhone: "0393176268",
    contactEmail: "Chưa cập nhật",
    website: '#',
    address: "TDP Ngô Hùng, Nhà Xưởng X5, thuê của CTCP Công nghiệp – Xây dựng 204, Phường Hồng An, Thành phố Hải Phòng, Việt Nam",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_2",
    name: "CÔNG TY CỔ PHẦN THIẾT BỊ VÀ GIẢI PHÁP CƠ KHÍ AUTOMECH",
    logo: "🔧",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Thao tác trên dây truyền sản xuất cơ khí"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt"],
    qOptions: ["Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên"],
    benefits: {
      allowance: "Có phụ cấp dựa trên năng lực và kết quả công việc; Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 30,
    availableSlots: 30,
    contactName: "Trần Thị Thanh",
    contactPhone: "0989888160",
    contactEmail: "thanhtt@automech.vn",
    website: '#',
    address: "Số 285 đường Phúc Lợi, phường Phúc Lợi, Hà Nội Nhà máy số 1: KCN Đình Trám, Bắc Ninh Nhà máy số 2: Cụm Công nghiệp Việt Nhật, Bắc Ninh",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_4",
    name: "Công ty TNHH TM& DV Laser Việt Nhật",
    logo: "⚙️",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Thao tác trên dây truyền sản xuất cơ khí","Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)"],
    skills: ["Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Có kỹ năng tiếng anh giao tiếp/chuyên ngành"],
    qOptions: ["Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 15,
    availableSlots: 15,
    contactName: "Kiều Anh",
    contactPhone: "0982.763.666",
    contactEmail: "Anhkieu@laservietnhat.com.vn",
    website: '#',
    address: "Xóm Bãi, xã Đông Anh, Hà Nội",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_7",
    name: "Công ty TNHH Phát Triển Thương Mại Minh Vũ",
    logo: "🔬",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Xe tự hành (AGV) & Robot di động (AMR) • Thị giác máy tính & Xử lý ảnh công nghiệp (Machine Vision)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt"],
    qOptions: ["Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp"],
    benefits: {
      allowance: "Chỉ hỗ trợ các chi phí cơ bản (ăn trưa, gửi xe...)",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 10,
    availableSlots: 10,
    contactName: "Vũ Thái Sơn",
    contactPhone: "0968292834",
    contactEmail: "sale1.minhvu@gmail.com",
    website: '#',
    address: "Số nhà 15a, Măng Cầm 4, KĐT An Lạc Symphony, Xã Sơn Đồng, Thành phố Hà Nội",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_8",
    name: "Unilever",
    logo: "📡",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Hệ thống nhúng & IoT công nghiệp (IIoT)","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Xe tự hành (AGV) & Robot di động (AMR) • Thị giác máy tính & Xử lý ảnh công nghiệp (Machine Vision)"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Có kỹ năng tiếng anh giao tiếp/chuyên ngành"],
    qOptions: ["Chưa thể sắp xếp tham gia trong thời gian này"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 1,
    availableSlots: 1,
    contactName: "Nguyễn Minh Hăng",
    contactPhone: "0916261170",
    contactEmail: "nguyen-minh.hang@unilever.com",
    website: '#',
    address: "Chi nhánh Công ty TNHH Quốc tế Unilever Việt Nam tại VSIP Bắc Ninh - Số 19, Đường 07, KCN đô thị và dịch vụ VSIP Bắc Ninh, phường Từ Sơn, tỉnh Bắc Ninh, Việt Nam.",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_9",
    name: "Công ty TNHH Công nghệ máy văn phòng Kyocera Việt Nam",
    logo: "🎯",
    isGalaSponsor: true,
    isOnlineRecruitment: false,
    fields: ["Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Điều khiển truyền động (Motion Control, Servo, Inverter)","Công nghệ in 3D & Sản xuất đắp dần"],
    skills: ["Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Có kỹ năng tiếng anh giao tiếp/chuyên ngành"],
    qOptions: ["Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 3,
    availableSlots: 3,
    contactName: "Đặng Anh Thơ",
    contactPhone: "0359494575",
    contactEmail: "tho.da@dtvn.kyocera.com",
    website: '#',
    address: "Khu Công nghiệp VSIP Thuỷ Nguyên, Hải Phòng",
    industry: 'Robot & Cơ Điện Tử',
  },
  {
    id: "real_10",
    name: "Công ty cổ phần công nghiệp TCI",
    logo: "💼",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Điều khiển truyền động (Motion Control, Servo, Inverter)"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Ưu tiên sinh viên thành thảo  Solidwork"],
    qOptions: ["Chưa thể sắp xếp tham gia trong thời gian này"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 2,
    availableSlots: 2,
    contactName: "Đào Văn Đồng",
    contactPhone: "0975795299",
    contactEmail: "dongdv@tci.vn",
    website: '#',
    address: "Km 16+800, Quốc lộ 3, Cụm Công nghiệp ô tô Nguyên Khê, Thư Lâm, Hà Nội",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_11",
    name: "CÔNG TY TNHH INNOVATION PRECISION VIỆT NAM",
    logo: "🤖",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Thao tác trên dây truyền sản xuất cơ khí","Thao tác trên dây truyền sản xuất điện tử"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Ưu tiên biết tiếng trung"],
    qOptions: ["Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 8,
    availableSlots: 8,
    contactName: "Đường Thị Trang",
    contactPhone: "0347846161",
    contactEmail: "Trang.dt@sdcxjt.com",
    website: '#',
    address: "Số 3, Đường số 4, Khu Công nghiệp VSIP Nghệ An, Xã Hưng Nguyên, Tỉnh Nghệ An, Việt Nam",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_12",
    name: "Công ty CP Thiết bị và Dịch vụ TCE",
    logo: "🔩",
    isGalaSponsor: false,
    isOnlineRecruitment: false,
    fields: ["Cơ Điện Tử"],
    skills: [],
    qOptions: [],
    benefits: {
      allowance: "Không cung cấp",
      meals: "Không cung cấp",
      housing: "Không cung cấp",
    },
    totalSlots: 5,
    availableSlots: 5,
    contactName: "Đới Minh Diệp",
    contactPhone: "0969560686",
    contactEmail: "tuyendung@tce.net.vn",
    website: '#',
    address: "tầng 1L, 169 Nguyễn Ngọc Vũ, Yên Hòa, Hà Nội",
    industry: 'Cơ Điện Tử & Đa Ngành',
  },
  {
    id: "real_13",
    name: "Công ty Cổ phần Công nghệ và đầu tư INTECH",
    logo: "🏢",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Hệ thống nhúng & IoT công nghiệp (IIoT)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Thao tác trên dây truyền sản xuất cơ khí"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt"],
    qOptions: ["Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên","Cùng tham gia đánh giá, hướng dẫn Đồ án tốt nghiệp của sinh viên (bố trí được người hướng dẫn kỹ thuật cho sinh viên)"],
    benefits: {
      allowance: "Có phụ cấp dựa trên năng lực và kết quả công việc; Chỉ hỗ trợ các chi phí cơ bản (ăn trưa, gửi xe...)",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 5,
    availableSlots: 5,
    contactName: "Nguyễn Thị Vân",
    contactPhone: "0982561613",
    contactEmail: "tuyendung.ho2@intechgroup.vn",
    website: '#',
    address: "Số 145 đường Ngọc Hồi, phường Yên Sở, Hà Nội",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_14",
    name: "Công ty TNHH Daiwa Plastics Thăng Long",
    logo: "💡",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Xe tự hành (AGV) & Robot di động (AMR) • Thị giác máy tính & Xử lý ảnh công nghiệp (Machine Vision)","Ứng dụng AI/Machine Learning trong sản xuất"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt"],
    qOptions: ["Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 5,
    availableSlots: 5,
    contactName: "Tạ Đức Khôi",
    contactPhone: "0912097676",
    contactEmail: "khoi-td@daiwa-tl.com",
    website: '#',
    address: "K8 Khu công nghiệp Thăng Long, xã Thiên Lộc, TP Hà Nội",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_15",
    name: "Công ty TNHH Điện tử Meiko Việt Nam",
    logo: "🏗️",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Hệ thống nhúng & IoT công nghiệp (IIoT)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)","Có kỹ năng tiếng anh giao tiếp/chuyên ngành","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt"],
    qOptions: ["Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 10,
    availableSlots: 10,
    contactName: "Nguyễn Đặng Duy",
    contactPhone: "0936293433 hoặc 0944806116",
    contactEmail: "duy.nguyendang@meiko-elec.com",
    website: '#',
    address: "Lô CN9, KCN Thạch Thất - Quốc Oai, Xã Tây Phương, TP. Hà Nội",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_17",
    name: "Công ty TNHH thiết bị HT Việt Nam",
    logo: "🔌",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Thao tác trên dây truyền sản xuất cơ khí","Ứng dụng AI/Machine Learning trong sản xuất"],
    skills: ["Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)"],
    qOptions: ["Chưa thể sắp xếp tham gia trong thời gian này"],
    benefits: {
      allowance: "Có phụ cấp dựa trên năng lực và kết quả công việc",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 3,
    availableSlots: 3,
    contactName: "Hoàng Thị Minh Hằng",
    contactPhone: "+84 91 6511138",
    contactEmail: "Hcnsht@thietbiht.com",
    website: '#',
    address: "Số 82C, ngõ 885 Tam Trinh, Hoàng Mai, Hà Nội",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_18",
    name: "Công ty Cổ phần Santomas Việt Nam",
    logo: "📦",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Ứng dụng AI/Machine Learning trong sản xuất","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)","Có kỹ năng tiếng anh giao tiếp/chuyên ngành"],
    qOptions: ["Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng; Chỉ hỗ trợ các chi phí cơ bản (ăn trưa, gửi xe...)",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 2,
    availableSlots: 2,
    contactName: "Hoàng Thị Thu",
    contactPhone: "0982537406",
    contactEmail: "thu.ht@santomas.com.vn",
    website: '#',
    address: "Khu Công nghiệp VSIP Bắc Ninh, Từ Sơn, Bắc Ninh",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_19",
    name: "Công ty TNHH Makino Việt Nam",
    logo: "🚗",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Điều khiển truyền động (Motion Control, Servo, Inverter)"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)"],
    qOptions: ["Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 5,
    availableSlots: 5,
    contactName: "Trần Đức Minh",
    contactPhone: "0983435455",
    contactEmail: "Ducminh.tran@makino.com.vn",
    website: '#',
    address: "Nhà máy sản xuất Makino Hưng Yên , KCN Viglacera Yên Mỹ, xã Yên Mỹ, tỉnh Hưng Yên",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_20",
    name: "Công ty Cổ phần Công nghiệp TCI",
    logo: "📊",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Điều khiển truyền động (Motion Control, Servo, Inverter)","Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)"],
    skills: ["Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Kỹ năng lập trình điều khiển (PLC, vi điều khiển)"],
    qOptions: ["Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 20,
    availableSlots: 20,
    contactName: "Tạ Thị Thu Hà",
    contactPhone: "0978733663",
    contactEmail: "hattt@tci.vn/ phuongntm@tci.vn",
    website: '#',
    address: "Cụm Công nghiệp ô tô Nguyên Khê, Thư Lâm, Hà Nội ( Nguyên Khê, Đông Anh cũ)",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_21",
    name: "Công ty TNHH Canon Việt Nam",
    logo: "🧪",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Điều khiển truyền động (Motion Control, Servo, Inverter)"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)"],
    qOptions: ["Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên","Cùng tham gia đánh giá, hướng dẫn Đồ án tốt nghiệp của sinh viên (bố trí được người hướng dẫn kỹ thuật cho sinh viên)"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 50,
    availableSlots: 50,
    contactName: "Nguyễn Thị Thu (HR)",
    contactPhone: "0365309625",
    contactEmail: "thu.nguyen539@mail.canon",
    website: '#',
    address: "Lô A1, KCN Thăng Long, Thiên Lộc, Hà Nội",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_23",
    name: "Công ty tnhh Neweb Việt Nam(WNC)",
    logo: "✈️",
    isGalaSponsor: false,
    isOnlineRecruitment: false,
    fields: ["Thao tác trên dây truyền sản xuất điện tử","Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Kho , tự động hóa","Điều khiển truyền động (Motion Control, Servo, Inverter)"],
    skills: ["Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)"],
    qOptions: ["Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng; Có phụ cấp dựa trên năng lực và kết quả công việc",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 70,
    availableSlots: 70,
    contactName: "RUBY HR",
    contactPhone: "0985971246",
    contactEmail: "Ruby.pei@wnc.com.tw",
    website: '#',
    address: "Kcn đồng văn 3 , P Đồng Văn, tỉnh Ninh Bình( Hà Nam cũ)",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_24",
    name: "CÔNG TY TNHH PHẦN MỀM HICAS",
    logo: "🔋",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Ứng dụng AI/Machine Learning trong sản xuất","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)","Xe tự hành (AGV) & Robot di động (AMR) • Thị giác máy tính & Xử lý ảnh công nghiệp (Machine Vision)"],
    skills: ["Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Có kỹ năng tiếng anh giao tiếp/chuyên ngành"],
    qOptions: ["Chưa thể sắp xếp tham gia trong thời gian này"],
    benefits: {
      allowance: "Có phụ cấp dựa trên năng lực và kết quả công việc",
      meals: "Không hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 3,
    availableSlots: 3,
    contactName: "Võ Công Minh",
    contactPhone: "0983683620",
    contactEmail: "minh@hicas.co",
    website: '#',
    address: "Hà Nội",
    industry: 'Robot & Cơ Điện Tử',
  },
  {
    id: "real_25",
    name: "Công ty cổ phần hệ thống AIoT",
    logo: "🌐",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Hệ thống nhúng & IoT công nghiệp (IIoT)","Điều khiển truyền động (Motion Control, Servo, Inverter)","Xe tự hành (AGV) & Robot di động (AMR) • Thị giác máy tính & Xử lý ảnh công nghiệp (Machine Vision)","Ứng dụng AI/Machine Learning trong sản xuất"],
    skills: ["Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)"],
    qOptions: ["Chưa thể sắp xếp tham gia trong thời gian này"],
    benefits: {
      allowance: "Hiện tại chưa có chính sách hỗ trợ tài chính",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 4,
    availableSlots: 4,
    contactName: "Lê văn Hoan",
    contactPhone: "0839799889",
    contactEmail: "Hoanle@aiots.vn",
    website: '#',
    address: "A21, TT09 Đ. Foresa 1, Xuân Phương, Hà Nội",
    industry: 'Robot & Cơ Điện Tử',
  },
  {
    id: "real_26",
    name: "Công Ty Cổ Phần Croptex",
    logo: "💳",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Xe tự hành (AGV) & Robot di động (AMR) • Thị giác máy tính & Xử lý ảnh công nghiệp (Machine Vision)","Hệ thống nhúng & IoT công nghiệp (IIoT)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Điều khiển truyền động (Motion Control, Servo, Inverter)"],
    skills: ["Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)","Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng lập trình phần mềm (C/C++, Python, C#)"],
    qOptions: ["Cùng tham gia đánh giá, hướng dẫn Đồ án tốt nghiệp của sinh viên (bố trí được người hướng dẫn kỹ thuật cho sinh viên)"],
    benefits: {
      allowance: "Chỉ hỗ trợ các chi phí cơ bản (ăn trưa, gửi xe...); Có phụ cấp dựa trên năng lực và kết quả công việc",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 3,
    availableSlots: 3,
    contactName: "Lê Văn Linh",
    contactPhone: "0327340913",
    contactEmail: "buithutrang@croptex.vn",
    website: '#',
    address: "T03-L05, Khu Đô Thị Đô Nghĩa, Phường Yên Nghĩa, Thành Phố Hà Nội",
    industry: 'Robot & Cơ Điện Tử',
  },
  {
    id: "real_27",
    name: "Công ty TNHH Thuận Thành Nam Việt",
    logo: "🛒",
    isGalaSponsor: true,
    isOnlineRecruitment: false,
    fields: ["Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Điều khiển truyền động (Motion Control, Servo, Inverter)","Ứng dụng AI/Machine Learning trong sản xuất","Thao tác trên dây truyền sản xuất cơ khí"],
    skills: ["Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)"],
    qOptions: ["Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 3,
    availableSlots: 3,
    contactName: "Nguyễn Văn Thùy",
    contactPhone: "0969577103",
    contactEmail: "thuy031997@gmail.com",
    website: '#',
    address: "Số 7, Ngõ đối diện cây xăng Trường Sơn, Thôn Nhuệ, Đức Thượng, Hoài Đức, Hà Nội",
    industry: 'AI & Công Nghệ',
  },
  {
    id: "real_28",
    name: "Tổng Công ty Sản xuất thiết bị Viettel",
    logo: "🔷",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Thao tác trên dây truyền sản xuất cơ khí","Thao tác trên dây truyền sản xuất điện tử","Thiết kế phần cứng, thiết kế phần mềm R&D"],
    skills: ["Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Kỹ năng lập trình phần mềm (C/C++, Python, C#)"],
    qOptions: ["Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên","Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 30,
    availableSlots: 30,
    contactName: "Hồ Thanh Nga Lê Thị Minh Nguyệt",
    contactPhone: "Hồ Thanh Nga - Chuyên viên nhân sự - SĐT: 0333.560.270 Lê Thị Minh Nguyệt - Chuyên viên nhân sự - SĐT: 0968.669.966",
    contactEmail: "vmctuyendung@gmail.com",
    website: '#',
    address: "An Khánh, Hà Nội Khu CNC Hòa Lạc, Hà Nội",
    industry: 'Cơ Khí & Chế Tạo',
  },
  {
    id: "real_29",
    name: "Công ty Cổ phần Kim khí Thăng Long",
    logo: "📱",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Thao tác trên dây truyền sản xuất cơ khí","Cơ khí chế tạo máy","Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Robot công nghiệp (Lập trình, vận hành tay máy UR, KUKA, Yaskawa, ABB...)"],
    skills: ["Hiểu biết cơ bản về nguyên lý hoạt động của thiết bị Cơ khí"],
    qOptions: ["Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng; Chỉ hỗ trợ các chi phí cơ bản (ăn trưa, gửi xe...); Có phụ cấp dựa trên năng lực và kết quả công việc",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 50,
    availableSlots: 50,
    contactName: "Hoàng Huy Chung",
    contactPhone: "0983006998",
    contactEmail: "hoanghuychung@gmail.com",
    website: '#',
    address: "Phố Sài Đồng, Phường Phúc Lợi, Thành phố Hà Nội",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_31",
    name: "Công ty TNHH Thương mại quốc tế 3S Việt Nam",
    logo: "🖥️",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Điều khiển truyền động (Motion Control, Servo, Inverter)","Thao tác trên dây truyền sản xuất cơ khí"],
    skills: ["Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Có kỹ năng tiếng anh giao tiếp/chuyên ngành","Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng lập trình điều khiển (PLC, vi điều khiển)"],
    qOptions: ["Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp"],
    benefits: {
      allowance: "Chỉ hỗ trợ các chi phí cơ bản (ăn trưa, gửi xe...); Có phụ cấp cố định hàng tháng; Có phụ cấp dựa trên năng lực và kết quả công việc",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 3,
    availableSlots: 3,
    contactName: "Nguyễn Thị Thu Huyền",
    contactPhone: "0986638545",
    contactEmail: "3svietnam@posi3s.com",
    website: '#',
    address: "Tầng 3 Tòa nhà Quang Minh Tower, N02T3 Khu Đoàn ngoại giao, Phường Xuân Đỉnh, Thành phố Hà Nội, Việt Nam",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_32",
    name: "Công ty Cổ phần IL-SUNG TECH",
    logo: "🛠️",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Thao tác trên dây truyền sản xuất điện tử","Thao tác trên dây truyền sản xuất cơ khí","Xe tự hành (AGV) & Robot di động (AMR) • Thị giác máy tính & Xử lý ảnh công nghiệp (Machine Vision)","Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)"],
    skills: ["Không yêu cầu thêm chuyên môn"],
    qOptions: ["Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp"],
    benefits: {
      allowance: "Có phụ cấp dựa trên năng lực và kết quả công việc",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 50,
    availableSlots: 50,
    contactName: "Nguyễn Tiến Thanh",
    contactPhone: "0869143888",
    contactEmail: "thanh.nt@il-sungtech.com",
    website: '#',
    address: "Cụm công nghiệp Hạp Lĩnh, phường Hạp Lĩnh, tỉnh Bắc Ninh",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_33",
    name: "Công ty TNHH MTV Thép VAS Nghi Sơn",
    logo: "🎮",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Thao tác trên dây truyền sản xuất cơ khí","Ứng dụng AI/Machine Learning trong sản xuất"],
    skills: ["Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt"],
    qOptions: ["Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Có bố trí chỗ ở",
    },
    totalSlots: 20,
    availableSlots: 20,
    contactName: "Trần Thị Hồng",
    contactPhone: "0987803585",
    contactEmail: "hongtt@vassteel.vn",
    website: '#',
    address: "KLH Gang thép Nghi Sơn, KKT Nghi Sơn, Phường Nghi Sơn, tỉnh Thanh Hóa",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_34",
    name: "Công ty TNHH Laird Việt Nam (Công ty con tại Việt Nam của công ty Qnity Electronics)",
    logo: "📋",
    isGalaSponsor: false,
    isOnlineRecruitment: false,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Thao tác trên dây truyền sản xuất cơ khí","Thao tác trên dây truyền sản xuất điện tử","Ứng dụng AI/Machine Learning trong sản xuất"],
    skills: ["Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt","Có kỹ năng tiếng anh giao tiếp/chuyên ngành","Kỹ năng lập trình điều khiển (PLC, vi điều khiển)"],
    qOptions: ["Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng; Có phụ cấp dựa trên năng lực và kết quả công việc",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 10,
    availableSlots: 10,
    contactName: "Trần Ngọc Tú",
    contactPhone: "0944681886",
    contactEmail: "Brian.tran@qnityelectronics.com",
    website: '#',
    address: "Lô K10, khu công nghiệp Quế Võ mở rộng, phường Nam Sơn, tỉnh Bắc Ninh",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_35",
    name: "Công ty TNHH Nestlé Việt nam",
    logo: "🌿",
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ["Ứng dụng AI/Machine Learning trong sản xuất","Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Thao tác trên dây truyền sản xuất cơ khí"],
    skills: ["Có kỹ năng tiếng anh giao tiếp/chuyên ngành","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng lập trình điều khiển (PLC, vi điều khiển)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt"],
    qOptions: ["Tham dự Lễ tốt nghiệp ngành Cơ điện tử (dự kiến ngày 19/7)","Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên","Cùng tham gia đánh giá, hướng dẫn Đồ án tốt nghiệp của sinh viên (bố trí được người hướng dẫn kỹ thuật cho sinh viên)"],
    benefits: {
      allowance: "Có phụ cấp cố định hàng tháng",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 6,
    availableSlots: 6,
    contactName: "Trương Thị Phương Thảo",
    contactPhone: "0968855517",
    contactEmail: "truongthiphuong.thao@vn.nestle.com",
    website: '#',
    address: "Nhà máy Nestlé Bông Sen, Lô P1A, KCN Thăng Long II, Mỹ Hào, Hưng Yên",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
  {
    id: "real_36",
    name: "STEAM for Vietnam Foundation",
    logo: "🏥",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Điều khiển truyền động (Motion Control, Servo, Inverter)","Công nghệ in 3D & Sản xuất đắp dần","Hệ thống nhúng & IoT công nghiệp (IIoT)"],
    skills: ["Kỹ năng lập trình phần mềm (C/C++, Python, C#)","Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt"],
    qOptions: ["Tham gia các hội thảo chuyên đề / Định hướng nghề nghiệp cho sinh viên","Tham gia Ngày hội việc làm (Job Fair) / Phỏng vấn tuyển dụng trực tiếp"],
    benefits: {
      allowance: "Hiện tại chưa có chính sách hỗ trợ tài chính",
      meals: "Không hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 4,
    availableSlots: 4,
    contactName: "Joy Vũ",
    contactPhone: "0349363293",
    contactEmail: "joy@steamforvietnam.org",
    website: '#',
    address: "- Onsite: Tòa nhà HCMCC, 249A Thụy Khuê, Tây Hồ, Hà Nội - Remote",
    industry: 'AI & Công Nghệ',
  },
  {
    id: "real_37",
    name: "Công ty TNHH Sản xuất đồ gia dụng Sunhouse",
    logo: "🔑",
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ["Tự động hóa nhà máy & Dây chuyền sản xuất (PLC, SCADA, HMI)","Hệ thống nhúng & IoT công nghiệp (IIoT)","Thiết kế cơ khí, khuôn mẫu & CAD/CAM/CNC","Điều khiển truyền động (Motion Control, Servo, Inverter)"],
    skills: ["Kỹ năng thiết kế cơ khí (SolidWorks, AutoCAD, NX, Catia...)","Kỹ năng thiết kế mạch điện tử (Altium, OrCAD...)","Đọc hiểu bản vẽ kỹ thuật (Cơ & Điện) • Tiếng Anh giao tiếp/chuyên ngành tốt"],
    qOptions: ["Chưa thể sắp xếp tham gia trong thời gian này"],
    benefits: {
      allowance: "Có phụ cấp dựa trên năng lực và kết quả công việc; Chỉ hỗ trợ các chi phí cơ bản (ăn trưa, gửi xe...)",
      meals: "Có hỗ trợ",
      housing: "Không bố trí, sinh viên tự túc",
    },
    totalSlots: 7,
    availableSlots: 7,
    contactName: "Tạ Thị Ngọc Mai",
    contactPhone: "0373539379",
    contactEmail: "maittn@sunhouse.com.vn",
    website: '#',
    address: "Km21 Đại lộ Thăng Long, Ngọc Liệp, Kiều Phú, Hà Nội",
    industry: 'Tự Động Hóa & Điều Khiển',
  },
];

export const INITIAL_REGISTRATIONS: Registration[] = [];

// --- API Helpers for Configuration DB ---

export async function fetchConfigFromAPI(apiUrl: string): Promise<{ studentViewConfig?: StudentViewConfig, guide?: InternshipGuide, customCompanies?: Company[] } | null> {
  if (!apiUrl) return null;
  try {
    const urlWithCacheBuster = apiUrl + (apiUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
    const response = await fetch(urlWithCacheBuster, { cache: 'no-store' });
    if (!response.ok) return null;
    const json = await response.json();
    if (json.status === 'success' && json.data) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching config from API:", error);
    return null;
  }
}

export async function saveConfigToAPI(apiUrl: string, action: 'saveViewConfig' | 'saveGuide' | 'saveCompanies', data: any): Promise<boolean> {
  if (!apiUrl) return false;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({ action, data }),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      }
    });
    if (!response.ok) return false;
    const json = await response.json();
    return json.status === 'success';
  } catch (error) {
    console.error("Error saving config to API:", error);
    return false;
  }
}
