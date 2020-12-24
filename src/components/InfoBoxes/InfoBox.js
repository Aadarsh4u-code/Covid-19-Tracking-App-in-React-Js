import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "../InfoBoxes/InfoBox.css";

function InfoBox({ title, active, isRed, cases, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--Red"
      }`}
    >
      <CardContent>
        <Typography color="textSecondary" className="infoBox__title">
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${ !isRed && "infoBox__cases--green"}`}>{cases}</h2>
        <Typography color="textSecondary" className="infoBox__total">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}
export default InfoBox;
