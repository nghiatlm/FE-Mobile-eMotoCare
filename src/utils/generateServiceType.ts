export function generateServiceType(type?: string): string {
  if (!type) return '';
  const t = String(type).toUpperCase();
  switch (t) {
    case 'REPAIR_TYPE':
      return 'Sửa chữa';
    case 'MANTENANCE_TYPE':
      return 'Bảo dưỡng';
    case 'WARRANTY_TYPE':
      return 'Bảo hành';
    default:
      return type || '';
  }
}

export default generateServiceType;
