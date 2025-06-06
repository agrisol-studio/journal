// Theme definitions for dynamic theming
const themes = {
  melior: {
    colors: {
      primary: {
        main: '#0F2C4C',
        light: '#3B4D63',
        lighter: '#A3B1C6',
        lightest: '#E6EAF0',
      },
      secondary: {
        main: '#E48F3B',
        light: '#F2B97A',
        lighter: '#F8D9B3',
        lightest: '#FDF3E6',
      },
      accent: {
        main: '#DF492C',
        light: '#E97A63',
        lighter: '#F3B3A3',
        lightest: '#FCE6E6',
      },
      neutral: {
        white: '#FFFFFF',
        light: '#F8F9FA',
        dark: '#222B38',
      },
      background: {
        default: '#FFFFFF',
        paper: '#F8F9FA',
      },
      text: {
        primary: '#0F2C4C',
        secondary: '#3B4D63',
        disabled: '#9E9E9E',
        hint: '#9E9E9E',
        lighter: '#A3B1C6',
      },
      divider: '#E6EAF0',
      success: { main: '#4CAF50', light: '#81C784', dark: '#388E3C' },
      warning: { main: '#FF9800', light: '#FFB74D', dark: '#F57C00' },
      error: { main: '#DF492C', light: '#E57373', dark: '#D32F2F' },
      info: { main: '#2196F3', light: '#64B5F6', dark: '#1976D2' },
    },
    fonts: {
      regular: 'Montserrat-Regular',
      medium: 'Montserrat-Medium',
      bold: 'Montserrat-Bold',
      heading: 'Montserrat-Bold',
    },
  },
  agrisol: {
    colors: {
      primary: {
        main: '#005750', // Dark Viridian Green
        light: '#33807A',
        lighter: '#7CA9A6',
        lightest: '#B3C9C7',
      },
      secondary: {
        main: '#B49751', // Solid Gold
        light: '#C7B06A',
        lighter: '#D8C48A',
        lightest: '#E9D8AA',
      },
      accent: {
        main: '#B49751',
        light: '#C7B06A',
        lighter: '#D8C48A',
        lightest: '#E9D8AA',
      },
      neutral: {
        white: '#FFFFFF',
        light: '#FFFDE8', // Off White
        dark: '#222B38',
      },
      background: {
        default: '#FFFDE8',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#005750',
        secondary: '#7CA9A6',
        disabled: '#B3C9C7',
        hint: '#B3C9C7',
        lighter: '#B3C9C7',
      },
      divider: '#E9D8AA',
      success: { main: '#4CAF50', light: '#81C784', dark: '#388E3C' },
      warning: { main: '#FF9800', light: '#FFB74D', dark: '#F57C00' },
      error: { main: '#DF492C', light: '#E57373', dark: '#D32F2F' },
      info: { main: '#2196F3', light: '#64B5F6', dark: '#1976D2' },
    },
    fonts: {
      regular: 'OpenSans-Regular',
      medium: 'OpenSans-SemiBold',
      bold: 'OpenSans-Bold',
      heading: 'BebasNeue-Bold',
    },
  },
  neutral: {
    colors: {
      primary: {
        main: '#222B38', // Deep blue-gray
        light: '#5A6A85',
        lighter: '#B0B8C1',
        lightest: '#E6EAF0',
      },
      secondary: {
        main: '#7B8FA1', // Muted blue
        light: '#A3B1C6',
        lighter: '#D1D8E0',
        lightest: '#F4F6F8',
      },
      accent: {
        main: '#A3B1C6',
        light: '#D1D8E0',
        lighter: '#E6EAF0',
        lightest: '#F4F6F8',
      },
      neutral: {
        white: '#FFFFFF',
        light: '#F8F9FA',
        dark: '#222B38',
      },
      background: {
        default: '#F8F9FA',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#222B38',
        secondary: '#5A6A85',
        disabled: '#B0B8C1',
        hint: '#B0B8C1',
        lighter: '#B0B8C1',
      },
      divider: '#E6EAF0',
      success: { main: '#4CAF50', light: '#81C784', dark: '#388E3C' },
      warning: { main: '#FF9800', light: '#FFB74D', dark: '#F57C00' },
      error: { main: '#DF492C', light: '#E57373', dark: '#D32F2F' },
      info: { main: '#2196F3', light: '#64B5F6', dark: '#1976D2' },
    },
    fonts: {
      regular: 'Montserrat-Regular',
      medium: 'Montserrat-Medium',
      bold: 'Montserrat-Bold',
      heading: 'Montserrat-Bold',
    },
  },
};

export default themes; 