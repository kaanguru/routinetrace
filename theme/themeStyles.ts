const themeStyles = {
  lightColors: {
    primary: "#ff006e",
    secondary: "#6915E0",
    success: "#8AC926",
    warning: "#FF0010",
    white: "#FFFAEB",
    black: "#00173D",
    grey0: "#FED5C2",
    grey1: "#FDBA9B",
    grey2: "#FC9E73",
    grey3: "#FB7537",
    grey4: "#F04F05",
    grey5: "#FFC933",
    greyOutline: "#FD905E",
    background: "#FFFCF4",
  },
  darkColors: {
    primary: "#ff117e",
    secondary: "#3E0C83",
    success: "#9AD936",
    warning: "#FF0010",
    white: "#00183D",
    black: "#FFC933",
    grey0: "#FFD35C",
    grey1: "#FFDE85",
    grey2: "#FFE9AD",
    grey3: "#FFE9AD",
    grey4: "#FFEFC2",
    grey5: "#FFF4D6",
    greyOutline: "#FD905E",
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
      inputContainerStyle: {
        borderRadius: 10,
        borderWidth: 2,
        borderBottomWidth: 2,
        borderColor: "#FD590D",
        backgroundColor: "#FFEFC2AA",
        paddingHorizontal: 10,
      },
      inputStyle: {
        color: "#00173D",
      },
      containerStyle: {
        marginVertical: 2,
      },
    },
    Text: {
      style: {
        fontFamily: "Ubuntu_400Regular",
      },
      h1Style: {
        fontFamily: "DelaGothicOne_400Regular",
        fontSize: 36,
      },
      h2Style: {
        fontFamily: "DelaGothicOne_400Regular",
        fontSize: 30,
      },
      h3Style: {
        fontFamily: "DelaGothicOne_400Regular",
        fontSize: 24,
      },
      h4Style: {
        fontFamily: "DelaGothicOne_400Regular",
        fontSize: 18,
      },
    },
  },
};
export default themeStyles;
