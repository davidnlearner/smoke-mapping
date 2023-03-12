import React from "react";
import { Slider } from '@mui/material';
import { dateConversion } from "../utils/dateUtils";

const ControlBox = ({ datesLength, startYear, currentDate, setCurrentDate }) => {


    const marks = [
        {
            value: 0,
            label: '2006'
        },
        {
            value: 48,
            label: '2010',
        },
        {
            value: 108,
            label: '2015',
        },
        {
            value: 168,
            label: '2020',
        }
    ];

    return (
        <div className="control-box-wrapper">
            < div className="control-box" >
                <Slider size="small" defaultValue={currentDate} min={0} max={datesLength} step={1}
                    marks={marks}
                    valueLabelDisplay="auto" valueLabelFormat={(val) => dateConversion(val, startYear)}
                    aria-label="displayed month slider" getAriaValueText={(val) => dateConversion(val, startYear)}
                    onChange={(e) => { setCurrentDate(e.target.value); }}
                />
            </div >
        </div>
    );
};

export default ControlBox;