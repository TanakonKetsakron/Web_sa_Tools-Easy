/* ============================================================
   Tools Easy - Main JavaScript Module
   js/script.js
   
   INPUT/PROCESS/OUTPUT Documentation:
   ─────────────────────────────────────
   Input:   User interactions (clicks, form fills, URL params)
   Process: Data validation, LocalStorage CRUD, State management
   Output:  DOM updates, Toast notifications, Page redirects
   ============================================================ */

'use strict';

/* ============================================================
   1. TRADE SPECIALIZATION DATA
   แต่ละสายงานช่างมี: id, name, icon, color, description
   และ tags ที่ใช้ match กับ product.trades[]
   ============================================================ */
const TRADES = [
  {
    id: 'mechanic',
    name: 'ช่างเครื่องยนต์',
    icon: '🔧',
    color: '#1E3A8A',
    colorLight: '#EEF2FF',
    description: 'ซ่อม-บำรุงเครื่องยนต์ รถยนต์ มอเตอร์ไซค์ เครื่องจักร',
    tools: 'ประแจ, ประแจปอนด์, ชุดบ็อกซ์, คีม, เครื่องมือวัดเครื่องยนต์'
  },
  {
    id: 'electrical',
    name: 'ช่างไฟฟ้า',
    icon: '⚡',
    color: '#B45309',
    colorLight: '#FEF3C7',
    description: 'งานติดตั้งและซ่อมระบบไฟฟ้า สายไฟ แผงควบคุม',
    tools: 'ไขควง, คีมตัดสาย, มัลติมิเตอร์, ที่ปอกสาย, เทปพันสาย'
  },
  {
    id: 'plumber',
    name: 'ช่างประปา',
    icon: '🚿',
    color: '#0369A1',
    colorLight: '#E0F2FE',
    description: 'ติดตั้งและซ่อมแซมระบบท่อน้ำ สุขภัณฑ์ ระบบน้ำ',
    tools: 'ประแจท่อ, คีมจับท่อ, เทปเทฟลอน, เครื่องดัดท่อ, ซีลาร์'
  },
  {
    id: 'welder',
    name: 'ช่างเชื่อม',
    icon: '🔥',
    color: '#9A3412',
    colorLight: '#FFF7ED',
    description: 'งานเชื่อมโลหะ ตัด ดัด งานโครงสร้างเหล็ก',
    tools: 'หน้ากากเชื่อม, ค้อนเคาะตะกรัน, แปรงลวด, เครื่องเจียร, ถุงมือ'
  },
  {
    id: 'carpenter',
    name: 'ช่างไม้',
    icon: '🪚',
    color: '#065F46',
    colorLight: '#D1FAE5',
    description: 'งานตัด ไส ต่อ ทำเฟอร์นิเจอร์และโครงสร้างไม้',
    tools: 'เลื่อย, กบไสไม้, สว่าน, ค้อน, สิ่ว, ไม้บรรทัด, เครื่องขัด'
  },
  {
    id: 'aircon',
    name: 'ช่างแอร์',
    icon: '❄️',
    color: '#1D4ED8',
    colorLight: '#DBEAFE',
    description: 'ติดตั้ง ซ่อม ล้างทำความสะอาดเครื่องปรับอากาศ',
    tools: 'ประแจฟาก, เกจวัดแรงดัน, ปั๊มสุญญากาศ, ท่อทองแดง, ชุดล้างแอร์'
  },
  {
    id: 'construction',
    name: 'ช่างก่อสร้าง',
    icon: '🏗️',
    color: '#374151',
    colorLight: '#F3F4F6',
    description: 'งานก่อสร้าง ก่ออิฐ ฉาบปูน เทคอนกรีต',
    tools: 'เกรียงฉาบ, ระดับน้ำ, สายวัด, สิ่ว, ค้อนปอนด์, เครื่องผสมปูน'
  },
  {
    id: 'painter',
    name: 'ช่างทาสี',
    icon: '🎨',
    color: '#7C3AED',
    colorLight: '#EDE9FE',
    description: 'งานทาสีอาคาร ผิวโลหะ พ่นสี เตรียมพื้นผิว',
    tools: 'แปรงทาสี, โรลเลอร์, กาน pistol, กระดาษทราย, เทปกาว'
  }
];

/* ============================================================
   1. PRODUCT DATA  — 20 รายการต่อสายงาน × 8 สายงาน = 160 รายการ
   Input:  N/A (static seed data)
   Process: Data is stored in LocalStorage on first load
   Output:  Product array available throughout the app
   แต่ละ product มี trades[] → array ของ trade IDs ที่ใช้สินค้านี้
   ============================================================ */
