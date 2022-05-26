import React, {Component} from 'react';
import {read, utils} from 'xlsx';

export class OutTable extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className={this.props.className}>
                <table className={this.props.tableClassName}>
                    <tbody>
                        <tr>
                            {this.props.withZeroColumn && !this.props.withoutRowNum && <th className={this.props.tableHeaderRowClass || ""}></th>}
                            {
                                this.props.columns.map((c) =>
                                    <th key={c.key} className={c.key === -1 ? this.props.tableHeaderRowClass : ""}>{c.key === -1 ? "" : c.name}</th>
                                )
                            }
                        </tr>
                        {this.props.data.map((r, i) => <tr key={i}>
                            {!this.props.withoutRowNum && <td key={i} className={this.props.tableHeaderRowClass}>{this.props.renderRowNum ? this.props.renderRowNum(r, i) : i}</td>}
                            {this.props.columns.map(c => <td key={c.key}>{r[c.key]}</td>)}
                        </tr>)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export function ExcelRenderer(file, callback) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = function (e) {
            /* Parse data */
            const bstr = e.target.result;
            const wb = read(bstr, {type: rABS ? "binary" : "array"});

            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            /* Convert array of arrays */
            const json = utils.sheet_to_json(ws, {header: 1});
            const cols = make_cols(ws["!ref"]);

            const data = {rows: json, cols: cols};

            resolve(data);
            return callback(null, data);
        };
        if (file && rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
    });
}

function make_cols(refstr) {
    const o = [],
        C = utils.decode_range(refstr).e.c + 1;
    for (let i = 0; i < C; ++i) {
        o[i] = {name: utils.encode_col(i), key: i};
    }
    return o;
}
