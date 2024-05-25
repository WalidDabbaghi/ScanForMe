module.exports = {
    formate: "A4",
    orientation: "portrait",
    border: "2mm",
  
    header: {
      height: "15mm",
      contents: `<table style="width: 77%;"><tr><td style="text-align: left;">Dabbaghi Walid</td><td style="text-align: right;">Vulnerability Scan Report</td></tr></table>`,
    },
    footer: {
      height: "20mm",
      contents: {
        first: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
        last: "Last Page",
      },
    },
  };
  