const DEFAULT_PRODUCTS = [

  /* ════════════════════════════════════════════════════════════
     🔧 ช่างเครื่องยนต์ (mechanic)  — ID 1–20
     ════════════════════════════════════════════════════════════ */
  { id:1, name:'Kendo ชุดประแจปากตาย-แหวน 12 ชิ้น', category:'ประแจและบ็อกซ์', trades:['mechanic','plumber','aircon'], price:890, originalPrice:1190, stock:22, emoji:'🔧', description:'ประแจปากตาย-แหวน 12 ชิ้น ขนาด 6–32 มม. เหล็ก Chrome Vanadium ผ่าน Heat Treatment พร้อมถุงผ้าจัดเก็บ', brand:'Kendo', warranty:'1 ปี', weight:'1.8 kg' },
  { id:2, name:'Kendo ชุดบ็อกซ์ขับ 1/2" 46 ชิ้น', category:'ประแจและบ็อกซ์', trades:['mechanic','aircon'], price:1590, originalPrice:2100, stock:14, emoji:'🔩', description:'ชุดบ็อกซ์ขับ 1/2" 46 ชิ้น ขนาด 8–32 มม. พร้อมด้ามหมุน ด้ามฟรี และด้ามต่อ เก็บในกล่องพลาสติกแข็ง', brand:'Kendo', warranty:'1 ปี', weight:'3.5 kg' },
  { id:3, name:'Tone ประแจทอร์คดิจิทัล 1/2" 20-200 Nm', category:'ประแจและบ็อกซ์', trades:['mechanic'], price:4290, originalPrice:5500, stock:6, emoji:'⚙️', description:'ประแจทอร์คดิจิทัล LCD แสดงค่าแน่นอน ±2% ความแม่นยำ ขนาด 1/2" 20–200 Nm เหมาะงานยานยนต์ทุกประเภท', brand:'Tone', warranty:'2 ปี', weight:'1.2 kg' },
  { id:4, name:'Ingco ชุดถอดฟิลเตอร์น้ำมัน 3 ขนาด', category:'เครื่องมือเครื่องยนต์', trades:['mechanic'], price:390, originalPrice:550, stock:18, emoji:'🛢️', description:'ชุดถอดฟิลเตอร์น้ำมันเครื่อง 3 ขนาด 60/65/74 มม. เหล็กอย่างดี ใช้กับรถส่วนใหญ่ในตลาด', brand:'Ingco', warranty:'6 เดือน', weight:'0.4 kg' },
  { id:5, name:'OTC เครื่องวิเคราะห์เครื่องยนต์ OBD2', category:'เครื่องมือวินิจฉัย', trades:['mechanic'], price:2990, originalPrice:3800, stock:9, emoji:'📟', description:'เครื่องอ่านโค้ด OBD2 อ่าน-ลบโค้ดข้อผิดพลาด แสดงข้อมูล Real-time รองรับรถทุกยี่ห้อหลังปี 1996', brand:'OTC', warranty:'1 ปี', weight:'0.3 kg' },
  { id:6, name:'Stanley แม่แรงตะโพก 2 ตัน', category:'เครื่องมือเครื่องยนต์', trades:['mechanic'], price:1890, originalPrice:2400, stock:7, emoji:'🚗', description:'แม่แรงตะโพก 2 ตัน โครงเหล็กหนา ยกได้สูง 33–50 ซม. มีล้อเคลื่อนย้ายสะดวก เหมาะงานอู่', brand:'Stanley', warranty:'1 ปี', weight:'12 kg' },
  { id:7, name:'Laser ชุดถอดหัวเทียน 21 ชิ้น', category:'เครื่องมือเครื่องยนต์', trades:['mechanic'], price:790, originalPrice:990, stock:15, emoji:'💡', description:'ชุดถอดหัวเทียน 16/21 มม. ด้ามยาง กันลื่น รองรับหัวเทียนทั่วไปและ Iridium ใช้ร่วมกับชุดบ็อกซ์ 1/2"', brand:'Laser', warranty:'1 ปี', weight:'0.5 kg' },
  { id:8, name:'Bosch เครื่องอัดฉีดหัวฉีด GDS 18V-EC', category:'เครื่องมือเครื่องยนต์', trades:['mechanic'], price:6900, originalPrice:8500, stock:4, emoji:'🔫', description:'เครื่องประแจลม-ไฟฟ้าไร้สาย 18V แรงบิด 300 Nm เหมาะถอดล้อ โบลต์เครื่องยนต์ แบตเตอรี่ Li-Ion', brand:'Bosch', warranty:'2 ปี', weight:'1.9 kg' },
  { id:9, name:'Ingco ชุดดูดน้ำมันเครื่อง 7 ลิตร', category:'เครื่องมือเครื่องยนต์', trades:['mechanic'], price:890, originalPrice:1100, stock:20, emoji:'🪣', description:'ปั๊มดูดน้ำมันเครื่องแบบสูบมือ ขวด 7 ลิตร พร้อมสายดูด 2 เส้น ทดแทนการเปิดน็อตถ่ายน้ำมัน', brand:'Ingco', warranty:'6 เดือน', weight:'1.0 kg' },
  { id:10, name:'Laser เครื่องวัดแรงอัดกระบอกสูบ', category:'เครื่องมือวินิจฉัย', trades:['mechanic'], price:1290, originalPrice:1600, stock:10, emoji:'📊', description:'Compression Tester สำหรับเครื่องยนต์เบนซิน/ดีเซล วัดแรงดัน 0–300 PSI พร้อมอะแดปเตอร์ 8 หัว', brand:'Laser', warranty:'1 ปี', weight:'0.6 kg' },
  { id:11, name:'Draper ชุดคีมจระเข้และคีมปากแหลม 8 ชิ้น', category:'คีมช่างยนต์', trades:['mechanic'], price:1490, originalPrice:1900, stock:12, emoji:'🦊', description:'ชุดคีม 8 ชิ้น: คีมปากแหลม คีมปากแบน คีมตัดลวด คีมล็อค คีมจับแหวน ด้ามหุ้มยาง 2 สี', brand:'Draper', warranty:'2 ปี', weight:'1.2 kg' },
  { id:12, name:'Ingco สว่านไฟฟ้าไร้สาย 20V พร้อมบิต', category:'สว่านช่างยนต์', trades:['mechanic','carpenter'], price:2190, originalPrice:2800, stock:11, emoji:'🪛', description:'สว่าน/ไขควงไร้สาย 20V Li-Ion แรงบิด 40 Nm ปรับ 2 ความเร็ว พร้อมบิต 23 ชิ้น และแบตสำรอง', brand:'Ingco', warranty:'1 ปี', weight:'1.4 kg' },
  { id:13, name:'Silverline เซ็ตฟันเฟืองตั้งวาล์ว', category:'เครื่องมือเครื่องยนต์', trades:['mechanic'], price:1990, originalPrice:2500, stock:6, emoji:'⚙️', description:'ชุดเครื่องมือล็อกวาล์วและตั้งเวลาจุดระเบิด สำหรับรถยนต์ทั่วไป Honda/Toyota/Ford พร้อมคู่มือ', brand:'Silverline', warranty:'1 ปี', weight:'1.5 kg' },
  { id:14, name:'Knipex คีมล็อกแหวนสแนปริง 4 ชิ้น', category:'คีมช่างยนต์', trades:['mechanic'], price:1890, originalPrice:2400, stock:8, emoji:'🔗', description:'ชุดคีมแหวน Snap Ring 4 ชิ้น: ตรง/งอ ภายใน/ภายนอก ด้ามยาง 2 สี สปริงกดกลับ ใช้งานเบา', brand:'Knipex', warranty:'2 ปี', weight:'0.8 kg' },
  { id:15, name:'Facom ประแจหัวบล็อก 3/8" 1/4" ชุด 32 ชิ้น', category:'ประแจและบ็อกซ์', trades:['mechanic'], price:3490, originalPrice:4500, stock:7, emoji:'🔑', description:'ชุดบ็อกซ์ขับ 3/8" และ 1/4" 32 ชิ้น ขนาด 4–24 มม. เหล็กกล้าอัลลอย กล่องโลหะ Made in France', brand:'Facom', warranty:'Life', weight:'2.8 kg' },
  { id:16, name:'Draper เครื่องชาร์จแบตเตอรี่รถยนต์ 10A', category:'อุปกรณ์ไฟฟ้ารถ', trades:['mechanic'], price:1490, originalPrice:1900, stock:13, emoji:'🔋', description:'เครื่องชาร์จแบต 6V/12V 10A Automatic ป้องกันชาร์จเกิน/กลับขั้ว/ลัดวงจร แสดงสถานะ LED 6 ขั้น', brand:'Draper', warranty:'1 ปี', weight:'1.5 kg' },
  { id:17, name:'Gunson Colourtune ชุดตั้งน้ำมันเชื้อเพลิง', category:'เครื่องมือวินิจฉัย', trades:['mechanic'], price:1290, originalPrice:1600, stock:9, emoji:'🎨', description:'หัวเทียนพิเศษ+ไฟฉายส่องดูสีเปลวไฟ ช่วยปรับอัตราส่วนน้ำมัน-อากาศให้เหมาะสมสำหรับ Carburetor', brand:'Gunson', warranty:'1 ปี', weight:'0.3 kg' },
  { id:18, name:'Laser ชุดยาแนวซีลกล่องเกียร์ (Sealant)', category:'วัสดุสิ้นเปลือง', trades:['mechanic'], price:290, originalPrice:390, stock:40, emoji:'🧴', description:'กาวซีลยาแนว Anaerobic สำหรับฝาครอบเกียร์/น้ำมัน ทนน้ำมันเครื่อง ทนความร้อน 150°C', brand:'Laser', warranty:'-', weight:'0.1 kg' },
  { id:19, name:'Draper ชุดดึงลูกปืน Bearing Puller 3 ขา', category:'เครื่องมือเครื่องยนต์', trades:['mechanic'], price:1190, originalPrice:1500, stock:10, emoji:'🧲', description:'Gear/Bearing Puller 3 ขา ขนาด 100–200 มม. เหล็กหล่อ ดึงลูกปืน/เฟือง/ฮับล้อ โดยไม่ทำลายชิ้นงาน', brand:'Draper', warranty:'1 ปี', weight:'1.1 kg' },
  { id:20, name:'Pro Safety ชุดอุปกรณ์ความปลอดภัยช่างยนต์', category:'อุปกรณ์ความปลอดภัย', trades:['mechanic','welder','construction'], price:450, originalPrice:590, stock:50, emoji:'⛑️', description:'ชุด 3 ชิ้น: หมวกนิรภัย + แว่นตา + ที่ปิดหู ได้มาตรฐาน ANSI/ISEA เหมาะทุกสายช่าง', brand:'Safety Pro', warranty:'6 เดือน', weight:'0.5 kg' },

  /* ════════════════════════════════════════════════════════════
     ⚡ ช่างไฟฟ้า (electrical)  — ID 21–40
     ════════════════════════════════════════════════════════════ */
  { id:21, name:'Fluke 117 มัลติมิเตอร์ดิจิทัล True RMS', category:'เครื่องมือวัดไฟฟ้า', trades:['electrical','aircon'], price:5290, originalPrice:6500, stock:8, emoji:'📟', description:'มัลติมิเตอร์ True RMS อ่านค่า VAC/VDC/A/Ω/Hz แม่นยำ ป้องกันรับแรงดันเกิน CAT III 600V มือถือสะดวก', brand:'Fluke', warranty:'3 ปี', weight:'0.3 kg' },
  { id:22, name:'Knipex คีมปอกสายไฟอัตโนมัติ AWG 10-24', category:'คีมช่างไฟฟ้า', trades:['electrical'], price:1290, originalPrice:1600, stock:16, emoji:'✂️', description:'คีมปอกสายไฟ Self-adjusting ปอกสายได้ AWG 10–24 แบบอัตโนมัติ ไม่ตัดเส้นสาย ด้ามยาง 2 สี', brand:'Knipex', warranty:'2 ปี', weight:'0.2 kg' },
  { id:23, name:'Wera ชุดไขควงหัวแฉก+แบน 7 ชิ้น', category:'ไขควงช่างไฟฟ้า', trades:['electrical','mechanic','aircon'], price:990, originalPrice:1290, stock:25, emoji:'🪛', description:'ชุดไขควงด้ามสีสดใส 7 ชิ้น หัวแฉก PH0–PH3 + แบน SL 3–8 ด้ามยาง Kraftform จับกระชับ ทนแรงบิด', brand:'Wera', warranty:'1 ปี', weight:'0.5 kg' },
  { id:24, name:'Fluke 323 แคลมป์มิเตอร์ AC 400A', category:'เครื่องมือวัดไฟฟ้า', trades:['electrical','aircon'], price:3490, originalPrice:4200, stock:5, emoji:'🔋', description:'แคลมป์มิเตอร์วัดกระแส AC ได้ถึง 400A โดยไม่ตัดวงจร วัด VAC/VDC/Ω เหมาะงานไฟฟ้า-แอร์', brand:'Fluke', warranty:'3 ปี', weight:'0.3 kg' },
  { id:25, name:'Megger MIT400 เครื่องทดสอบฉนวน 500V', category:'เครื่องมือวัดไฟฟ้า', trades:['electrical'], price:8900, originalPrice:11000, stock:3, emoji:'⚡', description:'เครื่องทดสอบความเป็นฉนวน 500V/1000V อ่านค่า Insulation Resistance ได้ถึง 10 GΩ พร้อมรายงาน', brand:'Megger', warranty:'2 ปี', weight:'0.6 kg' },
  { id:26, name:'Ideal Industries เครื่องทดสอบวงจร 3 สาย', category:'เครื่องมือวัดไฟฟ้า', trades:['electrical'], price:1490, originalPrice:1900, stock:18, emoji:'🔌', description:'Circuit Tester ตรวจสอบเต้าเสียบ 3 สาย แสดงผล LED แยกแยะ Phase/Neutral/Earth ผิด ใช้งานง่าย', brand:'Ideal', warranty:'1 ปี', weight:'0.2 kg' },
  { id:27, name:'Knipex คีมตัดสายทองแดง 95A 240 mm', category:'คีมช่างไฟฟ้า', trades:['electrical'], price:2190, originalPrice:2700, stock:10, emoji:'⚔️', description:'คีมตัดสายทองแดง/อะลูมิเนียมสูงสุด 240 ตร.มม. ด้ามจับ DIP-coated ป้องกันแรงดันสูงถึง 1000V AC', brand:'Knipex', warranty:'2 ปี', weight:'0.7 kg' },
  { id:28, name:'Klein Tools ไขควงหัว Torx ชุด 9 ชิ้น', category:'ไขควงช่างไฟฟ้า', trades:['electrical'], price:890, originalPrice:1150, stock:20, emoji:'🌟', description:'ชุดไขควง Torx T6–T40 9 ชิ้น ด้ามสีสลับ ป้องกันลื่น ใบไขควงแม่เหล็กดูดน็อต ใช้งานแผงไฟฟ้า', brand:'Klein Tools', warranty:'Life', weight:'0.4 kg' },
  { id:29, name:'Panduit เครื่องรัดสายไฟ Cable Tie Gun', category:'เครื่องมืองานสายไฟ', trades:['electrical'], price:1790, originalPrice:2200, stock:12, emoji:'🔫', description:'ปืนรัดสายไฟอัตโนมัติ ปรับแรงตึงได้ ตัดส่วนเกินในตัว รองรับ Cable Tie กว้าง 2.4–4.8 มม.', brand:'Panduit', warranty:'2 ปี', weight:'0.3 kg' },
  { id:30, name:'Bosch GHG 650 CE ปืนเป่าลมร้อน 650W', category:'เครื่องมือช่างไฟฟ้า', trades:['electrical','construction','painter'], price:2190, originalPrice:2700, stock:8, emoji:'🌬️', description:'ปืนเป่าลมร้อน 650W ปรับอุณหภูมิ 50–650°C ปรับอัตราลม 2 ระดับ ใช้ย่อท่อ/ลอกสี', brand:'Bosch', warranty:'2 ปี', weight:'0.6 kg' },
  { id:31, name:'Fluke T6-600 ทดสอบไฟฟ้าแบบสัมผัส', category:'เครื่องมือวัดไฟฟ้า', trades:['electrical'], price:4290, originalPrice:5200, stock:6, emoji:'🖐️', description:'Electrical Tester วัดแรงดันไฟฟ้าโดยไม่ต้องสัมผัสสาย FieldSense Technology วัด V/A/Hz ปลอดภัย', brand:'Fluke', warranty:'3 ปี', weight:'0.2 kg' },
  { id:32, name:'Wago 221 ตัวเชื่อมต่อสาย Lever Cage ชุด 50', category:'วัสดุงานไฟฟ้า', trades:['electrical'], price:590, originalPrice:790, stock:60, emoji:'🟡', description:'ข้อต่อสาย Lever-Cage 50 ชิ้น คละขนาด 2/3/5 ขา รองรับสาย 0.5–6 ตร.มม. เชื่อมต่อง่ายไม่ต้องบัดกรี', brand:'Wago', warranty:'-', weight:'0.3 kg' },
  { id:33, name:'Fluke 62 Max เทอร์โมมิเตอร์อินฟราเรด', category:'เครื่องมือวัดไฟฟ้า', trades:['electrical','aircon'], price:3290, originalPrice:4000, stock:9, emoji:'🌡️', description:'เทอร์โมมิเตอร์ IR วัดอุณหภูมิ -30°C ถึง 500°C ระยะ D:S = 10:1 ป้องกันกันชนน้ำตก IP54', brand:'Fluke', warranty:'2 ปี', weight:'0.3 kg' },
  { id:34, name:'Klein Tools ไฟฉายหัวหมวก LED 300 ลูเมน', category:'อุปกรณ์แสงสว่าง', trades:['electrical','mechanic','plumber'], price:590, originalPrice:790, stock:30, emoji:'💡', description:'ไฟฉายหัวหมวก LED 300 ลูเมน ปรับหัวได้ 270° แบตอัลคาไลน์ AAA รองรับงานมืดทุกประเภท', brand:'Klein Tools', warranty:'1 ปี', weight:'0.2 kg' },
  { id:35, name:'Southwire เครื่องต่อสาย Crimping Tool', category:'เครื่องมืองานสายไฟ', trades:['electrical'], price:1190, originalPrice:1490, stock:14, emoji:'🔗', description:'เครื่องย้ำหัวสาย Crimp ขนาด 0.5–16 ตร.มม. ด้ามยางกันลื่น ใบมีดเปลือย ใช้งานร่วม Ferrule/Lug', brand:'Southwire', warranty:'1 ปี', weight:'0.4 kg' },
  { id:36, name:'Stabila ระดับน้ำดิจิทัล 40 ซม.', category:'เครื่องมือวัดและมาร์ค', trades:['electrical','construction','carpenter'], price:2490, originalPrice:3100, stock:8, emoji:'📐', description:'ระดับน้ำดิจิทัล 40 ซม. แสดงค่าองศา 0.1° IP65 กันน้ำ-ฝุ่น แม่เหล็กติดรางโลหะ', brand:'Stabila', warranty:'2 ปี', weight:'0.4 kg' },
  { id:37, name:'Wiha ชุดบิตไขควงแม่เหล็ก 25 มม. 31 ชิ้น', category:'ไขควงช่างไฟฟ้า', trades:['electrical','mechanic'], price:890, originalPrice:1190, stock:22, emoji:'🧲', description:'ชุดบิต 25 มม. 31 ชิ้น: PH/PZ/Torx/Hex/Slot เหล็ก S2 แม่เหล็กถาวร ใช้กับสว่านไฟฟ้าทุกรุ่น', brand:'Wiha', warranty:'2 ปี', weight:'0.3 kg' },
  { id:38, name:'Klein Tools ถุงมือฉนวนไฟฟ้า 1000V', category:'อุปกรณ์ความปลอดภัย', trades:['electrical'], price:1890, originalPrice:2400, stock:15, emoji:'🧤', description:'ถุงมือฉนวนไฟฟ้า Class 0 ทนแรงดัน 1000V AC ยางธรรมชาติแท้ ยาว 30 ซม. มาตรฐาน IEC 60903', brand:'Klein Tools', warranty:'1 ปี', weight:'0.3 kg' },
  { id:39, name:'Draper เทปพันสายไฟ PVC ชุด 10 ม้วน', category:'วัสดุงานไฟฟ้า', trades:['electrical'], price:290, originalPrice:390, stock:80, emoji:'🎁', description:'เทปพันสาย PVC 10 ม้วน คละสี (ดำ/แดง/เขียว/เหลือง/น้ำเงิน) กว้าง 19 มม. ยาว 10 ม. กาวแน่น', brand:'Draper', warranty:'-', weight:'0.4 kg' },
  { id:40, name:'Stanley สายวัด 5 ม. FatMax', category:'เครื่องมือวัดและมาร์ค', trades:['electrical','carpenter','construction','plumber'], price:650, originalPrice:850, stock:35, emoji:'📏', description:'สายวัดสปริง 5 ม. ฟันเลื่อยกันลื่น ล็อคอัตโนมัติ ตัวเรือนยางกันกระแทก มีคลิปเกี่ยวเข็มขัด', brand:'Stanley', warranty:'1 ปี', weight:'0.3 kg' },

  /* ════════════════════════════════════════════════════════════
     🚿 ช่างประปา (plumber)  — ID 41–60
     ════════════════════════════════════════════════════════════ */
  { id:41, name:'Ridgid ประแจท่อ Stillson 14"', category:'ประแจท่อ', trades:['plumber'], price:890, originalPrice:1150, stock:20, emoji:'🔩', description:'ประแจท่อ Stillson 14 นิ้ว จับท่อขนาด 1/8"–2" เหล็กหล่อหนา ปรับขนาดได้ด้วยเกลียว ทนทาน', brand:'Ridgid', warranty:'1 ปี', weight:'1.5 kg' },
  { id:42, name:'Rothenberger เครื่องดัดท่อทองแดง 3/8"-7/8"', category:'เครื่องมือท่อ', trades:['plumber','aircon'], price:2490, originalPrice:3200, stock:8, emoji:'🔄', description:'เครื่องดัดท่อทองแดง Ratchet ดัดท่อ 3/8", 1/2", 5/8", 3/4", 7/8" มุมได้ถึง 180° ไม่ยุบท่อ', brand:'Rothenberger', warranty:'2 ปี', weight:'1.8 kg' },
  { id:43, name:'Knipex คีมจับท่อ Cobra 10"', category:'คีมประปา', trades:['plumber','mechanic'], price:1590, originalPrice:1990, stock:12, emoji:'🐍', description:'คีมจับท่อปรับ 25 ระดับ ขนาด 10 นิ้ว จับท่อได้ถึง 2.5 นิ้ว ด้ามพลาสติก ABS กันลื่นมือเปียก', brand:'Knipex', warranty:'2 ปี', weight:'0.4 kg' },
  { id:44, name:'Virax ชุดต๊าปเกลียวท่อ BSP 1/2"-2"', category:'เครื่องมือท่อ', trades:['plumber'], price:3290, originalPrice:4000, stock:5, emoji:'🌀', description:'ชุดต๊าปเกลียวท่อ BSP 1/2", 3/4", 1", 1-1/4", 1-1/2", 2" พร้อมด้ามหมุน เหล็ก HSS ความแม่นยำสูง', brand:'Virax', warranty:'1 ปี', weight:'2.8 kg' },
  { id:45, name:'Ridgid เครื่องตัดท่อ PVC/PPR 63 มม.', category:'เครื่องมือตัดท่อ', trades:['plumber'], price:1490, originalPrice:1900, stock:14, emoji:'✂️', description:'กรรไกรตัดท่อ PVC/PPR/PE ขนาดสูงสุด 63 มม. มีดสแตนเลส ฤดูหนาวไม่เปราะ มีสปริงเปิดอัตโนมัติ', brand:'Ridgid', warranty:'2 ปี', weight:'0.5 kg' },
  { id:46, name:'Draper ที่ถ่างท่อทองแดง Flaring Tool 1/4"-3/4"', category:'เครื่องมือท่อ', trades:['plumber','aircon'], price:1890, originalPrice:2400, stock:9, emoji:'🔔', description:'ที่ถ่างปากท่อทองแดง (Flaring) ขนาด 1/4"–3/4" สำหรับต่อท่อน้ำหรือสารทำความเย็น ฝาครอบทองเหลือง', brand:'Draper', warranty:'1 ปี', weight:'0.8 kg' },
  { id:47, name:'Ingco เครื่องตัดท่อเหล็ก 3/8"-2"', category:'เครื่องมือตัดท่อ', trades:['plumber'], price:590, originalPrice:790, stock:18, emoji:'⚙️', description:'ที่ตัดท่อเหล็กแบบหมุน 3/8"–2" ใบตัดสแตนเลส ปรับขนาดด้วยสกรู ตัดแนบเรียบโดยไม่ต้องเป่าปาก', brand:'Ingco', warranty:'6 เดือน', weight:'0.4 kg' },
  { id:48, name:'Rothenberger เครื่องต่อท่อ PPRC Fusion 20-63 มม.', category:'เครื่องมือท่อ', trades:['plumber'], price:2890, originalPrice:3600, stock:7, emoji:'🔥', description:'เครื่องเชื่อมท่อ PPR แบบ Socket Fusion 800W หัว 20/25/32/40/50/63 มม. อุณหภูมิ 260°C', brand:'Rothenberger', warranty:'1 ปี', weight:'2.5 kg' },
  { id:49, name:'Draper ประแจเอียง Adjustable 12"', category:'ประแจท่อ', trades:['plumber','mechanic'], price:590, originalPrice:790, stock:22, emoji:'🔧', description:'ประแจเลื่อน 12 นิ้ว จับชิ้นงาน 0–40 มม. เหล็ก Drop-forged Chrome Vanadium กันสนิม', brand:'Draper', warranty:'1 ปี', weight:'0.7 kg' },
  { id:50, name:'Ridgid เครื่องเป่าอุดท่อ Hydraulic Pump', category:'เครื่องมือท่อ', trades:['plumber'], price:5490, originalPrice:6800, stock:4, emoji:'💧', description:'ปั๊มอัดน้ำทดสอบแรงดันท่อ Hydraulic 0–60 bar พร้อมเกจ วัดรั่วท่อน้ำและระบบดับเพลิง', brand:'Ridgid', warranty:'2 ปี', weight:'4.5 kg' },
  { id:51, name:'Stabila ระดับน้ำอะลูมิเนียม 80 ซม.', category:'เครื่องมือวัด', trades:['plumber','construction','carpenter'], price:890, originalPrice:1200, stock:20, emoji:'📐', description:'ระดับน้ำอะลูมิเนียม 80 ซม. 3 ฟอง แม่นยำ ±0.5 มม./ม. ขอบป้องกันการชน ใช้งานในพื้นที่แคบ', brand:'Stabila', warranty:'2 ปี', weight:'0.7 kg' },
  { id:52, name:'Ingco สว่านกระแทกไฟฟ้า 500W', category:'สว่านประปา', trades:['plumber','construction'], price:1890, originalPrice:2400, stock:12, emoji:'🛠️', description:'สว่านกระแทก 13 มม. 500W ใช้เจาะท่อผ่านผนัง ปรับ 2 ความเร็ว ชัค Keyless พร้อมด้ามจับเสริม', brand:'Ingco', warranty:'1 ปี', weight:'1.9 kg' },
  { id:53, name:'Draper ที่ล้างท่อ Drain Auger ยาว 7.5 ม.', category:'เครื่องมือท่อตัน', trades:['plumber'], price:1190, originalPrice:1500, stock:10, emoji:'🐛', description:'สว่านล้างท่อตัน 7.5 ม. หัวเกลียวอย่างดี ใส่ในท่อขนาด 32–100 มม. ด้ามหมุนยาง ทำงานง่าย', brand:'Draper', warranty:'1 ปี', weight:'1.5 kg' },
  { id:54, name:'Kendo ชุดประแจบล็อกน็อตกลม 14 ชิ้น', category:'ประแจท่อ', trades:['plumber','mechanic'], price:990, originalPrice:1290, stock:16, emoji:'⭕', description:'ชุดประแจบล็อกน็อตกลม 14 ชิ้น ขนาด 8–36 มม. เหล็ก CrV ใช้ถอดน็อตปัดน้ำกระป๋องทรงกลม', brand:'Kendo', warranty:'1 ปี', weight:'1.2 kg' },
  { id:55, name:'Rectorseal เทปเทฟลอนอย่างหนา 1/2" ยาว 10 ม.', category:'วัสดุประปา', trades:['plumber','aircon'], price:89, originalPrice:120, stock:100, emoji:'🎀', description:'เทปเทฟลอน PTFE อย่างหนา กว้าง 1/2" ยาว 10 ม. กันซึมข้อต่อเกลียวโลหะและ ABS ทนความดัน', brand:'Rectorseal', warranty:'-', weight:'0.05 kg' },
  { id:56, name:'Bosch GBH 2-26 DRE สว่านโรตารี่ SDS+ 800W', category:'สว่านประปา', trades:['plumber','construction'], price:6990, originalPrice:8500, stock:5, emoji:'💪', description:'โรตารี่แฮมเมอร์ SDS+ 800W แรงกระแทก 2.7J เจาะปูนเพื่อวางท่อ 3 ฟังก์ชัน: เจาะ/กระแทก/สกัด', brand:'Bosch', warranty:'2 ปี', weight:'2.9 kg' },
  { id:57, name:'Draper ชุดอุดรั่วท่อ Emergency Pipe Repair', category:'วัสดุประปา', trades:['plumber'], price:390, originalPrice:550, stock:30, emoji:'🩹', description:'ชุดอุดรั่วฉุกเฉิน: เทปยางอัด + คลิปรัดท่อ สำหรับท่อ 15–54 มม. ใช้ฉุกเฉินรอซ่อมถาวร', brand:'Draper', warranty:'-', weight:'0.3 kg' },
  { id:58, name:'Klein Tools ไฟฉาย LED ทนน้ำ IP68 600 lm', category:'อุปกรณ์ประปา', trades:['plumber','mechanic'], price:890, originalPrice:1190, stock:18, emoji:'🔦', description:'ไฟฉาย LED 600 ลูเมน กันน้ำ IP68 ดำน้ำได้ 2 เมตร แบตอัลคาไลน์ AA ใช้งานในท่อ-บ่อ', brand:'Klein Tools', warranty:'2 ปี', weight:'0.3 kg' },
  { id:59, name:'Rectorseal No.5 สารซีลเกลียวท่อ 250 มล.', category:'วัสดุประปา', trades:['plumber'], price:390, originalPrice:520, stock:40, emoji:'🧴', description:'สารซีลเกลียวท่อ Thread Sealant 250 มล. ทนความดัน 150 PSI ทนน้ำ/น้ำมัน/ไอน้ำ ไม่แห้งแข็งตัว', brand:'Rectorseal', warranty:'-', weight:'0.3 kg' },
  { id:60, name:'Pro Safety ชุดอุปกรณ์ความปลอดภัยช่างประปา', category:'อุปกรณ์ความปลอดภัย', trades:['plumber','construction'], price:590, originalPrice:790, stock:25, emoji:'🦺', description:'ชุดเสื้อกั๊กสะท้อนแสง + ถุงมือยาง + แว่นกันน้ำ สำหรับงานประปาและก่อสร้าง มาตรฐาน ANSI', brand:'Safety Pro', warranty:'6 เดือน', weight:'0.4 kg' },

  /* ════════════════════════════════════════════════════════════
     🔥 ช่างเชื่อม (welder)  — ID 61–80
     ════════════════════════════════════════════════════════════ */
  { id:61, name:'Lincoln เครื่องเชื่อม MIG/MAG 200A IGBT', category:'เครื่องเชื่อม', trades:['welder'], price:18900, originalPrice:22000, stock:4, emoji:'🔥', description:'เครื่องเชื่อม MIG/MAG 200A IGBT ปรับ Voltage/Wire Speed แยก รองรับลวด 0.6–1.0 มม. ฟังก์ชัน Synergic', brand:'Lincoln', warranty:'2 ปี', weight:'18 kg' },
  { id:62, name:'ESAB หน้ากากเชื่อม Auto-Darkening DIN 9-13', category:'อุปกรณ์ความปลอดภัยเชื่อม', trades:['welder'], price:2290, originalPrice:2900, stock:14, emoji:'🥽', description:'หน้ากากเชื่อมปรับความเข้มแสงอัตโนมัติ DIN 9–13 ตอบสนองใน 1/30,000 วินาที น้ำหนักเบา 480g', brand:'ESAB', warranty:'1 ปี', weight:'0.5 kg' },
  { id:63, name:'Ingco เครื่องเจียรไฟฟ้า 4" 900W', category:'เครื่องมือตัดโลหะ', trades:['welder','construction','mechanic'], price:1450, originalPrice:1800, stock:11, emoji:'💥', description:'เครื่องเจียรไฟฟ้า 4 นิ้ว 900W ดิสก์ตัดเหล็กคุณภาพสูง ป้องกันการสะท้อนกลับ ปรับความเร็วได้', brand:'Ingco', warranty:'1 ปี', weight:'1.6 kg' },
  { id:64, name:'Lincoln ถุงมือหนังช่างเชื่อม 14"', category:'อุปกรณ์ความปลอดภัยเชื่อม', trades:['welder'], price:490, originalPrice:650, stock:28, emoji:'🧤', description:'ถุงมือหนังวัวแท้ยาว 14 นิ้ว ทนความร้อนได้ถึง 300°C ป้องกันประกายไฟและรังสี UV ปลอกแขนยาว', brand:'Lincoln', warranty:'6 เดือน', weight:'0.3 kg' },
  { id:65, name:'ค้อนเคาะตะกรันเชื่อม + แปรงลวด', category:'อุปกรณ์งานเชื่อม', trades:['welder'], price:290, originalPrice:390, stock:35, emoji:'🔨', description:'ชุด 2 ชิ้น: ค้อนเคาะตะกรัน + แปรงลวดเหล็ก ด้ามไม้หนาแน่น ทนความร้อน ทำความสะอาดแนวเชื่อม', brand:'Pro Weld', warranty:'6 เดือน', weight:'0.4 kg' },
  { id:66, name:'Miller เครื่องเชื่อม TIG 200A AC/DC', category:'เครื่องเชื่อม', trades:['welder'], price:42000, originalPrice:52000, stock:2, emoji:'✨', description:'เครื่องเชื่อม TIG AC/DC 200A สำหรับงานอะลูมิเนียม/สแตนเลส Squarewave Technology ปรับ HF Start', brand:'Miller', warranty:'3 ปี', weight:'22 kg' },
  { id:67, name:'Hypertherm เครื่องตัดพลาสม่า Powermax30', category:'เครื่องตัดโลหะ', trades:['welder'], price:38000, originalPrice:46000, stock:3, emoji:'⚡', description:'เครื่องตัดพลาสม่า 30A ตัดโลหะหนาได้ 12 มม. น้ำหนักเบา 9.5 กก. ใช้ไฟ 1 เฟส 220V', brand:'Hypertherm', warranty:'2 ปี', weight:'9.5 kg' },
  { id:68, name:'ESAB ลวดเชื่อม MIG ER70S-6 ขนาด 0.9 มม. 15 กก.', category:'วัสดุสิ้นเปลือง', trades:['welder'], price:1890, originalPrice:2400, stock:20, emoji:'🌀', description:'ลวดเชื่อม MIG ER70S-6 Solid Wire ขนาด 0.9 มม. ม้วน 15 กก. สำหรับเชื่อมเหล็กอ่อน/โครงสร้าง', brand:'ESAB', warranty:'-', weight:'15 kg' },
  { id:69, name:'Draper โต๊ะเชื่อม Steel Welding Table 120×60', category:'อุปกรณ์ช่างเชื่อม', trades:['welder'], price:8900, originalPrice:11000, stock:4, emoji:'🗄️', description:'โต๊ะเชื่อมเหล็กหนา 5 มม. ขนาด 120×60×80 ซม. มีรูจับแคลมป์ รับน้ำหนัก 200 กก. ทนความร้อน', brand:'Draper', warranty:'2 ปี', weight:'45 kg' },
  { id:70, name:'Lincoln แคลมป์จับชิ้นงานเชื่อม C-Clamp 8"', category:'อุปกรณ์จับยึด', trades:['welder','carpenter'], price:390, originalPrice:520, stock:30, emoji:'🗜️', description:'C-Clamp เหล็กหล่อ 8 นิ้ว เปิดปากได้ 200 มม. ใช้จับชิ้นงานขณะเชื่อม แรงจับ 3 ตัน', brand:'Lincoln', warranty:'1 ปี', weight:'1.5 kg' },
  { id:71, name:'Bosch เครื่องเจียร 5" 1400W ปรับความเร็ว', category:'เครื่องมือตัดโลหะ', trades:['welder','construction'], price:3490, originalPrice:4300, stock:6, emoji:'🌀', description:'เครื่องเจียรไฟฟ้า 5" 1400W ปรับความเร็วได้ 2800–11000 RPM ป้องกันสะท้อนกลับ กระปุกเกียร์เย็น', brand:'Bosch', warranty:'2 ปี', weight:'2.3 kg' },
  { id:72, name:'ESAB หน้ากากกันควันเชื่อม Speedglas 9100', category:'อุปกรณ์ความปลอดภัยเชื่อม', trades:['welder'], price:12500, originalPrice:15000, stock:3, emoji:'😷', description:'หน้ากากกรองควันเชื่อม PAPR รวมกับหน้ากากเชื่อม Auto-Dark ป้องกัน Fume/Ozone/NO2 สำหรับงานเชื่อมนาน', brand:'ESAB', warranty:'1 ปี', weight:'1.2 kg' },
  { id:73, name:'Draper เสื้อกันไฟช่างเชื่อม FR Cotton', category:'อุปกรณ์ความปลอดภัยเชื่อม', trades:['welder'], price:1290, originalPrice:1600, stock:20, emoji:'🧥', description:'เสื้อกันไฟ Flame Resistant ผ้าฝ้าย 100% ทนประกายไฟ ไม่ละลาย มาตรฐาน EN ISO 11612 ไซส์ M–2XL', brand:'Draper', warranty:'1 ปี', weight:'0.6 kg' },
  { id:74, name:'Fluke 323 แคลมป์มิเตอร์ตรวจสอบเครื่องเชื่อม', category:'เครื่องมือวัด', trades:['welder','electrical'], price:3490, originalPrice:4200, stock:5, emoji:'📊', description:'แคลมป์มิเตอร์วัดกระแส AC/DC ได้ถึง 400A ตรวจสอบกระแสเชื่อมและฟังก์ชันเครื่องเชื่อม', brand:'Fluke', warranty:'3 ปี', weight:'0.3 kg' },
  { id:75, name:'Sealey แม่เหล็กจับชิ้นงานเชื่อม 30 กก. 5 ชิ้น', category:'อุปกรณ์จับยึด', trades:['welder'], price:890, originalPrice:1190, stock:18, emoji:'🧲', description:'ชุดแม่เหล็กเชื่อม 5 ชิ้น ดูด 30 กก./ชิ้น มุม 45°/90°/135° ช่วยจับชิ้นงานขณะเชื่อมโครงสร้าง', brand:'Sealey', warranty:'1 ปี', weight:'2.0 kg' },
  { id:76, name:'Lincoln ผงฟลักซ์บัดกรีทองแดงแข็ง Flux Paste', category:'วัสดุสิ้นเปลือง', trades:['welder','plumber'], price:190, originalPrice:270, stock:50, emoji:'🧪', description:'Flux Paste สำหรับบัดกรีทองแดง/ทองเหลือง 250 มล. ทำความสะอาดพื้นผิวและป้องกันออกซิเดชัน', brand:'Lincoln', warranty:'-', weight:'0.3 kg' },
  { id:77, name:'Draper ชุดปั้มดูดควันเชื่อม Fume Extractor', category:'อุปกรณ์ความปลอดภัยเชื่อม', trades:['welder'], price:4900, originalPrice:6200, stock:5, emoji:'💨', description:'เครื่องดูดควันเชื่อม 200 m³/h พร้อมแขนท่อ 3 ม. ปรับทิศทางได้ ฟิลเตอร์ HEPA กรองฝุ่น PM2.5', brand:'Draper', warranty:'1 ปี', weight:'12 kg' },
  { id:78, name:'Kendo คีมจับชิ้นงานร้อน 400 มม.', category:'อุปกรณ์งานเชื่อม', trades:['welder'], price:490, originalPrice:650, stock:25, emoji:'🦀', description:'คีมจับชิ้นงานโลหะร้อน ยาว 400 มม. เหล็กหนาแน่น ด้ามพันลวด กันลื่น ใช้หยิบชิ้นงานหลังเชื่อม', brand:'Kendo', warranty:'6 เดือน', weight:'0.5 kg' },
  { id:79, name:'Bosch เครื่องเจียรตั้งโต๊ะ 150W', category:'เครื่องมือตัดโลหะ', trades:['welder','mechanic'], price:2490, originalPrice:3100, stock:7, emoji:'🔵', description:'เครื่องลับคมตั้งโต๊ะ 150W หินเจียร 2 ด้าน 150 มม. ปรับมุมได้ ใช้ลับสิ่ว ดอกสว่าน ใบมีด', brand:'Bosch', warranty:'2 ปี', weight:'4.5 kg' },
  { id:80, name:'Pro Safety แว่นตาเชื่อม OXY-Acetylene', category:'อุปกรณ์ความปลอดภัยเชื่อม', trades:['welder'], price:390, originalPrice:520, stock:30, emoji:'🕶️', description:'แว่นตาเชื่อมก๊าซ Oxy-Acetylene เลนส์กรองแสง Shade 5 กระจกฝ้าสีเขียว กันประกายไฟ UV/IR', brand:'Safety Pro', warranty:'6 เดือน', weight:'0.1 kg' },

  /* ════════════════════════════════════════════════════════════
     🪚 ช่างไม้ (carpenter)  — ID 81–100
     ════════════════════════════════════════════════════════════ */
  { id:81, name:'Makita เลื่อยวงเดือนไฟฟ้า 7-1/4" 1200W', category:'เครื่องมือตัดไม้', trades:['carpenter','construction'], price:4990, originalPrice:6200, stock:6, emoji:'🪚', description:'เลื่อยวงเดือน 7-1/4" 1200W ใบเลื่อย TCT ตัดตรง-เฉียงปรับมุม 0–45° ตัดไม้หนา 67 มม.', brand:'Makita', warranty:'2 ปี', weight:'3.8 kg' },
  { id:82, name:'Bosch GSB 13RE สว่านกระแทก 650W', category:'สว่านช่างไม้', trades:['carpenter','construction'], price:2690, originalPrice:3200, stock:10, emoji:'🛠️', description:'สว่านกระแทก 13 มม. 650W ปรับ 2 ความเร็ว ใช้เจาะปูน/ไม้/โลหะ ชัค Keyless พร้อมกล่อง', brand:'Bosch', warranty:'2 ปี', weight:'2.1 kg' },
  { id:83, name:'Narex ชุดสิ่วไม้ 4 ชิ้น 6-32 มม.', category:'สิ่วและกบ', trades:['carpenter'], price:1190, originalPrice:1600, stock:15, emoji:'🔪', description:'ชุดสิ่วไม้ 4 ชิ้น ขนาด 6, 12, 20, 32 มม. เหล็ก Chrome-Manganese ด้ามบีชไม้แท้ ผ่านการชุบแข็ง', brand:'Narex', warranty:'1 ปี', weight:'0.6 kg' },
  { id:84, name:'Makita เครื่องขัดสั่น 300W BO4556', category:'เครื่องขัดไม้', trades:['carpenter','painter'], price:1890, originalPrice:2400, stock:9, emoji:'🪵', description:'เครื่องขัดสั่น 300W แผ่นขัด 93×185 มม. ปรับความเร็วได้ 7000–12000/นาที ถุงเก็บฝุ่นในตัว', brand:'Makita', warranty:'2 ปี', weight:'1.3 kg' },
  { id:85, name:'Festool เราท์เตอร์ไม้ 2200W OF 2200 EB', category:'เครื่องมือตัดไม้', trades:['carpenter'], price:28000, originalPrice:34000, stock:2, emoji:'🌪️', description:'เราท์เตอร์ไม้ 2200W ปรับความลึกละเอียด 0.1 มม. จับดอก 6/8/12 มม. พร้อมจิ๊กรางนำ Made in Germany', brand:'Festool', warranty:'3 ปี', weight:'5.4 kg' },
  { id:86, name:'Bosch เลื่อยจิ๊กซอ 700W GST 700', category:'เครื่องมือตัดไม้', trades:['carpenter','construction'], price:2990, originalPrice:3700, stock:8, emoji:'〰️', description:'เลื่อยจิ๊กซอ 700W ตัดไม้ 135 มม. เหล็ก 10 มม. อะลูมิเนียม 20 มม. ปรับ 4 รูปแบบการเคลื่อนที่ใบ', brand:'Bosch', warranty:'2 ปี', weight:'2.8 kg' },
  { id:87, name:'Lie-Nielsen กบไสไม้ No.4 สแตนเลส', category:'สิ่วและกบ', trades:['carpenter'], price:8900, originalPrice:11000, stock:3, emoji:'✈️', description:'กบไสไม้ No.4 ขนาดมาตรฐาน หน้ากว้าง 50 มม. เหล็กกล้า A2 ด้ามและฐาน Ductile Iron Made in USA', brand:'Lie-Nielsen', warranty:'Life', weight:'2.1 kg' },
  { id:88, name:'Makita สว่านกระแทกไร้สาย 18V DHP484', category:'สว่านช่างไม้', trades:['carpenter','construction'], price:6490, originalPrice:7900, stock:7, emoji:'🔩', description:'สว่าน/ไขควงกระแทกไร้สาย 18V BL แรงบิด 54 Nm 2 ความเร็ว 13 ขั้นคลัตช์ พร้อมแบต 3.0Ah 2 ก้อน', brand:'Makita', warranty:'3 ปี', weight:'1.7 kg' },
  { id:89, name:'Irwin Marples ชุดดอกสว่านไม้ 8 ชิ้น', category:'ดอกสว่านช่างไม้', trades:['carpenter'], price:890, originalPrice:1190, stock:18, emoji:'🎯', description:'ดอกสว่านไม้ Auger Bit 8 ชิ้น ขนาด 10–32 มม. เหล็ก High Carbon ปลายสามเหลี่ยม เจาะเรียบไม่ฉีก', brand:'Irwin', warranty:'1 ปี', weight:'0.8 kg' },
  { id:90, name:'Makita เครื่องกบไสไม้ไฟฟ้า 82 มม. 550W', category:'สิ่วและกบ', trades:['carpenter'], price:3490, originalPrice:4300, stock:6, emoji:'🏂', description:'กบไสไม้ไฟฟ้า 82 มม. 550W ความลึกไส 0–3 มม. ใช้งานมือถือ ปากเป่าฝุ่นปรับทิศได้', brand:'Makita', warranty:'2 ปี', weight:'2.9 kg' },
  { id:91, name:'Starrett ไม้วัดเหล็กสเตนเลส 600 มม.', category:'เครื่องมือวัดช่างไม้', trades:['carpenter'], price:890, originalPrice:1190, stock:15, emoji:'📏', description:'ไม้วัดเหล็ก Stainless 600 มม. สเกลทั้ง 2 ด้าน (มม./นิ้ว) แม่นยำ 0.5 มม. ขอบตรง Made in USA', brand:'Starrett', warranty:'Life', weight:'0.3 kg' },
  { id:92, name:'Draper ชุดสกัดไม้ Mortising Chisel 4 ชิ้น', category:'สิ่วและกบ', trades:['carpenter'], price:1490, originalPrice:1900, stock:10, emoji:'🗡️', description:'สกัดไม้ Mortising 4 ชิ้น ขนาด 6/8/10/12 มม. เหล็ก O1 ด้ามไม้โอ๊คแท้ ใช้เจาะรูเดือยไม้', brand:'Draper', warranty:'1 ปี', weight:'0.5 kg' },
  { id:93, name:'Bessey แคลมป์จับไม้ F-Clamp 60 ซม.', category:'อุปกรณ์จับยึดช่างไม้', trades:['carpenter'], price:590, originalPrice:790, stock:25, emoji:'🗜️', description:'F-Clamp 60 ซม. เหล็กอย่างดี แรงจับ 6 kN ปรับระยะได้ตลอด พื้นหน้าจับยาง ไม่กดไม้', brand:'Bessey', warranty:'2 ปี', weight:'1.2 kg' },
  { id:94, name:'Festool Domino DF 500 Q เครื่องเดือยไม้', category:'เครื่องมือตัดไม้', trades:['carpenter'], price:32000, originalPrice:39000, stock:2, emoji:'🏛️', description:'เครื่องทำรูเดือยไม้ Loose Tenon ขนาดเดือย 4–10 มม. แม่นยำ 0.1 มม. ตัดเร็ว ใช้กับเฟอร์นิเจอร์', brand:'Festool', warranty:'3 ปี', weight:'2.8 kg' },
  { id:95, name:'Mirka กระดาษทราย Abranet 230×115 ชุด 50 แผ่น', category:'วัสดุสิ้นเปลืองช่างไม้', trades:['carpenter','painter'], price:890, originalPrice:1190, stock:40, emoji:'📄', description:'กระดาษทราย Mesh Abranet 50 แผ่น เบอร์ P80–240 คละ ระบาย Dust ได้ 95% อายุการใช้งานนาน 3×', brand:'Mirka', warranty:'-', weight:'0.4 kg' },
  { id:96, name:'Bosch เครื่องกลึงไม้ตั้งโต๊ะ 200W', category:'เครื่องมือช่างไม้', trades:['carpenter'], price:5490, originalPrice:6800, stock:4, emoji:'🌀', description:'เครื่องกลึงไม้ขนาดเล็ก 200W ความยาวกลึง 300 มม. ขนาด Chuck 50 มม. ปรับความเร็ว 3 ระดับ', brand:'Bosch', warranty:'2 ปี', weight:'10 kg' },
  { id:97, name:'Stanley สายวัดอะลูมิเนียม 8 ม. FatMax', category:'เครื่องมือวัดช่างไม้', trades:['carpenter','construction'], price:890, originalPrice:1190, stock:28, emoji:'📐', description:'สายวัด 8 ม. ตัวเรือนอะลูมิเนียม ใบสายกว้าง 32 มม. ล็อคอัตโนมัติ ทนแรงกระชาก กลับคืนนุ่ม', brand:'Stanley', warranty:'1 ปี', weight:'0.5 kg' },
  { id:98, name:'Titebond III กาวไม้กันน้ำ Ultimate 473 มล.', category:'วัสดุสิ้นเปลืองช่างไม้', trades:['carpenter'], price:590, originalPrice:790, stock:30, emoji:'🍯', description:'กาวไม้ Aliphatic PVA กันน้ำ 100% แห้งใน 20 นาที จับแน่น ASTM D5751 ใช้ทั้งในและนอกอาคาร', brand:'Titebond', warranty:'-', weight:'0.5 kg' },
  { id:99, name:'Narex ค้อนช่างไม้ด้ามบีช 300g', category:'ค้อนช่างไม้', trades:['carpenter'], price:490, originalPrice:650, stock:22, emoji:'🔨', description:'ค้อนหัวเหล็กทรงกลม 300g ด้ามไม้บีชแท้เกรดเนื้อหนาแน่น ใช้ตอกสิ่ว เหมาะงานละเอียด', brand:'Narex', warranty:'1 ปี', weight:'0.6 kg' },
  { id:100, name:'Draper ชุดกระดาษทรายเครื่อง 10 ชุด', category:'วัสดุสิ้นเปลืองช่างไม้', trades:['carpenter','painter'], price:290, originalPrice:390, stock:50, emoji:'🗂️', description:'กระดาษทรายสำหรับเครื่องขัดสั่น 93×185 มม. 10 ชุด 50 แผ่น คละเบอร์ P60/80/120/180/240', brand:'Draper', warranty:'-', weight:'0.2 kg' },

  /* ════════════════════════════════════════════════════════════
     ❄️ ช่างแอร์ (aircon)  — ID 101–120
     ════════════════════════════════════════════════════════════ */
  { id:101, name:'Robinair ปั๊มสุญญากาศ 2 Stage 5 CFM', category:'เครื่องมือแอร์', trades:['aircon'], price:7900, originalPrice:9500, stock:5, emoji:'💨', description:'ปั๊มสุญญากาศ 2-Stage 5 CFM แรงดันสุญญากาศ 15 ไมครอน มอเตอร์ 1/3 HP น้ำมันหล่อลื่นในตัว', brand:'Robinair', warranty:'1 ปี', weight:'8 kg' },
  { id:102, name:'Fieldpiece เกจวัดแรงดันสารทำความเย็น 4 ทาง', category:'เครื่องมือแอร์', trades:['aircon'], price:5490, originalPrice:6800, stock:7, emoji:'🌡️', description:'ชุดเกจวัดแรงดัน 4 ทาง รองรับ R22/R134a/R404A/R410A พร้อมสายฟลูออรีน 3 เส้น ยาว 1.5 ม.', brand:'Fieldpiece', warranty:'2 ปี', weight:'1.5 kg' },
  { id:103, name:'Refco ชุดล้างแอร์ High Pressure 70 บาร์', category:'เครื่องมืองานแอร์', trades:['aircon'], price:2890, originalPrice:3500, stock:12, emoji:'🧹', description:'ชุดล้างแอร์แรงดันสูง 70 บาร์ ถังสเตนเลส 10 ลิตร พร้อมปืนฉีดและสายยาง 3 ม. สำหรับล้าง Coil', brand:'Refco', warranty:'1 ปี', weight:'2.2 kg' },
  { id:104, name:'Fieldpiece เครื่องชั่งสารทำความเย็น 50 กก.', category:'เครื่องมือแอร์', trades:['aircon'], price:3290, originalPrice:4000, stock:8, emoji:'⚖️', description:'เครื่องชั่งน้ำหนักดิจิทัล 50 กก. ความละเอียด 0.001 กก. วัดอัตราเติมสาร Auto-Stop เมื่อครบน้ำหนัก', brand:'Fieldpiece', warranty:'2 ปี', weight:'2.5 kg' },
  { id:105, name:'Rothenberger เครื่องดัดท่อทองแดง Ratchet', category:'เครื่องมือท่อแอร์', trades:['aircon','plumber'], price:2490, originalPrice:3200, stock:9, emoji:'🔄', description:'เครื่องดัดท่อทองแดง 3/8"–7/8" แบบ Ratchet มุมได้ถึง 180° ไม่ยุบท่อ แม่พิมพ์ 5 ขนาด', brand:'Rothenberger', warranty:'2 ปี', weight:'1.8 kg' },
  { id:106, name:'Fluke 62 Max เทอร์โมมิเตอร์ IR -30~500°C', category:'เครื่องมือวัดแอร์', trades:['aircon','electrical'], price:3290, originalPrice:4000, stock:8, emoji:'🌡️', description:'เทอร์โมมิเตอร์ Infrared วัด -30°C ถึง 500°C D:S = 10:1 IP54 ป้องกันกระแทก ใช้วัดท่อและ Coil', brand:'Fluke', warranty:'2 ปี', weight:'0.3 kg' },
  { id:107, name:'Fieldpiece เครื่องตรวจจับสารทำความเย็น Leak Detector', category:'เครื่องมือตรวจสารแอร์', trades:['aircon'], price:4900, originalPrice:6000, stock:6, emoji:'🔍', description:'Refrigerant Leak Detector แบบ Heated Diode ตรวจ R22/R134a/R410A/R32 ไฮไวท์ลีดเมื่อพบรั่ว', brand:'Fieldpiece', warranty:'2 ปี', weight:'0.4 kg' },
  { id:108, name:'Draper ประแจฟาก Ratchet 1/4" ชุดแอร์', category:'ประแจแอร์', trades:['aircon','mechanic'], price:1290, originalPrice:1600, stock:14, emoji:'🔑', description:'ประแจฟาก 1/4" Drive พร้อมบ็อกซ์ 28 ชิ้น ขนาด 4–14 มม. เหมาะน็อตขนาดเล็กในระบบแอร์', brand:'Draper', warranty:'1 ปี', weight:'0.9 kg' },
  { id:109, name:'Refco Ritmo เครื่องถ่างปากท่อ Flaring 1/4"-3/4"', category:'เครื่องมือท่อแอร์', trades:['aircon','plumber'], price:2890, originalPrice:3600, stock:7, emoji:'🔔', description:'เครื่องถ่างปากท่อทองแดง Eccentric Flaring 1/4"–3/4" แม่พิมพ์ทองเหลือง ปากถ่างกลม ไม่แตก', brand:'Refco', warranty:'2 ปี', weight:'1.5 kg' },
  { id:110, name:'Ritmo เครื่องตัดท่อทองแดง 1/8"-1-1/8"', category:'เครื่องมือท่อแอร์', trades:['aircon','plumber'], price:590, originalPrice:790, stock:20, emoji:'✂️', description:'ที่ตัดท่อทองแดง 1/8"–1-1/8" แบบหมุน ใบตัดสแตนเลส ตัดเรียบ ปรับขนาดสกรูจากตัวด้ามจับ', brand:'Ritmo', warranty:'1 ปี', weight:'0.3 kg' },
  { id:111, name:'Robinair ชุดน้ำยาล้างระบบแอร์ Flush Kit', category:'วัสดุสิ้นเปลืองแอร์', trades:['aircon'], price:1490, originalPrice:1900, stock:15, emoji:'🧴', description:'ชุดน้ำยาล้างระบบ AC ล้าง Contaminated Compressor Oil น้ำยา 1 ลิตร พร้อมหัวฉีดและสายยาง', brand:'Robinair', warranty:'-', weight:'1.2 kg' },
  { id:112, name:'Fluke 325 แคลมป์มิเตอร์ True RMS 600A', category:'เครื่องมือวัดแอร์', trades:['aircon','electrical'], price:4990, originalPrice:6200, stock:5, emoji:'⚡', description:'แคลมป์มิเตอร์ True RMS 600A AC/DC วัด V/A/Ω/Hz/°C สำหรับตรวจสอบกระแสมอเตอร์คอมเพรสเซอร์', brand:'Fluke', warranty:'3 ปี', weight:'0.4 kg' },
  { id:113, name:'Wera ชุดไขควง Hex/Torx สำหรับแอร์ 7 ชิ้น', category:'ไขควงแอร์', trades:['aircon','electrical'], price:890, originalPrice:1190, stock:20, emoji:'🪛', description:'ชุดไขควง L-Key Hex+Torx 7 ชิ้น สำหรับถอดแผงแอร์และหน้ากาก ด้ามยางสีสด กันลื่น Kraftform', brand:'Wera', warranty:'1 ปี', weight:'0.4 kg' },
  { id:114, name:'Rectorseal เทปเทฟลอน 1/2" อย่างหนา 10 ม.', category:'วัสดุสิ้นเปลืองแอร์', trades:['aircon','plumber'], price:89, originalPrice:120, stock:100, emoji:'🎀', description:'เทปเทฟลอน PTFE อย่างหนาสำหรับเกลียวท่อสารทำความเย็น กันซึม ทนความดัน 150 PSI', brand:'Rectorseal', warranty:'-', weight:'0.05 kg' },
  { id:115, name:'Fieldpiece เครื่องวัด Superheat/Subcool ดิจิทัล', category:'เครื่องมือวัดแอร์', trades:['aircon'], price:3890, originalPrice:4800, stock:6, emoji:'📊', description:'Digital Superheat/Subcool Meter แสดงผล 3 ค่าพร้อมกัน: อุณหภูมิ/แรงดัน/Superheat คำนวณอัตโนมัติ', brand:'Fieldpiece', warranty:'2 ปี', weight:'0.6 kg' },
  { id:116, name:'Klein Tools ถุงมือฉนวนกันไฟฟ้าแอร์ 500V', category:'อุปกรณ์ความปลอดภัย', trades:['aircon','electrical'], price:1290, originalPrice:1600, stock:18, emoji:'🧤', description:'ถุงมือฉนวน 500V AC สำหรับงานแอร์ไฟฟ้า ยางธรรมชาติ มาตรฐาน IEC 60903 Class 00', brand:'Klein Tools', warranty:'1 ปี', weight:'0.2 kg' },
  { id:117, name:'Ingco เครื่องเป่าลม Air Blower 550W', category:'เครื่องมืองานแอร์', trades:['aircon'], price:890, originalPrice:1190, stock:14, emoji:'🌀', description:'เครื่องเป่าลม 550W 170 km/h ใช้เป่าทำความสะอาด Coil คอยล์ร้อน/เย็น ถังกรองฝุ่นในตัว', brand:'Ingco', warranty:'1 ปี', weight:'1.5 kg' },
  { id:118, name:'Bosch ดอกสว่านเจาะผนัง SDS+ 5 ชิ้น', category:'ดอกสว่านแอร์', trades:['aircon','construction'], price:590, originalPrice:790, stock:25, emoji:'🔩', description:'ดอกสว่านคาร์ไบด์ SDS+ 5 ชิ้น ขนาด 6/8/10/12/16 มม. สำหรับเจาะรูร้อยท่อแอร์ผ่านผนังปูน', brand:'Bosch', warranty:'6 เดือน', weight:'0.5 kg' },
  { id:119, name:'Kendo ประแจหัวแฉกไขหัวน็อต M4-M10 Hex Set', category:'ประแจแอร์', trades:['aircon','mechanic'], price:490, originalPrice:650, stock:22, emoji:'⬡', description:'ชุดประแจ Allen Hex L-Shape 9 ชิ้น ขนาด 2–10 มม. เหล็ก CrV ทนแรงบิดสูง สีดำกันสนิม', brand:'Kendo', warranty:'1 ปี', weight:'0.3 kg' },
  { id:120, name:'Pro Safety ชุดอุปกรณ์ความปลอดภัยช่างแอร์', category:'อุปกรณ์ความปลอดภัย', trades:['aircon','electrical'], price:690, originalPrice:890, stock:20, emoji:'🦺', description:'ชุดเสื้อกั๊ก + แว่นตา + ถุงมือฉนวน สำหรับงานติดตั้งแอร์ไฟฟ้า มาตรฐาน CE', brand:'Safety Pro', warranty:'6 เดือน', weight:'0.5 kg' },

  /* ════════════════════════════════════════════════════════════
     🏗️ ช่างก่อสร้าง (construction)  — ID 121–140
     ════════════════════════════════════════════════════════════ */
  { id:121, name:'Bosch GBH 2-26 DRE โรตารี่แฮมเมอร์ SDS+ 800W', category:'เครื่องมือเจาะก่อสร้าง', trades:['construction','plumber'], price:6990, originalPrice:8500, stock:6, emoji:'💪', description:'โรตารี่แฮมเมอร์ SDS+ 800W แรงกระแทก 2.7J 3 ฟังก์ชัน: เจาะ/กระแทก/สกัด เหมาะงานปูน-คอนกรีต', brand:'Bosch', warranty:'2 ปี', weight:'2.9 kg' },
  { id:122, name:'Stabila ระดับน้ำอะลูมิเนียม 120 ซม.', category:'เครื่องมือวัดก่อสร้าง', trades:['construction','carpenter','plumber'], price:1290, originalPrice:1600, stock:15, emoji:'📐', description:'ระดับน้ำอะลูมิเนียม 120 ซม. 3 ฟอง แม่นยำ ±0.5 มม./ม. ขอบกันชนยาง กันกระแทก', brand:'Stabila', warranty:'2 ปี', weight:'1.1 kg' },
  { id:123, name:'Stanley FatMax Toolbox 25" กล่องเครื่องมือ', category:'กล่องเครื่องมือ', trades:['construction','mechanic','carpenter'], price:1290, originalPrice:1590, stock:15, emoji:'🧰', description:'กล่องเครื่องมือ 25 นิ้ว โครงเหล็ก รับน้ำหนัก 120 กก. ล็อคได้ มีช่องจัดเก็บ 3 ชั้น', brand:'Stanley', warranty:'2 ปี', weight:'4.5 kg' },
  { id:124, name:'Kendo ค้อนปอนด์ด้ามไฟเบอร์ 4 ปอนด์', category:'ค้อนก่อสร้าง', trades:['construction','welder'], price:490, originalPrice:650, stock:30, emoji:'🔨', description:'ค้อนปอนด์ 4 ปอนด์ ด้ามไฟเบอร์กลาสกันสั่น หัวเหล็กชุบแข็ง ใช้ตอกสิ่ว/งานหนัก', brand:'Kendo', warranty:'1 ปี', weight:'2.0 kg' },
  { id:125, name:'Makita เครื่องผสมปูน 1400W UT1305', category:'เครื่องมือก่อสร้าง', trades:['construction'], price:5490, originalPrice:6800, stock:5, emoji:'🌀', description:'เครื่องผสมปูน/สีทาผนัง 1400W ความเร็ว 0–900 RPM ด้ามแบบ D ใส่หัวผสม 120/140 มม.', brand:'Makita', warranty:'2 ปี', weight:'5.2 kg' },
  { id:126, name:'Dewalt ปืนตอกตะปู Framing Nailer DCN692', category:'เครื่องมือตอกก่อสร้าง', trades:['construction','carpenter'], price:14900, originalPrice:18000, stock:3, emoji:'🔫', description:'ปืนตอกตะปูไร้สาย 18V ตอกตะปูขนาด 50–90 มม. ปรับความลึกได้ ชาร์จแบตเดียวกับชุด Dewalt', brand:'Dewalt', warranty:'3 ปี', weight:'3.2 kg' },
  { id:127, name:'Bosch เครื่องเจียรไฟฟ้า 9" 2400W GWS 24-230', category:'เครื่องมือตัดก่อสร้าง', trades:['construction','welder'], price:6990, originalPrice:8500, stock:4, emoji:'⚙️', description:'เครื่องเจียร 9" 2400W ดิสก์ตัดคอนกรีต/หิน/เหล็ก ป้องกัน Kick-Back ปุ่ม Deadman Switch', brand:'Bosch', warranty:'2 ปี', weight:'5.5 kg' },
  { id:128, name:'Leica Disto D2 เลเซอร์วัดระยะ 60 ม.', category:'เครื่องมือวัดก่อสร้าง', trades:['construction','carpenter'], price:4900, originalPrice:6200, stock:7, emoji:'📡', description:'เลเซอร์วัดระยะ 60 ม. ความแม่นยำ ±1.5 มม. คำนวณ Area/Volume/Pythagoras กันกระแทก IP54', brand:'Leica', warranty:'2 ปี', weight:'0.1 kg' },
  { id:129, name:'Stabila เลเซอร์เส้น 4 แนว IP65', category:'เครื่องมือวัดก่อสร้าง', trades:['construction','carpenter'], price:7900, originalPrice:9800, stock:5, emoji:'🔴', description:'เลเซอร์เส้น Cross Line 4V/1H ± Auto-leveling IP65 กันน้ำ กันฝุ่น ใช้วางผนัง-กระเบื้อง', brand:'Stabila', warranty:'2 ปี', weight:'0.8 kg' },
  { id:130, name:'Ingco เครื่องตัดกระเบื้อง Tile Cutter 800W', category:'เครื่องมือก่อสร้าง', trades:['construction'], price:3490, originalPrice:4300, stock:7, emoji:'🧱', description:'เครื่องตัดกระเบื้องพอร์ซเลน/เซรามิก 800W แผ่นเพชร 180 มม. ตัดตรง-เฉียง 45° ถาดน้ำ', brand:'Ingco', warranty:'1 ปี', weight:'8.5 kg' },
  { id:131, name:'Marshalltown เกรียงฉาบปูน Trowel 12"', category:'เครื่องมือฉาบก่อสร้าง', trades:['construction'], price:590, originalPrice:790, stock:25, emoji:'🏗️', description:'เกรียงฉาบปูน 12" เหล็ก High-Carbon ด้ามไม้ Camel Back ฉาบเรียบสวย ทนทาน Made in USA', brand:'Marshalltown', warranty:'1 ปี', weight:'0.4 kg' },
  { id:132, name:'Ingco เครื่องขัดพื้น Angle Grinder พร้อมดิสก์เพชร', category:'เครื่องมือตัดก่อสร้าง', trades:['construction'], price:2490, originalPrice:3100, stock:8, emoji:'💎', description:'ชุดเครื่องเจียร 4" พร้อมดิสก์เพชรขัดพื้นคอนกรีต 3 ชิ้น Turbo Cup / Resin Cup / Polish Pad', brand:'Ingco', warranty:'1 ปี', weight:'2.2 kg' },
  { id:133, name:'Hilti เดือยยิง Powder Actuated Tool DX 351', category:'เครื่องมือยิงเดือย', trades:['construction'], price:8900, originalPrice:11000, stock:3, emoji:'💥', description:'เครื่องยิงเดือยขับดันด้วยดินปืน Powder Actuated สำหรับยึดโครงเหล็กกับคอนกรีต ใช้กระสุน 6.3/6.8', brand:'Hilti', warranty:'2 ปี', weight:'2.6 kg' },
  { id:134, name:'Bosch GST 150 BCE เลื่อยจิ๊กซอ 780W', category:'เครื่องมือตัดก่อสร้าง', trades:['construction','carpenter'], price:4490, originalPrice:5500, stock:6, emoji:'〰️', description:'เลื่อยจิ๊กซอ 780W ตัดไม้ 150 มม. โลหะ 20 มม. ใบเลื่อยแกว่ง 3 ระดับ จับ 2 มือสะดวก', brand:'Bosch', warranty:'2 ปี', weight:'2.9 kg' },
  { id:135, name:'Dewalt ปื่นลมอัด Compressor 6 ลิตร', category:'เครื่องมือก่อสร้าง', trades:['construction','painter'], price:4990, originalPrice:6200, stock:6, emoji:'💨', description:'ปั๊มลมไฟฟ้า 1.5 HP ถัง 6 ลิตร ความดัน 8 บาร์ เติมลม 116 L/min เบา ใช้กับปืนพ่นสี/ตะปู', brand:'Dewalt', warranty:'2 ปี', weight:'17 kg' },
  { id:136, name:'Stabila เชือกสายดิ่ง + ที่ถ่วง 200g', category:'เครื่องมือวัดก่อสร้าง', trades:['construction','carpenter'], price:290, originalPrice:390, stock:40, emoji:'🎯', description:'เชือกสายดิ่งอย่างดี 15 ม. พร้อมลูกตุ้มทองเหลือง 200g ใช้ตรวจแนวดิ่งเสา-ผนัง-เสาเข็ม', brand:'Stabila', warranty:'-', weight:'0.4 kg' },
  { id:137, name:'Sealey ค้อนหน้าหนัง Dead-Blow 2 ปอนด์', category:'ค้อนก่อสร้าง', trades:['construction','carpenter'], price:690, originalPrice:890, stock:20, emoji:'🪖', description:'ค้อนหน้าหนัง Dead-Blow 2 ปอนด์ ไม่กระดอน เหมาะตอกกระเบื้อง-ไม้ปาร์เก้-ผนังประกอบ', brand:'Sealey', warranty:'1 ปี', weight:'1.5 kg' },
  { id:138, name:'Draper เข็มขัดนิรภัยทำงานที่สูง Full Body', category:'อุปกรณ์ความปลอดภัย', trades:['construction'], price:1890, originalPrice:2400, stock:12, emoji:'🪝', description:'เข็มขัดนิรภัย Full Body Harness 5 จุด พร้อมตะขอ Double Locking มาตรฐาน EN361 ปรับขนาด', brand:'Draper', warranty:'3 ปี', weight:'1.5 kg' },
  { id:139, name:'Pro Safety แว่นตากันกระแทก + หมวกก่อสร้าง', category:'อุปกรณ์ความปลอดภัย', trades:['construction','welder','carpenter'], price:490, originalPrice:650, stock:40, emoji:'😎', description:'ชุดหมวกนิรภัย ABS + แว่นตาโพลีคาร์บอเนต กันกระแทก กันเศษหิน/ปูน มาตรฐาน ANSI Z87.1', brand:'Safety Pro', warranty:'1 ปี', weight:'0.5 kg' },
  { id:140, name:'Ingco เครื่องเชื่อมคอนกรีต Rebar Cutter 16 มม.', category:'เครื่องมือก่อสร้าง', trades:['construction'], price:4900, originalPrice:6100, stock:4, emoji:'✂️', description:'เครื่องตัดเหล็กเส้น 550W ตัดได้สูงสุด 16 มม. (SD50) ใบตัดพิเศษ 105 มม. ตัดเรียบโดยไม่เปลี่ยนรูป', brand:'Ingco', warranty:'1 ปี', weight:'3.5 kg' },

  /* ════════════════════════════════════════════════════════════
     🎨 ช่างทาสี (painter)  — ID 141–160
     ════════════════════════════════════════════════════════════ */
  { id:141, name:'Wagner ปืนพ่นสี HVLP 400W W 690 FLEXiO', category:'เครื่องพ่นสี', trades:['painter'], price:2890, originalPrice:3600, stock:10, emoji:'🎨', description:'ปืนพ่นสี HVLP 400W ถัง 800 มล. ปรับทิศการพ่น 3 แบบ ปรับปริมาณสีและแก๊สแยก', brand:'Wagner', warranty:'1 ปี', weight:'1.4 kg' },
  { id:142, name:'ชุดแปรงทาสี Purdy + โรลเลอร์ 9 ชิ้น', category:'แปรงและโรลเลอร์', trades:['painter'], price:590, originalPrice:790, stock:40, emoji:'🖌️', description:'ชุดแปรง 4 ชิ้น (1"/2"/3"/4") + โรลเลอร์ขนสั้น/ยาว + ถาดเทสีและด้ามต่อ สำหรับงานทาสีทุกประเภท', brand:'Purdy', warranty:'6 เดือน', weight:'0.8 kg' },
  { id:143, name:'Mirka กระดาษทรายรถ P80-P2000 ชุด 50 แผ่น', category:'กระดาษทรายและขัด', trades:['painter','carpenter'], price:490, originalPrice:650, stock:50, emoji:'📄', description:'กระดาษทราย Mirka ระดับรถยนต์ 50 แผ่น คละ P80/120/180/240/320/400/800/1000/1500/2000', brand:'Mirka', warranty:'-', weight:'0.3 kg' },
  { id:144, name:'3M 6500 หน้ากากกรองไอสี OV/P100', category:'อุปกรณ์ความปลอดภัยช่างสี', trades:['painter'], price:1890, originalPrice:2400, stock:15, emoji:'😷', description:'หน้ากากกรองไอสี 3M 6500 Series พร้อม Cartridge OV/P100 กรองไอสีและอนุภาค PM2.5 ปรับสายรัดได้', brand:'3M', warranty:'1 ปี', weight:'0.4 kg' },
  { id:145, name:'Festool เครื่องขัดสีรถ Rotex RO 150', category:'เครื่องขัดสี', trades:['painter'], price:15900, originalPrice:19500, stock:3, emoji:'⭕', description:'เครื่องขัดสีรถ Dual-Mode: Rotary + Random Orbital 720W ปรับ 6 ความเร็ว ขัดหยาบ-ขัดละเอียด-Polish', brand:'Festool', warranty:'3 ปี', weight:'2.4 kg' },
  { id:146, name:'DeVilbiss ปืนพ่นสีรถยนต์ GTi Pro HVLP', category:'เครื่องพ่นสี', trades:['painter'], price:9900, originalPrice:12500, stock:4, emoji:'🚗', description:'ปืนพ่นสีรถ HVLP เกรดมืออาชีพ หัวขนาด 1.2/1.3/1.4 มม. ถัง 600 มล. แรงดัน 2.0 บาร์ ฝ้า 25 ซม.', brand:'DeVilbiss', warranty:'2 ปี', weight:'0.6 kg' },
  { id:147, name:'3M เทปกาวกันสี Blue Painter Tape 48 มม.', category:'วัสดุสิ้นเปลืองช่างสี', trades:['painter','construction'], price:290, originalPrice:390, stock:60, emoji:'🎀', description:'เทปกาวกันสี 3M 2090 กว้าง 48 มม. ยาว 54 ม. ลอกง่ายไม่ทิ้งกาว ใช้กันสีล้น Acrylic Base', brand:'3M', warranty:'-', weight:'0.2 kg' },
  { id:148, name:'Festool Planex LHS 2 225 EQ เครื่องขัดฝ้าเพดาน', category:'เครื่องขัดสี', trades:['painter'], price:24000, originalPrice:29000, stock:2, emoji:'🌕', description:'เครื่องขัดผนัง/เพดาน D=225 มม. ด้ามยืด-หด 900–1600 มม. พร้อมระบบดูดฝุ่น ใช้ขัดยิปซั่ม', brand:'Festool', warranty:'3 ปี', weight:'3.9 kg' },
  { id:149, name:'Graco ปั๊มพ่นสีไร้อากาศ Airless Sprayer 3000 PSI', category:'เครื่องพ่นสี', trades:['painter','construction'], price:19500, originalPrice:24000, stock:3, emoji:'💨', description:'ปั๊มพ่นสี Airless 3000 PSI ฉีดสีได้ถึง 800 ตร.ม./ชม. หัว 0.015"–0.025" สำหรับงานอาคาร', brand:'Graco', warranty:'2 ปี', weight:'15 kg' },
  { id:150, name:'Makita เครื่องขัดสั่นสำหรับโคมไฟและมุม 200W', category:'เครื่องขัดสี', trades:['painter','carpenter'], price:2490, originalPrice:3100, stock:9, emoji:'🔷', description:'เครื่องขัด Delta Sander 200W แผ่นขัดรูปสามเหลี่ยม ขัดมุม-ขอบ-โครงเฟอร์นิเจอร์ ถุงเก็บฝุ่น', brand:'Makita', warranty:'2 ปี', weight:'1.5 kg' },
  { id:151, name:'Wooster โรลเลอร์ขนสั้น 4" สำหรับสีน้ำ', category:'แปรงและโรลเลอร์', trades:['painter'], price:290, originalPrice:390, stock:50, emoji:'🎢', description:'โรลเลอร์ขนสั้น 4 มม. ขนาด 4" Microfiber สำหรับสีน้ำ/สีน้ำมัน เก็บสีดี ผิวเรียบ ไม่เป็นขน', brand:'Wooster', warranty:'6 เดือน', weight:'0.1 kg' },
  { id:152, name:'3M ฟิล์มคลุมรถ Pre-Taped Masking Film 4m×30m', category:'วัสดุสิ้นเปลืองช่างสี', trades:['painter'], price:590, originalPrice:790, stock:30, emoji:'🎥', description:'ฟิล์มคลุมรถพร้อมเทป Pre-taped 4m×30m ป้องกันสีฝุ่นเกาะ เนื้อฟิล์มบาง 12 ไมครอน', brand:'3M', warranty:'-', weight:'0.5 kg' },
  { id:153, name:'Mirka Deros เครื่องขัดไฟฟ้า 5" Orbital', category:'เครื่องขัดสี', trades:['painter','carpenter'], price:12500, originalPrice:15500, stock:4, emoji:'🌟', description:'เครื่องขัด Random Orbital 5" 350W ความเร็ว 4000–10000 RPM เบรค Braking System กันกระแทกทนทาน', brand:'Mirka', warranty:'2 ปี', weight:'0.9 kg' },
  { id:154, name:'Rubberset แปรงทาสีน้ำมัน 3" Ox Hair', category:'แปรงและโรลเลอร์', trades:['painter'], price:390, originalPrice:520, stock:35, emoji:'🖌️', description:'แปรง Ox Hair 3" สำหรับสีน้ำมัน/เคลือบ ผมแข็งปานกลาง ผิวเรียบ ทาสีพื้นเหล็ก/ไม้', brand:'Rubberset', warranty:'6 เดือน', weight:'0.1 kg' },
  { id:155, name:'3M Perfect-It เครื่องขัดสีรถ Compound 3 ขั้น', category:'วัสดุสิ้นเปลืองช่างสี', trades:['painter'], price:1490, originalPrice:1900, stock:20, emoji:'✨', description:'ชุดน้ำยาขัดสีรถ 3 ขวด 3M: Rubbing Compound + Machine Polish + Finishing Wax 200 มล./ขวด', brand:'3M', warranty:'-', weight:'0.7 kg' },
  { id:156, name:'Wagner Control Spray Max HVLP ปืนพ่นสีภายใน', category:'เครื่องพ่นสี', trades:['painter'], price:2190, originalPrice:2700, stock:12, emoji:'🏠', description:'ปืนพ่นสี HVLP สำหรับงานภายใน ทำงานเงียบ พ่นสีน้ำ/สีลาเท็กซ์ หัว X-Boost Air Cap ลดฝ้า', brand:'Wagner', warranty:'1 ปี', weight:'1.1 kg' },
  { id:157, name:'Pro Safety เข็มขัดนิรภัยสำหรับทาสีที่สูง', category:'อุปกรณ์ความปลอดภัย', trades:['painter','construction'], price:1490, originalPrice:1900, stock:15, emoji:'🪝', description:'เข็มขัดนิรภัยพาดไหล่ Safety Belt มาตรฐาน EN361 พร้อมสายยึด Lanyard 1.75 ม. ตะขอ Double Action', brand:'Safety Pro', warranty:'3 ปี', weight:'1.2 kg' },
  { id:158, name:'Purdy ไม้ขยายด้ามแปรงอะลูมิเนียม 1.2-2.4 ม.', category:'อุปกรณ์ทาสี', trades:['painter'], price:890, originalPrice:1190, stock:25, emoji:'📏', description:'ด้ามต่อแปรง/โรลเลอร์ อะลูมิเนียม ยืด 1.2–2.4 ม. เกลียวมาตรฐาน 3/8"-16 ใช้กับโรลเลอร์ทุกยี่ห้อ', brand:'Purdy', warranty:'1 ปี', weight:'0.5 kg' },
  { id:159, name:'Festool เครื่องดูดฝุ่นขัดสี CLEANTEC CT 26 E', category:'อุปกรณ์ช่างสี', trades:['painter','carpenter'], price:14500, originalPrice:18000, stock:3, emoji:'🌪️', description:'เครื่องดูดฝุ่นช่างสี/ช่างไม้ 1200W ถัง 26 ลิตร ฟิลเตอร์ HEPA กรองฝุ่น PM0.3 Auto Clean', brand:'Festool', warranty:'3 ปี', weight:'11 kg' },
  { id:160, name:'3M กระดาษทรายน้ำ Wet/Dry P1500 ชุด 25 แผ่น', category:'กระดาษทรายและขัด', trades:['painter'], price:290, originalPrice:390, stock:60, emoji:'💧', description:'กระดาษทราย Wet/Dry 3M P1500 25 แผ่น ใช้ขัดน้ำสีรถยนต์ กระดาษทรายซิลิกอนคาร์ไบด์ ทนน้ำ', brand:'3M', warranty:'-', weight:'0.2 kg' }

];

