const headerStyles = {
  container: {
    backgroundColor: "divider",

    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",

    width: "100%",
    height: "3.75rem",

    marginBottom: 4,
    marginLeft: 0,
    marginRight: 0,

    padding: "0 !important",
  },
  centerContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  titleName: {
    "& > a": {
      textDecoration: "none",
      color: "inherit",
    },
  },
  menuContainer: {
    display: "flex",
    // justifyContent:"center",
    alignItems: "center",
  },
  menuTitles: {
    "& > a": {
      textDecoration: "none",
      color: "inherit",
      marginRight: 2,
    },
  },
  avatar: {
    marginRight: 2,
  },
};

export default headerStyles;
