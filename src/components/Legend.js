import React from "react";

const Legend = ({ legendColors }) => {

    const values = legendColors.filter((_, i) => i % 2 === 0);
    const colors = legendColors.filter((_, i) => i % 2 === 1);

    return (
        <div className="legend-wrapper">
            <div className="legend-title" style={{ alignSelf: "center" }}> Max. micrograms per meter³ of PM2.5 </div>
            {values.map((value, i) => {
                return (
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: colors[i] }}></div>
                        <div className="legend-label">{value}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default Legend;