/* ============================================================
   2. LOCALSTORAGE HELPERS
   ============================================================ */

/** บันทึกข้อมูลลง LocalStorage */
function lsSet(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch(e) {
    console.error('LocalStorage write error:', e);
  }
}

/** อ่านข้อมูลจาก LocalStorage */
function lsGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch(e) {
    console.error('LocalStorage read error:', e);
    return fallback;
  }
}

/** Escape HTML สำหรับข้อมูลที่มาจากผู้ใช้ก่อนใส่ลง template string */
function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   3. PRODUCT MANAGEMENT
   ============================================================ */

/** โหลดสินค้าจาก LocalStorage หรือใช้ Default
    Reset อัตโนมัติถ้าข้อมูลเก่า (น้อยกว่า 160 รายการ) */
function getProducts() {
  const stored = lsGet('te_products');
  if (!stored || stored.length < 160) {
    lsSet('te_products', DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  }
  return stored;
}

/** หาสินค้าด้วย ID */
function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === Number(id)) || null;
}

/** บันทึกสินค้าทั้งหมด */
function saveProducts(products) {
  lsSet('te_products', products);
}

/** เพิ่มสินค้าใหม่ */
function addProduct(product) {
  const products = getProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { ...product, id: newId };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

/** แก้ไขสินค้า */
function updateProduct(id, updates) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === Number(id));
  if (idx === -1) return false;
  products[idx] = { ...products[idx], ...updates };
  saveProducts(products);
  return true;
}

