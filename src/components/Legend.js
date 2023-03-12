import React from "react";

const Legend = ({ legendColors }) => {

    const values = legendColors.filter((_, i) => i % 2 === 0);
    const colors = legendColors.filter((_, i) => i % 2 === 1);

    return (
        <div className="legend-wrapper">
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