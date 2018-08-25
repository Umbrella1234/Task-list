import React from "react";
import { Row, Col, ListGroup } from "reactstrap";
import { Pages } from "./Pages";

export const PaginatedList = ({
  setActivePage,
  items,
  renderItems,
  totalPages,
  activePageNumber
}) => (
  <div>
    <Row>
      <Col xs={12}>
        <ListGroup>{items.map(renderItems)}</ListGroup>
      </Col>
    </Row>
    <br />
    <Row>
      <Col xs={12}>
        <Pages
          activePageNumber={activePageNumber}
          totalPages={totalPages}
          setActivePage={setActivePage}
        />
      </Col>
    </Row>
  </div>
);