/** ลบสินค้า */
function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== Number(id));
  saveProducts(filtered);
}

/* ============================================================
   4. CART MANAGEMENT
   ============================================================ */

/** ดึงรายการตะกร้า */
function getCart() {
  return lsGet('te_cart', []);
}

/** บันทึกตะกร้า */
function saveCart(cart) {
  lsSet('te_cart', cart);
  updateCartBadge();
}

/** เพิ่มสินค้าในตะกร้า */
function addToCart(productId, quantity = 1) {
  const product = getProductById(productId);
  if (!product) return false;
  if (product.stock < 1) return false;

  const cart = getCart();
  const existing = cart.find(i => i.productId === productId);

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) {
      showToast('warning', 'ไม่สามารถเพิ่มได้', `สินค้าในสต็อกมีเพียง ${product.stock} ชิ้น`);
      return false;
    }
    existing.quantity = newQty;
  } else {
    if (quantity > product.stock) {
      showToast('warning', 'สต็อกไม่พอ', `สินค้ามีเพียง ${product.stock} ชิ้น`);
      return false;
    }
    cart.push({ productId, quantity, addedAt: Date.now() });
  }

  saveCart(cart);
  return true;
}

/** อัปเดตจำนวนสินค้าในตะกร้า */
function updateCartQty(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  item.quantity = quantity;
  saveCart(cart);
}

