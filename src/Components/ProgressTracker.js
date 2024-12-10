import React from "react";
import { Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import { styled } from "@mui/system";

// Custom styling for the connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderTopWidth: 2,
    borderColor: "#000", // Black color for connector
  },
}));

// Custom styling for the step labels
const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-iconContainer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiStepLabel-icon": {
    color: "#000", // Black for active icons
    backgroundColor: "#fff",
    borderRadius: "50%",
    border: "2px solid #000",
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiStepLabel-label": {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: "14px",
    color: "#000",
    textAlign: "center",
  },
}));



export default function ProgressTracker(props) {
  const steps = props.steps;
  const activeStep = props.activeStep;
  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep} // Set the current step here
        connector={<CustomConnector />}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <CustomStepLabel>
              {label}
            </CustomStepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
