import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import EmailForm from "./EmailForm";
import PasswordForm from "./PasswordForm";
import NameForm from "./NameForm";
import Message from "./Message";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return [
        "Enter a valid Email",
        "Enter your Name",
        "Create a Secure Password",
    ];
}

function getStepContent(stepIndex, back, next, steps, reset, data, setdata) {
    switch (stepIndex) {
        case 0:
            return (
                <EmailForm
                    stepIndex={stepIndex}
                    data={data}
                    setdata={setdata}
                    back={back}
                    next={next}
                    steps={steps}
                />
            );
        case 1:
            return (
                <NameForm
                    stepIndex={stepIndex}
                    data={data}
                    setdata={setdata}
                    back={back}
                    next={next}
                    steps={steps}
                />
            );
        case 2:
            return (
                <PasswordForm
                    stepIndex={stepIndex}
                    data={data}
                    setdata={setdata}
                    back={back}
                    next={next}
                    steps={steps}
                    reset={reset}
                />
            );
        case 3:
            return <Message data={data} />;
        default:
            return "Unknown stepIndex";
    }
}

function SignupStepper() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [data, setdata] = React.useState({});

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setdata({});
        setActiveStep(0);
    };

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div className="px-4">
                {getStepContent(
                    activeStep,
                    handleBack,
                    handleNext,
                    steps,
                    handleReset,
                    data,
                    setdata
                )}
            </div>
        </div>
    );
}

export default SignupStepper;
