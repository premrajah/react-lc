import React, { Component } from "react";

class SelectItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };
    }

    render() {
        return (
            <>
                <div
                    data-name={item.name}
                    className="row me-2 ms-2 selection-row unselected-row p-3 mb-3">
                    <div className="col-10">
                        <p style={{ fontSize: "16px" }}>
                            {this.props.item.name}
                        </p>
                    </div>
                    <div className="col-2">
                        <NavigateNextIcon />
                    </div>
                </div>
            </>
        );
    }
}

export default SelectItem;
