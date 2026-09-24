const paths = {
  dashboard:'M3 13h8V3H3v10Zm10 8h8V3h-8v18ZM3 21h8v-6H3v6Z',
  vendor:'M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4ZM8 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm8 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4ZM8 13c-2.67 0-8 1.34-8 4v3h7v-3c0-1.1.54-2.1 1.45-2.84A10.8 10.8 0 0 0 8 13Z',
  material:'M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6.7 3.35L12 10.9 5.3 7.55 12 4.2Zm-7 5.1 6 3v7.2l-6-3V9.3Zm8 10.2v-7.2l6-3v7.2l-6 3Z',
  purchase:'M7 4h10v3h3v13H4V7h3V4Zm2 0v3h6V4H9Zm-3 8h12v6H6v-6Zm2 2v2h8v-2H8Z',
  report:'M5 3h14v18H5V3Zm3 4v2h8V7H8Zm0 4v2h8v-2H8Zm0 4v2h5v-2H8Z',
  logout:'M10 17l5-5-5-5v3H2v4h8v3Zm10 4H13v-2h5V5h-5V3h7v18Z',
  menu:'M3 6h18M3 12h18M3 18h18', close:'M6 6l12 12M18 6 6 18', arrow:'M9 18l6-6-6-6', refresh:'M20 11a8 8 0 1 0 1 3', check:'M5 12l4 4L19 6', plus:'M12 5v14M5 12h14', search:'m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z'
};
export default function Icon({ name, size=18, stroke=2 }) { const d=paths[name]; return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name==='menu'||name==='close'||name==='arrow'||name==='refresh'||name==='check'||name==='plus'||name==='search'?<path d={d}/>:<path d={d} fill="currentColor" stroke="none"/>}</svg>; }
