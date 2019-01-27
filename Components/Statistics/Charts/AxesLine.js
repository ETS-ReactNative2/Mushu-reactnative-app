import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { View } from 'react-native';
import { XAxis, YAxis } from 'react-native-svg-charts';
import Line from './Line';
import { buildDataArray } from "../Functions";

class AxesLine extends Component {

    render() {
        const axesSvg = {
            fontSize: 8,
            fill: 'grey',
            fontWeight: 'bold',
        };
        const xAxisSvg = {...axesSvg, ...{
            rotation: 20,
            originY: 30,
            y: 5,
        }};
        const verticalContentInset = { top: 10, bottom: 10 };
        const xAxisHeight = 30;
        return (
            <View style={{ height: 200, padding: 20, flexDirection: 'row' }}>
                <YAxis
                    data={ this.props.data }
                    yAccessor={ ({ item }) => item.value }
                    style={{ marginBottom: xAxisHeight }}
                    contentInset={ verticalContentInset }
                    svg={ axesSvg }
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Line
                        data={ buildDataArray(this.props.data) }
                        color={ this.props.color }
                        contentInset={verticalContentInset}
                    />
                    <XAxis
                        style={{ marginHorizontal: -15, height: xAxisHeight }}
                        data={ this.props.data }
                        svg={ xAxisSvg }
                        formatLabel={value => this.props.data[value].date}
                        xAccessor={ ({ item, index }) => index }
                        contentInset={{ left: 15, right: 30 }}
                    />
                </View>
            </View>
        )
    }

}

AxesLine.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.date,
        value: PropTypes.number,
    })).isRequired,
    color: PropTypes.string.isRequired,
};

export default AxesLine;