/** ลบสินค้าออกจากตะกร้า */
function removeFromCart(productId) {
  const cart = getCart().filter(i => i.productId !== productId);
  saveCart(cart);
}

/** คืนค่าจำนวนสินค้าทั้งหมดในตะกร้า */
function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

/** คำนวณราคารวม */
function calculateTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return product ? sum + (product.price * item.quantity) : sum;
  }, 0);
}

/** อัปเดต Badge จำนวนสินค้าบน Navbar */
function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

/* ============================================================
   5. STOCK MANAGEMENT
   ============================================================ */

/** ตรวจสอบสต็อกก่อนสั่งซื้อ
    Input:  Cart array
    Process: เปรียบเทียบ qty ในตะกร้ากับ stock ในฐานข้อมูล
    Output: { ok: boolean, errors: string[] }
*/
function checkStock() {
  const cart = getCart();
  const errors = [];

  for (const item of cart) {
    const product = getProductById(item.productId);
    if (!product) {
      errors.push(`ไม่พบสินค้า ID: ${item.productId}`);
    } else if (product.stock < item.quantity) {
      errors.push(`"${product.name}" มีสต็อก ${product.stock} ชิ้น (ต้องการ ${item.quantity})`);
    }
  }

  return { ok: errors.length === 0, errors };
}

