import React from "react";
import { Media, ListGroupItem, Button } from "reactstrap";
import styled from "styled-components";
import { COMPLETION_STATUSES } from "../common/constants";

const TaskImg = styled(Media)`
  width: 100px;
  height: 100px;
`;

const BodyWrapper = styled.div`
  width: 100%;
  margin-left: 15px;
`;

const StyledMedia = styled(Media)`
  width: 100%;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
`;

const ButtonWrapper = styled.div`
  margin-bottom: 10px;
`;

export const Task = ({
  id,
  username,
  email,
  text,
  image_path,
  status,
  isAdmin,
  onEditTask
}) => {
  const isComplete = status === COMPLETION_STATUSES.complete;
  const oppositeStatus = isComplete
    ? COMPLETION_STATUSES.incomplete
    : COMPLETION_STATUSES.complete;

  return (
    <ListGroupItem color={isComplete ? "success" : "danger"}>
      <Media>
        <Media>
          <TaskImg object src={image_path} alt="Task image" />
        </Media>
        <BodyWrapper>
          <StyledMedia body>
            <Media heading>{username}</Media>
            <div>email: {email}</div>
            {isAdmin && (
              <ButtonWrapper>
                <Button
                  onClick={() => onEditTask(id, { status: oppositeStatus })}
                  color="primary"
                >
                  {isComplete ? "Set to incomplete" : "Set to complete"}
                </Button>
              </ButtonWrapper>
            )}
            {isAdmin ? (
              <StyledTextarea
                name="text"
                rows="4"
                onBlur={e => onEditTask(id, { text: e.target.value })}
                defaultValue={text}
              />
            ) : (
              <div>{text}</div>
            )}
          </StyledMedia>
        </BodyWrapper>
      </Media>
    </ListGroupItem>
  );
};
