const themeStyles = {
  lightColors: {
    primary: '#ff006e',
    success: '#8AC926',
    Warning: '#FF0010',
    white: '#FFFAEB',
    black: '#00173D',
    background: '#FFFAEB',
  },
  darkColors: {
    primary: '#ff117e',
    success: '#9AD936',
    Warning: '#FF0010',
    white: '#00183D',
    black: '#FFFAEB',
    background: '#051824',
  },
  components: {
    Button: {
      color: '#FFEFC2AA',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#FD590D',
      titleStyle: {
        fontFamily: 'DelaGothicOne_400Regular',
        fontSize: 16,
        color: '#4F10A8',
      },
      containerStyle: {
        margin: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#FD590D',
        backgroundColor: '#FFF4D655',
      },
    },
    Input: {
      containerStyle: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00173D',
      },
    },
  },
};
export default themeStyles;
