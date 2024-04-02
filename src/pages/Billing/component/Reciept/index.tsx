import { Col, Row, Spin, Spin, Table } from "antd"
import moment from "moment";
import React from "react";
import { useState } from "react";



const Invoices = () => {


    const toCommas = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }


    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rows.length);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const editInvoice = (id) => {
        history.push(`/edit/invoice/${id}`)
    }

    const openInvoice = (id) => {
        history.push(`/invoice/${id}`)
    }

    if (!user) {
        history.push('/login')
    }



    function checkStatus(status) {
        return status === "Partial" ? { border: 'solid 0px #1976d2', backgroundColor: '#baddff', padding: '8px 18px', borderRadius: '20px' }
            : status === "Paid" ? { border: 'solid 0px green', backgroundColor: '#a5ffcd', padding: '8px 18px', borderRadius: '20px' }
                : status === "Unpaid" ? { border: 'solid 0px red', backgroundColor: '#ffaa91', padding: '8px 18px', borderRadius: '20px' }
                    : "red";

    }


    return (
        <div>
            <div style={{ width: '85%', paddingTop: '70px', paddingBottom: '50px', border: 'none' }} >
                <div>
                    <Table className={classes.table} aria-label="custom pagination table">

                        <div>//TableHead
                            <Row>
                                <Col style={headerStyle}>Number</Col>
                                <Col style={headerStyle}>Client</Col>
                                <Col style={headerStyle}>Amount</Col>
                                <Col style={headerStyle}>Due Date</Col>
                                <Col style={headerStyle}>Status</Col>
                                <Col style={headerStyle}>Edit</Col>
                                <Col style={headerStyle}>Delete</Col>
                            </Row>
                        </div>

                        <Row>
                            {(rowsPerPage > 0
                                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : rows
                            ).map((row) => (
                                <Row key={row._id} style={{ cursor: 'pointer' }} >
                                    <Col style={tableStyle} onClick={() => openInvoice(row._id)}> {row?.invoiceNumber} </Col>
                                    <Col style={tableStyle} onClick={() => openInvoice(row._id)} > {row?.client.name} </Col>
                                    <Col style={tableStyle} onClick={() => openInvoice(row._id)} >{row?.currency} {row?.total ? toCommas(row?.total) : row?.total} </Col>
                                    <Col style={tableStyle} onClick={() => openInvoice(row._id)} > {moment(row?.dueDate).fromNow()} </Col>
                                    <Col style={tableStyle} onClick={() => openInvoice(row._id)} > <button style={checkStatus(row?.status)}>{row?.status}</button></Col>

                                    {/* <Col style={{ ...tableStyle, width: '10px' }}>
                                        <IconButton onClick={() => editInvoice(row._id)}>
                                            <BorderColorIcon style={{ width: '20px', height: '20px' }} />
                                        </IconButton>
                                    </Col>
                                    <Col style={{ ...tableStyle, width: '10px' }}>
                                        <IconButton onClick={() => dispatch(deleteInvoice(row._id, openSnackbar))}>
                                            <DeleteOutlineRoundedIcon style={{ width: '20px', height: '20px' }} />
                                        </IconButton>
                                    </Col> */}
                                </Row>
                            ))}

                            {emptyRows > 0 && (
                                <Row style={{ height: 53 * emptyRows }}>
                                    <Col colSpan={6} />
                                </Row>
                            )}
                        </Row>
                        {/* <TableFooter>
                            <Row>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={6}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </Row>
                        </TableFooter> */}
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default Invoices