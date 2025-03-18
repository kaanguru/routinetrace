const themeStyles = {
  lightColors: {
    primary: "#ff006e",
    secondary: "#6915E0",
    success: "#8AC926",
    warning: "#FF0010",
    white: "#FFFAEB",
    black: "#00173D",
    grey0: "#FFF4D6",
    grey1: "#FFEFC2",
    grey2: "#FFE9AD",
    grey3: "#FFDE85",
    grey4: "#FFD35C",
    grey5: "#FFC933",
    greyOutline: "#bbb",
    background: "#FFFCF4",
  },
  darkColors: {
    primary: "#ff117e",
    secondary: "#3E0C83",
    success: "#9AD936",
    warning: "#FF0010",
    white: "#00183D",
    black: "#FFFAEB",
    background: "#001F52",
  },
  components: {
    Button: {
      color: "#FFEFC2AA",
      titleStyle: {
        fontFamily: "DelaGothicOne_400Regular",
        fontSize: 16,
        color: "#4F10A8",
      },
      containerStyle: {
        margin: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#FD590D",
        backgroundColor: "#FFF4D655",
      },
    },
    Input: {
      containerStyle: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#00173D",
      },
    },
  },
};
export default themeStyles;