/** ลดสต็อกหลังสั่งซื้อสำเร็จ */
function deductStock() {
  const cart = getCart();
  const products = getProducts();

  for (const item of cart) {
    const prod = products.find(p => p.id === item.productId);
    if (prod) prod.stock = Math.max(0, prod.stock - item.quantity);
  }

  saveProducts(products);
}

/* ============================================================
   6. ORDER MANAGEMENT
   ============================================================ */

/** สร้าง Order ID แบบสุ่ม
    Output: "ORD-XXXX" เช่น "ORD-7A3F"
*/
function generateOrderID() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'ORD-';
  for (let i = 0; i < 4; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/** บันทึก Order ลง LocalStorage */
function saveOrder(orderData) {
  const orders = lsGet('te_orders', []);
  orders.unshift(orderData);  // ใส่ไว้ด้านหน้าเสมอ (ล่าสุดขึ้นก่อน)
  lsSet('te_orders', orders);
}

/** ดึง Orders ทั้งหมด */
function getOrders() {
  return lsGet('te_orders', []);
}

/* ============================================================
   7. USER / AUTH MANAGEMENT
   ============================================================ */

/** ดึงผู้ใช้ทั้งหมด */
function getUsers() {
  return lsGet('te_users', []);
}

/** ลงทะเบียน
    Input:  { name, email, password }
    Process: ตรวจสอบ email ซ้ำ → เข้ารหัส (Base64 แบบง่าย) → บันทึก
    Output: { ok, message }
*/
function registerUser({ name, email, password }) {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
  }
  const user = {
    id: Date.now(),
    name,
    email: email.toLowerCase(),
    password: btoa(password),  // Simple encoding (ไม่ใช้ใน Production จริง)
    createdAt: new Date().toISOString(),
    role: 'customer'
  };
  users.push(user);
  lsSet('te_users', users);
  return { ok: true, message: 'ลงทะเบียนสำเร็จ' };
}

/** เตรียมบัญชีเริ่มต้นสำหรับเดโม: ลูกค้า + แอดมิน */
function ensureDefaultUsers() {
  const users = getUsers();
  let changed = false;

  if (!users.find(u => u.email === 'demo@toolseasy.th')) {
    users.push({
      id: Date.now(),
      name: 'Demo User',
      email: 'demo@toolseasy.th',
      password: btoa('demo1234'),
      createdAt: new Date().toISOString(),
      role: 'customer'
    });
    changed = true;
  }

  if (!users.find(u => u.email === 'admin@toolseasy.th')) {
    users.push({
      id: Date.now() + 1,
      name: 'Tools Easy Admin',
      email: 'admin@toolseasy.th',
      password: btoa('admin1234'),
      createdAt: new Date().toISOString(),
      role: 'admin'
    });
    changed = true;
  }

  if (changed) {
    lsSet('te_users', users);
  }
}

