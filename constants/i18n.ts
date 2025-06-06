export type Language = 'en' | 'af';

export const translations = {
  en: {
    welcome: {
      appName: 'Agrisol Journal',
      title: 'Smart Farming\nStarts Here',
      subtitle: 'Transform your agricultural practices with modern technology and data-driven insights',
      getStarted: 'Get Started',
      scanQr: 'Scan QR Code',
    }
  },
  af: {
    welcome: {
      appName: 'Agrisol Joernaal',
      title: 'Slim Boerdery\nBegin Hier',
      subtitle: 'Transformeer jou landboupraktyke met moderne tegnologie en data-gedrewe insigte',
      getStarted: 'Begin Nou',
      scanQr: 'Skandeer QR Kode',
    }
  }
} as const;