/** เข้าสู่ระบบ
    Input:  { email, password }
    Process: ค้นหา email → ตรวจสอบ password
    Output: { ok, user?, message }
*/
function loginUser({ email, password }) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, message: 'ไม่พบบัญชีผู้ใช้นี้' };
  if (atob(user.password) !== password) return { ok: false, message: 'รหัสผ่านไม่ถูกต้อง' };
  lsSet('te_session', { id: user.id, name: user.name, email: user.email, role: user.role });
  return { ok: true, user };
}

/** ดึง Session ปัจจุบัน */
function getSession() {
  return lsGet('te_session');
}

function isAdminSession(session = getSession()) {
  return !!session && session.role === 'admin';
}

/** ออกจากระบบ */
function logoutUser() {
  localStorage.removeItem('te_session');
}

/* ============================================================
   8. FORM VALIDATION
   ============================================================ */

/** ตรวจสอบรูปแบบ Email */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** ตรวจสอบ Password ≥ 8 ตัว */
function isValidPassword(password) {
  return password.length >= 8;
}

/** แสดง/ซ่อน Error ใต้ Input
    Input:  fieldId, message ('' = ซ่อน)
    Output: DOM update
*/
function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + '-error');
  if (!field || !errorEl) return;

  if (message) {
    field.classList.add('error');
    errorEl.textContent = message;
    errorEl.classList.add('show');
  } else {
    field.classList.remove('error');
    errorEl.textContent = '';
    errorEl.classList.remove('show');
  }
}

/** ตรวจสอบฟอร์มลงทะเบียน
    Input:  form fields
    Process: validate name, email, password, confirm
    Output: boolean (valid/invalid)
*/
function validateRegisterForm(name, email, password, confirm) {
  let valid = true;

  if (!name.trim() || name.trim().length < 2) {
    setFieldError('reg-name', 'กรุณากรอกชื่อ-นามสกุล (อย่างน้อย 2 ตัวอักษร)');
    valid = false;
  } else {
    setFieldError('reg-name', '');
  }

  if (!isValidEmail(email)) {
    setFieldError('reg-email', 'รูปแบบอีเมลไม่ถูกต้อง เช่น user@example.com');
    valid = false;
  } else {
    setFieldError('reg-email', '');
  }

  if (!isValidPassword(password)) {
    setFieldError('reg-password', 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
    valid = false;
  } else {
    setFieldError('reg-password', '');
  }

  if (password !== confirm) {
    setFieldError('reg-confirm', 'รหัสผ่านไม่ตรงกัน');
    valid = false;
  } else if (confirm) {
    setFieldError('reg-confirm', '');
  }

  return valid;
}

/** ตรวจสอบฟอร์มเข้าสู่ระบบ */
function validateLoginForm(email, password) {
  let valid = true;
  if (!isValidEmail(email)) {
    setFieldError('login-email', 'กรุณากรอกอีเมลให้ถูกต้อง');
    valid = false;
  } else {
    setFieldError('login-email', '');
  }
  if (!password) {
    setFieldError('login-password', 'กรุณากรอกรหัสผ่าน');
    valid = false;
  } else {
    setFieldError('login-password', '');
  }
  return valid;
}

/* ============================================================
   9. TOAST NOTIFICATION
   Input:  type ('success'|'error'|'warning'|'info'), title, message
   Process: สร้าง element → append → ลบหลัง 3 วินาที
   Output: Toast notification บนหน้าจอ
   ============================================================ */
const TOAST_ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

function showToast(type = 'info', title = '', message = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${TOAST_ICONS[type] || 'ℹ️'}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHTML(title)}</div>
      ${message ? `<div class="toast-msg">${escapeHTML(message)}</div>` : ''}
    </div>
  `;
  container.appendChild(toast);

  // ลบหลัง 3.5 วินาที
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ============================================================
   10. MODAL
   ============================================================ */

function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}

// ปิด Modal เมื่อคลิก Overlay
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
  if (e.target.classList.contains('modal__close')) {
    e.target.closest('.modal-overlay')?.classList.remove('open');
  }
});

/* ============================================================
   11. LOADING OVERLAY
   ============================================================ */

function showLoading(message = 'กำลังดำเนินการ...') {
  const overlay = document.getElementById('loading-overlay');
  if (!overlay) return;
  overlay.querySelector('.loading-text').textContent = message;
  overlay.classList.add('show');
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.remove('show');
}

/* ============================================================
   12. NAVBAR INIT
   Input:  N/A
   Process: ไฮไลต์เมนูตาม URL, อัปเดต Badge, Hamburger menu
   Output:  Active nav link + Cart badge
   ============================================================ */
function initNavbar() {
  // ไฮไลต์ตาม URL
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // อัปเดต Cart badge
  updateCartBadge();

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  // Session state: แสดง/ซ่อน Login/Logout
  const session = getSession();
  const loginLink = document.getElementById('nav-login');
  const logoutBtn = document.getElementById('nav-logout');
  const adminLinks = document.querySelectorAll('a[href="admin.html"]');
  if (session) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutBtn) { logoutBtn.style.display = 'flex'; }
  } else {
    if (logoutBtn) logoutBtn.style.display = 'none';
  }

  adminLinks.forEach(link => {
    const canSee = isAdminSession(session);
    const li = link.closest('li');
    if (li) li.style.display = canSee ? '' : 'none';
    else link.style.display = canSee ? '' : 'none';
  });

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
      showToast('info', 'ออกจากระบบแล้ว', '');
      setTimeout(() => window.location.href = 'index.html', 800);
    });
  }
}

/* ============================================================
   13. FORMAT HELPERS
   ============================================================ */

/** แปลงตัวเลขเป็นสกุลเงินไทย */
function formatCurrency(amount) {
  return '฿' + Number(amount).toLocaleString('th-TH');
}

/** แปลง timestamp เป็นวันที่ไทย */
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/* ============================================================
   14. PAGE ROUTER — เรียกฟังก์ชันตาม URL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  ensureDefaultUsers();
  initNavbar();

  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '')        initHomePage();
  else if (page === 'product.html')                initProductPage();
  else if (page === 'cart.html')                   initCartPage();
  else if (page === 'checkout.html')               initCheckoutPage();
  else if (page === 'login.html')                  initLoginPage();
  else if (page === 'register.html')               initRegisterPage();
  else if (page === 'admin.html')                  initAdminPage();
  else if (page === 'orders.html')                 initOrdersPage();
});


/* ============================================================
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE FUNCTIONS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ============================================================ */

/* ============================================================
   HOME PAGE
   Input:  Trade card click / Category filter button / Search input
   Process: กรองสินค้าตาม trade หรือ category → render grid
   Output:  Trade selector + Product card grid
   ============================================================ */
function initHomePage() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const CATEGORY_VISIBLE_COUNT = 14;
  let currentTrade    = 'all';   // trade ID ที่เลือก
  let currentCategory = 'all';   // category filter
  let categoryExpanded = false;

  // ─ Render Trade Cards ─
  renderTradeCards();

  // ─ Trade Card Click ─
  const tradeSection = document.getElementById('trade-section');
  if (tradeSection) {
    tradeSection.addEventListener('click', (e) => {
      const card = e.target.closest('.trade-card');
      if (!card) return;
      document.querySelectorAll('.trade-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentTrade    = card.dataset.trade;
      currentCategory = 'all';
      categoryExpanded = false;
      renderCategoryFilter(currentTrade, categoryExpanded, currentCategory, CATEGORY_VISIBLE_COUNT);
      renderProductGrid(currentTrade, 'all');
      // Scroll ไปหน้า product
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ─ Category Filter Click ─
  const filterBar = document.getElementById('filter-bar');
  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-action="toggle-categories"]');
      if (toggleBtn) {
        categoryExpanded = !categoryExpanded;
        renderCategoryFilter(currentTrade, categoryExpanded, currentCategory, CATEGORY_VISIBLE_COUNT);
        return;
      }

      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      currentCategory = btn.dataset.cat;
      renderCategoryFilter(currentTrade, categoryExpanded, currentCategory, CATEGORY_VISIBLE_COUNT);
      renderProductGrid(currentTrade, currentCategory);
    });
  }

  // ─ Search input ─
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderProductGrid(currentTrade, currentCategory, searchInput.value.trim());
    });
  }

  // Initial render
  renderCategoryFilter('all', categoryExpanded, currentCategory, CATEGORY_VISIBLE_COUNT);
  renderProductGrid('all', 'all');
}

/** Render Trade Cards Section */
function renderTradeCards() {
  const container = document.getElementById('trade-cards');
  if (!container) return;

  container.innerHTML = TRADES.map(t => `
    <div class="trade-card" data-trade="${t.id}" style="--trade-color:${t.color};--trade-bg:${t.colorLight}">
      <div class="trade-card__icon">${t.icon}</div>
      <div class="trade-card__name">${t.name}</div>
      <div class="trade-card__tools">${t.tools}</div>
    </div>
  `).join('');
}

/** สร้าง Category filter ตาม trade ที่เลือก */
function renderCategoryFilter(tradeId, expanded = false, activeCategory = 'all', visibleCount = 14) {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;

  const products = getProducts();
  const tradeProducts = tradeId === 'all'
    ? products
    : products.filter(p => p.trades && p.trades.includes(tradeId));

  const categories = ['all', ...new Set(tradeProducts.map(p => p.category))];
  let visibleCategories = expanded ? categories : categories.slice(0, visibleCount);

  if (!expanded && activeCategory !== 'all' && !visibleCategories.includes(activeCategory) && categories.includes(activeCategory)) {
    visibleCategories = [...visibleCategories, activeCategory];
  }

  const categoryButtons = visibleCategories.map(cat => `
    <button class="filter-btn ${cat === 'all' ? 'active' : ''}" data-cat="${escapeHTML(cat)}">
      ${cat === 'all' ? '🔹 ทั้งหมด' : escapeHTML(cat)}
    </button>
  `).join('');

  const toggleButton = categories.length > visibleCount
    ? `<button class="filter-toggle" data-action="toggle-categories">${expanded ? '▲ แสดงน้อยลง' : '▼ ดูหมวดหมู่เพิ่มเติม'}</button>`
    : '';

  filterBar.innerHTML = categoryButtons + toggleButton;

  // Sync active state with current category
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === activeCategory);
  });
}

/** วาด Product Card Grid
    Input:  tradeId ('all' หรือ trade ID), category, searchQuery
    Process: กรองตาม trade → กรองตาม category → กรองตาม keyword
    Output:  Grid ของ Product Cards
*/
function renderProductGrid(tradeId = 'all', category = 'all', searchQuery = '') {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const products = getProducts();
  let filtered = products;

  // กรองตาม trade
  if (tradeId !== 'all') {
    filtered = filtered.filter(p => p.trades && p.trades.includes(tradeId));
  }
  // กรองตาม category
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  // กรองตาม keyword search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // อัปเดต counter
  const counter = document.getElementById('product-count');
  if (counter) counter.textContent = `${filtered.length} รายการ`;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="icon">📦</div>
      <h3>ไม่พบสินค้า</h3>
      <p>ลองเปลี่ยนหมวดหมู่หรือค้นหาด้วยคำอื่น</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
}

/** สร้าง HTML ของ Product Card พร้อม Trade Tags */
function createProductCard(p) {
  const stockClass = p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : '';
  const stockText  = p.stock === 0 ? '❌ สินค้าหมด' : p.stock <= 5 ? `⚠️ เหลือ ${p.stock} ชิ้น` : `✅ มีสินค้า ${p.stock} ชิ้น`;

  // สร้าง Trade Tag สูงสุด 3 อัน
  const tradeTags = (p.trades || []).slice(0, 3).map(tid => {
    const t = TRADES.find(tr => tr.id === tid);
    return t ? `<span class="trade-tag" style="background:${t.colorLight};color:${t.color}">${t.icon} ${t.name}</span>` : '';
  }).join('');

  return `
    <div class="card product-card fade-in">
      <div class="product-card__img-placeholder">${p.emoji || '🔧'}</div>
      <div class="product-card__body">
        <div class="product-card__category">${escapeHTML(p.category)}</div>
        <div class="product-card__name">${escapeHTML(p.name)}</div>
        ${tradeTags ? `<div class="trade-tags">${tradeTags}</div>` : ''}
        <div class="product-card__price">
          ${formatCurrency(p.price)}
          ${p.originalPrice ? `<span>${formatCurrency(p.originalPrice)}</span>` : ''}
        </div>
        <div class="product-card__stock ${stockClass}">${stockText}</div>
      </div>
      <div class="product-card__footer">
        <a href="product.html?id=${p.id}" class="btn btn-primary btn-block">
          🔍 ดูรายละเอียด
        </a>
      </div>
    </div>
  `;
}


/* ============================================================
   PRODUCT DETAIL PAGE
   Input:  URL ?id=X
   Process: ดึง id จาก URL → หา product → render detail
   Output:  หน้าแสดงรายละเอียดสินค้า พร้อมปุ่ม Add to Cart
   ============================================================ */
function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const container = document.getElementById('product-detail');

  if (!id || !container) return;

  const product = getProductById(id);
  if (!product) {
    container.innerHTML = `<div class="empty-state"><div class="icon">😕</div><h3>ไม่พบสินค้า</h3><a href="index.html" class="btn btn-primary" style="margin-top:16px">กลับหน้าแรก</a></div>`;
    return;
  }

  // อัปเดต Breadcrumb
  const bc = document.getElementById('breadcrumb-name');
  if (bc) bc.textContent = product.name;

  // Render
  const tradeTags = (product.trades || []).map(tid => {
    const t = TRADES.find(tr => tr.id === tid);
    return t ? `<span class="trade-tag" style="background:${t.colorLight};color:${t.color};font-size:.78rem;padding:4px 10px">${t.icon} ${t.name}</span>` : '';
  }).join('');

  container.innerHTML = `
    <div class="product-detail__gallery">${product.emoji || '🔧'}</div>
    <div class="product-detail__info">
      <div class="product-detail__category">${escapeHTML(product.category)}</div>
      <h1 class="product-detail__name">${escapeHTML(product.name)}</h1>
      ${tradeTags ? `<div class="trade-tags" style="margin:4px 0">${tradeTags}</div>` : ''}
      <div class="product-detail__price">
        ${formatCurrency(product.price)}
        ${product.originalPrice ? `<span class="original">${formatCurrency(product.originalPrice)}</span>` : ''}
      </div>
      <p class="product-detail__desc">${escapeHTML(product.description || '')}</p>
      
      <div class="product-detail__meta">
        <div class="meta-row"><span class="meta-label">แบรนด์</span><span class="meta-value">${escapeHTML(product.brand || '-')}</span></div>
        <div class="meta-row"><span class="meta-label">การรับประกัน</span><span class="meta-value">${escapeHTML(product.warranty || '-')}</span></div>
        <div class="meta-row"><span class="meta-label">น้ำหนัก</span><span class="meta-value">${escapeHTML(product.weight || '-')}</span></div>
        <div class="meta-row"><span class="meta-label">สต็อก</span>
          <span class="meta-value ${product.stock <= 5 ? 'product-card__stock low' : ''}">
            ${product.stock > 0 ? `✅ ${product.stock} ชิ้น` : '❌ สินค้าหมด'}
          </span>
        </div>
      </div>

      ${product.stock > 0 ? `
        <div class="qty-input-group">
          <label style="font-weight:600;font-size:.9rem">จำนวน:</label>
          <div class="qty-input">
            <button id="qty-minus">−</button>
            <input type="number" id="qty-val" value="1" min="1" max="${product.stock}">
            <button id="qty-plus">+</button>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" id="add-to-cart-btn">
          🛒 เพิ่มลงตะกร้า
        </button>
      ` : `
        <button class="btn btn-outline btn-lg" disabled>❌ สินค้าหมด</button>
      `}
    </div>
  `;

  // Qty controls
  const qtyInput = document.getElementById('qty-val');
  document.getElementById('qty-minus')?.addEventListener('click', () => {
    if (qtyInput.value > 1) qtyInput.value = Number(qtyInput.value) - 1;
  });
  document.getElementById('qty-plus')?.addEventListener('click', () => {
    if (Number(qtyInput.value) < product.stock) qtyInput.value = Number(qtyInput.value) + 1;
  });

  // Add to Cart
  document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
    const qty = parseInt(qtyInput.value);
    const success = addToCart(product.id, qty);
    if (success) {
      showToast('success', 'เพิ่มลงตะกร้าแล้ว', `${product.name} x${qty}`);
    }
  });
}


/* ============================================================
   CART PAGE
   Input:  LocalStorage cart data
   Process: render cart items, เพิ่ม/ลดจำนวน, คำนวณราคา
   Output:  Cart table + Order summary
   ============================================================ */
function initCartPage() {
  const cartContainer = document.getElementById('cart-container');
  if (cartContainer) {
    cartContainer.addEventListener('click', handleCartAction);
  }
  renderCart();
}

function handleCartAction(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;
  const id = Number(target.dataset.id);
  if (!action || !id) return;

  if (action === 'minus') {
    const item = getCart().find(i => i.productId === id);
    if (item) updateCartQty(id, item.quantity - 1);
  } else if (action === 'plus') {
    const item = getCart().find(i => i.productId === id);
    const product = getProductById(id);
    if (item && product && item.quantity < product.stock) {
      updateCartQty(id, item.quantity + 1);
    } else {
      showToast('warning', 'สต็อกไม่พอ', `มีสินค้าเพียง ${getProductById(id)?.stock} ชิ้น`);
      return;
    }
  } else if (action === 'remove') {
    removeFromCart(id);
    showToast('info', 'ลบสินค้าออกแล้ว', '');
  }

  renderCart();
}

function renderCart() {
  const cart = getCart();
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <div class="icon">🛒</div>
        <h3>ตะกร้าว่างเปล่า</h3>
        <p>ยังไม่มีสินค้าในตะกร้า</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:20px">เลือกซื้อสินค้า</a>
      </div>`;
    updateSummary(0);
    return;
  }

  cartContainer.innerHTML = `
    <div class="cart-table">
      <div class="cart-table__head">
        <div>สินค้า</div>
        <div>ราคา/ชิ้น</div>
        <div>จำนวน</div>
        <div class="col-total">รวม</div>
        <div class="col-action"></div>
      </div>
      ${cart.map(item => {
        const product = getProductById(item.productId);
        if (!product) return '';
        const subtotal = product.price * item.quantity;
        return `
          <div class="cart-item" data-id="${product.id}">
            <div class="cart-item__info">
              <div class="cart-item__img">${product.emoji || '🔧'}</div>
              <div>
                <div class="cart-item__name">${product.name}</div>
                <div class="cart-item__cat">${product.category}</div>
              </div>
            </div>
            <div class="cart-price">${formatCurrency(product.price)}</div>
            <div>
              <div class="qty-control">
                <button class="qty-btn" data-action="minus" data-id="${product.id}">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" data-action="plus" data-id="${product.id}">+</button>
              </div>
            </div>
            <div class="cart-price cart-price-total">${formatCurrency(subtotal)}</div>
            <button class="btn-remove" data-action="remove" data-id="${product.id}" title="ลบสินค้า">🗑️</button>
          </div>`;
      }).join('')}
    </div>`;

  // คำนวณราคารวม
  const total = calculateTotal();
  updateSummary(total);
}

/** อัปเดต Order Summary panel */
function updateSummary(total) {
  const shipping = total > 0 ? 0 : 0; // Free shipping
  const grandTotal = total + shipping;

  document.getElementById('summary-subtotal').textContent = formatCurrency(total);
  document.getElementById('summary-shipping').textContent = total > 0 ? 'ฟรี' : '-';
  document.getElementById('summary-total').textContent = formatCurrency(grandTotal);

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.disabled = total === 0;
}


/* ============================================================
   CHECKOUT PAGE
   Input:  Shipping address, payment method selection
   Process: ตรวจสอบ stock → generateOrderID → บันทึก Order → ลด stock → redirect
   Output:  Order บันทึกใน LocalStorage, redirect ไป orders.html
   ============================================================ */
function initCheckoutPage() {
  // แสดงรายการสินค้าในตะกร้า
  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderCheckoutItems();

  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const address    = document.getElementById('shipping-address').value.trim();
    const city       = document.getElementById('shipping-city').value.trim();
    const phone      = document.getElementById('shipping-phone').value.trim();
    const payment    = document.querySelector('input[name="payment"]:checked')?.value;

    // Validate
    let hasError = false;
    if (!address) { setFieldError('shipping-address', 'กรุณากรอกที่อยู่'); hasError = true; }
    else setFieldError('shipping-address', '');
    if (!city)    { setFieldError('shipping-city',    'กรุณากรอกจังหวัด');  hasError = true; }
    else setFieldError('shipping-city', '');
    if (!phone || phone.length < 9) { setFieldError('shipping-phone', 'กรุณากรอกเบอร์โทร');  hasError = true; }
    else setFieldError('shipping-phone', '');
    if (!payment) { showToast('warning', 'กรุณาเลือกวิธีชำระเงิน', ''); hasError = true; }

    if (hasError) return;

    // ตรวจสอบ Stock
    const stockCheck = checkStock();
    if (!stockCheck.ok) {
      openModal('stock-error-modal');
      const stockErrors = document.getElementById('stock-errors');
      if (stockErrors) {
        stockErrors.innerHTML = stockCheck.errors.map(err => `<li>${escapeHTML(err)}</li>`).join('');
      }
      return;
    }

    // แสดง Loading animation
    showLoading('กำลังบันทึกคำสั่งซื้อ...');

    // จำลองการประมวลผล (ใน Production จะ POST ไป API)
    await new Promise(r => setTimeout(r, 2000));

    // สร้าง Order
    const orderId = generateOrderID();
    const orderItems = cart.map(item => {
      const p = getProductById(item.productId);
      return { productId: item.productId, name: p?.name, qty: item.quantity, price: p?.price, emoji: p?.emoji };
    });

    const order = {
      id: orderId,
      items: orderItems,
      total: calculateTotal(),
      shipping: { address, city, phone },
      userId: getSession()?.id || null,
      userEmail: getSession()?.email || null,
      payment,
      status: 'success',
      createdAt: new Date().toISOString()
    };

    saveOrder(order);
    deductStock();
    saveCart([]);  // เคลียร์ตะกร้า

    hideLoading();

    // Redirect ไปหน้า Success
    window.location.href = `orders.html?success=${orderId}`;
  });
}

/** Render รายการสินค้าใน Checkout */
function renderCheckoutItems() {
  const cart = getCart();
  const container = document.getElementById('checkout-items');
  if (!container) return;

  let total = 0;
  container.innerHTML = cart.map(item => {
    const p = getProductById(item.productId);
    if (!p) return '';
    const subtotal = p.price * item.quantity;
    total += subtotal;
    return `
      <div class="checkout-item">
        <div class="checkout-item__img">${p.emoji || '🔧'}</div>
        <div class="checkout-item__info">
          <div class="checkout-item__name">${p.name}</div>
          <div class="checkout-item__qty">x${item.quantity}</div>
        </div>
        <div class="checkout-item__price">${formatCurrency(subtotal)}</div>
      </div>`;
  }).join('');

  const summaryTotal = document.getElementById('co-total');
  if (summaryTotal) summaryTotal.textContent = formatCurrency(total);
}


/* ============================================================
   LOGIN PAGE
   Input:  Email, Password
   Process: validateLoginForm → loginUser → session → redirect
   Output:  Session ใน LocalStorage / Error message
   ============================================================ */
function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;

  // ถ้า Login แล้ว redirect
  if (getSession()) {
    window.location.href = 'index.html';
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!validateLoginForm(email, password)) return;

    const result = loginUser({ email, password });
    if (result.ok) {
      showToast('success', `ยินดีต้อนรับ, ${result.user.name}!`, 'เข้าสู่ระบบสำเร็จ');
      setTimeout(() => window.location.href = 'index.html', 1000);
    } else {
      showToast('error', 'เข้าสู่ระบบไม่สำเร็จ', result.message);
      setFieldError('login-email', result.message);
    }
  });

  // Demo login fill
  document.getElementById('demo-fill')?.addEventListener('click', () => {
    document.getElementById('login-email').value = 'demo@toolseasy.th';
    document.getElementById('login-password').value = 'demo1234';
  });
}


/* ============================================================
   REGISTER PAGE
   Input:  Name, Email, Password, Confirm Password
   Process: validateRegisterForm → registerUser → auto login
   Output:  User ใน LocalStorage / Error messages
   ============================================================ */
function initRegisterPage() {
  const form = document.getElementById('register-form');
  if (!form) return;

  // Auto-create demo user ถ้ายังไม่มี
  ensureDefaultUsers();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name     = document.getElementById('reg-name').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm  = document.getElementById('reg-confirm').value;

    if (!validateRegisterForm(name, email, password, confirm)) return;

    const result = registerUser({ name, email, password });
    if (result.ok) {
      showToast('success', 'ลงทะเบียนสำเร็จ!', 'กำลังพาไปยังหน้าเข้าสู่ระบบ');
      setTimeout(() => window.location.href = 'login.html', 1200);
    } else {
      showToast('error', 'ลงทะเบียนไม่สำเร็จ', result.message);
      setFieldError('reg-email', result.message);
    }
  });
}


/* ============================================================
   ADMIN PAGE
   Input:  Product form fields, edit/delete buttons
   Process: CRUD operations บน LocalStorage
   Output:  Updated product list, Toast notifications
   ============================================================ */
function initAdminPage() {
  const session = getSession();
  if (!isAdminSession(session)) {
    showToast('warning', 'ไม่มีสิทธิ์เข้าถึงหน้านี้', 'กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบ');
    setTimeout(() => { window.location.href = 'login.html'; }, 900);
    return;
  }

  renderAdminTable();

  const form = document.getElementById('product-form');
  const cancelBtn = document.getElementById('cancel-edit');
  let editingId = null;

  // Submit form
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name:          document.getElementById('p-name').value.trim(),
      category:      document.getElementById('p-category').value.trim(),
      price:         Number(document.getElementById('p-price').value),
      originalPrice: Number(document.getElementById('p-original').value) || null,
      stock:         Number(document.getElementById('p-stock').value),
      emoji:         document.getElementById('p-emoji').value.trim() || '🔧',
      description:   document.getElementById('p-desc').value.trim(),
      brand:         document.getElementById('p-brand').value.trim(),
      warranty:      document.getElementById('p-warranty').value.trim(),
    };

    const invalidPrice = !Number.isFinite(data.price) || data.price <= 0;
    const invalidStock = !Number.isFinite(data.stock) || data.stock < 0;
    if (!data.name || !data.category || invalidPrice || invalidStock) {
      showToast('warning', 'กรอกข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    if (editingId) {
      updateProduct(editingId, data);
      showToast('success', 'แก้ไขสินค้าสำเร็จ', data.name);
      editingId = null;
      document.getElementById('form-title').textContent = '➕ เพิ่มสินค้าใหม่';
      cancelBtn.style.display = 'none';
    } else {
      addProduct(data);
      showToast('success', 'เพิ่มสินค้าสำเร็จ', data.name);
    }

    form.reset();
    renderAdminTable();
  });

  // Cancel edit
  cancelBtn?.addEventListener('click', () => {
    editingId = null;
    form.reset();
    document.getElementById('form-title').textContent = '➕ เพิ่มสินค้าใหม่';
    cancelBtn.style.display = 'none';
  });

  // Edit/Delete via delegation
  document.getElementById('admin-table-body')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = Number(btn.dataset.id);

    if (btn.dataset.action === 'edit') {
      const p = getProductById(id);
      if (!p) return;
      document.getElementById('p-name').value        = p.name;
      document.getElementById('p-category').value    = p.category;
      document.getElementById('p-price').value       = p.price;
      document.getElementById('p-original').value    = p.originalPrice || '';
      document.getElementById('p-stock').value       = p.stock;
      document.getElementById('p-emoji').value       = p.emoji || '';
      document.getElementById('p-desc').value        = p.description || '';
      document.getElementById('p-brand').value       = p.brand || '';
      document.getElementById('p-warranty').value    = p.warranty || '';
      editingId = id;
      document.getElementById('form-title').textContent = '✏️ แก้ไขสินค้า';
      cancelBtn.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (btn.dataset.action === 'delete') {
      openModal('delete-modal');
      document.getElementById('confirm-delete').dataset.id = id;
    }
  });

  document.getElementById('confirm-delete')?.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);
    deleteProduct(id);
    closeModal('delete-modal');
    showToast('info', 'ลบสินค้าแล้ว', '');
    renderAdminTable();
  });
}

function renderAdminTable() {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;
  const products = getProducts();

  tbody.innerHTML = products.map(p => `
    <tr>
      <td><div class="product-thumb">${p.emoji || '🔧'}</div></td>
      <td><strong>${escapeHTML(p.name)}</strong><br><small style="color:var(--gray-light)">${escapeHTML(p.category)}</small></td>
      <td>${formatCurrency(p.price)}</td>
      <td>
        <span class="${p.stock === 0 ? 'status-failed' : p.stock <= 5 ? 'status-pending' : 'status-success'} order-status">
          ${p.stock}
        </span>
      </td>
      <td>
        <div class="admin-actions">
          <button class="btn btn-sm btn-outline" data-action="edit" data-id="${p.id}">✏️</button>
          <button class="btn btn-sm btn-danger" data-action="delete" data-id="${p.id}">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}


/* ============================================================
   ORDERS PAGE
   Input:  URL ?success=ORD-XXXX (optional), LocalStorage orders
   Process: ตรวจสอบ URL param → แสดง success card หรือ order list
   Output:  Order success card / รายการคำสั่งซื้อทั้งหมด
   ============================================================ */
function initOrdersPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const successId = urlParams.get('success');

  // Success View
  const successView = document.getElementById('success-view');
  const ordersView  = document.getElementById('orders-view');

  if (successId && successView) {
    successView.style.display = 'flex';
    if (ordersView) ordersView.style.display = 'none';
    document.getElementById('success-order-id').textContent = successId;

    // หา order data
    const order = getVisibleOrders().find(o => o.id === successId);
    if (order) {
      document.getElementById('success-total').textContent = formatCurrency(order.total);
      document.getElementById('success-date').textContent = formatDate(order.createdAt);
    }
  } else {
    if (successView) successView.style.display = 'none';
    if (ordersView)  ordersView.style.display  = 'block';
    renderOrdersTable();
  }
}

function renderOrdersTable() {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  const orders = getVisibleOrders();
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--gray-light)">ยังไม่มีประวัติคำสั่งซื้อ</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><code style="background:#EEF2FF;padding:3px 8px;border-radius:6px;font-weight:700;color:var(--navy)">${o.id}</code></td>
      <td>${formatDate(o.createdAt)}</td>
      <td>${o.items?.length || 0} รายการ</td>
      <td><strong>${formatCurrency(o.total)}</strong></td>
      <td>
        <span class="order-status status-${o.status === 'success' ? 'success' : 'pending'}">
          ${o.status === 'success' ? '✅ สำเร็จ' : '⏳ รอดำเนินการ'}
        </span>
      </td>
    </tr>
  `).join('');
}

function getVisibleOrders() {
  const session = getSession();
  const orders = getOrders();

  if (isAdminSession(session)) return orders;
  if (!session) return [];

  return orders.filter(o => o.userId === session.id || o.userEmail === session.email);
}
